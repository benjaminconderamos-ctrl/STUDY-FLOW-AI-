-- Eliminar la política de UPDATE permisiva en ai_usage_events.
-- Las actualizaciones de estado se hacen desde el servidor con la service role key
-- via updateAiEvent() en src/lib/ai/usage.ts (usa createAdminClient).
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
