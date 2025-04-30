
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Routine, VideoSection } from "@/models/types";
import { getRoutine, saveRoutine } from "@/services/storageService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Pause, SkipForward, SkipBack, Repeat, ArrowLeft } from "lucide-react";
import { formatTime } from "@/services/youtubeService";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Component for the practice page
const PracticePage = () => {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for routine and practice session
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoPlayer, setVideoPlayer] = useState<YT.Player | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Load the routine data
  useEffect(() => {
    if (!routineId) {
      navigate("/routines");
      return;
    }

    const loadedRoutine = getRoutine(routineId);
    if (!loadedRoutine) {
      toast({
        title: "Routine not found",
        description: "The routine you're looking for doesn't exist",
        variant: "destructive",
      });
      navigate("/routines");
      return;
    }

    setRoutine(loadedRoutine);
    setLoading(false);

    // Find the first incomplete section
    const startIndex = loadedRoutine.sections.findIndex(s => !s.completed);
    if (startIndex !== -1) {
      setCurrentSectionIndex(startIndex);
    }
  }, [routineId, navigate, toast]);

  // Get current section
  const currentSection = routine?.sections[currentSectionIndex];

  // Handler for when the YouTube player is ready
  const handlePlayerReady = useCallback((player: YT.Player) => {
    setVideoPlayer(player);
  }, []);

  // Start practice mode for a section
  const startPractice = useCallback(() => {
    if (!videoPlayer || !currentSection) return;
    
    try {
      setIsPracticeMode(true);
      
      // Set playback speed
      videoPlayer.setPlaybackRate(currentSection.currentSpeed);
      
      // Seek to section start
      videoPlayer.seekTo(currentSection.startTime, true);
      
      // Start playing
      videoPlayer.playVideo();
      setIsPlaying(true);
      
      // Setup loop monitoring
      monitorPlayback();
    } catch (error) {
      console.error("Error starting practice:", error);
    }
  }, [videoPlayer, currentSection]);

  // Monitor video playback for looping
  const monitorPlayback = useCallback(() => {
    if (!videoPlayer || !currentSection) return;
    
    const checkPosition = () => {
      try {
        const currentTime = videoPlayer.getCurrentTime();
        
        // If we've reached the end of the section, loop back
        if (currentTime >= currentSection.endTime) {
          // Increment rep count
          setCurrentRep(prev => prev + 1);
          
          // Loop back to start
          videoPlayer.seekTo(currentSection.startTime, true);
          
          // Show feedback controls after completing a rep
          if (currentRep + 1 >= currentSection.reps) {
            // Automatically pause after completing all reps
            videoPlayer.pauseVideo();
            setIsPlaying(false);
            setShowControls(true);
          }
        }
        
        // Continue monitoring if still playing
        if (isPlaying) {
          requestAnimationFrame(checkPosition);
        }
      } catch (error) {
        console.error("Error in playback monitoring:", error);
      }
    };
    
    requestAnimationFrame(checkPosition);
  }, [videoPlayer, currentSection, currentRep, isPlaying]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!videoPlayer) return;
    
    try {
      if (isPlaying) {
        videoPlayer.pauseVideo();
        setIsPlaying(false);
      } else {
        if (!isPracticeMode) {
          startPractice();
        } else {
          videoPlayer.playVideo();
          setIsPlaying(true);
          monitorPlayback();
        }
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  }, [videoPlayer, isPlaying, isPracticeMode, startPractice, monitorPlayback]);

  // Move to next section
  const nextSection = useCallback(() => {
    if (!routine || currentSectionIndex >= routine.sections.length - 1) return;
    
    setCurrentSectionIndex(prev => prev + 1);
    setCurrentRep(0);
    setIsPracticeMode(false);
    setIsPlaying(false);
  }, [routine, currentSectionIndex]);

  // Move to previous section
  const prevSection = useCallback(() => {
    if (currentSectionIndex <= 0) return;
    
    setCurrentSectionIndex(prev => prev - 1);
    setCurrentRep(0);
    setIsPracticeMode(false);
    setIsPlaying(false);
  }, [currentSectionIndex]);

  // Repeat current section
  const repeatSection = useCallback(() => {
    setCurrentRep(0);
    if (videoPlayer && currentSection) {
      try {
        videoPlayer.seekTo(currentSection.startTime, true);
        videoPlayer.playVideo();
        setIsPlaying(true);
        monitorPlayback();
      } catch (error) {
        console.error("Error repeating section:", error);
      }
    }
  }, [videoPlayer, currentSection, monitorPlayback]);

  // Update speed 
  const updateSpeed = useCallback((newSpeed: number) => {
    if (!videoPlayer || !routine || !currentSection) return;
    
    try {
      // Update video playback rate
      videoPlayer.setPlaybackRate(newSpeed);
      
      // Update section in state
      const updatedSections = routine.sections.map((section, idx) => {
        if (idx === currentSectionIndex) {
          return { ...section, currentSpeed: newSpeed };
        }
        return section;
      });
      
      // Update routine state
      setRoutine({
        ...routine,
        sections: updatedSections
      });
      
      // Save to storage
      saveRoutine({
        ...routine,
        sections: updatedSections
      });
    } catch (error) {
      console.error("Error updating speed:", error);
    }
  }, [videoPlayer, routine, currentSection, currentSectionIndex]);

  // Mark section as completed
  const markSectionComplete = useCallback(() => {
    if (!routine) return;
    
    // Update section completion status
    const updatedSections = routine.sections.map((section, idx) => {
      if (idx === currentSectionIndex) {
        return { ...section, completed: true };
      }
      return section;
    });
    
    // Calculate progress percentage
    const completedCount = updatedSections.filter(s => s.completed).length;
    const progressPercent = (completedCount / updatedSections.length) * 100;
    
    // Update routine with new progress
    const updatedRoutine = {
      ...routine,
      sections: updatedSections,
      progress: progressPercent,
      lastPracticed: new Date()
    };
    
    // Update state and storage
    setRoutine(updatedRoutine);
    saveRoutine(updatedRoutine);
    
    // Show success toast
    toast({
      title: "Section completed!",
      description: "Great job! This section is now marked as complete.",
    });
    
    // Move to next section if available
    if (currentSectionIndex < updatedSections.length - 1) {
      nextSection();
    } else {
      // All sections completed
      toast({
        title: "Routine completed!",
        description: "You've completed all sections! Well done!",
      });
    }
  }, [routine, currentSectionIndex, nextSection, toast]);

  // If loading or routine not found
  if (loading || !routine) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading routine...</h1>
            <p>Please wait while we prepare your practice session.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate progress stats
  const completedSections = routine.sections.filter(s => s.completed).length;
  const totalSections = routine.sections.length;
  const progressPercent = (completedSections / totalSections) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{routine.title}</h1>
            <p className="text-muted-foreground">
              Practice Session • {completedSections}/{totalSections} sections mastered
            </p>
          </div>
          <Link to="/routines">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Routines
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="md:col-span-2">
            <div className="relative">
              <YouTubeEmbed 
                videoId={routine.videoId} 
                startTime={currentSection?.startTime || 0}
                endTime={currentSection?.endTime || undefined}
                onReady={handlePlayerReady}
              />
              
              <div className="mt-4">
                <Progress value={progressPercent} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Practice Controls */}
          <div className="bg-background border rounded-lg shadow-sm p-4 md:p-6 md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Current Section</h2>
            
            {currentSection ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium mb-1">{currentSection.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(currentSection.startTime)} - {formatTime(currentSection.endTime)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="completed" 
                      checked={currentSection.completed}
                      onCheckedChange={() => markSectionComplete()}
                    />
                    <label 
                      htmlFor="completed"
                      className="text-sm ml-2 cursor-pointer"
                    >
                      Completed
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Speed:</span>
                    <span className="text-sm font-medium">{currentSection.currentSpeed}x</span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {[0.5, 0.75, 1].map(speed => (
                      <Button 
                        key={speed}
                        size="sm"
                        variant={currentSection.currentSpeed === speed ? "default" : "outline"}
                        className={currentSection.currentSpeed === speed ? "bg-gradient-dance" : ""}
                        onClick={() => updateSpeed(speed)}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Reps:</span>
                    <span className="text-sm font-medium">{currentRep}/{currentSection.reps}</span>
                  </div>
                  <Progress 
                    value={(currentRep / currentSection.reps) * 100} 
                    className="h-2 mb-4" 
                  />
                </div>
                
                <div className="flex justify-center gap-2 mb-6">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={prevSection}
                    disabled={currentSectionIndex <= 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon"
                    variant="default"
                    className="h-12 w-12 rounded-full"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={nextSection}
                    disabled={!routine.sections[currentSectionIndex + 1]}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={repeatSection}
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  className="w-full bg-gradient-dance"
                  disabled={currentRep < currentSection.reps}
                  onClick={markSectionComplete}
                >
                  {currentRep < currentSection.reps 
                    ? `Complete ${currentSection.reps - currentRep} more reps` 
                    : "Mark Section Completed"}
                </Button>
              </>
            ) : (
              <p>No sections available</p>
            )}
          </div>
        </div>
        
        {/* Sections List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">All Sections</h2>
          <div className="grid gap-2">
            {routine.sections.map((section, index) => (
              <div 
                key={section.id}
                className={`p-4 border rounded-md flex justify-between items-center cursor-pointer hover:bg-muted/30 ${
                  index === currentSectionIndex ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setCurrentSectionIndex(index)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{section.title}</h3>
                    {section.completed && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(section.startTime)} - {formatTime(section.endTime)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2">{section.currentSpeed}x</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSectionIndex(index);
                      startPractice();
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PracticePage;
