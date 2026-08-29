-- Capacita.ai database schema
-- PostgreSQL 16

-- Enum types

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('employee', 'manager');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE overtime_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tables

CREATE TABLE IF NOT EXISTS teams (
    id             VARCHAR(50) PRIMARY KEY,
    name           VARCHAR(120) NOT NULL UNIQUE,
    department     VARCHAR(120),
    description    VARCHAR(255),
    primary_focus  VARCHAR(120),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id               VARCHAR(50) PRIMARY KEY,
    name             VARCHAR(150) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    role             user_role    NOT NULL DEFAULT 'employee',
    team_id          VARCHAR(50)  NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    weekly_capacity  DOUBLE PRECISION NOT NULL DEFAULT 40.0,
    title            VARCHAR(100),
    avatar_url       VARCHAR(255),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id               VARCHAR(50) PRIMARY KEY,
    title            VARCHAR(300)   NOT NULL,
    description      TEXT,
    estimated_hours  DOUBLE PRECISION NOT NULL,
    completed_hours  DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    deadline         DATE           NOT NULL,
    priority         task_priority  NOT NULL DEFAULT 'medium',
    assigned_to      VARCHAR(50)    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id          VARCHAR(50)    NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    status           task_status    NOT NULL DEFAULT 'todo',
    project_key      VARCHAR(50),
    tags             JSONB          NOT NULL DEFAULT '[]'::jsonb,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS overtime_requests (
    id            VARCHAR(50) PRIMARY KEY,
    user_id       VARCHAR(50)      NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id       VARCHAR(50)      NOT NULL REFERENCES teams(id)    ON DELETE CASCADE,
    extra_hours   DOUBLE PRECISION NOT NULL,
    reason        TEXT             NOT NULL,
    project_name  VARCHAR(150)     NOT NULL,
    date          DATE             NOT NULL,
    status        overtime_status  NOT NULL DEFAULT 'pending',
    reviewed_by   VARCHAR(50)      REFERENCES profiles(id) ON DELETE SET NULL,
    manager_notes TEXT,
    created_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Indexes

CREATE INDEX IF NOT EXISTS idx_profiles_team_id     ON profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email        ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to     ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_team_id         ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_overtime_user_id      ON overtime_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_overtime_team_id      ON overtime_requests(team_id);
