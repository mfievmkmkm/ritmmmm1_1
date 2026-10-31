-- Схема Ритма. Уже установлена в проекте vivxrtkzmkpvtbbkcfna.
-- ДЛЯ НОВЫХ ПРОЕКТОВ: примените миграцию в SQL Editor.
create table if not exists public.ritm_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  document jsonb not null,
  revision bigint not null default 1 check (revision >= 1),
  updated_at timestamptz not null default now(),
  constraint ritm_document_shape check (
    jsonb_typeof(document)='object'
    and (document->>'version')='2'
    and jsonb_typeof(document->'tasks')='array'
    and octet_length(document::text)<=2000000
  )
);
alter table public.ritm_data enable row level security;
revoke all on table public.ritm_data from anon, authenticated;
grant select on table public.ritm_data to authenticated;
drop policy if exists "Read own Ritm data" on public.ritm_data;
create policy "Read own Ritm data" on public.ritm_data
  for select to authenticated using ((select auth.uid()) = user_id);
create or replace function public.ritm_save_state(p_expected_revision bigint,p_document jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_user uuid; v_revision bigint;
begin
 v_user:=(select auth.uid());
 if v_user is null then raise exception 'Sign in required' using errcode='28000';end if;
 if p_expected_revision is null or p_expected_revision<0 then raise exception 'Invalid revision' using errcode='22023';end if;
 if p_document is null or jsonb_typeof(p_document)<>'object'
    or p_document->>'version'<>'2'
    or jsonb_typeof(p_document->'tasks')<>'array'
    or octet_length(p_document::text)>2000000 then
    raise exception 'Invalid or oversized document' using errcode='22023';
 end if;
 select revision into v_revision from public.ritm_data where user_id=v_user for update;
 if not found then
   if p_expected_revision<>0 then return jsonb_build_object('ok',false,'reason','conflict');end if;
   begin
     insert into public.ritm_data(user_id,document,revision) values(v_user,p_document,1);
     return jsonb_build_object('ok',true,'revision',1);
   exception when unique_violation then return jsonb_build_object('ok',false,'reason','conflict');
   end;
 end if;
 if v_revision<>p_expected_revision then
   return jsonb_build_object('ok',false,'reason','conflict','revision',v_revision);
 end if;
 update public.ritm_data set document=p_document,revision=v_revision+1,updated_at=now() where user_id=v_user;
 return jsonb_build_object('ok',true,'revision',v_revision+1);
end;
$$;
revoke all on function public.ritm_save_state(bigint,jsonb) from public,anon;
grant execute on function public.ritm_save_state(bigint,jsonb) to authenticated;
