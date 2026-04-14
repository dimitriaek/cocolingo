export default function Panel({ title, subtitle, rightSlot = null, children, className = "" }) {
  return (
    <section className={`frosted-card panel ${className}`.trim()}>
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}
