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
  const containerRef = useRef<HTMLDivElement>(null);
  // Generate a stable ID once when component mounts
  const [playerId] = useState(`youtube-player-${Math.random().toString(36).substring(2, 15)}`);
  
  // Keep track of API loading state
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);

  // Load YouTube API only once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiLoaded(true);
      return;
    }

    // Only set up the global callback if it hasn't been set up yet
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };
      
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize player after API is loaded and when videoId changes
  useEffect(() => {
    // Don't try to initialize if API isn't loaded yet or container isn't available
    if (!apiLoaded || !containerRef.current) return;
    
    // Clean up any existing player before creating a new one
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
      } catch (error) {
        console.error("Error destroying previous player:", error);
      }
    }
    
    // Create a div for the player if it doesn't exist
    let playerElement = document.getElementById(playerId);
    if (!playerElement) {
      playerElement = document.createElement('div');
      playerElement.id = playerId;
      containerRef.current.appendChild(playerElement);
    }

    // Create new player
    try {
      playerRef.current = new window.YT.Player(playerId, {
        videoId: videoId,
        playerVars: {
          start: startTime,
          end: endTime,
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (onReady) {
              onReady(event.target);
            }
          },
        },
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }

    // Cleanup function
    return () => {
      // We don't destroy the player here as it causes flashing
      // The player will be cleaned up before creating a new one or when unmounting
    };
  }, [apiLoaded, videoId, startTime, endTime, onReady, playerId]);

  // Final cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying YouTube player on unmount:", error);
        }
        playerRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />;
};

export default YouTubeEmbed;
