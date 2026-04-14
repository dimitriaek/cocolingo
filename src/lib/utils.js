export const HOME_ROUTE = "/home";

export const PEOPLE = {
  dimitri: {
    slug: "dimitri",
    label: "Dimitri",
    nativeLanguage: "greek",
    learningLanguage: "french",
    accentCopy: "Greek speaker creating Greek pop quizzes for Priscila.",
  },
  priscila: {
    slug: "priscila",
    label: "Priscila",
    nativeLanguage: "french",
    learningLanguage: "greek",
    accentCopy: "French speaker creating French pop quizzes for Dimitri.",
  },
};

export const LANGUAGE_COPY = {
  greek: {
    label: "Greek",
    themeClass: "theme-greek",
    pillClass: "pill-greek",
    tone: "Soft Aegean blue accents for Greek phrases and grading.",
  },
  french: {
    label: "French",
    themeClass: "theme-french",
    pillClass: "pill-french",
    tone: "Soft tricolor accents for French phrases and grading.",
  },
};

export function isValidPerson(person) {
  return Object.hasOwn(PEOPLE, person);
}

export function getOtherPerson(person) {
  return person === "dimitri" ? "priscila" : "dimitri";
}

export function getAreaLabel(person) {
  return `${PEOPLE[person]?.label} Area`;
}

export function getCreateLanguage(person) {
  return PEOPLE[person]?.nativeLanguage;
}

export function getAnswerLanguage(person) {
  return PEOPLE[person]?.learningLanguage;
}

export function titleCase(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDate(value) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatShortDateTime(value) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getThemeClass(language) {
  return LANGUAGE_COPY[language]?.themeClass || "";
}

export function getScoreAverage(items) {
  const graded = items.filter((item) => typeof item.score === "number");

  if (!graded.length) {
    return null;
  }

  const total = graded.reduce((sum, item) => sum + item.score, 0);
  return (total / graded.length).toFixed(1);
}

export function getDashboardDataForPerson(person, dashboard) {
  const answerLanguage = getAnswerLanguage(person);
  const createLanguage = getCreateLanguage(person);

  const pendingToAnswer = dashboard.quizzes
    .filter((quiz) => quiz.assigned_to === person && quiz.status === "open")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const pendingToGrade = dashboard.submissions
    .filter((submission) => submission.quiz?.created_by === person && submission.quiz?.status === "submitted")
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const history = dashboard.submissions
    .filter((submission) => submission.submitted_by === person && submission.quiz?.language === answerLanguage)
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const gradedHistory = history.filter((submission) => typeof submission.score === "number");

  return {
    createLanguage,
    answerLanguage,
    pendingToAnswer,
    pendingToGrade,
    history,
    gradedHistory,
    averageScore: getScoreAverage(gradedHistory),
  };
}

export function getSummaryCards(summary = {}) {
  return [
    {
      label: "Open quizzes",
      value: summary.openQuizzes ?? 0,
      helper: "Ready for a translation attempt.",
    },
    {
      label: "Pending grading",
      value: summary.pendingGrading ?? 0,
      helper: "Submitted and waiting for a score.",
    },
    {
      label: "Recent scores",
      value: summary.recentScores?.length ?? 0,
      helper: "Freshly graded pop quizzes.",
    },
  ];
}
