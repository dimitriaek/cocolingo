import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../App";
import HintReveal from "../components/HintReveal";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import StatusBanner from "../components/StatusBanner";
import {
  getAreaLabel,
  getOtherPerson,
  getThemeClass,
  HOME_ROUTE,
  isValidPerson,
  LANGUAGE_COPY,
  PEOPLE,
} from "../lib/utils";

export default function AnswerQuizPage() {
  const { person, quizId } = useParams();
  const { dashboard, submitAnswer } = useAppData();
  const [answerText, setAnswerText] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [submittedQuiz, setSubmittedQuiz] = useState(null);

  if (!isValidPerson(person)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  const otherPerson = getOtherPerson(person);

  const quiz = useMemo(
    () =>
      dashboard.quizzes.find(
        (entry) => String(entry.id) === quizId && entry.assigned_to === person,
      ),
    [dashboard.quizzes, person, quizId],
  );

  const activeQuiz = submittedQuiz || quiz;

  if (didSubmit && activeQuiz) {
    return (
      <Layout
        title="Answer submitted"
        subtitle="Your translation attempt is in and ready to be graded."
        themeClass={getThemeClass(activeQuiz.language)}
        breadcrumbs={[
          { label: "Home", to: HOME_ROUTE },
          { label: getAreaLabel(person), to: `/${person}` },
          { label: "Submitted" },
        ]}
      >
        <Panel title="Nice and easy" subtitle="Pick the next small step from here.">
          <div className="success-actions">
            <Link to={HOME_ROUTE} className="button button-secondary">
              Back to Home
            </Link>
            <Link to={`/${person}`} className="button button-secondary">
              Go to {getAreaLabel(person)}
            </Link>
            <Link to={`/${person}/create`} className="button button-primary">
              Add a quiz for {PEOPLE[otherPerson].label}
            </Link>
            <Link to={`/${person}/grade`} className="button button-secondary">
              Grade {LANGUAGE_COPY[PEOPLE[person].nativeLanguage].label} submissions
            </Link>
          </div>
        </Panel>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout
        title="Quiz not found"
        subtitle="This quiz either does not exist anymore or is no longer open."
        breadcrumbs={[
          { label: "Home", to: HOME_ROUTE },
          { label: getAreaLabel(person), to: `/${person}` },
          { label: "Answer quiz" },
        ]}
      >
        <StatusBanner tone="error">Quiz not found or no longer available to answer.</StatusBanner>
      </Layout>
    );
  }

  if (quiz.status !== "open" && !didSubmit) {
    return (
      <Layout
        title="Quiz already answered"
        subtitle="This prompt is no longer open for a new submission."
        breadcrumbs={[
          { label: "Home", to: HOME_ROUTE },
          { label: getAreaLabel(person), to: `/${person}` },
          { label: "Answer quiz" },
        ]}
      >
        <StatusBanner tone="error">This quiz has already been submitted and is waiting for grading.</StatusBanner>
      </Layout>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      await submitAnswer({
        quiz_id: quiz.id,
        submitted_by: person,
        answer_text: answerText,
      });
      setSubmittedQuiz(quiz);
      setDidSubmit(true);
      setAnswerText("");
    } catch (submitError) {
      setStatus({
        type: "error",
        message: submitError.message || "Could not submit your answer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout
      title={`${LANGUAGE_COPY[quiz.language].label} pop quiz`}
      subtitle={`A quick translation for ${PEOPLE[person].label}, created by ${PEOPLE[quiz.created_by].label}.`}
      themeClass={getThemeClass(quiz.language)}
      breadcrumbs={[
        { label: "Home", to: HOME_ROUTE },
        { label: getAreaLabel(person), to: `/${person}` },
        { label: "Answer quiz", to: `/${person}/answer` },
        { label: "Open prompt" },
      ]}
    >
      {status.message ? <StatusBanner tone={status.type}>{status.message}</StatusBanner> : null}

      <section className="card-grid card-grid-two">
        <Panel title="Phrase" subtitle="Translate this into your own words.">
          <div className="phrase-block">{quiz.phrase}</div>
          <div className="hint-stack">
            <HintReveal label="General hint" value={quiz.general_hint} />
            <HintReveal label="Pronunciation hint" value={quiz.pronunciation_hint} />
            <HintReveal label="Grammar note" value={quiz.grammar_note} />
          </div>
        </Panel>

        <Panel title="Your answer" subtitle="One text box, no pressure.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span>Translation attempt</span>
              <textarea
                rows="7"
                value={answerText}
                onChange={(event) => setAnswerText(event.target.value)}
                placeholder="Write your translation here..."
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit answer"}
              </button>
              <Link to={`/${person}/answer`} className="button button-secondary">
                Back to quizzes
              </Link>
            </div>
          </form>
        </Panel>
      </section>
    </Layout>
  );
}
