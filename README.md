# HireLens 🔍

**AI-powered resume analyzer with job description matching, skill detection, and LLM-generated feedback — built as a production-grade SaaS portfolio project.**

Live demo: [hire-lens-lemon.vercel.app](https://hire-lens-lemon.vercel.app)

---

## Features

- **Resume Upload & Parsing** — Upload a `.pdf` or `.docx` resume and extract its text via the backend parser
- **Resume Analysis** — Rule-based quality scoring with detected skills, action verbs, strengths, and weaknesses
- **Job Description Matching** — Paste a job description to get a match score, matched/missing keywords, and tailored recommendations
- **AI Feedback** — LLM-generated overall assessment, improvement suggestions, rewritten summary, and improved bullet examples
- **Bullet Rewriter** — Enter any resume bullet and get an AI-improved version targeted to the job description
- **Modal Detail Views** — Extracted text preview, expanded JD editor, and full AI detail view — all in clean overlay modals
- **Score Gauges** — Visual circular gauges for resume quality and JD alignment scores

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| HTTP Client | Axios |
| Backend API | FastAPI (hosted on Render) |
| Deployment | Vercel |

---

## Project Structure

```
HireLens/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── App.jsx          # Main app — all components, state, and API logic
│   ├── App.css          # (Vite scaffold styles, not actively used)
│   ├── index.css        # Tailwind import + base body styles
│   └── main.jsx         # React entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/GowthamU7/HireLens.git
cd HireLens
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## API Reference

The frontend communicates with a FastAPI backend hosted at `https://hirelensbe.onrender.com/api`.

| Endpoint | Method | Description |
|---|---|---|
| `/upload-resume` | POST | Accepts a `.pdf` or `.docx` file, returns extracted text |
| `/analyze-resume` | POST | Analyzes resume text, returns score, skills, strengths, weaknesses |
| `/match-job` | POST | Compares resume text against a job description, returns match score and keywords |
| `/ai-feedback` | POST | Generates LLM feedback including assessment, suggestions, and rewritten bullets |
| `/rewrite-bullet` | POST | Rewrites a single resume bullet point using AI |

---

## UI Components

All components live in `src/App.jsx`:

- **`Modal`** — Backdrop overlay modal with `md`, `xl`, and `full` size variants
- **`SectionCard`** — Rounded card container with title, subtitle, and optional action
- **`HeroStat`** — Dark-themed stat block used in the hero header
- **`ScoreGauge`** — Circular score visualizer (0–100) with gradient color themes
- **`BadgeList`** — Renders string arrays as colored pill badges
- **`InsightList`** — Renders text items in a styled list card
- **`Carousel`** — Navigable carousel for stepping through lists of strings

---

## Environment

No `.env` file is required for the frontend. The backend URL is hardcoded in `App.jsx`:

```js
const API_BASE = "https://hirelensbe.onrender.com/api";
```

To point to a local or different backend, update this constant.

---

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Fork the repository
2. Import the project into [Vercel](https://vercel.com)
3. Vercel will auto-detect the Vite framework — no additional config needed
4. Deploy

---

## License

This project is open source and available for personal and portfolio use.

---

## Author

Built by [GowthamU7](https://github.com/GowthamU7)
