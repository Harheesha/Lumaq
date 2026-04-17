import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

/* ─── static seed data ─── */
const HOURS = ['12a','2a','4a','6a','8a','10a','12p','2p','4p','6p','8p','10p']
const SOLAR_KWH = [0,0,0,0,0.4,2.1,4.8,6.2,5.9,3.2,0.6,0]
const BATT_PCT  = [62,58,54,50,52,58,68,76,80,74,72,70]
const GEN_MIN   = [0,0,0,0,0,0,0,0,0,0,0,0]
const COST_DAYS = ['Apr 1','Apr 5','Apr 10','Apr 15','Apr 17']
const COST_GEN  = [8400,0,2100,0,0]
const COST_SAVE = [32000,38000,35000,41000,12480]

const CIRCUITS = [
  { name: 'AC Unit — Main office', draw: 3.2, max: 4.0, status: 'high' },
  { name: 'Refrigerators (3×)',    draw: 1.8, max: 4.0, status: 'normal' },
  { name: 'Server rack',           draw: 0.9, max: 4.0, status: 'normal' },
  { name: 'AC Unit — Store room',  draw: 2.1, max: 4.0, status: 'normal' },
  { name: 'Lighting — Ground flr', draw: 0.4, max: 4.0, status: 'normal' },
  { name: 'Security & CCTV',       draw: 0.3, max: 4.0, status: 'normal' },
  { name: 'Sockets — Common area', draw: 0.6, max: 4.0, status: 'normal' },
  { name: 'Water pump',            draw: 0.2, max: 4.0, status: 'normal' },
]

const EVENTS = [
  { color: '#5bb827', title: 'Grid dropped — switched to solar automatically',        time: '06:12 AM', detail: 'No load interruption.' },
  { color: '#e8940a', title: 'Battery at 82% — charging paused to protect cycle life', time: '08:44 AM', detail: 'Lumaq applied automatically.' },
  { color: '#e03030', title: 'AC unit on circuit 1 drawing 40% above baseline',        time: '10:21 AM', detail: 'Check refrigerant levels or air filter.' },
  { color: '#e03030', title: 'Outage forecast: IKEDC Feeder 4 likely 5–9 PM',         time: 'Predicted', detail: 'Battery pre-charging to 92% by 4:30 PM.' },
  { color: '#5bb827', title: 'Solar yield above forecast — 22.1 kWh so far',          time: '12:00 PM', detail: 'Sky clear, panels at peak output.' },
]

/* ─── tiny SVG sparkline ─── */
function Sparkline({ data, color = '#b8f03c', width = 120, height = 36 }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })
  const pathD = 'M ' + pts.join(' L ')
  const fillD = pathD + ` L ${width},${height} L 0,${height} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── SVG bar chart ─── */
function BarChart({ labels, values, color = '#b8f03c', unit = '' }) {
  const max = Math.max(...values) || 1
  const W = 100, H = 80, barW = W / values.length - 2
  return (
    <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" style={{ width: '100%', height: '110px', display: 'block', overflow: 'visible' }}>
      {values.map((v, i) => {
        const bH = (v / max) * H
        const x  = (i / values.length) * W + 1
        const y  = H - bH + 5
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bH} fill={color} opacity="0.85" rx="1" />
            <text x={x + barW / 2} y={98} textAnchor="middle" fill="rgba(255,255,255,.25)" fontSize="5">{labels[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── donut chart ─── */
function Donut({ pct, color = '#b8f03c', size = 72, stroke = 8 }) {
  const r   = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray .8s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#f2efe8" fontSize="12" fontWeight="800" fontFamily="Syne, sans-serif">
        {pct}%
      </text>
    </svg>
  )
}

const TABS = ['overview', 'solar', 'circuits', 'generator', 'reports']

export default function Dashboard() {
  const router = useRouter()
  const [saved, setSaved]     = useState(12480)
  const [batt, setBatt]       = useState(72)
  const [solar, setSolar]     = useState(3.1)
  const [tab, setTab]         = useState('overview')
  const [now, setNow]         = useState('')
  const [solarData, setSolarData] = useState([...SOLAR_KWH])

  useEffect(() => {
    setNow(new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' }))
    const id = setInterval(() => {
      setSaved(s => s + Math.floor(Math.random() * 5 + 1))
      setSolar(s => Math.max(2.4, Math.min(3.8, +(s + (Math.random() - 0.5) * 0.07).toFixed(1))))
      setBatt(b  => Math.min(94, +(b + 0.04).toFixed(1)))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  /* update live solar sparkline */
  useEffect(() => {
    setSolarData(d => {
      const next = [...d]
      next[next.length - 1] = solar
      return next
    })
  }, [solar])

  return (
    <>
      <Head>
        <title>Dashboard — Lumaq</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; }
          body { font-family: 'DM Sans', sans-serif; background: #f0ede7; color: #0a0a0a; }
          a, button { font-family: 'DM Sans', sans-serif; }
          ul { list-style: none; }

          /* TOPBAR */
          .topbar {
            position: sticky; top: 0; z-index: 100;
            background: #fff; border-bottom: 1px solid rgba(0,0,0,.09);
            padding: .85rem 1.75rem;
            display: flex; align-items: center; justify-content: space-between;
          }
          .t-logo { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; letter-spacing: -.03em; color: #0a0a0a; }
          .t-logo span { color: #6ea800; }
          .t-right { display: flex; align-items: center; gap: .75rem; }
          .site-pill { background: #edf5d0; color: #4a7a00; border: 1px solid #c2e070; border-radius: 2rem; padding: .28rem .85rem; font-size: .72rem; font-weight: 600; }
          .avatar { width: 30px; height: 30px; border-radius: 50%; background: #d8f0a0; display: flex; align-items: center; justify-content: center; font-size: .65rem; font-weight: 700; color: #4a7a00; }
          .signout-btn { background: transparent; border: 1px solid rgba(0,0,0,.1); border-radius: .45rem; padding: .3rem .7rem; font-size: .72rem; color: #888; cursor: pointer; transition: border-color .15s, color .15s; }
          .signout-btn:hover { color: #0a0a0a; border-color: rgba(0,0,0,.25); }

          /* LAYOUT */
          .layout { display: flex; min-height: calc(100vh - 57px); }

          /* SIDEBAR */
          .sidebar { width: 168px; flex-shrink: 0; padding: 1.25rem .75rem; border-right: 1px solid rgba(0,0,0,.07); background: #fff; display: flex; flex-direction: column; gap: .1rem; }
          .s-tab {
            width: 100%; text-align: left; background: transparent;
            border: none; border-radius: .5rem; padding: .6rem .85rem;
            font-size: .8rem; color: #999; cursor: pointer; transition: background .15s, color .15s;
            text-transform: capitalize;
          }
          .s-tab:hover { background: #f5f3ee; color: #0a0a0a; }
          .s-tab.active { background: #edf5d0; color: #3d7000; font-weight: 600; }
          .s-divider { height: 1px; background: rgba(0,0,0,.07); margin: .5rem 0; }

          /* MAIN */
          .main { flex: 1; padding: 2rem; overflow-y: auto; }
          .main-inner { max-width: 920px; }
          .greeting { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; letter-spacing: -.03em; margin-bottom: .2rem; }
          .sub-date { font-size: .78rem; color: #aaa; margin-bottom: 1.75rem; }

          /* SOURCE BAR */
          .source-bar {
            background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: .85rem;
            padding: .85rem 1.25rem; margin-bottom: 1.25rem;
            display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;
          }
          .src { display: flex; align-items: center; gap: .45rem; font-size: .8rem; color: #888; }
          .src-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
          .src strong { color: #0a0a0a; font-weight: 600; }
          .src.off { opacity: .4; }

          /* STAT CARDS */
          .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: .85rem; margin-bottom: 1.25rem; }
          .stat-card { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: .85rem; padding: 1.25rem 1.1rem; }
          .stat-label { font-size: .7rem; text-transform: uppercase; letter-spacing: .07em; color: #aaa; margin-bottom: .65rem; }
          .stat-val { font-family: 'Syne', sans-serif; font-size: 1.55rem; font-weight: 800; letter-spacing: -.03em; color: #0a0a0a; margin-bottom: .3rem; }
          .stat-val span { font-size: .85rem; font-weight: 400; color: #aaa; }
          .stat-sub { font-size: .72rem; color: #bbb; }
          .stat-up { color: #5bb827; }
          .stat-chart { margin-top: .75rem; }

          /* SAVINGS BANNER */
          .savings-banner {
            background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: .85rem;
            padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;
            display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
          }
          .savings-label { font-size: .72rem; text-transform: uppercase; letter-spacing: .07em; color: #aaa; margin-bottom: .35rem; }
          .savings-amt { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -.04em; color: #3d7000; line-height: 1; margin-bottom: .2rem; }
          .savings-note { font-size: .75rem; color: #bbb; }
          .savings-badge { background: #edf5d0; color: #4a7a00; border: 1px solid #c2e070; border-radius: 2rem; padding: .5rem 1.1rem; font-size: .78rem; font-weight: 600; white-space: nowrap; }

          /* CHART PANEL */
          .chart-panel { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: .85rem; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem; }
          .panel-title { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 700; margin-bottom: .25rem; }
          .panel-sub { font-size: .75rem; color: #aaa; margin-bottom: 1.25rem; }
          .chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

          /* ENERGY MIX */
          .mix-row { display: flex; align-items: center; gap: 1.5rem; }
          .mix-labels { flex: 1; display: flex; flex-direction: column; gap: .6rem; }
          .mix-item { display: flex; align-items: center; gap: .6rem; font-size: .8rem; color: #555; }
          .mix-swatch { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
          .mix-pct { margin-left: auto; font-weight: 600; color: #0a0a0a; }

          /* CIRCUITS */
          .circuit-list { display: flex; flex-direction: column; gap: .5rem; }
          .circuit-row { display: flex; align-items: center; gap: .85rem; padding: .65rem; background: #f9f8f5; border-radius: .5rem; }
          .circuit-name { font-size: .8rem; color: #555; width: 190px; flex-shrink: 0; }
          .circuit-bar-wrap { flex: 1; background: rgba(0,0,0,.07); border-radius: 3px; height: 5px; overflow: hidden; }
          .circuit-bar-fill { height: 100%; border-radius: 3px; transition: width .6s cubic-bezier(0.22,1,0.36,1); }
          .circuit-kw { font-size: .8rem; font-weight: 600; width: 55px; text-align: right; flex-shrink: 0; }

          /* EVENTS */
          .events-list { display: flex; flex-direction: column; gap: .75rem; }
          .event-row { display: flex; gap: .85rem; padding: .85rem 1rem; background: #fff; border: 1px solid rgba(0,0,0,.07); border-radius: .75rem; }
          .ev-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: .35rem; }
          .ev-title { font-size: .85rem; font-weight: 500; color: #0a0a0a; margin-bottom: .15rem; }
          .ev-detail { font-size: .75rem; color: #aaa; margin-bottom: .15rem; }
          .ev-time { font-size: .7rem; color: #ccc; }

          /* REPORT GRID */
          .report-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-top: 1.25rem; }
          .r-stat { background: #f9f8f5; border-radius: .65rem; padding: 1rem; }
          .r-val { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; letter-spacing: -.03em; color: #0a0a0a; margin-bottom: .25rem; }
          .r-lbl { font-size: .75rem; color: #aaa; }
          .gen-note { margin-top: 1.25rem; font-size: .82rem; color: #777; line-height: 1.65; padding: 1rem; background: #f9f8f5; border-radius: .65rem; }

          /* MOBILE */
          @media (max-width: 800px) {
            .sidebar { display: none; }
            .stat-grid { grid-template-columns: repeat(2,1fr); }
            .chart-row { grid-template-columns: 1fr; }
            .report-grid { grid-template-columns: repeat(2,1fr); }
            .circuit-name { width: 130px; }
          }
          @media (max-width: 500px) {
            .main { padding: 1.25rem 1rem; }
            .stat-grid { grid-template-columns: 1fr 1fr; }
          }
        `}</style>
      </Head>

      <div>
        {/* TOPBAR */}
        <nav className="topbar">
          <div className="t-logo">Lumaq<span>.</span></div>
          <div className="t-right">
            <div className="site-pill">Lekki Phase 1</div>
            <div className="avatar">AC</div>
            <button className="signout-btn" onClick={() => router.push('/')}>Sign out</button>
          </div>
        </nav>

        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            {TABS.map(t => (
              <button key={t} className={`s-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <div className="s-divider" />
            <button className="s-tab" onClick={() => router.push('/')}>← Site</button>
          </aside>

          {/* MAIN */}
          <main className="main">
            <div className="main-inner">
              <div className="greeting">Good morning, Adebayo.</div>
              <div className="sub-date">{now} · Lekki Phase 1</div>

              {/* SOURCE BAR */}
              <div className="source-bar">
                <div className="src">
                  <span className="src-dot" style={{ background: '#5bb827' }} />
                  Solar <strong style={{ marginLeft: '.35rem', color: '#3d7000' }}>{solar} kW</strong>
                </div>
                <div className="src">
                  <span className="src-dot" style={{ background: '#e8940a' }} />
                  Battery <strong style={{ marginLeft: '.35rem' }}>{batt.toFixed(0)}%</strong>
                </div>
                <div className="src off">
                  <span className="src-dot" style={{ background: '#ccc' }} />
                  Grid <strong style={{ marginLeft: '.35rem' }}>offline</strong>
                </div>
                <div className="src off">
                  <span className="src-dot" style={{ background: '#ccc' }} />
                  Generator <strong style={{ marginLeft: '.35rem' }}>off</strong>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Solar today</div>
                  <div className="stat-val">22.1 <span>kWh</span></div>
                  <div className="stat-sub stat-up">↑ 18% vs yesterday</div>
                  <div className="stat-chart">
                    <Sparkline data={solarData} color="#5bb827" width={100} height={32} />
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Battery charge</div>
                  <div className="stat-val">{batt.toFixed(0)}<span>%</span></div>
                  <div className="stat-sub">Est. 7h 20m remaining</div>
                  <div className="stat-chart">
                    <Sparkline data={BATT_PCT} color="#e8940a" width={100} height={32} />
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Current load</div>
                  <div className="stat-val">9.5 <span>kW</span></div>
                  <div className="stat-sub">8 circuits active</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Grid supply today</div>
                  <div className="stat-val">4 <span>hrs</span></div>
                  <div className="stat-sub">Last seen 06:12 AM</div>
                </div>
              </div>

              {/* SAVINGS */}
              <div className="savings-banner">
                <div>
                  <div className="savings-label">Saved today vs generator</div>
                  <div className="savings-amt">₦{saved.toLocaleString('en-NG')}</div>
                  <div className="savings-note">Solar since 06:12 AM · ₦900/kWh gen cost avoided</div>
                </div>
                <div className="savings-badge">22.1 kWh clean energy today</div>
              </div>

              {/* CHARTS PANEL — overview + solar */}
              {(tab === 'overview' || tab === 'solar') && (
                <div className="chart-panel">
                  <div className="panel-title">Energy breakdown — today</div>
                  <div className="panel-sub">Hourly solar output (kWh) and battery state (%)</div>
                  <div className="chart-row">
                    <div>
                      <div style={{ fontSize: '.72rem', color: '#aaa', marginBottom: '.5rem' }}>Solar yield (kWh/hr)</div>
                      <BarChart labels={HOURS} values={SOLAR_KWH} color="#a0d848" unit="kWh" />
                    </div>
                    <div>
                      <div style={{ fontSize: '.72rem', color: '#aaa', marginBottom: '.5rem' }}>Battery state (%)</div>
                      <BarChart labels={HOURS} values={BATT_PCT} color="#e8c47a" unit="%" />
                    </div>
                  </div>

                  {tab === 'overview' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <div style={{ fontSize: '.72rem', color: '#aaa', marginBottom: '.75rem' }}>Energy mix today</div>
                      <div className="mix-row">
                        <Donut pct={74} color="#5bb827" />
                        <div className="mix-labels">
                          {[
                            { label: 'Solar',    pct: 74, color: '#5bb827' },
                            { label: 'Battery',  pct: 19, color: '#e8940a' },
                            { label: 'Grid',     pct: 7,  color: '#1a5fd4' },
                            { label: 'Generator',pct: 0,  color: '#e03030' },
                          ].map(m => (
                            <div className="mix-item" key={m.label}>
                              <span className="mix-swatch" style={{ background: m.color }} />
                              {m.label}
                              <span className="mix-pct">{m.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'solar' && (
                    <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f9f8f5', borderRadius: '.65rem', fontSize: '.82rem', color: '#777', lineHeight: 1.65 }}>
                      String 2 underperformed on the 12th and 13th — possible soiling or partial shading. Estimated yield loss: <strong style={{ color: '#0a0a0a' }}>₦4,800</strong>. Cleaning recommended this week.
                    </div>
                  )}
                </div>
              )}

              {/* CIRCUITS TAB */}
              {tab === 'circuits' && (
                <div className="chart-panel">
                  <div className="panel-title">Circuit breakdown</div>
                  <div className="panel-sub">Current draw per monitored circuit</div>
                  <div className="circuit-list" style={{ marginTop: '.5rem' }}>
                    {CIRCUITS.map((c, i) => (
                      <div key={i} className="circuit-row">
                        <div className="circuit-name">{c.name}</div>
                        <div className="circuit-bar-wrap">
                          <div
                            className="circuit-bar-fill"
                            style={{ width: `${(c.draw / c.max) * 100}%`, background: c.status === 'high' ? '#e03030' : '#a0d848' }}
                          />
                        </div>
                        <div className="circuit-kw" style={{ color: c.status === 'high' ? '#e03030' : '#0a0a0a' }}>
                          {c.draw} kW {c.status === 'high' ? '⚠' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GENERATOR TAB */}
              {tab === 'generator' && (
                <div className="chart-panel">
                  <div className="panel-title">Generator · April 2025</div>
                  <div className="panel-sub">Runtime, fuel and cost tracking</div>
                  <div className="report-grid">
                    {[
                      { val: '18 min', lbl: 'Total runtime this month', color: '#5bb827' },
                      { val: '1.4 L',  lbl: 'Fuel consumed' },
                      { val: '₦2,100', lbl: 'Generator cost this month' },
                      { val: 'Mar 2026', lbl: 'Next service due' },
                    ].map((r, i) => (
                      <div key={i} className="r-stat">
                        <div className="r-val" style={r.color ? { color: r.color } : {}}>{r.val}</div>
                        <div className="r-lbl">{r.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="gen-note">
                    Your generator ran for 18 minutes total in April — only during the morning of the 3rd when battery hit the floor threshold. Lumaq kept it off the remaining 29 days.
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <div style={{ fontSize: '.72rem', color: '#aaa', marginBottom: '.5rem' }}>Daily generator runtime (min) — April</div>
                    <BarChart labels={COST_DAYS} values={GEN_MIN.concat([2,0,0,0,0]).slice(0,5)} color="#e8940a" />
                  </div>
                </div>
              )}

              {/* REPORTS TAB */}
              {tab === 'reports' && (
                <div className="chart-panel">
                  <div className="panel-title">Monthly summary — April 2025</div>
                  <div className="panel-sub">Energy cost and savings overview</div>
                  <div className="report-grid">
                    {[
                      { val: '₦384,000', lbl: 'Generator cost avoided' },
                      { val: '412 kWh',  lbl: 'Solar energy used' },
                      { val: '3.2 hrs',  lbl: 'Avg daily grid supply' },
                      { val: '18 min',   lbl: 'Generator runtime total' },
                    ].map((r, i) => (
                      <div key={i} className="r-stat">
                        <div className="r-val">{r.val}</div>
                        <div className="r-lbl">{r.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ fontSize: '.72rem', color: '#aaa', marginBottom: '.5rem' }}>Daily savings vs generator (₦)</div>
                    <BarChart labels={COST_DAYS} values={COST_SAVE} color="#a0d848" />
                  </div>
                </div>
              )}

              {/* EVENTS FEED — always visible on overview */}
              {(tab === 'overview') && (
                <div className="chart-panel">
                  <div className="panel-title">Events today</div>
                  <div className="panel-sub">System actions and anomalies</div>
                  <div className="events-list" style={{ marginTop: '.75rem' }}>
                    {EVENTS.map((ev, i) => (
                      <div key={i} className="event-row">
                        <span className="ev-dot" style={{ background: ev.color }} />
                        <div>
                          <div className="ev-title">{ev.title}</div>
                          <div className="ev-detail">{ev.detail}</div>
                          <div className="ev-time">{ev.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </>
  )
}
