# NSE Fuel Sensitivity Terminal

An interactive Bloomberg-terminal-style dashboard analyzing how fuel price movements
correlate with profit margins across three NSE-listed companies: Safaricom PLC,
East African Breweries Limited, and Kenya Power & Lighting Company, FY2016-FY2025.

This is the interactive companion to the written equity research report
"Fuel Price Sensitivity Across NSE Sectors."

## Data Provenance

All figures embedded in `src/data.js` were extracted via an n8n workflow using
a Claude Haiku 4.5 AI extraction agent against audited annual report PDFs, then
cleaned and standardised with a Python/pandas script, and cross-verified against
officially published results. Fuel prices sourced from EPRA monthly bulletins.
Inflation data sourced from CBK. Full methodology documented in the project report.

This dashboard uses static, verified historical data — it is a research snapshot,
not a live feed.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts. Vercel auto-detects the Vite framework preset.

### Option B: Git + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to vercel.com/new and import the repository
3. Vercel will auto-detect:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click Deploy

No environment variables are required since data is currently static/embedded.

## Updating the Data

Edit `src/data.js` directly. The dashboard reads from five exported objects:
`FUEL_PRICES`, `INFLATION`, `CORRELATIONS`, `FINANCIALS`, `YEAR_NOTES`.

To wire this up to a live source later (e.g. Supabase or the n8n pipeline output),
replace the static imports in `App.jsx` with a `fetch`/`useEffect` call against
your data source, mapping the response to the same shape used in `data.js`.

## Stack

- Vite + React 18
- Recharts for all charts
- lucide-react for icons
- Tailwind (utility classes for layout only — colors are inline via the `COLORS` token object)
