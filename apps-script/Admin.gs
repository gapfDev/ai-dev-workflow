/**
 * Admin utilities for safe rollout.
 * Run these manually from Apps Script editor in this order:
 * 1) adminBackupSpreadsheet
 * 2) adminPrepareEnvironment
 * 3) adminRunSmokeTests
 */

function adminSetSpreadsheetIdProperty() {
  const spreadsheetId = cleanString_(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  if (!spreadsheetId) {
    return fail_('Set Script Property SPREADSHEET_ID first (Apps Script > Project Settings).');
  }
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheetId);
  return ok_({
    message: 'Script property updated',
    key: 'SPREADSHEET_ID',
    value: spreadsheetId
  });
}

function adminBackupSpreadsheet() {
  const ss = getSpreadsheet_();
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const backupName = ss.getName() + ' - BACKUP - ' + timestamp;

  const file = DriveApp.getFileById(ss.getId());
  const backup = file.makeCopy(backupName);

  return ok_({
    message: 'Backup created',
    backup_file_id: backup.getId(),
    backup_name: backupName,
    backup_url: backup.getUrl()
  });
}

function adminPrepareEnvironment() {
  setup();

  const ss = getSpreadsheet_();
  const ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  const productsSheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  const expensesSheet = ss.getSheetByName(CONFIG.SHEETS.EXPENSES);

  const summary = {
    orders_rows: Math.max((ordersSheet ? ordersSheet.getLastRow() : 1) - 1, 0),
    products_rows: Math.max((productsSheet ? productsSheet.getLastRow() : 1) - 1, 0),
    expenses_rows: Math.max((expensesSheet ? expensesSheet.getLastRow() : 1) - 1, 0),
    orders_headers: ordersSheet ? ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0] : [],
    products_headers: productsSheet ? productsSheet.getRange(1, 1, 1, productsSheet.getLastColumn()).getValues()[0] : [],
    expenses_headers: expensesSheet ? expensesSheet.getRange(1, 1, 1, expensesSheet.getLastColumn()).getValues()[0] : []
  };

  return ok_({
    message: 'Environment prepared',
    summary: summary
  });
}

function adminRunSmokeTests() {
  const issues = [];

  try {
    const ss = getSpreadsheet_();

    // 1) Required sheets exist
    [CONFIG.SHEETS.ORDERS, CONFIG.SHEETS.PRODUCTS, CONFIG.SHEETS.EXPENSES].forEach(function (name) {
      if (!ss.getSheetByName(name)) {
        issues.push('Missing sheet: ' + name);
      }
    });

    // 2) Headers complete for Orders
    const ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
    if (ordersSheet) {
      const headers = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0].map(cleanString_);
      CONFIG.ORDER_HEADERS.forEach(function (h) {
        if (headers.indexOf(h) === -1) {
          issues.push('Missing Orders header: ' + h);
        }
      });
    }

    // 3) Read APIs return arrays
    const orders = getOrders_();
    const products = getProducts_();
    const expenses = getExpenses_();
    if (!Array.isArray(orders)) issues.push('getOrders_ did not return array');
    if (!Array.isArray(products)) issues.push('getProducts_ did not return array');
    if (!Array.isArray(expenses)) issues.push('getExpenses_ did not return array');

    // 4) Sample status values valid
    const invalidStatus = (orders || []).filter(function (o) {
      return CONFIG.STATUS.indexOf(o.status) === -1;
    });
    if (invalidStatus.length > 0) {
      issues.push('Found invalid status values: ' + invalidStatus.length);
    }

    // 5) Legacy completeness checks
    const legacyWithoutFlag = (orders || []).filter(function (o) {
      return (o.order_number === 'LEGACY') && !o.is_legacy;
    });
    if (legacyWithoutFlag.length > 0) {
      issues.push('LEGACY orders without is_legacy=true: ' + legacyWithoutFlag.length);
    }

    // 6) Sync version present
    const missingSync = (orders || []).filter(function (o) {
      return !o.sync_version;
    });
    if (missingSync.length > 0) {
      issues.push('Orders missing sync_version: ' + missingSync.length);
    }

    if (issues.length > 0) {
      return fail_('Smoke tests found issues: ' + issues.join(' | '));
    }

    return ok_({
      message: 'Smoke tests passed',
      metrics: {
        orders: orders.length,
        products: products.length,
        expenses: expenses.length
      }
    });
  } catch (err) {
    return fail_('Smoke tests crashed: ' + (err.message || String(err)));
  }
}

function adminSeedDemoProductsIfEmpty() {
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  const rowCount = Math.max(sheet.getLastRow() - 1, 0);
  if (rowCount > 0) {
    return ok_({ message: 'Products sheet already has data', rows: rowCount });
  }

  const demo = [
    ['P001', 'Quesadilla Salvadoreña (1/4 Regular)', 9, 'Food', true],
    ['P002', 'Pan Francés (Docena)', 10, 'Food', true],
    ['P003', 'Semita Alta (1/4 Regular)', 10, 'Food', true],
    ['P004', 'Delivery Fee', 5, 'Delivery', true]
  ];

  sheet.getRange(2, 1, demo.length, demo[0].length).setValues(demo);
  return ok_({ message: 'Demo products seeded', inserted: demo.length });
}

function adminMigrateLegacySheetById(payload) {
  const spreadsheetId = cleanString_((payload && payload.spreadsheet_id) || payload) || '18hvcTtVil8Yc9hO9NYanGo6-qJVJ1iPf9gFXGcyFoII';
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const report = {
    spreadsheet_id: spreadsheetId,
    spreadsheet_url: ss.getUrl(),
    migrated_at: new Date().toISOString(),
    sheets: {}
  };

  const ordersSheet = getFirstSheetByName_(ss, ['Orders', 'orders']);
  if (ordersSheet) {
    ensureSheetHeaders_(ss, ordersSheet.getName(), CONFIG.ORDER_HEADERS);
    const map = headerMap_(ordersSheet);
    const lastRow = ordersSheet.getLastRow();
    const lastCol = ordersSheet.getLastColumn();
    const data = lastRow > 1 ? ordersSheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : [];

    const nowIso = new Date().toISOString();
    let touched = 0;
    let fixedMissingId = 0;
    let fixedItemsJson = 0;
    let fixedTotals = 0;
    let fixedMissingCaptured = 0;

    for (let i = 0; i < data.length; i += 1) {
      const row = data[i];
      if (!rowHasAnyValue_(row)) continue;
      let dirty = false;

      if (!cleanString_(row[map.order_id])) {
        row[map.order_id] = 'ORD-MIG-' + Utilities.getUuid().slice(0, 8).toUpperCase();
        dirty = true;
        fixedMissingId += 1;
      }

      if (!cleanString_(row[map.order_number])) {
        row[map.order_number] = 'LEGACY';
        row[map.is_legacy] = true;
        dirty = true;
      } else if (row[map.is_legacy] === '' || row[map.is_legacy] === null || row[map.is_legacy] === undefined) {
        row[map.is_legacy] = cleanString_(row[map.order_number]) === 'LEGACY';
        dirty = true;
      }

      row[map.customer_name] = cleanString_(row[map.customer_name]) || 'Unknown';
      row[map.phone] = cleanString_(row[map.phone]);
      row[map.address] = cleanString_(row[map.address]);
      row[map.web_link] = cleanString_(row[map.web_link]);
      row[map.source_notes] = cleanString_(row[map.source_notes]);
      row[map.payment_method] = cleanString_(row[map.payment_method]);

      const deliveryDate = normalizeDateInput_(row[map.delivery_date]) || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      const deliveryTime = normalizeTimeInput_(row[map.delivery_time]);
      const deliveryAt = buildDeliveryAt_(deliveryDate, deliveryTime);
      if (row[map.delivery_date] !== deliveryDate) {
        row[map.delivery_date] = deliveryDate;
        dirty = true;
      }
      if (row[map.delivery_time] !== deliveryTime) {
        row[map.delivery_time] = deliveryTime;
        dirty = true;
      }
      if (row[map.delivery_at] !== deliveryAt) {
        row[map.delivery_at] = deliveryAt;
        dirty = true;
      }

      const normalizedType = normalizeOrderType_(row[map.type]) || 'Pickup';
      if (row[map.type] !== normalizedType) {
        row[map.type] = normalizedType;
        dirty = true;
      }

      const normalizedStatus = normalizeStatus_(row[map.status]) || 'Pending';
      if (row[map.status] !== normalizedStatus) {
        row[map.status] = normalizedStatus;
        dirty = true;
      }

      const normalizedPayment = normalizePaymentStatus_(row[map.payment_status]);
      if (row[map.payment_status] !== normalizedPayment) {
        row[map.payment_status] = normalizedPayment;
        dirty = true;
      }

      const normalizedChannel = normalizeChannel_(row[map.channel]);
      if (row[map.channel] !== normalizedChannel) {
        row[map.channel] = normalizedChannel;
        dirty = true;
      }

      const normalizedItems = normalizeLegacyItems_(row[map.items_json]);
      const normalizedItemsJson = JSON.stringify(normalizedItems);
      if (cleanString_(row[map.items_json]) !== normalizedItemsJson) {
        row[map.items_json] = normalizedItemsJson;
        dirty = true;
        fixedItemsJson += 1;
      }

      const parsedTotal = normalizeNumber_(row[map.total_amount], NaN);
      if (isNaN(parsedTotal)) {
        row[map.total_amount] = getTotalAmount_(normalizedItems, 0);
        dirty = true;
        fixedTotals += 1;
      }

      if (row[map.deposit_amount] === null || row[map.deposit_amount] === undefined) {
        row[map.deposit_amount] = '';
        dirty = true;
      }

      if (!cleanString_(row[map.captured_at])) {
        row[map.captured_at] = cleanString_(row[map.updated_at]) || nowIso;
        dirty = true;
        fixedMissingCaptured += 1;
      }
      if (!cleanString_(row[map.updated_at])) {
        row[map.updated_at] = nowIso;
        dirty = true;
      }

      const syncVersion = Number(row[map.sync_version] || 1);
      if (!syncVersion || isNaN(syncVersion)) {
        row[map.sync_version] = 1;
        dirty = true;
      } else if (row[map.sync_version] !== syncVersion) {
        row[map.sync_version] = syncVersion;
        dirty = true;
      }

      if (dirty) touched += 1;
    }

    if (data.length > 0) {
      ordersSheet.getRange(2, 1, data.length, lastCol).setValues(data);
    }

    report.sheets.orders = {
      rows_scanned: data.length,
      rows_touched: touched,
      fixed_missing_order_id: fixedMissingId,
      fixed_items_json: fixedItemsJson,
      fixed_total_amount: fixedTotals,
      fixed_missing_captured_at: fixedMissingCaptured
    };
  } else {
    report.sheets.orders = { message: 'orders sheet not found' };
  }

  const productsSheet = getFirstSheetByName_(ss, ['Products', 'products']);
  if (productsSheet) {
    const map = headerMap_(productsSheet);
    const lastRow = productsSheet.getLastRow();
    const lastCol = productsSheet.getLastColumn();
    const data = lastRow > 1 ? productsSheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : [];
    let touched = 0;
    for (let i = 0; i < data.length; i += 1) {
      const row = data[i];
      if (!rowHasAnyValue_(row)) continue;
      let dirty = false;
      const id = cleanString_(row[map.id]);
      if (!id) {
        row[map.id] = 'P-MIG-' + String(i + 1).padStart(3, '0');
        dirty = true;
      }
      const category = cleanString_(row[map.category]);
      if (category && category.toLowerCase() === 'delivery') {
        row[map.category] = 'Delivery';
        dirty = true;
      }
      if (dirty) touched += 1;
    }
    if (data.length > 0) {
      productsSheet.getRange(2, 1, data.length, lastCol).setValues(data);
    }
    report.sheets.products = {
      rows_scanned: data.length,
      rows_touched: touched
    };
  }

  const expensesSheet = getFirstSheetByName_(ss, ['Expenses', 'expenses']);
  if (expensesSheet) {
    ensureSheetHeaders_(ss, expensesSheet.getName(), CONFIG.EXPENSE_HEADERS);
    const map = headerMap_(expensesSheet);
    const lastRow = expensesSheet.getLastRow();
    const lastCol = expensesSheet.getLastColumn();
    const data = lastRow > 1 ? expensesSheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : [];
    let touched = 0;
    for (let i = 0; i < data.length; i += 1) {
      const row = data[i];
      if (!rowHasAnyValue_(row)) continue;
      let dirty = false;
      if (!cleanString_(row[map.expense_id])) {
        row[map.expense_id] = 'EXP-MIG-' + Utilities.getUuid().slice(0, 8).toUpperCase();
        dirty = true;
      }
      if (!cleanString_(row[map.date])) {
        row[map.date] = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
        dirty = true;
      }
      const amount = normalizeNumber_(row[map.amount], NaN);
      if (isNaN(amount)) {
        row[map.amount] = 0;
        dirty = true;
      }
      if (!cleanString_(row[map.category])) {
        row[map.category] = 'General';
        dirty = true;
      }
      if (!cleanString_(row[map.description])) {
        row[map.description] = 'Migrated';
        dirty = true;
      }
      if (!cleanString_(row[map.created_at])) {
        row[map.created_at] = new Date().toISOString();
        dirty = true;
      }
      if (dirty) touched += 1;
    }
    if (data.length > 0) {
      expensesSheet.getRange(2, 1, data.length, lastCol).setValues(data);
    }
    report.sheets.expenses = {
      rows_scanned: data.length,
      rows_touched: touched
    };
  }

  return ok_(report);
}

function getFirstSheetByName_(ss, names) {
  for (let i = 0; i < names.length; i += 1) {
    const sheet = ss.getSheetByName(names[i]);
    if (sheet) return sheet;
  }
  return null;
}

function rowHasAnyValue_(row) {
  return row.some(function (v) {
    return v !== null && v !== undefined && cleanString_(v) !== '';
  });
}

function normalizeLegacyItems_(value) {
  if (Array.isArray(value)) return value;

  if (value && typeof value === 'object') {
    return [value];
  }

  const raw = cleanString_(value);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') return [parsed];
  } catch (err) {}

  if (raw.startsWith('{') && raw.endsWith('}') && raw.indexOf('=') !== -1) {
    const inner = raw.slice(1, -1);
    const obj = {};
    inner.split(',').forEach(function (pair) {
      const idx = pair.indexOf('=');
      if (idx < 0) return;
      const key = cleanString_(pair.slice(0, idx));
      const val = cleanString_(pair.slice(idx + 1));
      if (!key) return;
      obj[key] = val;
    });
    if (obj.price !== undefined) obj.price = normalizeNumber_(obj.price, 0);
    if (obj.quantity !== undefined) obj.quantity = normalizeNumber_(obj.quantity, 1);
    if (!obj.name && obj.id) obj.name = String(obj.id);
    return Object.keys(obj).length ? [obj] : [];
  }

  return [];
}
