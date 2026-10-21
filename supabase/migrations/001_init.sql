-- Bodhi Path MVP schema + RLS + seeds

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  goal text check (goal in ('meditation', 'exam', 'both')),
  onboarding_complete boolean not null default false,
  merit_points integer not null default 0,
  streak_current integer not null default 0,
  streak_longest integer not null default 0,
  last_practice_date date,
  tree_stage integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Modules & lessons
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_mm text not null,
  title_en text not null,
  track text not null check (track in ('vipassana', 'abhidhamma', 'pali')),
  order_index integer not null default 0,
  unlock_merit integer not null default 0,
  description_mm text,
  description_en text
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  slug text not null,
  title_mm text not null,
  title_en text not null,
  content text not null,
  duration_mins integer not null default 5,
  order_index integer not null default 0,
  unique (module_id, slug)
);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.daily_quotes (
  id uuid primary key default gen_random_uuid(),
  text_mm text not null,
  text_en text not null,
  day_of_year integer
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('meditate', 'beads')),
  duration_sec integer,
  bead_count integer,
  merit_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_mm text not null,
  title_en text not null,
  description_mm text,
  description_en text
);

create table if not exists public.user_badges (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  prompt_mm text not null,
  prompt_en text not null,
  choices jsonb not null,
  correct_index integer not null,
  explanation_mm text,
  explanation_en text,
  order_index integer not null default 0
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  score integer not null,
  total integer not null,
  answers jsonb not null,
  merit_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.daily_quotes enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "modules_read_all" on public.modules for select to authenticated using (true);
create policy "lessons_read_all" on public.lessons for select to authenticated using (true);
create policy "quotes_read_all" on public.daily_quotes for select to authenticated using (true);
create policy "badges_read_all" on public.badges for select to authenticated using (true);
create policy "quiz_read_all" on public.quiz_questions for select to authenticated using (true);

create policy "progress_own" on public.user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_own" on public.practice_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_badges_own" on public.user_badges for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "attempts_own" on public.quiz_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seeds
insert into public.modules (slug, title_mm, title_en, track, order_index, unlock_merit, description_mm, description_en)
values
  ('anapana', 'အာနာပါန', 'Anapana', 'vipassana', 1, 0, 'ထွက်သက်ဝင်သက်ကို အာရုံပြုခြင်း', 'Mindfulness of breathing'),
  ('kaya', 'ကာယာနုပဿနာ', 'Kayānupassanā', 'vipassana', 2, 50, 'ခန္ဓာကိုယ်ကို ရှုမှတ်ခြင်း', 'Contemplation of the body'),
  ('vedana', 'ဝေဒနာနုပဿနာ', 'Vedanānupassanā', 'vipassana', 3, 150, 'ခံစားမှုကို ရှုမှတ်ခြင်း', 'Contemplation of feelings'),
  ('abhidhamma-intro', 'အဘိဓမ္မာ အခြေခံ', 'Abhidhamma Basics', 'abhidhamma', 4, 100, 'စိတ်၊ စေတသိက် အကျဉ်း', 'Mind and mental factors intro'),
  ('pali-basics', 'ပါဠိ အခြေခံ', 'Pali Basics', 'pali', 5, 80, 'ပါဠိစကားလုံးနှင့် သဒ္ဒါ အတို', 'Basic Pali vocabulary')
on conflict (slug) do nothing;

insert into public.lessons (module_id, slug, title_mm, title_en, content, duration_mins, order_index)
select m.id, v.slug, v.title_mm, v.title_en, v.content, v.duration_mins, v.order_index
from public.modules m
join (
  values
    ('anapana', 'breath-basics', 'ထွက်သက်ဝင်သက်', 'Breath Basics',
     E'## အာနာပါန အခြေခံ\n\nထိုင်ရာတွင် ကျောရိုးကို တည့်မတ်စွာ ထားပါ။ နှာခေါင်းဖျားတွင် လေထွက်လေဝင်ကို သတိပြုပါ။\n\n1. ဝင်သက်ကို သိ\n2. ထွက်သက်ကို သိ\n3. စိတ်လွင့်သွားလျှင် ပြန်ယူလာပါ\n\nနေ့စဉ် ၅–၁၀ မိနစ် စတင်ပါ။', 8, 1),
    ('anapana', 'counting-breath', 'ရေတွက်ခြင်း', 'Counting Breath',
     E'## ရေတွက်နည်း\n\nဝင်သက်–ထွက်သက် တစ်စုံကို ၁ ဟု ရေတွက်ပါ။ ၁ မှ ၁၀ အထိ ရောက်လျှင် ၁ သို့ ပြန်စပါ။\n\nရေတွက်မှားလျှင် ပြန်စပါ—ဒေါသမထားဘဲ ပြန်စတင်ခြင်းသည် လေ့ကျင့်မှု ဖြစ်သည်။', 10, 2),
    ('kaya', 'posture-awareness', 'ကိုယ်အနေအထား', 'Posture Awareness',
     E'## ကာယာနုပဿနာ\n\nထိုင်၊ ရပ်၊ လမ်းလျှောက်၊ လဲလျောင်း—ကိုယ်အနေအထားကို သိအောင် ရှုပါ။\n\n“ထိုင်နေသည်”၊ “လမ်းလျှောက်နေသည်” ဟု စိတ်ထဲတွင် တိတိကျကျ သိပါ။', 12, 1),
    ('vedana', 'feeling-tone', 'ခံစားမှုအရသာ', 'Feeling Tone',
     E'## ဝေဒနာ\n\nသုခ၊ ဒုက္ခ၊ ဥပေက္ခာ—ခံစားမှု သုံးမျိုးကို စောင့်ကြည့်ပါ။\n\nမဖမ်းမဆုပ်။ ပေါ်လာသည်ကို မြင်၊ ပျောက်သွားသည်ကို မြင်။', 15, 1),
    ('abhidhamma-intro', 'citta-overview', 'စိတ် အကျဉ်း', 'Citta Overview',
     E'## စိတ် (Citta)\n\nအဘိဓမ္မာတွင် စိတ်သည် အာရုံကို သိသော သဘောဖြစ်သည်။ စေတသိက်များနှင့် အတူတကွ ဖြစ်ပေါ်သည်။\n\nယနေ့ — “သိခြင်း” ကို သတိပြုပါ။', 10, 1),
    ('pali-basics', 'greetings', 'နှုတ်ဆက်စကား', 'Greetings',
     E'## ပါဠိ စကားလုံး\n\n- **Namo** — ရှိခိုးပါ၏\n- **Buddho** — ဘုရား\n- **Dhammo** — တရား\n- **Sangho** — သံဃာ\n\n“Namo tassa bhagavato arahato sammāsambuddhassa” ကို ဖြည်းဖြည်း ရွတ်ဆို ကြည့်ပါ။', 8, 1)
) as v(module_slug, slug, title_mm, title_en, content, duration_mins, order_index)
  on m.slug = v.module_slug
on conflict do nothing;

insert into public.daily_quotes (text_mm, text_en, day_of_year) values
  ('စိတ်ကို စောင့်ရှောက်သူသည် မိမိကိုယ်ကို စောင့်ရှောက်သူ ဖြစ်၏။', 'One who guards the mind guards oneself.', 1),
  ('အနည်းငယ်သော ကုသိုလ်သည်လည်း အကျိုးကြီးနိုင်၏။', 'Even a little merit can bear great fruit.', 2),
  ('ယနေ့ တစ်မိနစ် တရားထိုင်ခြင်းသည် မနက်ဖြန်၏ အစ ဖြစ်၏။', 'One minute of practice today is the start of tomorrow.', 3),
  ('ဒေါသကို မေတ္တာဖြင့် အောင်နိုင်၏။', 'Anger is conquered by loving-kindness.', 4),
  ('သတိရှိသောသူသည် ပျော်ရွှင်၏။', 'The mindful one lives happily.', 5)
on conflict do nothing;

insert into public.badges (slug, title_mm, title_en, description_mm, description_en) values
  ('first-sit', 'ပထမဆုံး ထိုင်ခြင်း', 'First Sit', 'ပထမဆုံး တရားထိုင်မှု ပြီးမြောက်ခြင်း', 'Complete your first meditation'),
  ('seven-day', '၇ ရက် စတြိက်', '7-Day Streak', '၇ ရက် ဆက်တိုက် လေ့ကျင့်ခြင်း', 'Maintain a 7-day practice streak'),
  ('bead-round', 'ပုတီး ၁၀၈', 'Bead Round', 'ပုတီး ၁၀၈ လုံး ပြီးမြောက်ခြင်း', 'Complete 108 bead taps'),
  ('scholar', 'အဘိဓမ္မာ ပညာရှင်', 'Abhidhamma Scholar', 'သင်ခန်းစာ တစ်ခု ပြီးမြောက်ခြင်း', 'Complete a learning lesson'),
  ('exam-ready', 'စာမေးပွဲ အဆင်သင့်', 'Exam Ready', 'နမူနာ စာမေးပွဲ ပြီးမြောက်ခြင်း', 'Finish the sample quiz')
on conflict (slug) do nothing;

insert into public.quiz_questions (prompt_mm, prompt_en, choices, correct_index, explanation_mm, explanation_en, order_index) values
  (
    'ဝိပဿနာ၏ အဓိက ရည်ရွယ်ချက်မှာ အဘယ်နည်း။',
    'What is the main aim of Vipassana?',
    '["ကုသိုလ် ရရန်", "ဟုတ်တိုင်းမှန်စွာ သိရန်", "ချမ်းသာရန်", "နာမည်ကြီးရန်"]',
    1,
    'ဝိပဿနာသည် ဟုတ်တိုင်းမှန်သော သဘောကို သိမြင်ရန် ဖြစ်သည်။',
    'Vipassana aims at seeing things as they truly are.',
    1
  ),
  (
    'အာနာပါနတွင် အာရုံပြုသော အရာမှာ။',
    'In Ānāpāna, attention rests on:',
    '["အရသာ", "ထွက်သက်ဝင်သက်", "အသံ", "အလင်း"]',
    1,
    'နှာခေါင်းဖျားရှိ လေထွက်လေဝင်ကို အာရုံပြုသည်။',
    'Attention rests on the in-and-out breath.',
    2
  ),
  (
    'ကုသိုလ် ဆိုသည်မှာ။',
    'Merit (kusala) means:',
    '["မကောင်းမှု", "ကောင်းမှု စိတ်နှင့် အကျင့်", "ငွေကြေး", "အိပ်စက်ခြင်း"]',
    1,
    'ကုသိုလ်သည် ကောင်းသော စိတ်နှင့် အကျင့်ဖြစ်သည်။',
    'Merit refers to wholesome mind and action.',
    3
  ),
  (
    'Namo ၏ အဓိပ္ပာယ်မှာ။',
    'Namo means:',
    '["သွားပါ", "ရှိခိုးပါ၏", "စားပါ", "ပြေးပါ"]',
    1,
    'Namo သည် ရိုသေရှိခိုးခြင်းကို ဆိုလိုသည်။',
    'Namo means homage or reverence.',
    4
  ),
  (
    'ဝေဒနာ သုံးမျိုးမှာ။',
    'The three feeling tones are:',
    '["သုခ ဒုက္ခ ဥပေက္ခာ", "လိုဘ ဒေါသ မောဟ", "စိတ် စေတသိက် ရုပ်", "သီလ သမာဓိ ပညာ"]',
    0,
    'သုခ၊ ဒုက္ခ၊ ဥပေက္ခာ ဟူ၍ ခံစားမှု သုံးမျိုး ရှိသည်။',
    'Pleasant, unpleasant, and neutral feeling.',
    5
  ),
  (
    'ဘောဓိပင် ကြီးထွားရန် လိုအပ်သည်မှာ။',
    'To grow the Bodhi Tree you need:',
    '["ငွေ", "ကုသိုလ်အမှတ် (Merit)", "ပုံများ", "အင်တာနက်သာ"]',
    1,
    'လေ့ကျင့်မှုမှ ရသော ကုသိုလ်အမှတ်များဖြင့် ပင်ကြီးထွားသည်။',
    'Merit points from practice grow the tree.',
    6
  ),
  (
    'စတြိက် (Streak) ၏ ရည်ရွယ်ချက်မှာ။',
    'Streaks encourage:',
    '["တစ်ခါတည်း လေ့ကျင့်ခြင်း", "နေ့စဉ် ဆက်တိုက် လေ့ကျင့်ခြင်း", "မလေ့ကျင့်ခြင်း", "ပြိုင်ဆိုင်ခြင်းသာ"]',
    1,
    'နေ့စဉ် ဆက်တိုက် လေ့ကျင့်ရန် အားပေးသည်။',
    'They encourage consistent daily practice.',
    7
  ),
  (
    'ပုတီးစိပ်ခြင်းသည် အဓိကအားဖြင့်။',
    'Bead practice mainly supports:',
    '["အာရုံစူးစိုက်မှုနှင့် ရွတ်ဆိုခြင်း", "ပြေးခြင်း", "ဈေးဝယ်ခြင်း", "ဂိမ်းကစားခြင်း"]',
    0,
    'ပုတီးသည် အာရုံစူးစိုက်မှုနှင့် ရွတ်ဆိုမှုကို ကူညီသည်။',
    'Beads support focus and recitation.',
    8
  );
