#!/usr/bin/env node
/**
 * LinkedIn Carousel Generator for Databricks Release Notes
 * Creates a square (1:1) carousel with: Cover → WHAT → WHY → HOW → CTA
 *
 * Usage: node generate_carousel.js <json_file> <output_path>
 *   json_file: JSON with { title, what, why, how, tag }
 */

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// --- CONFIG (Ust Brand v2 — Automation Pillar) ---
const COLORS = {
  teal:      "0A6E6E",   // Deep Teal — Primary / Brand Anchor
  darkBg:    "0D1B2A",   // Dark Navy — slide backgrounds
  midDark:   "162738",   // bgSubtle — card backgrounds
  white:     "FFFFFF",
  offWhite:  "E8E4DD",   // Warm off-white — body text
  lightGray: "6B7C8A",   // Text muted — footers, page numbers
  sage:      "4A7C6F",   // Sage Green — Automation accent
  amber:     "F5A623",   // Honey Amber — WHAT accent
  coral:     "FF4F58",   // Electric Coral — emphasis only
};

const FONTS = {
  header: "Georgia",
  body:   "Segoe UI",
  code:   "Consolas",
};

// Helper: factory functions to avoid pptxgenjs object mutation bug
const makeShadow = () => ({
  type: "outer", blur: 8, offset: 3, angle: 135,
  color: "000000", opacity: 0.25
});

function createCarousel(data, outputPath) {
  const pres = new pptxgen();

  // Square format for LinkedIn carousel
  pres.defineLayout({ name: "SQUARE", width: 7.5, height: 7.5 });
  pres.layout = "SQUARE";
  pres.author = "Ust. does. tech";
  pres.title = data.title;

  // ============================================
  // SLIDE 1: COVER
  // ============================================
  const s1 = pres.addSlide();
  s1.background = { color: COLORS.darkBg };

  // Top accent bar (brand teal)
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 7.5, h: 0.08,
    fill: { color: COLORS.teal }
  });

  // Gradient bar below (Teal → Sage → Amber — v2 brand signature)
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.08, w: 2.5, h: 0.03,
    fill: { color: COLORS.teal }
  });
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 0.08, w: 2.5, h: 0.03,
    fill: { color: COLORS.sage }
  });
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 5.0, y: 0.08, w: 2.5, h: 0.03,
    fill: { color: COLORS.amber }
  });

  // Tag pill (Automation pillar — Sage Green)
  s1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.2, w: 2.8, h: 0.45,
    fill: { color: COLORS.sage },
    rectRadius: 0.15
  });
  s1.addText("DATABRICKS UPDATE", {
    x: 0.6, y: 1.2, w: 2.8, h: 0.45,
    fontSize: 12, fontFace: FONTS.body,
    color: COLORS.white, bold: true,
    align: "center", valign: "middle",
    charSpacing: 3
  });

  // Title
  s1.addText(data.title, {
    x: 0.6, y: 2.1, w: 6.3, h: 2.8,
    fontSize: 36, fontFace: FONTS.header,
    color: COLORS.white, bold: true,
    align: "left", valign: "top",
    lineSpacingMultiple: 1.15
  });

  // Swipe indicator
  s1.addText("Swipe to learn more →", {
    x: 0.6, y: 6.2, w: 6.3, h: 0.5,
    fontSize: 14, fontFace: FONTS.body,
    color: COLORS.lightGray, italic: true,
    align: "left"
  });

  // Footer
  s1.addText("ustdoes.tech", {
    x: 0.6, y: 6.7, w: 6.3, h: 0.4,
    fontSize: 11, fontFace: FONTS.body,
    color: COLORS.lightGray, align: "left"
  });

  // ============================================
  // SLIDE 2: WHAT
  // ============================================
  const s2 = pres.addSlide();
  s2.background = { color: COLORS.darkBg };

  // Top accent
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 7.5, h: 0.08,
    fill: { color: COLORS.amber }
  });

  // Step indicator
  s2.addShape(pres.shapes.OVAL, {
    x: 0.6, y: 0.7, w: 0.65, h: 0.65,
    fill: { color: COLORS.amber }
  });
  s2.addText("1", {
    x: 0.6, y: 0.7, w: 0.65, h: 0.65,
    fontSize: 22, fontFace: FONTS.header,
    color: COLORS.darkBg, bold: true,
    align: "center", valign: "middle"
  });

  // Section title
  s2.addText("WHAT IS IT?", {
    x: 1.5, y: 0.72, w: 5.4, h: 0.6,
    fontSize: 26, fontFace: FONTS.header,
    color: COLORS.amber, bold: true,
    align: "left", valign: "middle",
    charSpacing: 2
  });

  // Content card
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 6.3, h: 4.6,
    fill: { color: COLORS.midDark },
    shadow: makeShadow()
  });

  // Left accent bar on card
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 0.06, h: 4.6,
    fill: { color: COLORS.amber }
  });

  s2.addText(data.what, {
    x: 1.1, y: 2.1, w: 5.5, h: 4.0,
    fontSize: 18, fontFace: FONTS.body,
    color: COLORS.offWhite,
    align: "left", valign: "top",
    lineSpacingMultiple: 1.4
  });

  // Page indicator
  s2.addText("1 / 3", {
    x: 0.6, y: 6.7, w: 6.3, h: 0.4,
    fontSize: 11, fontFace: FONTS.body,
    color: COLORS.lightGray, align: "right"
  });

  // ============================================
  // SLIDE 3: WHY
  // ============================================
  const s3 = pres.addSlide();
  s3.background = { color: COLORS.darkBg };

  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 7.5, h: 0.08,
    fill: { color: COLORS.teal }
  });

  s3.addShape(pres.shapes.OVAL, {
    x: 0.6, y: 0.7, w: 0.65, h: 0.65,
    fill: { color: COLORS.teal }
  });
  s3.addText("2", {
    x: 0.6, y: 0.7, w: 0.65, h: 0.65,
    fontSize: 22, fontFace: FONTS.header,
    color: COLORS.white, bold: true,
    align: "center", valign: "middle"
  });

  s3.addText("WHY DOES IT MATTER?", {
    x: 1.5, y: 0.72, w: 5.4, h: 0.6,
    fontSize: 26, fontFace: FONTS.header,
    color: COLORS.teal, bold: true,
    align: "left", valign: "middle",
    charSpacing: 2
  });

  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 6.3, h: 4.6,
    fill: { color: COLORS.midDark },
    shadow: makeShadow()
  });

  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 0.06, h: 4.6,
    fill: { color: COLORS.teal }
  });

  s3.addText(data.why, {
    x: 1.1, y: 2.1, w: 5.5, h: 4.0,
    fontSize: 18, fontFace: FONTS.body,
    color: COLORS.offWhite,
    align: "left", valign: "top",
    lineSpacingMultiple: 1.4
  });

  s3.addText("2 / 3", {
    x: 0.6, y: 6.7, w: 6.3, h: 0.4,
    fontSize: 11, fontFace: FONTS.body,
    color: COLORS.lightGray, align: "right"
  });

  // ============================================
  // SLIDE 4: HOW
  // ============================================
  const s4 = pres.addSlide();
  s4.background = { color: COLORS.darkBg };

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 7.5, h: 0.08,
    fill: { color: COLORS.sage }
  });

  s4.addShape(pres.shapes.OVAL, {
    x: 0.6, y: 0.7, w: 0.65, h: 0.65,
    fill: { color: COLORS.sage }
  });
  s4.addText("3", {
    x: 0.6, y: 0.7, w: 0.65, h: 0.65,
    fontSize: 22, fontFace: FONTS.header,
    color: COLORS.darkBg, bold: true,
    align: "center", valign: "middle"
  });

  s4.addText("HOW TO USE IT", {
    x: 1.5, y: 0.72, w: 5.4, h: 0.6,
    fontSize: 26, fontFace: FONTS.header,
    color: COLORS.sage, bold: true,
    align: "left", valign: "middle",
    charSpacing: 2
  });

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 6.3, h: 4.6,
    fill: { color: COLORS.midDark },
    shadow: makeShadow()
  });

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 0.06, h: 4.6,
    fill: { color: COLORS.sage }
  });

  s4.addText(data.how, {
    x: 1.1, y: 2.1, w: 5.5, h: 4.0,
    fontSize: 18, fontFace: FONTS.body,
    color: COLORS.offWhite,
    align: "left", valign: "top",
    lineSpacingMultiple: 1.4
  });

  s4.addText("3 / 3", {
    x: 0.6, y: 6.7, w: 6.3, h: 0.4,
    fontSize: 11, fontFace: FONTS.body,
    color: COLORS.lightGray, align: "right"
  });

  // ============================================
  // SLIDE 5: CTA
  // ============================================
  const s5 = pres.addSlide();
  s5.background = { color: COLORS.darkBg };

  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 7.5, h: 0.08,
    fill: { color: COLORS.teal }
  });

  s5.addText("Found this useful?", {
    x: 0.6, y: 1.8, w: 6.3, h: 1.0,
    fontSize: 34, fontFace: FONTS.header,
    color: COLORS.white, bold: true,
    align: "center", valign: "middle"
  });

  s5.addText([
    { text: "♻️  Repost to help your network", options: { breakLine: true, fontSize: 18 } },
    { text: "", options: { breakLine: true, fontSize: 10 } },
    { text: "🔔  Follow for more Databricks updates", options: { breakLine: true, fontSize: 18 } },
    { text: "", options: { breakLine: true, fontSize: 10 } },
    { text: "💬  Drop a comment — what feature excites you?", options: { fontSize: 18 } },
  ], {
    x: 0.6, y: 3.2, w: 6.3, h: 2.5,
    fontFace: FONTS.body, color: COLORS.offWhite,
    align: "center", valign: "top",
    lineSpacingMultiple: 1.3
  });

  // Branded footer with wordmark
  s5.addText([
    { text: "Ust", options: { bold: true, fontFace: FONTS.header } },
    { text: ".", options: { bold: true, color: COLORS.amber, fontFace: FONTS.header } },
    { text: " does.tech  |  @Ust", options: { fontFace: FONTS.body } },
  ], {
    x: 0.6, y: 6.0, w: 6.3, h: 0.5,
    fontSize: 14, color: COLORS.lightGray, align: "center"
  });

  // Bottom accent bar
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 7.42, w: 7.5, h: 0.08,
    fill: { color: COLORS.teal }
  });

  return pres.writeFile({ fileName: outputPath });
}

// --- MAIN ---
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node generate_carousel.js <json_file> <output_path>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(args[0], "utf8"));
createCarousel(data, args[1])
  .then(() => console.log(`✅ Carousel created: ${args[1]}`))
  .catch(err => { console.error("❌ Error:", err); process.exit(1); });
