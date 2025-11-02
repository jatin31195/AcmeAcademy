import React from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, Building2 } from "lucide-react";
import { useUser } from "@/UserContext";

const StatBox = ({ icon: Icon, count, label, iconBg, iconColor }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow"
  >
    <div
      className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center mb-4 shadow-inner`}
    >
      <Icon className={`h-7 w-7 ${iconColor}`} />
    </div>
    <span className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-1">
      {count ?? "-"}
    </span>
    <span className="text-sm font-semibold text-gray-500 text-center">
      {label}
    </span>
  </motion.div>
);

const StatisticsCard = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 animate-pulse">
        Loading your stats...
      </div>
    );
  }

  const totalTests = user?.testAttempts?.length || 0;
  const highestRank = user?.highestRank || "—";
  const preferredInstitute = user?.preferredInstitute || "Not set";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-3xl shadow-xl p-5 relative overflow-hidden"
      >
        {/* Gradient Orbs for subtle background like profile card */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Your Performance Stats
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatBox
            icon={CheckCircle}
            count={totalTests}
            label="Total Tests Solved"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatBox
            icon={Trophy}
            count={highestRank}
            label="Highest Rank"
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatBox
            icon={Building2}
            count={preferredInstitute}
            label="Preferred Institute"
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default StatisticsCard;
