/**
 * SKRIP PENJANA AUTOMATIK GOOGLE SHEET TEMPAHAN BILIK KHAS
 * Jalankan fungsi "setupNewBookingSpreadsheet()" ini di Apps Script mana-mana Google Sheet baharu
 * untuk membina 6 tab pangkalan data lengkap dengan header, warna, dan data konfigurasi asas.
 */

function setupNewBookingSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. DataTempahan
  var sData = getOrCreateSheet(ss, "DataTempahan");
  sData.clear();
  var headersData = [
    "ID", "Nama", "Jabatan", "Tujuan", "Urusan", "Tarikh", 
    "Masa Mula", "Masa Tamat", "Bilik", "Status", "Timestamp", 
    "Durasi (jam)", "Email Pemohon", "Dibatalkan Oleh", "Masa Batal", "BatchId"
  ];
  sData.appendRow(headersData);
  formatHeaderRow(sData, "#1e293b", "#ffffff");
  
  // 2. Settings
  var sSet = getOrCreateSheet(ss, "Settings");
  sSet.clear();
  sSet.appendRow(["Key", "Value", "Keterangan"]);
  formatHeaderRow(sSet, "#334155", "#ffffff");
  var defaultSettings = [
    ["developer_name", "Nur Hirzan", "Nama pembangun (papar di footer & popup)"],
    ["developer_role", "Pembangun Sistem", "Jawatan / role pembangun"],
    ["developer_whatsapp", "60122050697", "Format: 60XXXXXXXXX (TANPA +, TANPA 0 depan)"],
    ["developer_telegram", "hirzan_hirzan", "Username Telegram TANPA @"],
    ["developer_email", "pembantugurusmkbsp@gmail.com", "Alamat email untuk dihubungi"],
    ["developer_response_hours", "9 pagi – 5 petang (Isnin – Jumaat)", "Waktu respons perkhidmatan"]
  ];
  defaultSettings.forEach(function(r) { sSet.appendRow(r); });
  
  // 3. Config_Room
  var sRoom = getOrCreateSheet(ss, "Config_Room");
  sRoom.clear();
  sRoom.appendRow(["ID", "Nama Bilik", "Warna (Hex)", "Icon FA"]);
  formatHeaderRow(sRoom, "#4338ca", "#ffffff");
  var defaultRooms = [
    ["R1", "Dewan Putra Gemilang", "#4f46e5", "fa-building-columns"],
    ["R2", "Dewan Terbuka", "#0891b2", "fa-building-columns"],
    ["R3", "Bilik Mesyuarat", "#db2777", "fa-people-group"],
    ["R4", "Foyer Pejabat", "#ea580c", "fa-door-open"],
    ["R5", "Pusat Sumber Sekolah (PSS)", "#16a34a", "fa-book-open-reader"],
    ["R6", "Surau Utama", "#f97316", "fa-mosque"],
    ["R7", "Surau Luar", "#a855f7", "fa-cloud-sun"],
    ["R8", "Bilik Kaunseling", "#ec489a", "fa-heart"],
    ["R9", "Makmal Komputer 1", "#14b8a6", "fa-desktop"],
    ["R10", "Makmal Komputer 2", "#f43f5e", "fa-desktop"],
    ["R11", "Bilik SPBT (Sumber & Teknologi)", "#8b5cf6", "fa-boxes-stacked"],
    ["R12", "Bilik Interaktif iQ-HUB", "#3b82f6", "fa-lightbulb"]
  ];
  defaultRooms.forEach(function(r) { sRoom.appendRow(r); });
  
  // 4. Config_Unit
  var sUnit = getOrCreateSheet(ss, "Config_Unit");
  sUnit.clear();
  sUnit.appendRow(["Unit"]);
  formatHeaderRow(sUnit, "#0f766e", "#ffffff");
  var defaultUnits = [
    ["PENTADBIRAN"],
    ["KURIKULUM"],
    ["KOKURIKULUM"],
    ["PROGRAM PENDIDIKAN KHAS INTEGRASI"],
    ["GURU AKADEMIK BIASA"],
    ["UNIT KAUNSELING"],
    ["LAIN-LAIN"]
  ];
  defaultUnits.forEach(function(r) { sUnit.appendRow(r); });
  
  // 5. Config_Admin
  var sAdmin = getOrCreateSheet(ss, "Config_Admin");
  sAdmin.clear();
  sAdmin.appendRow(["Email Admin"]);
  formatHeaderRow(sAdmin, "#b91c1c", "#ffffff");
  var defaultAdmins = [
    ["pembantugurusmkbsp@gmail.com"],
    ["g-30332006@moe-dl.edu.my"],
    ["admin@system.local"]
  ];
  defaultAdmins.forEach(function(r) { sAdmin.appendRow(r); });
  
  // 6. Cadangan
  var sCadangan = getOrCreateSheet(ss, "Cadangan");
  sCadangan.clear();
  sCadangan.appendRow(["Timestamp", "Nama", "Email", "Kategori", "Cadangan", "User Agent", "Status", "Catatan Admin"]);
  formatHeaderRow(sCadangan, "#475569", "#ffffff");
  
  SpreadsheetApp.getUi().alert("Tahniah! Semua 6 tab pangkalan data Tempahan Bilik Khas telah berjaya dibina dan diformat!");
}

function getOrCreateSheet(ss, name) {
  var s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
  }
  return s;
}

function formatHeaderRow(sheet, bgColor, fontColor) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
  range.setBackground(bgColor)
       .setFontColor(fontColor)
       .setFontWeight("bold")
       .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}
