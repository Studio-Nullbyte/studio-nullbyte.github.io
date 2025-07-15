# Icon Generator Script for Studio Nullbyte
# This script resizes the source logo to all required icon sizes

Add-Type -AssemblyName System.Drawing

$sourceImage = "d:\src\studio-nullbyte.github.io\public\images\SNLogo.jpg"
$outputDir = "d:\src\studio-nullbyte.github.io\public"

# Define all required icon sizes and filenames
$iconSizes = @{
    "favicon-16x16.png" = 16
    "favicon-32x32.png" = 32
    "apple-touch-icon-57x57.png" = 57
    "apple-touch-icon-60x60.png" = 60
    "apple-touch-icon-72x72.png" = 72
    "apple-touch-icon-76x76.png" = 76
    "apple-touch-icon-114x114.png" = 114
    "apple-touch-icon-120x120.png" = 120
    "apple-touch-icon-144x144.png" = 144
    "apple-touch-icon-152x152.png" = 152
    "apple-touch-icon.png" = 180
    "android-chrome-192x192.png" = 192
    "mstile-70x70.png" = 70
    "mstile-150x150.png" = 150
    "mstile-310x150.png" = 310  # Will be 310x150 (wide)
    "mstile-310x310.png" = 310
    "android-chrome-512x512.png" = 512
}

function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height = $Width
    )
    
    try {
        # Load the source image
        $sourceImg = [System.Drawing.Image]::FromFile($InputPath)
        
        # Create new bitmap with desired size
        $newImg = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($newImg)
        
        # Set high quality rendering
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        # Draw the resized image
        $graphics.DrawImage($sourceImg, 0, 0, $Width, $Height)
        
        # Save as PNG
        $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Clean up
        $graphics.Dispose()
        $newImg.Dispose()
        $sourceImg.Dispose()
        
        Write-Host "✓ Created: $OutputPath ($Width x $Height)"
        return $true
    }
    catch {
        Write-Host "✗ Error creating $OutputPath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if source image exists
if (-not (Test-Path $sourceImage)) {
    Write-Host "Source image not found: $sourceImage" -ForegroundColor Red
    exit 1
}

Write-Host "🎨 Generating icons from: $sourceImage" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$totalCount = $iconSizes.Count

# Generate all icon sizes
foreach ($icon in $iconSizes.GetEnumerator()) {
    $outputPath = Join-Path $outputDir $icon.Key
    $size = $icon.Value
    
    # Handle special case for wide tile (310x150)
    if ($icon.Key -eq "mstile-310x150.png") {
        $success = Resize-Image -InputPath $sourceImage -OutputPath $outputPath -Width 310 -Height 150
    } else {
        $success = Resize-Image -InputPath $sourceImage -OutputPath $outputPath -Width $size -Height $size
    }
    
    if ($success) { $successCount++ }
}

# Create favicon.ico (32x32)
$faviconPath = Join-Path $outputDir "favicon.ico"
try {
    $favicon32 = Join-Path $outputDir "favicon-32x32.png"
    if (Test-Path $favicon32) {
        Copy-Item $favicon32 $faviconPath
        Write-Host "✓ Created: favicon.ico (copied from 32x32)" -ForegroundColor Green
        $successCount++
        $totalCount++
    }
} catch {
    Write-Host "✗ Error creating favicon.ico: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Summary: $successCount/$totalCount icons created successfully" -ForegroundColor Green

if ($successCount -eq $totalCount) {
    Write-Host "🚀 All icons generated successfully!" -ForegroundColor Green
    Write-Host "Your Studio Nullbyte site now has complete cross-platform icon support!" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some icons failed to generate. Check the errors above." -ForegroundColor Yellow
}

# List generated files
Write-Host ""
Write-Host "📁 Generated icon files:" -ForegroundColor Cyan
Get-ChildItem $outputDir -Filter "*.png" | Where-Object { $_.Name -match "(favicon|apple|android|mstile)" } | ForEach-Object {
    $size = (Get-ChildItem $_.FullName | ForEach-Object { [System.Drawing.Image]::FromFile($_.FullName) } | ForEach-Object { "$($_.Width)x$($_.Height)"; $_.Dispose() })
    Write-Host "  $($_.Name) - $size"
}

if (Test-Path (Join-Path $outputDir "favicon.ico")) {
    Write-Host "  favicon.ico - 32x32"
}
