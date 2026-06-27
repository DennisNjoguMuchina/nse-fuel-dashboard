// NSE Fuel Price Sensitivity Dataset
// Source: n8n + Claude Haiku 4.5 extraction pipeline from audited annual report PDFs
// Cross-verified against published results. See project methodology report for full provenance.
// All monetary figures in KShs Millions. Margins and growth rates in percent.

export const COMPANIES = ["SAFARICOM", "EABL", "KPLC"];

export const COMPANY_META = {
  SAFARICOM: {
    full: "Safaricom PLC",
    ticker: "SCOM",
    sector: "Telecoms",
    exposure: "Low / Indirect",
    fyEnd: "31 March",
    color: "#4fc3f7",
  },
  EABL: {
    full: "East African Breweries Limited",
    ticker: "EABL",
    sector: "Manufacturing / FMCG",
    exposure: "Medium / Direct + Currency",
    fyEnd: "30 June",
    color: "#b389ff",
  },
  KPLC: {
    full: "Kenya Power & Lighting Company",
    ticker: "KPLC",
    sector: "Power Utility",
    exposure: "High / Regulated Pass-Through",
    fyEnd: "30 June",
    color: "#ffb000",
  },
};

// Annual average fuel prices, KShs per litre. EPRA data 2019-2025; pre-2019 directional only.
export const FUEL_PRICES = [
  { year: 2016, kerosene: 53.35, petrol: 89.48, diesel: 77.54 },
  { year: 2017, kerosene: 65.63, petrol: 99.72, diesel: 88.04 },
  { year: 2018, kerosene: 89.30, petrol: 111.39, diesel: 103.24 },
  { year: 2019, kerosene: 102.04, petrol: 108.40, diesel: 101.60 },
  { year: 2020, kerosene: 84.66, petrol: 104.56, diesel: 94.29 },
  { year: 2021, kerosene: 99.01, petrol: 125.03, diesel: 107.72 },
  { year: 2022, kerosene: 126.13, petrol: 156.54, diesel: 138.78 },
  { year: 2023, kerosene: 169.82, petrol: 193.90, diesel: 179.54 },
  { year: 2024, kerosene: 167.78, petrol: 191.22, diesel: 177.47 },
  { year: 2025, kerosene: 151.18, petrol: 177.93, diesel: 167.20 },
];

// CBK annual average inflation, percent
export const INFLATION = {
  2016: 6.30, 2017: 7.98, 2018: 4.69, 2019: 5.20, 2020: 5.41,
  2021: 5.62, 2022: 7.66, 2023: 7.67, 2024: 4.50, 2025: 4.07,
};

// Correlation coefficients: fuel price vs gross margin, FY2016-FY2025 (Pearson, via Excel CORREL)
export const CORRELATIONS = {
  SAFARICOM: { diesel: 0.59, petrol: 0.55 },
  EABL: { diesel: -0.49, petrol: -0.47 },
  KPLC: { diesel: -0.51, petrol: -0.53 },
};

// Per-company year-by-year financials
export const FINANCIALS = {
  SAFARICOM: [
    { year: 2016, grossMargin: 68.16, realGrowth: 13.48, pat: 38100, ocf: 78840 },
    { year: 2017, grossMargin: 68.65, realGrowth: 0.81, pat: 48440, ocf: 102340 },
    { year: 2018, grossMargin: 69.88, realGrowth: 5.33, pat: 55290, ocf: 117320 },
    { year: 2019, grossMargin: 71.32, realGrowth: 1.66, pat: 62490, ocf: 124230 },
    { year: 2020, grossMargin: 71.55, realGrowth: -0.50, pat: 73660, ocf: 135820 },
    { year: 2021, grossMargin: 69.69, realGrowth: -5.06, pat: 68676.2, ocf: 127900.3 },
    { year: 2022, grossMargin: 69.31, realGrowth: 5.24, pat: 67496.1, ocf: 110700.5 },
    { year: 2023, grossMargin: 70.33, realGrowth: -3.37, pat: 52482.8, ocf: 116151.1 },
    { year: 2024, grossMargin: 72.23, realGrowth: 7.90, pat: 42658.4, ocf: 107923.6 },
    { year: 2025, grossMargin: 73.99, realGrowth: 7.16, pat: 45757.2, ocf: 137693.9 },
  ],
  EABL: [
    { year: 2016, grossMargin: 50.08, netMargin: 16.02, realGrowth: -6.49, pat: 10300, ocf: 18500 },
    { year: 2017, grossMargin: 44.30, netMargin: 12.11, realGrowth: 1.20, pat: 8500, ocf: 13900 },
    { year: 2018, grossMargin: 44.11, netMargin: 9.88, realGrowth: -0.05, pat: 7256, ocf: 13559 },
    { year: 2019, grossMargin: 46.18, netMargin: 13.95, realGrowth: 7.17, pat: 11515, ocf: 22566 },
    { year: 2020, grossMargin: 44.00, netMargin: 9.33, realGrowth: -14.55, pat: 7000, ocf: 3300 },
    { year: 2021, grossMargin: 43.52, netMargin: 8.10, realGrowth: 9.00, pat: 6962, ocf: 14612 },
    { year: 2022, grossMargin: 48.31, netMargin: 14.23, realGrowth: 19.62, pat: 15574, ocf: 25906 },
    { year: 2023, grossMargin: 43.23, netMargin: 11.24, realGrowth: -7.45, pat: 12323, ocf: 11054 },
    { year: 2024, grossMargin: 43.35, netMargin: 8.76, realGrowth: 8.71, pat: 10870, ocf: 22098 },
    { year: 2025, grossMargin: 41.99, netMargin: 9.47, realGrowth: -0.32, pat: 12198, ocf: 23767 },
  ],
  KPLC: [
    { year: 2016, grossMargin: 35.16, realGrowth: -4.79, pat: 7197, ocf: 26611 },
    { year: 2017, grossMargin: 34.62, realGrowth: 3.43, pat: 7266, ocf: 27360 },
    { year: 2018, grossMargin: 35.99, realGrowth: 4.12, pat: 3268, ocf: 28266 },
    { year: 2019, grossMargin: 32.29, realGrowth: -3.86, pat: 262, ocf: 26750 },
    { year: 2020, grossMargin: 34.34, realGrowth: -5.32, pat: -939, ocf: 23561 },
    { year: 2021, grossMargin: 34.62, realGrowth: 2.53, pat: 1490, ocf: 33489 },
    { year: 2022, grossMargin: 26.78, realGrowth: 1.52, pat: 3504, ocf: 28551 },
    { year: 2023, grossMargin: 24.82, realGrowth: 13.70, pat: -3193, ocf: 32651 },
    { year: 2024, grossMargin: 34.84, realGrowth: 16.52, pat: 30080, ocf: 28374 },
    { year: 2025, grossMargin: 34.03, realGrowth: -9.19, pat: 24467, ocf: 39768 },
  ],
};

// Year-specific analyst notes used to drive the "context strip" in the dashboard
export const YEAR_NOTES = {
  2016: "Fuel prices begin a steady decade-long climb. All three companies stable.",
  2017: "Continued fuel price increase. EABL margin drops sharply as early cost pressure bites.",
  2018: "Fuel prices keep climbing. KPLC margin holds its strongest point of the decade (35.99%).",
  2019: "Pre-pandemic peak. EPRA price series begins. KPLC margin dips to a then-low of 32.29%.",
  2020: "COVID-19 demand shock. Fuel prices fall, but EABL operating cash flow collapses 85% \u2014 a demand story, not a fuel story.",
  2021: "Fuel prices accelerate sharply. Safaricom real growth troughs at -5.06% \u2014 explained by post-COVID recovery lag, not fuel.",
  2022: "Sharpest fuel price acceleration in the dataset. KPLC margin cracks (34.62% \u2192 26.78%) \u2014 tariff lag effect. EABL and Safaricom both show strong recovery instead.",
  2023: "Peak fuel price year across diesel, petrol and kerosene. EABL breaks across 5 metrics simultaneously. KPLC margin hits its decade low (24.82%) while real growth peaks (+13.70%) \u2014 fuel surcharge pass-through.",
  2024: "Fuel prices ease slightly from peak. KPLC margin recovers sharply as tariff catches up. EABL recovery incomplete.",
  2025: "Fuel prices continue easing. KPLC real growth crashes -9.19% \u2014 verified against source statement as a finance-cost swing, NOT a fuel effect.",
};

export const DATA_PROVENANCE = "Source: n8n workflow + Claude Haiku 4.5 extraction pipeline, audited annual report PDFs (Safaricom, EABL, KPLC), EPRA monthly fuel price bulletins, CBK CPI data. Cross-verified against published financial statements. Full methodology in project report.";
