import axios from "axios";
import { load } from "cheerio";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Question from "../models/Question.js";
import { slugifyQuestion } from "../utils/slugify.js";

dotenv.config();

// ==================== CONFIG ====================
const subject = "Aptitude";
const topic = "Probability";
const baseURL = "https://www.indiabix.com/aptitude/probability/";

const sectionCodes = [
  "", // base page
  "066002",
  "066003",
];

// ==================== HELPERS ====================
const absoluteUrl = (relativePath) => {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `https://www.indiabix.com${relativePath}`;
};

const cleanText = (text) =>
  text
    .replace(/\s+/g, " ")
    .replace(/\s*([\^\_\=\+\-\*\/\(\)√∛])\s*/g, "$1")
    .trim();

// ==================== MATH PARSER ====================
const parseMathElement = ($, el) => {
  let html = $(el).html() || "";

  html = html
    .replace(/<span class="ga-root-h1">([\s\S]*?)<\/span>/g, "√($1)")
    .replace(/<span class="ga-root-h2">([\s\S]*?)<\/span>/g, "√($1)")
    .replace(/<span class="ga-cbrt-h1">([\s\S]*?)<\/span>/g, "∛($1)")
    .replace(/<sup>(.*?)<\/sup>/g, "^($1)")
    .replace(/<sub>(.*?)<\/sub>/g, "_($1)")
    .replace(/<i class="ga-var">([\s\S]*?)<\/i>/g, "$1")
    .replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (_, src) => `[${absoluteUrl(src)}]`)
    .replace(/&nbsp;/g, " ")
    .replace(/<\/?[^>]+(>|$)/g, "");

  return cleanText(html);
};

// ==================== FRACTION PARSER ====================
const parseFractionTable = ($, table) => {
  const topRow = $(table).find("tr.ga-tr-divident");
  const bottomRow = $(table).find("tr.ga-tr-divisor");
  if (!topRow.length || !bottomRow.length) return null;

  const leftText = parseMathElement($, topRow.find("td.ga-td-line-rpad"));
  const numerator = parseMathElement($, topRow.find("td.ga-td-divident"));
  const denominator = parseMathElement($, bottomRow.find("td.ga-td-divisor"));
  const rightText = parseMathElement($, topRow.find("td.ga-td-line-lrpad"));

  const fraction = numerator && denominator ? `${numerator}/(${denominator})` : "";
  const eq = [leftText, fraction, rightText].filter(Boolean).join(" ");
  return cleanText(eq);
};

// ==================== OPTION PARSER ====================
const parseOption = ($, opt) => {
  const table = $(opt).find("table.ga-tbl-answer");
  if (table.length) {
    const frac = parseFractionTable($, table);
    if (frac) return frac;
  }

  $(opt)
    .find("img")
    .each((_, img) => {
      const src = $(img).attr("src");
      if (src) $(img).replaceWith(` [${absoluteUrl(src)}] `);
    });

  const html = $(opt).html();
  if (html.includes("ga-root") || html.includes("ga-var") || html.includes("<sup>")) {
    return parseMathElement($, opt);
  }

  return cleanText($(opt).text());
};

// ==================== EXPLANATION PARSER ====================
const parseExplanation = ($, div) => {
  let explanation = "";
  $(div)
    .children()
    .each((_, el) => {
      $(el)
        .find("img")
        .each((_, img) => {
          const src = $(img).attr("src");
          if (src) $(img).replaceWith(` [${absoluteUrl(src)}] `);
        });

      if ($(el).is("table.ga-tbl-answer")) {
        const frac = parseFractionTable($, el);
        if (frac) explanation += frac + "\n";
      } else {
        const text = parseMathElement($, el);
        if (text) explanation += text + "\n";
      }
    });
  return cleanText(explanation);
};

// ==================== PAGE SCRAPER ====================
const fetchPageQuestions = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const questionGroups = [];

    const directionDiv = $("#direction .direction-text");

    // 🧠 CASE 1: Direction exists
    if (directionDiv.length) {
      const mainQuestion = cleanText(directionDiv.text());
      if (!mainQuestion) return [];

      const subQuestions = [];
      $("#direction")
        .nextAll("div.bix-div-container")
        .each((_, el) => {
          const qEl = $(el).find(".bix-td-qtxt");

          // Preserve inline images in questions
          qEl.find("img").each((_, img) => {
            const src = $(img).attr("src");
            if (src) $(img).replaceWith(` [${absoluteUrl(src)}] `);
          });

          const qTable = qEl.find("table.ga-tbl-answer");
          let qText = "";

          if (qTable.length) qText = parseFractionTable($, qTable);
          else if (qEl.find(".ga-root-h1, .ga-var, sup, sub").length)
            qText = parseMathElement($, qEl);
          else qText = cleanText(qEl.text());

          if (!qText.trim()) return;

          const options = [];
          $(el)
            .find(".bix-td-option-val div.flex-wrap")
            .each((_, opt) => {
              const parsed = parseOption($, opt);
              if (parsed) options.push(parsed);
            });

          const answerInput = $(el).find("input.jq-hdnakq");
          let answer = "";
          let solutionText = "No explanation available";
          let solutionImage = "";

          if (answerInput.length) {
            const answerLetter = answerInput.val();
            const answerId = answerInput.attr("id")?.split("_")[1];
            if (answerId) {
              const answerDiv = $(`#divAnswer_${answerId}`);
              const explanationDiv = answerDiv.find(".bix-ans-description");
              if (explanationDiv.length) {
                const expImg = explanationDiv.find("img");
                if (expImg.length) solutionImage = absoluteUrl(expImg.attr("src"));
                solutionText = parseExplanation($, explanationDiv);
              }
            }
            if (answerLetter && options.length) {
              const index = answerLetter.charCodeAt(0) - 65;
              answer = options[index] || "";
            }
          }

          subQuestions.push({
            question: qText,
            options,
            answer,
            solutionText,
            solutionImage,
            solutionVideo: "",
            image: "",
            tags: [],
            topic,
          });
        });

      if (subQuestions.length > 0) {
        questionGroups.push({
          question: mainQuestion,
          subject,
          topic,
          subQuestions,
          solutionText: "",
          solutionImage: "",
          solutionVideo: "",
          image: "",
          tags: [],
          section: null,
          slug: slugifyQuestion({ question: mainQuestion }),
          discussion: [],
        });
      }

      return questionGroups;
    }

    // 🧠 CASE 2: No direction → each question individually
    $("div.bix-div-container").each((_, el) => {
      const qEl = $(el).find(".bix-td-qtxt");

      // Preserve inline images
      qEl.find("img").each((_, img) => {
        const src = $(img).attr("src");
        if (src) $(img).replaceWith(` [${absoluteUrl(src)}] `);
      });

      const qTable = qEl.find("table.ga-tbl-answer");
      let qText = "";

      if (qTable.length) qText = parseFractionTable($, qTable);
      else if (qEl.find(".ga-root-h1, .ga-var, sup, sub").length)
        qText = parseMathElement($, qEl);
      else qText = cleanText(qEl.text());

      if (!qText.trim()) return;

      const options = [];
      $(el)
        .find(".bix-td-option-val div.flex-wrap")
        .each((_, opt) => {
          const parsed = parseOption($, opt);
          if (parsed) options.push(parsed);
        });

      const answerInput = $(el).find("input.jq-hdnakq");
      let answer = "";
      let solutionText = "No explanation available";
      let solutionImage = "";

      if (answerInput.length) {
        const answerLetter = answerInput.val();
        const answerId = answerInput.attr("id")?.split("_")[1];
        if (answerId) {
          const answerDiv = $(`#divAnswer_${answerId}`);
          const explanationDiv = answerDiv.find(".bix-ans-description");
          if (explanationDiv.length) {
            const expImg = explanationDiv.find("img");
            if (expImg.length) solutionImage = absoluteUrl(expImg.attr("src"));
            solutionText = parseExplanation($, explanationDiv);
          }
        }
        if (answerLetter && options.length) {
          const index = answerLetter.charCodeAt(0) - 65;
          answer = options[index] || "";
        }
      }

      questionGroups.push({
        question: qText,
        subject,
        topic,
        options,
        answer,
        solutionText,
        solutionImage,
        solutionVideo: "",
        image: "",
        tags: [],
        section: null,
        slug: slugifyQuestion({ question: qText }),
        discussion: [],
        subQuestions: [],
      });
    });

    return questionGroups;
  } catch (err) {
    if (err.response?.status === 404) {
      console.log(`⚠️ Page not found: ${url}`);
      return [];
    }
    console.error("❌ Error fetching page:", url, err.message);
    return [];
  }
};

// ==================== MAIN SCRAPER ====================
const fetchAllQuestions = async () => {
  try {
    await connectDB();

    for (const code of sectionCodes) {
      const url = `${baseURL}${code}`;
      console.log(`🔍 Scraping: ${url}`);

      const questionGroups = await fetchPageQuestions(url);
      if (!questionGroups?.length) {
        console.log(`⚠️ No questions found on ${url}`);
        continue;
      }

      for (const q of questionGroups) {
        const existing = await Question.findOne({ slug: q.slug });

        if (existing) {
          const newSubs = q.subQuestions.filter((sub) => {
            return !existing.subQuestions.some((ex) => {
              const sameQ = ex.question.trim() === sub.question.trim();
              const sameOpts =
                JSON.stringify([...ex.options].sort()) ===
                JSON.stringify([...sub.options].sort());
              return sameQ && sameOpts;
            });
          });

          if (newSubs.length > 0) {
            existing.subQuestions.push(...newSubs);
            await existing.save();
            console.log(`🔁 Added ${newSubs.length} new subquestions to ${q.slug}`);
          } else {
            console.log(`⏩ No new subquestions for: ${q.slug}`);
          }
        } else {
          await Question.create(q);
          console.log(`✅ Inserted new question: ${q.slug}`);
        }
      }
    }

    console.log("🎉 All questions scraped successfully!");
    process.exit(0);
  } catch (err) {
    console.error("💥 Error during scraping:", err);
    process.exit(1);
  }
};

fetchAllQuestions();
