@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Push Projek ke GitHub (SMKBSP)
color 0B

echo =====================================================================
echo           SKRIP AUTOMATIK PUSH KE GITHUB
echo   Sistem E-Tempahan Bilik Khas SMK Bandar Seri Putra
echo   Sasaran: https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas
echo =====================================================================
echo.

:: 1. Semak sama ada git dipasang
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [RALAT] Git tidak ditemui pada komputer ini.
    echo Sila pasang Git dari: https://git-scm.com/downloads
    pause
    exit /b
)

:: 2. Tetapkan pautan repositori GitHub yang telah disahkan
set REPO_URL=https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas.git

echo [1/3] Menetapkan remote origin ke:
echo %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

:: 3. Commit sebarang perubahan tempatan terkini
echo.
echo [2/3] Mengesahkan rekod commit tempatan...
git add .
git commit -m "Auto commit: Kemas kini fail terkini SMKBSP v2.5" >nul 2>&1

:: 4. Jalankan push terus ke GitHub
echo.
echo [3/3] Sedang menghantar (push) kod ke GitHub cawangan 'main'...
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================================
    echo [TAHNIAH] Semua fail projek berjaya di-push ke GitHub anda!
    echo Sila semak repositori anda di:
    echo https://github.com/pembantugurusmkbsp-debug/tempahan-bilik-khas
    echo =====================================================================
) else (
    echo.
    echo =====================================================================
    echo [PERHATIAN] Git memerlukan log masuk akaun GitHub anda.
    echo.
    echo Jika pelayar web dibuka, klik "Sign in with your browser" dan klik "Authorize".
    echo Atau gunakan Personal Access Token jika diminta kata laluan.
    echo =====================================================================
)

echo.
pause
