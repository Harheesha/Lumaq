import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/dashboard.module.css'

const EVENTS = [
  { color: '#5bb827', title: 'Grid supply dropped — switched to solar', time: '06:12 AM', detail: 'Seamless. No load interruption.' },
  { color: '#e8960a', title: 'Battery at 82% — charging paused to protect cycle life', time: '08:44 AM', detail: 'Lumaq recommendation applied automatically.' },
  { color: '#1a5fd4', title: 'AC unit on circuit 7 drawing 40% above baseline', time: '10:21 AM', detail: 'Check refrigerant levels or air filter.' },
  { color: '#e03030', title: 'Outage forecast: IKEDC Feeder 4 likely 5–9 PM today', time: 'Predicted', detail: 'Battery pre-charging to 92% by 4:30 PM.' },
  { color: '#5bb827', title: 'Solar yield above forecast — 22.1 kWh so far', time: '12:00 PM', detail: 'Sky clear, panels at peak output.' },
]

const CIRCUITS = [
  { name: 'AC Unit — Main office', draw: 3.2, status: 'high' },
  { name: 'Refrigerators (3×)', draw: 1.8, status: 'normal' },
  { name: 'Lighting — Ground floor', draw: 0.4, status: 'normal' },
  { name: 'Server rack', draw: 0.9, status: 'normal' },
  { name: 'AC Unit — Store room', draw: 2.1, status: 'normal' },
  { name: 'Security & CCTV', draw: 0.3, status: 'normal' },
  { name: 'Sockets — Common area', draw: 0.6, status: 'normal' },
  { name: 'Water pump', draw: 0.2, status: 'normal' },
]

export default function Dashboard() {
  const router = useRouter()
  const [saved, setSaved]   = useState(12480)
  const [battPct, setBatt]  = useState(72)
  const [solarKw, setSolar] = useState(3.1)
  const [activeTab, setTab] = useState('overview')
  const [now, setNow]       = useState('')

  useEffect(() => {
    const update = () => {
      setSaved(s => s + Math.floor(Math.random() * 4 + 1))
      setSolar(s => Math.max(2.4, Math.min(3.8, +(s + (Math.random() - 0.5) * 0.08).toFixed(1))))
      setBatt(b => Math.min(95, +(b + 0.02).toFixed(1)))
    }
    const t = setInterval(update, 3000)
    const d = new Date()
    setNow(d.toLocaleDateString('en-NG', { weekday:'long', day:'numeric', month:'long', year:'numeric' }))
    return () => clearInterval(t)
  }, [])

  const tabs = ['overview','solar','generator','circuits','reports']

  return (
    <>
      <Head>
        <title>Dashboard — Lumaq</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>

        {/* TOPBAR */}
        <nav className={styles.topbar}>
          <div className={styles.logo}>Lumaq<span>.</span></div>
          <div className={styles.topRight}>
            <div className={styles.sitePill}>Lekki Phase 1</div>
            <div className={styles.avatar}>AC</div>
            <button onClick={() => router.push('/')} className={styles.signout}>Sign out</button>
          </div>
        </nav>

        <div className={styles.layout}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            {tabs.map(t => (
              <button
                key={t}
                className={`${styles.sideTab} ${activeTab === t ? styles.sideTabActive : ''}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <div className={styles.sideDiv} />
            <button className={styles.sideTab} onClick={() => router.push('/')}>← Site</button>
          </aside>

          {/* MAIN */}
          <main className={styles.main}>
            <div className={styles.greeting}>Good morning, Adebayo.</div>
            <div className={styles.date}>{now} · Lekki Phase 1</div>

            {/* SOURCE STATUS */}
            <div className={styles.sourceBar}>
              <div className={styles.sourceItem} data-active="true">
                <span className={styles.srcDot} style={{background:'#5bb827'}} />
                Solar <strong>{solarKw} kW</strong>
              </div>
              <div className={styles.sourceItem} data-active="true">
                <span className={styles.srcDot} style={{background:'#e8960a'}} />
                Battery <strong>{battPct.toFixed(0)}%</strong>
              </div>
              <div className={styles.sourceItem} data-off="true">
                <span className={styles.srcDot} style={{background:'#ccc'}} />
                Grid <strong>offline</strong>
              </div>
              <div className={styles.sourceItem} data-off="true">
                <span className={styles.srcDot} style={{background:'#ccc'}} />
                Generator <strong>off</strong>
              </div>
            </div>

            {/* STAT CARDS */}
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Solar today</div>
                <div className={styles.statVal}>22.1 <span>kWh</span></div>
                <div className={styles.statSub} style={{color:'#5bb827'}}>↑ 18% vs yesterday</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Battery charge</div>
                <div className={styles.statVal}>{battPct.toFixed(0)}<span>%</span></div>
                <div className={styles.statSub}>Est. 7h 20m remaining</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Current load</div>
                <div className={styles.statVal}>9.5 <span>kW</span></div>
                <div className={styles.statSub}>8 circuits active</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Grid supply today</div>
                <div className={styles.statVal}>4 <span>hrs</span></div>
                <div className={styles.statSub}>Last seen 06:12 AM</div>
              </div>
            </div>

            {/* SAVINGS BANNER */}
            <div className={styles.savingsBanner}>
              <div>
                <div className={styles.savingsLabel}>Saved today vs running on generator</div>
                <div className={styles.savingsAmt}>₦{saved.toLocaleString('en-NG')}</div>
                <div className={styles.savingsSub}>Solar since 06:12 AM · ₦900/kWh generator cost avoided</div>
              </div>
              <div className={styles.savingsBadge}>22.1 kWh clean energy</div>
            </div>

            {/* CIRCUIT VIEW (only on circuits tab or overview) */}
            {activeTab === 'circuits' && (
              <div className={styles.circuitBlock}>
                <div className={styles.blockTitle}>Circuit breakdown</div>
                <div className={styles.circuitList}>
                  {CIRCUITS.map((c, i) => (
                    <div key={i} className={styles.circuitRow}>
                      <div className={styles.circuitName}>{c.name}</div>
                      <div className={styles.circuitBar}>
                        <div
                          className={styles.circuitFill}
                          style={{
                            width: `${(c.draw / 3.5) * 100}%`,
                            background: c.status === 'high' ? '#e03030' : '#b6ef3e'
                          }}
                        />
                      </div>
                      <div className={styles.circuitKw} style={{color: c.status === 'high' ? '#e03030' : '#555'}}>
                        {c.draw} kW {c.status === 'high' && '⚠'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className={styles.reportBlock}>
                <div className={styles.blockTitle}>Monthly summary — April 2025</div>
                <div className={styles.reportGrid}>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>₦384,000</div>
                    <div className={styles.reportLbl}>Estimated generator cost avoided</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>412 kWh</div>
                    <div className={styles.reportLbl}>Solar energy used this month</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>3.2 hrs</div>
                    <div className={styles.reportLbl}>Average daily grid supply</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>18 min</div>
                    <div className={styles.reportLbl}>Generator runtime this month</div>
                  </div>
                </div>
              </div>
            )}

            {/* GENERATOR TAB */}
            {activeTab === 'generator' && (
              <div className={styles.reportBlock}>
                <div className={styles.blockTitle}>Generator · April 2025</div>
                <div className={styles.reportGrid}>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal} style={{color:'#5bb827'}}>18 min</div>
                    <div className={styles.reportLbl}>Total runtime this month</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>1.4 L</div>
                    <div className={styles.reportLbl}>Fuel consumed</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>₦2,100</div>
                    <div className={styles.reportLbl}>Generator cost this month</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>Mar 2026</div>
                    <div className={styles.reportLbl}>Next service due</div>
                  </div>
                </div>
                <div className={styles.genNote}>
                  Your generator ran for 18 minutes total in April — only during the morning of the 3rd when battery hit the floor threshold. Lumaq kept it off the remaining 29 days.
                </div>
              </div>
            )}

            {/* SOLAR TAB */}
            {activeTab === 'solar' && (
              <div className={styles.reportBlock}>
                <div className={styles.blockTitle}>Solar · live + monthly</div>
                <div className={styles.reportGrid}>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal} style={{color:'#5bb827'}}>{solarKw} kW</div>
                    <div className={styles.reportLbl}>Current output</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>22.1 kWh</div>
                    <div className={styles.reportLbl}>Yield today</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal}>412 kWh</div>
                    <div className={styles.reportLbl}>This month</div>
                  </div>
                  <div className={styles.reportStat}>
                    <div className={styles.reportVal} style={{color:'#e8960a'}}>94%</div>
                    <div className={styles.reportLbl}>vs forecast efficiency</div>
                  </div>
                </div>
                <div className={styles.genNote}>
                  String 2 underperformed on the 12th and 13th (possible soiling). Estimated loss: ₦4,800. Consider panel cleaning this week.
                </div>
              </div>
            )}

            {/* EVENT FEED */}
            <div className={styles.feedBlock}>
              <div className={styles.blockTitle}>Events today</div>
              {EVENTS.map((ev, i) => (
                <div key={i} className={styles.eventRow}>
                  <span className={styles.evDot} style={{background: ev.color}} />
                  <div>
                    <div className={styles.evTitle}>{ev.title}</div>
                    <div className={styles.evDetail}>{ev.detail}</div>
                    <div className={styles.evTime}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>

          </main>
        </div>
      </div>
    </>
  )
}
