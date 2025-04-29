
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store answers as { questionIndex: answerIndex }
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    try {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      const foundQuiz = storedQuizzes.find(q => q.id === quizId);
      if (foundQuiz) {
         // Add indices to questions for easier tracking if they don't have them
         const questionsWithIndex = foundQuiz.questions.map((q, index) => ({ ...q, index }));
         setQuiz({...foundQuiz, questions: questionsWithIndex });
         // Initialize selectedAnswers state
         setSelectedAnswers({});

      } else {
        toast({ title: "Error", description: "Quiz not found.", variant: "destructive" });
        navigate('/'); // Redirect if quiz doesn't exist
      }
    } catch (error) {
        console.error("Error loading quiz:", error);
        toast({ title: "Error", description: "Could not load the quiz.", variant: "destructive" });
        navigate('/');
    } finally {
        setIsLoading(false);
    }
  }, [quizId, navigate, toast]);

  const handleAnswerChange = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: parseInt(answerIndex, 10), // Ensure answerIndex is stored as number
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
     setIsSubmitting(true);

     // Validate if all questions are answered
     if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
        toast({ title: "Incomplete", description: "Please answer all questions before submitting.", variant: "destructive" });
        setIsSubmitting(false);
        return;
     }


    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
       // Ensure comparison is number to number
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        score++;
      }
    });

     const result = {
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: score,
        totalQuestions: quiz.questions.length,
        selectedAnswers: selectedAnswers, // Pass selected answers to results page
        timestamp: new Date().toISOString(),
        userId: localStorage.getItem('currentUser') || 'guest' // Associate with user if logged in
     };

     // Save attempt to localStorage (optional, but good for history/leaderboard)
     try {
        const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
        attempts.push(result);
        localStorage.setItem('quizAttempts', JSON.stringify(attempts));
     } catch (error) {
        console.error("Failed to save quiz attempt:", error);
     }


    // Navigate to results page, passing result state
     navigate(`/quiz/${quizId}/results`, { state: { result } });

     setIsSubmitting(false); // Technically not needed due to navigation, but good practice
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12 text-destructive">
        Quiz could not be loaded.
      </div>
    );
  }

   const currentQuestion = quiz.questions[currentQuestionIndex];
   // Get selected answer for current question, ensure it's a string for RadioGroup value
   const currentSelectedAnswer = selectedAnswers[currentQuestionIndex] !== undefined
       ? String(selectedAnswers[currentQuestionIndex])
       : undefined;


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </CardDescription>
           {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <motion.div
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           <p className="text-lg font-medium">{currentQuestion.text}</p>
           <RadioGroup
              value={currentSelectedAnswer}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <RadioGroupItem value={String(index)} id={`q${currentQuestionIndex}-opt${index}`} />
                  <Label htmlFor={`q${currentQuestionIndex}-opt${index}`} className="text-base cursor-pointer flex-1">{option}</Label>
                </motion.div>
              ))}
           </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
           <Button
             variant="outline"
             onClick={goToPreviousQuestion}
             disabled={currentQuestionIndex === 0 || isSubmitting}
           >
             <ArrowLeft className="mr-2 h-4 w-4" /> Previous
           </Button>

           {currentQuestionIndex === quiz.questions.length - 1 ? (
             <Button
               onClick={handleSubmitQuiz}
               disabled={isSubmitting || Object.keys(selectedAnswers).length !== quiz.questions.length}
               className="bg-green-600 hover:bg-green-700 text-white"
             >
                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
               Submit Quiz
             </Button>
           ) : (
             <Button onClick={goToNextQuestion} disabled={isSubmitting}>
               Next <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
           )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TakeQuizPage;
  