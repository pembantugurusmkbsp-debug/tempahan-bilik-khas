# 🏫 SISTEM E-TEMPAHAN BILIK KHAS & FASILITI SEKOLAH (SMKBSP)
**Versi 2.5 (Sistematik, Berkuasa Tinggi & Anti-Pertindihan)**
*Repositori Rasmi: [https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas](https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas)*

---

## 🌟 Pengenalan & Matlamat Naik Taraf
Projek ini merupakan versi naik taraf yang menyeluruh bagi sistem tempahan fasiliti SMK Bandar Seri Putra yang berasaskan Google Sheet dan Google Apps Script. 

Sistem ini dinaik taraf untuk menyelesaikan masalah sistem lama:
1. **Pencegahan Pertindihan Masa Nyata (Conflict Prevention)**: Sistem menyemak pertindihan masa bagi bilik yang sama secara automatik sebelum tempahan disimpan (baik di peringkat pelayar mahupun server-side Atomic Lock).
2. **Sokongan Tempahan Bersiri (Batch Booking)**: Membolehkan tempahan pelbagai hari berturut-turut (seperti aktiviti SEGAK atau Sesi Majalah Sekolah) didaftarkan dalam satu klik dengan pengenalan ID Bersiri (`BAT-XXXXXX`).
3. **Slip Pengesahan Digital Rasmi (Printable Pass)**: Penjanaan slip rasmi digital lengkap dengan kepala surat sekolah SMKBSP, Kod QR imbasan pengesahan, dan ruang tandatangan pentadbir.
4. **Penyelarasan Dwi-Mod (Hybrid Sync)**: Boleh beroperasi secara luar talian (offline / standalone) dan menyegerak data terus ke Google Sheets.
5. **Pakej Installer Mudah Alih (Portable Installer)**: Folder `installer/` sedia ada untuk dipasang pada mana-mana komputer lain dengan satu klik sahaja.

---

## 📂 Struktur Fail Projek

```text
GEMINI WORKBOOK/
└── Tempahan Bilik Khas/
    ├── app/                                # Aplikasi Web Utama (Responsive Dashboard & UI)
    │   ├── index.html                      # Antaramuka sistem penuh (Dashboard, Kalendar, Borang, Slip, Admin)
    │   └── assets/
    │       └── seed_data.js                # Data permulaan sebenar (628 rekod tempahan, 12 bilik, 7 unit)
    ├── installer/                          # Pakej Pemasangan ke Komputer Lain
    │   ├── install_windows.bat             # Skrip pemasangan & pelancar automatik 1-klik Windows
    │   ├── run_system.bat                  # Pelancar pantas harian Windows
    │   ├── install_mac_linux.sh            # Skrip pelancar macOS & Linux
    │   ├── run_portable_server.py          # Pelayan HTTP mudah alih (Standard Library Python 3, Sifar Dependensi)
    │   └── setup_config.json               # Konfigurasi sistem (URL Web App, ID Sheet, Port, PIN Admin)
    ├── google_apps_script/                 # Kod Sumber Enjin Google Apps Script
    │   ├── Code.gs                         # Kod backend Google Apps Script (REST API + Conflict Lock + Email)
    │   ├── Index.html                      # Template antaramuka untuk deployment Google Apps Script
    │   ├── appsscript.json                 # Manifest zon masa Asia/Kuala_Lumpur
    │   └── Panduan_Google_Apps_Script.md   # Langkah demi langkah deployment ke Google Sheet
    ├── templates/                          # Templat & Sandaran Pangkalan Data
    │   ├── Database_Structure.json         # Struktur skema JSON pangkalan data
    │   ├── DataTempahan_Export.csv         # Eksport CSV 628 rekod tempahan sedia ada
    │   └── Google_Sheet_Template_Setup.js  # Skrip pembina automatik 6 tab Google Sheet baharu
    ├── docs/                               # Dokumentasi Lengkap
    │   ├── PANDUAN_PEMASANGAN_KOMPUTER_LAIN.md # Cara pasang di komputer lain menggunakan pendrive
    │   ├── PANDUAN_PENGGUNA.md             # Manual guru & staf (cara tempah, semak jadual, cetak slip)
    │   └── PANDUAN_PENTADBIR.md            # Manual pentadbir (urus bilik, eksport laporan, keselamatan)
    ├── push_ke_github.bat                  # Skrip automatik 1-klik untuk tolak kod ke GitHub anda
    └── README.md                           # Ringkasan projek ini
```

---

## 🚀 Cara Menjalankan Sistem

### Pada Komputer Ini:
- Buka folder `installer/` dan klik dua kali pada **`run_system.bat`** (atau `install_windows.bat`).
- Pelayar web anda akan dibuka secara automatik memaparkan sistem.

### Menolak Kod ke GitHub:
- Klik dua kali pada fail **`push_ke_github.bat`**. Skrip telah diprapasang dengan URL repositori anda: `https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas.git`.

---

## 🔗 Pautan Rujukan Projek Asal
- **Repositori GitHub**: [https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas](https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas)
- **Web App Google Apps Script**: [Pautan Web App Asal](https://script.google.com/macros/s/AKfycbwrvwCLTeCZfxX1VTo6wWFdqAsHC7scwusPTU0Xg7ylWY8p-Yn5wdm1ZTn1UaEYKmsU0Q/exec)
- **Google Sheet Pangkalan Data**: [001_Copy_NOV of E-Tempahan SMKBSP](https://docs.google.com/spreadsheets/d/1RkjJUDeqg_wA7WH4w0ATg5zZMTkhYB1GTYtj-3bw88M/edit?gid=481844621#gid=481844621)

---
*Pembangun Asal: Nur Hirzan (Pembangun Sistem SMKBSP • WhatsApp: 012-2050697)*
