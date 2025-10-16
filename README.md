# `@aegisjsproject/router`

Firebase account and authentication route modules for `@aegisjsproject/router`

[![CodeQL](https://github.com/AegisJSProject/firebase-account-routes/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AegisJSProject/firebase-account-routes/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/AegisJSProject/firebase-account-routes/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/AegisJSProject/firebase-account-routes/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/AegisJSProject/firebase-account-routes.svg)](https://github.com/AegisJSProject/firebase-account-routes/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/AegisJSProject/firebase-account-routes.svg)](https://github.com/AegisJSProject/firebase-account-routes/commits/master)
[![GitHub release](https://img.shields.io/github/release/AegisJSProject/firebase-account-routes?logo=github)](https://github.com/AegisJSProject/firebase-account-routes/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@aegisjsproject/firebase-account-routes)](https://www.npmjs.com/package/@aegisjsproject/firebase-account-routes)
![node-current](https://img.shields.io/node/v/@aegisjsproject/firebase-account-routes)
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@aegisjsproject/firebase-account-routes)
[![npm](https://img.shields.io/npm/dw/@aegisjsproject/firebase-account-routes?logo=npm)](https://www.npmjs.com/package/@aegisjsproject/firebase-account-routes)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/AegisJSProject/firebase-account-routes.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/AegisJSProject/firebase-account-routes.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")

<!-- - [Security Policy](./.github/SECURITY.md) -->

# Firebase Account Routes for @aegisjsproject/router

This project provides modular, event-driven authentication and account management routes for web applications using Firebase and [`@aegisjsproject/router`](https://github.com/AegisJSProject/router). It enables seamless integration of sign-in, sign-up, password reset, email verification, and profile management features, with each route implemented as a separate, dynamically loaded module.

## Features
- **Modular Routing:** Each account-related route (sign-in, sign-up, reset-password, verify-email, verify-reset, profile) is a standalone ES module, loaded on demand.
- **Event-Driven Architecture:** Custom events are dispatched for account actions, enabling flexible cross-component communication.
- **Firebase Integration:** Uses Firebase JS SDK for authentication flows. Modules preload required Firebase packages for optimal performance.
- **UI Rendering:** Uses tagged template literals (`html`) for declarative UI construction.

## How It Works
- The main entry (`main.js`) dispatches requests to the correct route module based on the requested page, using the `ROUTES` map from `consts.js`.
- Route modules handle their own UI, event registration, and Firebase logic.
- Events and navigation are managed via `@aegisjsproject/router` and `@aegisjsproject/callback-registry`.

## Developer Workflow
- **Lint:** `npm run lint:js` (ESLint, config in `.github/linters/.eslintrc.yml`)
- **Test:** `npm run test` (runs lint and Node.js tests)
- **Start Dev Server:** `npm start` (uses `@shgysk8zer0/http-server`)
- **Versioning:** `npm run version:bump[:patch|:minor|:major]`

## Key Files
- `main.js`: Central route dispatcher and title resolver
- `consts.js`: Route metadata and event names
- `auth.js`, `profile.js`, `sign-in.js`, `sign-up.js`, `reset-password.js`, `verify-email.js`, `verify-reset.js`: Route logic
- `utils.js`: User sanitization and module preloading
- `events.js`: Event helpers
