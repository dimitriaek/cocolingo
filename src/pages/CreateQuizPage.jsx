import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppData } from "../App";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import StatusBanner from "../components/StatusBanner";
import {
  getAreaLabel,
  getCreateLanguage,
  getOtherPerson,
  getThemeClass,
  HOME_ROUTE,
  isValidPerson,
  LANGUAGE_COPY,
  PEOPLE,
} from "../lib/utils";

const initialForm = {
  phrase: "",
  generalHint: "",
  pronunciationHint: "",
  grammarNote: "",
};

export default function CreateQuizPage() {
  const { person } = useParams();
  const navigate = useNavigate();
  const { createQuiz } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isValidPerson(person)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  const language = getCreateLanguage(person);
  const otherPerson = getOtherPerson(person);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await createQuiz({
        created_by: person,
        assigned_to: otherPerson,
        phrase: form.phrase,
        general_hint: form.generalHint,
        pronunciation_hint: form.pronunciationHint,
        grammar_note: form.grammarNote,
      });

      navigate(`/${person}`);
    } catch (saveError) {
      setError(saveError.message || "Could not save this quiz.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout
      title={`Create ${LANGUAGE_COPY[language].label} quiz`}
      subtitle={`A quick ${LANGUAGE_COPY[language].label.toLowerCase()} pop quiz from ${PEOPLE[person].label} to ${PEOPLE[otherPerson].label}.`}
      themeClass={getThemeClass(language)}
      breadcrumbs={[
        { label: "Home", to: HOME_ROUTE },
        { label: getAreaLabel(person), to: `/${person}` },
        { label: "Create quiz" },
      ]}
    >
      {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}

      <Panel
        title="New quiz"
        subtitle="Keep it short, friendly, and easy to answer in one text box."
      >
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Phrase or text</span>
            <textarea
              rows="4"
              value={form.phrase}
              onChange={(event) => setForm((current) => ({ ...current, phrase: event.target.value }))}
              placeholder="Write the Greek or French phrase to translate..."
              required
            />
          </label>

          <label className="field">
            <span>General hint</span>
            <textarea
              rows="3"
              value={form.generalHint}
              onChange={(event) => setForm((current) => ({ ...current, generalHint: event.target.value }))}
              placeholder="Add a nudge or bit of context..."
              required
            />
          </label>

          <label className="field">
            <span>Pronunciation hint (optional)</span>
            <textarea
              rows="2"
              value={form.pronunciationHint}
              onChange={(event) =>
                setForm((current) => ({ ...current, pronunciationHint: event.target.value }))
              }
              placeholder="Helpful sound cue, if you want..."
            />
          </label>

          <label className="field">
            <span>Grammar note (optional)</span>
            <textarea
              rows="2"
              value={form.grammarNote}
              onChange={(event) => setForm((current) => ({ ...current, grammarNote: event.target.value }))}
              placeholder="Small grammar reminder..."
            />
          </label>

          <div className="form-meta">
            <div className="meta-pill">
              <span>Created by</span>
              <strong>{PEOPLE[person].label}</strong>
            </div>
            <div className="meta-pill">
              <span>Assigned to</span>
              <strong>{PEOPLE[otherPerson].label}</strong>
            </div>
            <div className="meta-pill">
              <span>Language:</span>
              <strong>{LANGUAGE_COPY[language].label}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={isSaving}>
              {isSaving ? "Saving..." : `Create quiz for ${PEOPLE[otherPerson].label}`}
            </button>
            <Link to={`/${person}`} className="button button-secondary">
              Back to {getAreaLabel(person)}
            </Link>
          </div>
        </form>
      </Panel>
    </Layout>
  );
}
