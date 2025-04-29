
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-16 py-6">
      <div className="container mx-auto px-4 text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground">
            © {new Date().getFullYear()} QuizMaster. Built with Hostinger Horizons.
          </div>
          <div className="flex space-x-4">
            <Link to="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
            <Link to="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors"><Github size={20} /></Link>
            <Link to="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  