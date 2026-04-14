import { ok, methodNotAllowed, serverError } from "./_lib/http.js";
import { supabase } from "./_lib/supabase.js";

function buildSummary(quizzes, submissions) {
  const graded = submissions
    .filter((submission) => typeof submission.score === "number")
    .sort((a, b) => new Date(b.graded_at) - new Date(a.graded_at))
    .slice(0, 4)
    .map((submission) => ({
      id: submission.id,
      score: submission.score,
      submitted_by: submission.submitted_by,
      language: submission.quiz?.language,
    }));

  return {
    openQuizzes: quizzes.filter((quiz) => quiz.status === "open").length,
    pendingGrading: quizzes.filter((quiz) => quiz.status === "submitted").length,
    recentScores: graded,
  };
}

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return methodNotAllowed();
  }

  try {
    const [quizzesResult, submissionsResult] = await Promise.all([
      supabase.from("quizzes").select("*").order("created_at", { ascending: false }),
      supabase
        .from("submissions")
        .select(
          `
            *,
            quiz:quizzes (
              id,
              created_by,
              assigned_to,
              language,
              phrase,
              general_hint,
              pronunciation_hint,
              grammar_note,
              status,
              created_at
            )
          `,
        )
        .order("submitted_at", { ascending: false }),
    ]);

    if (quizzesResult.error) {
      throw quizzesResult.error;
    }

    if (submissionsResult.error) {
      throw submissionsResult.error;
    }

    return ok({
      quizzes: quizzesResult.data ?? [],
      submissions: submissionsResult.data ?? [],
      summary: buildSummary(quizzesResult.data ?? [], submissionsResult.data ?? []),
    });
  } catch (error) {
    return serverError(error.message);
  }
}
