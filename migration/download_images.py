#!/usr/bin/env python3
"""
Image Downloader for Migrated Posts
====================================
Reads IMAGE MANIFEST comments from migrated markdown files
and downloads all referenced images into a local assets folder.

Usage:
  python download_images.py ./migrated_posts/
  python download_images.py ./migrated_posts/adatis/
  python download_images.py ./migrated_posts/aa/specific-post.md
"""

import os
import re
import sys
import time
import hashlib
from pathlib import Path
from urllib.parse import urlparse

import requests

DELAY = 0.5  # seconds between downloads


def extract_image_urls(md_path: Path) -> list[dict]:
    """Extract image URLs from IMAGE MANIFEST comments in a markdown file."""
    content = md_path.read_text(encoding='utf-8')
    
    # Find the IMAGE MANIFEST block
    manifest_match = re.search(
        r'<!-- IMAGE MANIFEST\n(.*?)-->',
        content,
        re.DOTALL
    )
    if not manifest_match:
        return []
    
    manifest = manifest_match.group(1)
    images = []
    current_url = None
    
    for line in manifest.splitlines():
        url_match = re.match(r'\s*\d+\.\s+(https?://\S+)', line)
        alt_match = re.match(r'\s+alt:\s+(.+)', line)
        
        if url_match:
            if current_url:
                images.append(current_url)
            current_url = {'url': url_match.group(1), 'alt': ''}
        elif alt_match and current_url:
            current_url['alt'] = alt_match.group(1).strip()
    
    if current_url:
        images.append(current_url)
    
    return images


def download_image(url: str, output_dir: Path, session: requests.Session) -> Path | None:
    """Download a single image and return the local path."""
    try:
        resp = session.get(url, timeout=30, stream=True)
        resp.raise_for_status()
        
        # Determine filename
        parsed = urlparse(url)
        original_name = os.path.basename(parsed.path)
        if not original_name or '.' not in original_name:
            # Generate name from URL hash + content type
            ext = resp.headers.get('content-type', 'image/png').split('/')[-1]
            ext = ext.split(';')[0]
            if ext == 'jpeg':
                ext = 'jpg'
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            original_name = f"img_{url_hash}.{ext}"
        
        output_path = output_dir / original_name
        
        # Avoid duplicates
        counter = 1
        while output_path.exists():
            stem = output_path.stem
            suffix = output_path.suffix
            output_path = output_dir / f"{stem}_{counter}{suffix}"
            counter += 1
        
        with open(output_path, 'wb') as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        
        time.sleep(DELAY)
        return output_path
    
    except Exception as e:
        print(f"  ⚠ Failed: {url} ({e})")
        return None


def process_file(md_path: Path, session: requests.Session):
    """Process a single markdown file: download its images."""
    images = extract_image_urls(md_path)
    if not images:
        return
    
    print(f"\n📄 {md_path.name} — {len(images)} images")
    
    # Create images directory alongside the post
    img_dir = md_path.parent / "images" / md_path.stem
    img_dir.mkdir(parents=True, exist_ok=True)
    
    downloaded = []
    for img in images:
        print(f"  ⬇ {img['url'][:80]}...")
        local_path = download_image(img['url'], img_dir, session)
        if local_path:
            downloaded.append({
                'original_url': img['url'],
                'local_path': str(local_path.relative_to(md_path.parent)),
                'alt': img['alt'],
            })
            print(f"    ✅ {local_path.name}")
    
    # Update the markdown file with local image references
    if downloaded:
        content = md_path.read_text(encoding='utf-8')
        
        # Add a comment with the local image paths
        replacement = "<!-- IMAGE MANIFEST (DOWNLOADED)\n"
        replacement += "Images downloaded to local paths:\n"
        for d in downloaded:
            replacement += f"  - {d['local_path']}\n"
            if d['alt']:
                replacement += f"    alt: {d['alt']}\n"
            replacement += f"    original: {d['original_url']}\n"
        replacement += "\nTo use in markdown:\n"
        for d in downloaded:
            alt = d['alt'] or 'image'
            replacement += f'  ![{alt}]({d["local_path"]})\n'
        replacement += "-->"
        
        # Replace old manifest
        content = re.sub(
            r'<!-- IMAGE MANIFEST\n.*?-->',
            replacement,
            content,
            flags=re.DOTALL
        )
        md_path.write_text(content, encoding='utf-8')
        print(f"  📝 Updated manifest in {md_path.name}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python download_images.py <path>")
        print("  path can be a directory or a single .md file")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'ustdoes.tech-migration/1.0 (image download)',
    })
    
    if target.is_file() and target.suffix == '.md':
        process_file(target, session)
    elif target.is_dir():
        md_files = sorted(target.rglob('*.md'))
        print(f"🖼 Scanning {len(md_files)} markdown files for images...")
        for md_file in md_files:
            if md_file.name == 'MIGRATION_MANIFEST.md':
                continue
            process_file(md_file, session)
    else:
        print(f"⚠ Not found: {target}")
        sys.exit(1)
    
    print("\n✨ Done!")


if __name__ == "__main__":
    main()
