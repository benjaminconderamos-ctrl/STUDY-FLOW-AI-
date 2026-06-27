-- Eliminar la política de UPDATE permisiva en ai_usage_events.
-- Las actualizaciones de estado se hacen desde el servidor con la service role key
-- via la función updateAiEvent() en src/lib/ai/usage.ts.
do $$
begin
  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_usage_events'
      and policyname = 'Usuarios actualizan sus propios eventos de uso'
  ) then
    drop policy "Usuarios actualizan sus propios eventos de uso" on public.ai_usage_events;
  end if;
end $$;

-- Restringir permisos de try_consume_ai_quota: solo usuarios autenticados pueden ejecutarla.
do $$
begin
  if to_regprocedure('public.try_consume_ai_quota(uuid,uuid,text,integer)') is not null then
    revoke all on function public.try_consume_ai_quota(uuid, uuid, text, int) from public;
    revoke all on function public.try_consume_ai_quota(uuid, uuid, text, int) from anon;
    grant execute on function public.try_consume_ai_quota(uuid, uuid, text, int) to authenticated;
  end if;
end $$;
