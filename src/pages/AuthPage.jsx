
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the page the user was trying to access before being redirected here
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

     if (!email || !password || (!isLogin && !confirmPassword)) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
        return;
    }
    if (password.length < 6) {
        toast({ title: "Password Too Short", description: "Password must be at least 6 characters long.", variant: "destructive"});
        return;
    }
    if (!isLogin && password !== confirmPassword) {
       toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
       return;
    }

    // Using localStorage for demonstration
    if (isLogin) {
       const storedUser = localStorage.getItem(`user_${email}`);
       if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.password === password) { // In reality, compare hashed passwords
             localStorage.setItem('isAuthenticated', 'true');
             localStorage.setItem('currentUser', email);
             toast({ title: "Login Successful", description: `Welcome back, ${email}!` });
             // Redirect to the originally intended page, or home
             navigate(from, { replace: true });
             // No need for window.location.reload() if state updates correctly in Header
          } else {
             toast({ title: "Login Failed", description: "Incorrect password.", variant: "destructive" });
          }
       } else {
          toast({ title: "Login Failed", description: "User not found. Please sign up.", variant: "destructive" });
       }
    } else { // Signup
      if (localStorage.getItem(`user_${email}`)) {
         toast({ title: "Signup Failed", description: "Email already in use. Please log in or use a different email.", variant: "destructive" });
         return;
      }
      // Store user data (NEVER store plain passwords in production!)
      const newUser = { email, password }; // Add other fields like username if needed
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      toast({ title: "Signup Successful", description: "Account created! Please log in." });
      setIsLogin(true); // Switch to login form
      setPassword('');
      setConfirmPassword('');
    }
  };


  return (
     <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-primary/10">
            <CardHeader className="text-center">
                <LogIn size={48} className="mx-auto text-primary mb-2" />
                <CardTitle className="text-2xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
                <CardDescription>{isLogin ? 'Access your quizzes and scores' : 'Join QuizMaster to create quizzes'}</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                         <Label htmlFor="email">Email Address</Label>
                         <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-1"
                        />
                    </div>

                    <div className="relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1 pr-10"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                    </div>

                   {!isLogin && (
                     <div className="relative">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                       <Input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1 pr-10"
                        />
                         <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-muted-foreground hover:text-foreground"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                             {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                     </div>
                   )}

                   <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                     {isLogin ? 'Sign In' : 'Sign Up'}
                   </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-3">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:underline focus:outline-none"
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </button>
                 <p className="text-center text-xs text-muted-foreground px-4">
                   Authentication uses browser storage for demonstration. For real applications, use a secure backend like Supabase.
                 </p>
            </CardFooter>
        </Card>
       </motion.div>
     </div>

  );
};


export default AuthPage;
  