# Image Organization Script for Windows
# 
# Usage:
# 1. Place your image files in: C:\Test_laksh\images-to-organize\
# 2. Update the image mappings below with your actual filenames
# 3. Run this script from PowerShell
#
# Example in PowerShell:
# Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# .\organize-images.ps1

# Configuration paths
$sourceDir = "C:\Test_laksh\images-to-organize"
$collectionsDir = "C:\Test_laksh\frontend\public\images\collections"

# Ensure source directory exists
if (-not (Test-Path $sourceDir)) {
    Write-Host "📁 Creating source directory: $sourceDir" -ForegroundColor Green
    New-Item -ItemType Directory -Path $sourceDir -Force | Out-Null
    Write-Host "Please place your images in: $sourceDir" -ForegroundColor Yellow
    exit
}

# Ensure collection directories exist
@("women", "men", "signature", "wedding") | ForEach-Object {
    $dir = Join-Path $collectionsDir $_
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created: $dir" -ForegroundColor Green
    }
}

# Display available images in source directory
Write-Host "`n📸 Images found in source directory:" -ForegroundColor Cyan
Get-ChildItem $sourceDir -Include *.jpg, *.jpeg, *.png, *.webp | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}

Write-Host "`n📋 Image Mapping Template" -ForegroundColor Cyan
Write-Host "========================`n"

$mappings = @(
    @{
        Collection = "women"
        Count = 4
        Names = @("women-1.jpg", "women-2.jpg", "women-3.jpg", "women-4.jpg")
        Examples = @("wedding-dress", "casual-wear", "elegant-gown", "modern-style")
    },
    @{
        Collection = "men"
        Count = 2
        Names = @("men-1.jpg", "men-2.jpg")
        Examples = @("formal-wear", "casual-style")
    },
    @{
        Collection = "signature"
        Count = 4
        Names = @("signature-1.jpg", "signature-2.jpg", "signature-3.jpg", "signature-4.jpg")
        Examples = @("bridal-lehenga", "embroidered", "premium-dress", "luxury-gown")
    },
    @{
        Collection = "wedding"
        Count = 3
        Names = @("wedding-1.jpg", "wedding-2.jpg", "wedding-3.jpg")
        Examples = @("red-gold-bride", "white-wedding", "elegant-ensemble")
    }
)

$mappings | ForEach-Object {
    Write-Host "📍 $($_.Collection.ToUpper()) Collection ($($_.Count) images):" -ForegroundColor Yellow
    for ($i = 0; $i -lt $_.Count; $i++) {
        $name = $_.Names[$i]
        $example = $_.Examples[$i]
        Write-Host "  → Rename your '$example' image to: $name" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "💡 Instructions:" -ForegroundColor Green
Write-Host "1. Place all your images in: $sourceDir" -ForegroundColor White
Write-Host "2. Move images to collection folders and rename them:" -ForegroundColor White

@("women", "men", "signature", "wedding") | ForEach-Object {
    $folder = Join-Path $collectionsDir $_
    Write-Host "   - Images for '$_' → $folder\" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✨ Configuration is ready! Update collectionImages.js with local paths:" -ForegroundColor Green
Write-Host "   File: C:\Test_laksh\frontend\src\data\collectionImages.js" -ForegroundColor Gray
Write-Host "   Current status: ✅ Already updated with local image paths!" -ForegroundColor Green
