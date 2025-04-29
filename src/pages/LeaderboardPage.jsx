
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trophy, UserCircle, Hash, Percent } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

   // Function to generate simple initials from email/username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split('@')[0].split(/[._-]/); // Split email prefix by common separators
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    };

  useEffect(() => {
    setIsLoading(true);
    try {
      const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');

      // Aggregate scores: Find the best score per user per quiz
       const bestScores = attempts.reduce((acc, attempt) => {
         const key = `${attempt.userId}-${attempt.quizId}`;
         const percentage = attempt.totalQuestions > 0 ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
         if (!acc[key] || percentage > acc[key].percentage) {
           acc[key] = {
             userId: attempt.userId,
             quizId: attempt.quizId,
             quizTitle: attempt.quizTitle,
             score: attempt.score,
             totalQuestions: attempt.totalQuestions,
             percentage: percentage,
             timestamp: attempt.timestamp,
           };
         }
         return acc;
       }, {});

       // Convert aggregated scores object back to an array
       const aggregatedAttempts = Object.values(bestScores);


      // Sort by percentage (descending), then by score (descending), then timestamp (ascending for ties)
      aggregatedAttempts.sort((a, b) => {
         if (b.percentage !== a.percentage) {
           return b.percentage - a.percentage;
         }
          if (b.score !== a.score) {
            return b.score - a.score;
          }
         return new Date(a.timestamp) - new Date(b.timestamp); // Earlier attempt wins ties
      });


      setLeaderboardData(aggregatedAttempts);

    } catch (error) {
      console.error("Failed to load or process leaderboard data:", error);
      // Optionally set an error state and display a message
    } finally {
      setIsLoading(false);
    }
  }, []);


   const getRankColor = (rank) => {
    if (rank === 0) return 'text-yellow-500'; // Gold
    if (rank === 1) return 'text-gray-400'; // Silver
    if (rank === 2) return 'text-orange-600'; // Bronze
    return 'text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="text-center">
          <Trophy size={48} className="mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">Leaderboard</CardTitle>
          <CardDescription>Top scores across all quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading leaderboard...</div>
          ) : leaderboardData.length > 0 ? (
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"><Hash size={16} /></TableHead>
                   <TableHead><UserCircle size={16} className="inline mr-1" /> User</TableHead>
                  <TableHead>Quiz</TableHead>
                   <TableHead className="text-right"><Percent size={16} /></TableHead>
                   <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((entry, index) => (
                  <motion.tr
                    key={`${entry.userId}-${entry.quizId}-${entry.timestamp}`} // Unique key
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary/50"
                  >
                    <TableCell className={`font-bold text-lg ${getRankColor(index)}`}>{index + 1}</TableCell>
                     <TableCell>
                       <div className="flex items-center space-x-3">
                         <Avatar className="h-8 w-8">
                            {/* Placeholder for real images if available */}
                            {/* <AvatarImage src={`https://github.com/${entry.userId}.png`} alt={entry.userId} /> */}
                           <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{getInitials(entry.userId)}</AvatarFallback>
                         </Avatar>
                         <span className="font-medium truncate max-w-[150px]">{entry.userId === 'guest' ? 'Guest User' : entry.userId}</span>
                       </div>
                     </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[200px]">{entry.quizTitle}</TableCell>
                     <TableCell className="text-right font-semibold text-primary">{entry.percentage}%</TableCell>
                     <TableCell className="text-right text-muted-foreground">{entry.score}/{entry.totalQuestions}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
               <TableCaption>Showing top scores based on percentage and time.</TableCaption>
            </Table>
          ) : (
            <div className="text-center py-12">
               <img  class="mx-auto h-32 w-32 text-muted-foreground mb-4" alt="Empty leaderboard illustration" src="https://images.unsplash.com/photo-1638256192052-9fa73b790cf5" />
               <p className="text-lg font-medium">The leaderboard is empty.</p>
               <p className="text-muted-foreground">Take some quizzes to see your name here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LeaderboardPage;
  