import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BASE_URL } from "@/config";

// Custom tooltip (subject removed)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const attempt = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm text-gray-700">
        <p>
          <span className="font-medium">Test:</span> {attempt.testTitle}
        </p>
        <p>
          <span className="font-medium">Score:</span> {attempt.score}/{attempt.totalMarks}
        </p>
        <p>
          <span className="font-medium">Attempt #:</span> {attempt.attemptNumber}
        </p>
        <p>
          <span className="font-medium">Time Taken:</span> {attempt.totalTimeTaken} mins
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceProgressChart = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    highestScore: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchUserTests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/user/all-test`, {
          withCredentials: true,
        });

        if (res.data?.success && Array.isArray(res.data.attempts)) {
          const data = res.data.attempts.map((attempt, idx) => ({
            ...attempt,
            index: idx + 1,
          }));

          const scores = data.map((a) => a.score || 0);
          const highest = Math.max(...scores);
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

          setStats({
            totalAttempts: data.length,
            highestScore: highest,
            averageScore: avg.toFixed(2),
          });
          setAttempts(data);
        }
      } catch (error) {
        console.error("Error fetching test attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTests();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="w-full bg-white border border-gray-200 rounded-3xl shadow-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-gray-500">Loading performance data...</p>
      </motion.div>
    );
  }

  if (!attempts.length) {
    return (
      <motion.div
        className="w-full bg-white border border-gray-200 rounded-3xl shadow-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-gray-500">No test attempts found.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
    <motion.div
      className="w-full bg-white border border-gray-200 rounded-3xl shadow-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)" }}
    >

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-gray-50 rounded-xl py-4 shadow-sm border">
          <p className="text-lg font-semibold text-gray-800">
            {stats.totalAttempts}
          </p>
          <p className="text-sm text-gray-500">Total Tests Attempted</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-4 shadow-sm border">
          <p className="text-lg font-semibold text-green-600">
            {stats.highestScore}
          </p>
          <p className="text-sm text-gray-500">Highest Score</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-4 shadow-sm border">
          <p className="text-lg font-semibold text-blue-600">
            {stats.averageScore}%
          </p>
          <p className="text-sm text-gray-500">Average Score</p>
        </div>
      </div>

      {/* --- Chart Section --- */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
        📊 Test Performance Overview
      </h3>

      <div className="h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={attempts}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="index"
              tickFormatter={(v) => `#${v}`}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              label={{
                value: "Attempt Number",
                position: "insideBottom",
                offset: 2,
              }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}`}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              label={{
                value: "Score",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />

            <Line
              type="monotone"
              dataKey="score"
              name="Score"
              stroke="#7e22ce"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
    </div>
  );
};

export default PerformanceProgressChart;
