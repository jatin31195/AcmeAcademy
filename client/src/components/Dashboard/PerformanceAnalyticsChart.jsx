import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { BASE_URL } from "@/config";

const DEFAULT_COLORS = [
  "#10b981", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#ec4899", // pink
  "#6366f1", // indigo
];

const PerformanceAnalyticsChart = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch analytics from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/tests/user/performance/analytics`,
          { withCredentials: true }
        );
        if (res.data?.success && Array.isArray(res.data.analytics)) {
          setAnalytics(res.data.analytics);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 flex justify-center items-center text-gray-500">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!analytics.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 flex justify-center items-center text-gray-500">
          No performance data available
        </div>
      </div>
    );
  }

  // ✅ Transform backend data for Recharts
  const data = analytics.map((item, idx) => ({
    name: item.subject,
    accuracy: Number(item.accuracy.toFixed(2)),
    avgMarksPercent: Number(item.avgMarksPercent.toFixed(2)),
    testsTaken: item.testsTaken,
    value: Number(item.accuracy.toFixed(2)), // for chart
    color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  const total = data.reduce((sum, s) => sum + s.value, 0);
  const withPercentages = data.map((d) => ({
    ...d,
    percentage: total ? Math.round((d.value / total) * 100) : 0,
  }));

  // ✅ Adjust inner/outer radius based on subject count
  const innerRadius = Math.max(50, 40 + data.length * 3);
  const outerRadius = Math.max(70, 60 + data.length * 4);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="bg-white border border-gray-200 rounded-3xl shadow-xl p-4 relative overflow-hidden"
>
  {/* Soft gradient background glow (same as profile card) */}
  <div className="absolute -top-10 -right-10 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-20 -z-10"></div>
  <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>

  <h3 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-8">
    Subject-wise Performance
  </h3>


  <div
    className={`flex flex-col ${
      withPercentages.length > 1 ? "lg:flex-row justify-between" : "items-center"
    } gap-6`}
  >
  
    <div
      className={`${
        withPercentages.length > 1 ? "flex-1" : "w-full max-w-xs"
      } h-44 flex justify-center`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={withPercentages}
            cx="50%"
            cy="50%"
            innerRadius={35}
outerRadius={60}

            dataKey="value"
            nameKey="name"
            paddingAngle={3}
          >
            {withPercentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value}% accuracy`,
              props.payload.name,
            ]}
          />
          <Legend verticalAlign="bottom" align="center" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Subject Stats Section */}
    <div
      className={`grid gap-4 w-full ${
        withPercentages.length === 1
          ? "max-w-sm grid-cols-1 mt-4"
          : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {withPercentages.map((subject) => (
        <motion.div
          key={subject.name}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl shadow-inner text-center"
          style={{ borderTop: `3px solid ${subject.color}` }}
        >
          

          <span
            className="text-xl sm:text-2xl font-bold"
            style={{ color: subject.color }}
          >
            {subject.accuracy.toFixed(1)}%
          </span>

          <div className="mt-1 text-xs text-gray-600">
            Avg Marks:{" "}
            <span className="font-semibold text-gray-800">
              {subject.avgMarksPercent.toFixed(1)}%
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Tests Taken: {subject.testsTaken}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>

    </div>
  );
};

export default PerformanceAnalyticsChart;
