Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = "c:\Users\rohit\OneDrive\Documents\Sarkari News\sarkarijobalerts_20260803_145000.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
$srcDir = "c:\Users\rohit\OneDrive\Documents\Sarkari News\frontend\out"

Get-ChildItem -Path $srcDir -Recurse | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $relPath = $_.FullName.Substring($srcDir.Length + 1).Replace("\", "/")
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relPath) | Out-Null
    }
}

$zip.Dispose()
Write-Host "Linux compatible zip created successfully at: $zipPath"
