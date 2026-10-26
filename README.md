# Emberforge Basket — Front-End Assignment

Emberforge is a Minecraft server store selling ranks, crates, and keys. Your job is to build its basket widget.

## The task

Your task is to build the basket widget in Vue 3, matching the Figma design:

**Figma:** https://www.figma.com/design/YWTGK5c8RvoriPAkbiLDiA

- Focus on a polish well-tested application. If you miss anything or run out of time add a "With more time" section in a NOTES.md file.
- Target a the figma design sizing (1440px), if you manage to add some responsive styling that is a bonus.
- The basket is loaded, and discount codes are validated, by a small HTTP API that the dev server hosts for you (see **The API** below). It takes a moment to respond and can fail, handle the loading, pending and failure cases.

## What it should do

- **Line items** — image, name, unit price, a quantity stepper, a line total, and a remove ("×") button.
- **Discount code input** — with an "Apply" action, a pending state while the code is being checked, inline error messages, and an applied-code chip that can be removed.
- **Order summary** — Subtotal, Discount line (only when a code is applied), and Total, all derived.
- **Empty state** — shown once the basket has no items (see the Figma).
- **Loading and load-error states** — a skeleton while the basket loads; if loading fails, an error with a "Retry" action (see the Figma).

### Other spec details

- One discount code at a time; applying is blocked while one is active until removed.
- Codes are case-insensitive; unknown code → "Invalid discount code", expired → "This code has expired", anything else going wrong → "Something went wrong. Please try again."
- Apply is disabled while a lookup is pending.
- Total = max(0, subtotal − discount). Never negative.
- All money rounded to 2dp, half-up.
- The summary always adds up: Subtotal − Discount = Total, to the penny, as displayed.
- Quantity stepper: increment disabled at maxQuantity, decrement disabled at 1; removal is the "×" button only.
- Quantity changes and removals are client-only and aren't saved anywhere; reloading the page brings back the saved basket from the API.
- Removing the last item shows the empty state; an applied discount is discarded with it. A basket that loads with no lines shows the empty state too.
- The basket loads when the widget mounts. While it loads, only the skeleton is shown; if it fails, only the load-error state is shown, and "Retry" returns to the skeleton and requests it again.
- Summary values are always derived from line items + code, never stored.

## The API

`npm run dev` (and `npm run preview`) serve two endpoints alongside the app. They stand in for a real backend. Their source lives in `server/` — treat it as a black box and **don't edit it**.

### Load the basket

```
GET /api/basket
```

| Status | Body                                                                | Meaning                                                                        |
| ------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `200`  | `{ "lines": [{ "productId": "legend-rank", "quantity": 1 }, ...] }` | The customer's saved basket. `productId` refers to a product in the catalogue. |

The basket only holds product references and quantities; names, prices and caps come from the catalogue. It never includes a discount code. After it has loaded, quantity changes and removals stay on the client — there is no endpoint to save them.

Try it: `curl localhost:5173/api/basket`

### Validate a discount code

```
POST /api/discounts/validate
Content-Type: application/json

{ "code": "EMBER10" }
```

| Status | Body                                                              | Meaning                                                                             |
| ------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `200`  | `{ "code": "EMBER10", "type": "percentage", "value": 10 }`        | Valid. `type` is `"percentage"` or `"fixed"`; `value` is a percent or a GBP amount. |
| `404`  | `{ "error": "invalid_code", "message": "Invalid discount code" }` | Unknown code.                                                                       |
| `410`  | `{ "error": "expired", "message": "This code has expired" }`      | Known code, past its expiry.                                                        |
| `400`  | `{ "error": "bad_request", "message": "..." }`                    | Missing or malformed body.                                                          |

Responses from both endpoints take a moment, and like any real API they can fail in ways not listed here. The discount _amount_, rounding and clamping are yours to calculate on the client from `type`, `value` and the current subtotal.

Try it: `curl -X POST localhost:5173/api/discounts/validate -H 'Content-Type: application/json' -d '{"code":"EMBER10"}'`

## Requirements

- **Vue 3 Composition API** with `<script setup lang="ts">`.
- **Use the design tokens** in `src/styles/_tokens.scss` rather than hardcoded values. They match the Figma variables 1:1.
- **Unit tests** for the business logic, using Vitest + Vue Test Utils (already configured — see the example spec). Tests should not depend on the dev server being up.

## Tools

Use whatever tools you normally use at work — AI assistants, devtools, anything. We care about the result and your judgment.

## NOTES.md

Create a `NOTES.md` in the repo root: a short writeup (~300 words) with three sections:

- **Tools** — what aided you (AI assistants, devtools, etc.) and anything they got wrong that you changed.
- **Decisions** — the key choices you made and the trade-offs behind them.
- **With more time** — what you'd do next, and anything you left unfinished or rough.

## Submission

Feel free to host your submission on GitHub or send it in zipped up via email.

If hosting via Github, please ensure you perform the following steps.

1. Push your work to a **private GitHub repo**, preserving the full commit history.
2. Invite user @Chilledson (Lewis) as collaborators.

The follow-up interview we will walkthrough some of your code. We'll pick some lines to talk about, ask you to predict what the code does before running it, and talk through how you'd extend it.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm test           # run the test suite once
npm run test:watch # run tests in watch mode
npm run lint       # lint
npm run format     # format with Prettier
npm run build      # type-check and build
```

Everything is preconfigured: Vite, Vue 3, TypeScript (strict), SCSS, Vitest + Vue Test Utils, ESLint + Prettier. `npm install && npm run dev` should work first try, if it doesn't, please contact us.

---

## Fixture data

Products live in `src/data/fixtures.ts`. The basket and the discount codes live inside the API

```ts
products: [
  {
    id: 'legend-rank',
    name: 'Legend Rank',
    unitPrice: 24.99,
    maxQuantity: 1,
    image: 'legend-rank.jpg',
  },
  {
    id: 'mystery-crate',
    name: 'Mystery Crate',
    unitPrice: 4.99,
    maxQuantity: 10,
    image: 'mystery-crate.jpg',
  },
  {
    id: 'crate-keys',
    name: 'Crate Key Bundle',
    unitPrice: 13.35,
    maxQuantity: 5,
    image: 'crate-keys.jpg',
  },
]
// saved basket (GET /api/basket): legend-rank ×1, mystery-crate ×2, crate-keys ×1

discountCodes: [
  { code: 'EMBER10', type: 'percentage', value: 10, expiresAt: '2099-01-01' },
  { code: 'FORGE15', type: 'fixed', value: 15, expiresAt: '2099-01-01' },
  { code: 'SUMMER24', type: 'percentage', value: 20, expiresAt: '2024-08-31' },
]
```

✨ That is everything you should need to complete this task, good luck! ✨
