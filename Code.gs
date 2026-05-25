/**
 * NATUR MILK — Orders web app (Sheets + owner action buttons)
 * Paste into script.google.com, set Script Properties, redeploy web app (New version).
 */

var DEFAULT_SPREADSHEET_ID = '18CJQS22tnPF80q4CId1-lrTA9HvWtwaTFacDZ3e0x-g';
var DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwfbY5FgZDjjGKdwPBF278tf6MN9g7xynqwss21xWdIdvIQqD8M1iM-jARFUXrrPNc_9A/exec';
var DEFAULT_OWNER_EMAIL = 'naturmilk.shop@gmail.com';
var SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/18CJQS22tnPF80q4CId1-lrTA9HvWtwaTFacDZ3e0x-g/edit';
var LOGO_URL = 'https://naturmilk.shop/images/logo.png';
var ORDERS_SHEET_NAME = 'Orders';

// Scan-friendly: status & phone first, items multiline, newest row at top (insert row 2)
var HEADERS = [
  'Status', 'Date', 'Order ID', 'Phone', 'Name', 'Address', 'Delivery',
  'Items', 'Total ₾', 'Products ₾', 'Delivery ₾', 'Email', 'Comment', 'Updated', 'Token'
];

var COL = {
  STATUS: 1,
  TIMESTAMP: 2,
  ORDER_ID: 3,
  PHONE: 4,
  NAME: 5,
  ADDRESS: 6,
  DELIVERY_TYPE: 7,
  ITEMS: 8,
  TOTAL: 9,
  SUBTOTAL: 10,
  DELIVERY_FEE: 11,
  EMAIL: 12,
  COMMENT: 13,
  ACTION_AT: 14,
  TOKEN: 15
};

var OLD_COL = {
  ORDER_ID: 1,
  TIMESTAMP: 2,
  STATUS: 3,
  NAME: 4,
  EMAIL: 5,
  PHONE: 6,
  ADDRESS: 7,
  COMMENT: 8,
  DELIVERY_TYPE: 9,
  ITEMS_SUMMARY: 10,
  ITEMS_JSON: 11,
  SUBTOTAL: 13,
  DELIVERY_FEE: 14,
  TOTAL: 15,
  TOKEN: 16,
  ACTION_AT: 17
};

var ACTION_TO_STATUS = {
  confirm: 'Confirmed',
  hold: 'On Hold',
  decline: 'Declined'
};

// ─── Config ───────────────────────────────────────────────────────────────────

function getProp(key) {
  var val = PropertiesService.getScriptProperties().getProperty(key);
  if (val) return val;
  if (key === 'SPREADSHEET_ID') return DEFAULT_SPREADSHEET_ID;
  if (key === 'WEB_APP_URL') return DEFAULT_WEB_APP_URL;
  if (key === 'OWNER_EMAIL') return DEFAULT_OWNER_EMAIL;
  return null;
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(getProp('SPREADSHEET_ID'));
}

function getOrdersSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet.getName() !== ORDERS_SHEET_NAME) {
      try {
        sheet.setName(ORDERS_SHEET_NAME);
      } catch (e) {
        // keep first sheet name if rename fails
      }
    }
  }
  return sheet;
}

// ─── Setup (run once from editor optional) ────────────────────────────────────

function isOldSheetLayout(sheet) {
  return String(sheet.getRange(1, 1).getValue() || '').trim() === 'Order ID';
}

function isNewSheetLayout(sheet) {
  return String(sheet.getRange(1, 1).getValue() || '').trim() === 'Status';
}

function setupSheetIfNeeded() {
  var sheet = getOrdersSheet();
  if (isOldSheetLayout(sheet)) return;
  if (sheet.getLastRow() === 0 || !sheet.getRange(1, 1).getValue()) {
    writeSheetHeaders(sheet);
  } else if (!isNewSheetLayout(sheet)) {
    writeSheetHeaders(sheet);
  }
}

function writeSheetHeaders(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  applySheetFormatting(sheet);
}

function applySheetFormatting(sheet) {
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  header.setFontWeight('bold').setBackground('#065924').setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(COL.STATUS, 110);
  sheet.setColumnWidth(COL.TIMESTAMP, 150);
  sheet.setColumnWidth(COL.ORDER_ID, 175);
  sheet.setColumnWidth(COL.PHONE, 120);
  sheet.setColumnWidth(COL.NAME, 140);
  sheet.setColumnWidth(COL.ADDRESS, 220);
  sheet.setColumnWidth(COL.DELIVERY_TYPE, 160);
  sheet.setColumnWidth(COL.ITEMS, 320);
  sheet.setColumnWidth(COL.TOTAL, 80);
  sheet.setColumnWidth(COL.SUBTOTAL, 90);
  sheet.setColumnWidth(COL.DELIVERY_FEE, 80);
  sheet.setColumnWidth(COL.EMAIL, 180);
  sheet.setColumnWidth(COL.COMMENT, 160);
  sheet.setColumnWidth(COL.ACTION_AT, 150);
  sheet.setColumnWidth(COL.TOKEN, 80);

  var lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, COL.ITEMS, lastRow, COL.ITEMS).setWrap(true).setVerticalAlignment('top');
  sheet.getRange(2, COL.PHONE, lastRow, COL.PHONE).setNumberFormat('@');
  sheet.getRange(2, COL.TIMESTAMP, lastRow, COL.TIMESTAMP).setNumberFormat('yyyy-mm-dd hh:mm');
  sheet.getRange(2, 1, lastRow, HEADERS.length).setVerticalAlignment('top');

  applyStatusFormatting(sheet, lastRow);
}

function applyStatusFormatting(sheet, lastRow) {
  var range = sheet.getRange(2, COL.STATUS, Math.max(lastRow, 2), COL.STATUS);
  var rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pending')
      .setBackground('#fff3cd')
      .setFontColor('#856404')
      .setRanges([range])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Confirmed')
      .setBackground('#d4edda')
      .setFontColor('#155724')
      .setRanges([range])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('On Hold')
      .setBackground('#ffe8cc')
      .setFontColor('#b45309')
      .setRanges([range])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Declined')
      .setBackground('#f8d7da')
      .setFontColor('#721c24')
      .setRanges([range])
      .build()
  ];
  sheet.setConditionalFormatRules(rules);
}

function setupSheet() {
  var sheet = getOrdersSheet();
  if (isOldSheetLayout(sheet)) {
    throw new Error('Old layout detected. Run rebuildOrdersSheet() once (archives old tab).');
  }
  writeSheetHeaders(sheet);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLineAmount(item) {
  if (item.lineTotal != null && item.lineTotal !== '') {
    return Number(item.lineTotal);
  }
  return Number(item.price || 0) * Number(item.qty || 0);
}

function formatMoney(n) {
  return parseFloat(Number(n).toFixed(2));
}

function formatItemLabel(item) {
  if (item.unit === 'per-kg' && item.qtyLabel) {
    return item.qtyLabel + ' ' + item.name;
  }
  return item.qty + 'x ' + item.name;
}

function formatItemsSummary(items) {
  return items.map(function(item) {
    return formatItemLabel(item) + ' — ' + formatMoney(getLineAmount(item)) + '₾';
  }).join('; ');
}

/** One item per line in the Sheet cell (wrap text) — easy to scan */
function formatItemsForSheet(items) {
  return items.map(function(item) {
    return '• ' + formatItemLabel(item) + ' — ' + formatMoney(getLineAmount(item)) + ' ₾';
  }).join('\n');
}

function formatPhone(phone) {
  if (phone === null || phone === undefined || phone === '') return '';
  return String(phone).replace(/\.0$/, '').trim();
}

function formatItemsCellFromLegacy(summary, jsonRaw) {
  if (jsonRaw) {
    try {
      var items = JSON.parse(jsonRaw);
      if (items && items.length) return formatItemsForSheet(items);
    } catch (e) {}
  }
  if (!summary) return '';
  return String(summary).split(';').map(function(part) {
    return '• ' + String(part).trim();
  }).join('\n');
}

function buildOrderRowValues(data, orderId, token, status, timestamp, actionAt) {
  var items = data.items || [];
  var delivery = Number(data.delivery) || 0;
  var total = Number(data.total) || 0;
  var subtotal = formatMoney(total - delivery);
  return [
    status || 'Pending',
    timestamp,
    orderId,
    formatPhone(data.phone),
    data.name || '',
    data.address || '',
    data.deliveryType || '',
    formatItemsForSheet(items),
    formatMoney(total),
    subtotal,
    delivery,
    data.email || '',
    data.comment || '',
    actionAt || '',
    token
  ];
}

function formatItemRowsHtml(items, useQtyLabel) {
  return items.map(function(item) {
    var label = useQtyLabel ? formatItemLabel(item) : (item.qty + 'x ' + item.name);
    var amount = formatMoney(getLineAmount(item));
    return '<tr>' +
      '<td style="padding:10px 14px; border-bottom:1px solid #e8f4ec; font-size:15px;">' +
        escapeHtml(label) + '</td>' +
      '<td style="padding:10px 14px; border-bottom:1px solid #e8f4ec; text-align:right; font-weight:700; font-size:15px;">' +
        amount + ' ₾</td>' +
    '</tr>';
  }).join('');
}

function formatItemLinesPlain(items, useQtyLabel) {
  return items.map(function(item) {
    var label = useQtyLabel ? formatItemLabel(item) : (item.qty + 'x ' + item.name);
    return label + ' — ' + formatMoney(getLineAmount(item)) + '₾';
  }).join('\n');
}

function generateOrderId() {
  var now = new Date();
  var tz = Session.getScriptTimeZone() || 'Asia/Tbilisi';
  var datePart = Utilities.formatDate(now, tz, 'yyyyMMdd');
  var timePart = Utilities.formatDate(now, tz, 'HHmm');
  var suffix = Utilities.getUuid().slice(0, 4);
  return 'NM-' + datePart + '-' + timePart + suffix;
}

function generateToken(orderId) {
  var secret = getProp('ACTION_SECRET');
  if (!secret) {
    throw new Error('ACTION_SECRET script property is not set');
  }
  var sig = Utilities.computeHmacSha256Signature(orderId, secret);
  return Utilities.base64EncodeWebSafe(sig).replace(/=+$/, '');
}

function tokensMatch(stored, provided) {
  if (!stored || !provided) return false;
  return String(stored) === String(provided);
}

function buildActionUrl(action, orderId, token) {
  var base = getProp('WEB_APP_URL');
  return base +
    '?action=' + encodeURIComponent(action) +
    '&id=' + encodeURIComponent(orderId) +
    '&token=' + encodeURIComponent(token);
}

function findOrderRow(sheet, orderId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var idCol = isNewSheetLayout(sheet) ? COL.ORDER_ID : OLD_COL.ORDER_ID;
  var ids = sheet.getRange(2, idCol, lastRow, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(orderId)) {
      return i + 2;
    }
  }
  return -1;
}

function appendOrderRow(data, orderId, token) {
  setupSheetIfNeeded();
  var sheet = getOrdersSheet();
  if (isOldSheetLayout(sheet)) {
    throw new Error('Sheet still uses old columns. Run rebuildOrdersSheet() from the script editor.');
  }
  var tz = Session.getScriptTimeZone() || 'Asia/Tbilisi';
  var timestamp = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
  var rowValues = buildOrderRowValues(data, orderId, token, 'Pending', timestamp, '');

  sheet.insertRowBefore(2);
  sheet.getRange(2, 1, 1, HEADERS.length).setValues([rowValues]);
  applySheetFormatting(sheet);

  return timestamp;
}

function updateOrderStatus(sheet, row, status) {
  var tz = Session.getScriptTimeZone() || 'Asia/Tbilisi';
  var actionAt = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
  var statusCol = isNewSheetLayout(sheet) ? COL.STATUS : OLD_COL.STATUS;
  var actionCol = isNewSheetLayout(sheet) ? COL.ACTION_AT : OLD_COL.ACTION_AT;
  sheet.getRange(row, statusCol).setValue(status);
  sheet.getRange(row, actionCol).setValue(actionAt);
  if (isNewSheetLayout(sheet)) {
    applyStatusFormatting(sheet, sheet.getLastRow());
  }
  return actionAt;
}

/**
 * One-time: archive current tab, create scan-friendly Orders sheet, migrate rows.
 * Run from Apps Script editor: rebuildOrdersSheet
 */
function rebuildOrdersSheet() {
  var ss = getSpreadsheet();
  var oldSheet = getOrdersSheet();
  var archiveName = 'Orders Archive ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Tbilisi', 'yyyy-MM-dd');
  if (ss.getSheetByName(archiveName)) {
    archiveName = archiveName + ' ' + Utilities.getUuid().slice(0, 4);
  }
  oldSheet.setName(archiveName);

  var newSheet = ss.insertSheet(ORDERS_SHEET_NAME, 0);
  writeSheetHeaders(newSheet);

  var lastRow = oldSheet.getLastRow();
  if (lastRow < 2) return;

  var migrated = [];
  var oldHeader = String(oldSheet.getRange(1, 1).getValue() || '');
  var useOldMap = oldHeader === 'Order ID';

  for (var r = 2; r <= lastRow; r++) {
    var row = oldSheet.getRange(r, 1, r, oldSheet.getLastColumn()).getValues()[0];
    if (!row[0] && !row[2]) continue;

    if (useOldMap) {
      migrated.push([
        row[OLD_COL.STATUS - 1] || 'Pending',
        row[OLD_COL.TIMESTAMP - 1],
        row[OLD_COL.ORDER_ID - 1],
        formatPhone(row[OLD_COL.PHONE - 1]),
        row[OLD_COL.NAME - 1],
        row[OLD_COL.ADDRESS - 1],
        row[OLD_COL.DELIVERY_TYPE - 1],
        formatItemsCellFromLegacy(row[OLD_COL.ITEMS_SUMMARY - 1], row[OLD_COL.ITEMS_JSON - 1]),
        row[OLD_COL.TOTAL - 1],
        row[OLD_COL.SUBTOTAL - 1],
        row[OLD_COL.DELIVERY_FEE - 1],
        row[OLD_COL.EMAIL - 1],
        row[OLD_COL.COMMENT - 1],
        row[OLD_COL.ACTION_AT - 1] || '',
        row[OLD_COL.TOKEN - 1]
      ]);
    }
  }

  if (migrated.length) {
    migrated.sort(function(a, b) {
      return String(b[1]).localeCompare(String(a[1]));
    });
    newSheet.getRange(2, 1, migrated.length, HEADERS.length).setValues(migrated);
  }

  applySheetFormatting(newSheet);
  Logger.log('Rebuilt Orders. Archived tab: ' + archiveName + '. Migrated rows: ' + migrated.length);
}

// ─── Shared email blocks ──────────────────────────────────────────────────────

function buildHeaderBlock() {
  return '<div style="background:#065924; padding:28px 32px; text-align:center; border-radius:14px 14px 0 0;">' +
    '<img src="' + LOGO_URL + '" alt="Natur Milk" style="height:64px; object-fit:contain; display:block; margin:0 auto 10px;" />' +
    '<div style="font-size:11px; letter-spacing:3px; color:#a8e6bf; text-transform:uppercase;">სუფთა ნედლეულით — ყოველდღიური ზრუნვით</div>' +
  '</div>';
}

function buildFooterBlock() {
  return '<div style="background:#F7FFFA; border-top:3px solid #065924; padding:22px 32px; text-align:center; border-radius:0 0 14px 14px;">' +
    '<div style="font-size:22px; font-weight:800; color:#065924; letter-spacing:3px;">NATUR MILK</div>' +
    '<div style="font-size:13px; color:#888; margin-top:6px;">naturmilk.shop@gmail.com</div>' +
    '<div style="font-size:12px; color:#aaa; margin-top:4px;">naturmilk.shop</div>' +
  '</div>';
}

function buildItemsTable(itemRowsHtml) {
  return '<table style="width:100%; border-collapse:collapse; font-size:15px; margin-top:8px;">' +
    '<thead>' +
      '<tr style="background:#F7FFFA;">' +
        '<th style="padding:10px 14px; text-align:left; color:#065924; font-size:13px; text-transform:uppercase; letter-spacing:1px;">პროდუქტი</th>' +
        '<th style="padding:10px 14px; text-align:right; color:#065924; font-size:13px; text-transform:uppercase; letter-spacing:1px;">თანხა</th>' +
      '</tr>' +
    '</thead>' +
    '<tbody>' + itemRowsHtml + '</tbody>' +
  '</table>';
}

function buildDeliveryRow(isDelivery, deliveryText) {
  if (isDelivery) {
    return '<tr>' +
      '<td style="padding:6px 0; color:#777;">მიწოდება <span style="font-size:12px; color:#e07b00; font-style:italic;">— კურიერთან გადასახადი ამანათის მიღების დროს</span></td>' +
      '<td style="text-align:right; color:#555;">' + escapeHtml(deliveryText) + '</td>' +
    '</tr>';
  }
  return '<tr>' +
    '<td style="padding:6px 0; color:#777;">მიწოდება</td>' +
    '<td style="text-align:right; color:#555;">უფასო</td>' +
  '</tr>';
}

// ─── Owner email ──────────────────────────────────────────────────────────────

function buildOwnerHtml(data, orderId, timestamp, token) {
  var customerName = escapeHtml(data.name || 'მომხმარებელი');
  var phone = escapeHtml(data.phone || '');
  var address = escapeHtml(data.address || '');
  var customerEmail = escapeHtml(data.email || '');
  var comment = escapeHtml(data.comment || '');
  var deliveryType = escapeHtml(data.deliveryType || '');
  var items = data.items || [];
  var delivery = Number(data.delivery) || 0;
  var total = Number(data.total) || 0;
  var itemsSubtotal = formatMoney(total - delivery);
  var deliveryText = delivery === 0 ? 'უფასო' : delivery + ' ₾';
  var isDelivery = delivery > 0;

  var itemRows = formatItemRowsHtml(items, true);
  var itemsTable = buildItemsTable(itemRows);
  var deliveryRow = buildDeliveryRow(isDelivery, deliveryText);

  var totalsBlock =
    '<table style="width:100%; font-size:15px; margin-top:16px; border-collapse:collapse;">' +
      '<tr><td style="padding:6px 0; color:#777;">პროდუქტების ჯამი</td><td style="text-align:right; color:#555;">' + itemsSubtotal + ' ₾</td></tr>' +
      deliveryRow +
      '<tr>' +
        '<td style="padding:14px 0 6px; font-size:19px; font-weight:800; color:#065924;">სულ (მიწოდებით)</td>' +
        '<td style="text-align:right; font-size:19px; font-weight:800; color:#065924;">' + formatMoney(total) + ' ₾</td>' +
      '</tr>' +
    '</table>';

  var btnStyle = 'display:inline-block; padding:14px 22px; margin:6px 4px; font-size:15px; font-weight:700; text-decoration:none; border-radius:10px;';
  var actionButtons =
    '<div style="text-align:center; margin:28px 0 8px;">' +
      '<a href="' + buildActionUrl('confirm', orderId, token) + '" style="' + btnStyle + ' background:#065924; color:#fff;">✅ დადასტურება</a>' +
      '<a href="' + buildActionUrl('hold', orderId, token) + '" style="' + btnStyle + ' background:#e07b00; color:#fff;">⏸ გაჩერება</a>' +
      '<a href="' + buildActionUrl('decline', orderId, token) + '" style="' + btnStyle + ' background:#b3261e; color:#fff;">❌ უარყოფა</a>' +
    '</div>' +
    '<p style="text-align:center; font-size:13px; color:#888; margin:8px 0 0;">სტატუსი განახლდება Google Sheet-ში. მომხმარებელს ავტომატური წერილი არ გაიგზავნება.</p>';

  return '<div style="font-family:Arial,sans-serif; max-width:580px; margin:auto; border:1px solid #e8f4ec; border-radius:14px; overflow:hidden;">' +
    buildHeaderBlock() +
    '<div style="padding:28px 32px; background:#ffffff;">' +
      '<h2 style="color:#065924; margin:0 0 12px; font-size:20px;">ახალი შეკვეთა შემოვიდა!</h2>' +
      '<div style="background:#F7FFFA; border:1px solid #d9eee1; border-radius:10px; padding:14px 18px; margin-bottom:20px;">' +
        '<div style="font-size:13px; color:#777; margin-bottom:4px;">შეკვეთის ნომერი</div>' +
        '<div style="font-size:22px; font-weight:800; color:#065924;">' + escapeHtml(orderId) + '</div>' +
        '<div style="font-size:14px; color:#555; margin-top:8px;">' + escapeHtml(timestamp) + '</div>' +
        '<span style="display:inline-block; margin-top:10px; padding:6px 14px; background:#fff3cd; color:#856404; border-radius:20px; font-size:13px; font-weight:700;">სტატუსი: Pending</span>' +
      '</div>' +
      '<table style="width:100%; font-size:15px; border-collapse:collapse; margin-bottom:20px;">' +
        '<tr><td style="padding:7px 0; color:#777; width:130px;">სახელი</td><td style="padding:7px 0; font-weight:700;">' + customerName + '</td></tr>' +
        '<tr><td style="padding:7px 0; color:#777;">ტელეფონი</td><td style="padding:7px 0; font-weight:700;">' + phone + '</td></tr>' +
        '<tr><td style="padding:7px 0; color:#777;">მისამართი</td><td style="padding:7px 0; font-weight:700;">' + address + '</td></tr>' +
        (customerEmail ? '<tr><td style="padding:7px 0; color:#777;">ელ-ფოსტა</td><td style="padding:7px 0; font-weight:700;">' + customerEmail + '</td></tr>' : '') +
        (deliveryType ? '<tr><td style="padding:7px 0; color:#777;">მიწოდება</td><td style="padding:7px 0; font-weight:700;">' + deliveryType + '</td></tr>' : '') +
        (comment ? '<tr><td style="padding:7px 0; color:#777;">კომენტარი</td><td style="padding:7px 0; font-weight:700;">' + comment + '</td></tr>' : '') +
        '<tr><td style="padding:7px 0; color:#777;">პოზიციები</td><td style="padding:7px 0; font-weight:700;">' + items.length + '</td></tr>' +
      '</table>' +
      '<h3 style="color:#065924; margin:0 0 8px; font-size:16px;">შეკვეთის დეტალები</h3>' +
      itemsTable +
      totalsBlock +
      actionButtons +
      '<p style="text-align:center; margin-top:20px;">' +
        '<a href="' + SHEET_EDIT_URL + '" style="color:#065924; font-weight:700; font-size:15px;">გახსენი შეკვეთები Google Sheet-ში</a>' +
      '</p>' +
    '</div>' +
    buildFooterBlock() +
  '</div>';
}

// ─── Customer email (same copy/structure; per-kg shows qtyLabel like owner email) ─

function buildCustomerHtml(data) {
  var customerName = escapeHtml(data.name || 'მომხმარებელი');
  var address = escapeHtml(data.address || '');
  var items = data.items || [];
  var delivery = Number(data.delivery) || 0;
  var total = Number(data.total) || 0;
  var itemsSubtotal = formatMoney(total - delivery);
  var deliveryText = delivery === 0 ? 'უფასო' : delivery + ' ₾';
  var isDelivery = delivery > 0;

  var itemRows = formatItemRowsHtml(items, true);
  var itemsTable = buildItemsTable(itemRows);
  var deliveryRow = buildDeliveryRow(isDelivery, deliveryText);

  return '<div style="font-family:Arial,sans-serif; max-width:580px; margin:auto; border:1px solid #e8f4ec; border-radius:14px; overflow:hidden;">' +
    buildHeaderBlock() +
    '<div style="padding:28px 32px; background:#ffffff;">' +
      '<p style="font-size:17px; color:#333; margin:0 0 10px;">გამარჯობა, <strong>' + customerName + '</strong>!</p>' +
      '<p style="font-size:15px; color:#555; line-height:1.8; margin:0 0 24px;">გმადლობთ შეკვეთისთვის. თქვენი შეკვეთა მიღებულია და მალე დაგიკავშირდებით <strong>WhatsApp-ზე</strong>.</p>' +
      '<h3 style="color:#065924; margin:0 0 8px; font-size:16px;">თქვენი შეკვეთა</h3>' +
      itemsTable +
      '<table style="width:100%; font-size:15px; margin-top:16px; border-collapse:collapse;">' +
        '<tr><td style="padding:6px 0; color:#777;">მისამართი</td><td style="text-align:right;">' + address + '</td></tr>' +
        deliveryRow +
        '<tr><td style="padding:14px 0 6px; font-size:19px; font-weight:800; color:#065924;">სულ გადასახდელი</td><td style="text-align:right; font-size:19px; font-weight:800; color:#065924;">' + itemsSubtotal + ' ₾</td></tr>' +
      '</table>' +
      '<div style="background:#F7FFFA; border-left:4px solid #065924; padding:14px 18px; border-radius:8px; margin-top:24px; font-size:13px; color:#555; line-height:1.7;">' +
        'საბოლოო ფასი დადასტურდება შეფუთვის შემდეგ, საბოლოო წონის მიხედვით.<br>' +
      '</div>' +
    '</div>' +
    buildFooterBlock() +
  '</div>';
}

// ─── doGet — owner action links ───────────────────────────────────────────────

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = String(params.action || '').toLowerCase();
    var orderId = String(params.id || '');
    var token = String(params.token || '');

    if (!ACTION_TO_STATUS[action]) {
      return htmlResponse('არასწორი მოთხოვნა', 'მოქმედება ვერ იდენტიფიცირდა.', '', false);
    }
    if (!orderId || !token) {
      return htmlResponse('არასწორი ბმული', 'ბმული არასრულია.', '', false);
    }

    setupSheetIfNeeded();
    var sheet = getOrdersSheet();
    var row = findOrderRow(sheet, orderId);
    if (row < 0) {
      return htmlResponse('არასწორი ბმული', 'შეკვეთა ვერ მოიძებნა.', '', false);
    }

    var storedToken = sheet.getRange(row, COL.TOKEN).getValue();
    if (!tokensMatch(storedToken, token)) {
      return htmlResponse('არასწორი ბმული', 'ბმულის ვალიდაცია ვერ მოხერხდა.', '', false);
    }

    var newStatus = ACTION_TO_STATUS[action];
    var currentStatus = String(sheet.getRange(row, COL.STATUS).getValue() || '');

    if (currentStatus === newStatus) {
      return htmlResponse(
        'უკვე განახლებულია',
        'შეკვეთა <strong>' + escapeHtml(orderId) + '</strong> უკვე აქვს სტატუსი: <strong>' + escapeHtml(currentStatus) + '</strong>.',
        currentStatus,
        true
      );
    }

    updateOrderStatus(sheet, row, newStatus);

    var titles = {
      confirm: 'შეკვეთა დადასტურდა',
      hold: 'შეკვეთა გაჩერებულია',
      decline: 'შეკვეთა უარყოფილია'
    };

    return htmlResponse(
      titles[action],
      'შეკვეთა <strong>' + escapeHtml(orderId) + '</strong> — ახალი სტატუსი: <strong>' + escapeHtml(newStatus) + '</strong>.',
      newStatus,
      true
    );
  } catch (err) {
    Logger.log('doGet error: ' + err.message);
    return htmlResponse('შეცდომა', 'დაფიქსირდა შეცდომა. სცადეთ მოგვიანებით.', '', false);
  }
}

function htmlResponse(title, message, status, success) {
  var color = success ? '#065924' : '#b3261e';
  var html = '<!DOCTYPE html><html lang="ka"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + escapeHtml(title) + ' — Natur Milk</title></head>' +
    '<body style="font-family:Arial,sans-serif; background:#f5faf7; padding:24px; margin:0;">' +
    '<div style="max-width:480px; margin:40px auto; background:#fff; border:1px solid #e8f4ec; border-radius:14px; padding:32px; text-align:center;">' +
    '<img src="' + LOGO_URL + '" alt="Natur Milk" style="height:56px; margin-bottom:16px;" />' +
    '<h1 style="color:' + color + '; font-size:22px; margin:0 0 16px;">' + escapeHtml(title) + '</h1>' +
    '<p style="color:#444; font-size:16px; line-height:1.6;">' + message + '</p>' +
    (status ? '<p style="margin-top:20px; font-size:15px; color:#555;">სტატუსი Sheet-ში: <strong style="color:#065924;">' + escapeHtml(status) + '</strong></p>' : '') +
    '<p style="margin-top:28px;"><a href="' + SHEET_EDIT_URL + '" style="color:#065924; font-weight:700;">გახსენი Google Sheet</a></p>' +
    '</div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle(title + ' — Natur Milk');
}

// ─── doPost — checkout webhook ────────────────────────────────────────────────

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Empty request body');
    }

    var data = JSON.parse(e.postData.contents);

    var customerEmail = data.email || '';
    var customerName = data.name || 'მომხმარებელი';
    var phone = data.phone || '';
    var address = data.address || '';
    var items = data.items || [];
    var total = Number(data.total) || 0;
    var delivery = Number(data.delivery) || 0;
    var comment = data.comment || '';

    var itemsSubtotal = formatMoney(total - delivery);
    var deliveryText = delivery === 0 ? 'უფასო' : delivery + ' ₾';

    var orderId = generateOrderId();
    var token = generateToken(orderId);

    var timestamp = appendOrderRow(data, orderId, token);

    var itemLines = formatItemLinesPlain(items, true);
    var itemLinesCustomer = formatItemLinesPlain(items, true);

    var ownerHtml = buildOwnerHtml(data, orderId, timestamp, token);
    var ownerPlain =
      'ახალი შეკვეთა: ' + orderId + '\n' +
      customerName + '\n' + phone + '\n' + address + '\n' +
      (data.deliveryType ? 'მიწოდება: ' + data.deliveryType + '\n' : '') +
      (comment ? 'კომენტარი: ' + comment + '\n' : '') +
      '\n' + itemLines + '\n\n' +
      'პროდუქტების ჯამი: ' + itemsSubtotal + '₾\n' +
      'მიწოდება: ' + deliveryText + '\n' +
      'სულ: ' + formatMoney(total) + '₾';

    GmailApp.sendEmail(
      getProp('OWNER_EMAIL'),
      'ახალი შეკვეთა — ' + customerName + ' [' + orderId + ']',
      ownerPlain,
      { htmlBody: ownerHtml }
    );

    if (customerEmail) {
      var customerHtml = buildCustomerHtml(data);
      GmailApp.sendEmail(
        customerEmail,
        'გმადლობთ შეკვეთისთვის — Natur Milk',
        'გამარჯობა ' + customerName + '!\n\nგმადლობთ შეკვეთისთვის.\n\n' +
          itemLinesCustomer + '\n\nსულ: ' + itemsSubtotal + ' ₾\nმიწოდება: ' + deliveryText + '\n\nNatur Milk-ის გუნდი',
        { htmlBody: customerHtml }
      );
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Run once: View → Logs, copy value → Script property ACTION_SECRET */
function makeSecret() {
  Logger.log(Utilities.getUuid() + Utilities.getUuid());
}
