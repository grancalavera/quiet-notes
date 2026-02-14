# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quiet Notes is a collaborative note-taking application built with React, Firebase, and RxJS. It uses a pnpm workspace monorepo structure with multiple specialized packages.

## Development Commands

### Prerequisites

- Node.js >=18 (tested with v18-v25)
- pnpm >=7
- Firebase CLI (install: `npm install -g firebase-tools`)
  - **Note**: If using Node.js v25+, ensure firebase-tools is updated to latest version for compatibility

### Initial Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure Firebase project:**
   - Update `.firebaserc` with your Firebase project ID
   - Or use the existing project: `quiet-notes-e83fb`

3. **Bootstrap environment:**
   ```bash
   ./bootstrap.sh
   # Or non-interactive with default admin (admin@example.com):
   ./bootstrap.sh --defaults
   ```
   This will:
   - Prompt for default admin email (or use default: admin@example.com). Use `--defaults` to skip the prompt.
   - Set Firebase functions runtime config
   - Generate `.env`, `.env.local`, and `.env.emulated.local` files in `quiet-notes-web/`

### Running Locally with Emulators

**Option 1: Single command (recommended)**

```bash
# Terminal 1: Start emulators
./emulate.sh

# Terminal 2: Start web app
cd quiet-notes-web && pnpm start:emulated
```

**Option 2: Manual emulator start**

```bash
# Terminal 1: Start specific emulators
firebase emulators:start --only auth,firestore,hosting,functions

# Terminal 2: Start web app
cd quiet-notes-web && pnpm start:emulated
```

### First-time Local Dev Workflow

After bootstrapping and starting the emulators + web app:

1. Sign up / log in with the admin email you configured in `bootstrap.sh`
2. The default admin is automatically granted `admin`, `author`, and `user` roles — you can start creating notes immediately
3. To grant other users access, go to the Admin panel and toggle the `author` role for them

### Common Commands

```bash
# Build all packages
pnpm build

# Run web app in development mode (port 3000, no emulators)
cd quiet-notes-web && pnpm start

# Type checking
cd quiet-notes-web && pnpm typecheck

# Run unit tests (Vitest)
cd quiet-notes-web && pnpm test

# Run E2E tests with Playwright UI
cd quiet-notes-e2e && pnpm test

# Generate E2E tests with Playwright codegen
cd quiet-notes-e2e && pnpm codegen

# Build functions only
pnpm --filter quiet-notes-functions... build

# Build web only
pnpm --filter quiet-notes-web... build
```

### Deployment Commands

```bash
# Deploy everything
./deploy.sh

# Deploy functions only
./deploy-functions.sh

# Deploy Firestore indexes
./deploy-indexes.sh

# Deploy security rules
./deploy-rules.sh
```

### Emulator Ports

- Auth: 9099
- Functions: 5001
- Firestore: 8080
- Hosting: 5002

### Environment Files

The `bootstrap.sh` script generates three environment files via `quiet-notes-tools`:

- **`.env`**: Base configuration with Firebase project ID and hosting URL
- **`.env.local`**: Local development without emulators (VITE_FIREBASE_USE_EMULATORS=false)
- **`.env.emulated.local`**: Local development with emulators enabled (used by `pnpm start:emulated`)

Vite automatically loads `.env.emulated.local` when running with `--mode emulated`.

To regenerate environment files after changing Firebase project:

```bash
pnpm --filter quiet-notes-tools write-env
```

## Architecture

### Reactive State Management with RxJS

The application uses RxJS and `@react-rxjs/core` instead of Redux or Context API. Key pattern:

1. **Signals**: Create event emitters via `createSignal()`
2. **Merging**: Combine signals with `mergeWithKey()`
3. **Reduction**: Transform event streams using `scan()` with Immer for immutable updates
4. **Binding**: Expose observables as React hooks via `bind()`
5. **Sharing**: Use `shareReplay(1)` to multicast and cache

Example flow in `notebook-state.ts`:

```
User Actions (signals) → Merged Stream → scan() + Immer → shareReplay → React Hooks
```

When adding state:

- Define signals for discrete events (e.g., `createSignal<NoteAdded>()`)
- Merge into a unified stream with `mergeWithKey()`
- Use `scan()` to reduce events into state (use Immer's `produce()` for updates)
- Bind to React with `bind(observable)` to create custom hooks
- Subscribe in components with the generated hook

### CRDT Vector Clocks for Conflict Resolution

Notes implement vector clocks (`crdt/clock.ts`) for distributed conflict-free merging:

- **Clock operations**: `increment`, `merge`, `receive`, `isLessThan`
- **Note envelopes**: Empty, Local, Remote, Merged (track origin)
- **Merge strategy**: When local/remote notes collide, merge their vector clocks
- **Winner selection**: Use clock comparison to determine which note takes precedence

When modifying note state:

- Always increment the clock on local updates
- Use `mergeClock()` when receiving remote updates
- Never directly compare timestamps; use vector clock semantics

### Firebase Integration

- **App initialization**: Async observable `app$` in `firebase/app.ts`
- **Emulator detection**: Automatically connects to emulators in development mode
- **Service layer**: Abstractions in `firebase/` directory (auth, firestore, storage)
- **Custom claims**: Role-based authorization (admin, user) managed via Cloud Functions

### Monorepo Structure

- **quiet-notes-web**: Vite + React frontend
- **quiet-notes-lib**: Shared types and Zod schemas (workspace dependency)
- **quiet-notes-functions**: Firebase Cloud Functions (Node.js 18)
- **quiet-notes-tools**: Environment variable utilities
- **quiet-notes-e2e**: Playwright tests

Link workspace packages using `workspace:*` protocol in package.json.

### Platform-Specific UI

Responsive design with Desktop and Mobile components:

- **Detection**: MUI breakpoints with custom hooks (useIsMobile, useIsTablet, useIsDesktop)
- **Lazy loading**: Platform-specific views loaded on demand
- **Split editors**: Main editor + additional editors architecture

## Testing

- **Unit tests**: Vitest with colocated test files (`.test.ts`)
- **E2E tests**: Playwright in `quiet-notes-e2e/tests/`
  - Tests cover OAuth signup, admin roles, note CRUD, multi-editor interactions
  - Use `data-testid` attributes for locators

## Cloud Functions

Located in `quiet-notes-functions/src/`:

- **onboardUser**: Auth trigger for new user setup
- **toggleRole**: Admin function to toggle user roles
- **listUsers**: Admin function to list all users

Functions deploy from `quiet-notes-functions-dist/` after build.

## Firebase Configuration

Requires manual project setup:

1. Create Firebase project
2. Update `.firebaserc` with project ID
3. Enable Authentication, Firestore, Functions, Hosting
4. Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
5. Deploy security rules: `firebase deploy --only firestore:rules,storage`

## GitHub Integration

Optional: Firebase Hosting GitHub integration for PR previews and automatic deployments on merge to `main`. Configuration in `.github/workflows/`.
