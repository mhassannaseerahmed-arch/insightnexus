# ApplyKit

Job-search workspace in the browser: upload a résumé (PDF or text), pull **open roles** from public feeds or JSearch (RapidAPI), score **skill fit** against postings, and keep a lightweight **application log** locally.

## Setup

```bash
cd applykit
cp .env.example .env
# Optional: add VITE_RAPIDAPI_KEY for Google Jobs / Indeed-style JSearch sources.
npm install
npm run dev
```

Open [http://localhost:5176](http://localhost:5176).

## Build

```bash
npm run build
npm run preview
```

ApplyKit is not part of FlowPing; it is a separate front-end app in this repo.
