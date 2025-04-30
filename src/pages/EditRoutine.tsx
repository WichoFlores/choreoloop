
import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getThumbnailUrl } from "@/services/youtubeService";
import { VideoSection } from "@/models/types";
import { getRoutine, saveRoutine } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";

// Import components
import VideoForm, { VideoFormValues } from "@/components/create-routine/VideoForm";
import SectionForm from "@/components/create-routine/SectionForm";
import SectionsContainer from "@/components/create-routine/SectionsContainer";
import VideoPreview from "@/components/create-routine/VideoPreview";

const EditRoutine = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();
  const { toast } = useToast();
  
  // Main state variables
  const [step, setStep] = useState(2); // Start at step 2 (editing sections)
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

  // Load routine data
  useEffect(() => {
    if (routineId) {
      const routine = getRoutine(routineId);
      if (routine) {
        setRoutineTitle(routine.title);
        setVideoId(routine.videoId);
        setSections(routine.sections);
        
        // If sections exist, set start time of new section to end time of last section
        if (routine.sections.length > 0) {
          const lastSection = routine.sections[routine.sections.length - 1];
          setCurrentSection(prev => ({
            ...prev,
            startTime: lastSection.endTime,
            endTime: lastSection.endTime + 30
          }));
        }
      } else {
        toast({
          title: "Routine not found",
          description: "The routine you're trying to edit doesn't exist",
          variant: "destructive",
        });
        navigate("/routines");
      }
    }
  }, [routineId, navigate, toast]);
  
  // Memoized handlers to prevent unnecessary re-renders
  const handlePlayerReady = useCallback((player: YT.Player) => {
    setVideoPlayer(player);
  }, []);

  const handleVideoSubmit = useCallback((data: VideoFormValues) => {
    setRoutineTitle(data.title);
    setStep(2);
  }, []);

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
      id: currentSection.id || crypto.randomUUID(),
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
    if (!routineId || !videoId) {
      toast({
        title: "Missing data",
        description: "Unable to save routine due to missing information",
        variant: "destructive",
      });
      return;
    }

    if (sections.length === 0) {
      toast({
        title: "No sections added",
        description: "Please add at least one section to your routine",
        variant: "destructive",
      });
      return;
    }

    const existingRoutine = getRoutine(routineId);
    if (!existingRoutine) {
      toast({
        title: "Routine not found",
        description: "The routine you're trying to edit doesn't exist anymore",
        variant: "destructive",
      });
      return;
    }

    const updatedRoutine = {
      ...existingRoutine,
      title: routineTitle,
      videoId: videoId,
      thumbnailUrl: getThumbnailUrl(videoId),
      sections: sections,
    };

    saveRoutine(updatedRoutine);
    toast({
      title: "Routine updated!",
      description: "Your routine has been updated successfully",
    });
    navigate("/routines");
  }, [routineId, videoId, routineTitle, sections, toast, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Edit Routine</h1>

          {/* Step 1: Edit routine title */}
          {step === 1 && (
            <VideoForm 
              onSubmit={handleVideoSubmit}
              initialValues={{ 
                title: routineTitle, 
                videoUrl: `https://www.youtube.com/watch?v=${videoId}` 
              }}
            />
          )}

          {/* Step 2: Define sections */}
          {step === 2 && videoId && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <VideoPreview 
                  videoId={videoId} 
                  onPlayerReady={handlePlayerReady} 
                />
                <div className="mt-4">
                  <Button onClick={() => setStep(1)} variant="outline" size="sm">
                    Edit title
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">{routineTitle} - Edit Sections</h2>
                
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
                    Save Changes
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

export default EditRoutine;
