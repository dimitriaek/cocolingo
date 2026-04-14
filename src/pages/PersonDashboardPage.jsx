import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../App";
import HistoryTable from "../components/HistoryTable";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import StatusBanner from "../components/StatusBanner";
import TaskCard from "../components/TaskCard";
import {
  getAreaLabel,
  getDashboardDataForPerson,
  getLanguageLabel,
  getThemeClass,
  HOME_ROUTE,
  isValidPerson,
  LANGUAGE_COPY,
  PEOPLE,
  getOtherPerson,
} from "../lib/utils";

export default function PersonDashboardPage() {
  const { person } = useParams();
  const { dashboard, isLoading, error } = useAppData();

  if (!isValidPerson(person)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  const info = PEOPLE[person];
  const personData = getDashboardDataForPerson(person, dashboard);
  const otherPerson = getOtherPerson(person);

  return (
    <Layout
      title={`${info.label} Area`}
      subtitle={`Create ${LANGUAGE_COPY[personData.createLanguage].label} quizzes, answer ${LANGUAGE_COPY[personData.answerLanguage].label} prompts, and keep score light and playful.`}
      breadcrumbs={[
        { label: "Home", to: HOME_ROUTE },
        { label: getAreaLabel(person) },
      ]}
    >
      {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}

      <section className="card-grid card-grid-three">
        <TaskCard
          title={`Answer ${getLanguageLabel(personData.answerLanguage, true)} quizzes`}
          copy={`Open ${LANGUAGE_COPY[personData.answerLanguage].label} phrases waiting for your translation.`}
          count={personData.pendingToAnswer.length}
          to={`/${person}/answer`}
          accent={getThemeClass(personData.answerLanguage)}
        />
        <TaskCard
          title={`Grade ${getLanguageLabel(personData.createLanguage, true)} submissions`}
          copy={`Score the ${LANGUAGE_COPY[personData.createLanguage].label} quizzes you created.`}
          count={personData.pendingToGrade.length}
          to={`/${person}/grade`}
          accent={getThemeClass(personData.createLanguage)}
        />
        <TaskCard
          title={`Create ${getLanguageLabel(personData.createLanguage, true)} quiz`}
          copy={`Write a fresh ${LANGUAGE_COPY[personData.createLanguage].label} pop quiz for ${PEOPLE[otherPerson].label}.`}
          count="+"
          to={`/${person}/create`}
          accent={getThemeClass(personData.createLanguage)}
        />
      </section>

      <section className="card-grid card-grid-two">
        <Panel
          title="Score snapshot"
          subtitle="Average is based on quizzes this person has answered and received a grade for."
        >
          {isLoading ? (
            <p className="empty-state">Updating score snapshot...</p>
          ) : (
            <div className="stat-highlight">
              <strong>{personData.averageScore ? `${personData.averageScore}/10` : "--"}</strong>
              <span>{personData.gradedHistory.length} graded attempts</span>
            </div>
          )}
        </Panel>

        <Panel
          title="Quick links"
          subtitle="Hop straight into the next little language task."
        >
          <div className="quick-links">
            <Link to={`/${person}/answer`} className="button button-secondary">
              Answer {LANGUAGE_COPY[personData.answerLanguage].label} quizzes
            </Link>
            <Link to={`/${person}/grade`} className="button button-secondary">
              Grade {LANGUAGE_COPY[personData.createLanguage].label} submissions
            </Link>
            <Link to={`/${person}/create`} className="button button-primary">
              Create quiz for {PEOPLE[otherPerson].label}
            </Link>
          </div>
        </Panel>
      </section>

      <Panel
        title={`Recent ${getLanguageLabel(personData.answerLanguage, true)} quiz history`}
        subtitle={`Recent ${LANGUAGE_COPY[personData.answerLanguage].label} answers and scores for ${info.label}.`}
      >
        <HistoryTable items={personData.gradedHistory.slice(0, 6)} />
      </Panel>
    </Layout>
  );
}
