param(
    [string]$InputFile = "docs/architecture.mmd",
    [string]$PngOutput = "docs/architecture.png",
    [string]$SvgOutput = "docs/architecture.svg"
)

if (-not (Test-Path $InputFile)) {
    throw "Mermaid source not found: $InputFile"
}

& npx @mermaid-js/mermaid-cli -i $InputFile -o $PngOutput
& npx @mermaid-js/mermaid-cli -i $InputFile -o $SvgOutput

Write-Host "Exported:"
Write-Host "  PNG -> $PngOutput"
Write-Host "  SVG -> $SvgOutput"
