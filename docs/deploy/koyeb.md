# Festify — Koyeb migration guide

Migrating the **backend** off Railway to Koyeb. Frontend stays on Vercel — only the API host changes.

## Why Koyeb
- Real free tier (no credit card)
- Sub-5s wake from sleep (vs Render's ~30s)
- Native Node.js auto-detect, GitHub auto-deploy

## What you'll change
- Backend deploys to Koyeb instead of Railway
- Vercel frontend gets a new `VITE_API_URL` pointing at the Koyeb URL
- Backend gets a new `FRONTEND_URLS` env var so CORS allows the Vercel domain

This repo already has the deploy artifacts ready: `backend/Dockerfile`, `backend/.dockerignore`, configurable CORS via `FRONTEND_URLS`.

---

## Step 1 — Sign up + connect GitHub

1. Go to https://app.koyeb.com → Sign up (GitHub login is fastest).
2. Once in, **Apps → Create App → GitHub → select `AbhishekRajoria/Festify`**.

## Step 2 — Configure the service

In the Koyeb deploy form:

| Field | Value |
|---|---|
| **Service type** | Web service |
| **Branch** | `master` |
| **Builder** | Dockerfile |
| **Dockerfile location** | `backend/Dockerfile` |
| **Work directory** | `backend` |
| **Instance type** | Free (Nano: 0.1 vCPU, 256 MB RAM) |
| **Region** | Pick closest (Frankfurt for India is decent; Singapore not on free tier last I checked) |
| **Port** | `5000` |
| **Health check path** | `/api/auth/protected` (returns 401 — that's still a "service is up" signal) — or leave default TCP check |
| **Service name** | `festify-api` (this becomes part of your URL) |

## Step 3 — Set environment variables

Under **Environment Variables → Add variable**, paste these (one per line in the bulk import if available):

```
NODE_ENV=production
PORT=5000
MONGO_URI=<copy from your existing Railway service>
JWT_SECRET=<copy from Railway>
CLOUDINARY_CLOUD_NAME=dmgyx29ou
CLOUDINARY_API_KEY=<copy from Railway>
CLOUDINARY_API_SECRET=<copy from Railway>
FRONTEND_URLS=https://festify-tau.vercel.app
```

**Mark every secret as a "secret" type** (not plain text) so Koyeb encrypts them. Mongo URI, JWT secret, and Cloudinary keys all should be secrets.

> Where to copy from: Railway dashboard → Festify backend → Variables tab → Show values → copy each.

## Step 4 — Deploy

Click **Deploy**. First build takes ~3-5 minutes (Docker build, dep install). Watch the build log.

When green, Koyeb gives you a URL like `https://festify-api-<random>.koyeb.app`. **Copy it.**

## Step 5 — Test the deployed API

```bash
curl https://festify-api-<random>.koyeb.app/api/events
```

Should return a JSON array (possibly empty). If you see CORS errors or 500s, check Koyeb's runtime logs.

## Step 6 — Update Vercel frontend

In **Vercel dashboard → Festify project → Settings → Environment Variables**:

1. Edit `VITE_API_URL` for **all environments** (Production, Preview, Development) → change to your new Koyeb URL (no trailing slash):
   ```
   VITE_API_URL=https://festify-api-<random>.koyeb.app
   ```
2. While you're there, add `VITE_CLOUDINARY_CLOUD_NAME=dmgyx29ou` if you haven't already (the redesign needs it).

## Step 7 — Trigger a Vercel redeploy

Vercel doesn't auto-rebuild on env-var change. Either:
- **Vercel dashboard → Deployments → ⋯ on latest → Redeploy → uncheck "Use existing build cache" → Redeploy**
- Or push any commit to master.

## Step 8 — Verify end-to-end on the live site

1. Open `https://festify-tau.vercel.app`.
2. Open DevTools → Network → reload. Confirm `xhr` calls go to the Koyeb URL.
3. Try logging in. Confirm the `token` cookie appears under Application → Cookies → festify-tau.vercel.app, with `SameSite=None`, `Secure`, `HttpOnly`.

If cookie isn't setting cross-origin: check that Koyeb is serving over HTTPS (it is by default), and that `FRONTEND_URLS` matches your Vercel URL exactly (including `https://`, no trailing slash).

## Step 9 — Decommission Railway

Once Koyeb is green and the live site works:
1. Railway dashboard → Festify backend service → Settings → **Delete service**.
2. Or downgrade to a stopped state if you want to keep it as a fallback for a week.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `CORS blocked: <origin>` in Koyeb logs | `FRONTEND_URLS` env var not set or has typo | Re-check env, redeploy |
| Cookie not setting on login | Cross-origin SameSite issue | Confirm Koyeb HTTPS, confirm `secure: true` is being set (`NODE_ENV=production` must be set on Koyeb) |
| 502 Bad Gateway after deploy | App not listening on `process.env.PORT` | Confirm `PORT=5000` env var is set, server.js reads it (it does) |
| Cold start feels slow | Free tier sleeps after 30 min idle | Expected. Wake = 3-5s. Upgrade to a $5/mo paid instance if you need always-on |
| MongoDB connection fails | Atlas IP whitelist | Atlas → Network Access → Add IP `0.0.0.0/0` (allow all). Koyeb IPs aren't predictable on free tier |
| Build fails: `Cannot find module 'cookie-parser'` | Stale Docker cache | Force rebuild without cache: Koyeb → Service → Redeploy → check "Skip cache" |

## Cost expectations

- 1 nano service (the backend): **free forever** as long as usage stays under the cap (100 GB egress/month, plenty for portfolio traffic).
- If portfolio gets viral and bandwidth spikes: you'll get an alert before being charged. Worst case, upgrade to a $5.40/mo `eco` instance.
