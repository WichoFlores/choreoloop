
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { extractYouTubeId, getThumbnailUrl } from "@/services/youtubeService";
import { Routine, VideoSection } from "@/models/types";
import { saveRoutine } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";

// Import the new modular components
import VideoForm, { VideoFormValues } from "@/components/create-routine/VideoForm";
import SectionForm from "@/components/create-routine/SectionForm";
import SectionsContainer from "@/components/create-routine/SectionsContainer";
import VideoPreview from "@/components/create-routine/VideoPreview";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Main state variables
  const [step, setStep] = useState(1);
  const [routineTitle, setRoutineTitle] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<YT.Player | null>(null);
  const [sections, setSections] = useState<VideoSection[]>([]);
  const [currentSection, setCurrentSection] = useState<Partial<VideoSection>>({
    title: "",
    startTime: 0,
    endTime: 30,
    reps: 5,
    currentRep: 0,
    currentSpeed: 0.5,
    completed: false,
  });
  
  // Memoized handlers to prevent unnecessary re-renders
  const handlePlayerReady = useCallback((player: YT.Player) => {
    setVideoPlayer(player);
  }, []);

  const handleVideoSubmit = useCallback((data: VideoFormValues) => {
    const extractedId = extractYouTubeId(data.videoUrl);
    if (extractedId) {
      setVideoId(extractedId);
      setRoutineTitle(data.title);
      setStep(2);
    } else {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Section management handlers
  const handleSectionChange = useCallback((newSection: Partial<VideoSection>) => {
    setCurrentSection(newSection);
  }, []);

  const addOrUpdateSection = useCallback(() => {
    if (!currentSection.title || currentSection.startTime === undefined || currentSection.endTime === undefined) {
      toast({
        title: "Missing information",
        description: "Please fill in all section details",
        variant: "destructive",
      });
      return;
    }

    if (currentSection.startTime >= currentSection.endTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    const newSection: VideoSection = {
      id: currentSection.id || uuidv4(),
      title: currentSection.title || "",
      startTime: currentSection.startTime || 0,
      endTime: currentSection.endTime || 0,
      reps: currentSection.reps || 5,
      currentRep: 0,
      currentSpeed: 0.5,
      completed: false,
    };

    if (currentSection.id) {
      // Update existing section
      setSections(sections.map(section => 
        section.id === currentSection.id ? newSection : section
      ));
    } else {
      // Add new section
      setSections([...sections, newSection]);
    }

    // Reset form with end time of last section as start time of new section
    setCurrentSection({
      title: "",
      startTime: newSection.endTime,
      endTime: newSection.endTime + 30,
      reps: 5,
      currentSpeed: 0.5,
    });
  }, [currentSection, sections, toast]);

  const editSection = useCallback((section: VideoSection) => {
    setCurrentSection(section);
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  }, [sections]);

  // Save routine handler
  const saveAndContinue = useCallback(() => {
    if (sections.length === 0) {
      toast({
        title: "No sections added",
        description: "Please add at least one section to your routine",
        variant: "destructive",
      });
      return;
    }

    if (!videoId) {
      toast({
        title: "Video error",
        description: "There was a problem with the video. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const newRoutine: Routine = {
      id: uuidv4(),
      title: routineTitle,
      videoId: videoId,
      thumbnailUrl: getThumbnailUrl(videoId),
      sections: sections,
      progress: 0,
      lastPracticed: null,
    };

    saveRoutine(newRoutine);
    toast({
      title: "Routine saved!",
      description: "Your new routine has been created successfully",
    });
    navigate("/routines");
  }, [videoId, routineTitle, sections, toast, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Create New Routine</h1>

          {/* Step 1: Enter YouTube URL */}
          {step === 1 && <VideoForm onSubmit={handleVideoSubmit} />}

          {/* Step 2: Define sections */}
          {step === 2 && videoId && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <VideoPreview 
                  videoId={videoId} 
                  onPlayerReady={handlePlayerReady} 
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Define Sections</h2>
                
                <SectionForm
                  currentSection={currentSection}
                  onChange={handleSectionChange}
                  onAddSection={addOrUpdateSection}
                  videoPlayer={videoPlayer}
                />

                <SectionsContainer
                  sections={sections}
                  onEdit={editSection}
                  onDelete={deleteSection}
                  videoPlayer={videoPlayer}
                />

                <div className="mt-6">
                  <Button onClick={saveAndContinue} className="bg-gradient-dance w-full">
                    Save Routine
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateRoutine;
