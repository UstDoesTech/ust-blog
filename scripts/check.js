#!/usr/bin/env node
// ────────────────────────────────────────────────────────────
// check.js — Pre-publish voice and format validation
//
// Usage:
//   node scripts/check.js drafts/linkedin/2026-02-10-apiary.md
//   node scripts/check.js drafts/blog/2026-02-10-bees-data.md
//
// Runs a quick checklist against a draft to catch common
// problems before you publish.
// ────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

function readFile(fp) {
  if (!fs.existsSync(fp)) {
    console.error(`✗ File not found: ${fp}`);
    process.exit(1);
  }
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

// ── Checks ─────────────────────────────────────────────────

const CHECKS = {
  // Universal checks
  universal: [
    {
      name: "Opens with something concrete",
      test: (body) => {
        const firstLine = body.trim().split("\n")[0];
        const abstract = /^(in this|this post|today|i('ve| have) been thinking|let me|here's why)/i;
        return !abstract.test(firstLine);
      },
      fail: "First line sounds abstract or thesis-like. Open with a specific moment or observation.",
    },
    {
      name: "Contains an honest caveat",
      test: (body) => {
        const caveats = /\b(wrong|mistake|didn't work|not sure|might never|nowhere near|honest|admit|failed|uncertain|uncomfortable)\b/i;
        return caveats.test(body);
      },
      fail: "No honest caveat detected. The piece needs at least one admission of uncertainty or limitation.",
    },
    {
      name: "Doesn't end with a CTA",
      test: (body) => {
        const lastLines = body.trim().split("\n").slice(-3).join(" ");
        const cta = /\b(let me know|drop a comment|what do you think\?|share this|follow me|subscribe|sign up)\b/i;
        return !cta.test(lastLines);
      },
      fail: "Ending sounds like a call to action. End with a question or open thought instead.",
    },
    {
      name: "British English spelling",
      test: (body) => {
        const american = /\b(optimize|organize|realize|recognize|analyze|categorize|centralize|customize|color(?!ado)|favor(?!ite)|behavior|honor|humor|endeavor|traveled|labeled|modeling)\b/i;
        const matches = body.match(american);
        if (matches) return { pass: false, detail: `Found: "${matches[0]}"` };
        return true;
      },
      fail: "American English spelling detected.",
    },
    {
      name: "No AI-typical phrasing",
      test: (body) => {
        const aiPhrases = /\b(it's worth noting|let's dive in|at the end of the day|here's the thing|in today's landscape|without further ado|game.?changer|level up|deep dive|unpack this|the reality is|buckle up)\b/i;
        const matches = body.match(aiPhrases);
        if (matches) return { pass: false, detail: `Found: "${matches[0]}"` };
        return true;
      },
      fail: "AI-typical phrase detected.",
    },
    {
      name: "No emoji",
      test: (body) => {
        // Basic emoji detection
        const emoji = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        return !emoji.test(body);
      },
      fail: "Emoji detected. Remove them — let the words do the work.",
    },
  ],

  // LinkedIn-specific
  linkedin: [
    {
      name: "Length check (under 1,300 or over 1,800 chars)",
      test: (body) => {
        const len = body.trim().length;
        if (len <= 1300 || len >= 1800) return true;
        return {
          pass: false,
          detail: `${len} chars — in the dead zone (1,301–1,799). Either trim to <1,300 for full visibility or expand to >1,800 if the idea needs it.`,
        };
      },
      fail: "Length in the dead zone.",
    },
    {
      name: "Doesn't start with 'I'",
      test: (body) => {
        const firstWord = body.trim().split(/\s/)[0];
        return firstWord !== "I";
      },
      fail: "Post starts with 'I'. Find a different entry point.",
    },
    {
      name: "Has line breaks (white space as punctuation)",
      test: (body) => {
        const paragraphs = body.trim().split(/\n\n+/);
        return paragraphs.length >= 3;
      },
      fail: "Too few paragraph breaks. LinkedIn needs white space between thoughts.",
    },
    {
      name: "Max 2 hashtags",
      test: (body) => {
        const hashtags = body.match(/#\w+/g) || [];
        return hashtags.length <= 2;
      },
      fail: "More than 2 hashtags. Keep to 0–2 maximum.",
    },
  ],

  // Blog-specific
  blog: [
    {
      name: "Length check (1,000–2,500 words)",
      test: (body) => {
        const words = body.trim().split(/\s+/).length;
        if (words >= 800 && words <= 2800) return true;
        return {
          pass: false,
          detail: `${words} words. Target is 1,000–2,500.`,
        };
      },
      fail: "Word count outside expected range.",
    },
    {
      name: "No bullet point lists in body",
      test: (body) => {
        const bullets = body.match(/^[\s]*[-*•]\s/gm) || [];
        return bullets.length <= 2; // allow occasional use
      },
      fail: "Multiple bullet points detected. Write in prose — weave lists into sentences.",
    },
    {
      name: "Doesn't end with a summary",
      test: (body) => {
        const lastParagraph = body.trim().split(/\n\n+/).pop() || "";
        const summary = /\b(in (summary|conclusion)|to (sum up|summarise|recap)|the (key takeaway|main point))\b/i;
        return !summary.test(lastParagraph);
      },
      fail: "Ending sounds like a summary. The piece ends when the thinking ends.",
    },
  ],
};

// ── Run ────────────────────────────────────────────────────

const filePath = process.argv[2];
if (!filePath) {
  console.log("Usage: node scripts/check.js <draft-file>");
  process.exit(0);
}

const content = readFile(filePath);
const { meta, body } = parseFrontMatter(content);
const platform = meta.platform || path.basename(path.dirname(filePath));

console.log(`\n  Pre-publish check: ${path.basename(filePath)}`);
console.log(`  Platform: ${platform}\n`);

const checks = [
  ...CHECKS.universal,
  ...(CHECKS[platform] || []),
];

let passed = 0;
let failed = 0;
let warnings = [];

for (const check of checks) {
  const result = check.test(body);
  const pass = result === true || (typeof result === "object" && result.pass !== false);
  const detail = typeof result === "object" && result.detail ? ` (${result.detail})` : "";

  if (pass) {
    console.log(`  ✓  ${check.name}`);
    passed++;
  } else {
    console.log(`  ✗  ${check.name}`);
    console.log(`     ${check.fail}${detail}`);
    failed++;
  }
}

console.log(`\n  ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log("  Ready to publish. Or at least, ready to re-read one more time.\n");
} else {
  console.log("  Fix the issues above, or decide they're intentional and publish anyway.\n");
  console.log("  Not every rule applies every time. These are guardrails, not laws.\n");
}

process.exit(failed > 0 ? 1 : 0);
