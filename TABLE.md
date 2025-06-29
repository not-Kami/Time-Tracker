# TimeXP Database Tables

## Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  nickname TEXT,
  date_of_birth DATE,
  last_login_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}',
  achievement_level TEXT DEFAULT 'starter',
  total_time_logged BIGINT DEFAULT 0, -- in milliseconds
  total_tasks_completed INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0
);
```

## Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue',
  icon TEXT NOT NULL DEFAULT 'Folder',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);
```

## Skills Table
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_hours BIGINT DEFAULT 0, -- in milliseconds
  total_time BIGINT DEFAULT 0, -- in milliseconds
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  is_pinned BOOLEAN DEFAULT FALSE,
  pomodoro_settings JSONB DEFAULT '{"enabled": false, "focusTime": 25, "breakTime": 5}',
  playlist_url TEXT,
  playlist_name TEXT,
  playlist_platform TEXT CHECK (playlist_platform IN ('spotify', 'youtube', 'apple', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);
```

## Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  estimated_hours INTEGER DEFAULT 0,
  actual_hours INTEGER DEFAULT 0,
  deadline TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

## Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration BIGINT NOT NULL, -- in milliseconds
  description TEXT,
  pomodoro_session BOOLEAN DEFAULT FALSE,
  is_break BOOLEAN DEFAULT FALSE,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  focus_score INTEGER CHECK (focus_score >= 1 AND focus_score <= 10),
  interruptions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'time', 'tasks', 'sessions', 'consistency'
  level TEXT NOT NULL, -- 'starter', 'beginner', 'intermediate', 'advanced', 'expert', 'master'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress_value BIGINT DEFAULT 0, -- hours, task count, session count, etc.
  target_value BIGINT NOT NULL
);
```

## User Settings Table
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr', 'it', 'de', 'nl', 'pt', 'sv')),
  sound_notifications BOOLEAN DEFAULT TRUE,
  monthly_reports BOOLEAN DEFAULT FALSE,
  weekly_reminders BOOLEAN DEFAULT FALSE,
  pomodoro_sound BOOLEAN DEFAULT TRUE,
  achievement_sound BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
``` 