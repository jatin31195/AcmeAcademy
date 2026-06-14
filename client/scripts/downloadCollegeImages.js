/**
 * scripts/downloadCollegeImages.js
 * ─────────────────────────────────────────────────────────────────────────
 * Downloads one high-quality campus image per NIMCET institute and saves it
 * into client/public/college-images/ so the rank-predictor college cards can
 * use real photos.
 *
 * Sources: Wikimedia Commons (CC-BY / CC0 / Public Domain) + one official
 * institute website (MNNIT). Every URL below was HTTP-verified to return a
 * real image — there are NO placeholder URLs.
 *
 * Behaviour:
 *   • Creates public/college-images/ if missing.
 *   • Skips an institute if its image already exists (any extension).
 *   • Derives the file extension from the response Content-Type.
 *   • Prints progress logs.
 *   • Writes IMAGE-CREDITS.md (required attribution for CC-BY images).
 *
 * Requirements: Node.js 18+ (uses the built-in global `fetch`). No npm packages.
 *
 * Run:
 *   node client/scripts/downloadCollegeImages.js
 *   (or, from inside client/:  node scripts/downloadCollegeImages.js )
 * ─────────────────────────────────────────────────────────────────────────
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/college-images");

/**
 * One entry per institute.
 *  - url: direct, verified image URL (null = no freely-licensed image found yet)
 *  - source / license: for attribution (written to IMAGE-CREDITS.md)
 */
const INSTITUTES = [
  {
    name: "NIT Agartala", slug: "nit-agartala",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/NIT_AGARTALA%2C_INFRONT_OF_CENTRAL_LIBRARY.jpg/1920px-NIT_AGARTALA%2C_INFRONT_OF_CENTRAL_LIBRARY.jpg",
    source: "https://commons.wikimedia.org/wiki/File:NIT_AGARTALA,_INFRONT_OF_CENTRAL_LIBRARY.jpg", license: "CC BY-SA 4.0",
  },
  {
    name: "MNNIT Allahabad", slug: "mnnit-allahabad",
    url: "https://www.mnnit.ac.in/dic2020/aboutus.png",
    source: "https://www.mnnit.ac.in/ (official institute website)", license: "© MNNIT Allahabad (institute website)",
  },
  {
    name: "MANIT Bhopal", slug: "manit-bhopal",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MANIT_Main_Building.jpg/1920px-MANIT_Main_Building.jpg",
    source: "https://commons.wikimedia.org/wiki/File:MANIT_Main_Building.jpg", license: "CC BY-SA 4.0",
  },
  {
    name: "NIT Delhi", slug: "nit-delhi",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Admin_Block_NIT_Delhi.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Admin_Block_NIT_Delhi.jpg", license: "CC0 (Public Domain)",
  },
  {
    name: "NIT Jamshedpur", slug: "nit-jamshedpur",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/NIT_Jamshedpur_main_building.JPG/1920px-NIT_Jamshedpur_main_building.JPG",
    source: "https://commons.wikimedia.org/wiki/File:NIT_Jamshedpur_main_building.JPG", license: "Public Domain",
  },
  {
    name: "NIT Kurukshetra", slug: "nit-kurukshetra",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/My_MAIN_BUILDING.jpg/1920px-My_MAIN_BUILDING.jpg",
    source: "https://commons.wikimedia.org/wiki/File:My_MAIN_BUILDING.jpg", license: "CC BY-SA 4.0",
  },
  {
    name: "NIT Raipur", slug: "nit-raipur",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/A_temple_in_the_campus.jpg/1920px-A_temple_in_the_campus.jpg",
    source: "https://commons.wikimedia.org/wiki/File:A_temple_in_the_campus.jpg", license: "Public Domain",
  },
  {
    name: "NIT Meghalaya", slug: "nit-meghalaya",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Inside_campus_2025.jpg/1920px-Inside_campus_2025.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Inside_campus_2025.jpg", license: "CC BY-SA 4.0",
  },
  {
    name: "NIT Tiruchirappalli", slug: "nit-trichy",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Old_library_at_NIT_Trichy.jpg/1920px-Old_library_at_NIT_Trichy.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Old_library_at_NIT_Trichy.jpg", license: "CC BY-SA 2.0",
  },
  {
    name: "NIT Warangal", slug: "nit-warangal",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Nitw_main_gate.JPG/1920px-Nitw_main_gate.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Nitw_main_gate.JPG", license: "CC BY 3.0",
  },
  {
    name: "NIT Patna", slug: "nit-patna",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Architecture_NIT-P.jpg/1920px-Architecture_NIT-P.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Architecture_NIT-P.jpg", license: "CC BY-SA 4.0",
  },

  // ── No freely-licensed campus image exists on Wikimedia for these IIIT
  //    campuses. Add an official image manually into public/college-images/
  //    (e.g. iiit-bhopal.jpg) — the script will then skip them.
  { name: "IIIT Bhopal", slug: "iiit-bhopal", url: null },
  { name: "IIIT Vadodara (Gandhinagar Campus)", slug: "iiit-vadodara", url: null },
  { name: "IIIT Vadodara (International Campus)", slug: "iiit-vadodara-international", url: null },
];

const EXT_BY_TYPE = { "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** fetch with retry + exponential backoff on 429 / 5xx (Wikimedia rate limits). */
async function fetchWithRetry(url, opts, retries = 4) {
  let delay = 1500;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      console.log(`   …rate-limited (HTTP ${res.status}), retrying in ${delay / 1000}s (${attempt}/${retries - 1})`);
      await sleep(delay);
      delay = Math.min(delay * 2, 15000);
      continue;
    }
    return res;
  }
}

/** Returns the existing file name for a slug (any extension), or null. */
async function existingFile(slug, files) {
  return files.find((f) => f.startsWith(`${slug}.`)) || null;
}

async function downloadOne(inst, files) {
  if (!inst.url) {
    console.log(`⚠  ${inst.name}: no freely-licensed image available — add public/college-images/${inst.slug}.jpg manually.`);
    return "manual";
  }

  const already = await existingFile(inst.slug, files);
  if (already) {
    console.log(`↪  Skipping ${inst.name} (already exists: ${already})`);
    return "skipped";
  }

  console.log(`Downloading ${inst.name}...`);
  const res = await fetchWithRetry(inst.url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (ACME-Academy NIMCET Rank Predictor image fetch)",
      Accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
    },
    redirect: "follow",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${inst.url}`);
  const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const ext = EXT_BY_TYPE[type];
  if (!ext) throw new Error(`Unexpected content-type "${type}" (not an image) for ${inst.name}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4096) throw new Error(`Downloaded file too small (${buf.length}B) for ${inst.name}`);

  const fileName = `${inst.slug}.${ext}`;
  await fs.writeFile(path.join(OUT_DIR, fileName), buf);
  console.log(`Saved: public/college-images/${fileName}  (${(buf.length / 1024) | 0} KB)`);
  return "downloaded";
}

async function writeCredits() {
  const lines = [
    "# College Campus Image Credits",
    "",
    "Images used in the ACME Academy NIMCET Rank Predictor college cards.",
    "Wikimedia images are reused under their respective Creative Commons / Public Domain licenses.",
    "",
    "| Institute | License | Source |",
    "| --- | --- | --- |",
    ...INSTITUTES.filter((i) => i.url).map((i) => `| ${i.name} | ${i.license} | ${i.source} |`),
  ];
  await fs.writeFile(path.join(OUT_DIR, "IMAGE-CREDITS.md"), lines.join("\n") + "\n");
}

async function main() {
  console.log(`\n🎓 ACME Academy — downloading NIMCET institute campus images\n   → ${OUT_DIR}\n`);
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = await fs.readdir(OUT_DIR);

  const tally = { downloaded: 0, skipped: 0, manual: 0, failed: 0 };
  for (const inst of INSTITUTES) {
    try {
      const outcome = await downloadOne(inst, files);
      tally[outcome]++;
      // Be polite to Wikimedia between actual downloads to avoid rate limiting.
      if (outcome === "downloaded") await sleep(900);
    } catch (err) {
      tally.failed++;
      console.error(`✗  ${inst.name}: ${err.message}`);
    }
  }

  await writeCredits();

  console.log(
    `\n✅ Done — ${tally.downloaded} downloaded, ${tally.skipped} skipped, ` +
    `${tally.manual} need manual upload, ${tally.failed} failed.`
  );
  console.log(`   Attribution written to public/college-images/IMAGE-CREDITS.md\n`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
