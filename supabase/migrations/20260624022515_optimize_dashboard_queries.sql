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
