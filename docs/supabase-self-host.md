# Supabase Self-Hosting Setup for TimeXP

## Prerequisites
- Docker and Docker Compose installed
- Domain name (optional, for SSL)
- Server with minimum 4GB RAM

## Quick Setup

### 1. Clone Supabase
```bash
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
```

### 2. Configure Environment
```bash
cp .env.example .env

# Edit .env file with your settings:
# - POSTGRES_PASSWORD=your_secure_password
# - JWT_SECRET=your_jwt_secret_key
# - ANON_KEY=your_anon_key
# - SERVICE_ROLE_KEY=your_service_role_key
# - SITE_URL=https://your-domain.com
```

### 3. Generate Keys
```bash
# Generate JWT secret (32+ characters)
openssl rand -base64 32

# Generate API keys using the JWT secret
# Use: https://supabase.com/docs/guides/hosting/overview#api-keys
```

### 4. Start Services
```bash
docker compose up -d
```

### 5. Access Dashboard
- Dashboard: http://localhost:8000
- Database: localhost:5432
- API: http://localhost:8000/rest/v1

## TimeXP Schema Setup

### 1. Create Tables
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by auth.users)
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue',
  icon TEXT NOT NULL DEFAULT 'Folder',
  notes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_time BIGINT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  pomodoro_settings JSONB DEFAULT '{"enabled": false, "focusTime": 25, "breakTime": 5}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration BIGINT NOT NULL,
  description TEXT,
  pomodoro_session BOOLEAN DEFAULT FALSE,
  is_break BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can manage their own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can manage tasks in their projects" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Sessions policies
CREATE POLICY "Users can manage sessions in their projects" ON sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = sessions.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Notes policies
CREATE POLICY "Users can manage notes in their projects" ON notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = notes.project_id 
      AND projects.user_id = auth.uid()
    )
  );
```

## Production Considerations

### 1. SSL/TLS Setup
```nginx
# Nginx reverse proxy configuration
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Backup Strategy
```bash
# Database backup
docker exec supabase_db pg_dump -U postgres postgres > backup.sql

# Automated daily backups
0 2 * * * docker exec supabase_db pg_dump -U postgres postgres > /backups/$(date +\%Y\%m\%d).sql
```

### 3. Monitoring
- Set up monitoring for Docker containers
- Monitor database performance
- Set up log aggregation
- Configure alerts for downtime

### 4. Updates
```bash
# Update Supabase
cd supabase/docker
git pull origin main
docker compose pull
docker compose up -d
```

## Environment Variables for TimeXP

```env
# .env file for your TimeXP app
VITE_SUPABASE_URL=https://your-domain.com
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Benefits of Self-Hosting

✅ **Full Control** - Your data, your rules
✅ **Cost Effective** - No per-user pricing
✅ **Data Privacy** - Everything stays on your server
✅ **Customization** - Modify as needed
✅ **Compliance** - Meet regulatory requirements
✅ **Performance** - Optimize for your use case

## Migration Path

1. **Start with Cloud** - Quick development
2. **Export Schema** - When ready to migrate
3. **Self-Host Setup** - Deploy on your server
4. **Data Migration** - Transfer existing data
5. **Update Config** - Point app to self-hosted instance