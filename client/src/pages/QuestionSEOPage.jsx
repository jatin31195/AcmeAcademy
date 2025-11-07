import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SEO from "../components/SEO";
import { BASE_URL } from "../config";

const cleanText = (htmlOrText = "") =>
  String(htmlOrText).replace(/<[^>]+>/g, "").trim();

const QuestionSEOPage = () => {
  const { slug } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/questions/q/slug/${slug}`);
        if (res.data?.data) setQuestion(res.data.data);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    };
    fetchQuestion();
  }, [slug]);

  if (!question) return <p className="text-center mt-10">Loading...</p>;


  const title = `${cleanText(question.question)} | ACME Academy`;
  const description =
    cleanText(question.solutionText)?.slice(0, 150) ||
    "Solve this problem and learn smarter with ACME Academy.";
  const keywords = question.tags?.join(", ") || question.topic || "MCA Preparation";
  const url = `https://www.acmeacademy.in/questions/${slug}`;
  const image =
    question.image || "https://www.acmeacademy.in/assets/og-image.png";


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: cleanText(question.question),
    text: cleanText(question.question),
    answerCount: question.answer ? 1 : 0,
    acceptedAnswer: question.answer
      ? {
          "@type": "Answer",
          text: cleanText(
            question.solutionText ||
              question.answer
          ),
          url,
        }
      : undefined,
    author: {
      "@type": "Organization",
      name: "ACME Academy",
      url: "https://www.acmeacademy.in",
    },
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <SEO
        title={title}
        description={description}
        url={url}
        image={image}
        keywords={keywords}
        jsonLd={jsonLd}
      />

      <main className="p-6 max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-snug">
          {cleanText(question.question)}
        </h1>

      
        {question.image && (
          <img
            src={question.image}
            alt={cleanText(question.question)}
            className="w-full max-w-lg rounded-lg shadow-md mb-6 mx-auto"
          />
        )}

    
        {question.options?.length > 0 && (
          <ul className="mb-4 space-y-2">
            {question.options.map((opt, i) => (
              <li
                key={i}
                className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-800 dark:text-gray-200"
              >
                <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
              </li>
            ))}
          </ul>
        )}

   
        {question.answer && (
          <h2 className="mt-6 font-semibold text-green-600 dark:text-green-400">
            ✅ Correct Answer: {question.answer}
          </h2>
        )}

      
        <section className="mt-6 prose dark:prose-invert">
          <h3 className="font-semibold text-lg mb-2">Explanation</h3>
          {question.solutionText ? (
            <p>{question.solutionText}</p>
          ) : (
            <p className="italic text-gray-600">
              Solution will be added soon.
            </p>
          )}

          
          <div className="mt-4 flex flex-wrap gap-3">
            {question.solutionText ? (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                onClick={() => {
                  const explanationEl = document.getElementById("solution-section");
                  if (explanationEl) explanationEl.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Solution
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Solution Coming Soon
              </button>
            )}

        
            {question.solutionVideo ? (
              <a
                href={question.solutionVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Watch Video Solution
              </a>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Video Solution Coming Soon
              </button>
            )}
          </div>
        </section>

       
        {question.discussion?.length > 0 && (
          <section className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Recent Discussion</h3>
            <ul className="space-y-3">
              {question.discussion.map((d, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  <p className="text-sm font-medium">{d.user}</p>
                  <p className="text-sm mt-1">{d.comment}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(d.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        
        <p className="text-center mt-10 text-gray-700 dark:text-gray-300 font-medium">
          🎯 Happy Preparation — <span className="text-blue-600">ACME Academy</span>
        </p>
      </main>
    </>
  );
};

export default QuestionSEOPage;
