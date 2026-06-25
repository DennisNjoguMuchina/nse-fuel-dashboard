import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { Terminal, TrendingUp, TrendingDown, Activity, Database, AlertTriangle } from 'lucide-react';
import {
  COMPANIES, COMPANY_META, FUEL_PRICES, CORRELATIONS, FINANCIALS,
  YEAR_NOTES, DATA_PROVENANCE,
} from './data.js';

// ── COLOR TOKENS ────────────────────────────────────────────────────────
const COLORS = {
  bg: '#0a0d0e',
  panel: '#11161a',
  panelAlt: '#0d1114',
  border: '#1f2a30',
  amber: '#ffb000',
  green: '#00c805',
  red: '#ff3b30',
  blue: '#4fc3f7',
  violet: '#b389ff',
  textDim: '#5f6b72',
  textMid: '#9aa5ab',
  textBright: '#e8ecee',
};

const FONT = "'JetBrains Mono', monospace";

// ── SMALL UI PRIMITIVES ─────────────────────────────────────────────────
function PanelHeader({ code, title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: `1px solid ${COLORS.border}`, padding: '6px 10px',
      background: COLORS.panelAlt,
    }}>
      <span style={{ color: COLORS.amber, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{code}</span>
      <span style={{ color: COLORS.textDim, fontSize: 11 }}>{title}</span>
    </div>
  );
}

function Panel({ children, style }) {
  return (
    <div style={{
      background: COLORS.panel, border: `1px solid ${COLORS.border}`,
      borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatBlock({ label, value, sub, trend }) {
  const trendColor = trend === 'up' ? COLORS.green : trend === 'down' ? COLORS.red : COLORS.textMid;
  return (
    <div style={{ padding: '10px 14px', borderRight: `1px solid ${COLORS.border}`, flex: 1, minWidth: 0 }}>
      <div style={{ color: COLORS.textDim, fontSize: 10, letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ color: trendColor, fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {value}
        {trend === 'up' && <TrendingUp size={14} />}
        {trend === 'down' && <TrendingDown size={14} />}
      </div>
      {sub && <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: COLORS.panelAlt, border: `1px solid ${COLORS.border}`,
      padding: '8px 12px', fontSize: 11, fontFamily: FONT, color: COLORS.textBright,
    }}>
      <div style={{ color: COLORS.amber, marginBottom: 4, fontWeight: 700 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeCompany, setActiveCompany] = useState('EABL');
  const [yearRange, setYearRange] = useState([2016, 2025]);
  const [scrubYear, setScrubYear] = useState(2023);

  const meta = COMPANY_META[activeCompany];
  const fin = FINANCIALS[activeCompany];
  const corr = CORRELATIONS[activeCompany];

  // Merge financials with fuel prices for the overlay chart, filtered by year range
  const overlayData = useMemo(() => {
    return fin
      .filter(f => f.year >= yearRange[0] && f.year <= yearRange[1])
      .map(f => {
        const fuel = FUEL_PRICES.find(p => p.year === f.year);
        return { ...f, diesel: fuel?.diesel, petrol: fuel?.petrol };
      });
  }, [fin, yearRange]);

  const correlationBarData = COMPANIES.map(c => ({
    company: c,
    diesel: CORRELATIONS[c].diesel,
    petrol: CORRELATIONS[c].petrol,
  }));

  const cashFlowCompareData = useMemo(() => {
    return FINANCIALS.SAFARICOM.map((row, i) => ({
      year: row.year,
      SAFARICOM: row.ocf,
      EABL: FINANCIALS.EABL[i]?.ocf,
      KPLC: FINANCIALS.KPLC[i]?.ocf,
    }));
  }, []);

  const currentYearData = fin.find(f => f.year === scrubYear) || fin[fin.length - 1];
  const prevYearData = fin.find(f => f.year === scrubYear - 1);
  const marginDelta = prevYearData ? (currentYearData.grossMargin - prevYearData.grossMargin) : 0;

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.bg, color: COLORS.textBright,
      fontFamily: FONT, fontSize: 13,
    }}>

      {/* ── TICKER TAPE HEADER ── */}
      <div style={{
        background: '#000', borderBottom: `1px solid ${COLORS.border}`,
        padding: '6px 0', overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <div style={{ display: 'inline-flex', gap: 32, paddingLeft: 16, animation: 'none' }}>
          {[...FUEL_PRICES.slice(-5)].reverse().map((f, i) => (
            <span key={i} style={{ fontSize: 11, color: COLORS.textMid }}>
              <span style={{ color: COLORS.amber, fontWeight: 700 }}>DIESEL.FY{f.year}</span>{' '}
              <span style={{ color: COLORS.textBright }}>{f.diesel.toFixed(2)}</span>{' '}
              <span style={{ color: COLORS.green }}>KES/L</span>
            </span>
          ))}
          {COMPANIES.map(c => {
            const last = FINANCIALS[c][FINANCIALS[c].length - 1];
            const prev = FINANCIALS[c][FINANCIALS[c].length - 2];
            const up = last.grossMargin >= prev.grossMargin;
            return (
              <span key={c} style={{ fontSize: 11, color: COLORS.textMid }}>
                <span style={{ color: COLORS.blue, fontWeight: 700 }}>{c}.GM</span>{' '}
                <span style={{ color: up ? COLORS.green : COLORS.red }}>
                  {last.grossMargin.toFixed(2)}% {up ? '\u25B2' : '\u25BC'}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── TITLE BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Terminal size={18} color={COLORS.amber} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>
            NSE FUEL SENSITIVITY TERMINAL
          </span>
          <span style={{ color: COLORS.textDim, fontSize: 11 }}>FY2016&ndash;FY2025</span>
        </div>
        <div style={{ color: COLORS.textDim, fontSize: 11 }}>
          DENNIS NJOGU MUCHINA &middot; EQUITY RESEARCH
        </div>
      </div>

      <div style={{ display: 'flex' }}>

        {/* ── LEFT RAIL: FUNCTION CODES ── */}
        <div style={{
          width: 180, borderRight: `1px solid ${COLORS.border}`,
          padding: '14px 0', flexShrink: 0,
        }}>
          <div style={{ color: COLORS.textDim, fontSize: 10, padding: '0 14px 8px', letterSpacing: 0.5 }}>
            SELECT COMPANY
          </div>
          {COMPANIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCompany(c)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 14px', background: activeCompany === c ? COLORS.panelAlt : 'transparent',
                border: 'none', borderLeft: activeCompany === c ? `3px solid ${COLORS.amber}` : '3px solid transparent',
                color: activeCompany === c ? COLORS.amber : COLORS.textMid,
                fontFamily: FONT, fontSize: 12, fontWeight: activeCompany === c ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {c}&lt;GO&gt;
              <div style={{ fontSize: 9, color: COLORS.textDim, marginTop: 2, fontWeight: 400 }}>
                {COMPANY_META[c].sector}
              </div>
            </button>
          ))}

          <div style={{ color: COLORS.textDim, fontSize: 10, padding: '20px 14px 8px', letterSpacing: 0.5, borderTop: `1px solid ${COLORS.border}`, marginTop: 10 }}>
            YEAR RANGE
          </div>
          <div style={{ padding: '0 14px' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {[[2016, 2025], [2016, 2019], [2020, 2022], [2023, 2025]].map(([s, e]) => (
                <button
                  key={`${s}-${e}`}
                  onClick={() => setYearRange([s, e])}
                  style={{
                    fontSize: 9, padding: '4px 6px', flex: '1 0 auto',
                    background: yearRange[0] === s && yearRange[1] === e ? COLORS.amber : COLORS.panelAlt,
                    color: yearRange[0] === s && yearRange[1] === e ? '#000' : COLORS.textMid,
                    border: `1px solid ${COLORS.border}`, fontFamily: FONT, cursor: 'pointer',
                  }}
                >
                  {s}&ndash;{e}
                </button>
              ))}
            </div>
          </div>

          <div style={{ color: COLORS.textDim, fontSize: 10, padding: '20px 14px 8px', letterSpacing: 0.5, borderTop: `1px solid ${COLORS.border}`, marginTop: 10 }}>
            EXPOSURE PROFILE
          </div>
          <div style={{ padding: '0 14px', fontSize: 10, color: COLORS.textMid, lineHeight: 1.6 }}>
            {meta.exposure}
            <div style={{ color: COLORS.textDim, marginTop: 6 }}>FY end: {meta.fyEnd}</div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ flex: 1, padding: 16, minWidth: 0 }}>

          {/* Stat strip */}
          <Panel style={{ flexDirection: 'row', marginBottom: 14 }}>
            <StatBlock
              label="DIESEL CORRELATION"
              value={corr.diesel > 0 ? `+${corr.diesel.toFixed(2)}` : corr.diesel.toFixed(2)}
              sub="Pearson, FY16-25"
              trend={corr.diesel > 0 ? 'up' : 'down'}
            />
            <StatBlock
              label="PETROL CORRELATION"
              value={corr.petrol > 0 ? `+${corr.petrol.toFixed(2)}` : corr.petrol.toFixed(2)}
              sub="Pearson, FY16-25"
              trend={corr.petrol > 0 ? 'up' : 'down'}
            />
            <StatBlock
              label="GROSS MARGIN RANGE"
              value={`${Math.min(...fin.map(f => f.grossMargin)).toFixed(1)}&ndash;${Math.max(...fin.map(f => f.grossMargin)).toFixed(1)}%`}
              sub="Min-Max, FY16-25"
            />
            <StatBlock
              label="WORST REAL GROWTH YR"
              value={`FY${fin.reduce((a, b) => a.realGrowth < b.realGrowth ? a : b).year}`}
              sub={`${fin.reduce((a, b) => a.realGrowth < b.realGrowth ? a : b).realGrowth.toFixed(2)}%`}
              trend="down"
            />
            <div style={{ padding: '10px 14px', flex: 1.4 }}>
              <div style={{ color: COLORS.textDim, fontSize: 10, marginBottom: 4 }}>NARRATIVE</div>
              <div style={{ color: COLORS.textMid, fontSize: 10, lineHeight: 1.4 }}>
                {meta.full} ({meta.ticker})
              </div>
            </div>
          </Panel>

          {/* 2x2 chart grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* Panel 1: Margin vs Fuel overlay */}
            <Panel style={{ height: 320 }}>
              <PanelHeader code={`${activeCompany}<MARGIN>`} title="Gross Margin vs Diesel Price" />
              <div style={{ flex: 1, padding: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={overlayData}>
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="2 2" />
                    <XAxis dataKey="year" stroke={COLORS.textDim} fontSize={10} />
                    <YAxis yAxisId="left" stroke={COLORS.textDim} fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" stroke={COLORS.textDim} fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar yAxisId="left" dataKey="diesel" name="Diesel (KES/L)" fill={COLORS.amber} opacity={0.35} />
                    <Line yAxisId="right" type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke={meta.color} strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            {/* Panel 2: Real growth vs fuel */}
            <Panel style={{ height: 320 }}>
              <PanelHeader code={`${activeCompany}<GROWTH>`} title="Real Revenue Growth vs Diesel Price" />
              <div style={{ flex: 1, padding: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={overlayData}>
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="2 2" />
                    <XAxis dataKey="year" stroke={COLORS.textDim} fontSize={10} />
                    <YAxis yAxisId="left" stroke={COLORS.textDim} fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" stroke={COLORS.textDim} fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar yAxisId="right" dataKey="diesel" name="Diesel (KES/L)" fill={COLORS.amber} opacity={0.25} />
                    <Line yAxisId="left" type="monotone" dataKey="realGrowth" name="Real Growth %" stroke={COLORS.green} strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            {/* Panel 3: Correlation comparison across all 3 companies */}
            <Panel style={{ height: 300 }}>
              <PanelHeader code="ALL<CORREL>" title="Fuel Price Correlation \u2014 All Companies" />
              <div style={{ flex: 1, padding: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={correlationBarData}>
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="2 2" />
                    <XAxis dataKey="company" stroke={COLORS.textDim} fontSize={10} />
                    <YAxis stroke={COLORS.textDim} fontSize={10} domain={[-0.7, 0.7]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="diesel" name="Diesel Corr.">
                      {correlationBarData.map((d, i) => (
                        <Cell key={i} fill={d.diesel >= 0 ? COLORS.green : COLORS.red} />
                      ))}
                    </Bar>
                    <Bar dataKey="petrol" name="Petrol Corr." fillOpacity={0.5}>
                      {correlationBarData.map((d, i) => (
                        <Cell key={i} fill={d.petrol >= 0 ? COLORS.green : COLORS.red} fillOpacity={0.5} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            {/* Panel 4: Cash flow comparison */}
            <Panel style={{ height: 300 }}>
              <PanelHeader code="ALL<OCF>" title="Operating Cash Flow \u2014 All Companies (KES Mn)" />
              <div style={{ flex: 1, padding: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowCompareData}>
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="2 2" />
                    <XAxis dataKey="year" stroke={COLORS.textDim} fontSize={10} />
                    <YAxis stroke={COLORS.textDim} fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="SAFARICOM" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="EABL" stroke={COLORS.violet} strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="KPLC" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* Year scrubber + context strip */}
          <Panel style={{ marginBottom: 14 }}>
            <PanelHeader code="YEAR<SCRUB>" title="Year-by-Year Narrative Context" />
            <div style={{ padding: 14 }}>
              <input
                type="range"
                min={2016}
                max={2025}
                step={1}
                value={scrubYear}
                onChange={e => setScrubYear(Number(e.target.value))}
                style={{ width: '100%', accentColor: COLORS.amber, marginBottom: 10 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: COLORS.textDim, marginBottom: 12 }}>
                {Array.from({ length: 10 }, (_, i) => 2016 + i).map(y => <span key={y}>{y}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, minWidth: 140 }}>
                  <div style={{ color: COLORS.amber, fontSize: 22, fontWeight: 700 }}>FY{scrubYear}</div>
                  <div style={{ color: COLORS.textMid, fontSize: 11, marginTop: 4 }}>
                    {activeCompany} Margin: <span style={{ color: COLORS.textBright }}>{currentYearData.grossMargin.toFixed(2)}%</span>
                  </div>
                  <div style={{
                    color: marginDelta >= 0 ? COLORS.green : COLORS.red, fontSize: 11, marginTop: 2,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {marginDelta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {marginDelta >= 0 ? '+' : ''}{marginDelta.toFixed(2)}pp YoY
                  </div>
                </div>
                <div style={{ borderLeft: `1px solid ${COLORS.border}`, paddingLeft: 16, flex: 1 }}>
                  <div style={{ color: COLORS.textBright, fontSize: 12, lineHeight: 1.6 }}>
                    {YEAR_NOTES[scrubYear]}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Synthesis table */}
          <Panel>
            <PanelHeader code="ALL<SYNTHESIS>" title="Cross-Company Synthesis" />
            <div style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: COLORS.textDim }}></th>
                    {COMPANIES.map(c => (
                      <th key={c} style={{ textAlign: 'left', padding: '8px 12px', color: COMPANY_META[c].color }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Fuel Exposure', c => COMPANY_META[c].exposure],
                    ['Diesel Correlation', c => (CORRELATIONS[c].diesel > 0 ? '+' : '') + CORRELATIONS[c].diesel.toFixed(2)],
                    ['Worst Year', c => {
                      const worst = FINANCIALS[c].reduce((a, b) => a.grossMargin < b.grossMargin ? a : b);
                      return `FY${worst.year} (${worst.grossMargin.toFixed(2)}%)`;
                    }],
                  ].map(([label, fn], i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 ? COLORS.panelAlt : 'transparent' }}>
                      <td style={{ padding: '8px 12px', color: COLORS.textDim }}>{label}</td>
                      {COMPANIES.map(c => (
                        <td key={c} style={{ padding: '8px 12px', color: COLORS.textBright }}>{fn(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

        </div>
      </div>

      {/* ── COMMAND-LINE FOOTER ── */}
      <div style={{
        borderTop: `1px solid ${COLORS.border}`, padding: '8px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: COLORS.panelAlt,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.green, fontSize: 11 }}>
          <span>&gt;</span>
          <span style={{ color: COLORS.textMid }}>{activeCompany}&lt;GO&gt;</span>
          <span style={{ animation: 'blink 1s step-start infinite' }}>&#9608;</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.textDim, fontSize: 10 }}>
          <Database size={11} />
          <span>{DATA_PROVENANCE}</span>
        </div>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        input[type="range"] { -webkit-appearance: none; height: 4px; background: ${COLORS.border}; border-radius: 2px; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
          background: ${COLORS.amber}; cursor: pointer;
        }
      `}</style>
    </div>
  );
}
