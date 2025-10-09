import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const InstructionsPage = ({ questions, instructionsRead, setInstructionsRead, onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-3xl font-bold text-center">Exam Instructions</CardTitle>
            <p className="text-center mt-2 text-blue-100">
              Please read all instructions carefully. The exam will auto-submit when time ends.
            </p>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">Question Status Legend:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Legend color="bg-cyan-400" label="Not Visited" />
                <Legend color="bg-gray-800" label="Not Answered" />
                <Legend color="bg-green-500" label="Answered" />
                <Legend color="bg-pink-500" label="Marked for Review" />
                <Legend color="bg-purple-500" label="Answered & Marked" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-xl text-primary">General Instructions:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Test has a countdown timer and auto-submits at the end.</li>
                <li>Palette shows question status.</li>
                <li>Use navigation buttons to move between questions.</li>
                <li>“Save & Next” saves answer and moves forward.</li>
                <li>“Mark for Review” flags a question for later.</li>
                <li><span className="text-red-600 font-semibold">+4 for correct, -1 for wrong</span>.</li>
              </ul>
            </div>

            <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h3 className="font-bold text-xl text-primary">Exam Info:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <Info label="Total Questions" value={questions.length} />
                <Info label="Duration" value="30 minutes" />
                <Info label="Section" value="Mathematics" />
                <Info label="Max Marks" value={questions.length * 4} />
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
              <Checkbox
                id="instructions"
                checked={instructionsRead}
                onCheckedChange={(checked) => setInstructionsRead(checked)}
                className="mt-1"
              />
              <Label htmlFor="instructions" className="text-sm font-medium cursor-pointer">
                I have read and understood the instructions.
              </Label>
            </div>

            <Button onClick={onStart} className="w-full py-6 text-lg font-semibold" disabled={!instructionsRead}>
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-6 h-6 rounded-full ${color}`}></div>
    <span className="text-sm">{label}</span>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <Badge variant="secondary">{label}</Badge>
    <span className="font-semibold">{value}</span>
  </div>
);

export default InstructionsPage;
