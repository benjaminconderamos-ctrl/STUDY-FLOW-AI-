-- StudyFlow AI — Schema SQL (estado real aplicado al proyecto amcdydvakndopfwlhmge)
-- Migraciones aplicadas: initial_schema, create_profile_on_signup,
--   add_session_status_summary, enable_rls_policies

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'max')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuarios ven su propio perfil"
  on public.profiles for select using (auth.uid() = id);
create policy "Usuarios insertan su propio perfil"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and plan = (select plan from public.profiles where id = auth.uid())
  );

-- ─── Documents ────────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  storage_path text,
  size_bytes integer,
  type text not null default 'pdf' check (type in ('pdf', 'url', 'youtube')),
  content_text text,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Usuarios ven sus propios documentos"
  on public.documents for select using (auth.uid() = user_id);
create policy "Usuarios crean sus propios documentos"
  on public.documents for insert with check (auth.uid() = user_id);
create policy "Usuarios eliminan sus propios documentos"
  on public.documents for delete using (auth.uid() = user_id);

-- ─── Subjects ─────────────────────────────────────────────────────────────────
create table if not exists public.subjects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamptz not null default now(),
  constraint subjects_name_length check (char_length(name) >= 1 and char_length(name) <= 100)
);

alter table public.subjects enable row level security;

create policy "Usuarios ven sus propias materias"
  on public.subjects for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuarios crean sus propias materias"
  on public.subjects for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuarios eliminan sus propias materias"
  on public.subjects for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─── Study Sessions ───────────────────────────────────────────────────────────
create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null constraint study_sessions_title_length check (char_length(title) >= 1 and char_length(title) <= 300),
  study_topic text constraint study_sessions_study_topic_length
    check (
      study_topic is null
      or char_length(btrim(study_topic)) between 1 and 2000
    ),
  subject text,
  source text not null default 'topic' check (source in ('topic', 'pdf', 'url', 'youtube')),
  level text not null default 'intermediate' check (level in ('basic', 'intermediate', 'advanced')),
  goal text not null default 'understand' check (goal in ('understand', 'exam', 'memorize', 'review')),
  tools text[] not null default '{}',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null default 'draft' check (status in ('draft', 'generated', 'in_progress', 'completed')),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.study_sessions enable row level security;

create policy "Usuarios ven sus propias sesiones"
  on public.study_sessions for select using (auth.uid() = user_id);
create policy "Usuarios crean sus propias sesiones"
  on public.study_sessions for insert with check (auth.uid() = user_id);
create policy "Usuarios actualizan sus propias sesiones"
  on public.study_sessions for update using (auth.uid() = user_id);
create policy "Usuarios eliminan sus propias sesiones"
  on public.study_sessions for delete using (auth.uid() = user_id);

-- ─── Flashcards ───────────────────────────────────────────────────────────────
create table if not exists public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.study_sessions(id) on delete cascade not null,
  question text not null,
  answer text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.flashcards enable row level security;

create policy "Usuarios ven flashcards de sus sesiones"
  on public.flashcards for select using (
    exists (select 1 from public.study_sessions where id = flashcards.session_id and user_id = auth.uid())
  );

create policy "Usuarios insertan flashcards en sus sesiones"
  on public.flashcards for insert
  with check (
    exists (select 1 from public.study_sessions where id = session_id and user_id = auth.uid())
  );

create policy "Usuarios eliminan flashcards de sus sesiones"
  on public.flashcards for delete
  using (
    exists (select 1 from public.study_sessions where id = session_id and user_id = auth.uid())
  );

-- ─── Quiz Questions ───────────────────────────────────────────────────────────
create table if not exists public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.study_sessions(id) on delete cascade not null,
  question text not null,
  options text[] not null,
  correct_index integer not null,
  explanation text,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;

create policy "Usuarios ven preguntas de sus sesiones"
  on public.quiz_questions for select using (
    exists (select 1 from public.study_sessions where id = quiz_questions.session_id and user_id = auth.uid())
  );

create policy "Usuarios insertan preguntas en sus sesiones"
  on public.quiz_questions for insert
  with check (
    exists (select 1 from public.study_sessions where id = session_id and user_id = auth.uid())
  );

create policy "Usuarios eliminan preguntas de sus sesiones"
  on public.quiz_questions for delete
  using (
    exists (select 1 from public.study_sessions where id = session_id and user_id = auth.uid())
  );

-- ─── Study Activity ───────────────────────────────────────────────────────────
create table if not exists public.study_activity (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  session_id uuid references public.study_sessions(id) on delete set null,
  type text not null check (type in ('summary', 'quiz', 'flashcards', 'tutor')),
  minutes_spent integer not null default 0,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.study_activity enable row level security;

create policy "Usuarios ven su propia actividad"
  on public.study_activity for select using (auth.uid() = user_id);
create policy "Usuarios crean su propia actividad"
  on public.study_activity for insert with check (auth.uid() = user_id);

-- ─── AI Usage Events ──────────────────────────────────────────────────────────
create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete set null,
  action text not null,
  status text not null default 'success'
    check (status in ('success', 'failed', 'blocked_limit', 'blocked_validation', 'pending')),
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  total_tokens integer default 0,
  model text,
  error_message text,
  created_at timestamp with time zone not null default now()
);

alter table public.ai_usage_events enable row level security;

create policy "Usuarios ven sus propios eventos de uso"
  on public.ai_usage_events for select using (auth.uid() = user_id);
create policy "Usuarios insertan sus propios eventos de uso"
  on public.ai_usage_events for insert with check (auth.uid() = user_id);

create index if not exists ai_usage_events_user_action_created_idx
  on public.ai_usage_events (user_id, action, created_at desc);

-- ─── Triggers ─────────────────────────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists study_sessions_updated_at on public.study_sessions;
create trigger study_sessions_updated_at
  before update on public.study_sessions
  for each row execute procedure public.update_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- ─── Auto-create profile on signup ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Tutor Messages ──────────────────────────────────────────────────────────
create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.tutor_messages enable row level security;

create policy "Usuarios ven sus mensajes de tutor"
  on public.tutor_messages for select using (auth.uid() = user_id);
create policy "Usuarios insertan sus mensajes de tutor"
  on public.tutor_messages for insert with check (auth.uid() = user_id);
create policy "Usuarios eliminan sus mensajes de tutor"
  on public.tutor_messages for delete using (auth.uid() = user_id);

create index if not exists tutor_messages_session_created_idx
  on public.tutor_messages (session_id, created_at asc);

-- ─── Math Solver Requests ─────────────────────────────────────────────────────
create table if not exists public.math_solver_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem text not null,
  category text not null default 'auto'
    check (category in ('auto','algebra','calculus','statistics','functions','geometry')),
  level text not null default 'basic'
    check (level in ('basic','intermediate','advanced')),
  final_answer text,
  solution jsonb,
  graph_data jsonb,
  status text not null default 'completed'
    check (status in ('completed','failed','blocked_limit','blocked_validation')),
  model text,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  total_tokens integer default 0,
  error_message text,
  created_at timestamptz not null default now()
);

alter table public.math_solver_requests enable row level security;

create policy "Usuarios ven sus propios problemas"
  on public.math_solver_requests for select using (auth.uid() = user_id);
create policy "Usuarios insertan sus propios problemas"
  on public.math_solver_requests for insert with check (auth.uid() = user_id);
create policy "Usuarios eliminan sus propios problemas"
  on public.math_solver_requests for delete using (auth.uid() = user_id);

create index if not exists math_solver_requests_user_created_idx
  on public.math_solver_requests (user_id, created_at desc);

-- ─── Legal Acceptances ────────────────────────────────────────────────────────
create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

alter table public.legal_acceptances enable row level security;

create policy "Usuarios ven sus propias aceptaciones"
  on public.legal_acceptances for select using (auth.uid() = user_id);
create policy "Usuarios insertan sus propias aceptaciones"
  on public.legal_acceptances for insert with check (auth.uid() = user_id);

create index if not exists legal_acceptances_user_idx
  on public.legal_acceptances (user_id, accepted_at desc);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
-- Poblada por el webhook de Stripe (server-side con service role, no desde cliente).
-- TODO: Implementar src/app/api/stripe/webhook/route.ts para actualizar este tabla.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'max')),
  status text not null default 'inactive'
    check (status in ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Usuarios ven su propia suscripción"
  on public.subscriptions for select using (auth.uid() = user_id);

create index if not exists subscriptions_user_idx
  on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions (stripe_customer_id);

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.update_updated_at();

-- ─── Índices adicionales ─────────────────────────────────────────────────────
create index if not exists idx_study_sessions_user_id on public.study_sessions(user_id);
create index if not exists idx_documents_user_id on public.documents(user_id);
create index if not exists idx_flashcards_session_id on public.flashcards(session_id);
create index if not exists idx_quiz_questions_session_id on public.quiz_questions(session_id);

create index if not exists study_sessions_user_created_idx
  on public.study_sessions (user_id, created_at desc);
create index if not exists study_sessions_user_subject_created_idx
  on public.study_sessions (user_id, subject_id, created_at desc);
create index if not exists documents_user_type_created_idx
  on public.documents (user_id, type, created_at desc);
create index if not exists subjects_user_created_idx
  on public.subjects (user_id, created_at asc);
create index if not exists study_activity_user_created_idx
  on public.study_activity (user_id, created_at desc);
create index if not exists study_activity_user_date_idx
  on public.study_activity (user_id, date desc);
create index if not exists flashcards_session_order_idx
  on public.flashcards (session_id, "order" asc);
create index if not exists quiz_questions_session_order_idx
  on public.quiz_questions (session_id, "order" asc);

-- ─── Progress summary ────────────────────────────────────────────────────────
-- SECURITY INVOKER preserves the caller's RLS restrictions.
create or replace function public.get_study_progress()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with user_activity as (
    select
      activity.id,
      activity.type,
      activity.minutes_spent,
      activity.date,
      activity.created_at,
      activity.session_id,
      session.title as session_title
    from public.study_activity as activity
    left join public.study_sessions as session
      on session.id = activity.session_id
    where activity.user_id = (select auth.uid())
  ),
  totals as (
    select
      coalesce(sum(minutes_spent), 0)::int as total_minutes,
      coalesce(sum(minutes_spent) filter (where date = current_date), 0)::int
        as today_minutes,
      coalesce(
        sum(minutes_spent) filter (where date >= current_date - 7),
        0
      )::int as week_minutes
    from user_activity
  ),
  streak as (
    select coalesce(
      (
        select min(day_offset)::int
        from generate_series(0, 3650) as days(day_offset)
        where not exists (
          select 1
          from user_activity
          where date = current_date - days.day_offset::int
        )
      ),
      3651
    ) as days
  ),
  recent as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', activity.id,
          'type', activity.type,
          'minutes_spent', activity.minutes_spent,
          'date', activity.date,
          'created_at', activity.created_at,
          'session_id', activity.session_id,
          'study_sessions',
            case
              when activity.session_title is null then null
              else jsonb_build_object('title', activity.session_title)
            end
        )
        order by activity.created_at desc
      ),
      '[]'::jsonb
    ) as activities
    from (
      select *
      from user_activity
      order by created_at desc
      limit 10
    ) as activity
  )
  select jsonb_build_object(
    'totalMinutes', totals.total_minutes,
    'todayMinutes', totals.today_minutes,
    'weekMinutes', totals.week_minutes,
    'streak', streak.days,
    'recentActivities', recent.activities
  )
  from totals
  cross join streak
  cross join recent;
$$;

revoke all on function public.get_study_progress() from public;
revoke all on function public.get_study_progress() from anon;
grant execute on function public.get_study_progress() to authenticated;

-- ─── Atomic AI Quota ──────────────────────────────────────────────────────────
-- Usa pg_advisory_xact_lock para evitar race conditions en requests paralelas.
-- Cuenta eventos 'success' y 'pending' del día para cerrar la brecha de tiempo
-- entre que se inserta el pending y se actualiza a success.
-- Valida que auth.uid() = p_user_id para evitar consumo cruzado de cuotas.
create or replace function public.try_consume_ai_quota(
  p_user_id    uuid,
  p_session_id uuid,
  p_action     text,
  p_limit      int
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_lock  bigint;
  v_id    uuid;
begin
  -- Seguridad: solo el usuario autenticado puede consumir su propia cuota
  if auth.uid() is null or auth.uid() != p_user_id then
    raise exception 'unauthorized';
  end if;

  -- Limit sanity check
  if p_limit <= 0 then
    return jsonb_build_object('allowed', false, 'used', 0, 'limit', p_limit);
  end if;

  v_lock := hashtext(p_user_id::text || p_action || current_date::text);
  perform pg_advisory_xact_lock(v_lock);

  -- Contar éxitos Y pendientes del día (evita bypass por requests en vuelo)
  select count(*) into v_count
  from ai_usage_events
  where user_id   = p_user_id
    and action    = p_action
    and status    in ('success', 'pending')
    and created_at >= date_trunc('day', now())
    and created_at <  date_trunc('day', now()) + interval '1 day';

  if v_count >= p_limit then
    return jsonb_build_object('allowed', false, 'used', v_count, 'limit', p_limit);
  end if;

  insert into ai_usage_events (user_id, session_id, action, status)
  values (p_user_id, p_session_id, p_action, 'pending')
  returning id into v_id;

  return jsonb_build_object('allowed', true, 'used', v_count, 'limit', p_limit, 'event_id', v_id::text);
end;
$$;
