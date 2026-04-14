import { badRequest, created, methodNotAllowed, readJson, serverError } from "./_lib/http.js";
import { supabase } from "./_lib/supabase.js";

const PERSON_LANGUAGE = {
  dimitri: "greek",
  priscila: "french",
};

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed();
  }

  const body = readJson(event);

  if (!body) {
    return badRequest("Invalid JSON body.");
  }

  const { created_by, assigned_to, phrase, general_hint, pronunciation_hint, grammar_note } = body;

  if (!PERSON_LANGUAGE[created_by] || !PERSON_LANGUAGE[assigned_to] || !phrase?.trim() || !general_hint?.trim()) {
    return badRequest("created_by, assigned_to, phrase, and general_hint are required.");
  }

  if (created_by === assigned_to) {
    return badRequest("A quiz must be assigned to the other person.");
  }

  try {
    const payload = {
      created_by,
      assigned_to,
      language: PERSON_LANGUAGE[created_by],
      phrase: phrase.trim(),
      general_hint: general_hint.trim(),
      pronunciation_hint: pronunciation_hint?.trim() || null,
      grammar_note: grammar_note?.trim() || null,
      status: "open",
    };

    const result = await supabase.from("quizzes").insert(payload).select().single();

    if (result.error) {
      throw result.error;
    }

    return created({ quiz: result.data });
  } catch (error) {
    return serverError(error.message);
  }
}
