---
name: e2e-test
description: Implement Playwright E2E tests for requirements in quiet-notes-requirements/requirements.json using Page Object Model patterns, Firebase Admin SDK for user setup, and category-based organization
argument-hint: [requirement-id or category]
disable-model-invocation: false
user-invocable: true
---

# E2E Skill for Quiet Notes

## Overview

Implement Playwright tests for requirements in `quiet-notes-requirements/requirements.json` using:

- **Page Object Model** with strict locator hierarchy (getByRole > getByLabel > getByText > getByTestId > CSS)
- **Firebase Admin SDK** for programmatic user/role setup (no UI-based role grants)
- **Category-based organization** matching requirements.json structure
- **Smart project dependencies** for optimal parallel execution
- Use the playwright cli to discover the application markdown structure if needed
- Read or create `progress.txt`, then ensure the requirement id you're working on is not listed.

## Naming Conventions

**Test files:**

```
tests/{category}/REQ-{CATEGORY}-{NNN}.spec.ts
```

**Test description:**

```typescript
test("REQ-AUTH-001: Sign in with third-party provider", async ({ ... }) => { ... })
```

**Categories from requirements.json:**

- authentication, authorization, security, onboarding
- note-management, editor, sorting, split-editor, sync
- admin, profile, theme, responsive, pwa, navigation, error-handling

## Project Dependencies

Configure Playwright projects with these dependencies:

```
authentication → all others
authorization → note-management, editor, sorting, split-editor, admin
note-management → editor, sorting, sync
editor → split-editor
```

## Page Object Model

**Locator Priority:**

1. `getByRole()` — Semantic roles (button, link, textbox)
2. `getByLabel()` — Form fields with labels
3. `getByText()` — Visible content
4. `getByTestId()` — Fallback
5. CSS selectors — Last resort with comment

**Pattern:**

- User-intent methods: `notebookPage.createNote()` not `page.getByRole(...).click()`
- No assertions in page objects
- No inheritance — use composition
- Relative URLs only

**Example:**

```typescript
export class NotebookPage {
  readonly createNoteButton = this.page.getByRole("button", {
    name: /create note/i,
  });
  readonly mainEditor = this.page.getByRole("textbox", {
    name: /note editor/i,
  });

  async createNote() {
    await this.createNoteButton.click();
  }
}
```

Locators query the **accessibility tree**, not DOM structure. Markup can change completely (class names, structure, component libraries) without breaking tests, as long as semantic contract (roles, labels, text) remains stable.

## File Structure

**Pages** (one per view):

- `pages/login.page.ts`
- `pages/lobby.page.ts`
- `pages/notebook.page.ts`
- `pages/admin.page.ts`

**Components** (shared UI):

- `components/header.component.ts`
- `components/editor.component.ts`
- `components/notes-list.component.ts`
- `components/profile-popover.component.ts`

**Fixtures:**

- `fixtures/index.ts` — Barrel export extending Playwright test
- `fixtures/firebase-admin.ts` — `grantRoles()`, `deleteUser()`
- `fixtures/users.ts` — `createAuthor()`, `createAdmin()`, `createRegularUser()`
- `fixtures/auth.ts` — OAuth flow helpers
- `fixtures/viewport.ts` — `setMobile()`, `setTablet()`, `setDesktop()`
- `fixtures/sync.ts` — Multi-window helpers

**Utilities:**

- `utils/wait.ts` — Timing utilities
- `utils/test-data.ts` — UUID-based email generation

**Setup:**

- `global-setup.ts` — Firebase Admin SDK init, emulator verification, data cleanup
- `playwright.config.ts` — Projects with dependencies, baseURL, globalSetup

## Implementation Patterns

**Test structure:**

```typescript
import { test, expect } from "../../fixtures";

test("REQ-NOTE-001: Create new empty note", async ({
  page,
  notebookPage,
  users,
  auth,
}) => {
  const author = await users.createAuthor();
  await auth.signInWithUser(author, page);
  await notebookPage.goto();
  await notebookPage.createNote();

  await expect(notebookPage.mainEditor).toBeVisible();
  await expect(notebookPage.mainEditor).toHaveText("");
});
```

**User creation:**

- Generate unique email: `test-${uuid()}@quiet.works`
- Create via OAuth flow (triggers `onboardUser` → grants 'user' role)
- Grant additional roles via Admin SDK
- Never use admin UI to grant roles

**Multi-user scenarios:**

- Create users, sign in/out sequentially
- Verify access control

**Multi-window scenarios:**

- Use sync fixture: `const { page: pageB, notebookPage: notebookPageB } = await sync.createSecondContext(browser, user)`
- Create/edit in one window, verify in another

**Viewport testing:**

- Use viewport fixture to switch sizes
- Verify responsive behavior and feature availability

## Key Decisions

**Page Object Model:**

- Decouples tests from markup implementation
- Centralized locator management
- Semantic locators prioritize accessibility
- Trade-off: More upfront structure, but scales better

**Firebase Admin SDK:**

- Eliminates brittle UI-based role toggling
- Faster setup, better isolation
- Trade-off: Requires emulator mode (acceptable for e2e)

**Category-based organization:**

- Matches requirements.json structure
- Clear dependencies based on feature relationships
- Trade-off: More complex Playwright config, but more flexible execution

**Per-test cleanup:**

- Faster than full emulator reset
- Enables parallel execution
- Trade-off: More cleanup code (mitigated by shared fixtures)

## Verification

After implementing ech test:

1. All existing tests pass: `cd quiet-notes-e2e && pnpm test`
2. Dependencies work: authentication runs first, others run in parallel where allowed
3. Firebase Admin SDK: users created programmatically, roles granted without UI, cleanup works
4. Multi-window tests: sync tests create multiple contexts
5. Responsive tests: viewport switching works
6. The requirement for the test in requirements.json is marked as `"passes": true`
7. The requirement is added to `progress.txt` as a single line `${requirement-id}: {optional-notes}`
