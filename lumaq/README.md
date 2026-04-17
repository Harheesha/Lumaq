# Lumaq — Smart Energy Gateway

A Next.js web application with landing page, login, and user dashboard.

## Demo credentials
- Email: `admin@lumaq.ng`
- Password: `lumaq2025`

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (recommended)

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts. Done.

### Option B — GitHub + Vercel dashboard

1. Push this folder to a new GitHub repo:
```bash
git init
git add .
git commit -m "init lumaq"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lumaq.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select your repo → click **Deploy**

Vercel auto-detects Next.js. No config needed.

---

## Pages

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/login` | Sign-in page |
| `/dashboard` | User dashboard (after login) |

---

## Customise

- **Credentials**: Edit `DEMO_EMAIL` and `DEMO_PASS` in `pages/login.js`
- **Site name in dashboard**: Edit the `Lekki Phase 1` references in `pages/dashboard.js`
- **Pricing**: All prices are in `pages/index.js` under the pricing section
- **Colors**: Design tokens are in `styles/globals.css`
