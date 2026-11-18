# Fiqry Studio

**fiqry.studio** · Build. Create. Explore.

Fiqry Studio is a mobile-first personal digital studio for software, creative
work, and technology experiments. Phase 01 delivers the public landing page,
application structure, and development tooling.

## Stack

- Next.js App Router, React, strict TypeScript, and Tailwind CSS.
- Next.js Route Handlers with Zod validation at configuration and input boundaries.
- Supabase SSR and Supabase JS for the planned PostgreSQL, Auth, and Storage integration.
- npm and GitHub Actions for reproducible local and CI checks. Vercel is the planned host.

## Local setup

Use Node.js 22 LTS (22.13.0 or later in the 22.x series) and npm 10. The checked-in
lockfile is shared by Windows and Linux.

```sh
npm ci
npm run dev
```

Open [the homepage](http://localhost:3000) and [the liveness endpoint](http://localhost:3000/api/health).
The endpoint reports application liveness.

Supabase setup is optional. To use your own project, copy the template if
`.env.local` does not already exist.

Windows PowerShell:

```powershell
if (-not (Test-Path -LiteralPath .env.local)) {
    Copy-Item -LiteralPath .env.example -Destination .env.local
}
```

Ubuntu:

```bash
[ -e .env.local ] || cp .env.example .env.local
```

| Variable                               | Value                                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Project URL from the Supabase dashboard. Use the HTTPS origin, or an HTTP loopback origin for local development. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The project's `sb_publishable_…` key from the Supabase dashboard.                                                |

With both values blank, the client factories return `null`. Partial or invalid
settings throw when a factory is called. The landing page and liveness endpoint
work independently of Supabase. Live connectivity is deferred to Phase 04. Any
`NEXT_PUBLIC_` value may be included in the browser bundle. Keep private
credentials out of these settings and out of Git. Restart the dev server after
changes and rebuild for production.

## Scripts

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start Next.js in development mode.                   |
| `npm run build`        | Create a production build.                           |
| `npm run start`        | Serve the completed production build.                |
| `npm run lint`         | Run ESLint with Next.js rules.                       |
| `npm run typecheck`    | Generate route types and run TypeScript checks.      |
| `npm run format`       | Format source and documentation with Prettier.       |
| `npm run format:check` | Check formatting without writing changes.            |
| `npm test`             | Run the Node.js test runner with TypeScript support. |

On Windows, use `npm.cmd` in place of `npm` if PowerShell blocks `npm.ps1`.
For a local CI equivalent, run `npm ci` and the lint, typecheck, format check,
test, and build commands in order.

## Structure and phase status

- `src/app/(public)` contains the public layout and homepage.
- `src/app/api` contains backend routes, beginning with liveness.
- `src/lib/supabase` contains the separate browser and server client factories.
- `src/lib/validations` contains shared Zod schemas and validation.
- `tests` contains the liveness and environment validation tests.

The design system, navigation, and full public pages are scheduled for later
phases. See the [architecture](docs/ARCHITECTURE.md),
[Phase 01 implementation report](docs/PHASE_01_REPORT.md), and
[Phase 01 finalization report](docs/PHASE_01_FINALIZATION_REPORT.md).
