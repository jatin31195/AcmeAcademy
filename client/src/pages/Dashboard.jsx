import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import UserProfileCard from "@/components/Dashboard/UserProfileCard";
import StatisticsCard from "@/components/Dashboard/StatisticsCard";
import PerformanceAnalyticsChart from "@/components/Dashboard/PerformanceAnalyticsChart";
import PerformanceProgressChart from "@/components/Dashboard/PerformanceProgressChart";
import TestRankingTable from "@/components/Dashboard/TestRankingTable";
import { BASE_URL } from "@/config";
const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        <div className="animate-pulse text-gray-600 text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

      <section className="relative py-8 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        </div>
      </section>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-10">
        <DashboardLayout />

        {/* Profile Card */}
        <div>
          <UserProfileCard />
        </div>

        {/* Statistics */}
        <div>
          <StatisticsCard />
        </div>

       
          <PerformanceAnalyticsChart />
          <PerformanceProgressChart />
   

        {/* Test Ranking Table */}
        <div>
          <TestRankingTable />
        </div>

        
        <div className="h-10" />
      </div>
    </div>
  );
};

export default Dashboard;
