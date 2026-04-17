import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const DEMO_EMAIL = 'admin@lumaq.ng'
const DEMO_PASS  = 'lumaq2025'

export default function Login() {
  const router = useRouter()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [stage, setStage]   = useState('form') // form | submitting | done
  const [err, setErr]       = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!email.includes('@')) { setErr('Enter a valid email address.'); return }
    if (!pass)                { setErr('Enter your password.'); return }

    if (email.trim().toLowerCase() === DEMO_EMAIL && pass === DEMO_PASS) {
      setStage('submitting')
      setTimeout(() => router.push('/dashboard'), 1000)
    } else {
      setErr('Email or password not recognised.')
    }
  }

  return (
    <>
      <Head>
        <title>Sign in — Lumaq</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; }
          body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #f2efe8; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          a { text-decoration: none; color: inherit; }
          button { cursor: pointer; font-family: 'DM Sans', sans-serif; }

          .page {
            width: 100%; min-height: 100vh;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 2rem 1.25rem;
            background: #0a0a0a;
          }

          /* subtle grid bg */
          .page::before {
            content: '';
            position: fixed; inset: 0; z-index: 0;
            background-image:
              linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
            background-size: 48px 48px;
            pointer-events: none;
          }

          .card {
            position: relative; z-index: 1;
            background: #111; border: 1px solid rgba(255,255,255,.09);
            border-radius: 1.25rem; padding: 2.5rem 2.25rem;
            width: 100%; max-width: 400px;
          }

          .logo {
            font-family: 'Syne', sans-serif;
            font-size: 1.05rem; font-weight: 800; letter-spacing: -.03em;
            display: block; margin-bottom: 2rem;
          }
          .logo span { color: #b8f03c; }

          .card-title { font-family: 'Syne', sans-serif; font-size: 1.45rem; font-weight: 800; letter-spacing: -.03em; margin-bottom: .35rem; }
          .card-sub { font-size: .85rem; color: rgba(255,255,255,.38); margin-bottom: 2rem; font-weight: 300; }

          .form-group { margin-bottom: 1rem; }
          label { display: block; font-size: .75rem; color: rgba(255,255,255,.4); margin-bottom: .4rem; letter-spacing: .03em; }
          input {
            width: 100%; background: #0a0a0a; border: 1px solid rgba(255,255,255,.1);
            border-radius: .6rem; padding: .75rem .95rem;
            font-size: .9rem; color: #f2efe8; font-family: 'DM Sans', sans-serif;
            transition: border-color .15s;
            outline: none;
          }
          input::placeholder { color: rgba(255,255,255,.2); }
          input:focus { border-color: rgba(184,240,60,.4); }

          .error {
            background: rgba(224,48,48,.1); border: 1px solid rgba(224,48,48,.25);
            border-radius: .5rem; padding: .6rem .85rem;
            font-size: .8rem; color: #e8998a; margin-bottom: 1rem;
          }

          .btn-submit {
            width: 100%; padding: .85rem;
            background: #b8f03c; color: #0a0a0a;
            border: none; border-radius: .65rem;
            font-size: .92rem; font-weight: 600;
            transition: opacity .15s;
            margin-top: .5rem;
          }
          .btn-submit:hover { opacity: .88; }
          .btn-submit:disabled { opacity: .5; cursor: not-allowed; }

          .demo-hint {
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
            border-radius: .65rem;
            font-size: .78rem; color: rgba(255,255,255,.3); line-height: 1.6;
          }
          .demo-hint strong { color: rgba(255,255,255,.5); }

          .back-link {
            display: block; margin-top: 1.75rem; text-align: center;
            font-size: .8rem; color: rgba(255,255,255,.28);
            transition: color .15s;
          }
          .back-link:hover { color: rgba(255,255,255,.55); }

          /* success state */
          .success-state { text-align: center; padding: 1rem 0; }
          .success-icon {
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(184,240,60,.12); border: 1px solid rgba(184,240,60,.3);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem; margin: 0 auto 1.25rem;
          }
          .success-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; margin-bottom: .4rem; }
          .success-sub { font-size: .83rem; color: rgba(255,255,255,.38); font-weight: 300; }
        `}</style>
      </Head>

      <div className="page">
        <div className="card">
          <a href="/" className="logo">Lumaq<span>.</span></a>

          {stage === 'submitting' ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <div className="success-title">Signing you in…</div>
              <div className="success-sub">Taking you to your dashboard.</div>
            </div>
          ) : (
            <>
              <h1 className="card-title">Welcome back</h1>
              <p className="card-sub">Sign in to your Lumaq dashboard.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.ng"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                {err && <div className="error">{err}</div>}

                <button type="submit" className="btn-submit">
                  Sign in
                </button>
              </form>

              {/* Only show demo hint — don't leak creds in the error message */}
              <div className="demo-hint">
                <strong>Demo access:</strong> use the credentials provided in your onboarding email. No account yet? <a href="#" style={{ color: '#b8f03c' }}>Apply for early access →</a>
              </div>

              <a href="/" className="back-link">← Back to site</a>
            </>
          )}
        </div>
      </div>
    </>
  )
}
