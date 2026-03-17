# Architecture Diagram Export (PNG/SVG)

The architecture source is available in:

- [architecture.mmd](/g:/ReactProjects/ReactProjects/my-react-app/docs/architecture.mmd)

## Quick export (PowerShell)

Run from repo root:

```powershell
npx @mermaid-js/mermaid-cli -i .\docs\architecture.mmd -o .\docs\architecture.png
npx @mermaid-js/mermaid-cli -i .\docs\architecture.mmd -o .\docs\architecture.svg
```

## Optional convenience script

Run:

```powershell
.\scripts\export-architecture-diagram.ps1
```

It creates:

- `docs\architecture.png`
- `docs\architecture.svg`

The script will generate both files with one call and can be re-run anytime when the Mermaid source changes.

## Notes

- If `@mermaid-js/mermaid-cli` is not installed globally, `npx` downloads and runs it temporarily.
- If network is blocked, install once locally/global and re-run with `mmdc`.
