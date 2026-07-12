# Contributing

Thanks for taking the time to improve VueGridle.

## Development

```bash
npm install
npm run test
npm run build
npm run docs:build
```

## Pull Requests

- Keep changes focused and scoped.
- Add or update tests for behavior changes.
- Update README or docs when public API changes.
- Use clear commit messages, preferably Conventional Commits:
    - `fix: ...`
    - `feat: ...`
    - `docs: ...`
    - `chore: ...`

## Public API

The stable public API is `Grid`, `GridItem`, exported types, and documented props/events.
Internal composables are not considered stable unless they are explicitly documented.

## Reporting Bugs

Please include:

- VueGridle version
- Vue version
- Browser and OS
- Minimal reproduction
- Expected behavior and actual behavior
