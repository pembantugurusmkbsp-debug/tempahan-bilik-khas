#!/usr/bin/env bash
# Pemasangan & Pelancar Sistem Tempahan Bilik Khas untuk macOS dan Linux

echo "====================================================================="
echo "      PEMASANGAN SISTEM TEMPAHAN BILIK KHAS & FASILITI (SMKBSP)"
echo "====================================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
APP_HTML="$BASE_DIR/app/index.html"

# Semak python3
if command -v python3 &>/dev/null; then
    echo "[OK] Python 3 ditemui. Memulakan pelayan mudah alih..."
    python3 "$SCRIPT_DIR/run_portable_server.py"
elif command -v python &>/dev/null; then
    echo "[OK] Python ditemui. Memulakan pelayan mudah alih..."
    python "$SCRIPT_DIR/run_portable_server.py"
else
    echo "[INFO] Python tidak ditemui. Membuka fail aplikasi web terus..."
    if command -v xdg-open &>/dev/null; then
        xdg-open "$APP_HTML"
    elif command -v open &>/dev/null; then
        open "$APP_HTML"
    else
        echo "Sila buka fail ini dalam pelayar anda: $APP_HTML"
    fi
fi
