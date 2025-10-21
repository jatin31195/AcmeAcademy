import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstructionsPage = ({
  test,
  instructionsRead,
  setInstructionsRead,
  onStart,
  username,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!test)
    return <div className="p-10 text-center">Loading test info...</div>;

  const totalQuestions = test?.totalQuestions || 0;
  const totalMarks = test?.totalMarks || 0;
  const totalDuration = test?.totalDurationMinutes || 0;

  const handleStart = () => {
    document.documentElement.requestFullscreen().catch(() => {});
    onStart();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">
          {test?.title || "Untitled Test"} | {test?.examCode || "ACME Practice Test"}
        </h1>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        <div className="flex-1 p-8">
          <div className="max-w-3xl">
            {/* Step 1 – General Instructions */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6">General Instructions</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  {[
                    "This is a timed test; the running time is displayed on the top left corner of the screen.",
                    "The bar above the question text displays question numbers. You can move to any question by clicking its number.",
                    "Each question shows its number, text, and respective options.",
                    "You can mark questions for review and revisit them later.",
                    "Clicking an option selects or deselects it.",
                    "Bottom-left: move to previous question.",
                    "Bottom-right: move to next question.",
                    "You can jump between sections (if allowed) using the bottom dropdown.",
                    "You can submit the test anytime using the Submit button on the top-right.",
                    "Before submission, a confirmation popup shows total, answered, and reviewed questions.",
                    "Test must be completed in one attempt. Once submitted, it cannot be reattempted.",
                    "Do not close or change the test screen while attempting.",
                    "If the app is closed or screen is changed more than three times, the test auto-submits.",
                    "After completion, a summary screen appears with section details & solutions.",
                    "If something goes wrong, contact your tutor immediately.",
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-gray-400 font-bold">●</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-start space-x-3 bg-amber-50 p-4 rounded-lg border-2 border-amber-200 max-w-xl">
                  <Checkbox
                    id="instructions"
                    checked={instructionsRead}
                    onCheckedChange={(checked) => setInstructionsRead(checked)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="instructions"
                    className="text-sm font-medium cursor-pointer"
                  >
                    I have read and understood the instructions.
                  </Label>
                </div>
              </>
            )}

            {/* Step 2 – Test Summary */}
            {step === 2 && (
              <>
                <div className="flex items-center gap-6 mb-8 text-sm">
                  <span>
                    📋 <strong>{totalQuestions}</strong> Question(s)
                  </span>
                  <span>
                    ⏱️ <strong>{totalDuration}</strong> minutes
                  </span>
                  <span>
                    ⭐ <strong>{totalMarks}</strong> marks
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-6">Test Sections</h2>

                {test.sections?.map((section, idx) => (
                  <div
                    key={section._id || idx}
                    className="border rounded-lg p-6 mb-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          {section.title}
                        </h3>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>⏱️ {section.numQuestions || 0} Questions</span>
                          <span>💯 {(section.marksPerQuestion || 0) * (section.numQuestions || 0)} Marks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                  <Checkbox
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked)}
                    className="mt-1"
                  />
                  <label
                    className="text-sm text-gray-700 cursor-pointer"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                  >
                    I have read and understood the instructions. I agree that in
                    case of not adhering to the instructions, I shall be liable
                    to be debarred from this test and/or disciplinary action,
                    which may include a ban from future tests.
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-gray-50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg">
              {username?.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold">{username}</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t px-8 py-4 flex justify-between">
        {step === 2 ? (
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="px-8 border-cyan-500 text-cyan-500 hover:bg-cyan-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        ) : (
          <div />
        )}

        {step === 1 ? (
          <Button
            onClick={() => setStep(2)}
            disabled={!instructionsRead}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleStart}
            disabled={!agreedToTerms}
            className="bg-green-500 hover:bg-green-600 text-white px-8"
          >
            Attempt Test <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default InstructionsPage;
