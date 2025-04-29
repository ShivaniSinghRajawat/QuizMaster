
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import CreateQuizPage from '@/pages/CreateQuizPage';
import TakeQuizPage from '@/pages/TakeQuizPage';
import ResultsPage from '@/pages/ResultsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AuthPage from '@/pages/AuthPage';

// Simple Auth Check (Replace with robust logic)
const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect them to the /auth page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth" replace />;
  }
  return children;
};


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-800 dark:text-gray-200">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateQuizPage />
                </ProtectedRoute>
              }
            />
            <Route path="/quiz/:quizId" element={<TakeQuizPage />} />
            {/* Note: Results page might need protection or validation */}
            <Route path="/quiz/:quizId/results" element={<ResultsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Add a fallback route if needed */}
             <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
  