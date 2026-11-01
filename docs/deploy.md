# Contabo / PM2 deployment notes

Production runs as the PM2 app `portfolio`, port 3001. The verified deployed
release is `/root/projects/portfolio-releases/505a0ffcca57`. The original
checkout is `/root/projects/personal-blog-nextjs` on `master`. Keep that checkout
and its build intact until the new version has been verified and rollback is no
longer needed. Port 3100 belongs to Docker and must not be reused.

Prepare a detached worktree from the approved `rebranding-2026` revision under
`/root/projects/portfolio-releases/<commit>`. Install with `npm ci --include=dev`
because Velite, TypeScript and Tailwind are required to build the site. Node
22.12.0 on the VM meets the updated Next.js runtime requirement and supports the
consent test command.

Set the portfolio's verified GA4 Measurement ID through `GAID` before building.
Keep it in a private `.env.production.local` file for subsequent server starts.
`.env.example` documents the variable without providing a usable shared ID.
Without a valid `G-...` ID analytics is disabled and no opt-in banner is shown.
Do not deploy the local `.next-build`, which uses an intercepted test ID.

Run `npm run lint`, `npm run test:consent`, `npm run test:analytics`, then
`NODE_ENV=production NEXT_BUILD_DIR=.next npm run build` in the release directory.
The build uses webpack deliberately for the existing Velite plugin. Compiler
tooling is imported only while building, rather than when the production server
reads its configuration. `build:vm` is a build-only alias; PM2 owns the server
lifecycle.

Before switching the live process, check that a separate loopback port is free,
start the release there, and run `check:seo` and `check:privacy` against that
origin. Stop only that temporary process after the checks. Save a private,
per-app rollback configuration for the existing `portfolio` process before
changing its cwd. The ecosystem file contains only `portfolio`, explicitly sets
its release-directory cwd and port 3001. For a change of release directory,
save the old per-app launch configuration first, remove only `portfolio` from
PM2, then start the new ecosystem file with `--only portfolio --env production`.
This recreates the process with the intended cwd and causes a brief interruption.
Verify cwd, status, port and HTTP checks, with the saved configuration available
for rollback. Do not restart unrelated apps.

After switching, check the loopback service and public HTTPS domain, including
cookie accept/reject/withdrawal in a fresh browser. Check GA4 Realtime only after
explicitly accepting analytics. Verify the public HTML actually represents the
new release before concluding the deploy succeeded; review Cloudflare caching
if the origin and public site differ.

## Verification of the dependency refresh

- Next.js 16.4.3, React 19 and Mongoose 8.24.7 replace the versions with confirmed
  critical advisories. Routes use asynchronous params/searchParams, and linting
  uses the ESLint CLI/flat config required by the updated framework.
- `npm audit --omit=dev` reported zero vulnerabilities on 2026-11-01. Build-only
  Tailwind plugins are correctly declared under devDependencies.
- Full `npm audit` still reports 24 build/development findings (21 moderate,
  3 high), including the Velite image/transpilation toolchain. They have not been
  silently dismissed or fixed with forced downgrades. These tools process the
  repository's authored content at build time; production startup no longer
  imports Velite. This is not a claim that all development tooling is vulnerability-free.
- The obsolete view-writing API is retired for both GET registerView and POST
  views. Historical aggregate GET reads remain supported; stored records are
  not deleted.

Official references:

- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://pm2.keymetrics.io/docs/usage/process-management/
- https://support.google.com/analytics/answer/9539598
