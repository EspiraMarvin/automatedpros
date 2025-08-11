This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
# setup

# install deps
npm install --legacy-peer-deps

# if it fails run
npm install --legacy-peer-deps
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

tests

```bash
# run e2e test
npm run e2e

# interactive tests
npx playwright test --headed

# for debugging step by step control
npx playwright test --debug

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Decisions

1. used the nextjs app/src structure
2. react query
3. added searching of characters, including favorite characters
4. added filters - for character status (ALIVE, DEAD and UNKNOWN)
5. added sorting - for character names (both asc and desc order)
6. added toggle a character to favorite or not, and listing favorite character when show favorites button is clicked
7. add pagination for the fetched data
8. added loading skeletons and errors (retry button)
9. added Form on the detail page with validation to add a note on a character
10. added Cancelling in‑flight requests when inputs change using AbortController.
11. used url as a source of truth using url params
12. added code splitting- allowing lazily loading of home component while the app url has not url parameters yet, with help of Suspense and Fallback
13. e2e testing - used playwright to test,
    > a. if a user can search a character, view character's details, and add a note about the character successfully
    > b. if a user can toggle favorite status and UI updates accordingly
