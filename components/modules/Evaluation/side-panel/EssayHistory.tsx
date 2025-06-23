import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { History } from "lucide-react";
import React from "react";

const essaySubmissionHistory = [
  {
    essayId: 1,
    title: "Comparative Analysis: Democracy in Ancient Greece vs Modern Society",
    date: "2 hours ago",
  },
  {
    essayId: 2,
    title: "Impact of Industrial Revolution on Global Economics",
    date: "2 days ago",
  },
  {
    essayId: 3,
    title: "Environmental Challenges in the 21st Century",
    date: "1 week ago",
  },
  {
    essayId: 4,
    title: "The Role of Artificial Intelligence in Modern Healthcare",
    date: "2 weeks ago",
  },
  {
    essayId: 5,
    title: "Cultural Diversity and Globalization in the Digital Age",
    date: "3 weeks ago",
  },
  {
    essayId: 6,
    title: "Sustainable Development Goals: Progress and Challenges",
    date: "1 month ago",
  },
  {
    essayId: 7,
    title: "The Evolution of Social Media and Its Impact on Society",
    date: "1 month ago",
  },
  {
    essayId: 8,
    title: "Climate Change: Mitigation Strategies and Global Cooperation",
    date: "2 months ago",
  },
  {
    essayId: 9,
    title: "The Future of Work: Remote Work and Digital Transformation",
    date: "2 months ago",
  },
  {
    essayId: 10,
    title: "Ethical Implications of Genetic Engineering",
    date: "3 months ago",
  },
  {
    essayId: 11,
    title: "Space Exploration: Current Achievements and Future Prospects",
    date: "3 months ago",
  },
  {
    essayId: 12,
    title: "Mental Health Awareness in the Modern World",
    date: "4 months ago",
  },
  {
    essayId: 13,
    title: "Renewable Energy: Challenges and Opportunities",
    date: "4 months ago",
  },
  {
    essayId: 14,
    title: "The Impact of Technology on Education Systems",
    date: "5 months ago",
  },
  {
    essayId: 15,
    title: "Global Food Security and Sustainable Agriculture",
    date: "6 months ago",
  }
];const EssayHistory = () => {
  return (
    <TabsContent value="history" className="p-3">
      <Label className="text-muted-foreground">Recent Submissions</Label>
      <ScrollArea className="mt-2 pr-4 h-[70vh]">
        {essaySubmissionHistory.map((essay, i) => (
          <div
            key={i}
            className="bg-card text-card-foreground flex flex-col gap-2 rounded-md border p-3 shadow-sm mt-2"
          >
            <h2 className="text-md">{essay.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <History className="h-4 w-4" />
              <span className="text-xs">{essay.date}</span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </TabsContent>
  );
};

export default EssayHistory;
