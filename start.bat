@echo off
cd /d "%~dp0"
set "PATH=%~dp0.tools\node-v26.13.1-win-x64;%PATH%"
"%~dp0.tools\node-v26.13.1-win-x64\node.exe" scripts\dev.mjs
