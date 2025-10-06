import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, TrendingUp, Target, CheckCircle2 } from "lucide-react";

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState({
    name: "",
    fatherName: "",
    fatherPhone: "",
    address: "",
    examTarget: "",
    nimcetYear: "",
  });

  const [stats, setStats] = useState({
    totalTopics: 120,
    completedTopics: 0,
    testsAttempted: 0,
    averageScore: 0,
    studyStreak: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([
    { subject: 'Mathematics', completed: 12, total: 45, color: 'bg-blue-500' },
    { subject: 'Computer Fundamentals', completed: 8, total: 35, color: 'bg-green-500' },
    { subject: 'Logical Reasoning', completed: 5, total: 25, color: 'bg-purple-500' },
    { subject: 'English', completed: 3, total: 15, color: 'bg-orange-500' },
  ]);

  useEffect(() => {
    // Fetch user profile from backend
    fetch(`/api/user/profile`)
      .then(res => res.json())
      .then(data => setProfile(data));

    // Load progress & tests from localStorage/mock
    const savedProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const completedCount = Object.values(savedProgress).filter(t => t.completed).length;

    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    const avgScore = testHistory.length > 0
      ? testHistory.reduce((sum, t) => sum + t.score, 0) / testHistory.length
      : 0;

    setStats(prev => ({
      ...prev,
      completedTopics: completedCount,
      testsAttempted: testHistory.length,
      averageScore: avgScore
    }));

    // Mock recent activity
    setRecentActivity([
      { type: 'topic', title: 'Permutation & Combination - Part 1', date: '2 hours ago', status: 'completed' },
      { type: 'test', title: 'Free Test - Mathematics', date: '1 day ago', score: 75 },
      { type: 'topic', title: 'Probability', date: '2 days ago', status: 'in-progress' },
    ]);

    setTestResults(testHistory);
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    }).then(() => alert("Profile saved!"));
  };

  const progressPercentage = (stats.completedTopics / stats.totalTopics) * 100;

  return (
    <div className="min-h-screen pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
     
      <Card className="glass relative overflow-hidden border-0 shadow-2xl backdrop-blur-md">
 
  <div className="absolute inset-0 bg-gradient-to-r from-[#0072CE] via-[#66CCFF] to-[#00BFFF] opacity-10 animate-pulse" />

  <CardHeader className="relative z-10 text-center">
    <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0072CE] to-[#66CCFF] drop-shadow-md">
      Your Profile
    </CardTitle>
    <p className="text-gray-500 mt-1">Keep your information up to date</p>
  </CardHeader>

  {/* Profile Image Upload */}
  <div className="relative z-10 flex flex-col items-center mt-4 mb-6">
    <div className="relative group">
      <img
        src={
          profile.image ||
          "https://cdn-icons-png.flaticon.com/512/847/847969.png"
        }
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-[#66CCFF]/60 shadow-lg"
      />
      <label
        htmlFor="profileImage"
        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
       
      </label>
      <input
        id="profileImage"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            handleProfileChange("image", imageUrl);
          }
        }}
      />
    </div>
  </div>

  <CardContent className="relative z-10 grid md:grid-cols-2 gap-4">
    <Input
      placeholder="Full Name"
      value={profile.name}
      onChange={(e) => handleProfileChange("name", e.target.value)}
    />
    <Input
      placeholder="Father Name"
      value={profile.fatherName}
      onChange={(e) => handleProfileChange("fatherName", e.target.value)}
    />
    <Input
      placeholder="Father Phone"
      value={profile.fatherPhone}
      onChange={(e) => handleProfileChange("fatherPhone", e.target.value)}
    />
    <Input
      placeholder="Address"
      value={profile.address}
      onChange={(e) => handleProfileChange("address", e.target.value)}
    />
    <Input
      placeholder="Target Exam"
      value={profile.examTarget}
      onChange={(e) => handleProfileChange("examTarget", e.target.value)}
    />
    <Input
      placeholder="NIMCET Year"
      value={profile.nimcetYear}
      onChange={(e) => handleProfileChange("nimcetYear", e.target.value)}
    />
    <Button
      className="mt-6 col-span-2 bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white font-semibold hover:opacity-90 hover:shadow-lg transition-all duration-300"
      onClick={saveProfile}
    >
      Save Profile
    </Button>
  </CardContent>
</Card>


      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="pt-6 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.completedTopics}/{stats.totalTopics}</p>
              <p className="text-sm text-muted-foreground">Topics Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="pt-6 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.testsAttempted}</p>
              <p className="text-sm text-muted-foreground">Tests Attempted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="pt-6 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.averageScore.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="pt-6 flex items-center gap-3">
            <Target className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.studyStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className='gradient-hero'>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span>Course Completion</span>
            <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-4" />
          <p className="text-sm text-muted-foreground">
            You've completed {stats.completedTopics} out of {stats.totalTopics} topics.
          </p>
        </CardContent>
      </Card>

      {/* Subject-wise Progress */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className='gradient-hero'>Subject-wise Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectProgress.map((subject, index) => {
            const percentage = (subject.completed / subject.total) * 100;
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{subject.subject}</span>
                  <span className="text-muted-foreground">{subject.completed}/{subject.total}</span>
                </div>
                <Progress value={percentage} className={`h-2 ${subject.color}`} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className='gradient-hero'>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground">No recent activity</p>
          ) : recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded bg-muted/30">
              {activity.type === "topic" ? <BookOpen className="h-5 w-5 text-primary" /> : <Trophy className="h-5 w-5 text-yellow-500" />}
              <div className="flex-1">
                <p>{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              {activity.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {activity.score && <Badge>{activity.score}%</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className='gradient-hero'>Test Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testResults.length === 0 ? (
            <p className="text-muted-foreground">No tests attempted yet.</p>
          ) : (
            testResults.map((test, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded bg-muted/30">
                <span>{test.name}</span>
                <span>{test.score}%</span>
                <Badge variant={test.score >= 50 ? "success" : "destructive"}>
                  {test.score >= 50 ? "Passed" : "Failed"}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className='gradient-hero'>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/library/7">
            <Card className="hover-glow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Continue Learning</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/test/nimcet">
            <Card className="hover-glow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="font-semibold">Take a Test</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/library">
            <Card className="hover-glow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold">Browse Resources</p>
              </CardContent>
            </Card>
          </Link>
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
