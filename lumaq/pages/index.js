import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/landing.module.css'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Lumaq — Smart Energy for Nigerian Businesses</title>
        <meta name="description" content="Stop bleeding money on diesel. Lumaq manages your solar, battery, generator and grid automatically." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>

        {/* NAV */}
        <nav className={styles.nav}>
          <div className={styles.logo}>Lumaq<span>.</span></div>
          <div className={styles.navRight}>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <button onClick={() => router.push('/login')} className={styles.navCta}>Sign in</button>
          </div>
        </nav>

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <div className={styles.heroBadge}>
                <span className={styles.badgeDot} />
                Now onboarding Lagos &amp; Abuja
              </div>
              <h1 className={styles.h1}>
                Your generator<br />
                is eating your<br />
                <em>profit.</em>
              </h1>
              <p className={styles.heroP}>
                Every hour NEPA is off, you're paying ₦900 per kilowatt.
                Lumaq automatically runs your building on solar and battery first —
                and only fires the gen when it absolutely has to.
              </p>
              <div className={styles.heroActions}>
                <button onClick={() => router.push('/login')} className={styles.btnPrimary}>
                  Get early access
                </button>
                <a href="#how" className={styles.btnText}>See how it works →</a>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.liveCard}>
                <div className={styles.livePill}><span className={styles.liveDot} />Live demo</div>
                <div className={styles.liveRow}>
                  <div className={styles.liveStat}>
                    <div className={styles.liveLabel}>Generator status</div>
                    <div className={styles.liveVal} style={{color:'#5bb827'}}>OFF</div>
                  </div>
                  <div className={styles.liveStat}>
                    <div className={styles.liveLabel}>Running on</div>
                    <div className={styles.liveVal}>Solar + Battery</div>
                  </div>
                </div>
                <div className={styles.savedRow}>
                  <div className={styles.savedLabel}>Saved today vs gen</div>
                  <div className={styles.savedAmt}>₦12,480</div>
                </div>
                <div className={styles.miniEvents}>
                  <div className={styles.miniEvent}>
                    <span className={styles.dot} style={{background:'#5bb827'}} />
                    Grid dropped — switched to solar automatically
                  </div>
                  <div className={styles.miniEvent}>
                    <span className={styles.dot} style={{background:'#e8960a'}} />
                    Outage forecast 5–9 PM — battery pre-charging
                  </div>
                  <div className={styles.miniEvent}>
                    <span className={styles.dot} style={{background:'#1a5fd4'}} />
                    AC on circuit 7 running 40% above normal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className={styles.problemSection}>
          <div className={styles.problemGrid}>
            <div className={styles.problemStat}>
              <div className={styles.problemNum}>₦16.5T</div>
              <div className={styles.problemText}>
                What Nigerian businesses spent on self-generated power in 2023 alone. The entire formal power sector earned ₦1T.
              </div>
            </div>
            <div className={styles.problemStat}>
              <div className={styles.problemNum}>17 hrs</div>
              <div className={styles.problemText}>
                The average daily gap between grid supply and what your business actually needs to run.
              </div>
            </div>
            <div className={styles.problemStat}>
              <div className={styles.problemNum}>4× more</div>
              <div className={styles.problemText}>
                What you pay per kWh on a generator versus the grid. Most businesses have no idea what this adds up to monthly.
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.section} id="how">
          <div className={styles.sectionInner}>
            <div className={styles.sectionLabel}>How Lumaq works</div>
            <h2 className={styles.sectionTitle}>
              One device. Every power source.<br />All managed automatically.
            </h2>
            <p className={styles.sectionSub}>
              Lumaq sits between your power sources and your building. It reads every
              source continuously and makes switching decisions in real time — no app
              required, no manual anything.
            </p>

            <div className={styles.howGrid}>
              <div className={styles.howCard}>
                <div className={styles.howNum}>01</div>
                <h3>Install once</h3>
                <p>Hardware connects to your distribution board, solar inverter, battery bank and generator. Our technician handles it in under 3 hours.</p>
              </div>
              <div className={styles.howCard}>
                <div className={styles.howNum}>02</div>
                <h3>It learns your building</h3>
                <p>Within the first week, Lumaq maps your load patterns, your DISCO's outage behaviour, and your solar yield curves.</p>
              </div>
              <div className={styles.howCard}>
                <div className={styles.howNum}>03</div>
                <h3>It acts — not just alerts</h3>
                <p>Pre-charges battery before forecast outages. Shifts heavy loads to solar peak hours. Starts gen only when battery hits your floor. You just watch the savings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className={styles.featSection}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionLabel}>What you get</div>
            <h2 className={styles.sectionTitle}>Built for how Nigerian businesses actually run.</h2>

            <div className={styles.featGrid}>
              <div className={styles.featItem}>
                <div className={styles.featTitle}>Real cost visibility</div>
                <div className={styles.featDesc}>See your energy spend in naira — per day, per source, per circuit. Know exactly what your generator hours are costing you.</div>
              </div>
              <div className={styles.featItem}>
                <div className={styles.featTitle}>Battery intelligence</div>
                <div className={styles.featDesc}>Stop destroying your battery with random charge cycles. Lumaq extends battery life by scheduling around your actual usage patterns.</div>
              </div>
              <div className={styles.featItem}>
                <div className={styles.featTitle}>Outage forecasting</div>
                <div className={styles.featDesc}>Trained on your DISCO's history. Lumaq knows your feeder usually goes dark on weekday evenings and prepares automatically.</div>
              </div>
              <div className={styles.featItem}>
                <div className={styles.featTitle}>Anomaly detection</div>
                <div className={styles.featDesc}>Your deep freezer silently consuming double what it should. A circuit left on overnight. Lumaq flags the waste before you see it on a bill.</div>
              </div>
              <div className={styles.featItem}>
                <div className={styles.featTitle}>Solar optimisation</div>
                <div className={styles.featDesc}>Know your actual panel yield versus what you should be getting. Underperforming strings, soiling, poor orientation — identified and quantified.</div>
              </div>
              <div className={styles.featItem}>
                <div className={styles.featTitle}>Multi-site dashboard</div>
                <div className={styles.featDesc}>Running more than one location? See all sites from one login. Compare performance, track aggregate spend, get alerts across the portfolio.</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className={styles.pricingSection} id="pricing">
          <div className={styles.sectionInner}>
            <div className={styles.sectionLabel}>Pricing</div>
            <h2 className={styles.sectionTitle}>Hardware once. Platform monthly.<br />Or pay as you go.</h2>
            <p className={styles.sectionSub}>
              No lock-in. If the savings don't cover the subscription cost within 60 days, we refund it.
            </p>

            <div className={styles.pricingGrid}>
              <div className={styles.priceCard}>
                <div className={styles.priceTier}>Starter</div>
                <div className={styles.priceHardware}>
                  <span className={styles.priceAmt}>₦150,000</span>
                  <span className={styles.pricePer}>hardware · one-time</span>
                </div>
                <div className={styles.priceSaas}>+ ₦15,000 / month platform</div>
                <div className={styles.priceDetail}>Single phase · up to 7.5kW · solar + battery + grid</div>
                <ul className={styles.priceList}>
                  <li>Auto source switching</li>
                  <li>Battery scheduling</li>
                  <li>Solar yield monitoring</li>
                  <li>Cost reports (monthly)</li>
                  <li>Mobile app</li>
                </ul>
                <button onClick={() => router.push('/login')} className={styles.priceBtn}>Apply for access</button>
              </div>

              <div className={`${styles.priceCard} ${styles.priceCardFeat}`}>
                <div className={styles.featBadge}>Most popular</div>
                <div className={styles.priceTier}>Pro</div>
                <div className={styles.priceHardware}>
                  <span className={styles.priceAmt}>₦320,000</span>
                  <span className={styles.pricePer}>hardware · one-time</span>
                </div>
                <div className={styles.priceSaas}>+ ₦35,000 / month platform</div>
                <div className={styles.priceDetail}>3-phase · up to 25kW · all sources including generator</div>
                <ul className={styles.priceList}>
                  <li>Everything in Starter</li>
                  <li>Generator integration + runtime tracking</li>
                  <li>Per-circuit load visibility</li>
                  <li>Outage forecasting (ML)</li>
                  <li>Anomaly detection + alerts</li>
                  <li>Multi-site dashboard</li>
                </ul>
                <button onClick={() => router.push('/login')} className={styles.priceBtnFeat}>Apply for access</button>
              </div>

              <div className={styles.priceCard}>
                <div className={styles.priceTier}>Pay-as-you-go</div>
                <div className={styles.priceHardware}>
                  <span className={styles.priceAmt}>₦320,000</span>
                  <span className={styles.pricePer}>hardware · one-time</span>
                </div>
                <div className={styles.priceSaas}>₦1,800 / day · only days you use it</div>
                <div className={styles.priceDetail}>Pro hardware · pause anytime · no monthly commitment</div>
                <ul className={styles.priceList}>
                  <li>Everything in Pro</li>
                  <li>Charge only active days</li>
                  <li>Pause during slow periods</li>
                  <li>Ideal for seasonal businesses</li>
                </ul>
                <button onClick={() => router.push('/login')} className={styles.priceBtn}>Apply for access</button>
              </div>
            </div>

            <div className={styles.pricingNote}>
              All hardware includes professional installation within Lagos and Abuja. 
              Other cities by arrangement. 12-month hardware warranty.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>
              Your competitors are still running generators.<br />You don't have to.
            </h2>
            <p className={styles.ctaP}>
              We're onboarding a small number of early sites right now.
              Apply and we'll reach out within 48 hours.
            </p>
            <button onClick={() => router.push('/login')} className={styles.btnPrimary}>
              Apply for early access
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerLogo}>Lumaq<span>.</span></div>
          <div className={styles.footerLinks}>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a onClick={() => router.push('/login')} style={{cursor:'pointer'}}>Sign in</a>
          </div>
          <div className={styles.footerRight}>
            <span>SDG 7 · SDG 9 · SDG 13</span>
            <span>© 2025 Lumaq Technologies</span>
          </div>
        </footer>
      </div>
    </>
  )
}
