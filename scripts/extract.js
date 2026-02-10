#!/usr/bin/env node
// ────────────────────────────────────────────────────────────
// extract.js — Content atom extraction and draft generation
//
// Usage:
//   node extract.js vault/2026-02-10-apiary-talk.md
//   node extract.js vault/2026-02-10-apiary-talk.md --drafts
//   node extract.js vault/2026-02-10-apiary-talk.md --drafts --atoms 1,2,4
//   node extract.js vault/2026-02-10-apiary-talk.md --atoms-only
//   node extract.js --list                  (show all vault entries)
//   node extract.js --pending               (show entries without atoms)
//
// Requires: ANTHROPIC_API_KEY environment variable
// ────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ── Config ─────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const VAULT_DIR = path.join(ROOT, "vault");
const ATOMS_DIR = path.join(ROOT, "atoms");
const DRAFTS_DIR = path.join(ROOT, "drafts");
const PROMPTS_DIR = path.join(ROOT, "prompts");

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const API_KEY = process.env.ANTHROPIC_API_KEY;

// ── Helpers ────────────────────────────────────────────────

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readFile(fp) {
  if (!fs.existsSync(fp)) die(`File not found: ${fp}`);
  return fs.readFileSync(fp, "utf-8");
}

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
  return { meta, body: match[2] };
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Claude API ─────────────────────────────────────────────

async function callClaude(systemPrompt, userMessage, maxTokens = 4096) {
  if (!API_KEY) die("ANTHROPIC_API_KEY environment variable is required.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    die(`API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

// ── Commands ───────────────────────────────────────────────

function listVault(filter) {
  ensureDir(VAULT_DIR);
  const files = fs
    .readdirSync(VAULT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.log("No vault entries found. Run capture.sh to create one.");
    return;
  }

  console.log(`\n  Content Vault — ${files.length} entries\n`);

  for (const f of files) {
    const { meta } = parseFrontMatter(readFile(path.join(VAULT_DIR, f)));
    const extracted = meta.atoms_extracted === "true";
    const status = extracted ? "◆" : "○";
    const pillar = (meta.pillar || "").replace(/_/g, " ");

    if (filter === "pending" && extracted) continue;

    console.log(
      `  ${status}  ${meta.date || "????-??-??"}  ${meta.title || f}`
    );
    console.log(
      `     ${meta.source_type || "?"} · ${pillar || "?"}`
    );
    console.log();
  }

  console.log("  ○ = needs extraction   ◆ = atoms extracted\n");
}

// ── Extraction ─────────────────────────────────────────────

async function extractAtoms(vaultPath) {
  const fullPath = path.resolve(vaultPath);
  const content = readFile(fullPath);
  const { meta, body } = parseFrontMatter(content);
  const basename = path.basename(fullPath, ".md");

  console.error(`\n  Extracting atoms from: ${meta.title || basename}`);
  console.error(`  Type: ${meta.source_type}  Pillar: ${meta.pillar}\n`);

  // Load extraction prompt
  const extractionPrompt = readFile(path.join(PROMPTS_DIR, "extraction.md"));

  // Build the user message
  const userMessage = `Here is the vault entry to extract atoms from:

---
Source type: ${meta.source_type || "unknown"}
Title: ${meta.title || basename}
Content pillar: ${meta.pillar || "unknown"}
---

${body}

Extract content atoms from this material. Return ONLY a JSON array of atom objects, no other text.`;

  console.error("  Calling Claude for atom extraction...");
  const response = await callClaude(extractionPrompt, userMessage);

  // Parse the JSON from the response
  let atoms;
  try {
    // Handle potential markdown code fences
    const cleaned = response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    atoms = JSON.parse(cleaned);
  } catch (e) {
    die(`Failed to parse atom JSON from API response:\n${response}\n\nError: ${e.message}`);
  }

  // Build the atom inventory markdown
  const atomsFile = buildAtomInventory(meta, basename, atoms);

  // Save
  ensureDir(ATOMS_DIR);
  const atomsPath = path.join(ATOMS_DIR, `${basename}-atoms.md`);
  fs.writeFileSync(atomsPath, atomsFile);

  // Mark vault entry as extracted
  const updatedContent = content.replace(
    "atoms_extracted: false",
    "atoms_extracted: true"
  );
  fs.writeFileSync(fullPath, updatedContent);

  console.error(`  ✓ ${atoms.length} atoms extracted`);
  console.error(`  ✓ Saved to: ${atomsPath}\n`);

  // Print the inventory to stdout for review
  console.log(atomsFile);

  return { atoms, atomsPath, meta, basename };
}

function buildAtomInventory(meta, basename, atoms) {
  let md = `---\nsource: ${basename}\ntitle: "${meta.title || basename}"\ndate: ${meta.date || new Date().toISOString().slice(0, 10)}\n---\n\n`;
  md += `# Atom Inventory: ${meta.title || basename}\n\n`;

  for (const atom of atoms) {
    md += `## [ ] ${atom.id}. ${atom.title}\n\n`;
    md += `**Core:** ${atom.core}\n`;
    md += `**Platforms:** ${atom.platforms.join(", ")}\n`;
    md += `**Pillar:** ${atom.pillar}\n`;
    md += `**Entry point:** ${atom.entry_point}\n`;
    if (atom.connections) {
      md += `**Connections:** ${atom.connections}\n`;
    }
    md += "\n";
  }

  md += `---\n\n`;
  md += `To generate drafts, run:\n`;
  md += `  node scripts/extract.js ${path.join("vault", basename + ".md")} --drafts --atoms 1,2,3\n`;
  md += `\nReplace the numbers with the atom IDs you want to draft.\n`;

  return md;
}

// ── Draft Generation ───────────────────────────────────────

async function generateDrafts(vaultPath, atomIds) {
  const fullPath = path.resolve(vaultPath);
  const content = readFile(fullPath);
  const { meta, body } = parseFrontMatter(content);
  const basename = path.basename(fullPath, ".md");

  // Load existing atoms
  const atomsPath = path.join(ATOMS_DIR, `${basename}-atoms.md`);
  if (!fs.existsSync(atomsPath)) {
    die(`No atoms found. Run extraction first:\n  node scripts/extract.js ${vaultPath}`);
  }

  const atomsContent = readFile(atomsPath);

  // Re-extract the atom data by calling the API again with specific instructions
  // (or parse from the atoms file — we'll re-extract for cleaner drafts)
  const extractionPrompt = readFile(path.join(PROMPTS_DIR, "extraction.md"));

  console.error(`\n  Re-reading atoms for: ${meta.title || basename}`);
  const atomResponse = await callClaude(
    extractionPrompt,
    `Extract atoms from this material. Return ONLY a JSON array.\n\n${body}`
  );

  let atoms;
  try {
    atoms = JSON.parse(
      atomResponse.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    );
  } catch (e) {
    die(`Failed to parse atoms: ${e.message}`);
  }

  // Filter to selected atoms
  const selectedAtoms = atomIds
    ? atoms.filter((a) => atomIds.includes(a.id))
    : atoms;

  if (selectedAtoms.length === 0) {
    die(`No matching atoms found for IDs: ${atomIds.join(", ")}`);
  }

  console.error(
    `  Generating drafts for ${selectedAtoms.length} atom(s)...\n`
  );

  // Load voice prompts
  const voices = {};
  const voiceFiles = {
    blog: "blog-voice.md",
    linkedin: "linkedin-voice.md",
  };
  for (const [key, file] of Object.entries(voiceFiles)) {
    const fp = path.join(PROMPTS_DIR, file);
    if (fs.existsSync(fp)) voices[key] = readFile(fp);
  }

  // Generate drafts for each atom × platform
  for (const atom of selectedAtoms) {
    console.error(`  Atom ${atom.id}: ${atom.title}`);

    for (const platform of atom.platforms) {
      // Skip platforms we don't have voice prompts for yet
      if (!voices[platform] && platform !== "talk_pitch" && platform !== "readme") {
        console.error(`    ⊘ ${platform} — no voice prompt, skipping`);
        continue;
      }

      console.error(`    → ${platform}...`);

      let systemPrompt, userMsg;

      if (platform === "talk_pitch") {
        // Talk pitches don't need a full voice prompt
        systemPrompt =
          "You write conference talk abstracts. 2-3 sentences maximum. The abstract should make a programme committee curious, not explain the whole talk. British English.";
        userMsg = `Write a conference talk abstract based on this idea:\n\nTitle suggestion: ${atom.title}\nCore idea: ${atom.core}\nEntry point: ${atom.entry_point}\n\nSource material:\n${body.slice(0, 3000)}`;
      } else if (platform === "readme") {
        systemPrompt = `You write README introductions for open-source projects. The voice is personal, honest about project status, and technically clear. British English. The README should feel like it was written by someone who cares about the project and respects the reader's time. Include: what it is (1-2 sentences), why it exists (1 paragraph), current status (honest), and a quick start if applicable.`;
        userMsg = `Write a README introduction based on this idea:\n\nCore: ${atom.core}\nEntry point: ${atom.entry_point}\n\nSource material:\n${body.slice(0, 4000)}`;
      } else {
        systemPrompt = voices[platform];
        userMsg = `Write a ${platform} post based on this content atom:

Title/Topic: ${atom.title}
Core idea: ${atom.core}
Suggested entry point: ${atom.entry_point}
${atom.connections ? `Connections: ${atom.connections}` : ""}

Source material for context (use this for substance, not structure):

${body.slice(0, 6000)}

Write the ${platform} post now. Use the entry point as a starting place but follow your instincts about how to open it.`;
      }

      const draft = await callClaude(systemPrompt, userMsg, 3000);

      // Save the draft
      const platformDir = path.join(DRAFTS_DIR, platform);
      ensureDir(platformDir);

      const draftSlug = slugify(atom.title);
      const draftFilename = `${meta.date || "draft"}-${draftSlug}.md`;
      const draftPath = path.join(platformDir, draftFilename);

      const draftContent = `---
source: ${basename}
atom_id: ${atom.id}
atom_title: "${atom.title}"
platform: ${platform}
pillar: ${atom.pillar}
status: draft
date: ${new Date().toISOString().slice(0, 10)}
---

${draft}
`;

      fs.writeFileSync(draftPath, draftContent);
      console.error(`    ✓ ${path.relative(ROOT, draftPath)}`);
    }
    console.error();
  }

  // Update the atoms file — mark drafted atoms with [x]
  let updatedAtoms = atomsContent;
  for (const atom of selectedAtoms) {
    updatedAtoms = updatedAtoms.replace(
      `## [ ] ${atom.id}. ${atom.title}`,
      `## [x] ${atom.id}. ${atom.title}`
    );
  }
  fs.writeFileSync(atomsPath, updatedAtoms);

  console.error("  ✓ All drafts generated.\n");
}

// ── Interactive Selection ──────────────────────────────────

async function interactiveExtractAndDraft(vaultPath) {
  // Step 1: Extract atoms
  const { atoms, atomsPath, meta, basename } = await extractAtoms(vaultPath);

  // Step 2: Ask which to draft
  console.error("\n  Which atoms do you want to draft?");
  console.error("  Enter atom IDs separated by commas (e.g. 1,3,5)");
  console.error('  Or "all" for all atoms, "none" to skip drafting.\n');

  const answer = await ask("  > ");

  if (answer.toLowerCase() === "none" || answer === "") {
    console.error("\n  Atoms saved. Run drafts later with:");
    console.error(
      `  node scripts/extract.js ${vaultPath} --drafts --atoms 1,2,3\n`
    );
    return;
  }

  let atomIds;
  if (answer.toLowerCase() === "all") {
    atomIds = atoms.map((a) => a.id);
  } else {
    atomIds = answer
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  if (atomIds.length === 0) {
    console.error("  No valid atom IDs. Exiting.");
    return;
  }

  await generateDrafts(vaultPath, atomIds);
}

// ── CLI ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // Flags
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
  extract.js — Content atom extraction and draft generation

  Usage:
    node scripts/extract.js <vault-file>                  Interactive extraction + drafting
    node scripts/extract.js <vault-file> --atoms-only     Extract atoms, don't draft
    node scripts/extract.js <vault-file> --drafts         Draft all extracted atoms
    node scripts/extract.js <vault-file> --drafts --atoms 1,3,5   Draft specific atoms
    node scripts/extract.js --list                        List all vault entries
    node scripts/extract.js --pending                     List entries needing extraction

  Environment:
    ANTHROPIC_API_KEY    Required. Your Anthropic API key.

  Directories:
    vault/       Source material (created by capture.sh)
    atoms/       Extracted atom inventories
    drafts/      Generated drafts, organised by platform
    prompts/     Voice prompts and extraction instructions
`);
    return;
  }

  if (args.includes("--list")) {
    listVault();
    return;
  }

  if (args.includes("--pending")) {
    listVault("pending");
    return;
  }

  // Find the vault file argument (first non-flag argument)
  const vaultPath = args.find((a) => !a.startsWith("--"));
  if (!vaultPath) {
    // No file specified — show pending entries and prompt
    listVault("pending");
    console.error(
      "  Specify a vault file to extract:\n  node scripts/extract.js vault/<filename>.md\n"
    );
    return;
  }

  const wantDrafts = args.includes("--drafts");
  const atomsOnly = args.includes("--atoms-only");

  // Parse --atoms flag
  let atomIds = null;
  const atomsIdx = args.indexOf("--atoms");
  if (atomsIdx !== -1 && args[atomsIdx + 1]) {
    atomIds = args[atomsIdx + 1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  if (atomsOnly) {
    // Just extract atoms, no drafts
    await extractAtoms(vaultPath);
  } else if (wantDrafts) {
    // Generate drafts (extract first if needed)
    const basename = path.basename(vaultPath, ".md");
    const atomsPath = path.join(ATOMS_DIR, `${basename}-atoms.md`);
    if (!fs.existsSync(atomsPath)) {
      console.error("  No atoms found — extracting first...\n");
      await extractAtoms(vaultPath);
    }
    await generateDrafts(vaultPath, atomIds);
  } else {
    // Interactive mode
    await interactiveExtractAndDraft(vaultPath);
  }
}

main().catch((e) => {
  console.error(`\n  ✗ ${e.message}`);
  process.exit(1);
});
