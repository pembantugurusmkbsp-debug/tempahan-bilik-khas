# 🚀 PANDUAN PEMASANGAN DI KOMPUTER LAIN (PORTABLE INSTALLATION GUIDE)
**Sistem E-Tempahan Bilik Khas & Fasiliti Sekolah (Versi 2.5)**
*Pembangun: Nur Hirzan (Pembangun Sistem SMKBSP)*

---

## 📌 Ringkasan Pakej
Sistem ini direka khas dengan teknologi **Dwi-Mod (Hybrid)**:
1. **Mod Setempat (Offline / Standalone)**: Boleh dijalankan terus pada mana-mana komputer tanpa memerlukan sambungan internet atau pemasangan perisian rumit.
2. **Mod Penyelarasan Google Sheets (Live Cloud Sync)**: Boleh disambungkan terus dengan Google Sheet sekolah untuk penyelarasan data masa nyata antara semua guru dan pentadbir.

Semua fail projek telah disusun rapi di dalam folder:
`Desktop > GEMINI WORKBOOK > Tempahan Bilik Khas`

---

## 💻 Kaedah 1: Pemasangan Pantas di Komputer Windows (Disyorkan)

Langkah-langkah untuk memasang di komputer sekolah atau komputer guru lain:

1. **Salin Folder Projek**:
   - Salin folder `Tempahan Bilik Khas` (atau fail `Tempahan_Bilik_Khas_Installer.zip` yang diekstrak) ke dalam pemacu kilat (pendrive / thumbdrive).
   - Tampal folder tersebut ke Desktop komputer sasaran.

2. **Jalankan Installer**:
   - Buka folder `installer/`.
   - Klik dua kali (double-click) pada fail:
     👉 **`install_windows.bat`**

3. **Apa yang berlaku secara automatik**:
   - Skrip akan memeriksa sama ada komputer mempunyai Python 3.
   - Jika **ADA Python**: Pelayan mudah alih (`run_portable_server.py`) akan diaktifkan pada `http://localhost:8080` dan pelayar web lalai (Google Chrome / Microsoft Edge) akan dibuka secara automatik. Ikon pintasan `Tempahan Bilik Khas.bat` juga akan diletakkan di Desktop komputer tersebut!
   - Jika **TIADA Python**: Skrip akan membuka terus antaramuka aplikasi web (`app/index.html`) pada pelayar web. Sistem tetap berfungsi 100% menggunakan storan setempat (LocalStorage) pelayar!

4. **Untuk kegunaan harian seterusnya**:
   - Pengguna hanya perlu klik dua kali pada ikon **`run_system.bat`** di dalam folder `installer/` (atau ikon pintasan di Desktop).

---

## 🍏 Kaedah 2: Pemasangan di Komputer macOS / Linux

1. Salin folder `Tempahan Bilik Khas` ke komputer Mac/Linux.
2. Buka aplikasi **Terminal**.
3. Navigasi ke folder installer dan berikan kebenaran laksana:
   ```bash
   cd ~/Desktop/"Tempahan Bilik Khas"/installer
   chmod +x install_mac_linux.sh run_portable_server.py
   ./install_mac_linux.sh
   ```
4. Pelayan setempat akan dimulakan dan pelayar web akan dilancarkan secara automatik.

---

## 🌐 Kaedah 3: Menghubungkan ke Google Sheet Baharu / Sekolah Lain

Jika anda ingin menggunakan sistem ini untuk sekolah lain atau akaun Google baharu:

1. **Bina Google Sheet Baharu**:
   - Buka [Google Sheets](https://sheets.new) di akaun Google anda.
   - Berikan nama spreadsheet, contohnya: `E-Tempahan Bilik Khas SMK...`.

2. **Jana Semua 6 Tab Secara Automatik**:
   - Pada Google Sheet tersebut, klik menu **Extensions (Sambungan)** > **Apps Script**.
   - Salin kandungan fail dari `templates/Google_Sheet_Template_Setup.js`.
   - Tampal ke dalam editor Apps Script dan klik **Run (Jalankan)** pada fungsi `setupNewBookingSpreadsheet()`.
   - Berikan kebenaran (authorization) apabila diminta.
   - Semua 6 tab (`DataTempahan`, `Settings`, `Config_Room`, `Config_Unit`, `Config_Admin`, `Cadangan`) akan dijana lengkap dengan warna dan data konfigurasi asas!

3. **Pasang Enjin Backend Web App**:
   - Padam kod setup tadi, dan salin keseluruhan kod dari `google_apps_script/Code.gs`.
   - Tampal ke dalam `Code.gs`.
   - Klik menu **Deploy (Guna)** > **New deployment (Guna baharu)**.
   - Pilih jenis: **Web app**.
   - Tetapkan:
     - **Execute as**: *Me (Akaun saya)*
     - **Who has access**: *Anyone (Sesiapa sahaja)*
   - Klik **Deploy** dan salin **Web App URL** yang diberikan (format: `https://script.google.com/macros/s/.../exec`).

4. **Masukkan URL ke dalam Sistem**:
   - Buka aplikasi Tempahan Bilik Khas.
   - Klik tab **Pentadbir & Tetapan** (masukkan PIN: `admin123`).
   - Pada bahagian **Penyelarasan Google Sheets**, tampal Web App URL baharu anda dan klik **Simpan Tetapan API**.
   - Klik **Uji Sambungan** dan **Segerak Sekarang**.

Sistem anda kini beroperasi sepenuhnya secara awan (Cloud) dan setempat!

---

## 🔒 Kata Laluan & Keselamatan Pentadbir
- **PIN Pentadbir Lalai**: `admin123`
- Anda boleh menukar PIN atau menambah emel pentadbir pada tab **Config_Admin** dalam Google Sheet.
- Sebarang masalah teknikal boleh dirujuk kepada pembangun sistem:
  - **Nama**: Nur Hirzan
  - **WhatsApp**: [012-2050697](https://wa.me/60122050697)
  - **Emel**: pembantugurusmkbsp@gmail.com
