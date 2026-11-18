# Phase 01 — Project setup, architecture, and foundation

Implementation date: 18 November 2026 (Asia/Jakarta)

This report records the initial implementation. See the
[finalization report](PHASE_01_FINALIZATION_REPORT.md) for the regression results
and current acceptance status.

## Delivered

- Initialized the empty workspace as a Git repository on `main` and set up npm,
  Next.js App Router, strict TypeScript, and the `@/*` source alias.
- Built the branded public homepage with the requested copy, local Geist fonts,
  a keyboard skip link, safe-area spacing, and a mobile-first type layout.
- Added Tailwind CSS design tokens, viewport settings, and text-only Open Graph
  metadata.
- Added a liveness Route Handler, lazy browser and server Supabase clients,
  Zod configuration checks, and tests for both contracts.
- Added GitHub Actions CI and local setup, architecture, and phase documentation.

## Files created

| Area          | Files                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| App Router    | `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`, `src/app/api/health/route.ts`                       |
| Supabase      | `src/lib/supabase/{client,server,config}.ts`, `src/lib/validations/supabase-env.ts`, `.env.example`                                                          |
| Tooling       | `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.nvmrc`, `.gitignore`, `.prettierignore` |
| Tests and CI  | `tests/health.test.ts`, `tests/supabase-env.test.ts`, `.github/workflows/ci.yml`                                                                             |
| Documentation | `README.md`, `docs/ARCHITECTURE.md`, `docs/PHASE_01_REPORT.md`                                                                                               |

## Dependencies

| Purpose                 | Installed versions                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| App framework           | Next.js 16.4.6, React and React DOM 19.3.1                                                                        |
| Styling and typography  | Tailwind CSS and Tailwind PostCSS plugin 4.3.5, Geist 1.9.2                                                       |
| Services and validation | Supabase JS 2.119.0, Supabase SSR 0.10.3, Zod 4.6.7, server-only 0.0.1                                            |
| Development             | TypeScript 5.9.3, Node and React types, ESLint 9.39.5, Next.js ESLint config 16.4.6, Prettier 3.10.1, tsx 4.23.15 |
| Test runner             | Node.js `node:test` with tsx for TypeScript imports                                                               |

ESLint 9 is used for compatibility with the React plugin in the Next.js preset.
The registry marks ESLint 9 as unsupported. The React plugin's current peer
range ends with ESLint 9.

## Verification

The checks ran on Windows with Node.js 22.13.0 and npm 10.9.2.

| Command or check                               | Result                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install --package-lock-only`              | Generated the npm lockfile. The initial full installation had timed out at the registry.                                                                                                                                                                                                                                                     |
| `npm ci --no-audit --no-fund --prefer-offline` | Passed. Installed 378 packages locally. Linux variants of the native build packages are recorded in the lockfile.                                                                                                                                                                                                                            |
| `npm run lint`                                 | Passed with zero warnings after naming the PostCSS configuration export.                                                                                                                                                                                                                                                                     |
| `npm run typecheck`                            | Passed with strict TypeScript and generated Next.js route types.                                                                                                                                                                                                                                                                             |
| `npm run format` and `npm run format:check`    | Passed.                                                                                                                                                                                                                                                                                                                                      |
| `npm test`                                     | Five passed. Checks cover liveness, missing and valid Supabase configuration, invalid or partial settings, and privileged-key rejection.                                                                                                                                                                                                     |
| `npm run build`                                | Passed. Next.js prerendered `/` and built `/api/health` as a dynamic route. The sandboxed attempt could not connect to Turbopack's local PostCSS worker. The same command passed with local worker communication available.                                                                                                                  |
| `npm run dev`                                  | Served `/` and `/api/health` with HTTP 200 on loopback without Supabase configuration.                                                                                                                                                                                                                                                       |
| `npm run start`                                | Served the production build on loopback. Health JSON, `Cache-Control`, and all configured security headers matched expectations.                                                                                                                                                                                                             |
| Chrome, Playwright Core, and axe-core          | Passed at 320×640, 390×844, 768×1024, 1024×768, 1440×900, and 1920×1080. Checked heading reflow, zero horizontal overflow, keyboard skip-link focus and activation, metadata, local fonts, and reduced-motion emulation. Zero violations were reported by the selected WCAG 2.0/2.1 A and AA rules. Inspected 390×844 and 1440×900 captures. |
| CI workflow YAML                               | Parsed successfully. Verified event triggers, read-only permissions, and command order.                                                                                                                                                                                                                                                      |
| `git check-ignore` and `git ls-files`          | Verified representative local environment, key, dependency, and build files are ignored. The repository has no commits.                                                                                                                                                                                                                      |
| `npm audit` and `npm audit --omit=dev`         | One underlying advisory in the development graph surfaced through 14 package entries. Production dependency audit reported zero vulnerabilities.                                                                                                                                                                                             |

The homepage uses a type-led layout with Geist Sans and Geist Mono. The
verification run also confirmed that disabling Next.js managed agent rules
keeps `next dev` from creating an extra repository file.

## Security considerations

- `.gitignore` excludes local environment files, private key files, and build
  outputs. The example contains empty public settings.
- The server-only Supabase module uses the publishable key and request cookies.
  Invalid configuration errors omit input values. A later Auth phase must wire
  cookie writes, refresh, and cache handling.
- HTTP headers disable framing and MIME sniffing, limit cross-origin referrer
  details, and disable unused browser capabilities. Liveness discloses a single
  status field.
- The full npm audit flagged the development-only `picomatch` advisory through
  the Next.js lint dependency tree. The registry's latest release was 4.0.7,
  and the advisory listed no patched release at verification time.
  `npm audit --omit=dev` found zero known vulnerabilities in the production
  graph. [GitHub advisory GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)

## Known limitations and deferred work

- Live Supabase connectivity is deferred to Phase 04. Verification used empty
  configuration and unit test fixtures.
- GitHub Actions is configured locally. A remote run requires publishing the
  repository. Vercel deployment is a later phase.
- Browser verification used Chrome emulation. Physical mobile devices, other
  browser engines, and assistive technologies were outside the tested scope.
- The final design system, navigation, content, admin authentication and
  dashboard, database schema and RLS, Storage, guestbook, interactive features,
  rate limits, and upload controls are scheduled for later phases.

## Acceptance and next phase

| Criterion                                                                   | Result                                                                       |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| App Router initialization and local execution                               | Pass in development and production modes.                                    |
| Strict TypeScript, lint, formatting, typecheck, tests, and production build | Pass.                                                                        |
| Mobile-first foundation and responsive, accessible homepage                 | Pass for the browser and accessibility checks documented above.              |
| Environment configuration and Supabase clients                              | Implemented and fixture-tested. Live connectivity is unverified.             |
| Git hygiene                                                                 | Environment and private key exclusions verified. No commit or push was made. |
| CI configuration                                                            | Verified locally. GitHub Actions execution is unverified.                    |
| Architecture and Phase 01 documentation                                     | Complete.                                                                    |

**PASS WITH NOTES.** The repository is ready for the Phase 02 design system and
navigation work. Live Supabase and GitHub Actions execution remain unverified,
and the development dependency advisory remains open.
