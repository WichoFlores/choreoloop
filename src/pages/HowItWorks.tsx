
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Find Your Tutorial",
    description: "Start with any YouTube dance tutorial. Simply copy the URL and paste it into ChoreoLoop.",
    image: "https://images.unsplash.com/photo-1576525865260-9f0e7cfb02b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Break It Down",
    description: "Mark start and end points to create manageable sections of the choreography.",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Set Your Reps",
    description: "Configure how many repetitions you need for each section to build muscle memory.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Control Your Speed",
    description: "Start slow and progressively increase to full tempo as you master each section.",
    image: "https://images.unsplash.com/photo-1535571393765-91bb88a5f07e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Track Progress",
    description: "ChoreoLoop saves your progress so you can pick up where you left off in your next session.",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">How ChoreoLoop Works</h1>
            <p className="text-xl text-muted-foreground">
              Our step-by-step approach transforms how you learn choreography, making practice efficient and effective.
            </p>
          </div>
          
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-dance rounded-xl blur-md opacity-20"></div>
                      <div className="relative rounded-xl overflow-hidden">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                      <ul className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                            <span className="text-sm">
                              {index === 0 && item === 1 && "Works with any YouTube dance tutorial"}
                              {index === 0 && item === 2 && "No need to download videos"}
                              {index === 0 && item === 3 && "Quick setup in just a few clicks"}
                              
                              {index === 1 && item === 1 && "Create as many sections as you need"}
                              {index === 1 && item === 2 && "Precise timestamp selection"}
                              {index === 1 && item === 3 && "Add custom names for each section"}
                              
                              {index === 2 && item === 1 && "Customize reps for different difficulty levels"}
                              {index === 2 && item === 2 && "Auto-repeat sections for hands-free practice"}
                              {index === 2 && item === 3 && "Track completion as you go"}
                              
                              {index === 3 && item === 1 && "Start at 50%, 75%, or custom speed"}
                              {index === 3 && item === 2 && "Progressive speed increases"}
                              {index === 3 && item === 3 && "Master moves before going full speed"}
                              
                              {index === 4 && item === 1 && "Visual progress bars for each routine"}
                              {index === 4 && item === 2 && "Practice history tracking"}
                              {index === 4 && item === 3 && "Pick up exactly where you left off"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                      <ul className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                            <span className="text-sm">
                              {index === 0 && item === 1 && "Works with any YouTube dance tutorial"}
                              {index === 0 && item === 2 && "No need to download videos"}
                              {index === 0 && item === 3 && "Quick setup in just a few clicks"}
                              
                              {index === 1 && item === 1 && "Create as many sections as you need"}
                              {index === 1 && item === 2 && "Precise timestamp selection"}
                              {index === 1 && item === 3 && "Add custom names for each section"}
                              
                              {index === 2 && item === 1 && "Customize reps for different difficulty levels"}
                              {index === 2 && item === 2 && "Auto-repeat sections for hands-free practice"}
                              {index === 2 && item === 3 && "Track completion as you go"}
                              
                              {index === 3 && item === 1 && "Start at 50%, 75%, or custom speed"}
                              {index === 3 && item === 2 && "Progressive speed increases"}
                              {index === 3 && item === 3 && "Master moves before going full speed"}
                              
                              {index === 4 && item === 1 && "Visual progress bars for each routine"}
                              {index === 4 && item === 2 && "Practice history tracking"}
                              {index === 4 && item === 3 && "Pick up exactly where you left off"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-dance rounded-xl blur-md opacity-20"></div>
                      <div className="relative rounded-xl overflow-hidden">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
