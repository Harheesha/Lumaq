import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'

/* ─── tiny animation hook: counts up a number once on mount ─── */
function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const prog = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(prog * target))
      if (prog < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

/* ─── live hero card — actually animated ─── */
function LiveCard() {
  const [saved, setSaved]   = useState(12480)
  const [solar, setSolar]   = useState(3.1)
  const [batt, setBatt]     = useState(72)
  const [tick, setTick]     = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSaved(s => s + Math.floor(Math.random() * 5 + 1))
      setSolar(s => Math.max(2.5, Math.min(3.8, +(s + (Math.random() - 0.5) * 0.06).toFixed(1))))
      setBatt(b  => Math.min(94, +(b + 0.03).toFixed(1)))
      setTick(t => t + 1)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const events = [
    { color: 'var(--green)',  text: 'Grid dropped → auto-switched to solar' },
    { color: 'var(--amber)',  text: 'Outage 5–9 PM — battery pre-charging' },
    { color: 'var(--blue)',   text: 'Circuit 7 drawing 40% above baseline' },
  ]

  return (
    <div style={card}>
      <div style={livePill}>
        <span style={liveDot} />
        Live · Lekki Phase 1
      </div>

      {/* source row */}
      <div style={sourceRow}>
        <div style={src}>
          <div style={srcLabel}>Solar</div>
          <div style={{ ...srcVal, color: 'var(--lime)' }}>{solar} kW</div>
        </div>
        <div style={src}>
          <div style={srcLabel}>Battery</div>
          <div style={{ ...srcVal, color: 'var(--amber)' }}>{batt.toFixed(0)}%</div>
        </div>
        <div style={src}>
          <div style={srcLabel}>Generator</div>
          <div style={{ ...srcVal, color: 'var(--green)', fontSize: '.9rem' }}>OFF</div>
        </div>
      </div>

      {/* battery bar */}
      <div style={battBar}>
        <div style={{ ...battFill, width: `${batt}%` }} />
      </div>

      {/* savings */}
      <div style={savingsBox}>
        <span style={savingsLabel}>Saved today vs gen</span>
        <span style={savingsAmt}>₦{saved.toLocaleString('en-NG')}</span>
      </div>

      {/* events */}
      <div style={eventsStack}>
        {events.map((e, i) => (
          <div key={i} style={eventRow}>
            <span style={{ ...evDot, background: e.color }} />
            <span style={evText}>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── inline styles for the card (avoids CSS module churn) ─── */
const card = {
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '1.25rem',
  padding: '1.5rem',
  width: '100%',
  maxWidth: '380px',
}
const livePill = {
  display: 'inline-flex', alignItems: 'center', gap: '.4rem',
  fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem',
}
const liveDot = {
  display: 'inline-block', width: '7px', height: '7px',
  borderRadius: '50%', background: 'var(--green)',
  animation: 'pulse 1.5s ease-in-out infinite',
}
const sourceRow = {
  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem',
  marginBottom: '1rem',
}
const src  = {}
const srcLabel = { fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.07em', color: 'rgba(255,255,255,.3)', marginBottom: '.25rem' }
const srcVal   = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }
const battBar  = { background: 'rgba(255,255,255,.08)', borderRadius: '4px', height: '4px', marginBottom: '1.1rem', overflow: 'hidden' }
const battFill = { height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg,var(--lime),#8ecf00)', transition: 'width 1s var(--ease-out)' }
const savingsBox = {
  background: 'rgba(184,240,60,0.07)', border: '1px solid rgba(184,240,60,.18)',
  borderRadius: '.75rem', padding: '.85rem 1rem', marginBottom: '1.1rem',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
const savingsLabel = { fontSize: '.72rem', color: 'rgba(255,255,255,.4)' }
const savingsAmt   = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', color: 'var(--lime)' }
const eventsStack  = { display: 'flex', flexDirection: 'column', gap: '.6rem' }
const eventRow     = { display: 'flex', alignItems: 'flex-start', gap: '.55rem' }
const evDot        = { flexShrink: 0, width: '7px', height: '7px', borderRadius: '50%', marginTop: '.3rem' }
const evText       = { fontSize: '.74rem', color: 'rgba(255,255,255,.42)', lineHeight: 1.4 }

/* ─── main page ─── */
export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Lumaq — Smart Energy for Nigerian Businesses</title>
        <meta name="description" content="Lumaq automatically manages your solar, battery, grid and generator — so you stop burning diesel money." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
          body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #f2efe8; line-height: 1.6; }
          a { text-decoration: none; color: inherit; }
          button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
          ul { list-style: none; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }

          /* --- NAV --- */
          .nav {
            position: sticky; top: 0; z-index: 100;
            padding: 1rem 2.5rem;
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(10,10,10,.88);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,.06);
          }
          .logo { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; letter-spacing: -.03em; }
          .logo span { color: #b8f03c; }
          .nav-links { display: flex; align-items: center; gap: 2rem; }
          .nav-links a { font-size: .83rem; color: rgba(255,255,255,.4); transition: color .15s; }
          .nav-links a:hover { color: #f2efe8; }
          .btn-nav {
            background: #b8f03c; color: #0a0a0a;
            padding: .45rem 1.2rem; border-radius: 2rem;
            font-size: .8rem; font-weight: 600; border: none;
            transition: opacity .15s;
          }
          .btn-nav:hover { opacity: .85; }

          /* --- HERO --- */
          .hero {
            padding: 5.5rem 2.5rem 4.5rem;
            max-width: 1120px; margin: 0 auto;
            display: grid; grid-template-columns: 1.05fr 1fr; gap: 5rem; align-items: center;
          }
          .hero-badge {
            display: inline-flex; align-items: center; gap: .5rem;
            background: rgba(184,240,60,.09); border: 1px solid rgba(184,240,60,.22);
            color: #b8f03c; padding: .35rem .9rem; border-radius: 2rem;
            font-size: .7rem; font-weight: 500; margin-bottom: 1.75rem;
            animation: fadeUp .5s ease both;
          }
          .hero-badge-dot {
            width: 6px; height: 6px; border-radius: 50%; background: #b8f03c;
            animation: pulse 2s ease-in-out infinite;
          }
          h1 {
            font-family: 'Syne', sans-serif;
            font-size: clamp(3.2rem, 5.5vw, 5.2rem);
            font-weight: 800; line-height: .94; letter-spacing: -.04em;
            margin-bottom: 1.5rem;
            animation: fadeUp .5s .08s ease both;
          }
          h1 em { font-style: normal; color: #b8f03c; }
          .hero-sub {
            font-size: .95rem; color: rgba(255,255,255,.45); line-height: 1.8;
            max-width: 420px; font-weight: 300; margin-bottom: 2rem;
            animation: fadeUp .5s .16s ease both;
          }
          .hero-actions {
            display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;
            animation: fadeUp .5s .22s ease both;
          }
          .btn-primary {
            background: #b8f03c; color: #0a0a0a;
            padding: .85rem 2rem; border-radius: 3rem;
            font-size: .9rem; font-weight: 600; border: none;
            transition: opacity .15s, transform .15s;
          }
          .btn-primary:hover { opacity: .88; transform: translateY(-1px); }
          .btn-ghost { font-size: .85rem; color: rgba(255,255,255,.42); transition: color .15s; }
          .btn-ghost:hover { color: #f2efe8; }

          /* --- STATS STRIP --- */
          .stats-strip {
            border-top: 1px solid rgba(255,255,255,.06);
            border-bottom: 1px solid rgba(255,255,255,.06);
            background: #0f0f0f;
          }
          .stats-inner {
            max-width: 1120px; margin: 0 auto; padding: 3rem 2.5rem;
            display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem;
          }
          .stat-item { padding-left: 1.5rem; border-left: 2px solid rgba(255,255,255,.07); }
          .stat-num { font-family: 'Syne', sans-serif; font-size: clamp(2rem,3.5vw,2.8rem); font-weight: 800; letter-spacing: -.04em; color: #b8f03c; margin-bottom: .4rem; }
          .stat-desc { font-size: .82rem; color: rgba(255,255,255,.4); line-height: 1.55; font-weight: 300; max-width: 200px; }

          /* --- SECTION COMMON --- */
          .section { padding: 5rem 2.5rem; }
          .section-inner { max-width: 1120px; margin: 0 auto; }
          .section-label {
            font-size: .68rem; letter-spacing: .15em; text-transform: uppercase;
            color: rgba(255,255,255,.25); margin-bottom: 1rem;
          }
          .section-title {
            font-family: 'Syne', sans-serif;
            font-size: clamp(1.9rem,3vw,2.8rem); font-weight: 800;
            letter-spacing: -.03em; line-height: 1.1; margin-bottom: 1.1rem;
          }
          .section-sub { font-size: .92rem; color: rgba(255,255,255,.42); font-weight: 300; line-height: 1.75; max-width: 520px; }

          /* --- HOW IT WORKS --- */
          .how-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; margin-top: 3.5rem; background: rgba(255,255,255,.06); }
          .how-card { background: #0a0a0a; padding: 2.5rem 2rem; }
          .how-num { font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; letter-spacing: -.05em; color: rgba(255,255,255,.06); margin-bottom: 1.25rem; line-height: 1; }
          .how-card h3 { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; margin-bottom: .6rem; }
          .how-card p { font-size: .85rem; color: rgba(255,255,255,.4); line-height: 1.7; font-weight: 300; }

          /* --- FEATURES GRID --- */
          .feat-section { background: #0f0f0f; padding: 5rem 2.5rem; }
          .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; margin-top: 3.5rem; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.06); }
          .feat-item { background: #0f0f0f; padding: 2rem; transition: background .2s; }
          .feat-item:hover { background: #141414; }
          .feat-icon { width: 36px; height: 36px; border-radius: .5rem; background: rgba(184,240,60,.1); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
          .feat-title { font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 700; margin-bottom: .5rem; }
          .feat-desc { font-size: .82rem; color: rgba(255,255,255,.38); line-height: 1.7; font-weight: 300; }

          /* --- PRICING --- */
          .pricing-section { padding: 5rem 2.5rem; }
          .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-top: 3.5rem; }
          .price-card {
            background: #111; border: 1px solid rgba(255,255,255,.08);
            border-radius: 1rem; padding: 2rem;
          }
          .price-card.featured {
            background: #141e06; border-color: rgba(184,240,60,.3);
            position: relative;
          }
          .feat-badge {
            position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
            background: #b8f03c; color: #0a0a0a; font-size: .65rem; font-weight: 700;
            padding: .2rem .75rem; border-radius: 0 0 .5rem .5rem; letter-spacing: .06em; text-transform: uppercase;
          }
          .price-tier { font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: .85rem; }
          .price-main { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -.04em; margin-bottom: .2rem; }
          .price-period { font-size: .72rem; color: rgba(255,255,255,.3); margin-bottom: .3rem; }
          .price-saas { font-size: .82rem; color: rgba(255,255,255,.5); margin-bottom: .4rem; }
          .price-detail { font-size: .75rem; color: rgba(255,255,255,.28); margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,.06); }
          .price-list { display: flex; flex-direction: column; gap: .55rem; margin-bottom: 1.75rem; }
          .price-list li { font-size: .82rem; color: rgba(255,255,255,.42); display: flex; gap: .5rem; }
          .price-list li::before { content: '✓'; color: #b8f03c; flex-shrink: 0; }
          .price-btn {
            width: 100%; padding: .75rem; border-radius: .65rem;
            font-size: .85rem; font-weight: 600; border: 1px solid rgba(255,255,255,.1);
            background: transparent; color: rgba(255,255,255,.55);
            transition: background .15s, border-color .15s, color .15s;
          }
          .price-btn:hover { background: rgba(255,255,255,.05); color: #f2efe8; }
          .price-btn.primary { background: #b8f03c; color: #0a0a0a; border-color: transparent; }
          .price-btn.primary:hover { opacity: .88; }
          .pricing-footnote { margin-top: 2rem; font-size: .78rem; color: rgba(255,255,255,.25); text-align: center; line-height: 1.6; }

          /* --- CTA --- */
          .cta-section { background: #0d0d0d; border-top: 1px solid rgba(255,255,255,.06); padding: 6rem 2.5rem; text-align: center; }
          .cta-section h2 { font-family: 'Syne', sans-serif; font-size: clamp(1.9rem,3vw,2.8rem); font-weight: 800; letter-spacing: -.03em; margin-bottom: 1rem; line-height: 1.1; }
          .cta-section p { font-size: .92rem; color: rgba(255,255,255,.4); margin-bottom: 2rem; font-weight: 300; max-width: 480px; margin-left: auto; margin-right: auto; }

          /* --- FOOTER --- */
          .footer {
            border-top: 1px solid rgba(255,255,255,.06);
            padding: 2rem 2.5rem;
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
          }
          .footer-links { display: flex; gap: 1.75rem; }
          .footer-links a { font-size: .78rem; color: rgba(255,255,255,.28); transition: color .15s; }
          .footer-links a:hover { color: rgba(255,255,255,.55); }
          .footer-right { font-size: .75rem; color: rgba(255,255,255,.2); }

          /* --- RESPONSIVE --- */
          @media (max-width: 900px) {
            .hero { grid-template-columns: 1fr; gap: 2.5rem; padding: 3.5rem 1.5rem 3rem; }
            .hero-right { display: flex; justify-content: center; }
            .stats-inner { grid-template-columns: 1fr 1fr; }
            .how-grid { grid-template-columns: 1fr; }
            .feat-grid { grid-template-columns: 1fr 1fr; }
            .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
            .nav { padding: .9rem 1.25rem; }
          }
          @media (max-width: 600px) {
            .stats-inner { grid-template-columns: 1fr; }
            .feat-grid { grid-template-columns: 1fr; }
            .footer { flex-direction: column; align-items: flex-start; }
          }
        `}</style>
      </Head>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">Lumaq<span>.</span></div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <button className="btn-nav" onClick={() => router.push('/login')}>Sign in</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="hero">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Now onboarding Lagos &amp; Abuja
            </div>
            <h1>
              Your generator<br />
              is eating your<br />
              <em>profit.</em>
            </h1>
            <p className="hero-sub">
              Every hour NEPA is off, you're paying ₦900 per kilowatt on diesel.
              Lumaq automatically runs your building on solar and battery first —
              and only starts the generator when it has no other choice.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => router.push('/login')}>
                Get early access
              </button>
              <a href="#how" className="btn-ghost">See how it works →</a>
            </div>
          </div>
          <div className="hero-right">
            <LiveCard />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-num">₦16.5T</div>
            <div className="stat-desc">What Nigerian businesses spent on self-generated power in 2023. The entire formal power sector earned ₦1T.</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">17 hrs</div>
            <div className="stat-desc">The average daily gap between grid supply and what your business needs to stay open.</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4× cost</div>
            <div className="stat-desc">What you pay per kWh running on a generator versus the grid. Most businesses have no idea what this totals monthly.</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-inner">
          <div className="section-label">How Lumaq works</div>
          <h2 className="section-title">
            One device. Every power source.<br />All managed automatically.
          </h2>
          <p className="section-sub">
            Lumaq installs between your distribution board and all power sources. It reads voltage, current and solar yield continuously — and makes switching decisions in real time. No app required. No manual operation.
          </p>
          <div className="how-grid">
            {[
              ['01', 'Install once', 'Hardware connects to your DB, solar inverter, battery bank and generator. Our technician handles it in under 3 hours.'],
              ['02', 'It learns your building', 'Within the first week, Lumaq maps your load patterns, your DISCO\'s outage behaviour, and your actual solar yield curves.'],
              ['03', 'It acts — not just alerts', 'Pre-charges battery before forecast outages. Shifts heavy loads to solar peak hours. Starts gen only when battery hits your floor. You watch the savings accumulate.'],
            ].map(([n, t, d]) => (
              <div key={n} className="how-card">
                <div className="how-num">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feat-section">
        <div className="section-inner">
          <div className="section-label">What you get</div>
          <h2 className="section-title">Built for how Nigerian businesses actually run.</h2>
          <div className="feat-grid">
            {[
              ['💡', 'Real cost visibility',    'See energy spend in naira — per day, per source, per circuit. Know exactly what your generator hours are costing you.'],
              ['🔋', 'Battery intelligence',    'Stop destroying your battery with random charge cycles. Lumaq extends battery life by scheduling around your actual usage patterns.'],
              ['🌦', 'Outage forecasting',      'Trained on your DISCO\'s feeder history. Lumaq knows when outages typically land and prepares automatically.'],
              ['⚡', 'Anomaly detection',       'A deep freezer silently consuming double what it should. A circuit left on overnight. Lumaq flags waste before it shows on a bill.'],
              ['☀️', 'Solar optimisation',      'Know your actual panel yield versus expected output. Underperforming strings, soiling, shading — identified and quantified.'],
              ['🏢', 'Multi-site dashboard',    'Running more than one location? All sites from one login. Compare performance, track aggregate spend, get alerts across the portfolio.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="feat-item">
                <div className="feat-icon">{icon}</div>
                <div className="feat-title">{title}</div>
                <div className="feat-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-inner">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Hardware once. Platform monthly.<br />Or pay as you go.</h2>
          <p className="section-sub">
            No lock-in. If the savings don't cover the subscription cost within 60 days, we refund the platform fee in full.
          </p>
          <div className="pricing-grid">
            {/* Starter */}
            <div className="price-card">
              <div className="price-tier">Starter</div>
              <div className="price-main">₦150,000</div>
              <div className="price-period">hardware · one-time</div>
              <div className="price-saas">+ ₦15,000 / month platform</div>
              <div className="price-detail">Single phase · up to 7.5 kW · solar + battery + grid</div>
              <ul className="price-list">
                {['Auto source switching','Battery scheduling','Solar yield monitoring','Monthly cost reports','Mobile app'].map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="price-btn" onClick={() => router.push('/login')}>Apply for access</button>
            </div>

            {/* Pro — featured */}
            <div className="price-card featured">
              <div className="feat-badge">Most popular</div>
              <div className="price-tier">Pro</div>
              <div className="price-main">₦320,000</div>
              <div className="price-period">hardware · one-time</div>
              <div className="price-saas">+ ₦35,000 / month platform</div>
              <div className="price-detail">3-phase · up to 25 kW · all sources including generator</div>
              <ul className="price-list">
                {['Everything in Starter','Generator integration + runtime tracking','Per-circuit load visibility','Outage forecasting (ML)','Anomaly detection + alerts','Multi-site dashboard'].map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="price-btn primary" onClick={() => router.push('/login')}>Apply for access</button>
            </div>

            {/* PAYG */}
            <div className="price-card">
              <div className="price-tier">Pay-as-you-go</div>
              <div className="price-main">₦320,000</div>
              <div className="price-period">hardware · one-time</div>
              <div className="price-saas">₦1,800 / active day · pause anytime</div>
              <div className="price-detail">Pro hardware · no monthly commitment · ideal for seasonal businesses</div>
              <ul className="price-list">
                {['Everything in Pro','Charge only active days','Pause during slow periods'].map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="price-btn" onClick={() => router.push('/login')}>Apply for access</button>
            </div>
          </div>
          <p className="pricing-footnote">
            Professional installation included in Lagos and Abuja. Other cities by arrangement. 12-month hardware warranty.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Your competitors are still<br />running generators.</h2>
        <p>We're onboarding a small number of early sites right now. Apply and we'll reach out within 48 hours.</p>
        <button className="btn-primary" onClick={() => router.push('/login')}>Apply for early access</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="logo">Lumaq<span style={{ color: '#b8f03c' }}>.</span></div>
        <div className="footer-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>Sign in</a>
        </div>
        <div className="footer-right">© 2025 Lumaq Technologies</div>
      </footer>
    </>
  )
}
