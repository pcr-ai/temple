# ==============================================================
# Photo optimizer for the special-darshan-jun-2026 gallery
# - Resizes longest edge to 1920px (preserves aspect ratio)
# - Saves as JPEG at ~85% quality
# - Honors EXIF orientation
# - Also produces a 480px "thumb" for fast grid loading
# ==============================================================

param(
  [string[]]$Sources = @(
    'C:\Users\praka\Downloads\drive-download-20260611T191008Z-3-001',  # 20 DJI drone
    'C:\Users\praka\Downloads\drive-download-20260611T191129Z-3-001'   # 50 DSC temple
  ),
  [string]$RepoRoot = 'C:\Users\praka\temple'
)

Add-Type -AssemblyName System.Drawing

$maxFull  = 1920
$maxThumb = 480
$qualityFull  = 85L
$qualityThumb = 78L

# JPEG encoder + quality params (re-used)
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
               Where-Object { $_.MimeType -eq 'image/jpeg' }
$qualityKey  = [System.Drawing.Imaging.Encoder]::Quality

function Get-RotationFromExif {
  param([System.Drawing.Image]$img)
  # EXIF tag 0x0112 = Orientation
  if ($img.PropertyIdList -contains 0x0112) {
    $val = $img.GetPropertyItem(0x0112).Value[0]
    switch ($val) {
      3 { return [System.Drawing.RotateFlipType]::Rotate180FlipNone }
      6 { return [System.Drawing.RotateFlipType]::Rotate90FlipNone  }
      8 { return [System.Drawing.RotateFlipType]::Rotate270FlipNone }
      default { return [System.Drawing.RotateFlipType]::RotateNoneFlipNone }
    }
  }
  return [System.Drawing.RotateFlipType]::RotateNoneFlipNone
}

function Save-Jpeg {
  param(
    [System.Drawing.Bitmap]$bmp,
    [string]$outPath,
    [long]$quality
  )
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityKey, $quality)
  $bmp.Save($outPath, $jpegEncoder, $params)
  $params.Dispose()
}

function Resize-One {
  param(
    [string]$srcPath,
    [string]$outFullPath,
    [string]$outThumbPath
  )
  $img = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $rot = Get-RotationFromExif -img $img
    if ($rot -ne [System.Drawing.RotateFlipType]::RotateNoneFlipNone) {
      $img.RotateFlip($rot)
    }

    foreach ($variant in @(
      @{ Path = $outFullPath;  MaxEdge = $maxFull;  Quality = $qualityFull  },
      @{ Path = $outThumbPath; MaxEdge = $maxThumb; Quality = $qualityThumb }
    )) {
      $maxEdge = $variant.MaxEdge
      $w = $img.Width; $h = $img.Height
      $scale = [Math]::Min(1.0, [double]$maxEdge / [Math]::Max($w, $h))
      $newW = [int]([Math]::Round($w * $scale))
      $newH = [int]([Math]::Round($h * $scale))
      if ($newW -lt 1) { $newW = 1 }
      if ($newH -lt 1) { $newH = 1 }

      $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
      $g   = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
      } finally {
        $g.Dispose()
      }
      Save-Jpeg -bmp $bmp -outPath $variant.Path -quality $variant.Quality
      $bmp.Dispose()
    }
  } finally {
    $img.Dispose()
  }
}

# Decide destination subfolder based on filename prefix
function Get-Destination {
  param([string]$name)
  if ($name -like 'DJI_*') { return 'aerial' }
  return 'temple'
}

$manifestEntries = New-Object System.Collections.Generic.List[object]
$idx = 0
$allFiles = @()
foreach ($srcDir in $Sources) {
  $allFiles += Get-ChildItem -Path $srcDir -File | Where-Object { $_.Extension -match '^\.jpe?g$' }
}
$total = $allFiles.Count
Write-Host "Found $total source photos to process.`n"

foreach ($srcDir in $Sources) {
  Get-ChildItem -Path $srcDir -File |
    Where-Object { $_.Extension -match '^\.jpe?g$' } |
    Sort-Object Name |
    ForEach-Object {
      $idx++
      $section = Get-Destination -name $_.Name
      $base = [System.IO.Path]::GetFileNameWithoutExtension($_.Name).ToLower()
      $fullName  = "$base.jpg"
      $thumbName = "$base-thumb.jpg"

      $outDirFull  = Join-Path $RepoRoot "images\special-darshan-jun-2026\$section"
      $outDirThumb = Join-Path $RepoRoot "images\special-darshan-jun-2026\$section"
      $outFull  = Join-Path $outDirFull  $fullName
      $outThumb = Join-Path $outDirThumb $thumbName

      Write-Host ("[{0}/{1}] {2}  ->  {3}/{4}" -f $idx, $total, $_.Name, $section, $fullName)
      Resize-One -srcPath $_.FullName -outFullPath $outFull -outThumbPath $outThumb

      $manifestEntries.Add([pscustomobject]@{
        section = $section
        full    = "images/special-darshan-jun-2026/$section/$fullName"
        thumb   = "images/special-darshan-jun-2026/$section/$thumbName"
        title   = $base.ToUpper()
      }) | Out-Null
    }
}

# Emit manifest as JSON for the gallery page
$manifestPath = Join-Path $RepoRoot 'images\special-darshan-jun-2026\photos.json'
$manifestEntries | ConvertTo-Json -Depth 4 | Set-Content -Path $manifestPath -Encoding UTF8
Write-Host "`nManifest written: $manifestPath"

# Final size report
$opt = Get-ChildItem -Path (Join-Path $RepoRoot 'images\special-darshan-jun-2026') -Recurse -File
"Optimized files: {0}" -f $opt.Count
"Optimized total: {0} MB" -f ([math]::Round(($opt | Measure-Object Length -Sum).Sum / 1MB, 2))
