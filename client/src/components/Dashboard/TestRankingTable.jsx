import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Award, ChevronUp } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/config";

const TestRankingTable = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/user/all-test`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          setAttempts(res.data.attempts || []);
        }
      } catch (error) {
        console.error("Error fetching test attempts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  // 🏅 Badge style logic
  const getRankingBadge = (rank) => {
    if (!rank) {
      return {
        text: "Attempted",
        class: "bg-gray-100 text-gray-700 border border-gray-200",
        icon: null,
      };
    }
    if (rank <= 3) {
      return {
        text: `Top ${rank}`,
        class: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
        icon: <Award className="h-4 w-4 mr-1" />,
      };
    }
    if (rank <= 10) {
      return {
        text: "Top 10",
        class: "bg-indigo-100 text-indigo-800 border border-indigo-200",
        icon: <ChevronUp className="h-4 w-4 mr-1" />,
      };
    }
    return {
      text: `Rank ${rank}`,
      class: "bg-green-100 text-green-800 border border-green-200",
      icon: null,
    };
  };

  // 🔗 Navigate to Test Result Page
  const handleOpenResult = (testId, attemptNumber) => {
    navigate(`/acme-test-result/${testId}/${attemptNumber}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 mb-10">
    <motion.div
      className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Test Rankings</h3>
              <p className="text-gray-500">Click a test to view your result</p>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : attempts.length > 0 ? (
            attempts.map((test) => {
              const badge = getRankingBadge(test.rank);
              return (
                <motion.div
                  key={test._id}
                  // ✅ Updated to use testId
                  onClick={() =>
                    handleOpenResult(test.testId, test.attemptNumber)
                  }
                  className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 hover:shadow-xl transition cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {test.testTitle}
                    </h4>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${badge.class}`}
                    >
                      {badge.icon}
                      {badge.text}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>
                      {new Date(test.submittedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-medium text-gray-800">
                      Score: {test.score}/{test.totalMarks}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              No test attempts found
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[700px] w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-700">
                <th className="px-4 py-2 text-left font-semibold">Test Name</th>
              
                <th className="px-4 py-2 text-right font-semibold">Score</th>
                <th className="px-4 py-2 text-right font-semibold">Accuracy</th>
                <th className="px-4 py-2 text-right font-semibold">Rank</th>
                <th className="px-4 py-2 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Loading test data...
                  </td>
                </tr>
              ) : attempts.length > 0 ? (
                attempts.map((test) => {
                  const badge = getRankingBadge(test.rank);
                  return (
                    <motion.tr
                      key={test._id}
                      // ✅ Updated to use testId here too
                      onClick={() =>
                        handleOpenResult(test.testId, test.attemptNumber)
                      }
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="border-b border-gray-100 transition cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {test.testTitle}
                      </td>
                      
                      <td className="px-4 py-3 text-sm text-right text-gray-700 font-semibold">
                        {test.score}/{test.totalMarks}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">
                        {test.accuracy}%
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${badge.class}`}
                        >
                          {badge.icon}
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {new Date(test.submittedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No test attempts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
    </div>
  );
};

export default TestRankingTable;
