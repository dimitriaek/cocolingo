import { formatDate, LANGUAGE_COPY } from "../lib/utils";

export default function HistoryTable({ items }) {
  if (!items.length) {
    return <p className="empty-state">No graded quiz history yet.</p>;
  }

  return (
    <div className="history-list">
      {items.map((item) => (
        <article key={item.id} className="history-card">
          <div className={`language-pill ${LANGUAGE_COPY[item.quiz?.language]?.pillClass || ""}`}>
            {LANGUAGE_COPY[item.quiz?.language]?.label || item.quiz?.language}
          </div>
          <h3>{item.quiz?.phrase}</h3>
          <p>
            <strong>Answer:</strong> {item.answer_text}
          </p>
          <p>
            <strong>Score:</strong> {typeof item.score === "number" ? `${item.score}/10` : "Pending"}
          </p>
          {item.grading_note ? (
            <p>
              <strong>Note:</strong> {item.grading_note}
            </p>
          ) : null}
          <div className="history-meta">
            <span>Submitted {formatDate(item.submitted_at)}</span>
            <span>Graded {formatDate(item.graded_at)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
