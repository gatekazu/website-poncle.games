@echo off
REM Serves this folder on http://localhost:8080 so YouTube embeds work
REM (YouTube refuses to play inside pages opened directly as files).
cd /d "%~dp0"
start "" http://localhost:8080
python -m http.server 8080 || py -m http.server 8080
