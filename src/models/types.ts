
export interface VideoSection {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  completed: boolean;
  currentSpeed: number;
  reps: number;
  currentRep: number;
}

export interface Routine {
  id: string;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  sections: VideoSection[];
  progress: number;
  lastPracticed: Date | null;
}
