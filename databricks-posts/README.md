# Databricks → LinkedIn Content Pipeline

Automatically transforms Databricks release notes into LinkedIn posts with accompanying carousels.

## What it does

For each feature in the latest release notes (both **platform** and **AI/BI**):
1. **Fetches** the release notes pages (or reads local HTML files)
2. **Parses** individual features from the HTML
3. **Generates** What / Why / How content via the Anthropic API or a local Ollama model
4. **Creates** a LinkedIn post draft (`.md`) and a carousel (`.pptx`)

## Carousel structure

Each carousel has 5 slides:
- **Cover** — Feature name with Databricks branding
- **WHAT** — What is it? (gold accent)
- **WHY** — Why does it matter? (blue accent)
- **HOW** — How to use it (green accent)
- **CTA** — Follow / repost / comment

## Setup

### Option A — Anthropic API (cloud)

```bash
# Python deps
pip install requests beautifulsoup4

# Node deps (for carousel generation)
npm install -g pptxgenjs

# Set your API key
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Option B — Ollama (local, containerised)

No API key needed — runs entirely on your machine via Docker.

```bash
# Python deps (same as above)
pip install requests beautifulsoup4
npm install -g pptxgenjs

# Start the Ollama container and pull a model (one-time)
python ollama_setup.py                  # default model: mistral
python ollama_setup.py --model llama3   # or pick another model

# When you're done
python ollama_setup.py --stop
```

> **GPU support:** Uncomment the `deploy` block in `docker-compose.yml` if you
> have an NVIDIA GPU. This dramatically speeds up local inference.

## Usage

```bash
# --- Anthropic (default) ---
python workflow.py
python workflow.py --url https://docs.databricks.com/aws/en/release-notes/product/2025/december

# --- Ollama (local) ---
python workflow.py --provider ollama
python workflow.py --provider ollama --model llama3

# --- Local HTML file (works with either provider) ---
python workflow.py --file release_notes.html
python workflow.py --file release_notes.html --provider ollama

# --- AI/BI release notes ---
# Included by default — to skip them:
python workflow.py --skip-ai-bi
# Or point at a different AI/BI URL:
python workflow.py --ai-bi-url https://docs.databricks.com/aws/en/ai-bi/release-notes/2025
```

## Output

```
output/
├── 01_lakebase-autoscaling/
│   ├── linkedin_post.md    ← Draft post ready to review
│   └── carousel.pptx       ← 5-slide LinkedIn carousel
├── 02_gpt-52-model/
│   ├── linkedin_post.md
│   └── carousel.pptx
└── ...
```

## Customisation

- **Colors / branding**: Edit the `COLORS` object in `generate_carousel.js`
- **Content prompt**: Edit `CONTENT_PROMPT` in `workflow.py` to adjust the tone, structure, or voice
- **Feature filtering**: Add skip keywords in `parse_features()` to exclude certain release types
- **CTA slide**: Modify the CTA slide section in `generate_carousel.js`

## Integration ideas

- Hook into a GitHub Action on a schedule to auto-fetch monthly
- Pipe the output into a Copilot agent for content review
- Add to your existing content pipeline alongside conference talk repurposing

## Architecture

```
┌─────────────────────────────┐
│   python workflow.py        │
│   --provider anthropic/ollama│
└──────────┬──────────────────┘
           │
     ┌─────▼──────┐    ┌──────────────────────────┐
     │  Anthropic  │ OR │  Ollama (Docker container)│
     │  Cloud API  │    │  http://localhost:11434   │
     └─────┬──────┘    └──────────┬───────────────┘
           │                      │
           └──────────┬───────────┘
                      ▼
              Structured content
              (post + carousel JSON)
                      │
           ┌──────────▼──────────┐
           │  generate_carousel  │
           │  .js (pptxgenjs)    │
           └──────────┬──────────┘
                      ▼
              output/<feature>/
                linkedin_post.md
                carousel.pptx
```
