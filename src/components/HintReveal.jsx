export default function HintReveal({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <details className="hint-reveal">
      <summary>{label}</summary>
      <p>{value}</p>
    </details>
  );
}
