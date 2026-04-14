import { Link } from "react-router-dom";

export default function TaskCard({ title, copy, count, to, accent = "" }) {
  return (
    <Link to={to} className={`task-card frosted-card ${accent}`.trim()}>
      <div className="task-card-top">
        <span className="task-count">{count}</span>
        <span className="task-arrow">Open</span>
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </Link>
  );
}
