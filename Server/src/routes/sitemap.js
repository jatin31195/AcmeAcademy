
import express from "express";
import path from "path";
import Question from "../models/Question.js"; 
import PYQ from "../models/PYQ.js";
import Course from "../models/Course.js"; 
import PracticeSet from "../models/PracticeSet.js"; 

const router = express.Router();

const BASE_URL = process.env.SITE_URL || "https://www.acmeacademy.in"; 

router.get("/sitemap.xml", async (req, res) => {
  try {
    
    const [questions = [], pyqs = [], courses = [], practiceSets = []] = await Promise.all([
      (async () => { try { return await Question.find({}, "slug updatedAt").lean(); } catch { return []; } })(),
      (async () => { try { return await Pyq.find({}, "_id updatedAt").lean(); } catch { return []; } })(),
      (async () => { try { return await Course.find({}, "_id updatedAt").lean(); } catch { return []; } })(),
      (async () => { try { return await PracticeSet.find({}, "_id updatedAt").lean(); } catch { return []; } })(),
    ]);

   
    const staticUrls = [
      { loc: `${BASE_URL}/home`, changefreq: "daily", priority: "1.0", lastmod: new Date().toISOString() },
      { loc: `${BASE_URL}/about`, changefreq: "monthly", priority: "0.8" },
      { loc: `${BASE_URL}/contact-acme-academy`, changefreq: "monthly", priority: "0.6" },
      { loc: `${BASE_URL}/acme-courses`, changefreq: "weekly", priority: "0.8" },
      { loc: `${BASE_URL}/acme-free-courses`, changefreq: "weekly", priority: "0.7" },
      { loc: `${BASE_URL}/acme-practice-sets`, changefreq: "weekly", priority: "0.7" },
      { loc: `${BASE_URL}/acme-academy-open-library`, changefreq: "weekly", priority: "0.7" },
      { loc: `${BASE_URL}/acme-academy-results`, changefreq: "daily", priority: "0.9" },
      { loc: `${BASE_URL}/pyq`, changefreq: "weekly", priority: "0.7" },
    ];

   
    const questionUrls = (questions || []).map((q) => `
      <url>
        <loc>${BASE_URL}/questions/${q.slug}</loc>
        ${q.updatedAt ? `<lastmod>${new Date(q.updatedAt).toISOString()}</lastmod>` : ""}
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join("");

 
    const pyqUrls = (pyqs || []).map((p) => `
      <url>
        <loc>${BASE_URL}/pyq/${p._id}</loc>
        ${p.updatedAt ? `<lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>` : ""}
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
      </url>
    `).join("");

 
    const courseUrls = (courses || []).map(c => `
      <url>
        <loc>${BASE_URL}/acme-academy-open-library/${c._id}</loc>
        ${c.updatedAt ? `<lastmod>${new Date(c.updatedAt).toISOString()}</lastmod>` : ""}
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `).join("");

    const practiceUrls = (practiceSets || []).map(p => `
      <url>
        <loc>${BASE_URL}/acme-practice-sets#${p._id}</loc>
        ${p.updatedAt ? `<lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>` : ""}
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
    `).join("");

    const staticXml = staticUrls.map(u => `
      <url>
        <loc>${u.loc}</loc>
        ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
      </url>
    `).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticXml}
        ${questionUrls}
        ${pyqUrls}
        ${courseUrls}
        ${practiceUrls}
      </urlset>`.replace(/\s{2,}/g, " ");

    res.header("Content-Type", "application/xml");
    return res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    return res.status(500).send("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset></urlset>");
  }
});

export default router;
