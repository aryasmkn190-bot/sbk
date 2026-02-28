-- Saling Bantu Kreasi - Supabase PostgreSQL Schema
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Raw SQL RPC function (for query/execute from client.ts)
CREATE OR REPLACE FUNCTION raw_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || query_text || ') t'
    INTO result;
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    -- For INSERT/UPDATE/DELETE that don't return rows
    BEGIN
        EXECUTE query_text;
        RETURN '[]'::jsonb;
    EXCEPTION WHEN OTHERS THEN
        RAISE;
    END;
END;
$$;

-- Users table (admin, editor, donor)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'donor' CHECK(role IN ('admin', 'editor', 'donor')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS'),
    updated_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- Categories for campaigns and news
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('campaign', 'news')),
    description TEXT DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- Campaigns (donasi/wakaf)
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    image TEXT DEFAULT '',
    category_id TEXT REFERENCES categories(id),
    target_amount REAL NOT NULL DEFAULT 0,
    collected_amount REAL NOT NULL DEFAULT 0,
    donor_count INTEGER NOT NULL DEFAULT 0,
    start_date TEXT NOT NULL,
    end_date TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'completed', 'cancelled')),
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_by TEXT REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS'),
    updated_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT DEFAULT '',
    amount REAL NOT NULL,
    message TEXT DEFAULT '',
    is_anonymous INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'transfer',
    payment_proof TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'rejected')),
    verified_by TEXT REFERENCES users(id),
    verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- News / Blog articles
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    image TEXT DEFAULT '',
    category_id TEXT REFERENCES categories(id),
    author_id TEXT REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    view_count INTEGER NOT NULL DEFAULT 0,
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS'),
    updated_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(16), 'hex'),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    replied_at TEXT,
    created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- Settings (key-value store for website config)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_featured ON campaigns(is_featured);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
