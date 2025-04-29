
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, X } from 'lucide-react';

const CreateQuizPage = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState([{ id: Date.now(), text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const removeQuestion = (id) => {
    if (questions.length <= 1) {
        toast({ title: "Cannot Remove", description: "A quiz must have at least one question.", variant: "destructive" });
        return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

   const handleQuestionChange = (id, field, value) => {
      setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
   };

   const handleOptionChange = (questionId, optionIndex, value) => {
      setQuestions(questions.map(q => {
         if (q.id === questionId) {
             const newOptions = [...q.options];
             newOptions[optionIndex] = value;
             return { ...q, options: newOptions };
         }
         return q;
      }));
   };

   const handleCorrectAnswerChange = (questionId, value) => {
       // Radix RadioGroup value is string, convert index to string for comparison later
      handleQuestionChange(questionId, 'correctAnswerIndex', parseInt(value, 10));
   };


  const saveQuiz = () => {
    // Basic Validation
    if (!quizTitle.trim()) {
      toast({ title: "Error", description: "Please enter a quiz title.", variant: "destructive" });
      return;
    }
    if (questions.some(q => !q.text.trim() || q.options.some(opt => !opt.trim()))) {
       toast({ title: "Error", description: "Please fill in all question text and options.", variant: "destructive" });
       return;
    }
     if (questions.some(q => q.options.length !== 4)) {
       toast({ title: "Error", description: "Each question must have exactly 4 options.", variant: "destructive" });
       return;
    }


    const newQuiz = {
      id: `quiz_${Date.now()}`, // Simple unique ID
      title: quizTitle,
      description: quizDescription,
      questions: questions.map(q => ({ // Don't save the temporary frontend ID
         text: q.text,
         options: q.options,
         correctAnswerIndex: q.correctAnswerIndex
      })),
      createdBy: localStorage.getItem('currentUser') || 'anonymous', // Track creator
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      localStorage.setItem('quizzes', JSON.stringify([...existingQuizzes, newQuiz]));
      toast({ title: "Success", description: "Quiz saved successfully!" });
      navigate('/'); // Redirect to home after saving
    } catch (error) {
      console.error("Failed to save quiz:", error);
      toast({ title: "Error", description: "Failed to save quiz. Check console for details.", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-center">Create a New Quiz</h1>

      <Card>
        <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
             <div>
                 <Label htmlFor="quizTitle">Quiz Title</Label>
                 <Input
                    id="quizTitle"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., General Knowledge Challenge"
                    required
                />
            </div>
             <div>
                 <Label htmlFor="quizDescription">Description (Optional)</Label>
                 <Textarea
                    id="quizDescription"
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Briefly describe your quiz"
                />
            </div>
        </CardContent>
      </Card>

      {questions.map((question, index) => (
        <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card >
                 <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle>Question {index + 1}</CardTitle>
                     <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 size={18} />
                     </Button>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div>
                         <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                         <Textarea
                            id={`question-${question.id}`}
                            value={question.text}
                            onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                            placeholder="Enter your question here"
                            required
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Options (Select the correct answer)</Label>
                         <RadioGroup
                           value={String(question.correctAnswerIndex)}
                           onValueChange={(value) => handleCorrectAnswerChange(question.id, value)}
                           className="space-y-2"
                           required
                        >
                          {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-3">
                                 <RadioGroupItem value={String(optionIndex)} id={`q${question.id}-opt${optionIndex}`} />
                                 <Label htmlFor={`q${question.id}-opt${optionIndex}`} className="flex-1">
                                      <Input
                                          value={option}
                                          onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                          placeholder={`Option ${optionIndex + 1}`}
                                          required
                                          className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary"
                                      />
                                  </Label>
                               </div>
                           ))}
                        </RadioGroup>
                     </div>
                </CardContent>
             </Card>
        </motion.div>
      ))}

        <div className="flex justify-between items-center">
             <Button variant="outline" onClick={addQuestion}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
             </Button>
             <Button size="lg" onClick={saveQuiz} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg">
                 <Save className="mr-2 h-5 w-5" /> Save Quiz
             </Button>
        </div>

    </motion.div>
  );
};

export default CreateQuizPage;
  