# 打包 Chrome 扩展 zip（用于上架）

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root "manifest.json"
$manifestRaw = Get-Content $manifestPath -Raw -Encoding UTF8
if ($manifestRaw -match '"version"\s*:\s*"([^"]+)"') {
  $version = $Matches[1]
} else {
  throw "无法在 manifest.json 中读取 version 字段"
}
$distDir = Join-Path $root "dist"
$zipName = "qrcode-extension-v$version.zip"
$zipPath = Join-Path $distDir $zipName
$stagingDir = Join-Path $distDir "staging"

$includeFiles = @(
    "manifest.json",
    "background.js",
    "content.js",
    "qrcode.min.js",
    "modal.css"
)

$includeDirs = @("icons")

if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

foreach ($file in $includeFiles) {
    Copy-Item (Join-Path $root $file) (Join-Path $stagingDir $file)
}

foreach ($dir in $includeDirs) {
    Copy-Item (Join-Path $root $dir) (Join-Path $stagingDir $dir) -Recurse
}

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path (Join-Path $stagingDir "*") -DestinationPath $zipPath -Force
Remove-Item $stagingDir -Recurse -Force

Write-Host "已生成: $zipPath"
Write-Host "文件大小: $([math]::Round((Get-Item $zipPath).Length / 1KB, 1)) KB"
