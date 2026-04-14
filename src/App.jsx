import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PersonDashboardPage from "./pages/PersonDashboardPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import AnswerQueuePage from "./pages/AnswerQueuePage";
import AnswerQuizPage from "./pages/AnswerQuizPage";
import GradeQueuePage from "./pages/GradeQueuePage";
import GradeSubmissionPage from "./pages/GradeSubmissionPage";
import { createQuiz, getDashboard, gradeSubmission, submitAnswer } from "./lib/api";
import { HOME_ROUTE } from "./lib/utils";

const AppDataContext = createContext(null);

export function useAppData() {
  const value = useContext(AppDataContext);

  if (!value) {
    throw new Error("useAppData must be used inside AppDataContext.");
  }

  return value;
}

export default function App() {
  const [dashboard, setDashboard] = useState({
    quizzes: [],
    submissions: [],
    summary: {
      openQuizzes: 0,
      pendingGrading: 0,
      recentScores: [],
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshDashboard() {
    setIsLoading(true);
    setError("");

    try {
      const nextDashboard = await getDashboard();
      setDashboard(nextDashboard);
    } catch (loadError) {
      setError(loadError.message || "Could not load CocoLingo right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  const contextValue = useMemo(
    () => ({
      dashboard,
      isLoading,
      error,
      refreshDashboard,
      createQuiz: async (payload) => {
        const result = await createQuiz(payload);
        await refreshDashboard();
        return result;
      },
      submitAnswer: async (payload) => {
        const result = await submitAnswer(payload);
        await refreshDashboard();
        return result;
      },
      gradeSubmission: async (payload) => {
        const result = await gradeSubmission(payload);
        await refreshDashboard();
        return result;
      },
    }),
    [dashboard, error, isLoading],
  );

  return (
    <AppDataContext.Provider value={contextValue}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={HOME_ROUTE} element={<HomePage />} />
        <Route path="/:person" element={<PersonDashboardPage />} />
        <Route path="/:person/create" element={<CreateQuizPage />} />
        <Route path="/:person/answer" element={<AnswerQueuePage />} />
        <Route path="/:person/answer/:quizId" element={<AnswerQuizPage />} />
        <Route path="/:person/grade" element={<GradeQueuePage />} />
        <Route path="/:person/grade/:submissionId" element={<GradeSubmissionPage />} />
        <Route path="*" element={<Navigate to={HOME_ROUTE} replace />} />
      </Routes>
    </AppDataContext.Provider>
  );
}
