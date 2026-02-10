# ustdoes.tech Blog Migration Toolkit

Migrate all your blog posts from external sources into Hugo-compatible markdown, making ustdoes.tech the single source of truth for your work.

## Sources Supported

| Source | URL | Posts | Type |
|--------|-----|-------|------|
| Advancing Analytics | `advancinganalytics.co.uk/blog/author/ust-oldfield` | Multiple pages | Squarespace |
| Adatis (Telefonica Tech) | `adatis.co.uk/author/ustoldfield/` | ~42 posts (2015–2022) | WordPress |
| YouTube | Any YouTube URL | Via transcript | Transcript API |

## Quick Start

```bash
# Install dependencies
pip install beautifulsoup4 requests markdownify youtube-transcript-api

# Preview what would be migrated (no files written)
python migrate_posts.py --source all --dry-run

# List all discovered posts
python migrate_posts.py --source adatis --list

# Migrate everything
python migrate_posts.py --source all

# Migrate just Adatis posts
python migrate_posts.py --source adatis

# Migrate YouTube videos
echo "https://youtu.be/GFa6Cf6GEA0" > youtube_urls.txt
python migrate_posts.py --source youtube --youtube-urls youtube_urls.txt

# Download images referenced in migrated posts
python download_images.py ./migrated_posts/
```

## Output Structure

```
migrated_posts/
├── aa/                          # Advancing Analytics posts
│   ├── bringing-fabric-to-your-data-lakehouse.md
│   ├── introduction-to-analytics-engineering.md
│   └── ...
├── adatis/                      # Adatis posts
│   ├── introduction-to-azure-data-catalog.md
│   ├── forecasting-principles-and-methods.md
│   ├── connecting-sql-server-to-r.md
│   └── ...
├── youtube/                     # YouTube video posts
│   └── engineering-agents.md
└── MIGRATION_MANIFEST.md        # Summary of what was migrated
```

## What Each Migrated Post Looks Like

```yaml
---
title: "Introduction to Analytics Engineering"
date: 2022-11-30
tags: ["analytics", "data-engineering", "dbt"]
description: "Analytics Engineering is a relatively new term..."
source: "https://advancinganalytics.co.uk/blog/2022/11/30/..."
source_site: "Advancing Analytics"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
---

> **Migrated from [Advancing Analytics](https://advancinganalytics.co.uk/...)**
> Original publication date: 2022-11-30

[Body content in markdown...]

<!-- IMAGE MANIFEST
Download these images and update paths before publishing:
  1. https://images.squarespace-cdn.com/...
     alt: Architecture diagram
-->
```

## Post-Migration Workflow

1. **Review** — Skim each file for formatting issues, broken markdown, or missing content
2. **Images** — Run `python download_images.py ./migrated_posts/` to grab all images locally
3. **Tags** — Check and refine tags to match your Hugo taxonomy (the tool normalises common ones)
4. **Links** — Update any cross-references to point to ustdoes.tech rather than the original site
5. **Voice** — Some older Adatis posts may be more corporate-toned. Add a personal intro or `<!-- TODO: rewrite opener -->` comments for posts you want to rework
6. **Move** — Copy reviewed posts into `content/drafts/` in your Hugo repo
7. **PR** — Create a pull request for final review before publishing

## Customisation

### Adding a new source

Add an entry to the `SOURCES` dict in `migrate_posts.py` and implement a `discover_<key>_posts()` and `scrape_<key>_post()` function pair following the existing patterns.

### Tag mapping

Edit `TAG_MAP` in `migrate_posts.py` to control how scraped tags map to your Hugo taxonomy. Unknown tags are auto-slugified.

### Rate limiting

Adjust `REQUEST_DELAY` (default 1.5s) or use `--delay` flag to be more/less polite to source servers.

## Options

```
--source {all,aa,adatis,youtube}  Which source(s) to migrate
--dry-run                         Preview without writing files
--list                            List discovered posts only
--youtube-urls FILE               File with YouTube URLs (one per line)
--output DIR                      Output directory (default: ./migrated_posts)
--delay SECONDS                   Delay between requests (default: 1.5)
```

## Dependencies

- Python 3.10+
- `beautifulsoup4` — HTML parsing
- `requests` — HTTP client
- `markdownify` — HTML-to-Markdown conversion
- `youtube-transcript-api` — YouTube transcript extraction (optional)
