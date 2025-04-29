
import React from "react";
import { VideoSection } from "@/models/types";
import SegmentEditor from "@/components/SegmentEditor";

interface SectionsContainerProps {
  sections: VideoSection[];
  onEdit: (section: VideoSection) => void;
  onDelete: (sectionId: string) => void;
  videoPlayer: YT.Player | null;
}

const SectionsContainer: React.FC<SectionsContainerProps> = ({
  sections,
  onEdit,
  onDelete,
  videoPlayer,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Added Sections ({sections.length})</h3>

      {sections.length > 0 ? (
        <div className="space-y-3">
          {sections.map((section) => (
            <SegmentEditor
              key={section.id}
              section={section}
              onEdit={onEdit}
              onDelete={onDelete}
              videoPlayer={videoPlayer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No sections added yet</p>
        </div>
      )}
    </div>
  );
};

export default SectionsContainer;
