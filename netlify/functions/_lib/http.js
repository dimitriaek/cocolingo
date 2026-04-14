export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export function ok(body) {
  return json(200, body);
}

export function created(body) {
  return json(201, body);
}

export function badRequest(message) {
  return json(400, { error: message });
}

export function methodNotAllowed() {
  return json(405, { error: "Method not allowed." });
}

export function serverError(message = "Unexpected server error.") {
  return json(500, { error: message });
}

export function readJson(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch (error) {
    return null;
  }
}
