import type { ReactNode } from "react";

export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} className="public-content">
        {children}
      </main>
    </div>
  );
}
