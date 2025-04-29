
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">About ChoreoLoop</h1>
            
            <div className="prose prose-lg mx-auto">
              <p>
                ChoreoLoop was born from a simple frustration: learning dance from YouTube tutorials
                is incredibly inefficient. Dancers spend more time rewinding and fast-forwarding than
                actually dancing.
              </p>
              
              <p>
                As dancers ourselves, we noticed that while fitness apps have structured workouts with
                sets, reps, and progressive overload, nothing similar existed for dance practice. We
                wanted to bring that same structure and methodology to choreography learning.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                We're on a mission to transform how people learn dance routines. By applying proven
                learning principles to dance practice, we're helping dancers of all levels master
                choreography more efficiently and effectively.
              </p>
              
              <h2>Core Principles</h2>
              <ol>
                <li>
                  <strong>Structured Practice</strong>: Breaking down complex routines into manageable sections.
                </li>
                <li>
                  <strong>Deliberate Repetition</strong>: Strategic repetition to build muscle memory.
                </li>
                <li>
                  <strong>Progressive Challenge</strong>: Gradually increasing difficulty as skills improve.
                </li>
                <li>
                  <strong>Tracked Progress</strong>: Measuring improvement to maintain motivation.
                </li>
              </ol>
              
              <h2>Who It's For</h2>
              <p>
                ChoreoLoop is designed for:
              </p>
              <ul>
                <li>K-pop dance cover enthusiasts</li>
                <li>Hip-hop dancers learning routines</li>
                <li>Ballet, contemporary, and jazz students practicing between classes</li>
                <li>Dance instructors creating structured practice plans for students</li>
                <li>Anyone learning choreography from online tutorials</li>
              </ul>
              
              <p>
                Whether you're just starting out or you've been dancing for years, ChoreoLoop helps
                you practice smarter, not harder.
              </p>
              
              <p className="text-center italic">
                "Dance is the hidden language of the soul." - Martha Graham
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
