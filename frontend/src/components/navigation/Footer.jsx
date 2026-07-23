import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="font-bold tracking-tight">JanKalyan</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A premium enterprise SaaS platform for public grievance redressal and transparent governance.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/complaints" className="hover:text-primary transition-colors">Public Board</Link></li>
              <li><Link to="/dashboard/report" className="hover:text-primary transition-colors">Report Issue</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JanKalyan Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
