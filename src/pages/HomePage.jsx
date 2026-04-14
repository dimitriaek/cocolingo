import { useAppData } from "../App";
import AverageScoreCard from "../components/AverageScoreCard";
import Layout from "../components/Layout";
import Panel from "../components/Panel";
import PersonCard from "../components/PersonCard";
import StatusBanner from "../components/StatusBanner";
import { getDashboardDataForPerson } from "../lib/utils";

export default function HomePage() {
  const { dashboard, error } = useAppData();

  const dimitriSummary = getDashboardDataForPerson("dimitri", dashboard);
  const priscilaSummary = getDashboardDataForPerson("priscila", dashboard);

  return (
    <Layout
      title="CocoLingo"
      subtitle="Tiny language pop quizzes between Dimitri and Priscila."
      heroLogo="large"
      heroCentered
      hideTitle
    >
      {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}
      <section className="card-grid card-grid-two">
        <PersonCard person="dimitri" summary={dimitriSummary} />
        <PersonCard person="priscila" summary={priscilaSummary} />
      </section>

      <Panel
        title="Score competition"
        subtitle="A quick look at each person's average on the quizzes they answered."
      >
        <div className="average-score-grid">
          <AverageScoreCard
            person="dimitri"
            averageScore={dimitriSummary.averageScore}
            gradedCount={dimitriSummary.gradedHistory.length}
          />
          <AverageScoreCard
            person="priscila"
            averageScore={priscilaSummary.averageScore}
            gradedCount={priscilaSummary.gradedHistory.length}
          />
        </div>
      </Panel>
    </Layout>
  );
}
