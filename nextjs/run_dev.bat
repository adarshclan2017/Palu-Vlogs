@echo off
REM Run Next.js dev server with PowerShell bypass to avoid execution policy issues
powershell -ExecutionPolicy Bypass -Command "npm run dev"
