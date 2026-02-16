const CONFIG = {
  SPREADSHEET_ID: '',
  SHEETS: {
    ORDERS: 'Orders',
    PRODUCTS: 'Products',
    EXPENSES: 'Expenses',
    BOARD_DAYS: 'BoardDays'
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
  PRODUCT_HEADERS: ['id', 'name', 'price', 'category', 'family_key', 'family_label', 'family_color', 'family_order', 'variant_order', 'active'],
  EXPENSE_HEADERS: ['expense_id', 'date', 'category', 'amount', 'description', 'created_at'],
  BOARD_DAY_HEADERS: ['day_key', 'is_archived', 'archived_at', 'archived_reason', 'unarchived_at', 'updated_at'],
  LATE_THRESHOLD_MINUTES: 15,
  RUNTIME_SETUP_CACHE_SECONDS: 300,
  RUNTIME_SETUP_MAX_AGE_MS: 300000,
  RUNTIME_SETUP_STAMP_KEY: 'RUNTIME_SETUP_STAMP_MS'
};

function doGet(e) {
  ensureRuntimeReady_();
  if (e && e.parameter && e.parameter.action) {
    return jsonOutput_(handleGetAction_(e.parameter.action, e.parameter || {}));
  }
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Bakery Ops Board v1')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  ensureRuntimeReady_();
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
  ensureSheetHeaders_(ss, CONFIG.SHEETS.BOARD_DAYS, CONFIG.BOARD_DAY_HEADERS);
  seedProductsIfEmpty_();
  backfillProductFamilies_();
  markLegacyOrders_();
  syncBoardDaysFromOrders_();
}

function ensureRuntimeReady_() {
  const cacheKey = 'runtime-ready-v2';
  const cache = CacheService.getScriptCache();
  try {
    if (cache.get(cacheKey) === '1') return;
  } catch (err) {}

  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  const lastStamp = Number(props.getProperty(CONFIG.RUNTIME_SETUP_STAMP_KEY) || 0);
  if (lastStamp > 0 && (now - lastStamp) < CONFIG.RUNTIME_SETUP_MAX_AGE_MS) {
    try {
      cache.put(cacheKey, '1', CONFIG.RUNTIME_SETUP_CACHE_SECONDS);
    } catch (err) {}
    return;
  }

  setup();
  props.setProperty(CONFIG.RUNTIME_SETUP_STAMP_KEY, String(now));
  try {
    cache.put(cacheKey, '1', CONFIG.RUNTIME_SETUP_CACHE_SECONDS);
  } catch (err) {}
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

function handleGetAction_(action, params) {
  switch (action) {
    case 'getOrders':
      return getOrders_(params || {});
    case 'getBoardDays':
      return getBoardDays_();
    case 'getBoardSnapshot':
      return getBoardSnapshot_();
    case 'getBoardDelta':
      return getBoardDelta_(params || {});
    case 'getOrderDetails':
      return getOrderDetails_(params || {});
    case 'getClientConfig':
      return getClientConfig_();
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
    case 'adminImportProductsFromSpreadsheet':
      return adminImportProductsFromSpreadsheet({});
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
    case 'archiveBoardDay':
      return archiveBoardDay_(payload);
    case 'unarchiveBoardDay':
      return unarchiveBoardDay_(payload);
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
    case 'adminImportProductsFromSpreadsheet':
      return adminImportProductsFromSpreadsheet(payload);
    case 'adminUpsertProducts':
      return adminUpsertProducts(payload);
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

function rowToOrder_(row, map, boardOnly) {
  const order = {
    order_id: cleanString_(row[map.order_id]),
    order_number: cleanString_(row[map.order_number]) || 'LEGACY',
    customer_name: cleanString_(row[map.customer_name]),
    phone: cleanString_(row[map.phone]),
    delivery_date: normalizeDateInput_(row[map.delivery_date]),
    delivery_time: normalizeTimeInput_(row[map.delivery_time]),
    delivery_at: cleanString_(row[map.delivery_at]),
    type: normalizeOrderType_(row[map.type]) || 'Pickup',
    address: cleanString_(row[map.address]),
    channel: normalizeChannel_(row[map.channel]),
    total_amount: normalizeNumber_(row[map.total_amount], 0),
    status: normalizeStatus_(row[map.status]) || 'Pending',
    payment_status: normalizePaymentStatus_(row[map.payment_status]),
    captured_at: cleanString_(row[map.captured_at]),
    updated_at: cleanString_(row[map.updated_at]),
    sync_version: Number(row[map.sync_version] || 1)
  };
  if (!order.order_id) return null;

  if (!boardOnly) {
    order.web_link = cleanString_(row[map.web_link]);
    order.source_notes = cleanString_(row[map.source_notes]);
    order.items_json = cleanString_(row[map.items_json]);
    order.payment_method = cleanString_(row[map.payment_method]);
    order.deposit_amount = normalizeNumber_(row[map.deposit_amount], '');
    order.is_legacy = boolValue_(row[map.is_legacy]);
  }

  return order;
}

function getOrders_(options) {
  const opts = options || {};
  const boardOnly = opts.boardOnly === true;
  const boardDayInput = cleanString_(opts.board_day || opts.boardDay);
  const boardDay = boardDayInput ? normalizeDateInput_(boardDayInput) : '';
  if (boardDayInput && !boardDay) return fail_('board_day must be YYYY-MM-DD');
  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const rows = dataRows_(sheet);
  const orders = rows.map(function (row) {
    return rowToOrder_(row, map, boardOnly);
  }).filter(function (o) {
    if (!o) return false;
    if (!boardDay) return true;
    return o.delivery_date === boardDay;
  });

  orders.sort(function (a, b) {
    const left = firstDate_(a.captured_at, a.updated_at, a.delivery_at, a.delivery_date);
    const right = firstDate_(b.captured_at, b.updated_at, b.delivery_at, b.delivery_date);
    return left.getTime() - right.getTime();
  });

  return orders;
}

function getOrderDetails_(params) {
  const orderId = cleanString_(params && params.order_id);
  if (!orderId) return fail_('order_id is required');

  const sheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const map = headerMap_(sheet);
  const rowIndex = findRowByOrderId_(sheet, map, orderId);
  if (rowIndex < 2) return fail_('Order not found');
  const row = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  const order = rowToOrder_(row, map, false);
  if (!order) return fail_('Order not found');
  return ok_({ order: order });
}

function getBoardSnapshot_() {
  const items = getOrders_({ boardOnly: true });
  return ok_({
    board_rev: buildBoardRevision_(items),
    items: items
  });
}

function getBoardDelta_(params) {
  const items = getOrders_({ boardOnly: true });
  const boardRev = buildBoardRevision_(items);
  const sinceRev = cleanString_(params && params.since_rev);
  const sinceUpdatedAt = cleanString_(params && params.since_updated_at);

  if (sinceRev && sinceRev === boardRev) {
    return ok_({
      board_rev: boardRev,
      changed: [],
      removed: [],
      full: false
    });
  }

  if (!sinceUpdatedAt) {
    return ok_({
      board_rev: boardRev,
      changed: items,
      removed: [],
      full: true
    });
  }

  const sinceDate = new Date(sinceUpdatedAt);
  if (isNaN(sinceDate.getTime())) {
    return fail_('since_updated_at is invalid');
  }

  const changed = items.filter(function (order) {
    const stamp = firstDate_(order.updated_at, order.captured_at).getTime();
    return stamp > sinceDate.getTime();
  });

  return ok_({
    board_rev: boardRev,
    changed: changed,
    removed: [],
    full: false,
    since_updated_at: sinceUpdatedAt
  });
}

function getClientConfig_() {
  const props = PropertiesService.getScriptProperties();
  return ok_({
    flags: {
      board_snapshot_enabled: parseFlag_(props.getProperty('PERF_BOARD_SNAPSHOT_ENABLED'), true),
      board_skip_nochange_render_enabled: parseFlag_(props.getProperty('PERF_BOARD_SKIP_NOCHANGE_RENDER'), true),
      board_incremental_render_enabled: parseFlag_(props.getProperty('PERF_BOARD_INCREMENTAL_RENDER'), true),
      board_delta_sync_enabled: parseFlag_(props.getProperty('PERF_BOARD_DELTA_SYNC'), true)
    }
  });
}

function getProducts_() {
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  const map = headerMap_(sheet);
  const rows = dataRows_(sheet);
  return rows.map(function (row) {
    const name = cleanString_(row[map.name]);
    const category = cleanString_(row[map.category]) || 'General';
    const inferred = inferFamilyMeta_(name, category);
    const rawFamilyKey = map.family_key === undefined ? '' : cleanString_(row[map.family_key]);
    const rawFamilyLabel = map.family_label === undefined ? '' : cleanString_(row[map.family_label]);
    const rawFamilyColor = map.family_color === undefined ? '' : cleanString_(row[map.family_color]);
    const useInferredFamily = shouldFallbackFamilyMeta_(rawFamilyKey, rawFamilyLabel, category);
    const familyOrderRaw = map.family_order === undefined ? '' : row[map.family_order];
    const variantOrderRaw = map.variant_order === undefined ? '' : row[map.variant_order];
    return {
      id: cleanString_(row[map.id]),
      name: name,
      price: normalizeNumber_(row[map.price], 0),
      category: category,
      family_key: useInferredFamily ? inferred.family_key : (rawFamilyKey || inferred.family_key),
      family_label: useInferredFamily ? inferred.family_label : (rawFamilyLabel || inferred.family_label),
      family_color: useInferredFamily ? inferred.family_color : (rawFamilyColor || inferred.family_color),
      family_order: useInferredFamily ? inferred.family_order : (map.family_order === undefined ? inferred.family_order : normalizeNumber_(familyOrderRaw, inferred.family_order)),
      variant_order: map.variant_order === undefined ? inferred.variant_order : normalizeNumber_(variantOrderRaw, inferred.variant_order),
      active: map.active === undefined ? true : boolValue_(row[map.active], true)
    };
  }).filter(function (p) {
    return p.name && p.active !== false;
  }).sort(function (a, b) {
    const famDiff = normalizeNumber_(a.family_order, 999) - normalizeNumber_(b.family_order, 999);
    if (famDiff !== 0) return famDiff;
    const varDiff = normalizeNumber_(a.variant_order, 999) - normalizeNumber_(b.variant_order, 999);
    if (varDiff !== 0) return varDiff;
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

function rowToBoardDay_(row, map) {
  const dayKey = normalizeDateInput_(row[map.day_key]);
  if (!dayKey) return null;
  return {
    day_key: dayKey,
    is_archived: boolValue_(row[map.is_archived], false),
    archived_at: cleanString_(row[map.archived_at]),
    archived_reason: cleanString_(row[map.archived_reason]),
    unarchived_at: cleanString_(row[map.unarchived_at]),
    updated_at: cleanString_(row[map.updated_at])
  };
}

function getBoardDays_() {
  const orders = getOrders_();
  if (!Array.isArray(orders)) return orders;

  const aggregatesByDay = {};
  orders.forEach(function (order) {
    const dayKey = normalizeDateInput_(order.delivery_date);
    if (!dayKey) return;
    if (!aggregatesByDay[dayKey]) {
      aggregatesByDay[dayKey] = {
        order_count: 0,
        pending_count: 0,
        latest_updated_at: ''
      };
    }

    const day = aggregatesByDay[dayKey];
    day.order_count += 1;
    if (order.status === 'Pending') day.pending_count += 1;

    const orderStamp = firstDate_(order.updated_at, order.captured_at);
    if (orderStamp.getTime() > firstDate_(day.latest_updated_at).getTime()) {
      day.latest_updated_at = orderStamp.toISOString();
    }
  });

  const boardDaysSheet = getSheet_(CONFIG.SHEETS.BOARD_DAYS);
  const boardDaysMap = headerMap_(boardDaysSheet);
  const boardDaysRows = dataRows_(boardDaysSheet);
  const boardDaysByKey = {};

  boardDaysRows.forEach(function (row) {
    const boardDay = rowToBoardDay_(row, boardDaysMap);
    if (!boardDay) return;
    boardDaysByKey[boardDay.day_key] = boardDay;
  });

  return Object.keys(aggregatesByDay).sort().map(function (dayKey) {
    const aggregate = aggregatesByDay[dayKey];
    const boardDay = boardDaysByKey[dayKey];
    return {
      day_key: dayKey,
      order_count: aggregate.order_count,
      pending_count: aggregate.pending_count,
      is_archived: boardDay ? boardDay.is_archived : false,
      updated_at: boardDay ? cleanString_(boardDay.updated_at) || aggregate.latest_updated_at : aggregate.latest_updated_at
    };
  });
}

function archiveBoardDay_(payload) {
  const dayKey = normalizeDateInput_(payload.day_key);
  const reason = cleanString_(payload.reason);
  const confirmStep1 = payload.confirm_step_1 === true || payload.confirm_step_1 === 'true';
  const confirmStep2 = payload.confirm_step_2 === true || payload.confirm_step_2 === 'true';

  if (!dayKey) return fail_('day_key is required and must be YYYY-MM-DD');
  if (!reason) return fail_('reason is required');
  if (!confirmStep1 || !confirmStep2) return fail_('confirm_step_1 and confirm_step_2 must be true');

  const boardDayState = getOrCreateBoardDayState_(dayKey);
  const nowIso = new Date().toISOString();
  boardDayState.row[boardDayState.map.is_archived] = true;
  boardDayState.row[boardDayState.map.archived_at] = nowIso;
  boardDayState.row[boardDayState.map.archived_reason] = reason;
  boardDayState.row[boardDayState.map.unarchived_at] = '';
  boardDayState.row[boardDayState.map.updated_at] = nowIso;
  boardDayState.sheet.getRange(boardDayState.rowIndex, 1, 1, boardDayState.lastCol).setValues([boardDayState.row]);

  return ok_({
    message: 'Board day archived',
    day_key: dayKey,
    is_archived: true,
    archived_at: nowIso,
    archived_reason: reason,
    updated_at: nowIso
  });
}

function unarchiveBoardDay_(payload) {
  const dayKey = normalizeDateInput_(payload.day_key);
  const reason = cleanString_(payload.reason);
  if (!dayKey) return fail_('day_key is required and must be YYYY-MM-DD');
  if (!reason) return fail_('reason is required');

  const boardDayState = getOrCreateBoardDayState_(dayKey);
  const nowIso = new Date().toISOString();
  boardDayState.row[boardDayState.map.is_archived] = false;
  boardDayState.row[boardDayState.map.unarchived_at] = nowIso;
  boardDayState.row[boardDayState.map.updated_at] = nowIso;
  if (!cleanString_(boardDayState.row[boardDayState.map.archived_reason])) {
    boardDayState.row[boardDayState.map.archived_reason] = reason;
  }
  boardDayState.sheet.getRange(boardDayState.rowIndex, 1, 1, boardDayState.lastCol).setValues([boardDayState.row]);

  return ok_({
    message: 'Board day unarchived',
    day_key: dayKey,
    is_archived: false,
    unarchived_at: nowIso,
    updated_at: nowIso
  });
}

function getOrCreateBoardDayState_(dayKey) {
  const sheet = getSheet_(CONFIG.SHEETS.BOARD_DAYS);
  const map = headerMap_(sheet);
  const rows = dataRows_(sheet);
  const lastCol = sheet.getLastColumn();

  for (let i = 0; i < rows.length; i += 1) {
    const currentDay = normalizeDateInput_(rows[i][map.day_key]);
    if (currentDay !== dayKey) continue;
    return {
      sheet: sheet,
      map: map,
      rowIndex: i + 2,
      row: rows[i],
      lastCol: lastCol
    };
  }

  const nowIso = new Date().toISOString();
  const newRow = objectToRow_({
    day_key: dayKey,
    is_archived: false,
    archived_at: '',
    archived_reason: '',
    unarchived_at: '',
    updated_at: nowIso
  }, CONFIG.BOARD_DAY_HEADERS);
  sheet.appendRow(newRow);
  return {
    sheet: sheet,
    map: map,
    rowIndex: sheet.getLastRow(),
    row: newRow,
    lastCol: lastCol
  };
}

function syncBoardDaysFromOrders_() {
  const ordersSheet = getSheet_(CONFIG.SHEETS.ORDERS);
  const ordersMap = headerMap_(ordersSheet);
  const ordersRows = dataRows_(ordersSheet);
  const boardDaysSheet = getSheet_(CONFIG.SHEETS.BOARD_DAYS);
  const boardDaysMap = headerMap_(boardDaysSheet);
  const boardDaysRows = dataRows_(boardDaysSheet);
  const nowIso = new Date().toISOString();

  const existingByDay = {};
  boardDaysRows.forEach(function (row) {
    const dayKey = normalizeDateInput_(row[boardDaysMap.day_key]);
    if (!dayKey) return;
    existingByDay[dayKey] = true;
  });

  const toInsert = [];
  ordersRows.forEach(function (row) {
    const dayKey = normalizeDateInput_(row[ordersMap.delivery_date]);
    if (!dayKey || existingByDay[dayKey]) return;
    existingByDay[dayKey] = true;
    toInsert.push(objectToRow_({
      day_key: dayKey,
      is_archived: false,
      archived_at: '',
      archived_reason: '',
      unarchived_at: '',
      updated_at: nowIso
    }, CONFIG.BOARD_DAY_HEADERS));
  });

  if (toInsert.length > 0) {
    boardDaysSheet.getRange(boardDaysSheet.getLastRow() + 1, 1, toInsert.length, toInsert[0].length).setValues(toInsert);
  }

  return {
    inserted: toInsert.length,
    total: Math.max(boardDaysSheet.getLastRow() - 1, 0)
  };
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
  const demoBase = [
    { id: 'P001', name: 'Quesadilla Salvadoreña (1/4 Regular)', price: 9, category: 'Food', active: true },
    { id: 'P002', name: 'Pan Francés (Docena)', price: 10, category: 'Food', active: true },
    { id: 'P003', name: 'Semita Alta (1/4 Regular)', price: 10, category: 'Food', active: true },
    { id: 'P004', name: 'Delivery Fee', price: 5, category: 'Delivery', active: true }
  ];
  const demoRows = demoBase.map(function (p) {
    const family = inferFamilyMeta_(p.name, p.category);
    return objectToRow_({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      family_key: family.family_key,
      family_label: family.family_label,
      family_color: family.family_color,
      family_order: family.family_order,
      variant_order: family.variant_order,
      active: p.active
    }, CONFIG.PRODUCT_HEADERS);
  });
  sheet.getRange(2, 1, demoRows.length, demoRows[0].length).setValues(demoRows);
}

function backfillProductFamilies_() {
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  const map = headerMap_(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  let dirty = false;

  for (let i = 0; i < data.length; i += 1) {
    const row = data[i];
    const name = cleanString_(row[map.name]);
    if (!name) continue;
    const category = cleanString_(row[map.category]) || 'General';
    const family = inferFamilyMeta_(name, category);
    const rawFamilyKey = map.family_key === undefined ? '' : cleanString_(row[map.family_key]);
    const rawFamilyLabel = map.family_label === undefined ? '' : cleanString_(row[map.family_label]);
    const useInferredFamily = shouldFallbackFamilyMeta_(rawFamilyKey, rawFamilyLabel, category);

    if (map.family_key !== undefined && (useInferredFamily || !rawFamilyKey)) {
      row[map.family_key] = family.family_key;
      dirty = true;
    }
    if (map.family_label !== undefined && (useInferredFamily || !rawFamilyLabel)) {
      row[map.family_label] = family.family_label;
      dirty = true;
    }
    if (map.family_color !== undefined && (useInferredFamily || !cleanString_(row[map.family_color]))) {
      row[map.family_color] = family.family_color;
      dirty = true;
    }
    if (map.family_order !== undefined && (useInferredFamily || cleanString_(row[map.family_order]) === '')) {
      row[map.family_order] = family.family_order;
      dirty = true;
    }
    if (map.variant_order !== undefined && (useInferredFamily || cleanString_(row[map.variant_order]) === '')) {
      row[map.variant_order] = family.variant_order;
      dirty = true;
    }
  }

  if (dirty) {
    sheet.getRange(2, 1, data.length, lastCol).setValues(data);
  }
}

function isGenericFamilyValue_(value) {
  const normalized = normalizeForMatch_(value);
  if (!normalized) return true;
  const genericValues = [
    'food', 'foods', 'comida',
    'menu', 'menus',
    'product', 'products', 'producto', 'productos',
    'item', 'items',
    'general',
    'all', 'todo', 'todos',
    'bakery', 'panaderia',
    'catalog', 'catalogo'
  ];
  return genericValues.indexOf(normalized) >= 0;
}

function shouldFallbackFamilyMeta_(familyKey, familyLabel, category) {
  const normalizedCategory = normalizeForMatch_(category);
  const normalizedKey = normalizeForMatch_(familyKey);
  const normalizedLabel = normalizeForMatch_(familyLabel);

  if (!normalizedKey && !normalizedLabel) return true;

  const keyGeneric = isGenericFamilyValue_(familyKey);
  const labelGeneric = isGenericFamilyValue_(familyLabel);
  const keyMatchesCategory = normalizedKey && normalizedCategory && normalizedKey === normalizedCategory && normalizedCategory !== 'delivery';
  const labelMatchesCategory = normalizedLabel && normalizedCategory && normalizedLabel === normalizedCategory && normalizedCategory !== 'delivery';

  return keyGeneric || labelGeneric || keyMatchesCategory || labelMatchesCategory;
}

function inferFamilyMeta_(name, category) {
  const normalizedName = normalizeForMatch_(name);
  const normalizedCategory = normalizeForMatch_(category);

  const families = [
    { key: 'quesadilla_salvadorena', label: 'Quesadillas', color: '#C96A2B', order: 10, patterns: ['quesadilla'] },
    { key: 'semita_alta', label: 'Semita Alta', color: '#2E8B57', order: 20, patterns: ['semita alta'] },
    { key: 'pan_frances', label: 'Pan Frances', color: '#2B6CB0', order: 30, patterns: ['pan frances'] },
    { key: 'pan_menudo', label: 'Pan Menudo', color: '#5A67D8', order: 40, patterns: ['pan menudo'] },
    { key: 'pastelitos_rellenos', label: 'Pastelitos', color: '#D53F8C', order: 50, patterns: ['pastelito', 'pastelitos rellenos'] },
    { key: 'budin_guineo', label: 'Budin', color: '#805AD5', order: 60, patterns: ['budin', 'guineo'] },
    { key: 'delivery', label: 'Delivery', color: '#718096', order: 90, patterns: ['delivery fee', 'delivery'] }
  ];

  let family = families.find(function (f) {
    return f.patterns.some(function (pattern) {
      return normalizedName.indexOf(pattern) >= 0;
    });
  });

  if (!family && normalizedCategory.indexOf('delivery') >= 0) {
    family = families.find(function (f) { return f.key === 'delivery'; });
  }

  if (!family) {
    family = { key: 'general', label: 'General', color: '#A0AEC0', order: 99 };
  }

  return {
    family_key: family.key,
    family_label: family.label,
    family_color: family.color,
    family_order: family.order,
    variant_order: inferVariantOrder_(normalizedName)
  };
}

function inferVariantOrder_(normalizedName) {
  const checks = [
    { order: 10, terms: ['unidad', 'unit'] },
    { order: 20, terms: ['1/4', '1 4', 'cuarto', 'quarter', 'regular'] },
    { order: 30, terms: ['media', 'half'] },
    { order: 40, terms: ['docena', 'dozen'] },
    { order: 50, terms: ['combo', '3x'] },
    { order: 60, terms: ['familiar', 'familia', 'family'] },
    { order: 80, terms: ['external', 'externo'] }
  ];

  for (let i = 0; i < checks.length; i += 1) {
    const hit = checks[i].terms.some(function (term) {
      return normalizedName.indexOf(term) >= 0;
    });
    if (hit) return checks[i].order;
  }
  return 70;
}

function normalizeForMatch_(value) {
  const raw = cleanString_(value).toLowerCase();
  if (!raw) return '';
  return raw
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9/ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

function parseFlag_(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback || false;
  const lowered = cleanString_(value).toLowerCase();
  if (lowered === 'true' || lowered === '1' || lowered === 'yes' || lowered === 'on') return true;
  if (lowered === 'false' || lowered === '0' || lowered === 'no' || lowered === 'off') return false;
  return fallback || false;
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

function buildBoardRevision_(orders) {
  const canonical = (orders || [])
    .map(function (o) {
      return [
        cleanString_(o.order_id),
        cleanString_(o.status),
        cleanString_(o.sync_version),
        cleanString_(o.updated_at || o.captured_at)
      ].join('|');
    })
    .sort()
    .join('||');
  return hashString_(canonical);
}

function hashString_(input) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    cleanString_(input),
    Utilities.Charset.UTF_8
  );
  return digest.map(function (b) {
    const value = (b + 256) % 256;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
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
