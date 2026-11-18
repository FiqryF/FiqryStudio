# Fiqry Studio — Phase 01 finalization

Verification date: 18 November 2026 (Asia/Jakarta)

## Previous findings and repository review

The [implementation report](PHASE_01_REPORT.md) recorded a successful local
build and browser smoke test, with an open lint dependency advisory and no
remote CI or live Supabase verification. For finalization, the source,
configuration, tests, documentation, Git state, and npm lockfile were reviewed.
The worktree was on the initial `main` branch with no staged files, commits, or
remote.

The App Router public route group, server-rendered homepage, liveness handler,
strict TypeScript configuration, and `@/*` alias fit the existing project
structure. Supabase validation is shared, browser configuration uses static
`NEXT_PUBLIC_` references, and the request-scoped server module imports
`server-only`. Both factories validate settings when called. The server
factory reads cookies using the Next.js request context. The
[architecture guide](ARCHITECTURE.md) describes future session refresh,
authorization, and cache handling.

## Issues and fixes

- Before the fix, the skip-link focus outline crossed the simulated cutout edge
  on mobile. The link now has additional clearance beyond the top and left
  safe-area insets. The browser regression checks the outline bounds as well
  as keyboard activation.
- Chrome reported a 404 for `/favicon.ico` during the development smoke test.
  Added a 190-byte favicon using Midnight Black and Sky Blue. The browser
  regression checks the icon link, image response, and console output.
- Git ignored `.pem` and `.key` files but missed other common private key
  names. The ignore rules now include PKCS#12, PuTTY, and standard OpenSSH
  private key filenames. `git check-ignore` verified representative examples.

## Dependency security

| Command                                | Result                                                                                                                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                               | Passed. Created a clean Windows installation from the lockfile and reported the open advisory.                                                           |
| `npm audit`                            | Exit 1. One high-severity advisory, GHSA-fc5q-39xc-vjpf, led to 14 high-severity package entries in the development graph.                               |
| `npm audit --omit=dev`                 | Exit 0. Zero vulnerabilities reported for production dependencies.                                                                                       |
| `npm outdated`                         | Exit 1. The installed and wanted versions matched. Newer releases were outside the declared ranges for ESLint, TypeScript, Node types, and Supabase SSR. |
| `npm ls picomatch` and `npm ls eslint` | Exit 0. Confirmed both dependency trees and a consistent ESLint installation.                                                                            |
| `npm ls next react react-dom`          | Exit 0. Confirmed Next.js 16.4.6 and deduplicated React and React DOM 19.3.1.                                                                            |

The advisory affects `picomatch` 2.3.2 and 4.0.7 in these development paths
under `eslint-config-next`:

- `@next/eslint-plugin-next → fast-glob → micromatch → picomatch@2.3.2`
- `eslint-import-resolver-typescript → tinyglobby → picomatch@4.0.7`, also
  resolved by `fdir`
- `typescript-eslint → @typescript-eslint/typescript-estree → tinyglobby → picomatch@4.0.7`

The latest published `picomatch` was 4.0.7, and GitHub's advisory listed no
patched release. Retain repository-controlled lint patterns and the existing CI
job timeout. Review both installed dependency paths when upstream publishes a
patch, then repeat the clean install, audits, and lint checks. The full
dependency tree and lockfile were retained. [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)

ESLint 9.39.5 is end-of-life. ESLint 10.15.0 supports the project's Node.js
version. The current Next.js preset includes React 7.37.5, import 2.32.0, and
JSX accessibility 6.10.2 plugins whose published peer ranges end at ESLint 9.
The React Hooks and TypeScript ESLint plugins accept ESLint 10. Revisit the
upgrade when the full preset supports ESLint 10 and can be installed with
normal peer resolution. [ESLint release support](https://eslint.org/version-support/)

## Local quality gate and smoke tests

| Command or check         | Result                                                                                                                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`           | Passed with zero warnings.                                                                                                                                                                                                                                                                  |
| `npm run typecheck`      | Passed after Next.js route type generation.                                                                                                                                                                                                                                                 |
| `npm run format:check`   | Passed.                                                                                                                                                                                                                                                                                     |
| `npm test`               | Five passed. Coverage includes the uncached health contract, absent Supabase configuration, valid configuration and loopback, partial and invalid settings, and privileged-key rejection without echoing the key.                                                                           |
| Supabase factory fixture | Passed. Browser and server factories returned `null` with no settings, rejected partial settings and privileged credentials, and accepted a synthetic publishable key. The server factory read a fixture cookie through the Next.js request context. The fixture ran with zero fetch calls. |
| `npm run build`          | Passed using Turbopack with local worker communication enabled. The homepage was prerendered and the health handler remained dynamic.                                                                                                                                                       |
| `npm run dev`            | Passed in Chrome at 390×844 without Supabase settings.                                                                                                                                                                                                                                      |
| `npm run start`          | Passed in Chrome at all ten viewports and Firefox at 390×844 without Supabase settings.                                                                                                                                                                                                     |

Both modes returned HTTP 200 for `/`, `/api/health`, and `/favicon.ico`. Chrome
verified page metadata, same-origin fonts, and zero browser console errors.
The health endpoint returned exactly `{"status":"ok"}` with
`Cache-Control: no-store`. The homepage and health endpoint returned the
expected `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
`Permissions-Policy` headers, with the framework identification header absent.
Temporary server and browser processes were terminated after testing.

## Mobile-first and accessibility regression

| Class   | Chrome production viewports                 | Result |
| ------- | ------------------------------------------- | ------ |
| Mobile  | 320×640, 360×800, 375×812, 390×844, 430×932 | Pass   |
| Tablet  | 768×1024, 820×1180                          | Pass   |
| Desktop | 1024×768, 1440×900, 1920×1080               | Pass   |

Chrome 157.0.8103.79 on Windows ran through Playwright Core 1.65.1. Text bounds
and responsive spacing passed at all ten sizes with zero horizontal overflow.
The headline stacked on mobile and tablet and fit on one line at each desktop
size. A separate 320×640 check passed with the root text size set to 200%.
DevTools injected top, right, bottom, and left safe-area insets of 52, 34, 40,
and 38 px. Shell padding, skip-link focus clearance, and activation passed.
Representative 390×844 and 1440×900 screenshots were captured.

Chrome verified the English document language, a single `main` landmark,
heading hierarchy, accessible names, keyboard focus and skip-link activation,
viewport metadata, and reduced-motion behavior. axe-core 4.14.1 reported zero
violations under `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa`.
The passing rule IDs were `aria-allowed-attr`, `aria-conditional-attr`,
`aria-deprecated-role`, `aria-hidden-body`, `aria-hidden-focus`,
`aria-prohibited-attr`, `aria-required-attr`, `aria-roles`, `aria-valid-attr`,
`aria-valid-attr-value`, `bypass`, `color-contrast`, `document-title`,
`duplicate-id-aria`, `html-has-lang`, `html-lang-valid`, `link-name`,
`meta-viewport`, and `target-size`. Axe reported no incomplete rules.

Firefox 143.0 on Windows independently passed a production smoke check for
rendering, narrow viewport overflow, fonts, liveness, and console errors.
Physical devices and screen readers were outside the tested scope.

## CI and cross-platform review

`actionlint` 1.7.12 passed on `.github/workflows/ci.yml`. The workflow installs
with `npm ci` and runs lint, typecheck, formatting, tests, and build on
`ubuntu-latest`. It triggers on pull requests and pushes to `main`, uses
read-only contents permissions, disables persisted checkout credentials, and
requires no production secrets. GitHub Actions execution awaits the first push
to an owner-configured GitHub remote.

Local verification used Windows, Node.js 22.13.0, and npm 10.9.2.
`.nvmrc`, the package engine, the README, and CI all use Node.js 22 LTS. The
shared scripts and case-sensitive import paths were reviewed. The lockfile
contains both platform variants for the native Next.js, Tailwind, Lightning CSS,
and esbuild packages. WSL had only the Docker Desktop internal distribution.
Ubuntu runtime verification remains pending.

## Final acceptance and outstanding work

| Criterion                                                       | Result                                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Preserve the App Router architecture and Phase 01 scope         | Verified.                                                                      |
| Review dependencies and apply compatible fixes                  | Verified. No patched `picomatch` or compatible ESLint 10 preset was available. |
| Pass strict types, lint, formatting, automated tests, and build | Passed.                                                                        |
| Pass dev and production browser smoke tests                     | Passed.                                                                        |
| Verify mobile-first layout and accessibility baseline           | Passed for the documented viewports, engines, and checks.                      |
| Verify the security baseline and Supabase foundation            | Passed for HTTP, Git, and fixture checks.                                      |
| Verify CI and review Windows and Ubuntu compatibility           | Local CI checks and Windows passed. Remote CI and Ubuntu runtime are pending.  |
| Complete documentation and prepare the source for commit        | Verified.                                                                      |

**PASS WITH NOTES.** The source is ready for the owner's initial commit and for
Phase 02 design-system and navigation work. The development advisory and
unsupported ESLint release remain documented. Remote CI awaits a GitHub
repository and the first push. Ubuntu smoke testing awaits an Ubuntu
environment. Live Supabase connectivity is deferred to Phase 04.
Authentication and authorization, schema, RLS, Storage, and deployment remain
in their later phases.

## Git handoff

The 27 files intended for version control include `package-lock.json`.
`git diff --check` and a whitespace check over the untracked files found no
issues. The Git index was empty, and a local scan found no recognizable actual
credentials in the intended files. Browser captures and regression harnesses
were kept outside the repository. No commit or push was made.

After creating an empty GitHub repository, replace the example URL with its
actual HTTPS URL and run the following from the project directory.

```sh
git add -- .
git diff --cached --check
git diff --cached --stat
git commit -m "chore: initialize and finalize Fiqry Studio phase 01 foundation"
git remote add origin "https://github.com/OWNER/REPO.git"
git push -u origin main
```
