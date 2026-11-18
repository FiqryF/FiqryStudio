export default function HomePage() {
  return (
    <section className="studio-intro" aria-labelledby="studio-title">
      <p className="studio-wordmark font-mono">
        fiqry<span className="text-accent">.</span>studio
      </p>

      <div className="studio-message">
        <h1 id="studio-title" className="studio-title">
          <span>Build.</span> <span>Create.</span>{" "}
          <span className="text-accent">Explore.</span>
        </h1>
        <p className="studio-description text-muted">
          A personal digital studio for software, creative work, and technology
          experiments.
        </p>
      </div>

      <p className="studio-status font-mono text-muted">
        <span className="status-light" aria-hidden="true" />
        <span>Website under development</span>
      </p>
    </section>
  );
}
