<#
.SYNOPSIS
    Create a content vault entry.

.DESCRIPTION
    Creates a dated markdown file in the vault/ directory with front matter,
    then opens it in your editor so you can paste the raw material.

.EXAMPLE
    .\capture.ps1 "Apiary conference talk" -Type conference_talk -Pillar technical_deep_dive
    .\capture.ps1 "GDPR ontology v3" -Type deep_work -Pillar governance_architect
    .\capture.ps1 "On swimming" -Type blog -Pillar personal -ImportFile ~\drafts\swimming.md
    .\capture.ps1  # interactive mode
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Title,

    [Alias("t")]
    [ValidateSet("conference_talk", "deep_work", "blog", "side_project")]
    [string]$Type,

    [Alias("p")]
    [ValidateSet("technical_deep_dive", "data_philosophy", "governance_architect", "personal", "conference")]
    [string]$Pillar,

    [Alias("f")]
    [string]$ImportFile,

    [switch]$NoEdit
)

# ── Config ──────────────────────────────────────────────────

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$VaultRoot = Split-Path -Parent $ScriptDir
$VaultDir  = Join-Path $VaultRoot "vault"

# Editor: prefer VS Code, fall back to notepad
$Editor = if (Get-Command code -ErrorAction SilentlyContinue) { "code" }
          elseif ($env:EDITOR) { $env:EDITOR }
          else { "notepad" }

$ValidTypes   = @("conference_talk", "deep_work", "blog", "side_project")
$ValidPillars = @("technical_deep_dive", "data_philosophy", "governance_architect", "personal", "conference")

# ── Helpers ─────────────────────────────────────────────────

function Select-Option {
    param(
        [string]$Prompt,
        [string[]]$Options
    )
    Write-Host $Prompt
    for ($i = 0; $i -lt $Options.Count; $i++) {
        Write-Host "  $($i + 1). $($Options[$i])"
    }
    while ($true) {
        $choice = Read-Host "  >"
        if ($choice -match '^\d+$') {
            $idx = [int]$choice - 1
            if ($idx -ge 0 -and $idx -lt $Options.Count) {
                return $Options[$idx]
            }
        }
        Write-Host "  Invalid choice. Enter a number 1-$($Options.Count)."
    }
}

function ConvertTo-Slug {
    param([string]$Text)
    $Text.ToLower() -replace '[^a-z0-9]', '-' -replace '-+', '-' -replace '^-|-$', ''
}

# ── Interactive mode for missing fields ─────────────────────

if (-not $Title) {
    $Title = Read-Host "Title"
    if (-not $Title) {
        Write-Error "Title is required."
        exit 1
    }
}

if (-not $Type) {
    $Type = Select-Option "Source type:" $ValidTypes
}

if (-not $Pillar) {
    $Pillar = Select-Option "Content pillar:" $ValidPillars
}

# ── Create vault entry ──────────────────────────────────────

$Date     = Get-Date -Format "yyyy-MM-dd"
$Slug     = ConvertTo-Slug $Title
$Filename = "${Date}-${Slug}.md"
$Filepath = Join-Path $VaultDir $Filename

# Ensure vault directory exists
if (-not (Test-Path $VaultDir)) {
    New-Item -ItemType Directory -Path $VaultDir -Force | Out-Null
}

# Don't overwrite
if (Test-Path $Filepath) {
    Write-Host "Entry already exists: $Filepath"
    Write-Host "Opening existing entry..."
    & $Editor $Filepath
    exit 0
}

# Build content
$Content = @"
---
source_type: ${Type}
title: "${Title}"
date: ${Date}
pillar: ${Pillar}
status: captured
atoms_extracted: false
---

# ${Title}

## Context

<!-- What were you working on? What prompted this? -->


## Raw Material

<!-- Paste the source material below: slide text, speaker notes,
     design doc, blog draft, code snippets, journal entry —
     whatever the raw thinking is. Don't edit it. Just capture. -->

"@

# Import from file if provided
if ($ImportFile) {
    if (Test-Path $ImportFile) {
        $Imported = Get-Content $ImportFile -Raw
        $Content += "`n`n$Imported"
        Write-Host "Imported content from: $ImportFile"
    } else {
        Write-Warning "Import file not found: $ImportFile"
    }
}

# Write file (UTF-8 without BOM for markdown compatibility)
[System.IO.File]::WriteAllText($Filepath, $Content, [System.Text.UTF8Encoding]::new($false))

Write-Host "✓ Created: $Filepath" -ForegroundColor Green

# Open in editor
if (-not $NoEdit) {
    & $Editor $Filepath
}
