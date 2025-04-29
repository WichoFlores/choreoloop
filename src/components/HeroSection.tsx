
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Master dance routines <span className="gradient-text">like a workout</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform YouTube tutorials into structured practice sessions with smart repetition,
            progressive speed control, and progress tracking.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link to="/create">
              <Button size="lg" className="bg-gradient-dance hover:opacity-90 transition-opacity">
                Start Your First Routine
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-dance rounded-xl blur-xl opacity-30 animate-pulse-gentle"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="aspect-video rounded-t-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Dancer practicing" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Le Sserafim - "Crazy" Routine</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-muted-foreground">Progress: 45%</span>
                </div>
                <span className="text-sm text-muted-foreground">5 sections • 5 reps each</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
