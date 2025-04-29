
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
  const playerContainerId = `youtube-player-${Math.random().toString(36).substring(2, 15)}`;

  useEffect(() => {
    // Load the YouTube API script if not already loaded
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    // Initialize the player when API is ready
    const initializePlayer = () => {
      playerRef.current = new window.YT.Player(playerContainerId, {
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
    };

    loadYouTubeAPI();

    // Check if YT API is loaded
    const checkYTAPI = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYTAPI);
        initializePlayer();
      }
    }, 100);

    // Cleanup function
    return () => {
      clearInterval(checkYTAPI);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime, endTime, onReady, playerContainerId]);

  return <div id={playerContainerId} className="w-full h-full min-h-[300px]"></div>;
};

export default YouTubeEmbed;
