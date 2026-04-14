import { LANGUAGE_COPY, PEOPLE } from "../lib/utils";

export default function AverageScoreCard({ person, averageScore, gradedCount }) {
  const info = PEOPLE[person];
  const numericAverage =
    averageScore === null || averageScore === undefined ? null : Number(averageScore);
  const progress = numericAverage === null ? 0 : Math.max(0, Math.min(100, (numericAverage / 10) * 100));
  const ringClass =
    info.nativeLanguage === "greek" ? "average-ring-greek" : "average-ring-french";

  return (
    <article className="average-score-card frosted-card">
      <div className="average-score-header">
        <div className="card-badge">{info.label}</div>
        <span className="average-score-copy">
          {LANGUAGE_COPY[info.learningLanguage].label} answers
        </span>
      </div>
      <div
        className={`average-ring ${ringClass}`}
        style={{ "--progress": `${progress}%` }}
      >
        <div className="average-ring-center">
          {numericAverage === null ? (
            <>
              <strong>--</strong>
              <span>No scores yet</span>
            </>
          ) : (
            <>
              <strong>{numericAverage.toFixed(1)}</strong>
              <span>/10 average</span>
            </>
          )}
        </div>
      </div>
      <p>
        Based on {gradedCount} graded {LANGUAGE_COPY[info.learningLanguage].label.toLowerCase()}{" "}
        quizzes.
      </p>
    </article>
  );
}
