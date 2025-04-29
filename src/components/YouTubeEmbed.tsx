
import React, { useRef, useEffect } from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  onReady?: (player: YT.Player) => void;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, startTime = 0, endTime, onReady }) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the YouTube API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // This function will be called when the YouTube API is ready
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      // If the API is already loaded, initialize the player directly
      initializePlayer();
    }

    function initializePlayer() {
      if (containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            start: startTime,
            end: endTime,
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              if (onReady) {
                onReady(event.target);
              }
            },
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime, endTime, onReady]);

  return <div ref={containerRef} className="youtube-container"></div>;
};

export default YouTubeEmbed;
