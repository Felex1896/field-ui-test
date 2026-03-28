# FieldDemo

Angular **workspace** inside the **Field** repo. **Run all commands from this directory** (`field-demo/`).

- **`projects/components/`** — Shared UI library: **`field/`**, **`chips/`**, **`core/`** (icons, tokens, services). Import from the `components` path in apps.
- **`projects/playground/`** — Playground app (preview + controls) served locally and on GitHub Pages.

Generated with [Angular CLI](https://github.com/angular/angular-cli) 21.2.x.

## Development server

```bash
npm start
# same as: ng serve playground
```

Open `http://localhost:4200/`. The app reloads when you change playground or library source.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

```bash
npm run build          # playground only (typical)
npm run build:all      # library (ng-packagr) then playground
```

Artifacts: `dist/playground/`, and `dist/components/` when you build the library.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
