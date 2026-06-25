alter table public.study_sessions
  add column if not exists study_topic text;

alter table public.study_sessions
  drop constraint if exists study_sessions_study_topic_length;

alter table public.study_sessions
  add constraint study_sessions_study_topic_length
  check (
    study_topic is null
    or char_length(btrim(study_topic)) between 1 and 2000
  );
