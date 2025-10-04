import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const NoticeBoard = () => {
  const notices = [
    { id: 1, title: "NIMCET 2025 Registration Started" },
    { id: 2, title: "Mock Test Series Schedule Released" },
    { id: 3, title: "CUET-PG Important Dates Released" },
    { id: 4, title: "Library Hours Extended" },
    { id: 5, title: "Guest Lecture on Data Structures" },
    { id: 6, title: "MAH-CET Application Deadline" },
    { id: 7, title: "Result Analysis Workshop" },
    { id: 8, title: "JMI MCA Exam Pattern Updated" },
  ];

  return (
    <Card className="glass sticky top-24 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 gradient-text text-lg">
          <Bell className="h-4 w-4" />
          Notice Board
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-3 pb-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-3 bg-muted/20 rounded-lg border border-border/30 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                  {notice.title}
                </h4>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* View All Button */}
        <div className="p-4 pt-2">
          <Button variant="outline" className="w-full text-sm h-8 hover-glow">
            View All Notices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoticeBoard;
