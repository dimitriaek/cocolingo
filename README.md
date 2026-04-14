# CocoLingo

CocoLingo is a tiny two-person language quiz app for Dimitri and Priscila. Dimitri creates Greek quizzes, Priscila creates French quizzes, and both of them can answer each other's prompts, grade submissions out of 10, and keep a lightweight shared history of scores.

## Stack

- React + Vite frontend
- Netlify Functions backend API
- Supabase database
- Plain CSS for styling

## Project structure

```text
src/
  components/
  lib/
  pages/
netlify/
  functions/
supabase/
  schema.sql
```

## Install dependencies

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env` and fill in your Supabase project values:

```bash
cp .env.example .env
```

Required variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The frontend only talks to Netlify Functions. The Supabase service role key stays on the server side and is never exposed in the browser.

## Run locally

Use Netlify local dev so the React frontend and Netlify Functions run together:

```bash
npm run dev
```

That starts:

- the Vite frontend
- the local Netlify Functions runtime
- a single local URL that proxies both

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run the schema below, or paste in `supabase/schema.sql`.

### Supabase SQL schema

```sql
create table if not exists public.quizzes (
  id bigint generated always as identity primary key,
  created_by text not null check (created_by in ('dimitri', 'priscila')),
  assigned_to text not null check (assigned_to in ('dimitri', 'priscila')),
  language text not null check (language in ('greek', 'french')),
  phrase text not null,
  general_hint text not null,
  pronunciation_hint text,
  grammar_note text,
  status text not null default 'open' check (status in ('open', 'submitted', 'graded')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  quiz_id bigint not null unique references public.quizzes(id) on delete cascade,
  submitted_by text not null check (submitted_by in ('dimitri', 'priscila')),
  answer_text text not null,
  score integer check (score >= 0 and score <= 10),
  grading_note text,
  submitted_at timestamptz not null default timezone('utc', now()),
  graded_at timestamptz
);

create index if not exists quizzes_status_idx on public.quizzes(status);
create index if not exists quizzes_assigned_to_idx on public.quizzes(assigned_to);
create index if not exists quizzes_created_by_idx on public.quizzes(created_by);
create index if not exists submissions_submitted_by_idx on public.submissions(submitted_by);
create index if not exists submissions_submitted_at_idx on public.submissions(submitted_at desc);
```

## API routes

The frontend calls these Netlify Functions:

- `/.netlify/functions/get-dashboard`
- `/.netlify/functions/create-quiz`
- `/.netlify/functions/submit-answer`
- `/.netlify/functions/grade-submission`

## Deploy to Netlify

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Create a new site in Netlify from that repo.
3. Netlify should detect:
   - build command: `npm run build`
   - publish directory: `dist`
4. Add these environment variables in Netlify:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy the site.

The included `netlify.toml` already configures the build, functions folder, local dev, and SPA redirect for React Router.

## Notes

- There is no authentication in this V1.
- Everyone uses the same home URL.
- Person separation is only for organizing tasks.
- Greek tasks use soft blue accents.
- French tasks use soft blue, white, and red accents without leaning into flag-heavy visuals.
