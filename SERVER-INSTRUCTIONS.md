# 📱 Mobile Access Instructions

## Quick Start

### Option 1: Using PowerShell Script (Easiest)

1. Right-click `start-server.ps1`
2. Select "Run with PowerShell"
3. Note the IP address shown (e.g., `192.168.1.100:8080`)
4. Open that URL on your mobile browser

### Option 2: Manual Python Server

```powershell
# Find your IP address
ipconfig

# Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)

# Start server
python -m http.server 8080 --bind 0.0.0.0
```

Then access: `http://YOUR-IP:8080` on mobile

### Option 3: Using Node.js (if installed)

```powershell
# Install http-server globally (one-time)
npm install -g http-server

# Start server
http-server -p 8080 -a 0.0.0.0
```

## Important Notes

✅ **Requirements:**

- Computer and phone must be on the SAME WiFi network
- Python installed (most Windows 10/11 have it by default)
- Firewall may need to allow port 8080

🔥 **Firewall Issue?**
If you can't connect from mobile, run this in PowerShell (as Administrator):

```powershell
New-NetFirewallRule -DisplayName "Quiz Server" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

📱 **Testing:**

1. Start server on computer
2. Note the IP address (e.g., 192.168.1.100)
3. On mobile, open browser and go to: `http://192.168.1.100:8080`
4. Quiz should load!

🛑 **To Stop Server:**
Press `Ctrl + C` in the terminal

## Troubleshooting

**Problem: Can't access from phone**

- Verify both devices are on same WiFi
- Check firewall settings
- Try a different port (e.g., 8000, 3000)
- Make sure server is running on computer

**Problem: "Python not found"**

- Install Python from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"
- Restart terminal after installation

**Problem: Port already in use**

- Change port number: `python -m http.server 8081 --bind 0.0.0.0`
- Access with new port: `http://YOUR-IP:8081`
