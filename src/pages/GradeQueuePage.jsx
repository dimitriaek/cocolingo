import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../App";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import StatusBanner from "../components/StatusBanner";
import {
  formatDate,
  getAreaLabel,
  getDashboardDataForPerson,
  getLanguageLabel,
  getThemeClass,
  HOME_ROUTE,
  isValidPerson,
  LANGUAGE_COPY,
  PEOPLE,
} from "../lib/utils";

export default function GradeQueuePage() {
  const { person } = useParams();
  const { dashboard, error, isLoading } = useAppData();

  if (!isValidPerson(person)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  const personData = getDashboardDataForPerson(person, dashboard);
  const language = personData.createLanguage;

  return (
    <Layout
      title={`Grade ${getLanguageLabel(language, true)} submissions`}
      subtitle={`Submitted answers waiting for ${PEOPLE[person].label} to score.`}
      themeClass={getThemeClass(language)}
      breadcrumbs={[
        { label: "Home", to: HOME_ROUTE },
        { label: getAreaLabel(person), to: `/${person}` },
        { label: "Grade submissions" },
      ]}
    >
      {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}
      <Panel
        title={`${getLanguageLabel(language, true)} submissions to grade`}
        subtitle="Open a submission, score it from 0 to 10, and optionally leave a short note."
      >
        {isLoading ? (
          <p className="empty-state">Loading submitted answers...</p>
        ) : personData.pendingToGrade.length ? (
          <div className="stack-list">
            {personData.pendingToGrade.map((submission) => (
              <article key={submission.id} className="list-item">
                <div className="list-item-copy">
                  <div className={`language-pill ${LANGUAGE_COPY[submission.quiz.language].pillClass}`}>
                    {LANGUAGE_COPY[submission.quiz.language].label}
                  </div>
                  <h3>{submission.quiz.phrase}</h3>
                  <p>{submission.answer_text}</p>
                  <div className="list-item-meta">
                    <span>Submitted {formatDate(submission.submitted_at)}</span>
                    <span>By {PEOPLE[submission.submitted_by].label}</span>
                  </div>
                </div>
                <Link to={`/${person}/grade/${submission.id}`} className="button button-primary">
                  Grade now
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No {LANGUAGE_COPY[language].label.toLowerCase()} submissions need grading right now.</p>
        )}
      </Panel>
    </Layout>
  );
}
