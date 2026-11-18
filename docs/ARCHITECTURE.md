# Fiqry Studio architecture

## App Router

`src/app/layout.tsx` owns the HTML document, fonts, metadata, and global
styles. `src/app/(public)/layout.tsx` owns the public content shell and skip
link. Route groups organize layouts without changing URLs, so the homepage
within `(public)` resolves to `/`. Keep pages as Server Components unless they
need client state, event handlers, or browser APIs.

The future admin group will contain an explicit `admin/` directory for
`/admin` URLs and its own layout. A layout can organize the UI. Server routes
and operations must independently verify the identity and authorization of the
caller. This includes reads, mutations, and file access.

## Mobile-first layout

Global CSS defines the brand palette, focus, spacing, radius, and glass tokens
in one place. Tailwind exposes the shared visual tokens to components. The
public layout uses intrinsic widths, safe-area insets, and fluid spacing.
Typography stacks on narrow screens and expands to a single line when space
allows. The skip link reserves space beyond the safe-area edges for its
keyboard focus outline. Use visible focus, at least 44 px touch targets for
primary controls, and reduced-motion styles in later UI work.

The public layout can host a desktop top navigation with Home, Work, Explore,
About, and a Contact CTA. On mobile, the future bottom navigation can reserve
room through `--public-bottom-nav-space` in addition to the shell's safe-area
padding. Keep enough room for focused elements and scrolled content.

## Route Handlers

`src/app/api/health/route.ts` returns an uncached HTTP 200 and
`{ "status": "ok" }`. It can be checked independently of all external services.

For routes that accept input, declare Zod schemas under `src/lib/validations`.
Use `safeParse` on untrusted request values and return a stable JSON error shape
such as `{ "error": { "code": "INVALID_INPUT", "message": "Check the submitted values." } }`.
Use a typed response contract when a client consumes the route. Return 400 for
malformed input, 401 for missing identity, 403 for denied access, and a generic
500 for unexpected failures. Keep diagnostics server-side and redact sensitive
fields.

Endpoints that accept request bodies should declare a content type and size
limit appropriate to the operation. Reject oversized bodies with 413 before
parsing JSON. Enforce the cap on bytes read from the stream, because the
`Content-Length` header can be absent. Keep handlers thin and put shared business
rules in server-only modules once features need them.

## Supabase

The browser factory creates a client with the public project URL and a
publishable key. The server factory is request-scoped and reads cookies from
Next.js behind a `server-only` boundary. Both validate public configuration when
called and return `null` when the integration is intentionally unconfigured.

Live Supabase connectivity is deferred to Phase 04. The server factory is
read-only in Phase 01. Before adding Auth, use Next.js Proxy to refresh the
session with verified claims. Pass refreshed cookies to both the downstream
request and the outgoing response. Apply the cache headers supplied to
`setAll` and keep session-bearing responses out of shared caches, including
when replacing a response with a redirect. Verify identity and role server-side
for protected routes and enforce authorization in PostgreSQL and Storage with
RLS. Add migrations, database types, and upload validation when their features
arrive. [Supabase SSR guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs)

## CI, hosting, and security

GitHub Actions installs from the npm lockfile and runs the quality gates on
pull requests and pushes to `main`. The workflow has read-only repository access
and uses no Supabase credentials.

The planned Vercel deployment serves public pages and same-origin Route
Handlers. Configure project variables separately for Preview and Production
once those environments exist. Supabase will manage the database, identity,
and object storage.

The application sets framing, MIME-sniffing, referrer, and browser permission
headers. Design and verify a CSP when script and asset requirements are known.
Auth, RLS, rate limiting, and upload controls need verification when introduced.
