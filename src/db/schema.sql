-- Saling Bantu Kreasi - D1 Database Schema
-- ==========================================

-- Users table (admin, editor, donor)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'donor' CHECK(role IN ('admin', 'editor', 'donor')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Categories for campaigns and news
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('campaign', 'news')),
    description TEXT DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Campaigns (donasi/wakaf)
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    image TEXT DEFAULT '',
    category_id TEXT,
    target_amount REAL NOT NULL DEFAULT 0,
    collected_amount REAL NOT NULL DEFAULT 0,
    donor_count INTEGER NOT NULL DEFAULT 0,
    start_date TEXT NOT NULL,
    end_date TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'completed', 'cancelled')),
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    campaign_id TEXT NOT NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT DEFAULT '',
    amount REAL NOT NULL,
    message TEXT DEFAULT '',
    is_anonymous INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'transfer',
    payment_proof TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'rejected')),
    verified_by TEXT,
    verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- News / Blog articles
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    image TEXT DEFAULT '',
    category_id TEXT,
    author_id TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    view_count INTEGER NOT NULL DEFAULT 0,
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    replied_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Settings (key-value store for website config)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
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

-- Seed: Default admin user (password: Admin123!)
INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES
('admin-001', 'admin@salingbantukreasi.or.id', 'Admin123!', 'Super Admin', 'admin');

-- Seed: Default categories
INSERT OR IGNORE INTO categories (id, name, slug, type) VALUES
('cat-c-001', 'Pendidikan', 'pendidikan', 'campaign'),
('cat-c-002', 'Kesehatan', 'kesehatan', 'campaign'),
('cat-c-003', 'Kemanusiaan', 'kemanusiaan', 'campaign'),
('cat-c-004', 'Lingkungan', 'lingkungan', 'campaign'),
('cat-c-005', 'Wakaf Produktif', 'wakaf-produktif', 'campaign'),
('cat-c-006', 'Pemberdayaan', 'pemberdayaan', 'campaign'),
('cat-n-001', 'Kegiatan', 'kegiatan', 'news'),
('cat-n-002', 'Pengumuman', 'pengumuman', 'news'),
('cat-n-003', 'Inspirasi', 'inspirasi', 'news'),
('cat-n-004', 'Laporan', 'laporan', 'news');

-- Seed: Default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
('site_name', 'Yayasan Saling Bantu Kreasi Indonesia'),
('site_tagline', 'Mendorong kolaborasi, pemberdayaan komunitas, dan inovasi sosial untuk Indonesia yang lebih baik'),
('site_email', 'info@salingbantukreasi.or.id'),
('site_phone', '+62-266-XXXXXXX'),
('site_address', 'Sukabumi, Jawa Barat, Indonesia'),
('site_instagram', 'https://instagram.com/salingbantukreasi'),
('site_facebook', 'https://facebook.com/salingbantukreasi'),
('site_youtube', ''),
('bank_name', 'Bank Syariah Indonesia (BSI)'),
('bank_account', ''),
('bank_holder', 'Yayasan Saling Bantu Kreasi Indonesia'),
-- Beranda: Hero
('hero_badge', 'Badan Wakaf Produktif'),
('hero_title', 'Bersama Membangun Harapan untuk Negeri'),
('hero_subtitle', 'Yayasan Saling Bantu Kreasi Indonesia hadir sebagai wadah kolaborasi untuk memberdayakan masyarakat melalui program pendidikan, kesehatan, dan pemberdayaan ekonomi.'),
('hero_cta_text', 'Mulai Berdonasi'),
('hero_cta_secondary', 'Tentang Kami'),
-- Beranda: Statistik
('stat_beneficiaries', '500+'),
('stat_programs', '15+'),
('stat_volunteers', '50+'),
-- Tentang
('about_title', 'Tentang Yayasan SBK Indonesia'),
('about_description', 'Yayasan Saling Bantu Kreasi (SBK) Indonesia adalah organisasi nirlaba yang bergerak di bidang sosial, pendidikan, kesehatan, dan pemberdayaan masyarakat. Didirikan dengan semangat gotong royong dan kepedulian terhadap sesama, kami berkomitmen untuk menciptakan dampak positif yang berkelanjutan.'),
('about_visi', 'Menjadi yayasan terdepan dalam pemberdayaan masyarakat dan inovasi sosial untuk Indonesia yang lebih baik, adil, dan sejahtera.'),
('about_misi_1', 'Menyelenggarakan program pendidikan berkualitas dan beasiswa bagi anak-anak kurang mampu.'),
('about_misi_2', 'Mengembangkan program kesehatan masyarakat dan bantuan medis.'),
('about_misi_3', 'Memberdayakan UMKM dan ekonomi kreatif masyarakat.'),
('about_misi_4', 'Mengelola wakaf produktif untuk kesejahteraan umat.'),
('about_misi_5', 'Melakukan kegiatan sosial kemanusiaan dan tanggap bencana.'),
-- Kontak
('contact_maps_embed', '');
