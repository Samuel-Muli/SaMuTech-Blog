# What changed in this final-touches pass

## Subscribe — no more raw errors, plus unsubscribe

- If the database is unreachable when subscribing (or unsubscribing), the
  form now grays out (`opacity-50 grayscale`) and shows "This feature isn't
  available right now — please try again later." instead of the server's
  actual error message. It automatically re-enables after a few seconds so
  you can just try again.
- Added a working **unsubscribe** option — a small "Already subscribed?
  Unsubscribe" link beneath the subscribe form (in both the Sidebar and
  Footer) toggles to an unsubscribe field. Backed by a new
  `DELETE /api/subscribe` route. Same idempotent treatment as subscribing:
  it always responds the same way whether or not that email was actually
  on the list, so it can't be used to check who is/isn't subscribed.

## Fixed: pages not scrolling to top on navigation

This wasn't specific to "other articles you may like" — it's a known React
Router behavior (it doesn't reset scroll position on its own). Fixed
globally with a small `ScrollToTop` component, so it's now fixed for *every*
internal link site-wide, not just that one section.

## New: back-to-top button + WhatsApp button

Both float in the bottom-right corner on every page (added to `Layout`):
- **Back to top** appears once you've scrolled down ~400px, smooth-scrolls
  to the top on click.
- **WhatsApp** is always visible, links straight to
  `https://wa.me/254705244235`.

## Footer: social/contact icons

Added a row of icon links above the copyright line: your portfolio
(muli-samuel.onrender.com), WhatsApp, Facebook, X, LinkedIn, Instagram, and
your GitHub profile (separate from the existing "View source" link, which
still points at this repo specifically).

## Testing notes

Same caveat as before — no live MongoDB available in this sandbox. I
verified: clean build, server boots correctly, all validation (bad email,
etc.) works instantly without touching the database, and every route fails
gracefully (no crash) when the database is unreachable. I could not verify
the actual subscribe/unsubscribe success path against a real database —
please test that once it's connected to your MongoDB.
