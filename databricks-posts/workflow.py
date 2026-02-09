#!/usr/bin/env python3
"""
Databricks Release Notes → LinkedIn Content Pipeline

Workflow:
  1. Fetch the latest Databricks release notes page
  2. Parse individual features from the HTML
  3. For each feature, generate What / Why / How content via Anthropic API
  4. Create a LinkedIn post draft (.md) and carousel (.pptx) per feature

Usage:
  python workflow.py                                  # Anthropic API (default)
  python workflow.py --provider ollama --model mistral # Local Ollama container
  python workflow.py --url <release_url>               # Specific release notes URL
  python workflow.py --ai-bi-url <url>                 # Override AI/BI release notes URL
  python workflow.py --skip-ai-bi                      # Skip AI/BI release notes

Ollama quick-start:
  python ollama_setup.py              # Starts container & pulls default model
  python workflow.py --provider ollama # Run pipeline with local LLM

Output:
  output/
  ├── 01_lakebase-autoscaling/
  │   ├── linkedin_post.md
  │   └── carousel.pptx
  ├── 02_disable-legacy-features/
  │   ├── linkedin_post.md
  │   └── carousel.pptx
  └── ...

Requirements:
  pip install requests beautifulsoup4
  npm install -g pptxgenjs
  Set ANTHROPIC_API_KEY env var  — OR —
  Run `python ollama_setup.py` to use a local Ollama container instead
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup, Tag


# ─── CONFIG ───────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = "claude-sonnet-4-5-20250514"

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11435")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "mistral")

RELEASE_NOTES_URL = "https://docs.databricks.com/aws/en/release-notes/product/2026/february"
AIBI_RELEASE_NOTES_URL = "https://docs.databricks.com/aws/en/ai-bi/release-notes/2026"
CAROUSEL_SCRIPT = Path(__file__).parent / "generate_carousel.js"
OUTPUT_DIR = Path(__file__).parent / "output"


# ─── STEP 1: FETCH RELEASE NOTES ─────────────────────────────────

def fetch_release_notes(url: str) -> str:
    """Fetch the raw HTML of a Databricks release notes page."""
    print(f"📥 Fetching release notes from: {url}")
    resp = requests.get(url, timeout=30, headers={
        "User-Agent": "Mozilla/5.0 (compatible; ContentPipeline/1.0)"
    })
    resp.raise_for_status()
    return resp.text


# ─── STEP 2: PARSE FEATURES ──────────────────────────────────────

def parse_features(html: str) -> list[dict]:
    """Extract individual features from the release notes HTML.

    Each feature has: title, date, description, link_anchor
    """
    soup = BeautifulSoup(html, "html.parser")
    features = []

    # Databricks uses <h2> tags for each feature section
    for h2 in soup.find_all("h2"):
        title = _clean_heading(h2.get_text(strip=True))

        # Skip navigation / boilerplate headers
        if not title or title.lower() in ("on this page", "we care about your privacy", "additional links"):
            continue

        # Gather following paragraphs until next h2
        description_parts = []
        date_str = ""
        for sibling in h2.find_next_siblings():
            if not isinstance(sibling, Tag):
                continue
            if sibling.name == "h2":
                break
            text = sibling.get_text(strip=True)
            if not text:
                continue
            # First bold/strong line is usually the date
            strong_tag = sibling.find("strong")
            if not date_str and strong_tag:
                date_str = strong_tag.get_text(strip=True)
            description_parts.append(text)

        description = "\n".join(description_parts)

        # Skip maintenance updates and minor items
        skip_keywords = ["maintenance update", "runtime maintenance"]
        if any(kw in title.lower() for kw in skip_keywords):
            continue

        features.append({
            "title": title,
            "date": date_str,
            "description": description,
        })

    print(f"📋 Found {len(features)} features (platform)")
    return features


def _clean_heading(text: str) -> str:
    """Strip Databricks 'Direct link to …' artefacts from heading text."""
    text = re.sub(r"Direct link to.*$", "", text).strip()
    text = re.sub(r"\u200b.*$", "", text).strip()
    text = re.sub(r"[\u200b\u00e2\u0080\u008b]", "", text).strip()
    text = re.sub(r"\s*#\s*$", "", text).strip()
    # Remove non-printable / stray control characters at the end
    text = text.rstrip("\u200b\ufffd\u00e2\u0080\u008b \t")
    return text


def parse_aibi_features(html: str) -> list[dict]:
    """Extract features from an AI/BI release notes page.

    Structure:
      <h2> = month heading  (e.g. "February 2026")
      <h3> = feature group  (e.g. "Dashboard enhancements and new capabilities")
      Paragraphs / <ul> lists below each <h3> hold dates + descriptions.
      Occasionally an <h2> is a standalone feature with no child <h3>.
    """
    soup = BeautifulSoup(html, "html.parser")
    features = []
    skip_headings = {"on this page", "we care about your privacy", "additional links"}
    month_pattern = re.compile(
        r"^(january|february|march|april|may|june|july|august|september|"
        r"october|november|december)\s+\d{4}$", re.IGNORECASE,
    )

    for heading in soup.find_all(["h2", "h3"]):
        if not isinstance(heading, Tag):
            continue
        title = _clean_heading(heading.get_text(strip=True))
        if not title or title.lower() in skip_headings:
            continue
        # Month headings ("February 2026") are structural — skip them
        if month_pattern.match(title):
            continue

        # Gather content between this heading and the next heading of same or higher level
        tag_name: str = heading.name or "h2"
        stop_tags: set[str] = {"h2"} if tag_name == "h3" else {"h2"}
        stop_tags.add(tag_name)  # also stop at same level

        description_parts: list[str] = []
        date_str = ""
        for sibling in heading.find_next_siblings():
            if not isinstance(sibling, Tag):
                continue
            if sibling.name in stop_tags:
                break
            # For <h3> blocks, also stop at the next <h3>
            if tag_name == "h2" and sibling.name == "h3":
                break
            text = sibling.get_text(strip=True)
            if not text:
                continue
            # Date detection — standalone paragraph with a date-like string
            if not date_str and re.match(r"^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}", text):
                date_str = text.split("\n")[0]
            description_parts.append(text)

        description = "\n".join(description_parts)
        if not description:
            continue

        features.append({
            "title": f"[AI/BI] {title}",
            "date": date_str,
            "description": description,
        })

    print(f"📋 Found {len(features)} features (AI/BI)")
    return features


# ─── STEP 3: GENERATE CONTENT VIA ANTHROPIC API ──────────────────

CONTENT_PROMPT = """You are a LinkedIn content specialist for a data & AI consultant who works with Databricks daily. You write in a conversational, practitioner-first tone — no corporate jargon, no fluff.

Given a Databricks feature announcement, produce TWO outputs:

## OUTPUT 1: LinkedIn Post (plain text, no markdown)
- Hook line (attention-grabbing, question or bold statement)
- 2-3 short paragraphs explaining the feature and its practical impact
- End with a soft CTA (comment/repost/follow)
- Include 3-5 relevant hashtags at the end
- Keep under 1300 characters total
- Use line breaks between paragraphs for readability
- Write as "I" — first person perspective from someone who actually uses Databricks

## OUTPUT 2: Carousel Content (JSON)
Provide a JSON object with these keys:
- "title": A punchy 3-8 word title for the cover slide (not the full feature name)
- "what": 2-3 sentences explaining what the feature is. Plain language. No jargon. (Max 200 chars)
- "why": 2-3 sentences on why this matters to data teams. Focus on real-world impact. (Max 200 chars)
- "how": 2-3 sentences on how to get started or use it. Practical steps. (Max 200 chars)
- "tag": A short category tag like "Governance", "Ingestion", "Compute", "AI/ML", "Security", "SQL", "Streaming"

Format your response EXACTLY like this (no other text):
---POST---
[linkedin post text here]
---CAROUSEL---
[json object here]
"""


def generate_content(feature: dict, provider: str = "anthropic", model: str | None = None) -> dict | None:
    """Route to the chosen LLM provider and return structured content."""
    if provider == "ollama":
        return _generate_via_ollama(feature, model or OLLAMA_MODEL)
    return _generate_via_anthropic(feature, model or ANTHROPIC_MODEL)


def _generate_via_anthropic(feature: dict, model: str) -> dict | None:
    """Call Anthropic API to generate LinkedIn post and carousel content."""
    if not ANTHROPIC_API_KEY:
        print("  ⚠️  No ANTHROPIC_API_KEY — using placeholder content")
        return _placeholder_content(feature)

    user_msg = f"""Feature Title: {feature['title']}
Date: {feature['date']}
Description: {feature['description']}"""

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            json={
                "model": model,
                "max_tokens": 1500,
                "system": CONTENT_PROMPT,
                "messages": [{"role": "user", "content": user_msg}],
            },
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        text = data["content"][0]["text"]
        return _parse_api_response(text, feature)
    except Exception as e:
        print(f"  ❌ Anthropic API error: {e}")
        return _placeholder_content(feature)


def _generate_via_ollama(feature: dict, model: str) -> dict | None:
    """Call a local Ollama instance (OpenAI-compatible endpoint) to generate content."""
    user_msg = f"""Feature Title: {feature['title']}
Date: {feature['date']}
Description: {feature['description']}"""

    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": model,
                "stream": False,
                "messages": [
                    {"role": "system", "content": CONTENT_PROMPT},
                    {"role": "user", "content": user_msg},
                ],
            },
            timeout=300,   # local models on CPU can be slow, especially first run
        )
        resp.raise_for_status()
        data = resp.json()
        text = data["message"]["content"]
        return _parse_api_response(text, feature)
    except requests.ConnectionError:
        print("  ❌ Cannot reach Ollama — is the container running?")
        print("     Run: python ollama_setup.py")
        return _placeholder_content(feature)
    except Exception as e:
        print(f"  ❌ Ollama error: {e}")
        return _placeholder_content(feature)


def _parse_api_response(text: str, feature: dict) -> dict:
    """Parse the structured API response into post + carousel data.

    Local models (Ollama) sometimes produce messy output, so we try
    multiple strategies to extract the JSON carousel block.
    """
    # ── Split post / carousel sections ──
    parts = text.split("---CAROUSEL---")
    post_part = parts[0].replace("---POST---", "").strip() if parts else ""
    carousel_raw = parts[1].strip() if len(parts) > 1 else ""

    carousel_data = _try_parse_carousel_json(carousel_raw)

    # Fallback: scan the entire response for the first JSON object with expected keys
    if carousel_data is None:
        carousel_data = _try_parse_carousel_json(text)

    if carousel_data is None:
        print("  ⚠️  Failed to parse carousel JSON, using placeholder")
        carousel_data = _placeholder_carousel(feature)

    return {
        "post": post_part,
        "carousel": carousel_data,
    }


def _try_parse_carousel_json(text: str) -> dict | None:
    """Try hard to extract a carousel JSON object from messy LLM output."""
    if not text:
        return None

    # Strip markdown fences
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip()

    # Strategy 1: direct parse
    try:
        obj = json.loads(cleaned)
        if isinstance(obj, dict) and ("title" in obj or "what" in obj):
            return obj
    except json.JSONDecodeError:
        pass

    # Strategy 2: find the first { … } block using brace matching
    start = cleaned.find("{")
    if start != -1:
        depth = 0
        for i in range(start, len(cleaned)):
            if cleaned[i] == "{":
                depth += 1
            elif cleaned[i] == "}":
                depth -= 1
                if depth == 0:
                    candidate = cleaned[start : i + 1]
                    try:
                        obj = json.loads(candidate)
                        if isinstance(obj, dict):
                            return obj
                    except json.JSONDecodeError:
                        pass
                    break

    # Strategy 3: regex for key-value pairs and reconstruct
    title = _extract_field(text, "title")
    what = _extract_field(text, "what")
    why = _extract_field(text, "why")
    how = _extract_field(text, "how")
    tag = _extract_field(text, "tag")

    if what and why and how:
        return {
            "title": title or "",
            "what": what,
            "why": why,
            "how": how,
            "tag": tag or "Platform",
        }

    return None


def _extract_field(text: str, field: str) -> str | None:
    """Pull a quoted value for a given JSON key from messy text."""
    pattern = rf'"{field}"\s*:\s*"((?:[^"\\]|\\.)*)"'
    m = re.search(pattern, text, re.IGNORECASE)
    return m.group(1) if m else None


def _placeholder_content(feature: dict) -> dict:
    """Generate placeholder content when API is not available."""
    slug = feature["title"][:60]
    return {
        "post": (
            f"🚀 New from Databricks: {feature['title']}\n\n"
            f"{feature['description'][:300]}\n\n"
            f"This is one to watch for data teams.\n\n"
            f"What do you think — game changer or incremental?\n\n"
            f"#Databricks #DataEngineering #Analytics"
        ),
        "carousel": _placeholder_carousel(feature),
    }


def _placeholder_carousel(feature: dict) -> dict:
    return {
        "title": feature["title"][:50],
        "what": feature["description"][:180] if feature["description"] else "A new Databricks feature to streamline your data workflows.",
        "why": "Reduces manual effort and improves efficiency for data teams working at scale.",
        "how": "Available now in your Databricks workspace. Check the release notes for setup details.",
        "tag": "Platform",
    }


# ─── STEP 4: CREATE OUTPUTS ──────────────────────────────────────

def slugify(text: str) -> str:
    """Convert title to a filesystem-safe slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s]+", "-", text)
    return text[:50].strip("-")


def create_linkedin_post(feature_dir: Path, post_text: str, feature: dict):
    """Write the LinkedIn post draft as a markdown file."""
    filepath = feature_dir / "linkedin_post.md"
    content = f"""# LinkedIn Post Draft: {feature['title']}

> **Date:** {feature.get('date', 'N/A')}
> **Status:** DRAFT — Review before posting

---

{post_text}

---

*Generated from Databricks release notes. Edit as needed before posting.*
"""
    filepath.write_text(content, encoding="utf-8")
    print(f"  📝 Post saved: {filepath.name}")


def create_carousel(feature_dir: Path, carousel_data: dict):
    """Call the Node.js script to generate the carousel PPTX."""
    json_path = feature_dir / "_carousel_data.json"
    pptx_path = feature_dir / "carousel.pptx"

    json_path.write_text(json.dumps(carousel_data, indent=2), encoding="utf-8")

    result = subprocess.run(
        ["node", str(CAROUSEL_SCRIPT), str(json_path), str(pptx_path)],
        capture_output=True, text=True, timeout=30,
    )

    if result.returncode != 0:
        print(f"  ❌ Carousel generation failed: {result.stderr}")
    else:
        print(f"  🎨 Carousel saved: {pptx_path.name}")

    # Clean up temp JSON
    json_path.unlink(missing_ok=True)


# ─── MAIN PIPELINE ───────────────────────────────────────────────

def run_pipeline(
    url: str,
    local_file: str | None = None,
    provider: str = "anthropic",
    model: str | None = None,
    ai_bi_url: str | None = None,
):
    """Execute the full content pipeline."""
    print("=" * 60)
    print("  DATABRICKS → LINKEDIN CONTENT PIPELINE")
    print(f"  Provider: {provider}  |  Model: {model or '(default)'}")
    print("=" * 60)

    # Step 1: Fetch platform release notes
    if local_file:
        print(f"📥 Reading local file: {local_file}")
        html = Path(local_file).read_text(encoding="utf-8")
    else:
        html = fetch_release_notes(url)

    # Step 2a: Parse platform features
    features = parse_features(html)

    # Step 2b: Fetch & parse AI/BI release notes (if provided)
    if ai_bi_url:
        try:
            aibi_html = fetch_release_notes(ai_bi_url)
            aibi_features = parse_aibi_features(aibi_html)
            features.extend(aibi_features)
        except Exception as e:
            print(f"⚠️  Could not fetch AI/BI release notes: {e}")

    if not features:
        print("❌ No features found. Check the URLs.")
        sys.exit(1)

    # Print discovered features
    print("\n📋 Features discovered:")
    for i, f in enumerate(features, 1):
        print(f"  {i}. {f['title']}")
    print()

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Step 3 & 4: For each feature, generate content and create outputs
    for i, feature in enumerate(features, 1):
        print(f"\n🔄 [{i}/{len(features)}] Processing: {feature['title']}")

        # Generate content
        content = generate_content(feature, provider=provider, model=model)
        if not content:
            continue

        # Create feature directory
        feature_dir = OUTPUT_DIR / f"{i:02d}_{slugify(feature['title'])}"
        feature_dir.mkdir(parents=True, exist_ok=True)

        # Create LinkedIn post
        create_linkedin_post(feature_dir, content["post"], feature)

        # Create carousel
        create_carousel(feature_dir, content["carousel"])

    print("\n" + "=" * 60)
    print(f"  ✅ DONE — Output in: {OUTPUT_DIR}")
    print("=" * 60)

    # Summary
    print("\n📦 Generated files:")
    for d in sorted(OUTPUT_DIR.iterdir()):
        if d.is_dir():
            files = [f.name for f in d.iterdir() if not f.name.startswith("_")]
            print(f"  {d.name}/")
            for f in files:
                print(f"    └── {f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Databricks Release Notes → LinkedIn Content")
    parser.add_argument("--url", default=RELEASE_NOTES_URL, help="Release notes URL")
    parser.add_argument("--file", default=None, help="Local HTML file instead of URL")
    parser.add_argument(
        "--provider", choices=["anthropic", "ollama"], default="anthropic",
        help="LLM provider: 'anthropic' (default) or 'ollama' (local container)",
    )
    parser.add_argument(
        "--model", default=None,
        help="Override the default model for the chosen provider",
    )
    parser.add_argument(
        "--ai-bi-url", default=AIBI_RELEASE_NOTES_URL,
        help="AI/BI release notes URL (default: latest year)",
    )
    parser.add_argument(
        "--skip-ai-bi", action="store_true",
        help="Skip AI/BI release notes, only process platform notes",
    )
    args = parser.parse_args()
    ai_bi = None if args.skip_ai_bi else args.ai_bi_url
    run_pipeline(
        args.url,
        local_file=args.file,
        provider=args.provider,
        model=args.model,
        ai_bi_url=ai_bi,
    )
