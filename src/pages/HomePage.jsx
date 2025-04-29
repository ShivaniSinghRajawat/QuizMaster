
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle } from 'lucide-react';

const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load quizzes from localStorage
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizzes(storedQuizzes);
    // Check auth status
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-900/20 rounded-lg border border-primary/20 shadow-sm"
      >
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to QuizMaster!</h1>
            <p className="text-muted-foreground mt-1">Browse available quizzes or create your own.</p>
        </div>
        {isAuthenticated && (
            <Link to="/create">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create New Quiz
                </Button>
            </Link>
        )}
      </motion.div>


      {quizzes.length > 0 ? (
        <motion.div
           variants={containerVariants}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
         >
          {quizzes.map((quiz) => (
            <motion.div key={quiz.id} variants={itemVariants}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description || 'No description provided.'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {quiz.questions?.length || 0} questions
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/quiz/${quiz.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-12">
          <img  class="mx-auto h-32 w-32 text-muted-foreground mb-4" alt="Empty state illustration" src="https://images.unsplash.com/photo-1696744404432-d829841194f4" />
          <h2 className="text-xl font-semibold text-foreground">No quizzes available yet.</h2>
          {isAuthenticated ? (
              <p className="text-muted-foreground mt-2">Why not <Link to="/create" className="text-primary hover:underline">create the first one</Link>?</p>
          ) : (
               <p className="text-muted-foreground mt-2">Check back later or <Link to="/auth" className="text-primary hover:underline">sign in</Link> to create quizzes.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomePage;
  