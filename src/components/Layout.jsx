import { Link } from "react-router-dom";
import { HOME_ROUTE } from "../lib/utils";

export default function Layout({
  children,
  title,
  subtitle,
  themeClass = "",
  breadcrumbs = [],
  actions = null,
  heroLogo = "none",
  heroCentered = false,
  hideTitle = false,
}) {
  return (
    <div className={`app-shell ${themeClass}`.trim()}>
      <div className="background-glow background-glow-a" />
      <div className="background-glow background-glow-b" />
      <div className="background-glow background-glow-c" />
      <main className="page-wrap">
        <header className={`hero-card frosted-card ${heroCentered ? "hero-card-centered" : ""}`.trim()}>
          <div className="hero-topline">
            <Link to={HOME_ROUTE} className="brand-link">
              <img
                src="/cocolingo_logo.png"
                alt="CocoLingo logo"
                className="brand-logo"
              />
              CocoLingo
            </Link>
            {actions}
          </div>
          {breadcrumbs.length ? (
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              {breadcrumbs.map((crumb, index) =>
                crumb.to ? (
                  <Link key={`${crumb.label}-${index}`} to={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span key={`${crumb.label}-${index}`}>{crumb.label}</span>
                ),
              )}
            </nav>
          ) : null}
          {heroLogo !== "none" ? (
            <div className={`hero-logo hero-logo-${heroLogo}`}>
              <img src="/cocolingo_logo.png" alt="CocoLingo logo" />
            </div>
          ) : null}
          {!hideTitle ? <h1>{title}</h1> : null}
          <p>{subtitle}</p>
        </header>
        {children}
      </main>
    </div>
  );
}
