# Hugo to Astro Migration Script
# Migrates all remaining posts from Hugo content/posts to Astro src/content/blog

$hugoPostsDir = "C:\Users\UstOldfield\repos\ust-blog\content\posts"
$astroContentDir = "C:\Users\UstOldfield\repos\ust-blog\purple-phase\src\content\blog"

# Mapping of Hugo sections to Astro categories/tags
$sectionMap = @{
    "ai" = @{ category = "ai"; tag = "ai" }
    "data mesh" = @{ category = "data-mesh"; tag = "data-mesh" }
    "databricks" = @{ category = "databricks"; tag = "databricks" }
    "data lake" = @{ category = "data-lake"; tag = "data-lake" }
    "data modelling" = @{ category = "data-modelling"; tag = "data-modelling" }
    "data science" = @{ category = "data-science"; tag = "data-science" }
    "governance" = @{ category = "governance"; tag = "governance" }
    "maths" = @{ category = "maths"; tag = "maths" }
    "philosophy" = @{ category = "philosophy"; tag = "philosophy" }
    "sql" = @{ category = "sql"; tag = "sql" }
    "strategy" = @{ category = "strategy"; tag = "strategy" }
    "testing" = @{ category = "testing"; tag = "testing" }
}

# Posts already migrated (skip these)
$alreadyMigrated = @(
    "agentic-ai-rpa-bpa",
    "purpose-in-the-age-of-ai",
    "synthetic-voters",
    "on-value",
    "on-open-formats",
    "on-perspective",
    "on-immigration",
    "on-change",
    "what-is-data-mesh"
)

function Convert-HugoFrontMatter {
    param (
        [string]$content,
        [string]$section,
        [string]$slug
    )
    
    # Extract title
    if ($content -match 'title:\s+"([^"]+)"' -or $content -match 'title:\s+([^\r\n]+)') {
        $title = $matches[1].Trim('"')
    }
    
    # Extract date
    if ($content -match 'date:\s+([^\r\n]+)') {
        $date = $matches[1].Trim()
    }
    
    # Extract description
    $description = ""
    if ($content -match 'description:\s+"([^"]+)"' -or $content -match 'description:\s+([^\r\n]+)') {
        $description = $matches[1].Trim('"')
    }
    
    $mapping = $sectionMap[$section]
    $category = $mapping.category
    $tag = $mapping.tag
    
    # Build Astro front matter
    $astroFrontMatter = @"
---
title: "$title"
pubDate: $date
"@
    
    if ($description) {
        $astroFrontMatter += "`ndescription: `"$description`""
    }
    
    $astroFrontMatter += @"

tags: ["$tag"]
categories: ["$category"]
slug: "$slug"
---
"@
    
    return $astroFrontMatter
}

function Convert-HugoShortcodes {
    param (
        [string]$content,
        [ref]$needsMdx
    )
    
    # Convert {{< figure >}} to <Figure />
    if ($content -match '{{<\s*figure') {
        $needsMdx.Value = $true
        $content = $content -replace '{{<\s*figure\s+src="([^"]+)"\s+alt="([^"]*)"\s+width="([^"]*)"\s+align="([^"]*)"\s*>}}', '<Figure src="$1" alt="$2" width="$3" align="$4" />'
        $content = $content -replace '{{<\s*figure\s+src="([^"]+)"\s+alt="([^"]*)"\s+width="([^"]*)"\s*>}}', '<Figure src="$1" alt="$2" width="$3" />'
        $content = $content -replace '{{<\s*figure\s+src="([^"]+)"\s+alt="([^"]*)"\s*>}}', '<Figure src="$1" alt="$2" />'
    }
    
    # Convert {{< gist >}} to <Gist />
    if ($content -match '{{<\s*gist') {
        $needsMdx.Value = $true
        $content = $content -replace '{{<\s*gist\s+([^\s]+)\s+([^\s]+)\s*>}}', '<Gist username="$1" gistId="$2" />'
    }
    
    # Convert {{< youtube >}} to iframe or component
    if ($content -match '{{<\s*youtube') {
        $needsMdx.Value = $true
        $content = $content -replace '{{<\s*youtube\s+([^\s]+)\s*>}}', '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    }
    
    return $content
}

# Get all Hugo post directories
Get-ChildItem -Path $hugoPostsDir -Recurse -Filter "index.md" | ForEach-Object {
    $hugoFile = $_
    $section = $hugoFile.Directory.Parent.Name
    $postDir = $hugoFile.Directory.Name
    
    # Skip already migrated
    if ($alreadyMigrated -contains $postDir) {
        Write-Host "Skipping $postDir (already migrated)" -ForegroundColor Yellow
        return
    }
    
    # Read Hugo content
    $content = Get-Content $hugoFile.FullName -Raw
    
    # Skip empty files
    if ([string]::IsNullOrWhiteSpace($content)) {
        Write-Host "Skipping $postDir (empty file)" -ForegroundColor Gray
        return
    }
    
    # Determine slug
    $sectionSlug = $sectionMap[$section].category
    $slug = "$sectionSlug/$postDir"
    
    # Split front matter and body
    $parts = $content -split '---', 3
    if ($parts.Count -lt 3) {
        Write-Host "Skipping $postDir (invalid format)" -ForegroundColor Red
        return
    }
    
    $body = $parts[2].Trim()
    
    # Convert front matter
    $astroFrontMatter = Convert-HugoFrontMatter -content $content -section $section -slug $slug
    
    # Convert shortcodes and check if MDX needed
    $needsMdx = $false
    $body = Convert-HugoShortcodes -content $body -needsMdx ([ref]$needsMdx)
    
    # Determine file extension
    $extension = if ($needsMdx) { "mdx" } else { "md" }
    
    # Add MDX imports if needed
    $mdxImports = ""
    if ($needsMdx) {
        if ($body -match '<Figure') {
            $mdxImports += "import Figure from '../../components/Figure.astro';`n"
        }
        if ($body -match '<Gist') {
            $mdxImports += "import Gist from '../../components/Gist.astro';`n"
        }
        $mdxImports += "`n"
    }
    
    # Combine
    $astroContent = $astroFrontMatter + "`n`n" + $mdxImports + $body
    
    # Write to Astro content directory
    $astroFile = Join-Path $astroContentDir "$postDir.$extension"
    Set-Content -Path $astroFile -Value $astroContent -Encoding UTF8
    
    Write-Host "Migrated: $postDir -> $astroFile" -ForegroundColor Green
}

Write-Host "`nMigration complete!" -ForegroundColor Cyan
