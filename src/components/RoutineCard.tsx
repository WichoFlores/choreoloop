
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Routine } from "@/models/types";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface RoutineCardProps {
  routine: Routine;
}

const RoutineCard = ({ routine }: RoutineCardProps) => {
  const formattedDate = routine.lastPracticed 
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(routine.lastPracticed))
    : 'Never practiced';
    
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={routine.thumbnailUrl}
          alt={routine.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Link to={`/practice/${routine.id}`}>
            <Button size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full h-14 w-14">
              <Play className="h-6 w-6 text-white" fill="white" />
            </Button>
          </Link>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{routine.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{routine.sections.length} sections</span>
          <span>Last practiced: {formattedDate}</span>
        </div>
        <Progress value={routine.progress} className="h-2" />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Link to={`/practice/${routine.id}`}>
          <Button variant="outline" size="sm">Practice</Button>
        </Link>
        <Link to={`/edit/${routine.id}`}>
          <Button variant="ghost" size="sm">Edit</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RoutineCard;
