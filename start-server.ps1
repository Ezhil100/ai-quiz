# AI Quiz - WiFi Server Starter
# This script starts a local server accessible from mobile devices on the same WiFi

Write-Host "🚀 Starting AI Quiz Server..." -ForegroundColor Cyan
Write-Host ""

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" }).IPAddress | Select-Object -First 1

if (-not $localIP) {
    Write-Host "❌ Could not find WiFi IP address" -ForegroundColor Red
    Write-Host "Make sure you're connected to WiFi" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "📱 Your Computer's WiFi IP: " -NoNewline -ForegroundColor Green
Write-Host $localIP -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Access from mobile browser:" -ForegroundColor Cyan
Write-Host "   http://${localIP}:8080" -ForegroundColor White
Write-Host ""
Write-Host "📋 Instructions:" -ForegroundColor Magenta
Write-Host "   1. Make sure your phone is on the SAME WiFi network" -ForegroundColor White
Write-Host "   2. Open browser on your phone" -ForegroundColor White
Write-Host "   3. Type: http://${localIP}:8080" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Start Python HTTP server on all network interfaces
try {
    python -m http.server 8080 --bind 0.0.0.0
}
catch {
    Write-Host "❌ Python not found. Trying alternative method..." -ForegroundColor Red
    
    # Try PHP if available
    try {
        php -S 0.0.0.0:8080
    }
    catch {
        Write-Host ""
        Write-Host "❌ No suitable server found." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install Python:" -ForegroundColor Yellow
        Write-Host "   1. Download from: https://www.python.org/downloads/" -ForegroundColor White
        Write-Host "   2. Run installer and check 'Add Python to PATH'" -ForegroundColor White
        Write-Host "   3. Restart terminal and run this script again" -ForegroundColor White
        pause
    }
}
