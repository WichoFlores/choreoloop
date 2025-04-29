
import { CheckCircle, Play, Repeat, TrendingUp } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Play className="h-6 w-6 text-primary" />,
      title: "Break Down Tutorials",
      description: "Split YouTube tutorials into sections for focused practice."
    },
    {
      icon: <Repeat className="h-6 w-6 text-primary" />,
      title: "Smart Repetition",
      description: "Configure custom reps for each dance segment to build muscle memory."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Progressive Speeds",
      description: "Start slow and gradually increase tempo as you master each move."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Track Progress",
      description: "Automatically save your progress and pick up where you left off."
    }
  ];

  return (
    <div className="bg-dance-light py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How ChoreoLoop Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our structured approach helps you learn choreography faster and more effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="dance-card flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
