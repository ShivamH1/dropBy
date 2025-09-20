import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">DropBy</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/60 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/user/login" className="text-foreground/60 hover:text-foreground transition-colors">
            User Login
          </Link>
          <Link to="/captain/login" className="text-foreground/60 hover:text-foreground transition-colors">
            Captain Login
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/user/login">Login</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link to="/user/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;