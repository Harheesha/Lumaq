import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/login.module.css'

const DEMO_EMAIL = 'admin@lumaq.ng'
const DEMO_PASS  = 'lumaq2025'

export default function Login() {
  const router = useRouter()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [stage, setStage]   = useState('form') // form | sent | error
  const [err, setErr]       = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!email.includes('@')) { setErr('Enter a valid email address.'); return }
    if (!pass) { setErr('Enter your password.'); return }
    if (email.trim().toLowerCase() === DEMO_EMAIL && pass === DEMO_PASS) {
      setStage('sent')
      setTimeout(() => router.push('/dashboard'), 1200)
    } else {
      setErr('Email or password not recognised. Try admin@lumaq.ng / lumaq2025')
    }
  }

  return (
    <>
      <Head>
        <title>Sign in — Lumaq</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <div className={styles.card}>
          <a href="/" className={styles.logo}>Lumaq<span>.</span></a>

          {stage === 'sent' ? (
            <div className={styles.sentState}>
              <div className={styles.sentIcon}>✓</div>
              <div className={styles.sentTitle}>Signing you in…</div>
              <div className={styles.sentSub}>Taking you to your dashboard.</div>
            </div>
          ) : (
            <>
              <h1 className={styles.title}>Welcome back</h1>
              <p className={styles.sub}>Sign in to your Lumaq dashboard.</p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@lumaq.ng"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
                <label className={styles.label} style={{marginTop:'1rem'}}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                />
                {err && <div className={styles.error}>{err}</div>}
                <button type="submit" className={styles.btn}>
                  {stage === 'form' ? 'Sign in' : 'Signing in…'}
                </button>
              </form>

              <div className={styles.hint}>
                Demo credentials: <code>admin@lumaq.ng</code> / <code>lumaq2025</code>
              </div>

              <a href="/" className={styles.back}>← Back to site</a>
            </>
          )}
        </div>
      </div>
    </>
  )
}
