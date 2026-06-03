# DayStack

Dump your brain. Get your day.

## Stack

- Next.js 14 (App Router)
- Supabase (Google OAuth + Postgres)
- Gemini API (Google AI)
- Tailwind CSS
- Deploy on Vercel

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL Editor.
3. Enable **Google** under Authentication → Providers.
4. Add redirect URL: `http://localhost:3000/auth/callback` (and your production URL).
5. Copy **Project URL** and **anon key** into `.env.local`.

### 2. Gemini (Google AI)

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create an API key.
2. Add it as `GEMINI_API_KEY` in `.env.local`.

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add the same environment variables.
4. Add `https://your-domain.vercel.app/auth/callback` to Supabase redirect URLs.

## Routes

| Route    | Description        |
| -------- | ------------------ |
| `/login` | Google OAuth       |
| `/dump`  | Morning brain dump |
| `/plan`  | AI-generated day   |
| `/review`| End of day review  |

Protected routes redirect to `/login` when unauthenticated.
