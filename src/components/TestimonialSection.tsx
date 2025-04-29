
const testimonials = [
  {
    quote: "ChoreoLoop transformed how I practice K-pop routines. I'm finally able to learn full choreographies without getting overwhelmed.",
    name: "Lisa M.",
    title: "K-pop Dance Enthusiast"
  },
  {
    quote: "The progressive speed feature is genius! I can now break down complex hip-hop moves and build up to full speed with confidence.",
    name: "James T.",
    title: "Hip-Hop Dancer"
  },
  {
    quote: "As a dance instructor, I recommend ChoreoLoop to all my students for home practice. It's structured in a way that prevents bad habits.",
    name: "Maya R.",
    title: "Dance Instructor"
  }
];

const TestimonialSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Dancers Say</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of dancers who've revolutionized their practice routine.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="dance-card">
            <div className="mb-4 text-4xl text-primary/20">"</div>
            <p className="mb-6 italic">{testimonial.quote}</p>
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
