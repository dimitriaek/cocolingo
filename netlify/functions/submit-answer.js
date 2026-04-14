import { badRequest, created, methodNotAllowed, readJson, serverError } from "./_lib/http.js";
import { supabase } from "./_lib/supabase.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed();
  }

  const body = readJson(event);

  if (!body) {
    return badRequest("Invalid JSON body.");
  }

  const { quiz_id, submitted_by, answer_text } = body;

  if (!quiz_id || !submitted_by || !answer_text?.trim()) {
    return badRequest("quiz_id, submitted_by, and answer_text are required.");
  }

  try {
    const quizResult = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quiz_id)
      .single();

    if (quizResult.error) {
      throw quizResult.error;
    }

    const quiz = quizResult.data;

    if (!quiz || quiz.status !== "open") {
      return badRequest("This quiz is no longer open for answers.");
    }

    if (quiz.assigned_to !== submitted_by) {
      return badRequest("This quiz is assigned to the other person.");
    }

    const insertResult = await supabase
      .from("submissions")
      .insert({
        quiz_id,
        submitted_by,
        answer_text: answer_text.trim(),
      })
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

    if (insertResult.error) {
      throw insertResult.error;
    }

    const updateResult = await supabase
      .from("quizzes")
      .update({ status: "submitted" })
      .eq("id", quiz_id);

    if (updateResult.error) {
      throw updateResult.error;
    }

    return created({ submission: insertResult.data });
  } catch (error) {
    return serverError(error.message);
  }
}
