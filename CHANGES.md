# What changed in this update

Built on top of the previous redesign, in this repo (`SaMuTech-Blog`).

## Comments — full overhaul

**One comment per device, per article.** Posting a top-level comment is
limited to one per IP address per article — a second attempt gets a
friendly "you've already commented" message instead of the form, rather
than a hard error. This is enforced server-side (`server.js`), not just in
the UI, so it can't be bypassed by just reloading the page.

**Error vs. success states when posting:**
- If the database is unreachable, the comment form dims/blurs slightly and
  shows "Comments are temporarily unavailable. Please try again later." —
  your typed text isn't lost, so you can just retry.
- On a successful post, it shows "Comment posted!" and the page smoothly
  scrolls up to the top of the comments section, where the new comment
  appears (comments are newest-first).

**Edit, delete, reply, like** — all backed by the same IP-based ownership
check used for the one-comment limit (no login system, see the README's API
reference section for the tradeoffs of that approach):
- **Edit** and **delete** only show up on comments you posted, and the
  server rejects the request even if someone tries to call the API directly
  for a comment that isn't theirs.
- **Like** is open to everyone, but limited to one like per IP per comment
  (clicking again un-likes it).
- **Reply** is one level deep (replies to a comment, not replies to
  replies) and isn't restricted to one-per-person, since back-and-forth
  discussion under a comment is a different thing from top-level spam.

**Comment form is now centered** as its own card, rather than stretching
full width.

## Real subscriber database

The `Footer` and `Sidebar` subscribe forms now call `POST /api/subscribe`
for real, storing emails in a `subscribers` collection in MongoDB (same
database as comments). Resubscribing with the same email is treated as a
friendly no-op, not an error.

**Optional email notification:** added `mailer.js` — if you set
`SMTP_USER`/`SMTP_PASS` in your environment, `samumutua93@gmail.com`
(configurable via `NOTIFY_EMAIL`) gets an email whenever someone new
subscribes. Leave those unset and subscribers still get saved — you just
won't be emailed about each one. See `.env.example` for setup, including
the Gmail App Password note (you can't use a normal Gmail password for
SMTP). I couldn't generate real SMTP credentials for you — that part needs
your own sending account.

## "Other articles you may like" — now ranked, not just "everything else"

Each article page now shows up to 8 related articles: the 4 with the most
total comments (comments + replies), and 4 random picks from the
least-commented ones, so that second group isn't the same 4 every time.
Backed by a new `GET /api/comment-counts` endpoint.

**Heads up:** there are only 4 articles total in `article-content.js` right
now (the original placeholder content), so you won't see the full
"8 articles" layout until there are more posts — the algorithm itself is
correct and ready, there's just not enough content yet to fill all 8 slots.

## Repo URL updated throughout

Switched all GitHub links (Footer, Topbar, About page, README) from
`SaMuTech` to `SaMuTech-Blog` to match this repo.

## Testing notes — please read

I don't have a MongoDB instance available in this environment (no local
`mongod`, and no network access to Atlas from here), so I could verify:
- Clean install and production build (no errors)
- The server boots and every route responds correctly when the database is
  *unreachable* — confirming nothing crashes and error responses are sensible
- All input validation (missing fields, invalid email) works correctly
  without even touching the database
- Client-side routing and static asset serving in production mode

What I could **not** verify directly is the actual success path against a
live database — i.e., that a real comment insert, edit, like, or subscribe
genuinely persists correctly in MongoDB. The logic is straightforward
(read the document, modify a plain JS array, write it back) and I'm
confident in it from review, but please do a real first pass once this is
connected to your actual database — post a comment, edit it, like it,
reply to it, delete it, and subscribe with a test email — before
considering it fully verified.
