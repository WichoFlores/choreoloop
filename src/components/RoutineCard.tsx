
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Routine } from "@/models/types";
import { Link } from "react-router-dom";
import { Play, Edit, Calendar } from "lucide-react";
import DeleteRoutineDialog from "./DeleteRoutineDialog";

interface RoutineCardProps {
  routine: Routine;
  onDelete: (id: string) => void;
}

const RoutineCard = ({ routine, onDelete }: RoutineCardProps) => {
  const formattedDate = routine.lastPracticed 
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(routine.lastPracticed))
    : 'Never practiced';

  // Determine progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-dance-pink";
    if (progress < 70) return "bg-dance-blue";
    return "bg-dance-purple";
  };

  // Format progress percentage
  const progressPercentage = Math.round(routine.progress);
    
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-muted/30">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={routine.thumbnailUrl}
          alt={routine.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Link to={`/practice/${routine.id}`}>
            <Button size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full h-14 w-14">
              <Play className="h-6 w-6 text-white" fill="white" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
            {routine.sections.length} sections
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{routine.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>Last practiced: {formattedDate}</span>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <Progress 
            value={routine.progress} 
            className="h-2.5 rounded-full" 
            indicatorClassName={getProgressColor(routine.progress)}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3 border-t border-muted/20">
        <Link to={`/practice/${routine.id}`}>
          <Button className="bg-gradient-dance hover:opacity-90 transition-opacity">
            <Play className="h-4 w-4" />
            Practice
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to={`/edit/${routine.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <DeleteRoutineDialog 
            routineId={routine.id} 
            routineName={routine.title} 
            onDelete={onDelete} 
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoutineCard;
