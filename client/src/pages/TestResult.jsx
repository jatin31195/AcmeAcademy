import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TestResult = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    positiveMarks: 0,
    negativeMarks: 0,
    totalScore: 0,
    percentage: 0,
    rank: 0,
    attemptNo: 1,
    totalAttempts: 859,
    timeSpent: 0,
  });

  useEffect(() => {
    const savedResults = localStorage.getItem("testResults");
    if (!savedResults) {
      navigate("/library");
      return;
    }

    const data = JSON.parse(savedResults);
    setResults(data);

    // Calculate stats
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    data.questions.forEach((q) => {
      const userAnswer = data.answers[q.id];
      if (userAnswer === undefined) unattempted++;
      else if (userAnswer === q.correctAnswer) correct++;
      else incorrect++;
    });

    const positiveMarks = correct * 4;
    const negativeMarks = incorrect * 1;
    const totalScore = positiveMarks - negativeMarks;
    const percentage = (totalScore / (data.questions.length * 4)) * 100;
    const rank = Math.floor(Math.random() * 1000) + 1; // Simulated rank

    setStats({
      correct,
      incorrect,
      unattempted,
      positiveMarks,
      negativeMarks,
      totalScore,
      percentage: Math.max(0, percentage),
      rank,
      attemptNo: 1,
      totalAttempts: 859,
      timeSpent: data.timeSpent || 0,
    });
  }, [navigate]);

  if (!results) return null;

  const getResultColor = () => {
    if (stats.percentage >= 75) return "text-green-500";
    if (stats.percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const toppers = [
    { rank: 1, name: "Pulkit Gupta", attempt: "1st", marks: 100, time: "25m 22s" },
    { rank: 2, name: "Momen", attempt: "1st", marks: 100, time: "26m 31s" },
    { rank: 3, name: "Komal Kumari", attempt: "1st", marks: 96, time: "18m 35s" },
  ];

  const formatTimeSpent = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Performance Analysis Report
          </h1>
          <p className="text-muted-foreground">
            Detailed analysis of your test performance
          </p>
        </div>

        {/* Test Info */}
        <Card className="mb-6 border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl">Test Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Test Name</p>
                <p className="text-xl font-bold">
                  {results.testName || "Trigonometry - T06"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attempt No.</p>
                <p className="text-xl font-bold">{stats.attemptNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submit Date</p>
                <p className="text-xl font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Marks</p>
                <p className="text-xl font-bold">{results.questions.length * 4}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marks Obtained</p>
                <p className={`text-xl font-bold ${getResultColor()}`}>
                  {stats.totalScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className={`text-xl font-bold ${getResultColor()}`}>
                  {stats.percentage.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AIR (Rank)</p>
                <p className="text-xl font-bold text-primary">#{stats.rank}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-xl font-bold">{stats.totalAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toppers */}
        <Card className="mb-6 border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Attempt</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Time Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toppers.map((t) => (
                  <TableRow key={t.rank}>
                    <TableCell>
                      <Badge
                        variant={t.rank === 1 ? "default" : "secondary"}
                      >
                        {t.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{t.name}</TableCell>
                    <TableCell>{t.attempt}</TableCell>
                    <TableCell className="text-green-600 font-bold">
                      {t.marks}
                    </TableCell>
                    <TableCell>{t.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subject-Wise */}
        <Card className="mb-6 border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Subject-Wise Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>No. of Qs</TableHead>
                  <TableHead>Attempted</TableHead>
                  <TableHead>Right</TableHead>
                  <TableHead>Wrong</TableHead>
                  <TableHead>Marks (+)</TableHead>
                  <TableHead>Marks (-)</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Time Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Mathematics</TableCell>
                  <TableCell>{results.questions.length}</TableCell>
                  <TableCell>{Object.keys(results.answers).length}</TableCell>
                  <TableCell className="text-green-600 font-bold">
                    {stats.correct}
                  </TableCell>
                  <TableCell className="text-red-600 font-bold">
                    {stats.incorrect}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {stats.positiveMarks}
                  </TableCell>
                  <TableCell className="text-red-600">
                    -{stats.negativeMarks}
                  </TableCell>
                  <TableCell className="text-primary font-bold">
                    {stats.totalScore}
                  </TableCell>
                  <TableCell>{formatTimeSpent(stats.timeSpent)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="mb-6 border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Accuracy Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Mathematics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Right:</span>
                    <span className="font-bold text-green-600">
                      {stats.correct}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attempted:</span>
                    <span className="font-bold">
                      {Object.keys(results.answers).length}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.correct > 0
                        ? (stats.correct / Object.keys(results.answers).length) *
                          100
                        : 0
                    }
                    className="h-3"
                  />
                  <p className="text-sm text-center font-semibold mt-2">
                    Accuracy:{" "}
                    {stats.correct > 0
                      ? (
                          (stats.correct /
                            Object.keys(results.answers).length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${
                        (stats.correct > 0
                          ? (stats.correct /
                              Object.keys(results.answers).length) *
                            100
                          : 0) * 4.4
                      } 440`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-3xl font-bold">
                      {stats.correct > 0
                        ? (
                            (stats.correct /
                              Object.keys(results.answers).length) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Correct Answers</span>
                <span className="text-green-500">
                  {stats.correct}/{results.questions.length}
                </span>
              </div>
              <Progress
                value={(stats.correct / results.questions.length) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Accuracy Rate</span>
                <span>
                  {stats.correct > 0
                    ? (
                        (stats.correct / (stats.correct + stats.incorrect)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.correct > 0
                    ? (stats.correct / (stats.correct + stats.incorrect)) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Solutions */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle>Detailed Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.questions.map((q, index) => {
              const userAnswer = results.answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              const isUnattempted = userAnswer === undefined;

              return (
                <div key={q.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          Question {index + 1}
                        </span>
                        <Badge variant="outline">{q.subject}</Badge>
                        {isUnattempted ? (
                          <Badge variant="secondary">Not Attempted</Badge>
                        ) : isCorrect ? (
                          <Badge className="bg-green-500">Correct</Badge>
                        ) : (
                          <Badge variant="destructive">Incorrect</Badge>
                        )}
                      </div>
                      <p className="mb-3">{q.question}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = q.correctAnswer === optIndex;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrectAnswer
                              ? "bg-green-500/10 border-green-500"
                              : isUserAnswer
                              ? "bg-red-500/10 border-red-500"
                              : "bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrectAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isUnattempted && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="font-semibold">Your answer: </span>
                        <span
                          className={
                            isCorrect ? "text-green-500" : "text-red-500"
                          }
                        >
                          {q.options[userAnswer]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm">
                          <span className="font-semibold">Correct answer: </span>
                          <span className="text-green-500">
                            {q.options[q.correctAnswer]}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex-1"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => navigate(`/library/${results.topicId || "7"}`)}
            className="flex-1"
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
