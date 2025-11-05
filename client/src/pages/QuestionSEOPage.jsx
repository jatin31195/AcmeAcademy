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
        setQuestion(res.data);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    };
    fetchQuestion();
  }, [slug]);

  if (!question) return <p className="text-center mt-10">Loading...</p>;

  const title = `${cleanText(question.question)} | ACME Academy`;
  const description =
    cleanText(question.easyExplanation) ||
    cleanText(question.realLifeExample) ||
    cleanText(question.solutionText)?.slice(0, 150) ||
    "Solve this problem and learn with ACME Academy.";
  const keywords = question.tags?.join(", ") || question.topic || "MCA";
  const url = `https://www.acmeacademy.in/questions/${slug}`;
  const image = question.image || "https://www.acmeacademy.in/assets/og-image.png";


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: cleanText(question.question),
    text: cleanText(question.question),
    answerCount: question.answer ? 1 : 0,
    acceptedAnswer: question.answer
      ? {
          "@type": "Answer",
          text: cleanText(question.solutionText || question.easyExplanation || question.answer),
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
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {question.question}
        </h1>

        {question.image && (
          <img
            src={question.image}
            alt={question.question}
            className="w-full max-w-lg rounded-lg shadow-md mb-4"
          />
        )}

        {question.options?.length > 0 && (
          <ul className="mb-4 space-y-2">
            {question.options.map((opt, i) => (
              <li key={i} className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-6 font-semibold text-green-600 dark:text-green-400">
          Correct Answer: {question.answer}
        </h2>

        <section className="mt-6 prose dark:prose-invert">
          <h3 className="font-semibold text-lg mb-2">Explanation</h3>
          <p>{question.easyExplanation || question.solutionText}</p>

          {question.realLifeExample && (
            <>
              <h4 className="mt-4 font-semibold text-lg">Real Life Example</h4>
              <p>{question.realLifeExample}</p>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default QuestionSEOPage;
