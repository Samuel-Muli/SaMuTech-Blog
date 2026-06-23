# SaMuTech Blog

A full-stack blog built with React (frontend) and Node.js, Express, and
MongoDB (backend). Written and styled for tutorial-style content — articles,
search, topic filtering, and reader comments — with a design built to grow
into a monetized blog (ads, affiliates, a newsletter) without a rebuild.

> 📸 _Add a screenshot of the homepage here once you've got it running —
> drag an image into this section on GitHub, or replace this line with
> `![SaMuTech homepage](./docs/screenshot.png)`._

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, React Router 7, Tailwind CSS 3 |
| Backend | Node.js, Express 5 |
| Database | MongoDB (comments only — article content is static, see [Data model](#data-model)) |
| Dev tooling | Create React App (`react-scripts`), nodemon, concurrently |

Built and tested with Node `v22.x` / npm `10.x`. Anything Node 18+ should work fine.

## Features

- Responsive layout with a sticky navbar, topbar, footer, and a sidebar used
  for search, topic browsing, popular posts, and a newsletter signup
- Live search on the articles list, plus a search box on every other page
  that jumps to the list with results applied
- Topic/tag filtering, linked from the sidebar, footer, and each article
- Per-article comments, backed by MongoDB
- A 404 page, and a content layout designed for future ad/affiliate
  placements in the sidebar (see [Monetization](#monetization))

## Project structure

```
SaMuTech/
├── server.js              # Express API (comments) + serves the built React app in production
├── package.json           # root scripts: dev, build, start
├── .env.example           # documents required environment variables
└── client/                # React app (Create React App)
    ├── public/
    ├── src/
    │   ├── components/    # Navbar, Topbar, Footer, Sidebar, Layout, Articles, comments
    │   ├── pages/         # Home, ArticleList, Article, About, NotFound, article-content.js
    │   └── App.js
    └── package.json       # client scripts: start, build
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later, and npm
- A MongoDB database — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended, and required for hosting)

## Local setup

```bash
# 1. Clone the repo
git clone https://github.com/Samuel-Muli/SaMuTech.git
cd SaMuTech

# 2. Install backend dependencies (repo root)
npm install

# 3. Install frontend dependencies
cd client && npm install && cd ..

# 4. Set up environment variables
cp .env.example .env
# edit .env if you're using MongoDB Atlas instead of a local database

# 5. Run both the API and the React dev server together
npm run dev
```

The React app runs at `http://localhost:3000` and proxies `/api/*` requests
to the Express server at `http://localhost:8000` (configured via the
`proxy` field in `client/package.json` — this only works in development).

## Environment variables

Defined in `.env.example`; copy it to `.env` for local use.

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | No (defaults to `mongodb://localhost:27017`) | Your MongoDB connection string |
| `PORT` | No (defaults to `8000`) | Port the Express server listens on |
| `NODE_ENV` | No | Set to `production` to make Express serve the built React app — most hosts set this automatically |

## Available scripts

Run from the repo root unless noted:

| Command | What it does |
|---|---|
| `npm run dev` | Runs the API and the React dev server together (local development) |
| `npm run server` | Runs just the API, with nodemon auto-restart |
| `npm run client` | Runs just the React dev server |
| `npm run build` | Installs client dependencies and builds the production React bundle into `client/build` |
| `npm start` | Starts the Express server only (used in production, after `npm run build`) |

## Data model

Article *content* (title, body text, thumbnail, tags) lives as static data
in `client/src/pages/article-content.js` — it's bundled into the frontend,
not stored in a database. MongoDB is only used to store **comments**, in a
`samutech` database, `articles` collection, where each document looks like:

```json
{
  "name": "structural-engineering-101",
  "comments": [{ "username": "Jane", "text": "Great breakdown!" }]
}
```

There's no seed script to run — the first comment on any article
automatically creates its document (`upsert`), and an article with zero
comments yet just renders an empty comments section. Nothing to set up.

To add a new article: add an entry to `article-content.js` with a unique
`name`, `title`, `thumbnail`, `tags` array, and `content` array of
paragraphs, and add its thumbnail image to `client/public/images/`.

---

## Deployment

The simplest path is deploying this as **one service**: Express serves both
the API and the built React app from the same origin, so there's no CORS
setup and no separate frontend host to manage. That's what's documented
below.

### 1. Create a MongoDB Atlas cluster (free tier)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free (M0) cluster
3. Under **Database Access**, create a database user with a password
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from
   anywhere (your hosting provider's IPs change, so this is the simplest
   option for a small project — for tighter security later, look into your
   host's static IP or VPC peering options)
5. Click **Connect** → **Drivers**, and copy the connection string. It
   looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual database user's
   credentials — this full string is your `MONGODB_URI`

### 2. Deploy to Render (or Railway — steps are nearly identical)

[Render](https://render.com) and [Railway](https://railway.app) both offer
free or low-cost tiers well suited to a small Node app. Using Render:

1. Push this repo to GitHub if you haven't already
2. On Render, click **New** → **Web Service**, and connect your GitHub repo
3. Configure:
   | Setting | Value |
   |---|---|
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |
   | Environment | `Node` |
4. Add environment variables in the Render dashboard:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string from step 1 |
   | `NODE_ENV` | `production` |
5. Deploy. Render gives you a free `*.onrender.com` URL — that's your live
   site.

**Note on free tiers:** Render's free web services spin down after a period
of inactivity and take a few seconds to wake up on the next visit. Fine for
a low-traffic blog starting out; if that delay bothers you, their lowest
paid tier removes it.

### 3. Custom domain

Once deployed, both Render and Railway let you add a custom domain under
the service's settings — you'll point a `CNAME` (or `A`) record at your
domain registrar to the value they give you. Propagation usually takes
anywhere from a few minutes to a few hours.

### Alternative: separate frontend and backend hosting

You can host the React build separately on something like
[Vercel](https://vercel.com) or [Netlify](https://netlify.com) (fast global
CDN, generous free tier) and the Express API separately on Render/Railway.
This isn't wired up by default in this repo and needs extra work if you go
this route:
- The frontend's `fetch` calls (in `AddCommentForm.js` and `Article.js`)
  currently use relative paths like `/api/articles/...`, which only resolve
  correctly when frontend and backend share the same origin. You'd need to
  point them at an absolute backend URL (e.g. via a `REACT_APP_API_URL`
  environment variable).
- Express would need [CORS](https://www.npmjs.com/package/cors) enabled, since
  the two would now be on different domains.

For a blog this size, the combined single-service approach above is simpler
and has one less moving part to maintain — that's why it's the documented
path.

---

## Monetization

This blog's layout — sidebar, footer, subscribe forms — was built with
monetization in mind, but a brand-new blog generally needs traffic and
content before most of these are worth setting up. Roughly in order:

### Phase 1 — content first
Ad networks and affiliate programs both want to see real, original content
before approving you, and readers need something to find before any of
this matters. Aim for 15–20 solid posts in your niche before chasing
monetization seriously.

### Phase 2 — low-effort passive income, once you have some traffic
- **Affiliate links** — tools, hosting, or courses you'd genuinely recommend
  in a tutorial anyway (hosting providers, paid dev tools, Udemy courses,
  Amazon Associates for books/hardware). These read naturally inside
  tutorial content and convert well because the audience already has buying
  intent.
- **Display ads** — [Google AdSense](https://adsense.google.com) once your
  site qualifies (it needs to be live with original content, decent
  navigation, and no policy violations). Low effort, but pays little unless
  traffic is meaningful.
- **Where this fits in the code:** the `Sidebar` component
  (`client/src/components/Sidebar.js`) already has a card-based layout — an
  affiliate card or ad unit slots in as one more `SidebarSection` alongside
  Topics and Popular Posts, without touching the rest of the layout.

### Phase 3 — once you have an audience
- **Your own digital product** — a paid PDF, expanded tutorial bundle, or a
  small course hosted on something like [Gumroad](https://gumroad.com).
  This converts far better than ads once you have repeat readers.
- **Sponsored posts** from dev-tool companies, once you have meaningful
  monthly traffic.
- **GitHub Sponsors** or **Buy Me a Coffee** — works well for a dev blog
  specifically, especially if you also share open-source code.

### The newsletter

Both the `Footer` and `Sidebar` already have a working subscribe form —
right now it only confirms locally ("You're on the list — thanks!") because
there's no email service wired up yet. When you're ready to actually
collect subscribers, swap that local state for a real call to a provider
like [Mailchimp](https://mailchimp.com), [ConvertKit](https://convertkit.com),
or [Buttondown](https://buttondown.email) — a list of engaged subscribers
is also one of the more durable monetization assets a blog can build,
independent of any single ad network or platform.

---

## Contributing

Issues and pull requests are welcome — open one on
[GitHub](https://github.com/Samuel-Muli/SaMuTech).

## License

ISC — see `package.json`. Add a `LICENSE` file if you'd like the full
license text in the repo itself.

## Author

Built by [Samuel Muli](https://github.com/Samuel-Muli).
