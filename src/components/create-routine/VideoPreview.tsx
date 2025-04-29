
import React from "react";
import YouTubeEmbed from "@/components/YouTubeEmbed";

interface VideoPreviewProps {
  videoId: string;
  onPlayerReady: (player: YT.Player) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoId, onPlayerReady }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
      <div className="aspect-video rounded-lg overflow-hidden mb-4">
        <YouTubeEmbed videoId={videoId} onReady={onPlayerReady} />
      </div>
    </div>
  );
};

export default VideoPreview;
