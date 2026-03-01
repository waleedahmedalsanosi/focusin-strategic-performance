# FocusIn – Strategic Performance Management

A full-stack web application for managing organizational strategy, KPIs, Balanced Scorecard, initiatives, and more — with an AI-powered strategic advisor.

## Features

- **Authentication** – Signup / signin with secure session tokens
- **KPI Management** – Track key performance indicators with targets, baselines, and actuals
- **Balanced Scorecard (BSC)** – Manage the four perspectives: Financial, Customer, Internal, Learning
- **Strategy Management** – Define and manage strategic plans with pillars and objectives
- **Initiatives Management** – Track strategic initiatives with progress, budget, owner, and status
- **Strategy House** – Visualize and manage organizational hierarchy (departments)
- **Strategy Map** – Edit vision, mission, and strategic pillars inline
- **Organization Chart** – Interactive org tree with expand/collapse
- **Analytics Dashboard** – Charts and KPI summaries
- **AI Chat Advisor** – Ask strategy and performance questions powered by Gemini 2.0 Flash
- **Settings** – Profile editing, password change, dark mode, Arabic/English language toggle
- **RTL Support** – Full Arabic language and right-to-left layout support

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, TypeScript, Vite, TailwindCSS v4 |
| Backend    | Express.js, TypeScript, tsx             |
| Database   | SQLite via better-sqlite3               |
| AI         | Google Gemini 2.0 Flash (`@google/genai`) |
| Charts     | Recharts                                |
| Animation  | Motion (Framer Motion v12)              |
| Icons      | Lucide React                            |

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free)

### 1. Clone the repository

```bash
git clone https://github.com/waleedahmedalsanosi/focusin-strategic-performance.git
cd focusin-strategic-performance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_key_here
```

### 4. Run the development servers

Open **two terminals**:

```bash
# Terminal 1 – Frontend (Vite dev server on port 3000)
npm run dev

# Terminal 2 – Backend (Express API on port 3001)
npm run server
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The Vite dev server proxies all `/api/*` requests to `http://localhost:3001` automatically.

---

## Deployment (Free – Render.com)

The app deploys as a **single service** on [Render](https://render.com): Express serves both the REST API and the compiled React frontend.

### Steps

1. **Fork or push** this repo to GitHub (already done).

2. Go to [render.com](https://render.com) → **New → Web Service**.

3. Connect your GitHub account and select the `focusin-strategic-performance` repository.

4. Render will auto-detect `render.yaml`. Confirm the settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. In **Environment Variables**, add:
   - `GEMINI_API_KEY` → your Gemini API key

6. Click **Deploy**. Render builds and deploys automatically.

> **Free tier note**: The service spins down after 15 minutes of inactivity and has a ~30-second cold start. Upgrade to a paid plan for always-on availability.

### Environment Variables Reference

| Variable        | Required | Description                                   |
|-----------------|----------|-----------------------------------------------|
| `GEMINI_API_KEY`| Yes*     | Google Gemini API key for AI chat feature     |
| `PORT`          | No       | Server port (auto-set by Render)              |
| `NODE_ENV`      | No       | Set to `production` by Render automatically  |

*Without `GEMINI_API_KEY`, the AI chat returns a clear error message. All other features work normally.

---

## Project Structure

```
focusin-strategic-performance/
├── server/
│   ├── db.ts          # SQLite schema & database connection
│   ├── index.ts       # Express REST API + static file serving
│   └── tsconfig.json  # TypeScript config for server
├── src/
│   ├── App.tsx        # Entire frontend (all components)
│   ├── api.ts         # Typed fetch client for the backend
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles (TailwindCSS)
├── .env.example       # Environment variable template
├── render.yaml        # Render.com deployment config
├── vite.config.ts     # Vite config (dev proxy + build)
├── package.json
└── tsconfig.json
```

## API Endpoints

### Auth
| Method | Path                  | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /api/auth/signup      | Register a new user            |
| POST   | /api/auth/signin      | Sign in, returns session token |
| POST   | /api/auth/signout     | Invalidate session token       |
| GET    | /api/auth/me          | Get current user info          |
| PUT    | /api/auth/profile     | Update name and company        |
| PUT    | /api/auth/password    | Change password                |

### Data (all require `Authorization: Bearer <token>`)
| Method | Path                  | Description             |
|--------|-----------------------|-------------------------|
| GET    | /api/kpis             | List KPIs               |
| POST   | /api/kpis             | Create KPI              |
| PUT    | /api/kpis/:id         | Update KPI              |
| DELETE | /api/kpis/:id         | Delete KPI              |
| GET    | /api/bsc              | List BSC items          |
| POST   | /api/bsc              | Create BSC item         |
| PUT    | /api/bsc/:id          | Update BSC item         |
| DELETE | /api/bsc/:id          | Delete BSC item         |
| GET    | /api/initiatives      | List initiatives        |
| POST   | /api/initiatives      | Create initiative       |
| PUT    | /api/initiatives/:id  | Update initiative       |
| DELETE | /api/initiatives/:id  | Delete initiative       |
| GET    | /api/strategies       | List strategies         |
| POST   | /api/strategies       | Create strategy         |
| PUT    | /api/strategies/:id   | Update strategy         |
| DELETE | /api/strategies/:id   | Delete strategy         |
| GET    | /api/departments      | List departments        |
| POST   | /api/departments      | Create department       |
| PUT    | /api/departments/:id  | Update department       |
| DELETE | /api/departments/:id  | Delete department       |
| POST   | /api/chat             | Send message to AI      |

---

## License

Apache 2.0 – see [LICENSE](LICENSE) for details.
