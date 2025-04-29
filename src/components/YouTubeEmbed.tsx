
import React, { useRef, useEffect, useState, memo } from 'react';

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

// Track if API is being loaded or already loaded
let apiLoadingPromise: Promise<void> | null = null;

// Function to load YouTube API once
const loadYouTubeAPI = () => {
  if (!apiLoadingPromise) {
    apiLoadingPromise = new Promise<void>((resolve) => {
      // Set global callback
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };

      // Load API script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    });
  }
  return apiLoadingPromise;
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = memo(({ 
  videoId, 
  startTime = 0, 
  endTime, 
  onReady 
}) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use a stable ID based on videoId
  const playerId = `youtube-player-${videoId}`;
  
  // Track API loading state
  const [apiReady, setApiReady] = useState<boolean>(
    window.YT && window.YT.Player ? true : false
  );
  
  // Load YouTube API once
  useEffect(() => {
    if (!apiReady) {
      loadYouTubeAPI().then(() => {
        setApiReady(true);
      });
    }
  }, [apiReady]);

  // Initialize player when API is ready and videoId exists
  useEffect(() => {
    // Only proceed if API is ready, container exists, and we have a videoId
    if (!apiReady || !containerRef.current || !videoId) {
      return;
    }
    
    // Clean up function to properly dispose player
    const cleanup = () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying previous player:", error);
        }
        playerRef.current = null;
      }
    };
    
    // Don't recreate if player exists and is for the same video
    if (playerRef.current) {
      const currentVideoId = playerRef.current.getVideoData()?.video_id;
      if (currentVideoId === videoId) {
        return; // Same video, don't recreate
      } else {
        cleanup(); // Different video, destroy old player
      }
    }
    
    // Create container if needed
    let playerContainer = document.getElementById(playerId);
    if (!playerContainer) {
      playerContainer = document.createElement('div');
      playerContainer.id = playerId;
      containerRef.current.innerHTML = ''; // Clear previous content
      containerRef.current.appendChild(playerContainer);
    }
    
    // Create player
    try {
      playerRef.current = new window.YT.Player(playerId, {
        videoId: videoId,
        playerVars: {
          start: Math.floor(startTime),
          end: endTime ? Math.floor(endTime) : undefined,
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
    
    // Clean up on unmount or when videoId changes
    return cleanup;
  }, [apiReady, videoId, startTime, endTime, onReady, playerId]);

  return (
    <div 
      ref={containerRef} 
      id={`container-${playerId}`}
      className="w-full h-full min-h-[300px]"
      data-testid="youtube-embed"
    />
  );
});

YouTubeEmbed.displayName = 'YouTubeEmbed';

export default YouTubeEmbed;
