
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { 
  extractYouTubeId, 
  getThumbnailUrl, 
  formatTime 
} from "@/services/youtubeService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Routine, VideoSection } from "@/models/types";
import { saveRoutine } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import SegmentEditor from "@/components/SegmentEditor";

// Form validation schema
const formSchema = z.object({
  videoUrl: z.string().min(1, "Video URL is required"),
  title: z.string().min(1, "Routine title is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateRoutine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<YT.Player | null>(null);
  const [sections, setSections] = useState<VideoSection[]>([]);
  const [currentSection, setCurrentSection] = useState<Partial<VideoSection>>({
    title: "",
    startTime: 0,
    endTime: 0,
    reps: 5,
    currentRep: 0,
    currentSpeed: 0.5,
    completed: false,
  });

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
    },
  });

  // Handle video URL submission
  const onSubmitUrl = (data: FormValues) => {
    const extractedId = extractYouTubeId(data.videoUrl);
    if (extractedId) {
      setVideoId(extractedId);
      setStep(2);
    } else {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
    }
  };

  // Handle player ready
  const handlePlayerReady = (player: YT.Player) => {
    setVideoPlayer(player);
  };

  // Add section to routine
  const addSection = () => {
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
      id: uuidv4(),
      title: currentSection.title || "",
      startTime: currentSection.startTime || 0,
      endTime: currentSection.endTime || 0,
      reps: currentSection.reps || 5,
      currentRep: 0,
      currentSpeed: 0.5,
      completed: false,
    };

    setSections([...sections, newSection]);
    setCurrentSection({
      title: "",
      startTime: currentSection.endTime,
      endTime: currentSection.endTime ? currentSection.endTime + 30 : 30,
      reps: 5,
      currentSpeed: 0.5,
    });
  };

  // Edit existing section
  const editSection = (section: VideoSection) => {
    setCurrentSection(section);
    const updatedSections = sections.filter((s) => s.id !== section.id);
    setSections(updatedSections);
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter((section) => section.id !== sectionId);
    setSections(updatedSections);
  };

  // Set current time as start/end time
  const setCurrentTimeAs = (type: "start" | "end") => {
    if (videoPlayer) {
      const currentTime = videoPlayer.getCurrentTime();
      if (type === "start") {
        setCurrentSection({ ...currentSection, startTime: currentTime });
      } else {
        setCurrentSection({ ...currentSection, endTime: currentTime });
      }
    }
  };

  // Save routine
  const saveAndContinue = () => {
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
      title: form.getValues("title"),
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Create New Routine</h1>

          {/* Step 1: Enter YouTube URL */}
          {step === 1 && (
            <div className="max-w-xl mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitUrl)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routine Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Dance Routine" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-gradient-dance w-full">Continue</Button>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Define sections */}
          {step === 2 && videoId && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <YouTubeEmbed
                    videoId={videoId}
                    onReady={handlePlayerReady}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Current Time Controls</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentTimeAs("start")}
                        className="flex-1"
                      >
                        Set current time as Start
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentTimeAs("end")}
                        className="flex-1"
                      >
                        Set current time as End
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Define Sections</h2>
                
                <div className="bg-muted/20 p-4 rounded-lg border mb-6">
                  <h3 className="font-medium mb-3">Add New Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={currentSection.title || ""}
                        onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
                        placeholder="Section title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={currentSection.startTime || 0}
                            onChange={(e) => setCurrentSection({ 
                              ...currentSection, 
                              startTime: parseFloat(e.target.value) 
                            })}
                          />
                          <span className="text-sm text-muted-foreground">
                            {formatTime(currentSection.startTime || 0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={currentSection.endTime || 0}
                            onChange={(e) => setCurrentSection({ 
                              ...currentSection, 
                              endTime: parseFloat(e.target.value) 
                            })}
                          />
                          <span className="text-sm text-muted-foreground">
                            {formatTime(currentSection.endTime || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Repetitions: {currentSection.reps}</label>
                      <Slider
                        value={[currentSection.reps || 5]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setCurrentSection({ ...currentSection, reps: value[0] })}
                      />
                    </div>
                    
                    <Button onClick={addSection} className="w-full">
                      {currentSection.id ? "Update Section" : "Add Section"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium mb-2">Added Sections ({sections.length})</h3>
                  
                  {sections.length > 0 ? (
                    <div className="space-y-3">
                      {sections.map((section) => (
                        <SegmentEditor 
                          key={section.id} 
                          section={section} 
                          onEdit={editSection} 
                          onDelete={deleteSection}
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
