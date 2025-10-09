import { Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const TimerHeader = ({ timeLeft, formatTime }) => (
  <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
    <h1 className="text-xl font-bold">Trigonometry - T06</h1>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <span className={`text-lg font-semibold ${timeLeft < 300 ? "text-red-300" : ""}`}>
          Time: {formatTime(timeLeft)}
        </span>
      </div>
      <Button variant="secondary" size="sm" className="flex items-center gap-2">
        <FileText className="h-4 w-4" /> Question Paper
      </Button>
    </div>
  </div>
);

export default TimerHeader;
