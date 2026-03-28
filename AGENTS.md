# Field — notes for AI assistants

Open the **repository root** (`Field/`), not only `field-demo/`.

## Where things live

| Area | Path |
|------|------|
| Angular workspace (CLI, `package.json`) | [`field-demo/`](field-demo/) |
| Publishable **components** library | [`field-demo/projects/components/`](field-demo/projects/components/) |
| **Playground** demo app | [`field-demo/projects/playground/`](field-demo/projects/playground/) |
| Cursor rules | [`.cursor/rules/`](.cursor/rules/) |

## Commands (run from `field-demo/`)

- Dev server: `npm start` → http://localhost:4200/
- Lint: `npm run lint` · Format: `npm run format` / `npm run format:check`
- Tests: `npm run test:lib` (library) · `npm run test:all -- --watch=false` (library + playground)
- Build: `npm run build:all`
- GitHub Pages (after library/playground changes): `npm run deploy:gh-pages`

## Library API

Apps import from **`components`** (TS path alias → [`field-demo/projects/components/src/public-api.ts`](field-demo/projects/components/src/public-api.ts)). Domain barrels: [`src/public-api/`](field-demo/projects/components/src/public-api/) (`field.ts`, `chips.ts`, `core.ts`).

Adding a component: see **Checklist: new library component** in [`.cursor/rules/components-architecture.mdc`](.cursor/rules/components-architecture.mdc).

## Related rules

- [workspace-repo.mdc](.cursor/rules/workspace-repo.mdc) — repo layout, CI, GitHub
- [library-vs-playground.mdc](.cursor/rules/library-vs-playground.mdc) — what belongs in the library vs demo
- [testing.mdc](.cursor/rules/testing.mdc) — Vitest, spec locations
