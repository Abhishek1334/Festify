# Festify — Vercel backend migration

Deploying the **Express backend as a Vercel serverless function** alongside the existing Vite frontend. Single Vercel project hosts both. The backend Express app is wrapped in `api/index.js` and exposed at `/api/*`.

## Why Vercel for the backend
- **Same origin as the frontend** — kills cross-origin cookie problems entirely (`sameSite=lax` instead of `none`)
- **Sub-second cold starts** vs Render's 30s and Koyeb's 3-5s
- **Single deploy / single dashboard / single env var store**
- **Free tier covers portfolio traffic forever** (1M invocations/mo on Hobby)

## What's already wired up in this repo

```
api/
├── index.js              ← Vercel function entry; imports backend/app.js
backend/
├── app.js                ← Express app (no listen) — used by both /api and dev server
├── server.js             ← thin dev entry; calls app.listen() locally
├── config/db.js          ← mongoose connection caching for serverless
└── ...routes / controllers / models / middleware
vercel.json               ← rewrites /api/:path* → /api function, SPA fallback for everything else
```

Local dev still works as before: `npm run dev` (frontend) + `cd backend && npm run dev` (Express on :5000).

## Step 1 — Add backend env vars in Vercel

Vercel dashboard → **Festify project → Settings → Environment Variables**.

Add these to **Production, Preview, AND Development**:

| Key | Value | Type |
|---|---|---|
| `MONGO_URI` | (copy from Railway / Atlas) | Sensitive |
| `JWT_SECRET` | (copy from Railway, or a long random string) | Sensitive |
| `CLOUDINARY_CLOUD_NAME` | `dmgyx29ou` | Plaintext |
| `CLOUDINARY_API_KEY` | (copy from Cloudinary dashboard) | Sensitive |
| `CLOUDINARY_API_SECRET` | (copy from Cloudinary dashboard) | Sensitive |
| `NODE_ENV` | `production` | Plaintext |
| `FRONTEND_URLS` | `https://festify-tau.vercel.app` | Plaintext |

Existing frontend vars stay:
| Key | Value |
|---|---|
| `VITE_API_URL` | **Set this to empty string `""`** (same-origin = relative URLs) |
| `VITE_CLOUDINARY_CLOUD_NAME` | `dmgyx29ou` |

> The frontend code does `(import.meta.env.VITE_API_URL || '') + '/api'`. With `VITE_API_URL=""`, it becomes `/api` which is a relative URL on the same Vercel origin. ✓

## Step 2 — Whitelist 0.0.0.0/0 in MongoDB Atlas

Vercel functions don't have static IPs. In Atlas → **Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0)**.

If you'd rather keep it locked down, you can use a single Vercel egress IP via Vercel's [Edge Config / static egress feature](https://vercel.com/docs/security/secure-compute) (paid plan). For free tier, 0.0.0.0/0 is the practical answer.

## Step 3 — Deploy

Push to master (or click **Deployments → Redeploy** in Vercel). Vercel will:
1. Build the Vite frontend (`npm run build`) — produces `dist/`
2. Detect `api/index.js` and bundle it as a serverless function
3. Apply `vercel.json` rewrites

## Step 4 — Verify the API is live

After deploy, test:

```bash
curl https://festify-tau.vercel.app/api/events
```

Should return a JSON array (possibly empty). If you get the SPA HTML response, the rewrite isn't applying — double-check `vercel.json` is in repo root.

## Step 5 — Verify auth flow on prod

1. Open `https://festify-tau.vercel.app`
2. Sign up or log in
3. DevTools → Application → Cookies → `festify-tau.vercel.app`
4. Confirm a cookie named `token` exists with `HttpOnly`, `Secure`, `SameSite=Lax`

If the cookie doesn't appear: the function might be erroring before setting it. Check **Vercel dashboard → Logs → Function Logs**.

## Step 6 — Decommission Railway

Once Vercel-hosted API is green:
1. Railway dashboard → Festify backend → **Delete service**
2. Or pause it for a week as a fallback

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `/api/*` returns SPA HTML instead of JSON | `vercel.json` rewrite not picked up | Make sure `vercel.json` is at repo root and committed |
| 503 "Database unavailable" on first request | Atlas IP whitelist | Add `0.0.0.0/0` in Atlas Network Access |
| 503 then works after retry | Cold-start mongoose connection slowness | Normal — connection caches after first hit |
| Function timeouts | A slow route exceeds 10s default | `vercel.json` already raises `maxDuration` to 30s for `api/index.js` |
| "Mongoose buffering timed out" error | DB connect ran but routes hit before middleware awaited it | Already handled — `app.js` awaits `connectDB()` in middleware before forwarding |
| 4MB body size error on file upload | Vercel Hobby body limit | Frontend uploads images directly to Cloudinary (not through backend) — body should be small |
| CORS error in browser console | `FRONTEND_URLS` typo or missing | Check env var matches your Vercel URL exactly, including `https://`, no trailing slash |

## Local dev — nothing changes
- `npm run dev` — Vite frontend on :5173
- `cd backend && npm run dev` — Express on :5000 (now imports `app.js`, calls `listen()`)
- `.env` files unchanged

## Cost expectations
- Vercel Hobby plan: free, 1M function invocations/mo, 100 GB-hours of compute, 100GB bandwidth.
- Portfolio traffic uses ~0.1% of these limits.
- If portfolio gets viral and limits become a concern: Vercel Pro is $20/mo with 10x limits.
