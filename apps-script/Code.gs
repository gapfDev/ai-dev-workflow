const CONFIG = {
  SPREADSHEET_ID: '',
  SHEETS: {
    ORDERS: 'Orders',
    PRODUCTS: 'Products',
    EXPENSES: 'Expenses'
  },
  STATUS: ['Pending', 'Working', 'Baked', 'Delivered', 'Cancelled'],
  TYPE: ['Pickup', 'Delivery'],
  CHANNELS: ['Phone', 'Facebook', 'Square', 'Walk-in'],
  ORDER_HEADERS: [
    'order_id',
    'order_number',
    'customer_name',
    'phone',
    'delivery_date',
    'delivery_time',
    'delivery_at',
    'type',
    'address',
    'web_link',
    'channel',
    'source_notes',
    'items_json',
    'total_amount',
    'status',
    'payment_status',
    'payment_method',
    'deposit_amount',
    'captured_at',
    'updated_at',
    'sync_version',
    'is_legacy'
  ],
  PRODUCT_HEADERS: ['id', 'name', 'price', 'category', 'active'],
  EXPENSE_HEADERS: ['expense_id', 'date', 'category', 'amount', 'description', 'created_at'],
  LATE_THRESHOLD_MINUTES: 15
};

function doGet(e) {
  setup();
  if (e && e.parameter && e.parameter.action) {
    return jsonOutput_(handleGetAction_(e.parameter.action));
  }
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Bakery Ops Board v1')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  setup();
  try {
    const payload = parsePostPayload_(e);
    const action = payload.action || (e && e.parameter && e.parameter.action);
    if (!action) {
      return jsonOutput_(fail_('Missing action'));
    }
    return jsonOutput_(handlePostAction_(action, payload));
  } catch (err) {
    return jsonOutput_(fail_(err.message || String(err)));
  }
}

function setup() {
  const ss = getSpreadsheet_();
  ensureSheetHeaders_(ss, CONFIG.SHEETS.ORDERS, CONFIG.ORDER_HEADERS);
  ensureSheetHeaders_(ss, CONFIG.SHEETS.PRODUCTS, CONFIG.PRODUCT_HEADERS);
  ensureSheetHeaders_(ss, CONFIG.SHEETS.EXPENSES, CONFIG.EXPENSE_HEADERS);
  seedProductsIfEmpty_();
  markLegacyOrders_();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData() {
  return {
    orders: getOrders_(),
    products: getProducts_(),
    expenses: getExpenses_()
  };
}

function parseSquareReceipt(payload) {
  return payload;
}

function handleReceiptParse(payload) {
  return payload;
}

function responseFn(payload) {
  return payload;
}

function handleGetAction_(action) {
  switch (action) {
    case 'getOrders':
      return getOrders_();
    case 'getProducts':
      return getProducts_();
    case 'getExpenses':
      return getExpenses_();
    case 'getData':
      return getData();
    case 'getSpreadsheetInfo':
      return getSpreadsheetInfo_();
    case 'adminRunSmokeTests':
      return adminRunSmokeTests();
    case 'adminMigrateLegacySheetById':
      return adminMigrateLegacySheetById({});
    default:
      return fail_('Unknown GET action: ' + action);
  }
}

function handlePostAction_(action, payload) {
  switch (action) {
    case 'createOrder':
      return createOrder_(payload);
    case 'updateOrderDetails':
      return updateOrderDetails_(payload);
    case 'updateOrderStatus':
      return updateOrderStatus_(payload);
    case 'addExpense':
      return addExpense_(payload);
    case 'adminPrepareEnvironment':
      return adminPrepareEnvironment();
    case 'adminSeedDemoProductsIfEmpty':
      return adminSeedDemoProductsIfEmpty();
    case 'adminMigrateLegacySheetById':
      return adminMigrateLegacySheetById(payload);
    default:
      return fail_('Unknown POST action: ' + action);
  }
}

function createOrder_(payload) {
  const customerName = cleanString_(payload.customer_name);
  const deliveryDate = normalizeDateInput_(payload.delivery_date);
  const orderType = normalizeOrderType_(payload.type || 'Pickup');
  const itemsJson = normalizeItemsJson_(payload.items_json);

  if (!customerName) return fail_('customer_name is required');
  if (!deliveryDate) return fail_('delivery_date is required');
  if (!orderType) return fail_('type must be Pickup or Delivery');
  if (!itemsJson || !hasAtLeastOneItem_(itemsJson)) return fail_('At least one item is required');

  const now = new Date();
  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const orderId = cleanString_(payload.order_id) || ('ORD-' + now.getTime());
  const orderNumber = generateOrderNumber_(sheet, map, now);
  const paymentStatus = normalizePaymentStatus_(payload.payment_status || 'Unpaid');
  const status = normalizeStatus_(payload.status || 'Pending');

  const deliveryTime = normalizeTimeInput_(payload.delivery_time || '');
  const deliveryAt = buildDeliveryAt_(deliveryDate, deliveryTime);
  const totalAmount = getTotalAmount_(itemsJson, payload.total_amount);

  const record = {
    order_id: orderId,
    order_number: orderNumber,
    customer_name: customerName,
    phone: cleanString_(payload.phone),
    delivery_date: deliveryDate,
    delivery_time: deliveryTime,
    delivery_at: deliveryAt,
    type: orderType,
    address: cleanString_(payload.address),
    web_link: cleanString_(payload.web_link),
    channel: normalizeChannel_(payload.channel || ''),
    source_notes: cleanString_(payload.source_notes),
    items_json: JSON.stringify(itemsJson),
    total_amount: totalAmount,
    status: status,
    payment_status: paymentStatus,
    payment_method: cleanString_(payload.payment_method),
    deposit_amount: normalizeNumber_(payload.deposit_amount, ''),
    captured_at: now.toISOString(),
    updated_at: now.toISOString(),
    sync_version: 1,
    is_legacy: false
  };

  sheet.appendRow(objectToRow_(record, CONFIG.ORDER_HEADERS));
  return ok_({
    message: 'Order created',
    order_id: orderId,
    order_number: orderNumber,
    captured_at: record.captured_at
  });
}

function updateOrderDetails_(payload) {
  const orderId = cleanString_(payload.order_id);
  if (!orderId) return fail_('order_id is required');

  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const rowIndex = findRowByOrderId_(sheet, map, orderId);
  if (rowIndex < 2) return fail_('Order not found');

  const lastCol = sheet.getLastColumn();
  const row = sheet.getRange(rowIndex, 1, 1, lastCol).getValues()[0];
  const currentStatus = normalizeStatus_(row[map.status]);
  if (currentStatus === 'Delivered') {
    return fail_('Delivered orders cannot be edited');
  }

  const currentSync = Number(row[map.sync_version] || 1);
  const baseSync = Number(payload.base_sync_version || currentSync);
  const conflict = baseSync !== currentSync;

  const mutable = [
    'customer_name', 'phone', 'delivery_date', 'delivery_time', 'type', 'address', 'web_link',
    'channel', 'source_notes', 'items_json', 'total_amount', 'payment_status',
    'payment_method', 'deposit_amount'
  ];

  mutable.forEach(function (field) {
    if (payload[field] === undefined) return;
    if (field === 'type') {
      const type = normalizeOrderType_(payload[field]);
      if (type) row[map[field]] = type;
      return;
    }
    if (field === 'delivery_date') {
      const d = normalizeDateInput_(payload[field]);
      if (d) row[map[field]] = d;
      return;
    }
    if (field === 'delivery_time') {
      row[map[field]] = normalizeTimeInput_(payload[field]);
      return;
    }
    if (field === 'channel') {
      row[map[field]] = normalizeChannel_(payload[field]);
      return;
    }
    if (field === 'items_json') {
      const items = normalizeItemsJson_(payload[field]);
      if (items && hasAtLeastOneItem_(items)) {
        row[map[field]] = JSON.stringify(items);
        if (payload.total_amount === undefined) {
          row[map.total_amount] = getTotalAmount_(items, '');
        }
      }
      return;
    }
    if (field === 'payment_status') {
      row[map[field]] = normalizePaymentStatus_(payload[field]);
      return;
    }
    if (field === 'total_amount') {
      row[map[field]] = normalizeNumber_(payload[field], row[map[field]]);
      return;
    }
    row[map[field]] = cleanString_(payload[field]);
  });

  const deliveryDate = normalizeDateInput_(row[map.delivery_date]);
  const deliveryTime = normalizeTimeInput_(row[map.delivery_time]);
  row[map.delivery_at] = buildDeliveryAt_(deliveryDate, deliveryTime);
  row[map.updated_at] = new Date().toISOString();
  row[map.sync_version] = currentSync + 1;

  sheet.getRange(rowIndex, 1, 1, lastCol).setValues([row]);
  return ok_({
    message: 'Order updated',
    order_id: orderId,
    sync_version: row[map.sync_version],
    conflict: conflict
  });
}

function updateOrderStatus_(payload) {
  const orderId = cleanString_(payload.order_id);
  const newStatus = normalizeStatus_(payload.status);
  const confirmReactivate = payload.confirm_reactivate === true || payload.confirm_reactivate === 'true';
  if (!orderId) return fail_('order_id is required');
  if (!newStatus) return fail_('status is invalid');

  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const rowIndex = findRowByOrderId_(sheet, map, orderId);
  if (rowIndex < 2) return fail_('Order not found');

  const lastCol = sheet.getLastColumn();
  const row = sheet.getRange(rowIndex, 1, 1, lastCol).getValues()[0];
  const currentStatus = normalizeStatus_(row[map.status]);

  if (currentStatus === 'Delivered') {
    return fail_('Delivered orders cannot change status');
  }
  if (currentStatus === 'Cancelled' && newStatus !== 'Cancelled' && !confirmReactivate) {
    return fail_('Reactivation from Cancelled requires confirmation');
  }
  if (newStatus === 'Delivered' && currentStatus !== 'Baked') {
    return fail_('Only Baked orders can move to Delivered');
  }

  const currentSync = Number(row[map.sync_version] || 1);
  const baseSync = Number(payload.base_sync_version || currentSync);
  const conflict = baseSync !== currentSync;

  row[map.status] = newStatus;
  row[map.updated_at] = new Date().toISOString();
  row[map.sync_version] = currentSync + 1;

  sheet.getRange(rowIndex, 1, 1, lastCol).setValues([row]);
  return ok_({
    message: 'Status updated',
    order_id: orderId,
    order_status: newStatus,
    sync_version: row[map.sync_version],
    conflict: conflict
  });
}

function addExpense_(payload) {
  const sheet = getSheet_(CONFIG.SHEETS.EXPENSES);
  const amount = normalizeNumber_(payload.amount, '');
  const now = new Date();
  const record = {
    expense_id: cleanString_(payload.expense_id) || ('EXP-' + now.getTime()),
    date: normalizeDateInput_(payload.date) || Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    category: cleanString_(payload.category) || 'General',
    amount: amount,
    description: cleanString_(payload.description),
    created_at: now.toISOString()
  };
  sheet.appendRow(objectToRow_(record, CONFIG.EXPENSE_HEADERS));
  return ok_({ message: 'Expense added', expense_id: record.expense_id });
}

function getOrders_() {
  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const rows = dataRows_(sheet);
  const orders = rows.map(function (row) {
    return {
      order_id: cleanString_(row[map.order_id]),
      order_number: cleanString_(row[map.order_number]) || 'LEGACY',
      customer_name: cleanString_(row[map.customer_name]),
      phone: cleanString_(row[map.phone]),
      delivery_date: normalizeDateInput_(row[map.delivery_date]),
      delivery_time: normalizeTimeInput_(row[map.delivery_time]),
      delivery_at: cleanString_(row[map.delivery_at]),
      type: normalizeOrderType_(row[map.type]) || 'Pickup',
      address: cleanString_(row[map.address]),
      web_link: cleanString_(row[map.web_link]),
      channel: normalizeChannel_(row[map.channel]),
      source_notes: cleanString_(row[map.source_notes]),
      items_json: cleanString_(row[map.items_json]),
      total_amount: normalizeNumber_(row[map.total_amount], 0),
      status: normalizeStatus_(row[map.status]) || 'Pending',
      payment_status: normalizePaymentStatus_(row[map.payment_status]),
      payment_method: cleanString_(row[map.payment_method]),
      deposit_amount: normalizeNumber_(row[map.deposit_amount], ''),
      captured_at: cleanString_(row[map.captured_at]),
      updated_at: cleanString_(row[map.updated_at]),
      sync_version: Number(row[map.sync_version] || 1),
      is_legacy: boolValue_(row[map.is_legacy])
    };
  }).filter(function (o) {
    return !!o.order_id;
  });

  orders.sort(function (a, b) {
    const left = firstDate_(a.captured_at, a.updated_at, a.delivery_at, a.delivery_date);
    const right = firstDate_(b.captured_at, b.updated_at, b.delivery_at, b.delivery_date);
    return left.getTime() - right.getTime();
  });

  return orders;
}

function getProducts_() {
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  const map = headerMap_(sheet);
  const rows = dataRows_(sheet);
  return rows.map(function (row) {
    return {
      id: cleanString_(row[map.id]),
      name: cleanString_(row[map.name]),
      price: normalizeNumber_(row[map.price], 0),
      category: cleanString_(row[map.category]) || 'General',
      active: map.active === undefined ? true : boolValue_(row[map.active], true)
    };
  }).filter(function (p) {
    return p.name && p.active !== false;
  }).sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function getExpenses_() {
  const sheet = getSheet_(CONFIG.SHEETS.EXPENSES);
  const map = headerMap_(sheet);
  const rows = dataRows_(sheet);
  return rows.map(function (row) {
    return {
      expense_id: cleanString_(row[map.expense_id]),
      date: normalizeDateInput_(row[map.date]),
      category: cleanString_(row[map.category]) || 'General',
      amount: normalizeNumber_(row[map.amount], 0),
      description: cleanString_(row[map.description]),
      created_at: cleanString_(row[map.created_at])
    };
  }).filter(function (e) {
    return !!e.expense_id;
  });
}

function generateOrderNumber_(sheet, map, now) {
  const prefix = Utilities.formatDate(now, Session.getScriptTimeZone(), "'ORD-'ddMMM-").toUpperCase();
  const rows = dataRows_(sheet);
  let maxSeq = 0;
  rows.forEach(function (row) {
    const folio = cleanString_(row[map.order_number]);
    if (!folio || folio === 'LEGACY') return;
    if (folio.indexOf(prefix) !== 0) return;
    const seq = Number(folio.split('-').pop() || 0);
    if (seq > maxSeq) maxSeq = seq;
  });
  const next = String(maxSeq + 1).padStart(3, '0');
  return prefix + next;
}

function markLegacyOrders_() {
  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const now = new Date().toISOString();

  let dirty = false;
  for (let i = 0; i < data.length; i += 1) {
    const row = data[i];
    const hasOrderId = cleanString_(row[map.order_id]);
    if (!hasOrderId) continue;

    const hasNumber = cleanString_(row[map.order_number]);
    if (!hasNumber) {
      row[map.order_number] = 'LEGACY';
      row[map.is_legacy] = true;
      dirty = true;
    }

    if (!cleanString_(row[map.captured_at])) {
      row[map.captured_at] = cleanString_(row[map.updated_at]) || cleanString_(row[map.delivery_at]) || now;
      dirty = true;
    }

    if (!row[map.updated_at]) {
      row[map.updated_at] = now;
      dirty = true;
    }

    if (!row[map.sync_version]) {
      row[map.sync_version] = 1;
      dirty = true;
    }

    if (row[map.is_legacy] === '' || row[map.is_legacy] === null || row[map.is_legacy] === undefined) {
      row[map.is_legacy] = row[map.order_number] === 'LEGACY';
      dirty = true;
    }

    if (!cleanString_(row[map.delivery_at])) {
      row[map.delivery_at] = buildDeliveryAt_(normalizeDateInput_(row[map.delivery_date]), normalizeTimeInput_(row[map.delivery_time]));
      dirty = true;
    }
  }

  if (dirty) {
    sheet.getRange(2, 1, data.length, lastCol).setValues(data);
  }
}

function seedProductsIfEmpty_() {
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  if (sheet.getLastRow() > 1) return;
  const demo = [
    ['P001', 'Quesadilla Salvadoreña (1/4 Regular)', 9, 'Food', true],
    ['P002', 'Pan Francés (Docena)', 10, 'Food', true],
    ['P003', 'Semita Alta (1/4 Regular)', 10, 'Food', true],
    ['P004', 'Delivery Fee', 5, 'Delivery', true]
  ];
  sheet.getRange(2, 1, demo.length, demo[0].length).setValues(demo);
}

function ensureSheetHeaders_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const current = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(cleanString_);
  const missing = headers.filter(function (h) {
    return current.indexOf(h) === -1;
  });

  if (missing.length > 0) {
    const start = current.length + 1;
    sheet.getRange(1, start, 1, missing.length).setValues([missing]);
  }
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name);
  return sheet;
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const internalId = cleanString_(props.getProperty('BAKERY_INTERNAL_SPREADSHEET_ID'));
  if (internalId) {
    try {
      return SpreadsheetApp.openById(internalId);
    } catch (err) {}
  }

  const created = SpreadsheetApp.create('Bakery Ops MVP Data');
  props.setProperty('BAKERY_INTERNAL_SPREADSHEET_ID', created.getId());
  props.setProperty('SPREADSHEET_ID', created.getId());
  return created;
}

function getSpreadsheetInfo_() {
  const ss = getSpreadsheet_();
  return ok_({
    spreadsheet_id: ss.getId(),
    spreadsheet_url: ss.getUrl(),
    spreadsheet_name: ss.getName()
  });
}

function headerMap_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach(function (h, idx) {
    map[cleanString_(h)] = idx;
  });
  return map;
}

function dataRows_(sheet) {
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
}

function objectToRow_(obj, headers) {
  return headers.map(function (h) {
    return obj[h] === undefined ? '' : obj[h];
  });
}

function findRowByOrderId_(sheet, map, orderId) {
  const rows = dataRows_(sheet);
  for (let i = 0; i < rows.length; i += 1) {
    if (cleanString_(rows[i][map.order_id]) === orderId) {
      return i + 2;
    }
  }
  return -1;
}

function parsePostPayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  const body = e.postData.contents;
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch (err) {
    return { raw: body };
  }
}

function normalizeItemsJson_(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (err) {
      return null;
    }
  }
  if (typeof value === 'object') return value;
  return null;
}

function hasAtLeastOneItem_(items) {
  if (Array.isArray(items)) return items.length > 0;
  if (items && typeof items === 'object') return Object.keys(items).length > 0;
  return false;
}

function getTotalAmount_(items, fallback) {
  const fallbackNumber = normalizeNumber_(fallback, NaN);
  if (!isNaN(fallbackNumber)) return fallbackNumber;

  if (Array.isArray(items)) {
    return items.reduce(function (sum, item) {
      const price = normalizeNumber_(item.price, 0);
      const quantity = normalizeNumber_(item.quantity, 1);
      return sum + (price * quantity);
    }, 0);
  }

  return 0;
}

function normalizeDateInput_(value) {
  const str = cleanString_(value);
  if (!str) return '';
  const date = new Date(str);
  if (isNaN(date.getTime())) return '';
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function normalizeTimeInput_(value) {
  const str = cleanString_(value);
  if (!str) return '';
  const match = str.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return '';
  const hour = match[1].padStart(2, '0');
  const minute = match[2];
  return hour + ':' + minute;
}

function buildDeliveryAt_(deliveryDate, deliveryTime) {
  if (!deliveryDate) return '';
  const base = new Date(deliveryDate + 'T00:00:00');
  if (isNaN(base.getTime())) return '';
  if (deliveryTime) {
    const parts = deliveryTime.split(':');
    base.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
  }
  return base.toISOString();
}

function normalizeStatus_(value) {
  const raw = cleanString_(value).toLowerCase();
  if (!raw) return '';
  const map = {
    pending: 'Pending',
    working: 'Working',
    baked: 'Baked',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    canceled: 'Cancelled'
  };
  return map[raw] || '';
}

function normalizeOrderType_(value) {
  const raw = cleanString_(value).toLowerCase();
  if (!raw) return '';
  if (raw === 'pickup') return 'Pickup';
  if (raw === 'delivery') return 'Delivery';
  return '';
}

function normalizeChannel_(value) {
  const raw = cleanString_(value);
  if (!raw) return 'Phone';
  const valid = CONFIG.CHANNELS;
  const hit = valid.find(function (ch) {
    return ch.toLowerCase() === raw.toLowerCase();
  });
  return hit || 'Phone';
}

function normalizePaymentStatus_(value) {
  const raw = cleanString_(value).toLowerCase();
  if (raw === 'paid') return 'Paid';
  return 'Unpaid';
}

function normalizeNumber_(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback;
  const n = Number(value);
  return isNaN(n) ? fallback : n;
}

function boolValue_(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback || false;
  if (value === true || value === 'TRUE' || value === 'true' || value === 1 || value === '1') return true;
  return false;
}

function cleanString_(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function firstDate_() {
  for (let i = 0; i < arguments.length; i += 1) {
    const value = cleanString_(arguments[i]);
    if (!value) continue;
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return new Date(0);
}

function ok_(payload) {
  return Object.assign({ status: 'success' }, payload || {});
}

function fail_(message) {
  return { status: 'error', message: message };
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
