
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogIn, LogOut, ClipboardEdit, Home, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(checkAuth());

    // Listen to storage changes to update auth state across tabs/windows
    const handleStorageChange = () => {
        setIsAuthenticated(checkAuth());
    };
    window.addEventListener('storage', handleStorageChange);

    // Check on navigation change too
    setIsAuthenticated(checkAuth());

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); // Re-check auth state on location change


  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser'); // Also remove user email if stored
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate('/'); // Redirect to home after logout
    // Force reload might not be needed if state updates correctly
    // window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md shadow-md border-b"
      >
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity duration-300">
            <ClipboardEdit size={32} className="transform hover:rotate-[-10deg] transition-transform" />
            <span className="text-2xl font-bold tracking-tight">QuizMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Home size={18} />}>Home</NavLink>
            {isAuthenticated && <NavLink to="/create" icon={<ClipboardEdit size={18} />}>Create Quiz</NavLink>}
            <NavLink to="/leaderboard" icon={<BarChart3 size={18} />}>Leaderboard</NavLink>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
             {isAuthenticated ? (
               <>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                  <Button variant="ghost" size="icon">
                     <User />
                  </Button>
               </>
            ) : (
              <Button variant="default" onClick={() => navigate('/auth')}>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
         {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden absolute top-[65px] left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg z-40 border-b overflow-hidden"
            >
               <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                    <NavLink to="/" onClick={closeMobileMenu} icon={<Home size={18} />}>Home</NavLink>
                    {isAuthenticated && <NavLink to="/create" onClick={closeMobileMenu} icon={<ClipboardEdit size={18} />}>Create Quiz</NavLink>}
                    <NavLink to="/leaderboard" onClick={closeMobileMenu} icon={<BarChart3 size={18} />}>Leaderboard</NavLink>
                    <hr className="border-border" />
                    {isAuthenticated ? (
                       <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                       </Button>
                    ) : (
                      <Button variant="default" className="w-full" onClick={() => { navigate('/auth'); closeMobileMenu(); }}>
                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                      </Button>
                    )}
                </div>
            </motion.div>
         )}
      </AnimatePresence>
    </>
  );
};


const NavLink = ({ to, icon, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};


export default Header;
  