import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../App";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import StatusBanner from "../components/StatusBanner";
import {
  formatDate,
  getAreaLabel,
  getDashboardDataForPerson,
  getThemeClass,
  HOME_ROUTE,
  isValidPerson,
  LANGUAGE_COPY,
  PEOPLE,
} from "../lib/utils";

export default function AnswerQueuePage() {
  const { person } = useParams();
  const { dashboard, error, isLoading } = useAppData();

  if (!isValidPerson(person)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  const personData = getDashboardDataForPerson(person, dashboard);
  const language = personData.answerLanguage;

  return (
    <Layout
      title={`Answer ${LANGUAGE_COPY[language].label} quizzes`}
      subtitle={`Open prompts waiting for ${PEOPLE[person].label}.`}
      themeClass={getThemeClass(language)}
      breadcrumbs={[
        { label: "Home", to: HOME_ROUTE },
        { label: getAreaLabel(person), to: `/${person}` },
        { label: "Answer quizzes" },
      ]}
    >
      {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}
      <Panel
        title="Pending quizzes"
        subtitle="Each one is a quick pop quiz with hints you can reveal when needed."
      >
        {isLoading ? (
          <p className="empty-state">Loading pending quizzes...</p>
        ) : personData.pendingToAnswer.length ? (
          <div className="stack-list">
            {personData.pendingToAnswer.map((quiz) => (
              <article key={quiz.id} className="list-item">
                <div className="list-item-copy">
                  <div className={`language-pill ${LANGUAGE_COPY[quiz.language].pillClass}`}>
                    {LANGUAGE_COPY[quiz.language].label}
                  </div>
                  <h3>{quiz.phrase}</h3>
                  <p>{quiz.general_hint}</p>
                  <div className="list-item-meta">
                    <span>Created {formatDate(quiz.created_at)}</span>
                    <span>From {PEOPLE[quiz.created_by].label}</span>
                  </div>
                </div>
                <Link to={`/${person}/answer/${quiz.id}`} className="button button-primary">
                  Open quiz
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No open quizzes right now. Time to create one instead.</p>
        )}
      </Panel>
    </Layout>
  );
}
