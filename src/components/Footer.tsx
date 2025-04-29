
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-dance rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <h1 className="text-xl font-bold">
                <span className="gradient-text">Choreo</span>Loop
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transform dance practice into structured, effective training sessions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-sm hover:text-primary">Video Sections</Link></li>
              <li><Link to="/how-it-works" className="text-sm hover:text-primary">Repetition Settings</Link></li>
              <li><Link to="/how-it-works" className="text-sm hover:text-primary">Speed Control</Link></li>
              <li><Link to="/how-it-works" className="text-sm hover:text-primary">Progress Tracking</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-primary">About Us</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-primary">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-primary">Contact</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ChoreoLoop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
