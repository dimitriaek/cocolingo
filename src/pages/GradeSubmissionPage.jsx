import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppData } from "../App";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import StatusBanner from "../components/StatusBanner";
import {
  formatDate,
  getAreaLabel,
  getThemeClass,
  HOME_ROUTE,
  isValidPerson,
  LANGUAGE_COPY,
  PEOPLE,
} from "../lib/utils";

export default function GradeSubmissionPage() {
  const { person, submissionId } = useParams();
  const navigate = useNavigate();
  const { dashboard, gradeSubmission } = useAppData();
  const [score, setScore] = useState("");
  const [gradingNote, setGradingNote] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  if (!isValidPerson(person)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  const submission = useMemo(
    () =>
      dashboard.submissions.find(
        (entry) =>
          String(entry.id) === submissionId &&
          entry.quiz?.created_by === person &&
          entry.quiz?.status === "submitted",
      ),
    [dashboard.submissions, person, submissionId],
  );

  if (!submission) {
    return (
      <Layout
        title="Submission not found"
        subtitle="This submission may already be graded or no longer available."
        breadcrumbs={[
          { label: "Home", to: HOME_ROUTE },
          { label: getAreaLabel(person), to: `/${person}` },
          { label: "Grade submission" },
        ]}
      >
        <StatusBanner tone="error">Submission not found or no longer available to grade.</StatusBanner>
      </Layout>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSaving(true);

    try {
      await gradeSubmission({
        submission_id: submission.id,
        score: Number(score),
        grading_note: gradingNote,
      });

      navigate(`/${person}/grade`);
    } catch (saveError) {
      setStatus({
        type: "error",
        message: saveError.message || "Could not save this grade.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout
      title={`Grade ${LANGUAGE_COPY[submission.quiz.language].label} answer`}
      subtitle={`Score ${PEOPLE[submission.submitted_by].label}'s attempt and keep the feedback short and kind.`}
      themeClass={getThemeClass(submission.quiz.language)}
      breadcrumbs={[
        { label: "Home", to: HOME_ROUTE },
        { label: getAreaLabel(person), to: `/${person}` },
        { label: "Grade submissions", to: `/${person}/grade` },
        { label: "Grade answer" },
      ]}
    >
      {status.message ? <StatusBanner tone={status.type}>{status.message}</StatusBanner> : null}

      <section className="card-grid card-grid-two">
        <Panel title="Quiz details" subtitle="Everything the learner could see while answering.">
          <div className="grade-detail-block">
            <h3>Original phrase</h3>
            <p>{submission.quiz.phrase}</p>
          </div>
          <div className="grade-detail-block">
            <h3>Hints shown</h3>
            <ul className="plain-list">
              <li>General hint: {submission.quiz.general_hint}</li>
              {submission.quiz.pronunciation_hint ? (
                <li>Pronunciation hint: {submission.quiz.pronunciation_hint}</li>
              ) : null}
              {submission.quiz.grammar_note ? <li>Grammar note: {submission.quiz.grammar_note}</li> : null}
            </ul>
          </div>
          <div className="grade-detail-block">
            <h3>Submitted answer</h3>
            <p>{submission.answer_text}</p>
          </div>
          <div className="history-meta">
            <span>Submitted {formatDate(submission.submitted_at)}</span>
            <span>From {PEOPLE[submission.submitted_by].label}</span>
          </div>
        </Panel>

        <Panel title="Grade it" subtitle="Score from 0 to 10 and optionally add one short note.">
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span>Score</span>
              <input
                type="number"
                min="0"
                max="10"
                step="1"
                value={score}
                onChange={(event) => setScore(event.target.value)}
                placeholder="0 to 10"
                required
              />
            </label>

            <label className="field">
              <span>Grading note (optional)</span>
              <textarea
                rows="4"
                value={gradingNote}
                onChange={(event) => setGradingNote(event.target.value)}
                placeholder="Nice job with the structure, watch the article..."
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save grade"}
              </button>
              <Link to={`/${person}/grade`} className="button button-secondary">
                Back to grading
              </Link>
            </div>
          </form>
        </Panel>
      </section>
    </Layout>
  );
}
