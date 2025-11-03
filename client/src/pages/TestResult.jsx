import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useAuth } from "@/AuthContext";
import SolutionView from "@/components/Test/SolutionView";
import { BASE_URL } from "../config";
const TestResult = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { testId, attemptNumber } = useParams();  
  const [results, setResults] = useState(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

 useEffect(() => {
  const fetchResult = async () => {
    try {
      const endpoint = attemptNumber
        ? `${BASE_URL}/api/tests/${testId}/attempt/${attemptNumber}/result`
        : `${BASE_URL}/api/tests/${testId}/result`;

      const res = await axios.get(endpoint, { withCredentials: true });
      setResults(res.data);
    
    } catch (err) {
      console.error("Error fetching test result:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchResult();
}, [user, testId, attemptNumber]);


  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading your test result...
      </div>
    );

  if (!results) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const { stats } = results;

  // ✅ When user clicks "View Solutions"
  if (showSolutions) {
    return (
      <SolutionView
        results={results}
        sections={results.sections}
        currentSectionIndex={currentSectionIndex}
        setCurrentSectionIndex={setCurrentSectionIndex}
        onExit={() => setShowSolutions(false)}
      />
    );
  }


return (
  <div className="min-h-screen bg-white p-8 relative">

    <div className="absolute top-4 left-4">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="border-gray-400 text-gray-600 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>

    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-2xl w-full">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-lg font-medium">
            {results.testTitle}
            {results.category ? ` | ${results.category}` : ""}
          </h1>
          <Button
            variant="outline"
            className="border-cyan-500 text-cyan-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Pdf
          </Button>
        </div>

        {/* SCORE CARD */}
        <div className="bg-white border-2 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-sm mb-2">TOTAL SCORE</p>
          <h2 className="text-6xl font-bold text-cyan-500 mb-2">
            {results.totalScore}
          </h2>
          <p className="text-gray-500 mb-2">OUT OF {results.totalMarks}</p>
          <p className="text-orange-500 text-sm mb-8">
            ⏱️ {formatTime(results.totalTimeTaken)}
          </p>

          <p className="text-gray-600 text-sm mb-8">
            Accuracy:{" "}
            <span className="font-semibold text-cyan-600">{results.accuracy}%</span>
          </p>

          {/* STATS */}
          <div className="space-y-4 mb-8">
            {[
              { color: "bg-purple-400", label: "Total Questions", value: results.questions?.length || 0, symbol: "?" },
              { color: "bg-green-500", label: "Correct Answers", value: stats.correct, symbol: "✓" },
              { color: "bg-red-500", label: "Incorrect Answers", value: stats.incorrect, symbol: "✕" },
              { color: "bg-gray-400", label: "Unattempted Questions", value: stats.unattempted, symbol: "○" },
              { color: "bg-blue-400", label: "Positive Marks", value: stats.positiveMarks, symbol: "+" },
              { color: "bg-orange-400", label: "Negative Marks", value: stats.negativeMarks, symbol: "-" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center`}>
                    {item.symbol}
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowSolutions(true)}
            className="w-full bg-white hover:bg-gray-50 text-cyan-500 border-2 border-cyan-500 py-6 text-lg font-semibold"
          >
            View Detailed Solutions
          </Button>
        </div>
      </div>
    </div>
  </div>
);

};

export default TestResult;
