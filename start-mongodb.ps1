# PowerShell script to start MongoDB on Windows

Write-Host "🔍 Checking MongoDB status..." -ForegroundColor Cyan

# Check if MongoDB service exists
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "✅ MongoDB service found!" -ForegroundColor Green
    
    if ($mongoService.Status -eq 'Running') {
        Write-Host "✅ MongoDB is already running!" -ForegroundColor Green
        Write-Host "You can now start your backend server." -ForegroundColor Yellow
    } else {
        Write-Host "🔄 Starting MongoDB service..." -ForegroundColor Yellow
        try {
            Start-Service -Name "MongoDB"
            Write-Host "✅ MongoDB started successfully!" -ForegroundColor Green
            Write-Host "You can now start your backend server." -ForegroundColor Yellow
        } catch {
            Write-Host "❌ Failed to start MongoDB service: $_" -ForegroundColor Red
            Write-Host "Try running this script as Administrator" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ MongoDB service not found." -ForegroundColor Red
    Write-Host ""
    Write-Host "MongoDB might not be installed. Here are your options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install MongoDB Community Server" -ForegroundColor Cyan
    Write-Host "  1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "  2. Install with 'Install as a Service' option checked" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use MongoDB Compass" -ForegroundColor Cyan
    Write-Host "  1. Open MongoDB Compass" -ForegroundColor White
    Write-Host "  2. Click 'Connect' - it may start MongoDB automatically" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Use MongoDB Atlas (Cloud - Free)" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://www.mongodb.com/cloud/atlas" -ForegroundColor White
    Write-Host "  2. Create free cluster" -ForegroundColor White
    Write-Host "  3. Get connection string and set MONGODB_URI environment variable" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: The app will work without MongoDB, but login/session saving won't work." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

