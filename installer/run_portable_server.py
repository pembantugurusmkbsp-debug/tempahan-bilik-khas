#!/usr/bin/env python3
"""
PELAYAN TEMPATAN MUDAH ALIH (PORTABLE LOCAL SERVER)
Sistem Tempahan Bilik Khas & Fasiliti
Pembangun: Nur Hirzan

Ciri-ciri:
- Menggunakan Standard Library Python 3 sahaja (TIADA sebarang pip install diperlukan)
- Pengesanan port bebas automatik (8080 -> 8081 -> 8082 -> 8000)
- Membuka pelayar web secara automatik ke antaramuka sistem
- Menyediakan endpoint API setempat untuk simpanan luar talian (offline persistence)
- Menghubungkan sistem secara hibrid dengan Google Sheets & Apps Script
"""

import sys
import os
import json
import socket
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
from datetime import datetime

# Tentukan laluan direktori aplikasi
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
APP_DIR = os.path.join(BASE_DIR, "app")
DATA_FILE = os.path.join(BASE_DIR, "templates", "Database_Structure.json")
LOCAL_DB_FILE = os.path.join(SCRIPT_DIR, "local_data.json")

# Muat data awal jika local_data.json belum wujud
def init_local_db():
    if not os.path.exists(LOCAL_DB_FILE):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print("[INFO] Pangkalan data setempat berjaya dimulakan dari template.")
        else:
            with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump({"bookings": [], "rooms": [], "units": []}, f)

def get_free_port(preferred_port=8080):
    for port in [preferred_port, 8081, 8082, 8085, 8888, 5000, 3000]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return 0

class BookingRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=APP_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        # API Local Data Endpoint
        if parsed.path == "/api/data":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            if os.path.exists(LOCAL_DB_FILE):
                with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
                    content = f.read()
                self.wfile.write(content.encode("utf-8"))
            else:
                self.wfile.write(b'{"status":"error","message":"No data file"}')
            return

        if parsed.path == "/api/ping":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"status":"ok","message":"Server is running"}')
            return

        # Lalai: Serve fail statik dari APP_DIR
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode("utf-8"))
        except Exception:
            body = {}

        if parsed.path == "/api/booking":
            res = self.handle_create_booking(body)
            self.send_json_response(200, res)
            return

        if parsed.path == "/api/cancel":
            res = self.handle_cancel_booking(body)
            self.send_json_response(200, res)
            return

        self.send_json_response(404, {"status": "error", "message": "Endpoint not found"})

    def handle_create_booking(self, data):
        if not os.path.exists(LOCAL_DB_FILE):
            init_local_db()
        
        with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
            db = json.load(f)

        now = datetime.now()
        booking_id = f"BK-{now.strftime('%y%m%d%H%M%S')}"
        timestamp = now.strftime("%m/%d/%Y %H:%M:%S")

        new_booking = {
            "id": booking_id,
            "nama": data.get("nama", ""),
            "jabatan": data.get("jabatan", ""),
            "tujuan": data.get("tujuan", "Mesyuarat"),
            "urusan": data.get("urusan", ""),
            "tarikh": data.get("tarikh", ""),
            "masa_mula": data.get("masa_mula", ""),
            "masa_tamat": data.get("masa_tamat", ""),
            "bilik": data.get("bilik", ""),
            "status": "BERJAYA",
            "timestamp": timestamp,
            "durasi": data.get("durasi", 1.0),
            "email": data.get("email", ""),
            "dibatalkan_oleh": "",
            "masa_batal": "",
            "batch_id": data.get("batch_id", "")
        }

        db.setdefault("bookings", []).insert(0, new_booking)
        db["total_bookings"] = len(db["bookings"])

        with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2, ensure_ascii=False)

        return {
            "status": "success",
            "message": "Tempahan berjaya disimpan ke pangkalan data setempat!",
            "booking_id": booking_id,
            "booking": new_booking
        }

    def handle_cancel_booking(self, data):
        booking_id = data.get("id")
        cancelled_by = data.get("dibatalkan_oleh", "Pengguna")
        now = datetime.now().strftime("%m/%d/%Y %H:%M:%S")

        with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
            db = json.load(f)

        found = False
        for b in db.get("bookings", []):
            if b.get("id") == booking_id:
                b["status"] = "DIBATALKAN"
                b["dibatalkan_oleh"] = cancelled_by
                b["masa_batal"] = now
                found = True
                break

        if found:
            with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(db, f, indent=2, ensure_ascii=False)
            return {"status": "success", "message": f"Tempahan {booking_id} telah dibatalkan."}
        else:
            return {"status": "error", "message": f"ID {booking_id} tidak ditemui."}

    def send_json_response(self, code, payload):
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode("utf-8"))

def main():
    print("=" * 65)
    print("   SISTEM TEMPAHAN BILIK KHAS & FASILITI SEKOLAH (SMKBSP)")
    print("   Pembangun: Nur Hirzan | Versi: 2.5 (Portable Edition)")
    print("=" * 65)

    init_local_db()

    config_path = os.path.join(SCRIPT_DIR, "setup_config.json")
    pref_port = 8080
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as cf:
                cfg = json.load(cf)
                pref_port = cfg.get("local_port", 8080)
        except Exception:
            pass

    port = get_free_port(pref_port)
    if port == 0:
        print("[RALAT] Tiada port rangkaian yang bebas untuk memulakan pelayan.")
        sys.exit(1)

    server_url = f"http://localhost:{port}/index.html"

    print(f"\n[OK] Pelayan aktif pada alamat: {server_url}")
    print("[OK] Sedang membuka pelayar web lalai komputer anda...")
    print("[INFO] Tekan Ctrl+C pada tetingkap ini untuk menamatkan pelayan.\n")

    try:
        webbrowser.open(server_url)
    except Exception as e:
        print(f"[CATATAN] Tidak dapat melancarkan pelayar automatik: {e}")
        print(f"Sila buka manual pada pelayar Chrome/Edge: {server_url}")

    server = HTTPServer(("127.0.0.1", port), BookingRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[TAMAT] Pelayan telah dimatikan dengan selamat. Terima kasih!")
        server.server_close()

if __name__ == "__main__":
    main()
