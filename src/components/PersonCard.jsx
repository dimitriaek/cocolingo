import { Link } from "react-router-dom";
import { getAreaLabel, PEOPLE } from "../lib/utils";

export default function PersonCard({ person, summary }) {
  const info = PEOPLE[person];
  const answerCount = summary.pendingToAnswer.length;
  const gradeCount = summary.pendingToGrade.length;

  return (
    <Link to={`/${person}`} className="person-card frosted-card">
      <div className="card-badge">{info.label} Area</div>
      <h2>{info.label} Area</h2>
      <p>{info.accentCopy}</p>
      <div className="person-card-meta">
        <span>{answerCount} to answer</span>
        <span>{gradeCount} to grade</span>
        <span>{summary.averageScore ? `${summary.averageScore}/10 avg` : "No scores yet"}</span>
      </div>
      <span className="inline-link">Open {getAreaLabel(person)}</span>
    </Link>
  );
}
