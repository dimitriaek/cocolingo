import { badRequest, methodNotAllowed, ok, readJson, serverError } from "./_lib/http.js";
import { supabase } from "./_lib/supabase.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed();
  }

  const body = readJson(event);

  if (!body) {
    return badRequest("Invalid JSON body.");
  }

  const { submission_id, score, grading_note } = body;
  const numericScore = Number(score);

  if (!submission_id || Number.isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
    return badRequest("submission_id and a score from 0 to 10 are required.");
  }

  try {
    const submissionResult = await supabase
      .from("submissions")
      .select(
        `
          *,
          quiz:quizzes (
            id,
            status
          )
        `,
      )
      .eq("id", submission_id)
      .single();

    if (submissionResult.error) {
      throw submissionResult.error;
    }

    const submission = submissionResult.data;

    if (!submission || submission.quiz?.status !== "submitted") {
      return badRequest("This submission is not waiting for a grade.");
    }

    const now = new Date().toISOString();

    const updateSubmission = await supabase
      .from("submissions")
      .update({
        score: numericScore,
        grading_note: grading_note?.trim() || null,
        graded_at: now,
      })
      .eq("id", submission_id)
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
      .single();

    if (updateSubmission.error) {
      throw updateSubmission.error;
    }

    const updateQuiz = await supabase
      .from("quizzes")
      .update({ status: "graded" })
      .eq("id", submission.quiz.id);

    if (updateQuiz.error) {
      throw updateQuiz.error;
    }

    return ok({ submission: updateSubmission.data });
  } catch (error) {
    return serverError(error.message);
  }
}
