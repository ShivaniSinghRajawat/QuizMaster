
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Percent, Home, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams(); // Get quizId from URL params
  const [quiz, setQuiz] = useState(null); // State to hold the full quiz data
  const [isLoading, setIsLoading] = useState(true);


   // Extract result from navigation state or handle potential direct access
   const result = location.state?.result;


   useEffect(() => {
    // Load the full quiz data to display questions and correct answers
    setIsLoading(true);
    try {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      const foundQuiz = storedQuizzes.find(q => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        // Handle case where quiz data isn't found (maybe redirect or show error)
         console.error("Quiz data not found for results page");
         navigate('/'); // Or show an error message
      }
    } catch (error) {
       console.error("Error loading quiz data for results:", error);
       navigate('/'); // Or show an error message
    } finally {
       setIsLoading(false);
    }
   }, [quizId, navigate]);


  if (!result) {
    // Handle cases where state might be missing (e.g., page refresh, direct navigation)
     // Maybe try fetching the latest attempt for this quizId from localStorage?
    return (
       <div className="text-center py-12">
         <p className="text-xl text-destructive">Result data not found.</p>
         <p className="text-muted-foreground mt-2">Please complete the quiz first.</p>
         <Link to="/" className="mt-4 inline-block">
            <Button variant="outline"><Home className="mr-2 h-4 w-4" /> Go Home</Button>
         </Link>
      </div>
    );
  }


   if (isLoading) {
       return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">Loading results...</div>;
   }
   if (!quiz) {
        return <div className="text-center py-12 text-destructive">Could not load quiz details for results.</div>;
   }

  const { score, totalQuestions, selectedAnswers, quizTitle } = result;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getFeedbackMessage = (perc) => {
    if (perc === 100) return "Perfect Score! Outstanding!";
    if (perc >= 80) return "Excellent Job! You really know your stuff!";
    if (perc >= 60) return "Good Effort! Keep learning!";
    if (perc >= 40) return "Not bad! Room for improvement.";
    return "Keep practicing! You'll get there!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <Card className="text-center shadow-xl border-primary/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary to-purple-700 text-primary-foreground p-8">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                 <Percent size={64} className="mx-auto mb-4" />
              </motion.div>
              <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">{quizTitle}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
             <p className="text-5xl font-bold text-primary">{percentage}%</p>
             <p className="text-xl text-muted-foreground">You answered {score} out of {totalQuestions} questions correctly.</p>
             <p className="text-lg font-semibold">{getFeedbackMessage(percentage)}</p>
          </CardContent>
          <CardFooter className="bg-secondary/30 p-4 flex justify-center gap-4">
             <Link to="/">
                <Button variant="outline"><Home className="mr-2 h-4 w-4" /> Go Home</Button>
             </Link>
             <Link to="/leaderboard">
                <Button variant="default"><BarChart3 className="mr-2 h-4 w-4" /> View Leaderboard</Button>
             </Link>
          </CardFooter>
      </Card>


       {/* Detailed Answer Review */}
       <Card>
            <CardHeader>
                <CardTitle>Answer Review</CardTitle>
                <CardDescription>Check your answers below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {quiz.questions.map((question, index) => {
                     const userAnswerIndex = selectedAnswers[index];
                     const correctAnswerIndex = question.correctAnswerIndex;
                     const isCorrect = userAnswerIndex === correctAnswerIndex;


                     return (
                         <div key={index} className={cn("p-4 border rounded-md", isCorrect ? 'border-green-300 bg-green-50/50 dark:bg-green-900/20 dark:border-green-700' : 'border-red-300 bg-red-50/50 dark:bg-red-900/20 dark:border-red-700')}>
                             <p className="font-medium mb-2">Q{index + 1}: {question.text}</p>
                             <ul className="space-y-1 text-sm">
                                 {question.options.map((option, optIndex) => (
                                    <li key={optIndex} className={cn(
                                        "flex items-center space-x-2 p-1 rounded",
                                        optIndex === correctAnswerIndex ? 'text-green-700 dark:text-green-400 font-semibold' : '',
                                        optIndex === userAnswerIndex && !isCorrect ? 'text-red-700 dark:text-red-400' : ''
                                    )}>
                                        {optIndex === userAnswerIndex && (
                                            isCorrect ? <CheckCircle size={16} className="text-green-600 dark:text-green-500 flex-shrink-0" /> : <XCircle size={16} className="text-red-600 dark:text-red-500 flex-shrink-0" />
                                        )}
                                         {optIndex !== userAnswerIndex && optIndex === correctAnswerIndex && (
                                             <CheckCircle size={16} className="text-green-600 dark:text-green-500 opacity-70 flex-shrink-0" />
                                         )}
                                         {optIndex !== userAnswerIndex && optIndex !== correctAnswerIndex && (
                                            <span className="w-4 h-4 inline-block flex-shrink-0"></span>
                                         )}

                                        <span>{option}</span>
                                         {optIndex === userAnswerIndex && !isCorrect && <span className="text-xs text-red-600 dark:text-red-400 ml-auto">(Your Answer)</span>}
                                         {optIndex === correctAnswerIndex && <span className="text-xs text-green-600 dark:text-green-400 ml-auto">(Correct Answer)</span>}
                                    </li>
                                 ))}
                             </ul>
                         </div>
                     );
                 })}
             </CardContent>
       </Card>


    </motion.div>
  );
};

export default ResultsPage;
  