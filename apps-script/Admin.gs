/**
 * Admin utilities for safe rollout.
 * Run these manually from Apps Script editor in this order:
 * 1) adminBackupSpreadsheet
 * 2) adminPrepareEnvironment
 * 3) adminRunSmokeTests
 */

function adminSetSpreadsheetIdProperty(payload) {
  const props = PropertiesService.getScriptProperties();
  const incomingId = cleanString_(payload && payload.spreadsheet_id);
  const spreadsheetId = incomingId || cleanString_(props.getProperty('SPREADSHEET_ID'));
  if (!spreadsheetId) {
    return fail_('spreadsheet_id is required (payload or Script Property SPREADSHEET_ID).');
  }

  let opened;
  try {
    opened = SpreadsheetApp.openById(spreadsheetId);
  } catch (err) {
    return fail_('Invalid or inaccessible spreadsheet_id: ' + spreadsheetId);
  }

  props.setProperty('SPREADSHEET_ID', opened.getId());
  props.setProperty('BAKERY_INTERNAL_SPREADSHEET_ID', opened.getId());
  return ok_({
    message: 'Script property updated',
    key: 'SPREADSHEET_ID',
    value: opened.getId(),
    spreadsheet_url: opened.getUrl()
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

function adminResetQaData(payload) {
  const options = payload || {};
  const preserveProducts = options.preserve_products !== false;

  const backup = adminBackupSpreadsheet();
  if (backup.status !== 'success') {
    return backup;
  }

  const cleared = {
    orders: clearSheetDataRows_(CONFIG.SHEETS.ORDERS),
    expenses: clearSheetDataRows_(CONFIG.SHEETS.EXPENSES),
    board_days: clearSheetDataRows_(CONFIG.SHEETS.BOARD_DAYS)
  };

  if (!preserveProducts) {
    cleared.products = clearSheetDataRows_(CONFIG.SHEETS.PRODUCTS);
  }

  const prepared = adminPrepareEnvironment();
  if (prepared.status !== 'success') {
    return {
      status: 'error',
      message: 'QA reset failed while preparing environment',
      stage: 'prepare',
      backup: backup,
      cleared: cleared,
      prepare_result: prepared
    };
  }

  const smoke = adminRunSmokeTests();
  if (smoke.status !== 'success') {
    return {
      status: 'error',
      message: 'QA reset failed during smoke tests',
      stage: 'smoke',
      backup: backup,
      cleared: cleared,
      prepare_result: prepared,
      smoke_result: smoke
    };
  }

  return ok_({
    message: 'QA reset completed',
    preserve_products: preserveProducts,
    backup: {
      backup_file_id: backup.backup_file_id,
      backup_name: backup.backup_name,
      backup_url: backup.backup_url
    },
    cleared: cleared,
    summary: prepared.summary,
    smoke_metrics: smoke.metrics
  });
}

function clearSheetDataRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  const rowCount = Math.max(sheet.getLastRow() - 1, 0);
  if (rowCount > 0) {
    sheet.getRange(2, 1, rowCount, sheet.getLastColumn()).clearContent();
  }
  return {
    sheet: sheetName,
    cleared_rows: rowCount
  };
}

function adminPrepareEnvironment() {
  setup();

  const ss = getSpreadsheet_();
  const ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  const productsSheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  const expensesSheet = ss.getSheetByName(CONFIG.SHEETS.EXPENSES);
  const boardDaysSheet = ss.getSheetByName(CONFIG.SHEETS.BOARD_DAYS);

  const summary = {
    orders_rows: Math.max((ordersSheet ? ordersSheet.getLastRow() : 1) - 1, 0),
    products_rows: Math.max((productsSheet ? productsSheet.getLastRow() : 1) - 1, 0),
    expenses_rows: Math.max((expensesSheet ? expensesSheet.getLastRow() : 1) - 1, 0),
    board_days_rows: Math.max((boardDaysSheet ? boardDaysSheet.getLastRow() : 1) - 1, 0),
    orders_headers: ordersSheet ? ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0] : [],
    products_headers: productsSheet ? productsSheet.getRange(1, 1, 1, productsSheet.getLastColumn()).getValues()[0] : [],
    expenses_headers: expensesSheet ? expensesSheet.getRange(1, 1, 1, expensesSheet.getLastColumn()).getValues()[0] : [],
    board_days_headers: boardDaysSheet ? boardDaysSheet.getRange(1, 1, 1, boardDaysSheet.getLastColumn()).getValues()[0] : []
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
    [CONFIG.SHEETS.ORDERS, CONFIG.SHEETS.PRODUCTS, CONFIG.SHEETS.EXPENSES, CONFIG.SHEETS.BOARD_DAYS].forEach(function (name) {
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
    const boardDaysSheet = ss.getSheetByName(CONFIG.SHEETS.BOARD_DAYS);
    if (boardDaysSheet) {
      const headers = boardDaysSheet.getRange(1, 1, 1, boardDaysSheet.getLastColumn()).getValues()[0].map(cleanString_);
      CONFIG.BOARD_DAY_HEADERS.forEach(function (h) {
        if (headers.indexOf(h) === -1) {
          issues.push('Missing BoardDays header: ' + h);
        }
      });
    }

    // 3) Read APIs return arrays
    const orders = getOrders_();
    const products = getProducts_();
    const expenses = getExpenses_();
    const boardDays = getBoardDays_();
    const boardSnapshot = getBoardSnapshot_();
    const clientConfig = getClientConfig_();
    if (!Array.isArray(orders)) issues.push('getOrders_ did not return array');
    if (!Array.isArray(products)) issues.push('getProducts_ did not return array');
    if (!Array.isArray(expenses)) issues.push('getExpenses_ did not return array');
    if (!Array.isArray(boardDays)) issues.push('getBoardDays_ did not return array');
    if (boardSnapshot.status !== 'success' || !Array.isArray(boardSnapshot.items)) {
      issues.push('getBoardSnapshot_ did not return success/items');
    }
    if (!cleanString_(boardSnapshot.board_rev)) {
      issues.push('getBoardSnapshot_ board_rev missing');
    }
    if (
      clientConfig.status !== 'success' ||
      !clientConfig.flags ||
      typeof clientConfig.flags.board_snapshot_enabled !== 'boolean' ||
      typeof clientConfig.flags.board_skip_nochange_render_enabled !== 'boolean' ||
      typeof clientConfig.flags.board_incremental_render_enabled !== 'boolean' ||
      typeof clientConfig.flags.board_delta_sync_enabled !== 'boolean'
    ) {
      issues.push('getClientConfig_ did not return valid flags');
    }

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

    // 7) BoardDays backfill includes all distinct orders.delivery_date values
    const boardDaySet = {};
    (boardDays || []).forEach(function (d) {
      const key = normalizeDateInput_(d.day_key);
      if (key) boardDaySet[key] = true;
    });
    const orderDaySet = {};
    (orders || []).forEach(function (o) {
      const key = normalizeDateInput_(o.delivery_date);
      if (key) orderDaySet[key] = true;
    });
    const missingBoardDays = Object.keys(orderDaySet).filter(function (key) {
      return !boardDaySet[key];
    });
    if (missingBoardDays.length > 0) {
      issues.push('BoardDays missing delivery_date keys: ' + missingBoardDays.join(', '));
    }

    if (issues.length > 0) {
      return fail_('Smoke tests found issues: ' + issues.join(' | '));
    }

    return ok_({
      message: 'Smoke tests passed',
      metrics: {
        orders: orders.length,
        products: products.length,
        expenses: expenses.length,
        board_days: boardDays.length
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
    { id: 'P001', name: 'Quesadilla Salvadoreña (1/4 Regular)', price: 9, category: 'Food', active: true },
    { id: 'P002', name: 'Pan Francés (Docena)', price: 10, category: 'Food', active: true },
    { id: 'P003', name: 'Semita Alta (1/4 Regular)', price: 10, category: 'Food', active: true },
    { id: 'P004', name: 'Delivery Fee', price: 5, category: 'Delivery', active: true }
  ];

  const rows = demo.map(function (p) {
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

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  return ok_({ message: 'Demo products seeded', inserted: rows.length });
}

function adminMigrateLegacySheetById(payload) {
  const spreadsheetId = cleanString_((payload && payload.spreadsheet_id) || payload);
  if (!spreadsheetId) return fail_('spreadsheet_id is required');
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

function adminImportProductsFromSpreadsheet(payload) {
  const sourceSpreadsheetId = cleanString_(payload && payload.source_spreadsheet_id);
  const sourceGid = cleanString_(payload && payload.source_gid) || '0';
  if (!sourceSpreadsheetId) {
    return fail_('source_spreadsheet_id is required');
  }

  const csvUrl = 'https://docs.google.com/spreadsheets/d/' + sourceSpreadsheetId + '/export?format=csv&gid=' + encodeURIComponent(sourceGid);
  const resp = UrlFetchApp.fetch(csvUrl, { muteHttpExceptions: true });
  if (resp.getResponseCode() !== 200) {
    return fail_('Unable to fetch source products CSV. HTTP ' + resp.getResponseCode());
  }

  const csvText = resp.getContentText() || '';
  const rows = Utilities.parseCsv(csvText);
  if (!rows || rows.length < 2) {
    return fail_('Source sheet has no data rows');
  }

  const header = (rows[0] || []).map(cleanString_);
  const idIdx = header.indexOf('id');
  const nameIdx = header.indexOf('name');
  const priceIdx = header.indexOf('price');
  const categoryIdx = header.indexOf('category');
  if (nameIdx < 0 || priceIdx < 0) {
    return fail_('Source CSV must include at least name and price columns');
  }

  const incoming = [];
  rows.slice(1).forEach(function (row) {
    const name = cleanString_(row[nameIdx]);
    if (!name) return;
    const category = cleanString_(categoryIdx >= 0 ? row[categoryIdx] : '') || 'General';
    const family = inferFamilyMeta_(name, category);
    const rec = {
      id: idIdx >= 0 ? cleanString_(row[idIdx]) : '',
      name: name,
      price: normalizeNumber_(row[priceIdx], 0),
      category: category,
      family_key: family.family_key,
      family_label: family.family_label,
      family_color: family.family_color,
      family_order: family.family_order,
      variant_order: family.variant_order,
      active: true
    };
    if (rec.category.toLowerCase() === 'delivery') rec.category = 'Delivery';
    incoming.push(rec);
  });

  if (!incoming.length) {
    return fail_('No valid product rows found in source');
  }

  const ss = getSpreadsheet_();
  ensureSheetHeaders_(ss, CONFIG.SHEETS.PRODUCTS, CONFIG.PRODUCT_HEADERS);
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  const map = headerMap_(sheet);
  const lastCol = sheet.getLastColumn();
  const existing = dataRows_(sheet);

  const byId = {};
  const byName = {};
  for (let i = 0; i < existing.length; i += 1) {
    const row = existing[i];
    const id = cleanString_(row[map.id]).toLowerCase();
    const name = cleanString_(row[map.name]).toLowerCase();
    if (id) byId[id] = i;
    if (name) byName[name] = i;
  }

  let updated = 0;
  let inserted = 0;
  const newRows = [];

  incoming.forEach(function (p, idx) {
    const idKey = cleanString_(p.id).toLowerCase();
    const nameKey = cleanString_(p.name).toLowerCase();
    let targetIdx = -1;
    if (idKey && byId[idKey] !== undefined) {
      targetIdx = byId[idKey];
    } else if (nameKey && byName[nameKey] !== undefined) {
      targetIdx = byName[nameKey];
    }

    if (targetIdx >= 0) {
      const row = existing[targetIdx];
      if (!cleanString_(row[map.id])) row[map.id] = p.id || ('P-IMP-' + String(targetIdx + 1).padStart(3, '0'));
      row[map.name] = p.name;
      row[map.price] = p.price;
      row[map.category] = p.category;
      if (map.family_key !== undefined) row[map.family_key] = p.family_key;
      if (map.family_label !== undefined) row[map.family_label] = p.family_label;
      if (map.family_color !== undefined) row[map.family_color] = p.family_color;
      if (map.family_order !== undefined) row[map.family_order] = p.family_order;
      if (map.variant_order !== undefined) row[map.variant_order] = p.variant_order;
      if (map.active !== undefined) row[map.active] = true;
      updated += 1;
      return;
    }

    const generatedId = p.id || ('P-IMP-' + String(idx + 1).padStart(3, '0'));
    newRows.push(objectToRow_({
      id: generatedId,
      name: p.name,
      price: p.price,
      category: p.category,
      family_key: p.family_key,
      family_label: p.family_label,
      family_color: p.family_color,
      family_order: p.family_order,
      variant_order: p.variant_order,
      active: true
    }, CONFIG.PRODUCT_HEADERS));
    inserted += 1;
  });

  if (existing.length > 0) {
    sheet.getRange(2, 1, existing.length, lastCol).setValues(existing);
  }
  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }

  return ok_({
    message: 'Products imported',
    source_spreadsheet_id: sourceSpreadsheetId,
    source_gid: sourceGid,
    imported_rows: incoming.length,
    updated: updated,
    inserted: inserted,
    total_products_after: Math.max(sheet.getLastRow() - 1, 0)
  });
}

function adminUpsertProducts(payload) {
  const products = (payload && payload.products) || [];
  if (!Array.isArray(products) || products.length === 0) {
    return fail_('products array is required');
  }

  const ss = getSpreadsheet_();
  ensureSheetHeaders_(ss, CONFIG.SHEETS.PRODUCTS, CONFIG.PRODUCT_HEADERS);
  const sheet = getSheet_(CONFIG.SHEETS.PRODUCTS);
  const map = headerMap_(sheet);
  const lastCol = sheet.getLastColumn();
  const existing = dataRows_(sheet);

  const byId = {};
  const byName = {};
  for (let i = 0; i < existing.length; i += 1) {
    const row = existing[i];
    const id = cleanString_(row[map.id]).toLowerCase();
    const name = cleanString_(row[map.name]).toLowerCase();
    if (id) byId[id] = i;
    if (name) byName[name] = i;
  }

  let updated = 0;
  let inserted = 0;
  const newRows = [];

  products.forEach(function (raw, idx) {
    const category = cleanString_(raw.category) || 'General';
    const family = inferFamilyMeta_(raw.name, category);
    const p = {
      id: cleanString_(raw.id),
      name: cleanString_(raw.name),
      price: normalizeNumber_(raw.price, 0),
      category: category,
      family_key: cleanString_(raw.family_key) || family.family_key,
      family_label: cleanString_(raw.family_label) || family.family_label,
      family_color: cleanString_(raw.family_color) || family.family_color,
      family_order: normalizeNumber_(raw.family_order, family.family_order),
      variant_order: normalizeNumber_(raw.variant_order, family.variant_order),
      active: raw.active === undefined ? true : !!raw.active
    };
    if (!p.name) return;
    if (p.category.toLowerCase() === 'delivery') p.category = 'Delivery';
    const idKey = p.id.toLowerCase();
    const nameKey = p.name.toLowerCase();

    let targetIdx = -1;
    if (idKey) {
      if (byId[idKey] !== undefined) targetIdx = byId[idKey];
    } else if (nameKey && byName[nameKey] !== undefined) {
      targetIdx = byName[nameKey];
    }

    if (targetIdx >= 0) {
      const row = existing[targetIdx];
      if (!cleanString_(row[map.id])) row[map.id] = p.id || ('P-IMP-' + String(targetIdx + 1).padStart(3, '0'));
      row[map.name] = p.name;
      row[map.price] = p.price;
      row[map.category] = p.category;
      if (map.family_key !== undefined) row[map.family_key] = p.family_key;
      if (map.family_label !== undefined) row[map.family_label] = p.family_label;
      if (map.family_color !== undefined) row[map.family_color] = p.family_color;
      if (map.family_order !== undefined) row[map.family_order] = p.family_order;
      if (map.variant_order !== undefined) row[map.variant_order] = p.variant_order;
      if (map.active !== undefined) row[map.active] = p.active;
      updated += 1;
      return;
    }

    const generatedId = p.id || ('P-IMP-' + String(idx + 1).padStart(3, '0'));
    newRows.push(objectToRow_({
      id: generatedId,
      name: p.name,
      price: p.price,
      category: p.category,
      family_key: p.family_key,
      family_label: p.family_label,
      family_color: p.family_color,
      family_order: p.family_order,
      variant_order: p.variant_order,
      active: p.active
    }, CONFIG.PRODUCT_HEADERS));
    inserted += 1;
  });

  if (existing.length > 0) {
    sheet.getRange(2, 1, existing.length, lastCol).setValues(existing);
  }
  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }

  return ok_({
    message: 'Products upserted',
    received: products.length,
    updated: updated,
    inserted: inserted,
    total_products_after: Math.max(sheet.getLastRow() - 1, 0)
  });
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
