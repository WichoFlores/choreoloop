
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/services/youtubeService";
import { VideoSection } from "@/models/types";

interface SectionFormProps {
  currentSection: Partial<VideoSection>;
  onChange: (section: Partial<VideoSection>) => void;
  onAddSection: () => void;
  videoPlayer: YT.Player | null;
}

const SectionForm: React.FC<SectionFormProps> = ({
  currentSection,
  onChange,
  onAddSection,
  videoPlayer,
}) => {
  // Set current time as start/end time
  const setCurrentTimeAs = (type: "start" | "end") => {
    if (videoPlayer) {
      const currentTime = videoPlayer.getCurrentTime();
      if (type === "start") {
        onChange({ ...currentSection, startTime: currentTime });
      } else {
        onChange({ ...currentSection, endTime: currentTime });
      }
    }
  };

  return (
    <div className="bg-muted/20 p-4 rounded-lg border mb-6">
      <h3 className="font-medium mb-3">
        {currentSection.id ? "Edit Section" : "Add New Section"}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={currentSection.title || ""}
            onChange={(e) =>
              onChange({ ...currentSection, title: e.target.value })
            }
            placeholder="Section title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={currentSection.startTime || 0}
                onChange={(e) =>
                  onChange({
                    ...currentSection,
                    startTime: parseFloat(e.target.value),
                  })
                }
              />
              <span className="text-sm text-muted-foreground">
                {formatTime(currentSection.startTime || 0)}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={currentSection.endTime || 0}
                onChange={(e) =>
                  onChange({
                    ...currentSection,
                    endTime: parseFloat(e.target.value),
                  })
                }
              />
              <span className="text-sm text-muted-foreground">
                {formatTime(currentSection.endTime || 0)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Repetitions: {currentSection.reps}
          </label>
          <Slider
            value={[currentSection.reps || 5]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) =>
              onChange({ ...currentSection, reps: value[0] })
            }
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentTimeAs("start")}
            className="flex-1"
            type="button"
          >
            Set current time as Start
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentTimeAs("end")}
            className="flex-1"
            type="button"
          >
            Set current time as End
          </Button>
        </div>

        <Button onClick={onAddSection} className="w-full" type="button">
          {currentSection.id ? "Update Section" : "Add Section"}
        </Button>
      </div>
    </div>
  );
};

export default SectionForm;
