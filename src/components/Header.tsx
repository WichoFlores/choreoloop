
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-dance rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <h1 className="text-xl font-bold">
            <span className="gradient-text">Choreo</span>Loop
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/routines" className="text-sm font-medium hover:text-primary transition-colors">
            My Routines
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/create">
            <Button className="bg-gradient-dance hover:opacity-90 transition-opacity">
              Create Routine
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
