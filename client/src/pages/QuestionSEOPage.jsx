import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../config";
const QuestionSEOPage = () => {
  const { slug } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(`${BASE_URL}/api/questions/q/slug/${slug}`);
      setQuestion(res.data);
    };
    fetchQuestion();
  }, [slug]);

  if (!question) return <p>Loading...</p>;

  return (
    <>
      <Helmet>
        <title>{question.question} | CodeVerse Practice</title>
        <meta name="description" content={question.solutionText?.slice(0, 160) || question.question} />
        <meta name="keywords" content={question.tags?.join(", ") || question.topic} />
        <link rel="canonical" href={`https://yourdomain.com/questions/${slug}`} />
      </Helmet>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-2">{question.question}</h1>
        {question.image && <img src={question.image} alt={question.question} className="max-w-md rounded" />}
        {question.options?.map((opt, i) => (
          <p key={i}>{String.fromCharCode(65 + i)}. {opt}</p>
        ))}
        <h2 className="mt-4 font-semibold text-green-700">Answer: {question.answer}</h2>
        <p>{question.solutionText}</p>
      </main>
    </>
  );
};

export default QuestionSEOPage;
