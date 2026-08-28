@echo off
chcp 65001 >nul
title ASELA SCANNER - Masaustu Kurulum ve Baslatici
color 0b

echo =======================================================
echo     ASELA SCANNER - MASAUSTU KURULUM VE BASLATICI      
echo =======================================================
echo.

cd /d "%~dp0"

echo [1/3] Gerekli paketler kontrol ediliyor / yukleniyor...
call npm install

echo.
echo [2/3] Arayuz ve Masaustu modulu paketleniyor...
call npm run build

echo.
echo [3/3] Standalone Masaustu EXE Derleniyor...
call npx --yes @electron/packager . "ASELA-SCANNER" --platform=win32 --arch=x64 --out=release --overwrite --no-asar --electron-version=34.3.0

echo.
if exist "release\ASELA-SCANNER-win32-x64\ASELA-SCANNER.exe" (
    echo =======================================================
    echo    TEBRIKLER! MASAUSTU UYGULAMASI BASARIYLA ACILIYOR!
    echo =======================================================
    echo.
    start "" "release\ASELA-SCANNER-win32-x64\ASELA-SCANNER.exe"
) else (
    echo [i] Dogrudan masaustu penceresi aciliyor...
    call npx electron .
)
