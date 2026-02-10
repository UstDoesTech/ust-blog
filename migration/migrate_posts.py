#!/usr/bin/env python3
"""
ustdoes.tech Blog Migration Tool
=================================
Migrates blog posts from external sources into Hugo-compatible markdown
with YAML frontmatter, ready to drop into the ustdoes.tech content pipeline.

Sources:
  1. Advancing Analytics (advancinganalytics.co.uk)
  2. Telefonica Tech UK (telefonicatech.uk) — formerly Adatis
  3. YouTube videos (via transcript extraction)

Usage:
  python migrate_posts.py --source all          # Migrate everything
  python migrate_posts.py --source aa           # Advancing Analytics only
  python migrate_posts.py --source telefonica       # Telefonica Tech UK only
  python migrate_posts.py --source youtube --youtube-urls urls.txt
  python migrate_posts.py --source aa --dry-run # Preview without writing files
  python migrate_posts.py --list                # List discovered posts without migrating

Output: ./migrated_posts/<source>/<slug>.md
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

# Attempt YouTube transcript import (optional dependency)
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    HAS_YT_TRANSCRIPTS = True
except ImportError:
    HAS_YT_TRANSCRIPTS = False


# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────

OUTPUT_DIR = Path("./migrated_posts")
AUTHOR = "Ust Oldfield"
SITE_URL = "https://ustdoes.tech"
REQUEST_DELAY = 1.5  # seconds between requests (be polite)
USER_AGENT = "ustdoes.tech-migration/1.0 (blog consolidation)"

SOURCES = {
    "aa": {
        "name": "Advancing Analytics",
        "base_url": "https://www.advancinganalytics.co.uk",
        "author_page": "https://www.advancinganalytics.co.uk/blog/author/ust-oldfield",
        "type": "squarespace",
    },
    "telefonica": {
        "name": "Telefonica Tech UK (formerly Adatis)",
        "base_url": "https://telefonicatech.uk",
        "blog_url": "https://telefonicatech.uk/blog/",
        "type": "wordpress-nofilter",
        # Author appears on individual post pages as: "Blog | <date> | Ust Oldfield"
        # No author filter on listing pages — must visit each post to check.
        # Strategy: try WP REST API → sitemap → crawl listing
    },
}

# Tag normalisation map — maps scraped tags to your Hugo taxonomy
TAG_MAP = {
    "data science": "data-science",
    "data engineering": "data-engineering",
    "machine learning": "machine-learning",
    "power bi": "power-bi",
    "azure": "azure",
    "databricks": "databricks",
    "fabric": "fabric",
    "ai": "ai",
    "generative ai": "generative-ai",
    "data governance": "data-governance",
    "analytics": "analytics",
    "devops": "devops",
    "dbt": "dbt",
    "data products": "data-products",
    "data strategy": "data-strategy",
    "data culture": "data-culture",
    "events": "events",
    "mlops": "mlops",
    "llm": "llm",
    "engineering": "engineering",
    "security": "security",
    "genie": "genie",
    "serverless computing": "serverless",
    "data": "data",
    "podcast": "podcast",
    "visualisation": "visualisation",
    "data mesh": "data-mesh",
    "agents": "agents",
    "mcp": "mcp",
    "semantic layer": "semantic-layer",
    "r": "r-lang",
    "sql server": "sql-server",
    "ssas": "ssas",
    "ssis": "ssis",
    "ssrs": "ssrs",
    "azure data lake": "azure-data-lake",
    "azure data catalog": "azure-data-catalog",
    "forecasting": "forecasting",
    "insurance": "insurance",
    "retail cpg": "retail-cpg",
}


# ─────────────────────────────────────────────
# Utility functions
# ─────────────────────────────────────────────

def slugify(text: str) -> str:
    """Create a URL-safe slug from text."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def fetch_page(url: str, session: requests.Session) -> BeautifulSoup | None:
    """Fetch a page and return parsed BeautifulSoup, with rate limiting."""
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
        time.sleep(REQUEST_DELAY)
        return BeautifulSoup(resp.text, 'html.parser')
    except requests.RequestException as e:
        print(f"  ⚠ Failed to fetch {url}: {e}")
        return None


def normalise_tags(raw_tags: list[str]) -> list[str]:
    """Normalise tags using the TAG_MAP, preserving unknown tags as slugified."""
    normalised = []
    for tag in raw_tags:
        lower = tag.lower().strip()
        if lower in TAG_MAP:
            normalised.append(TAG_MAP[lower])
        elif lower:
            normalised.append(slugify(lower))
    return sorted(set(normalised))


def html_to_markdown(html_content: str) -> str:
    """Convert HTML body content to clean markdown."""
    # Clean up before conversion
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove script/style tags
    for tag in soup.find_all(['script', 'style', 'nav', 'footer', 'header']):
        tag.decompose()
    
    # Remove sharing widgets, social buttons etc.
    for cls in ['share-buttons', 'social-share', 'author-bio', 'related-posts',
                'sharedaddy', 'jp-relatedposts', 'comments-area']:
        for el in soup.find_all(class_=re.compile(cls, re.I)):
            el.decompose()
    
    # Convert to markdown
    content = md(
        str(soup),
        heading_style="atx",
        bullets="-",
        code_language="",
        strip=['img', 'script', 'style', 'nav', 'footer', 'iframe'],
    )
    
    # Clean up excessive whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
    
    return content.strip()


def extract_images(html_content: str, base_url: str) -> list[dict]:
    """Extract image URLs and alt text from HTML."""
    soup = BeautifulSoup(html_content, 'html.parser')
    images = []
    for img in soup.find_all('img'):
        src = img.get('src', '') or img.get('data-src', '')
        if src and not src.startswith('data:'):
            full_url = urljoin(base_url, src)
            images.append({
                'url': full_url,
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
            })
    return images


def generate_frontmatter(post: dict) -> str:
    """Generate YAML frontmatter for a Hugo post."""
    tags_str = json.dumps(post.get('tags', []))
    
    lines = [
        "---",
        f'title: "{post["title"].replace(chr(34), chr(39))}"',
        f'date: {post.get("date", datetime.now().strftime("%Y-%m-%d"))}',
        f'tags: {tags_str}',
        f'description: "{post.get("description", "").replace(chr(34), chr(39))}"',
        f'source: "{post.get("source_url", "")}"',
        f'source_site: "{post.get("source_site", "")}"',
        f'original_author: "{AUTHOR}"',
        f'status: draft',
        f'migrated: true',
        f'migration_date: "{datetime.now().strftime("%Y-%m-%d")}"',
    ]
    
    if post.get("images"):
        lines.append(f'# images_to_download: {len(post["images"])} (see bottom of file)')
    
    if post.get("youtube_url"):
        lines.append(f'youtube_url: "{post["youtube_url"]}"')
    
    if post.get("co_authors"):
        lines.append(f'co_authors: {json.dumps(post["co_authors"])}')
    
    lines.append("---")
    return "\n".join(lines)


def write_post(post: dict, source_key: str, dry_run: bool = False) -> Path | None:
    """Write a migrated post to disk."""
    slug = slugify(post['title'])
    out_dir = OUTPUT_DIR / source_key
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{slug}.md"
    
    frontmatter = generate_frontmatter(post)
    
    # Build the full content
    parts = [frontmatter, ""]
    
    # Add migration note
    parts.append(f"> **Migrated from [{post.get('source_site', 'external')}]({post.get('source_url', '')})**")
    parts.append(f"> Original publication date: {post.get('date', 'unknown')}")
    parts.append("")
    
    # Add the body
    parts.append(post.get('content_md', ''))
    
    # Add image manifest at the bottom
    if post.get('images'):
        parts.append("\n\n<!-- IMAGE MANIFEST")
        parts.append("Download these images and update paths before publishing:")
        for i, img in enumerate(post['images'], 1):
            parts.append(f"  {i}. {img['url']}")
            if img.get('alt'):
                parts.append(f"     alt: {img['alt']}")
        parts.append("-->")
    
    full_content = "\n".join(parts)
    
    if dry_run:
        print(f"  📄 [DRY RUN] Would write: {out_path}")
        print(f"     Title: {post['title']}")
        print(f"     Date: {post.get('date', '?')}")
        print(f"     Tags: {post.get('tags', [])}")
        print(f"     Content length: ~{len(post.get('content_md', ''))} chars")
        return out_path
    
    out_path.write_text(full_content, encoding='utf-8')
    print(f"  ✅ {out_path}")
    return out_path


# ─────────────────────────────────────────────
# Advancing Analytics Scraper
# ─────────────────────────────────────────────

def discover_aa_posts(session: requests.Session) -> list[dict]:
    """Discover all Ust Oldfield posts on Advancing Analytics."""
    posts = []
    config = SOURCES["aa"]
    page_url = config["author_page"]
    page_num = 1
    
    while page_url:
        print(f"  📡 Fetching page {page_num}: {page_url}")
        soup = fetch_page(page_url, session)
        if not soup:
            break
        
        # Squarespace blog listing — find article links
        # They use a blog-item or summary-item pattern
        articles = soup.select('article a[href*="/blog/"]')
        if not articles:
            articles = soup.select('.summary-title a, .blog-title a, h1.entry-title a')
        if not articles:
            # Broader fallback
            articles = soup.select('a[href*="/blog/"]')
        
        seen_urls = set()
        for a in articles:
            href = a.get('href', '')
            if not href or href in seen_urls:
                continue
            full_url = urljoin(config["base_url"], href)
            # Skip author/tag/category pages
            if '/author/' in full_url or '/tag/' in full_url or '/category/' in full_url:
                continue
            # Skip pagination links
            if full_url.rstrip('/') == config["author_page"].rstrip('/'):
                continue
            if full_url not in seen_urls:
                seen_urls.add(full_url)
                title = a.get_text(strip=True) or href.split('/')[-1]
                posts.append({
                    'url': full_url,
                    'title': title,
                    'source_site': config["name"],
                })
        
        # Find next page
        next_link = soup.select_one('a.next, a[rel="next"], .pagination-next a, .BlogList-pagination-link--next')
        if next_link and next_link.get('href'):
            page_url = urljoin(config["base_url"], next_link['href'])
            page_num += 1
        else:
            # Try numbered pagination
            next_page = soup.select_one(f'a[href*="page/{page_num + 1}"], a[href*="page%2F{page_num + 1}"]')
            if next_page:
                page_url = urljoin(config["base_url"], next_page['href'])
                page_num += 1
            else:
                page_url = None
    
    # Deduplicate
    seen = set()
    unique = []
    for p in posts:
        if p['url'] not in seen:
            seen.add(p['url'])
            unique.append(p)
    
    return unique


def scrape_aa_post(url: str, session: requests.Session) -> dict | None:
    """Scrape a single Advancing Analytics blog post."""
    soup = fetch_page(url, session)
    if not soup:
        return None
    
    post = {'source_url': url, 'source_site': SOURCES["aa"]["name"]}
    
    # Title
    title_el = (
        soup.select_one('.blog-item-title, .entry-title, article h1, .BlogItem-title')
        or soup.select_one('h1')
    )
    post['title'] = title_el.get_text(strip=True) if title_el else url.split('/')[-1]
    
    # Date — Squarespace uses time tags or specific class patterns
    date_el = (
        soup.select_one('time[datetime]')
        or soup.select_one('.blog-date, .entry-date, .dt-published, .BlogItem-dateWrapper')
    )
    if date_el:
        dt = date_el.get('datetime', '') or date_el.get_text(strip=True)
        try:
            parsed = datetime.fromisoformat(dt.replace('Z', '+00:00'))
            post['date'] = parsed.strftime('%Y-%m-%d')
        except (ValueError, TypeError):
            # Try parsing common date formats
            for fmt in ['%B %d, %Y', '%d %B %Y', '%d/%m/%Y', '%Y-%m-%d',
                        '%dst %B, %Y', '%dnd %B, %Y', '%drd %B, %Y', '%dth %B, %Y']:
                try:
                    parsed = datetime.strptime(dt.strip().rstrip(','), fmt)
                    post['date'] = parsed.strftime('%Y-%m-%d')
                    break
                except ValueError:
                    continue
    
    # Tags
    tag_elements = soup.select('.blog-categories a, .tag-link, .entry-tags a, a[href*="/tag/"], .BlogItem-tags a')
    raw_tags = [t.get_text(strip=True) for t in tag_elements]
    post['tags'] = normalise_tags(raw_tags)
    
    # Body content
    body_el = (
        soup.select_one('.blog-item-content, .entry-content, .sqs-block-content, .BlogItem-content')
        or soup.select_one('article .content, article')
    )
    if body_el:
        # Extract images before converting
        post['images'] = extract_images(str(body_el), url)
        post['content_md'] = html_to_markdown(str(body_el))
    else:
        post['content_md'] = "<!-- Could not extract body content. Manual migration needed. -->"
        post['images'] = []
    
    # Description (first paragraph or meta)
    meta_desc = soup.select_one('meta[name="description"]')
    if meta_desc:
        post['description'] = meta_desc.get('content', '')[:200]
    elif post.get('content_md'):
        first_para = post['content_md'].split('\n\n')[0][:200]
        post['description'] = re.sub(r'[#*>\[\]]', '', first_para).strip()
    
    # Check for co-authors
    author_els = soup.select('.author-name, .blog-author-name, .BlogItem-author')
    authors = [a.get_text(strip=True) for a in author_els]
    co_authors = [a for a in authors if a.lower() != AUTHOR.lower() and a.strip()]
    if co_authors:
        post['co_authors'] = co_authors
    
    return post


# ─────────────────────────────────────────────
# Telefonica Tech UK Scraper (formerly Adatis)
# ─────────────────────────────────────────────
# The old Adatis blog posts were migrated to telefonicatech.uk/blog/
# There is NO author filter on the listing pages.
# Author name appears on individual post pages as:
#   "Blog | 21 February 2018 | Ust Oldfield"
#
# Strategy:
#   1. Try WordPress REST API for structured discovery
#   2. Try sitemap.xml for URL discovery
#   3. Fall back to crawling listing pages
#   4. Visit each post → check byline for "Ust Oldfield"

TELEFONICA_AUTHOR_PATTERNS = [
    re.compile(r'Ust\s+Oldfield', re.IGNORECASE),
]


def _check_telefonica_author(soup: BeautifulSoup) -> bool:
    """Check if a Telefonica Tech post page was authored by Ust Oldfield."""
    # The byline format is: "Blog | 21 February 2018 | Ust Oldfield"
    # Look in the header/hero area for the author name
    page_text = soup.get_text()
    for pattern in TELEFONICA_AUTHOR_PATTERNS:
        if pattern.search(page_text):
            return True
    return False


def _extract_telefonica_byline_date(soup: BeautifulSoup) -> str | None:
    """Extract date from the Telefonica byline format: 'Blog | 21 February 2018 | Ust Oldfield'."""
    page_text = soup.get_text()
    # Match patterns like "Blog | 21 February 2018 | Ust Oldfield"
    # or "Blog | 5 December 2025"
    date_match = re.search(
        r'Blog\s*\|\s*(\d{1,2}\s+\w+\s+\d{4})',
        page_text
    )
    if date_match:
        raw_date = date_match.group(1).strip()
        # Remove ordinal suffixes (1st, 2nd, 3rd, 4th etc.)
        raw_date = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', raw_date)
        for fmt in ['%d %B %Y', '%d %b %Y']:
            try:
                parsed = datetime.strptime(raw_date, fmt)
                return parsed.strftime('%Y-%m-%d')
            except ValueError:
                continue
    return None


def discover_telefonica_posts_via_api(session: requests.Session) -> list[dict]:
    """Try WordPress REST API to discover blog posts."""
    config = SOURCES["telefonica"]
    api_base = f"{config['base_url']}/wp-json/wp/v2"
    posts = []

    # First, try to find the author ID for "Ust Oldfield"
    author_id = None
    try:
        resp = session.get(f"{api_base}/users?search=Ust+Oldfield&per_page=10", timeout=15)
        if resp.status_code == 200:
            users = resp.json()
            for u in users:
                if 'ust' in u.get('name', '').lower():
                    author_id = u['id']
                    print(f"  🔑 Found author ID: {author_id} ({u['name']})")
                    break
        time.sleep(REQUEST_DELAY)
    except Exception:
        pass

    if not author_id:
        # Try to get all posts from API without author filter — might still work
        print("  ⚠ Could not find author via API. Trying sitemap/crawl approach.")
        return []

    # Paginate through the API
    page = 1
    while True:
        try:
            params = {
                'author': author_id,
                'per_page': 100,
                'page': page,
                '_fields': 'id,title,slug,date,link,excerpt,categories,tags',
            }
            resp = session.get(f"{api_base}/posts", params=params, timeout=15)
            if resp.status_code != 200:
                break

            batch = resp.json()
            if not batch:
                break

            for p in batch:
                posts.append({
                    'url': p.get('link', f"{config['blog_url']}{p['slug']}/"),
                    'title': p.get('title', {}).get('rendered', p['slug']),
                    'source_site': config['name'],
                    'date': p.get('date', '')[:10],
                })

            # Check WP total pages header
            total_pages = int(resp.headers.get('X-WP-TotalPages', 1))
            if page >= total_pages:
                break
            page += 1
            time.sleep(REQUEST_DELAY)
        except Exception as e:
            print(f"  ⚠ API pagination error: {e}")
            break

    return posts


def discover_telefonica_posts_via_sitemap(session: requests.Session) -> list[dict]:
    """Try to discover blog URLs from sitemap.xml."""
    config = SOURCES["telefonica"]
    posts = []
    sitemap_urls_to_try = [
        f"{config['base_url']}/sitemap.xml",
        f"{config['base_url']}/sitemap_index.xml",
        f"{config['base_url']}/post-sitemap.xml",
        f"{config['base_url']}/blog-sitemap.xml",
    ]

    for sitemap_url in sitemap_urls_to_try:
        print(f"  📡 Trying sitemap: {sitemap_url}")
        soup = fetch_page(sitemap_url, session)
        if not soup:
            continue

        # Parse sitemap XML for <loc> tags under /blog/
        locs = soup.find_all('loc')
        for loc in locs:
            url = loc.get_text(strip=True)
            if '/blog/' in url and url.rstrip('/') != config['blog_url'].rstrip('/'):
                # Skip listing/tag/category pages
                slug = url.rstrip('/').split('/')[-1]
                if slug and slug not in ('blog', 'page'):
                    posts.append({
                        'url': url,
                        'title': slug.replace('-', ' ').title(),
                        'source_site': config['name'],
                    })

        # Check for nested sitemaps
        nested = [loc.get_text(strip=True) for loc in locs
                  if 'sitemap' in loc.get_text(strip=True).lower()
                  and loc.get_text(strip=True) not in sitemap_urls_to_try]
        for nested_url in nested[:5]:  # Limit nested sitemap traversal
            print(f"  📡 Nested sitemap: {nested_url}")
            nested_soup = fetch_page(nested_url, session)
            if nested_soup:
                for loc in nested_soup.find_all('loc'):
                    url = loc.get_text(strip=True)
                    if '/blog/' in url:
                        slug = url.rstrip('/').split('/')[-1]
                        if slug and slug not in ('blog', 'page'):
                            posts.append({
                                'url': url,
                                'title': slug.replace('-', ' ').title(),
                                'source_site': config['name'],
                            })

        if posts:
            break  # Got results from this sitemap

    # Deduplicate
    seen = set()
    unique = []
    for p in posts:
        if p['url'] not in seen:
            seen.add(p['url'])
            unique.append(p)
    return unique


def discover_telefonica_posts_via_crawl(session: requests.Session) -> list[dict]:
    """Crawl the blog listing pages to find all post URLs."""
    config = SOURCES["telefonica"]
    posts = []
    page_url = config["blog_url"]
    page_num = 1
    max_pages = 30  # Safety limit

    while page_url and page_num <= max_pages:
        print(f"  📡 Crawling listing page {page_num}: {page_url}")
        soup = fetch_page(page_url, session)
        if not soup:
            break

        # Find blog post links — Telefonica uses card-based layout
        found_any = False
        for a in soup.select('a[href*="/blog/"]'):
            href = a.get('href', '')
            full_url = urljoin(config["base_url"], href)
            slug = full_url.rstrip('/').split('/')[-1]

            # Skip non-post pages
            if slug in ('blog', 'page', '') or '/tag/' in full_url or '/category/' in full_url:
                continue
            if full_url.rstrip('/') == config['blog_url'].rstrip('/'):
                continue

            title = a.get_text(strip=True)
            if title and len(title) > 5 and title.lower() != 'read more':
                posts.append({
                    'url': full_url,
                    'title': title,
                    'source_site': config['name'],
                })
                found_any = True

        # Try pagination — check for page/N pattern or next links
        next_link = soup.select_one('a.next, a[rel="next"], .pagination-next a')
        if next_link and next_link.get('href'):
            page_url = urljoin(config["base_url"], next_link['href'])
            page_num += 1
        elif found_any:
            # Try common pagination patterns
            for pattern in [
                f"{config['blog_url']}page/{page_num + 1}/",
                f"{config['blog_url']}?page={page_num + 1}",
            ]:
                try:
                    resp = session.head(pattern, timeout=10, allow_redirects=True)
                    if resp.status_code == 200:
                        page_url = pattern
                        page_num += 1
                        break
                except requests.RequestException:
                    pass
            else:
                page_url = None  # No more pages found
        else:
            page_url = None

    # Deduplicate
    seen = set()
    unique = []
    for p in posts:
        if p['url'] not in seen:
            seen.add(p['url'])
            unique.append(p)
    return unique


def discover_telefonica_posts(session: requests.Session) -> list[dict]:
    """Discover Ust Oldfield posts on Telefonica Tech UK using multiple strategies."""
    config = SOURCES["telefonica"]

    # Strategy 1: WordPress REST API (fastest, most reliable if available)
    print("\n  📋 Strategy 1: WordPress REST API...")
    posts = discover_telefonica_posts_via_api(session)
    if posts:
        print(f"  ✅ Found {len(posts)} posts via API")
        return posts

    # Strategy 2: Sitemap (fast URL discovery, then filter by author on each page)
    print("\n  📋 Strategy 2: Sitemap crawl...")
    all_posts = discover_telefonica_posts_via_sitemap(session)
    if all_posts:
        print(f"  📡 Found {len(all_posts)} total blog posts in sitemap. Filtering by author...")
        return _filter_by_author(all_posts, session)

    # Strategy 3: Crawl listing pages (slowest, but always works)
    print("\n  📋 Strategy 3: Crawling blog listing pages...")
    all_posts = discover_telefonica_posts_via_crawl(session)
    if all_posts:
        print(f"  📡 Found {len(all_posts)} total blog posts. Filtering by author...")
        return _filter_by_author(all_posts, session)

    print("  ⚠ Could not discover any posts. Try providing a URL list manually.")
    return []


def _filter_by_author(all_posts: list[dict], session: requests.Session) -> list[dict]:
    """Visit each post and filter to only those by Ust Oldfield."""
    matching = []
    total = len(all_posts)
    for i, item in enumerate(all_posts, 1):
        if i % 20 == 0 or i == 1:
            print(f"  🔍 Checking author... {i}/{total}")
        soup = fetch_page(item['url'], session)
        if soup and _check_telefonica_author(soup):
            # Update the title from the actual page
            title_el = soup.select_one('h1')
            if title_el:
                item['title'] = title_el.get_text(strip=True)
            # Extract date from byline
            date = _extract_telefonica_byline_date(soup)
            if date:
                item['date'] = date
            matching.append(item)
            print(f"  ✅ [{len(matching)}] {item['title'][:60]}")
    return matching


def scrape_telefonica_post(url: str, session: requests.Session) -> dict | None:
    """Scrape a single Telefonica Tech UK blog post."""
    soup = fetch_page(url, session)
    if not soup:
        return None

    post = {'source_url': url, 'source_site': SOURCES["telefonica"]["name"]}

    # Title — main h1 on the page
    title_el = soup.select_one('h1')
    post['title'] = title_el.get_text(strip=True) if title_el else url.rstrip('/').split('/')[-1].replace('-', ' ').title()

    # Date from byline: "Blog | 21 February 2018 | Ust Oldfield"
    date = _extract_telefonica_byline_date(soup)
    if date:
        post['date'] = date

    # Body content — the main article text
    # On Telefonica Tech, the body is typically after the hero/header area
    # Look for the main content area, excluding nav, footer, sidebar
    body_el = None

    # Try common WordPress content selectors
    for selector in ['.entry-content', '.post-content', '.blog-content',
                     'article .content', '.single-post-content',
                     '.elementor-widget-theme-post-content',
                     '.elementor-widget-container']:
        body_el = soup.select_one(selector)
        if body_el and len(body_el.get_text(strip=True)) > 100:
            break
        body_el = None

    if not body_el:
        # Fallback: find the largest text block that looks like article content
        # The Telefonica page has the article body between the hero and "Recent Posts"
        # Remove nav, header, footer, sidebar elements
        content_soup = BeautifulSoup(str(soup), 'html.parser')
        for tag in content_soup.select('nav, header, footer, .sidebar, .related-posts, '
                                        '.recent-posts, script, style, .breadcrumb, '
                                        '.share-buttons, noscript'):
            tag.decompose()

        # Find all paragraphs and headings that form the article
        # The content is typically between the h1 title and "Recent Posts" / "Related Content"
        all_text_els = content_soup.find_all(['p', 'h2', 'h3', 'h4', 'pre', 'ul', 'ol', 'blockquote', 'table'])
        article_parts = []
        in_article = False
        for el in all_text_els:
            text = el.get_text(strip=True)
            # Start collecting after we pass the title area
            if not in_article and len(text) > 50:
                in_article = True
            # Stop at "Recent Posts", "Related Content", footer sections
            if in_article and any(stop in text for stop in
                                   ['Recent Posts', 'Related Content', 'Get in touch',
                                    'Stay updated', 'Subscribe']):
                break
            if in_article and text:
                article_parts.append(str(el))

        if article_parts:
            body_html = '\n'.join(article_parts)
            body_el = BeautifulSoup(body_html, 'html.parser')

    if body_el:
        post['images'] = extract_images(str(body_el), url)
        post['content_md'] = html_to_markdown(str(body_el))
    else:
        post['content_md'] = "<!-- Could not extract body content. Manual migration needed. -->"
        post['images'] = []

    # Tags — look for tag links or category labels
    tag_elements = soup.select('a[href*="/tag/"], a[rel="tag"], .post-tags a, .blog-tags a')
    raw_tags = [t.get_text(strip=True) for t in tag_elements]
    post['tags'] = normalise_tags(raw_tags)

    # Description
    meta_desc = soup.select_one('meta[name="description"], meta[property="og:description"]')
    if meta_desc:
        post['description'] = meta_desc.get('content', '')[:200]
    elif post.get('content_md'):
        first_para = post['content_md'].split('\n\n')[0][:200]
        post['description'] = re.sub(r'[#*>\[\]]', '', first_para).strip()

    return post


# ─────────────────────────────────────────────
# YouTube Transcript Migrator
# ─────────────────────────────────────────────

def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_video_metadata(video_id: str, session: requests.Session) -> dict:
    """Fetch basic video metadata from YouTube page (no API key needed)."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    try:
        resp = session.get(url, timeout=15)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        title = ""
        title_el = soup.select_one('meta[property="og:title"]')
        if title_el:
            title = title_el.get('content', '')
        
        description = ""
        desc_el = soup.select_one('meta[property="og:description"]')
        if desc_el:
            description = desc_el.get('content', '')
        
        date = ""
        date_el = soup.select_one('meta[itemprop="datePublished"]')
        if date_el:
            date = date_el.get('content', '')
        # Also try to find in page source
        if not date:
            date_match = re.search(r'"publishDate":"(\d{4}-\d{2}-\d{2})', resp.text)
            if date_match:
                date = date_match.group(1)
        
        return {
            'title': title or f"YouTube Video {video_id}",
            'description': description[:200],
            'date': date,
            'youtube_url': url,
        }
    except Exception as e:
        print(f"  ⚠ Could not fetch video metadata: {e}")
        return {
            'title': f"YouTube Video {video_id}",
            'description': '',
            'date': '',
            'youtube_url': url,
        }


def migrate_youtube_video(url: str, session: requests.Session) -> dict | None:
    """Migrate a YouTube video to a blog post using its transcript."""
    video_id = extract_video_id(url)
    if not video_id:
        print(f"  ⚠ Could not extract video ID from: {url}")
        return None
    
    # Get metadata
    meta = get_video_metadata(video_id, session)
    
    post = {
        'title': meta['title'],
        'date': meta.get('date', datetime.now().strftime('%Y-%m-%d')),
        'description': meta.get('description', ''),
        'source_url': meta['youtube_url'],
        'source_site': 'YouTube',
        'youtube_url': meta['youtube_url'],
        'tags': ['video'],
        'images': [],
    }
    
    # Try to get transcript
    transcript_text = ""
    if HAS_YT_TRANSCRIPTS:
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            # Group into paragraphs (~30 second chunks)
            paragraphs = []
            current_para = []
            last_time = 0
            
            for entry in transcript_list:
                if entry['start'] - last_time > 15 and current_para:
                    paragraphs.append(' '.join(current_para))
                    current_para = []
                current_para.append(entry['text'])
                last_time = entry['start']
            
            if current_para:
                paragraphs.append(' '.join(current_para))
            
            transcript_text = '\n\n'.join(paragraphs)
        except Exception as e:
            print(f"  ⚠ Could not fetch transcript: {e}")
    
    # Build content
    parts = []
    parts.append(f'{{{{< youtube "{video_id}" >}}}}')
    parts.append("")
    
    if meta.get('description'):
        parts.append("## Overview")
        parts.append("")
        parts.append(meta['description'])
        parts.append("")
    
    if transcript_text:
        parts.append("## Transcript")
        parts.append("")
        parts.append("<!-- Auto-generated transcript. Review and edit for accuracy. -->")
        parts.append("")
        parts.append(transcript_text)
    else:
        parts.append("<!-- No transcript available. Consider:")
        parts.append("     1. Adding a manual summary")
        parts.append("     2. Using the YouTube auto-captions")
        parts.append("     3. Running whisper locally on the audio -->")
    
    post['content_md'] = '\n'.join(parts)
    return post


# ─────────────────────────────────────────────
# Migration orchestration
# ─────────────────────────────────────────────

def migrate_source(source_key: str, session: requests.Session,
                   dry_run: bool = False, list_only: bool = False) -> list[Path]:
    """Run migration for a single source."""
    config = SOURCES[source_key]
    print(f"\n{'='*60}")
    print(f"🔄 Migrating from: {config['name']}")
    print(f"   Source: {config.get('author_page', config.get('blog_url', config['base_url']))}")
    print(f"{'='*60}")
    
    # Discover posts
    if source_key == "aa":
        discovered = discover_aa_posts(session)
    elif source_key == "telefonica":
        discovered = discover_telefonica_posts(session)
    else:
        print(f"  ⚠ Unknown source: {source_key}")
        return []
    
    print(f"\n  📋 Found {len(discovered)} posts")
    
    if list_only:
        for i, p in enumerate(discovered, 1):
            print(f"    {i:3d}. {p['title']}")
            print(f"         {p['url']}")
        return []
    
    # Scrape each post
    results = []
    for i, item in enumerate(discovered, 1):
        print(f"\n  [{i}/{len(discovered)}] {item['title'][:60]}...")
        
        if source_key == "aa":
            post = scrape_aa_post(item['url'], session)
        elif source_key == "telefonica":
            post = scrape_telefonica_post(item['url'], session)
        
        if post:
            path = write_post(post, source_key, dry_run=dry_run)
            if path:
                results.append(path)
        else:
            print(f"  ⚠ Skipped (could not scrape)")
    
    return results


def migrate_youtube(urls: list[str], session: requests.Session,
                    dry_run: bool = False) -> list[Path]:
    """Migrate YouTube videos."""
    print(f"\n{'='*60}")
    print(f"🎥 Migrating {len(urls)} YouTube videos")
    print(f"{'='*60}")
    
    if not HAS_YT_TRANSCRIPTS:
        print("  ⚠ youtube-transcript-api not available. Transcripts will be skipped.")
        print("    Install with: pip install youtube-transcript-api")
    
    results = []
    for i, url in enumerate(urls, 1):
        url = url.strip()
        if not url or url.startswith('#'):
            continue
        print(f"\n  [{i}/{len(urls)}] {url}")
        post = migrate_youtube_video(url, session)
        if post:
            path = write_post(post, "youtube", dry_run=dry_run)
            if path:
                results.append(path)
    
    return results


def generate_manifest(all_results: dict[str, list]) -> str:
    """Generate a migration manifest summarising what was done."""
    lines = [
        "# Migration Manifest",
        f"# Generated: {datetime.now().isoformat()}",
        f"# Tool: ustdoes.tech Blog Migration Tool",
        "",
    ]
    
    total = sum(len(v) for v in all_results.values())
    lines.append(f"Total posts migrated: {total}")
    lines.append("")
    
    for source, paths in all_results.items():
        lines.append(f"## {source} ({len(paths)} posts)")
        for p in sorted(paths):
            lines.append(f"  - {p}")
        lines.append("")
    
    lines.append("## Next Steps")
    lines.append("1. Review each post in migrated_posts/")
    lines.append("2. Fix any markdown formatting issues")
    lines.append("3. Download and localise images (see IMAGE MANIFEST comments)")
    lines.append("4. Update internal links to point to ustdoes.tech")
    lines.append("5. Add/refine tags to match your Hugo taxonomy")
    lines.append("6. Move reviewed posts to content/drafts/ in your repo")
    lines.append("7. Create PR for review before publishing")
    
    return "\n".join(lines)


# ─────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Migrate blog posts to ustdoes.tech",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python migrate_posts.py --source all
  python migrate_posts.py --source aa --dry-run
  python migrate_posts.py --source telefonica --list
  python migrate_posts.py --source youtube --youtube-urls urls.txt
  python migrate_posts.py --source aa telefonica
        """
    )
    parser.add_argument(
        '--source', nargs='+', required=True,
        choices=['all', 'aa', 'telefonica', 'youtube'],
        help='Which source(s) to migrate from'
    )
    parser.add_argument(
        '--dry-run', action='store_true',
        help='Preview what would be migrated without writing files'
    )
    parser.add_argument(
        '--list', action='store_true', dest='list_only',
        help='List discovered posts without migrating'
    )
    parser.add_argument(
        '--youtube-urls', type=str,
        help='File containing YouTube URLs (one per line)'
    )
    parser.add_argument(
        '--output', type=str, default=str(OUTPUT_DIR),
        help=f'Output directory (default: {OUTPUT_DIR})'
    )
    parser.add_argument(
        '--delay', type=float, default=REQUEST_DELAY,
        help=f'Delay between requests in seconds (default: {REQUEST_DELAY})'
    )
    
    args = parser.parse_args()
    
    # Update module-level config
    import migrate_posts
    migrate_posts.OUTPUT_DIR = Path(args.output)
    migrate_posts.REQUEST_DELAY = args.delay
    
    # Resolve 'all'
    sources = args.source
    if 'all' in sources:
        sources = ['aa', 'telefonica']
        if args.youtube_urls:
            sources.append('youtube')
    
    # Set up session
    session = requests.Session()
    session.headers.update({
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-GB,en;q=0.9',
    })
    
    print("🚀 ustdoes.tech Blog Migration Tool")
    print(f"   Output: {OUTPUT_DIR}")
    print(f"   Sources: {', '.join(sources)}")
    if args.dry_run:
        print("   Mode: DRY RUN (no files will be written)")
    if args.list_only:
        print("   Mode: LIST ONLY (discovery only)")
    
    all_results = {}
    
    for source in sources:
        if source == 'youtube':
            if not args.youtube_urls:
                print("\n⚠ YouTube migration requires --youtube-urls <file>")
                print("  Create a text file with one YouTube URL per line.")
                continue
            urls_file = Path(args.youtube_urls)
            if not urls_file.exists():
                print(f"\n⚠ File not found: {urls_file}")
                continue
            urls = urls_file.read_text().strip().splitlines()
            results = migrate_youtube(urls, session, dry_run=args.dry_run)
            all_results['YouTube'] = results
        else:
            results = migrate_source(source, session,
                                     dry_run=args.dry_run,
                                     list_only=args.list_only)
            all_results[SOURCES[source]['name']] = results
    
    # Write manifest
    if not args.list_only and not args.dry_run and any(all_results.values()):
        manifest = generate_manifest(all_results)
        manifest_path = OUTPUT_DIR / "MIGRATION_MANIFEST.md"
        manifest_path.write_text(manifest, encoding='utf-8')
        print(f"\n📝 Manifest: {manifest_path}")
    
    # Summary
    total = sum(len(v) for v in all_results.values())
    print(f"\n{'='*60}")
    print(f"✨ Migration complete!")
    if not args.list_only:
        print(f"   {total} posts {'would be' if args.dry_run else ''} migrated")
        if not args.dry_run:
            print(f"   Output: {OUTPUT_DIR}/")
            print(f"\n📋 Next steps:")
            print(f"   1. Review posts in {OUTPUT_DIR}/")
            print(f"   2. Download images (check IMAGE MANIFEST comments)")
            print(f"   3. Move to content/drafts/ in your Hugo repo")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
