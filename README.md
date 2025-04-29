
# QuizMaster - Online Quiz Maker

QuizMaster is an interactive web application allowing users to create, take, and track scores for online quizzes. Built using React, Vite, TailwindCSS, shadcn/ui, and Framer Motion.

## Features

*   **Quiz Listing:** Browse available quizzes on the homepage.
*   **Quiz Creation:** Authenticated users can create quizzes with multiple-choice questions and define correct answers.
*   **Quiz Taking:** Users can take available quizzes, navigate through questions, and select answers.
*   **Scoring & Results:** View immediate results after completing a quiz, including score percentage and answer review.
*   **Leaderboard:** See the top scores across all quizzes, ranked by percentage and time.
*   **User Authentication:** Simple login/signup system for quiz creators (using `localStorage` for demo purposes).
*   **Responsive Design:** Adapts to different screen sizes.
*   **Animations:** Smooth transitions and subtle animations using Framer Motion.

## Technologies Used

*   **Vite:** Frontend build tool and development server.
*   **React:** JavaScript library for building user interfaces.
*   **React Router:** For handling client-side routing.
*   **TailwindCSS:** Utility-first CSS framework for styling.
*   **shadcn/ui:** Re-usable UI components (Card, Button, Input, RadioGroup, Table, etc.).
*   **Lucide React:** Icon library.
*   **Framer Motion:** For animations and transitions.
*   **localStorage:** For storing quiz data, user info, and attempts (for demonstration purposes).
*   **Supabase:** (Recommended) Backend-as-a-Service for robust authentication, database storage, and analytics.

## Getting Started
1.  **Dependencies:** `npm install` should be run in thee environment when `package.json` is modified.
2.  **Development Server:** `npm run dev` should be run in the environment. 
3.  **Build:** `npm run build` should be run in the environment for production builds.

**Running Locally (Standard Setup - If Exported)**

If you want to run it locally:

1.  **Prerequisites:** Ensure you have Node.js (v20 or later recommended) and npm installed.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:5173` or a similar port.
4.  **Build for Production:**
    ```bash
    npm run build
    ```
    This command creates a `dist` folder with the optimized production build.

## Project Structure

```
/
├── public/
│   └── # Static assets
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   └── ui/           # shadcn/ui components (Button, Card, Input, etc.)
│   ├── lib/              # Utility functions (cn)
│   ├── pages/            # Page components (HomePage, CreateQuizPage, etc.)
│   ├── App.jsx           # Main application component with routing
│   ├── index.css         # Global styles and Tailwind directives
│   └── main.jsx          # Application entry point
├── .gitignore
├── index.html            # Main HTML file
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── README.md             # This file
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration 
```

## Data Storage (localStorage - Demo)

*   **Quizzes:** Stored under the key `quizzes`. An array of quiz objects:
    `{ id, title, description, questions: [{ text, options, correctAnswerIndex }], createdBy, createdAt }`
*   **User Authentication:** Uses `isAuthenticated` flag and `currentUser` email key. User details (email/password hash) stored under `user_<email>`. **Note:** Storing passwords directly is insecure; this is purely for demo.
*   **Quiz Attempts:** Stored under the key `quizAttempts`. An array of attempt objects:
    `{ quizId, quizTitle, score, totalQuestions, selectedAnswers, timestamp, userId }`

## Next Steps & Improvements

*   **Implement Supabase:** Migrate authentication and all data (quizzes, attempts) from `localStorage` to Supabase for a secure, scalable backend. This is highly recommended for any real-world use.
*   **Quiz Editing/Deletion:** Allow creators to edit or delete their quizzes.
*   **Quiz Analytics:** Track performance metrics (e.g., average score, completion rate, toughest questions).
*   **Quiz Categories/Tags:** Organize quizzes for better browsing.
*   **Timed Quizzes:** Add an option for time limits per question or for the whole quiz.
*   **User Profiles:** Allow users to see their past attempts and stats.
*   **Image/Media Support:** Allow adding images or videos to questions.
*   **Error Handling & Validation:** Enhance input validation and error handling throughout the application.
*   **Testing:** Implement unit and integration tests.


  
