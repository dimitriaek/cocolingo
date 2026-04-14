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
