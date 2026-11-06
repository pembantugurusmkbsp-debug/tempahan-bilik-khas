# 🛡️ PANDUAN PENTADBIR SISTEM (ADMINISTRATOR GUIDE)
**Sistem E-Tempahan Bilik Khas & Fasiliti SMK Bandar Seri Putra**

Panduan ini dikhaskan untuk Pentadbir Sistem (Guru Data, Guru Penyelaras ICT, dan Pembantu Tadbir) bagi mengurus pangkalan data, bilik khas, dan keselamatan sistem.

---

## 🔑 1. Log Masuk & Kawalan Keselamatan
1. Klik tab **Pentadbir & Tetapan** di bar navigasi atas.
2. Masukkan PIN Pentadbir:
   - **PIN Lalai**: `admin123`
   - **Alternatif**: Mana-mana alamat emel yang didaftarkan dalam senarai `Config_Admin` (contoh: `pembantugurusmkbsp@gmail.com`).
3. Setelah berjaya, papan pemuka pentadbir akan dibuka.
4. Klik **Kunci Semula** apabila selesai urusan pentadbiran untuk memastikan keselamatan.

---

## 🏢 2. Pengurusan Bilik Khas (Config_Room)
1. **Menambah Bilik Baharu**:
   - Klik butang **Tambah Bilik**.
   - Masukkan nama bilik baharu (contoh: *Bilik Tayangan / Studio Rakaman*).
   - Pilih warna petunjuk kalendar.
   - Bilik baharu akan muncul secara automatik pada Dashboard, Borang Tempahan, dan Kalendar!
2. **Mengubah Kod Warna Bilik**:
   - Pada jadual bilik, klik pautan **Tukar Warna**.
   - Pilih warna hex baharu pada pemilih warna (color picker).
   - Warna pada kalendar bulanan dan garis masa harian akan dikemas kini serta-merta.

---

## 📊 3. Eksport Laporan & Mesyuarat Pengurusan
1. **Eksport ke CSV / Excel**:
   - Pada tab **Senarai Tempahan** atau tab **Pentadbir**, klik butang **Eksport CSV** atau **Muat Turun Rekod Tempahan (.CSV)**.
   - Fail CSV yang dimuat turun boleh dibuka terus menggunakan Microsoft Excel atau Google Sheets untuk penyediaan laporan mingguan kepada Pengetua atau Guru Penolong Kanan.
2. **Sandaran Penuh (.JSON)**:
   - Klik **Muat Turun Sandaran Penuh (.JSON)** untuk menyimpan salinan sandaran lengkap konfigurasi bilik, unit, dan rekod tempahan.

---

## ⚡ 4. Penyelarasan Google Sheets & Apps Script
1. Jika URL Web App Google Apps Script bertukar atau sistem dipindahkan ke akaun Google lain:
   - Buka bahagian **Penyelarasan Google Sheets (Live Sync)**.
   - Masukkan URL baharu pada ruangan `URL Web App Google Apps Script (/exec)`.
   - Masukkan ID Google Sheet sasaran.
   - Klik **Simpan Tetapan API** dan jalankan **Uji Sambungan**.
2. Klik butang **Segerak** di bahagian atas skrin untuk menyegerakkan data setempat dengan Google Sheet pada bila-bila masa.
