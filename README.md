# Content Vault

A minimal content pipeline that turns one piece of work into several, without it feeling like a second job.

## How It Works

```
Work → Capture → Extract atoms → Draft → Polish → Publish
 you     60s      Claude API      API     you       you
```

**Capture** grabs raw material into a dated markdown file.
**Extract** identifies standalone content atoms and suggests platforms.
**Draft** generates platform-specific first drafts using voice prompts.
**Check** validates tone, format, and common mistakes before publishing.
**Polish and publish** is the human part. It always will be.

## Setup

```bash
# Clone and enter
git clone <your-repo> content-vault
cd content-vault

# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Make capture executable (macOS/Linux)
chmod +x scripts/capture.sh
```

**Requirements:** Node.js 18+ (for native `fetch`). No npm dependencies.

## Directory Structure

```
content-vault/
├── vault/              Raw source material
├── atoms/              Extracted atom inventories
├── drafts/
│   ├── blog/           Blog post drafts
│   ├── linkedin/       LinkedIn post drafts
│   ├── talk_pitch/     Conference abstract drafts
│   └── readme/         README drafts
├── published/          Archive of published pieces
├── prompts/
│   ├── extraction.md   System prompt for atom extraction
│   ├── blog-voice.md   Blog voice prompt
│   └── linkedin-voice.md  LinkedIn voice prompt
└── scripts/
    ├── capture.sh      Create vault entries (macOS/Linux)
    ├── capture.ps1     Create vault entries (Windows)
    ├── extract.js      Atom extraction + draft generation
    └── check.js        Pre-publish validation
```

## Usage

### 1. Capture

After finishing a talk, blog post, technical doc, or side project:

```bash
# macOS / Linux
./scripts/capture.sh "Apiary conference talk" -t conference_talk -p technical_deep_dive

# Windows PowerShell
.\scripts\capture.ps1 "Apiary conference talk" -Type conference_talk -Pillar technical_deep_dive

# Interactive (prompts for everything)
./scripts/capture.sh
```

This creates a vault entry and opens your editor. Paste the raw material — slides, notes, code, whatever — and save.

### 2. Extract

```bash
# Interactive: extracts atoms, then asks which to draft
node scripts/extract.js vault/2026-02-10-apiary-conference-talk.md

# Just extract atoms, skip drafting
node scripts/extract.js vault/2026-02-10-apiary-conference-talk.md --atoms-only

# List all vault entries
node scripts/extract.js --list

# Show entries that haven't been extracted yet
node scripts/extract.js --pending
```

### 3. Draft

```bash
# Draft all atoms for a vault entry
node scripts/extract.js vault/2026-02-10-apiary-conference-talk.md --drafts

# Draft specific atoms only
node scripts/extract.js vault/2026-02-10-apiary-conference-talk.md --drafts --atoms 1,3,5
```

Drafts are saved to `drafts/<platform>/` with front matter linking back to the source.

### 4. Check

```bash
# Validate a draft before publishing
node scripts/check.js drafts/linkedin/2026-02-10-central-coordination.md
node scripts/check.js drafts/blog/2026-02-10-bees-and-data.md
```

Checks for: concrete opening, honest caveat, no CTA ending, British English, no AI phrasing, no emoji, platform-specific length/format rules.

### 5. Publish

Edit the draft. Make it yours. The draft is a starting point, not a finished piece.

When published, move to `published/`:

```bash
mv drafts/linkedin/2026-02-10-post.md published/
```

## Weekly Rhythm

| Day | Task | Time |
|-----|------|------|
| Monday | Review vault, run extraction, check atom inventories | 15 min |
| Midweek | Polish one draft and publish | 30–45 min |
| Friday | Capture anything new from the week | 5 min |

One piece per week. From a backlog, not a blank page.

## Voice Prompts

The `prompts/` directory contains the system prompts that shape Claude's output. Edit them as your voice evolves. They're the most important files in this repo.

Current prompts:
- **extraction.md** — How to identify content atoms from raw material
- **blog-voice.md** — ustdoes.tech blog voice (philosophical, patient, confessional)
- **linkedin-voice.md** — LinkedIn adaptation (same person, less preamble)

To add a new platform, create a new voice prompt in `prompts/` and add its filename to the `voiceFiles` map in `extract.js`.

## What This Doesn't Automate

Deciding what's interesting. The final voice. The personal thread. Saying no.

Those are yours.
