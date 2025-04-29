
import React, { useRef, useEffect, useState } from 'react';

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
  // Use a stable ID that doesn't change on re-renders
  const [playerContainerId] = useState(`youtube-player-${Math.random().toString(36).substring(2, 15)}`);
  
  useEffect(() => {
    let isMounted = true;
    
    // Load the YouTube API script if not already loaded
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }
        
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        
        // Create callback for when API is ready
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
        
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      });
    };

    // Initialize the player when API is ready
    const initializePlayer = async () => {
      await loadYouTubeAPI();
      
      // Make sure component is still mounted
      if (!isMounted) return;
      
      // Check if container exists in the DOM
      const container = document.getElementById(playerContainerId);
      if (!container) return;
      
      // Create player only if it doesn't exist yet
      if (!playerRef.current) {
        try {
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
                if (onReady && isMounted) {
                  onReady(event.target);
                }
              },
            },
          });
        } catch (error) {
          console.error("Error initializing YouTube player:", error);
        }
      }
    };

    initializePlayer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying YouTube player:", error);
        }
        playerRef.current = null;
      }
    };
  }, [videoId, startTime, endTime, onReady, playerContainerId]);

  return <div id={playerContainerId} className="w-full h-full min-h-[300px]"></div>;
};

export default YouTubeEmbed;
