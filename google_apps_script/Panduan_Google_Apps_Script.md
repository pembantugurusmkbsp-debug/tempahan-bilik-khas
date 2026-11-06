# ⚡ PANDUAN DEPLOYMENT GOOGLE APPS SCRIPT
**Menaik Taraf Sistem E-Tempahan SMKBSP (Versi 2.5)**

Panduan ini menerangkan langkah demi langkah untuk mengemas kini atau memasang kod backend Google Apps Script pada Google Sheet:
`https://docs.google.com/spreadsheets/d/1RkjJUDeqg_wA7WH4w0ATg5zZMTkhYB1GTYtj-3bw88M/edit`

---

## 🛠️ Langkah-Langkah Deployment

### Langkah 1: Buka Editor Apps Script
1. Buka fail Google Sheet: **001_Copy_NOV of E-Tempahan SMKBSP**.
2. Pada bar menu atas, klik **Extensions (Sambungan)** > **Apps Script**.

### Langkah 2: Kemas Kini Fail Kod Backend
1. Dalam editor Apps Script, buka fail **`Code.gs`**.
2. Padam semua kod lama yang ada di dalam fail tersebut.
3. Buka fail `google_apps_script/Code.gs` daripada folder projek ini, salin kesemua kandungannya dan tampal ke dalam editor Apps Script.
4. Klik ikon **Simpan (Save)** (ikon disket) atau tekan `Ctrl + S`.

### Langkah 3: Kemas Kini Fail Paparan Web App (Index.html)
1. Jika belum ada fail `Index.html` di panel kiri Apps Script:
   - Klik butang **+** (Add a file) di sebelah *Files* dan pilih **HTML**.
   - Namakan fail sebagai **`Index`** (tanpa menulis .html).
2. Salin keseluruhan kandungan dari fail `google_apps_script/Index.html` dalam projek ini dan tampal ke dalam fail `Index.html` di Apps Script.
3. Klik **Simpan (Save)**.

### Langkah 4: Kemas Kini appsscript.json (Zon Masa)
1. Klik ikon **Project Settings (Tetapan Projek)** (ikon gear di menu kiri).
2. Tandakan pilihan: *"Show "appsscript.json" manifest file in editor"*.
3. Kembali ke tab **Editor** (< >). Fail `appsscript.json` kini kelihatan.
4. Pastikan `timeZone` ditetapkan kepada `"Asia/Kuala_Lumpur"` seperti di dalam fail `google_apps_script/appsscript.json`.
5. Klik **Simpan**.

### Langkah 5: Buat Deployment Baharu (Publish Web App)
1. Di penjuru atas kanan editor Apps Script, klik butang biru **Deploy (Guna)** > **New deployment (Guna baharu)**.
2. Di sebelah kiri tetingkap timbul, klik ikon gear di sebelah *Select type* dan pilih **Web app**.
3. Masukkan konfigurasi berikut:
   - **Description**: `Sistem Tempahan Bilik Khas v2.5 Naik Taraf`
   - **Execute as**: `Me (Akaun anda)`
   - **Who has access**: `Anyone (Sesiapa sahaja)` *(Penting supaya guru dan sistem setempat boleh menghantar tempahan tanpa sekatan log masuk Google)*
4. Klik butang **Deploy**.
5. Jika Google meminta kebenaran (Authorization):
   - Klik *Review permissions*.
   - Pilih akaun Google anda.
   - Klik *Advanced* (Lanjutan) di bahagian bawah, kemudian klik *Go to Sistem Tempahan (unsafe)*.
   - Klik *Allow*.
6. Salin **Web App URL** yang dipaparkan (format: `https://script.google.com/macros/s/.../exec`).

---

## 🔗 Pautan Penting Sistem
- **Web App Semasa**: [Pautan Web App Google Apps Script](https://script.google.com/macros/s/AKfycbwrvwCLTeCZfxX1VTo6wWFdqAsHC7scwusPTU0Xg7ylWY8p-Yn5wdm1ZTn1UaEYKmsU0Q/exec)
- **Google Sheet Pangkalan Data**: [001_Copy_NOV of E-Tempahan SMKBSP](https://docs.google.com/spreadsheets/d/1RkjJUDeqg_wA7WH4w0ATg5zZMTkhYB1GTYtj-3bw88M/edit?gid=481844621#gid=481844621)
