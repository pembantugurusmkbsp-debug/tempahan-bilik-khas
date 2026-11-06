@echo off
chcp 65001 >nul
title Menjalankan Sistem Tempahan Bilik Khas
color 0A

echo Memulakan Sistem Tempahan Bilik Khas SMKBSP...
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python "%~dp0run_portable_server.py"
) else (
    py --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        py "%~dp0run_portable_server.py"
    ) else (
        start "" "%~dp0..\app\index.html"
    )
)
