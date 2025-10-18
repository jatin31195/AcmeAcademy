import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const InstructionsPage = ({ test, instructionsRead, setInstructionsRead, onStart }) => {
  const [step, setStep] = useState(1);
  
  if (!test || !test.questions) 
  return <div className="p-10 text-center">Loading test info...</div>;


 const totalQuestions = test?.questions?.length || 0;
const totalSections = test?.sections?.length || 0;


  const handleStart = () => {
    // Trigger fullscreen (must be in user click)
    document.documentElement.requestFullscreen().catch(() => {});

    // Start the test
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <Card className="border-2 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Exam Instructions</CardTitle>
            <p className="text-center mt-1 text-sm sm:text-base text-blue-100">
              Please read all instructions carefully. The exam will auto-submit when time ends.
            </p>
          </CardHeader>

          <CardContent className="pt-4 px-4 max-h-[calc(100vh-160px)] overflow-y-auto space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                {/* Legend */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Question Status Legend:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <Legend color="bg-cyan-400" label="Not Visited" />
                    <Legend color="bg-gray-800" label="Not Answered" />
                    <Legend color="bg-green-500" label="Answered" />
                    <Legend color="bg-pink-500" label="Marked for Review" />
                    <Legend color="bg-purple-500" label="Answered & Marked" />
                  </div>
                </div>

                {/* General Instructions */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg sm:text-xl text-primary">General Instructions:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground">
                    <li>Test has a countdown timer and auto-submits at the end.</li>
                    <li>Palette shows question status.</li>
                    <li>Use navigation buttons to move between questions.</li>
                    <li>“Save & Next” saves answer and moves forward.</li>
                    <li>“Mark for Review” flags a question for later.</li>
                    <li>
                      <span className="text-red-600 font-semibold">
                        +{test.sections[0].marks} for correct, -{test.sections[0].negativeMarks} for wrong
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Checkbox */}
                <div className="flex items-start space-x-2 sm:space-x-3 bg-amber-50 p-3 rounded-lg border-2 border-amber-200">
                  <Checkbox
                    id="instructions"
                    checked={instructionsRead}
                    onCheckedChange={(checked) => setInstructionsRead(checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="instructions" className="text-sm sm:text-base font-medium cursor-pointer">
                    I have read and understood the instructions.
                  </Label>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full py-4 sm:py-5 text-base sm:text-lg font-semibold"
                  disabled={!instructionsRead}
                >
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* Exam Info */}
                <div className="space-y-2 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <h3 className="font-bold text-lg sm:text-xl text-primary">Exam Info:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base">
                    <Info label="Total Questions" value={totalQuestions} />
                    <Info label="Duration (minutes)" value={test.durationMinutes} />
                    <Info label="Section" value={test.sections.map(s => s.title).join(", ")} />
                    <Info label="Max Marks" value={totalQuestions * test.sections[0].marks} />
                  </div>
                </div>

                <Button
                  onClick={handleStart}
                  className="w-full py-4 sm:py-5 text-base sm:text-lg font-semibold"
                  disabled={!instructionsRead}
                >
                  Start Test
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2 text-sm sm:text-base">
    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${color}`}></div>
    <span>{label}</span>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex items-center gap-2 text-sm sm:text-base">
    <Badge variant="secondary" className="text-xs sm:text-sm">{label}</Badge>
    <span className="font-semibold">{value}</span>
  </div>
);

export default InstructionsPage;
