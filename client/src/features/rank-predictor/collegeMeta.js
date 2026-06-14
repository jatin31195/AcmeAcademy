/**
 * collegeMeta.js — presentation metadata for NIMCET institutes.
 *
 * Used by CollegeCard.jsx via getCollegeMeta(collegeName). The cards are fed
 * names from college_cutoffs.json ("NIT Trichy", "NIT Bhopal", "IIIT Vadodara"),
 * so getCollegeMeta() resolves those aliases to the canonical entries below.
 *
 * ── Data accuracy ──────────────────────────────────────────────────────────
 *  • name / shortName / location / state / officialWebsite : accurate.
 *  • image : produced by scripts/downloadCollegeImages.js (served from /public).
 *  • seats / fees / avgPackage / highestPackage : INDICATIVE estimates for the
 *    NIMCET MCA programme — they change every counselling cycle. Verify against
 *    the official NIMCET seat matrix / institute brochure before publishing.
 *  • logo : expected at /college-logos/<slug>.png (add logos there; cards fall
 *    back to an initials chip when a logo is missing).
 * ────────────────────────────────────────────────────────────────────────────
 */

const collegeMeta = {
  "NIT Tiruchirappalli": {
    name: "NIT Tiruchirappalli",
    shortName: "NIT Trichy",
    logo: "/college-logos/nit-trichy.png",
    image: "/college-images/nit-trichy.jpg",
    location: "Tiruchirappalli, Tamil Nadu",
    state: "Tamil Nadu",
    seats: "115",
    fees: "≈ ₹1.6 L (2-yr total)",
    avgPackage: "≈ ₹10 LPA",
    highestPackage: "≈ ₹28 LPA",
    shortDescription: "India's top-ranked NIT for MCA, known for outstanding placements.",
    officialWebsite: "https://www.nitt.edu",
  },
  "NIT Warangal": {
    name: "NIT Warangal",
    shortName: "NITW",
    logo: "/college-logos/nit-warangal.png",
    image: "/college-images/nit-warangal.jpg",
    location: "Warangal, Telangana",
    state: "Telangana",
    seats: "58",
    fees: "≈ ₹1.5 L (2-yr total)",
    avgPackage: "≈ ₹9 LPA",
    highestPackage: "≈ ₹24 LPA",
    shortDescription: "Premier NIT with strong industry connect and MCA placements.",
    officialWebsite: "https://www.nitw.ac.in",
  },
  "MNNIT Allahabad": {
    name: "MNNIT Allahabad",
    shortName: "MNNIT",
    logo: "/college-logos/mnnit-allahabad.png",
    image: "/college-images/mnnit-allahabad.png",
    location: "Prayagraj, Uttar Pradesh",
    state: "Uttar Pradesh",
    seats: "116",
    fees: "≈ ₹1.5 L (2-yr total)",
    avgPackage: "≈ ₹8.5 LPA",
    highestPackage: "≈ ₹22 LPA",
    shortDescription: "Among the largest and oldest MCA programmes across the NITs.",
    officialWebsite: "https://www.mnnit.ac.in",
  },
  "MANIT Bhopal": {
    name: "MANIT Bhopal",
    shortName: "MANIT",
    logo: "/college-logos/manit-bhopal.png",
    image: "/college-images/manit-bhopal.jpg",
    location: "Bhopal, Madhya Pradesh",
    state: "Madhya Pradesh",
    seats: "115",
    fees: "≈ ₹1.5 L (2-yr total)",
    avgPackage: "≈ ₹8 LPA",
    highestPackage: "≈ ₹20 LPA",
    shortDescription: "Central India's leading NIT with a well-established MCA department.",
    officialWebsite: "https://www.manit.ac.in",
  },
  "NIT Kurukshetra": {
    name: "NIT Kurukshetra",
    shortName: "NITKKR",
    logo: "/college-logos/nit-kurukshetra.png",
    image: "/college-images/nit-kurukshetra.jpg",
    location: "Kurukshetra, Haryana",
    state: "Haryana",
    seats: "57",
    fees: "≈ ₹1.4 L (2-yr total)",
    avgPackage: "≈ ₹8 LPA",
    highestPackage: "≈ ₹20 LPA",
    shortDescription: "Reputed NIT in North India with consistent MCA recruitment.",
    officialWebsite: "https://www.nitkkr.ac.in",
  },
  "NIT Jamshedpur": {
    name: "NIT Jamshedpur",
    shortName: "NIT JSR",
    logo: "/college-logos/nit-jamshedpur.png",
    image: "/college-images/nit-jamshedpur.jpg",
    location: "Jamshedpur, Jharkhand",
    state: "Jharkhand",
    seats: "58",
    fees: "≈ ₹1.3 L (2-yr total)",
    avgPackage: "≈ ₹7.5 LPA",
    highestPackage: "≈ ₹18 LPA",
    shortDescription: "Established NIT in India's steel city with solid placement support.",
    officialWebsite: "https://www.nitjsr.ac.in",
  },
  "NIT Raipur": {
    name: "NIT Raipur",
    shortName: "NIT RR",
    logo: "/college-logos/nit-raipur.png",
    image: "/college-images/nit-raipur.jpg",
    location: "Raipur, Chhattisgarh",
    state: "Chhattisgarh",
    seats: "76",
    fees: "≈ ₹1.3 L (2-yr total)",
    avgPackage: "≈ ₹7 LPA",
    highestPackage: "≈ ₹16 LPA",
    shortDescription: "Fast-growing NIT with a large MCA intake and active placement cell.",
    officialWebsite: "https://www.nitrr.ac.in",
  },
  "NIT Meghalaya": {
    name: "NIT Meghalaya",
    shortName: "NITM",
    logo: "/college-logos/nit-meghalaya.png",
    image: "/college-images/nit-meghalaya.jpg",
    location: "Shillong, Meghalaya",
    state: "Meghalaya",
    seats: "30",
    fees: "≈ ₹1.3 L (2-yr total)",
    avgPackage: "≈ ₹6.5 LPA",
    highestPackage: "≈ ₹14 LPA",
    shortDescription: "Scenic North-East NIT offering MCA with a small, focused cohort.",
    officialWebsite: "https://www.nitm.ac.in",
  },
  "NIT Patna": {
    name: "NIT Patna",
    shortName: "NITP",
    logo: "/college-logos/nit-patna.png",
    image: "/college-images/nit-patna.jpg",
    location: "Patna, Bihar",
    state: "Bihar",
    seats: "58",
    fees: "≈ ₹1.3 L (2-yr total)",
    avgPackage: "≈ ₹7 LPA",
    highestPackage: "≈ ₹16 LPA",
    shortDescription: "Historic institute (NIT since 2004) with a growing MCA programme.",
    officialWebsite: "https://www.nitp.ac.in",
  },
  "NIT Delhi": {
    name: "NIT Delhi",
    shortName: "NITD",
    logo: "/college-logos/nit-delhi.png",
    image: "/college-images/nit-delhi.jpg",
    location: "New Delhi, Delhi",
    state: "Delhi",
    seats: "30",
    fees: "≈ ₹1.4 L (2-yr total)",
    avgPackage: "≈ ₹8 LPA",
    highestPackage: "≈ ₹18 LPA",
    shortDescription: "Newer NIT in the national capital with strong location advantage.",
    officialWebsite: "https://www.nitdelhi.ac.in",
  },
  "NIT Agartala": {
    name: "NIT Agartala",
    shortName: "NITA",
    logo: "/college-logos/nit-agartala.png",
    image: "/college-images/nit-agartala.jpg",
    location: "Agartala, Tripura",
    state: "Tripura",
    seats: "46",
    fees: "≈ ₹1.2 L (2-yr total)",
    avgPackage: "≈ ₹6.5 LPA",
    highestPackage: "≈ ₹14 LPA",
    shortDescription: "North-East NIT offering MCA with a steadily improving placement record.",
    officialWebsite: "https://www.nita.ac.in",
  },
  "IIIT Bhopal": {
    name: "IIIT Bhopal",
    shortName: "IIIT Bhopal",
    logo: "/college-logos/iiit-bhopal.png",
    image: "/college-images/iiit-bhopal.jpg",
    location: "Bhopal, Madhya Pradesh",
    state: "Madhya Pradesh",
    seats: "≈ 60",
    fees: "≈ ₹2.5 L (2-yr total)",
    avgPackage: "≈ ₹7 LPA",
    highestPackage: "≈ ₹16 LPA",
    shortDescription: "IIIT (PPP model) offering MCA via NIMCET, mentored by MANIT Bhopal.",
    officialWebsite: "https://www.iiitbhopal.ac.in",
  },
  "IIIT Vadodara (Gandhinagar Campus)": {
    name: "IIIT Vadodara (Gandhinagar Campus)",
    shortName: "IIITV",
    logo: "/college-logos/iiit-vadodara.png",
    image: "/college-images/iiit-vadodara.jpg",
    location: "Gandhinagar, Gujarat",
    state: "Gujarat",
    seats: "≈ 40",
    fees: "≈ ₹2.6 L (2-yr total)",
    avgPackage: "≈ ₹7 LPA",
    highestPackage: "≈ ₹15 LPA",
    shortDescription: "IIIT (PPP model) at Gandhinagar offering MCA through NIMCET.",
    officialWebsite: "https://iiitvadodara.ac.in",
  },
  "IIIT Vadodara (International Campus)": {
    name: "IIIT Vadodara (International Campus)",
    shortName: "IIITV-ICD",
    logo: "/college-logos/iiit-vadodara-international.png",
    image: "/college-images/iiit-vadodara-international.jpg",
    location: "Diu, Daman & Diu",
    state: "UT of Daman & Diu",
    seats: "≈ 30",
    fees: "≈ ₹2.6 L (2-yr total)",
    avgPackage: "≈ ₹6.5 LPA",
    highestPackage: "≈ ₹14 LPA",
    shortDescription: "International Campus (Diu) of IIIT Vadodara offering MCA via NIMCET.",
    officialWebsite: "https://iiitvadodara.ac.in",
  },
};

/**
 * Maps the names used in college_cutoffs.json (and other short forms) to the
 * canonical keys above, so cards always resolve the right metadata.
 */
const ALIASES = {
  "NIT Trichy": "NIT Tiruchirappalli",
  "NIT Tiruchirappalli": "NIT Tiruchirappalli",
  "NIT Bhopal": "MANIT Bhopal",
  "MANIT": "MANIT Bhopal",
  "IIIT Vadodara": "IIIT Vadodara (Gandhinagar Campus)",
  "IIITV": "IIIT Vadodara (Gandhinagar Campus)",
};

/** Fallback metadata so CollegeCard always renders gracefully. */
function fallback(name) {
  return {
    name: name || "College",
    shortName: name || "",
    logo: "",
    image: "",
    location: "",
    state: "",
    seats: "",
    fees: "",
    avgPackage: "",
    highestPackage: "",
    shortDescription: "",
    officialWebsite: "",
  };
}

/**
 * Resolve metadata by college name. Tries: exact key → alias → case-insensitive
 * → graceful fallback (never throws, always returns the full shape).
 */
export function getCollegeMeta(collegeName) {
  if (!collegeName) return fallback("");
  const key = String(collegeName).trim();

  if (collegeMeta[key]) return collegeMeta[key];

  const alias = ALIASES[key];
  if (alias && collegeMeta[alias]) return collegeMeta[alias];

  const lc = key.toLowerCase();
  for (const k of Object.keys(collegeMeta)) {
    if (k.toLowerCase() === lc) return collegeMeta[k];
  }

  return fallback(key);
}

export default collegeMeta;
