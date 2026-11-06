/**
 * SISTEM TEMPAHAN BILIK KHAS & FASILITI SEKOLAH (E-TEMPAHAN)
 * Pembangun: Nur Hirzan (Pembangun Sistem SMKBSP)
 * Versi Naik Taraf: 2.5 (Sistematik, Berkuasa Tinggi & Anti-Pertindihan)
 * 
 * Ciri-Ciri Utama:
 * 1. Pencegahan Pertindihan Masa Nyata (Atomic Script Lock & Conflict Detection)
 * 2. Sokongan Tempahan Tunggal & Tempahan Bersiri (Batch Booking)
 * 3. Notifikasi Emel Automatik & Integrasi WhatsApp
 * 4. Keserasian Dwi-Mod: Web App HTML Service & REST API JSON untuk Frontend Bebas
 * 5. Log Audit Pembatalan dan Keselamatan Pentadbir
 */

const SHEET_DATA_TEMPAHAN = "DataTempahan";
const SHEET_SETTINGS = "Settings";
const SHEET_ROOM = "Config_Room";
const SHEET_UNIT = "Config_Unit";
const SHEET_ADMIN = "Config_Admin";
const SHEET_CADANGAN = "Cadangan";

/**
 * Handle HTTP GET Requests
 * Melayani paparan web app atau memulangkan data JSON (REST API)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";
  
  // Jika diminta sebagai API JSON
  if (action !== "" || (e && e.parameter && e.parameter.api === "true")) {
    return handleApiGet(e);
  }
  
  // Lalai: Papar Antaramuka Web App
  var template = HtmlService.createTemplateFromFile('Index');
  template.appConfig = {
    schoolName: "SMK Bandar Seri Putra",
    appName: "Sistem Tempahan Bilik Khas",
    version: "2.5"
  };
  
  return template.evaluate()
    .setTitle('Sistem Tempahan Bilik Khas SMKBSP')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Handle API GET Request
 */
function handleApiGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getData";
  var result = {};
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "getData" || action === "getAll") {
      result = {
        status: "success",
        rooms: getSheetDataAsObjects(ss.getSheetByName(SHEET_ROOM)),
        units: getSheetColumnData(ss.getSheetByName(SHEET_UNIT), 1),
        settings: getSettingsAsObject(ss.getSheetByName(SHEET_SETTINGS)),
        admins: getSheetColumnData(ss.getSheetByName(SHEET_ADMIN), 1),
        bookings: getBookingsData(ss.getSheetByName(SHEET_DATA_TEMPAHAN), e.parameter.limit, e.parameter.since)
      };
    } 
    else if (action === "getRooms") {
      result = { status: "success", data: getSheetDataAsObjects(ss.getSheetByName(SHEET_ROOM)) };
    }
    else if (action === "checkConflict") {
      var room = e.parameter.room;
      var date = e.parameter.date;
      var start = e.parameter.start;
      var end = e.parameter.end;
      var excludeId = e.parameter.excludeId || "";
      
      var conflict = checkRoomConflict(ss.getSheetByName(SHEET_DATA_TEMPAHAN), room, date, start, end, excludeId);
      result = {
        status: "success",
        hasConflict: conflict.conflict,
        conflictDetails: conflict.details
      };
    }
    else {
      result = { status: "error", message: "Action tidak sah: " + action };
    }
  } catch (err) {
    result = { status: "error", message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle HTTP POST Requests
 * Memproses pendaftaran tempahan, tempahan bersiri, pembatalan, dan cadangan
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var result = {};
  
  try {
    // Kunci skrip selama 20 saat untuk elak race-condition / pertindihan serentak
    if (!lock.tryLock(20000)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Sistem sedang sibuk memproses tempahan lain. Sila cuba lagi dalam beberapa saat."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (ex) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    var action = data.action || "";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "createBooking") {
      result = processCreateBooking(ss, data);
    } 
    else if (action === "createBatchBooking") {
      result = processCreateBatchBooking(ss, data);
    }
    else if (action === "cancelBooking") {
      result = processCancelBooking(ss, data);
    }
    else if (action === "submitSuggestion") {
      result = processSubmitSuggestion(ss, data);
    }
    else if (action === "adminUpdateBooking") {
      result = processAdminUpdateBooking(ss, data);
    }
    else {
      result = { status: "error", message: "Action POST tidak sah: " + action };
    }
    
  } catch (err) {
    result = { status: "error", message: err.toString() };
  } finally {
    lock.releaseLock();
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Memproses Tempahan Tunggal (Single Booking)
 */
function processCreateBooking(ss, data) {
  var sheet = ss.getSheetByName(SHEET_DATA_TEMPAHAN);
  var room = data.bilik;
  var date = data.tarikh;
  var start = data.masa_mula;
  var end = data.masa_tamat;
  
  // 1. Semakan pertindihan masa nyata (Conflict Check)
  var conflict = checkRoomConflict(sheet, room, date, start, end, "");
  if (conflict.conflict) {
    return {
      status: "error",
      message: "PERPINDINGAN MASA! Bilik ini telah ditempah oleh " + conflict.details.nama + 
               " (" + conflict.details.urusan + ") dari jam " + conflict.details.masa_mula + " hingga " + conflict.details.masa_tamat + ".",
      conflictDetails: conflict.details
    };
  }
  
  // 2. Jana ID Unik
  var now = new Date();
  var bookingId = "BK-" + Utilities.formatDate(now, "Asia/Kuala_Lumpur", "yyMMddHHmmss");
  var timestamp = Utilities.formatDate(now, "Asia/Kuala_Lumpur", "M/d/yyyy HH:mm:ss");
  
  // 3. Kira Durasi (jam)
  var durasi = calculateDurationHours(start, end);
  
  // 4. Susun baris mengikut skema DataTempahan:
  // [ID, Nama, Jabatan, Tujuan, Urusan, Tarikh, Masa Mula, Masa Tamat, Bilik, Status, Timestamp, Durasi, Email, Dibatalkan Oleh, Masa Batal, BatchId]
  var rowData = [
    bookingId,
    data.nama || "",
    data.jabatan || "",
    data.tujuan || "",
    data.urusan || "",
    date,
    start,
    end,
    room,
    "BERJAYA",
    timestamp,
    durasi,
    data.email || "",
    "", // Dibatalkan Oleh
    "", // Masa Batal
    ""  // BatchId
  ];
  
  sheet.appendRow(rowData);
  
  // 5. Hantar Notifikasi Emel jika emel disediakan
  if (data.email && data.email.indexOf("@") !== -1) {
    try {
      sendConfirmationEmail(data.email, bookingId, data, durasi);
    } catch (eEmail) {
      Logger.log("Gagal hantar emel: " + eEmail.toString());
    }
  }
  
  return {
    status: "success",
    message: "Tempahan bilik berjaya didaftarkan!",
    booking_id: bookingId,
    tarikh: date,
    masa_mula: start,
    masa_tamat: end,
    bilik: room,
    durasi: durasi
  };
}

/**
 * Memproses Tempahan Bersiri (Batch / Multi-Day Booking)
 */
function processCreateBatchBooking(ss, data) {
  var sheet = ss.getSheetByName(SHEET_DATA_TEMPAHAN);
  var room = data.bilik;
  var dates = data.tarikh_senarai || []; // Array tarikh e.g. ["2026-04-06", "2026-04-07", ...]
  var start = data.masa_mula;
  var end = data.masa_tamat;
  
  if (dates.length === 0) {
    return { status: "error", message: "Senarai tarikh bersiri tidak disediakan." };
  }
  
  // Semak pertindihan untuk semua tarikh dahulu
  for (var i = 0; i < dates.length; i++) {
    var c = checkRoomConflict(sheet, room, dates[i], start, end, "");
    if (c.conflict) {
      return {
        status: "error",
        message: "Pertindihan dikesan pada tarikh " + dates[i] + " (" + c.details.urusan + " oleh " + c.details.nama + "). Semua tempahan bersiri dibatalkan."
      };
    }
  }
  
  var now = new Date();
  var batchId = "BAT-" + Utilities.formatDate(now, "Asia/Kuala_Lumpur", "yyMMddHHmmss");
  var timestamp = Utilities.formatDate(now, "Asia/Kuala_Lumpur", "M/d/yyyy HH:mm:ss");
  var durasi = calculateDurationHours(start, end);
  var createdIds = [];
  
  for (var j = 0; j < dates.length; j++) {
    var subId = batchId + "-" + j;
    var rowData = [
      subId,
      data.nama || "",
      data.jabatan || "",
      data.tujuan || "",
      data.urusan || "",
      dates[j],
      start,
      end,
      room,
      "BERJAYA",
      timestamp,
      durasi,
      data.email || "",
      "",
      "",
      batchId
    ];
    sheet.appendRow(rowData);
    createdIds.push(subId);
  }
  
  return {
    status: "success",
    message: "Sebanyak " + dates.length + " slot tempahan bersiri berjaya didaftarkan!",
    batch_id: batchId,
    sub_ids: createdIds
  };
}

/**
 * Memproses Pembatalan Tempahan
 */
function processCancelBooking(ss, data) {
  var sheet = ss.getSheetByName(SHEET_DATA_TEMPAHAN);
  var bookingId = data.id;
  var cancelledBy = data.dibatalkan_oleh || "Pengguna";
  var cancelTime = Utilities.formatDate(new Date(), "Asia/Kuala_Lumpur", "M/d/yyyy HH:mm:ss");
  
  var values = sheet.getDataRange().getValues();
  var found = false;
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().trim() === bookingId.toString().trim()) {
      var row = i + 1;
      sheet.getRange(row, 10).setValue("DIBATALKAN"); // Status
      sheet.getRange(row, 14).setValue(cancelledBy); // Dibatalkan Oleh
      sheet.getRange(row, 15).setValue(cancelTime); // Masa Batal
      found = true;
      break;
    }
  }
  
  if (found) {
    return { status: "success", message: "Tempahan " + bookingId + " telah berjaya dibatalkan." };
  } else {
    return { status: "error", message: "ID Tempahan tidak dijumpai: " + bookingId };
  }
}

/**
 * Memproses Cadangan Warga Sekolah
 */
function processSubmitSuggestion(ss, data) {
  var sheet = ss.getSheetByName(SHEET_CADANGAN);
  var timestamp = Utilities.formatDate(new Date(), "Asia/Kuala_Lumpur", "M/d/yyyy HH:mm:ss");
  
  var row = [
    timestamp,
    data.nama || "Anonim",
    data.email || "",
    data.kategori || "Umum",
    data.cadangan || "",
    data.user_agent || "Web Portal",
    "BARU",
    ""
  ];
  sheet.appendRow(row);
  return { status: "success", message: "Cadangan anda telah diterima. Terima kasih!" };
}

/**
 * Fungsi Semakan Pertindihan Masa & Bilik
 */
function checkRoomConflict(sheet, room, date, startTime, endTime, excludeId) {
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { conflict: false };
  
  var targetDate = parseDateString(date);
  var targetStartMin = timeToMinutes(startTime);
  var targetEndMin = timeToMinutes(endTime);
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var rowId = row[0] ? row[0].toString().trim() : "";
    var rowStatus = row[9] ? row[9].toString().trim() : "";
    
    // Abaikan jika ID dikecualikan (contoh semasa kemas kini) atau status bukan BERJAYA
    if (rowId === excludeId || rowStatus === "DIBATALKAN") continue;
    
    var rowRoom = row[8] ? row[8].toString().trim() : "";
    if (rowRoom.toLowerCase() !== room.toLowerCase()) continue;
    
    var rowDate = parseDateString(row[5]);
    if (rowDate !== targetDate) continue;
    
    var rowStartMin = timeToMinutes(row[6]);
    var rowEndMin = timeToMinutes(row[7]);
    
    // Logik pertindihan rentang masa: (StartA < EndB) AND (EndA > StartB)
    if (targetStartMin < rowEndMin && targetEndMin > rowStartMin) {
      return {
        conflict: true,
        details: {
          id: rowId,
          nama: row[1],
          urusan: row[4],
          tarikh: rowDate,
          masa_mula: formatMinutesToTime(rowStartMin),
          masa_tamat: formatMinutesToTime(rowEndMin),
          bilik: rowRoom
        }
      };
    }
  }
  
  return { conflict: false };
}

/**
 * Helper: Kira Durasi dalam jam
 */
function calculateDurationHours(startTime, endTime) {
  var start = timeToMinutes(startTime);
  var end = timeToMinutes(endTime);
  var diff = end - start;
  if (diff <= 0) return 1.0;
  return Math.round((diff / 60) * 10) / 10;
}

/**
 * Helper: Tukar format masa (e.g. "08:30" atau Date object) kepada jumlah minit dari 00:00
 */
function timeToMinutes(val) {
  if (!val) return 0;
  if (val instanceof Date) {
    return val.getHours() * 60 + val.getMinutes();
  }
  var s = val.toString().trim();
  var parts = s.split(':');
  if (parts.length >= 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 0;
}

function formatMinutesToTime(min) {
  var h = Math.floor(min / 60);
  var m = min % 60;
  return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
}

function parseDateString(d) {
  if (!d) return "";
  if (d instanceof Date) {
    return Utilities.formatDate(d, "Asia/Kuala_Lumpur", "yyyy-MM-dd");
  }
  var s = d.toString().trim();
  if (s.length >= 10 && s.indexOf('-') !== -1) {
    return s.substring(0, 10);
  }
  return s;
}

function getSheetDataAsObjects(sheet) {
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var result = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j] ? headers[j].toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '_') : "col_" + j;
      obj[key] = values[i][j];
    }
    result.push(obj);
  }
  return result;
}

function getSheetColumnData(sheet, colIndex) {
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < values.length; i++) {
    if (values[i][colIndex - 1]) {
      list.push(values[i][colIndex - 1].toString().trim());
    }
  }
  return list;
}

function getSettingsAsObject(sheet) {
  if (!sheet) return {};
  var values = sheet.getDataRange().getValues();
  var res = {};
  for (var i = 1; i < values.length; i++) {
    if (values[i][0]) {
      res[values[i][0].toString().trim()] = values[i][1];
    }
  }
  return res;
}

function getBookingsData(sheet, limit, since) {
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var list = [];
  var max = limit ? Math.min(values.length - 1, parseInt(limit, 10)) : values.length - 1;
  
  // Baca daripada baris terkini
  for (var i = values.length - 1; i >= 1 && list.length < max; i--) {
    var row = values[i];
    list.push({
      id: row[0],
      nama: row[1],
      jabatan: row[2],
      tujuan: row[3],
      urusan: row[4],
      tarikh: parseDateString(row[5]),
      masa_mula: typeof row[6] === 'object' ? Utilities.formatDate(row[6], "Asia/Kuala_Lumpur", "HH:mm") : row[6],
      masa_tamat: typeof row[7] === 'object' ? Utilities.formatDate(row[7], "Asia/Kuala_Lumpur", "HH:mm") : row[7],
      bilik: row[8],
      status: row[9],
      timestamp: row[10],
      durasi: row[11],
      email: row[12],
      dibatalkan_oleh: row[13],
      masa_batal: row[14],
      batch_id: row[15]
    });
  }
  return list;
}

/**
 * Emel Pengesahan Rasmi
 */
function sendConfirmationEmail(recipientEmail, id, data, durasi) {
  var subject = "PENGESAHAN TEMPAHAN BILIK: [" + id + "] - " + data.bilik;
  var htmlBody = 
    "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:10px;padding:25px;background:#ffffff;'>" +
    "<div style='text-align:center;border-bottom:2px solid #4f46e5;padding-bottom:15px;'>" +
    "<h2 style='color:#1e293b;margin:0;'>E-TEMPAHAN BILIK KHAS & FASILITI</h2>" +
    "<p style='color:#64748b;margin:5px 0 0 0;'>SMK Bandar Seri Putra</p>" +
    "</div>" +
    "<div style='margin-top:20px;'>" +
    "<p>Salam sejahtera <b>" + data.nama + "</b>,</p>" +
    "<p>Permohonan tempahan bilik anda telah <b>BERJAYA</b> didaftarkan ke dalam sistem sekolah.</p>" +
    "<table style='width:100%;border-collapse:collapse;margin-top:15px;font-size:14px;'>" +
    "<tr style='background:#f8fafc;'><td style='padding:8px 12px;font-weight:bold;border:1px solid #e2e8f0;'>No. ID Tempahan</td><td style='padding:8px 12px;border:1px solid #e2e8f0;color:#4f46e5;font-weight:bold;'>" + id + "</td></tr>" +
    "<tr><td style='padding:8px 12px;font-weight:bold;border:1px solid #e2e8f0;'>Bilik / Fasiliti</td><td style='padding:8px 12px;border:1px solid #e2e8f0;'>" + data.bilik + "</td></tr>" +
    "<tr style='background:#f8fafc;'><td style='padding:8px 12px;font-weight:bold;border:1px solid #e2e8f0;'>Tarikh</td><td style='padding:8px 12px;border:1px solid #e2e8f0;'>" + data.tarikh + "</td></tr>" +
    "<tr><td style='padding:8px 12px;font-weight:bold;border:1px solid #e2e8f0;'>Masa Tempahan</td><td style='padding:8px 12px;border:1px solid #e2e8f0;'>" + data.masa_mula + " hingga " + data.masa_tamat + " (" + durasi + " jam)</td></tr>" +
    "<tr style='background:#f8fafc;'><td style='padding:8px 12px;font-weight:bold;border:1px solid #e2e8f0;'>Tujuan / Urusan</td><td style='padding:8px 12px;border:1px solid #e2e8f0;'>[" + data.tujuan + "] " + data.urusan + "</td></tr>" +
    "<tr><td style='padding:8px 12px;font-weight:bold;border:1px solid #e2e8f0;'>Jabatan / Unit</td><td style='padding:8px 12px;border:1px solid #e2e8f0;'>" + data.jabatan + "</td></tr>" +
    "</table>" +
    "</div>" +
    "<p style='color:#64748b;font-size:12px;margin-top:25px;border-top:1px solid #e2e8f0;padding-top:15px;'>" +
    "Slip digital ini dijana secara automatik. Sila pastikan bilik dikunci dan peralatan dimatikan selepas urusan selesai.<br>" +
    "Sebarang pembatalan boleh dilakukan melalui portal sistem e-Tempahan." +
    "</p>" +
    "</div>";
    
  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}
