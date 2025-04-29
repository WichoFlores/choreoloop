
import React, { memo } from "react";
import { VideoSection } from "@/models/types";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/services/youtubeService";
import { Edit, Trash, Play } from "lucide-react";

interface SegmentEditorProps {
  section: VideoSection;
  onEdit: (section: VideoSection) => void;
  onDelete: (sectionId: string) => void;
  videoPlayer: YT.Player | null;
}

const SegmentEditor: React.FC<SegmentEditorProps> = memo(({
  section,
  onEdit,
  onDelete,
  videoPlayer
}) => {
  const handlePlaySegment = () => {
    if (videoPlayer) {
      try {
        videoPlayer.seekTo(section.startTime, true);
        videoPlayer.playVideo();
      } catch (error) {
        console.error("Error playing segment:", error);
      }
    }
  };

  return (
    <div className="bg-background border rounded-md p-3 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-medium">{section.title}</h4>
        <div className="text-sm text-muted-foreground">
          <span>
            {formatTime(section.startTime)} - {formatTime(section.endTime)}
          </span>
          <span className="mx-2">•</span>
          <span>{section.reps} reps</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          size="icon" 
          variant="ghost"
          onClick={handlePlaySegment}
          type="button"
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => onEdit(section)}
          type="button"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => onDelete(section.id)}
          type="button"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

SegmentEditor.displayName = 'SegmentEditor';

export default SegmentEditor;
