<# 
Creates a markdown log of user prompts and assistant responses.
Usage:
1) Interactive (recommended):
   .\log-chat.ps1
2) Single turn via parameters:
   .\log-chat.ps1 -Prompt "My question" -Response "My answer"
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$LogFile = (Join-Path $PSScriptRoot 'chat-log.md'),

    [Parameter(Mandatory = $false)]
    [string]$Prompt,

    [Parameter(Mandatory = $false)]
    [string]$Response
)

function Ensure-LogFile {
    param([string]$Path)

    if (!(Test-Path $Path)) {
        @(
            "# Chat Log"
            ""
        ) | Out-File -FilePath $Path -Encoding utf8
    }
}

function Read-MultiLine {
    param([string]$Label)

    Write-Host ""
    Write-Host "$Label (press Enter on empty line to finish)"
    $lines = @()
    while ($true) {
        $line = Read-Host ">"
        if ([string]::IsNullOrEmpty($line)) { break }
        $lines += $line
    }
    return ($lines -join "`n")
}

function Write-Turn {
    param(
        [string]$Path,
        [string]$UserText,
        [string]$AssistantText
    )

    if ([string]::IsNullOrWhiteSpace($UserText) -and [string]::IsNullOrWhiteSpace($AssistantText)) {
        return
    }

    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $Path -Value ""
    Add-Content -Path $Path -Value "## [$time]"
    Add-Content -Path $Path -Value "### You"
    Add-Content -Path $Path -Value '```'
    Add-Content -Path $Path -Value ($UserText.TrimEnd())
    Add-Content -Path $Path -Value '```'
    Add-Content -Path $Path -Value "### Assistant"
    Add-Content -Path $Path -Value '```'
    Add-Content -Path $Path -Value ($AssistantText.TrimEnd())
    Add-Content -Path $Path -Value '```'
}

if (($Prompt -and -not $Response) -or (-not $Prompt -and $Response)) {
    throw "Both -Prompt and -Response must be provided together."
}

Ensure-LogFile -Path $LogFile

if ($Prompt -ne $null -and $Response -ne $null) {
    Write-Turn -Path $LogFile -UserText $Prompt -AssistantText $Response
} else {
    while ($true) {
        $promptText = Read-MultiLine -Label "You"
        if ([string]::IsNullOrWhiteSpace($promptText)) {
            Write-Host "No prompt provided. Exiting."
            break
        }

        $responseText = Read-MultiLine -Label "Assistant"
        Write-Turn -Path $LogFile -UserText $promptText -AssistantText $responseText
        Write-Host "Turn saved to: $LogFile"
    }
}
