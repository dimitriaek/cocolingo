async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

export function getDashboard() {
  return apiRequest("/.netlify/functions/get-dashboard");
}

export function createQuiz(payload) {
  return apiRequest("/.netlify/functions/create-quiz", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitAnswer(payload) {
  return apiRequest("/.netlify/functions/submit-answer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function gradeSubmission(payload) {
  return apiRequest("/.netlify/functions/grade-submission", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
