@echo off
chcp 65001 >nul
title Pemasangan Sistem Tempahan Bilik Khas SMKBSP
color 1F

echo =====================================================================
echo       PEMASANGAN SISTEM TEMPAHAN BILIK KHAS & FASILITI
echo                 Versi 2.5 (Installer Mudah Alih)
echo =====================================================================
echo.
echo [1/3] Memeriksa persekitaran komputer...

python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python 3 dikesan pada komputer ini.
    set HAS_PYTHON=1
) else (
    py --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Python Launcher dikesan.
        set HAS_PYTHON=2
    ) else (
        echo [INFO] Python tidak ditemui. Mod Pelayar Web Kendiri (Direct Standalone) akan digunakan.
        set HAS_PYTHON=0
    )
)

echo.
echo [2/3] Menyediakan pintasan dan pangkalan data setempat...

set SCRIPT_DIR=%~dp0
set BASE_DIR=%SCRIPT_DIR%..
set APP_HTML="%BASE_DIR%\app\index.html"

:: Cipta fail pelancar pantas di Desktop pengguna jika boleh
set DESKTOP_DIR=%USERPROFILE%\Desktop
if exist "%DESKTOP_DIR%" (
    echo @echo off > "%DESKTOP_DIR%\Tempahan Bilik Khas.bat"
    echo cd /d "%SCRIPT_DIR%" >> "%DESKTOP_DIR%\Tempahan Bilik Khas.bat"
    echo call run_system.bat >> "%DESKTOP_DIR%\Tempahan Bilik Khas.bat"
    echo [OK] Ikon pintasan "Tempahan Bilik Khas.bat" telah dicipta di Desktop anda!
)

echo.
echo [3/3] Melancarkan Sistem Tempahan Bilik Khas...
echo.

if %HAS_PYTHON% EQU 1 (
    python "%SCRIPT_DIR%run_portable_server.py"
) else if %HAS_PYTHON% EQU 2 (
    py "%SCRIPT_DIR%run_portable_server.py"
) else (
    echo Membuka sistem menggunakan pelayar web lalai anda...
    start "" %APP_HTML%
)

pause
