$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$pages = @('index.html', 'pages/tentang-kami.html', 'pages/layanan.html', 'pages/armada.html', 'pages/pusat-bantuan.html')
$failures = [System.Collections.Generic.List[string]]::new()
$placeholderLinks = 0
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { throw 'Node.js diperlukan untuk pemeriksaan sintaks JavaScript.' }
$tempJs = Join-Path $env:TEMP ('anatlia-inline-' + [guid]::NewGuid().ToString('N') + '.js')

foreach ($relativePage in $pages) {
    $page = Join-Path $root $relativePage
    if (-not (Test-Path $page)) { $failures.Add("Halaman hilang: $relativePage"); continue }
    $html = Get-Content -Raw $page
    if ($html -notmatch 'data-mobile-nav-toggle' -or $html -notmatch 'id="mobile-navigation"' -or $html -notmatch 'site-shell\.js') {
        $failures.Add("Mobile navigation shell tidak lengkap di $relativePage")
    }
    $shellScriptCount = ([regex]::Matches($html, '<script\b[^>]*\bsrc="[^"]*site-shell\.js"')).Count
    if ($shellScriptCount -ne 1) { $failures.Add("Diharapkan tepat satu pemuatan js/site-shell.js di $relativePage; ditemukan $shellScriptCount") }
    $topButtonCount = ([regex]::Matches($html, 'id="scrollToTopBtn"')).Count
    if ($topButtonCount -ne 1) { $failures.Add("Diharapkan tepat satu tombol kembali ke atas di $relativePage; ditemukan $topButtonCount") }
    if ($html -notmatch '(?is)<title>\s*[^<]+\s*</title>') { $failures.Add("Judul halaman tidak tersedia di $relativePage") }
    $expectedLogoPath = if ($relativePage -eq 'index.html') { 'logo.png' } else { '../logo.png' }
    $logoPattern = '<img\b(?=[^>]*\balt="ANANTALIA TRANS Logo")[^>]*\bsrc="' + [regex]::Escape($expectedLogoPath) + '"'
    $logoCount = ([regex]::Matches($html, $logoPattern)).Count
    if ($logoCount -ne 2) { $failures.Add("Diharapkan 2 logo lokal ($expectedLogoPath) di $relativePage; ditemukan $logoCount") }
    if ($html -match 'Scroll to top floating button logic') {
        $failures.Add("Logika tombol kembali ke atas masih inline di $relativePage; gunakan shell bersama.")
    }
    $ids = @([regex]::Matches($html, '\bid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
    $duplicates = @($ids | Group-Object | Where-Object Count -gt 1 | ForEach-Object Name)
    if ($duplicates.Count) { $failures.Add("ID duplikat di ${relativePage}: $($duplicates -join ', ')") }

    foreach ($match in [regex]::Matches($html, '\b(?:href|src)="([^"]+)"')) {
        $url = $match.Groups[1].Value
        if ([string]::IsNullOrWhiteSpace($url) -or $url -match '^(https?:|mailto:|tel:|#|javascript:|data:)') { continue }
        $localPath = ($url -split '[?#]')[0]
        if (-not [string]::IsNullOrWhiteSpace($localPath) -and -not (Test-Path (Join-Path (Split-Path -Parent $page) $localPath))) {
            $failures.Add("Path lokal rusak di ${relativePage}: $url")
        }
    }

    foreach ($match in [regex]::Matches($html, '\bhref="([^"]+)"')) {
        $url = $match.Groups[1].Value
        if ($url -eq '#') { $placeholderLinks++; continue }
        if ($url -match '^(https?:|mailto:|tel:|javascript:|data:)') { continue }
        $parts = $url -split '#', 2
        $localPath = (($parts[0] -split '\?', 2)[0])
        $fragment = if ($parts.Count -gt 1) { [uri]::UnescapeDataString(($parts[1] -split '\?', 2)[0]) } else { '' }
        $targetPage = if ([string]::IsNullOrWhiteSpace($localPath)) { $page } else { Join-Path (Split-Path -Parent $page) $localPath }
        if ($fragment -and [IO.Path]::GetExtension($targetPage) -eq '.html' -and (Test-Path -LiteralPath $targetPage)) {
            $targetHtml = Get-Content -Raw $targetPage
            $targetIds = @([regex]::Matches($targetHtml, '\bid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
            if ($fragment -notin $targetIds) { $failures.Add("Target fragmen tidak ditemukan di ${relativePage}: $url") }
        }
    }

    $index = 0
    foreach ($script in [regex]::Matches($html, '(?is)<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>')) {
        $index++
        Set-Content -NoNewline -Encoding utf8 $tempJs $script.Groups[1].Value
        & node --check $tempJs 2>$null
        if ($LASTEXITCODE -ne 0) { $failures.Add("Sintaks inline JavaScript gagal di ${relativePage}, blok $index") }
    }
}

& node --check (Join-Path $root 'js/site-shell.js') 2>$null
if ($LASTEXITCODE -ne 0) { $failures.Add('Sintaks js/site-shell.js gagal.') }
$siteShell = Get-Content -Raw (Join-Path $root 'js/site-shell.js')
if ($siteShell -notmatch 'scrollToTopBtn' -or $siteShell -notmatch 'window\.scrollTo') {
    $failures.Add('Logika tombol kembali ke atas tidak ditemukan di js/site-shell.js.')
}
if (([regex]::Matches($siteShell, "addEventListener\('scroll'")).Count -ne 1 -or
    ([regex]::Matches($siteShell, "scrollToTopButton\.addEventListener\('click'")).Count -ne 1) {
    $failures.Add('Diharapkan satu listener scroll dan satu listener klik tombol kembali ke atas di js/site-shell.js.')
}
& node --check (Join-Path $root 'js/tailwind-config.js') 2>$null
if ($LASTEXITCODE -ne 0) { $failures.Add('Sintaks js/tailwind-config.js gagal.') }
& node --check (Join-Path $root 'js/pusat-bantuan.js') 2>$null
if ($LASTEXITCODE -ne 0) { $failures.Add('Sintaks js/pusat-bantuan.js gagal.') }

$homeHtml = Get-Content -Raw (Join-Path $root 'index.html')
if ($homeHtml -notmatch '(?is)<a\b[^>]*href="\./pages/tentang-kami\.html"[^>]*>\s*<span>Pelajari Selengkapnya Tentang Kami</span>') {
    $failures.Add('Tautan "Pelajari Selengkapnya Tentang Kami" tidak menuju halaman Tentang Kami.')
}

$cssFiles = @('css/main.css', 'css/armada.css')
foreach ($relativeCss in $cssFiles) {
    $css = Get-Content -Raw (Join-Path $root $relativeCss)
    $opens = ([regex]::Matches($css, '\{')).Count
    $closes = ([regex]::Matches($css, '\}')).Count
    if ($opens -ne $closes) { $failures.Add("Kurung kurawal CSS tidak seimbang: $relativeCss ($opens/$closes)") }
}

try { Remove-Item -LiteralPath $tempJs -Force -ErrorAction SilentlyContinue } catch {}
if ($failures.Count) {
    $failures | ForEach-Object { Write-Error $_ }
    exit 1
}
Write-Output "LULUS: $($pages.Count) halaman, shell navigasi, logo dan path lokal, target fragmen, ID unik, CSS, dan sintaks JavaScript."
if ($placeholderLinks -gt 0) {
    Write-Warning ('{0} tautan href="#" masih menunggu tujuan resmi Syarat & Ketentuan dan Kebijakan Privasi.' -f $placeholderLinks)
}
