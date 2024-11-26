@echo off
echo [92m================================[0m
echo [92m NetRunner OSINT Aggregator[0m
echo [92m================================[0m
echo.

:: Kill any existing Python processes
taskkill /F /IM python.exe 2>nul

echo Starting the server...
echo The tool will be available at: http://localhost:8080
echo.
echo [93mPress Ctrl+C to stop the server[0m
echo.

python main.py
