-- Saling Bantu Kreasi - Supabase Seed Data
-- ==========================================

-- Seed: Default admin user (password: Admin123!)
INSERT INTO users (id, email, password, name, role) VALUES
('admin-001', 'admin@salingbantukreasi.or.id', 'Admin123!', 'Super Admin', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Seed: Default categories
INSERT INTO categories (id, name, slug, type) VALUES
('cat-c-001', 'Pendidikan', 'pendidikan', 'campaign'),
('cat-c-002', 'Kesehatan', 'kesehatan', 'campaign'),
('cat-c-003', 'Kemanusiaan', 'kemanusiaan', 'campaign'),
('cat-c-004', 'Lingkungan', 'lingkungan', 'campaign'),
('cat-c-005', 'Wakaf Produktif', 'wakaf-produktif', 'campaign'),
('cat-c-006', 'Pemberdayaan', 'pemberdayaan', 'campaign'),
('cat-n-001', 'Kegiatan', 'kegiatan', 'news'),
('cat-n-002', 'Pengumuman', 'pengumuman', 'news'),
('cat-n-003', 'Inspirasi', 'inspirasi', 'news'),
('cat-n-004', 'Laporan', 'laporan', 'news')
ON CONFLICT (id) DO NOTHING;

-- Seed: Default settings
INSERT INTO settings (key, value) VALUES
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
('hero_badge', 'Badan Wakaf Produktif'),
('hero_title', 'Bersama Membangun Harapan untuk Negeri'),
('hero_subtitle', 'Yayasan Saling Bantu Kreasi Indonesia hadir sebagai wadah kolaborasi untuk memberdayakan masyarakat melalui program pendidikan, kesehatan, dan pemberdayaan ekonomi.'),
('hero_cta_text', 'Mulai Berdonasi'),
('hero_cta_secondary', 'Tentang Kami'),
('stat_beneficiaries', '500+'),
('stat_programs', '15+'),
('stat_volunteers', '50+'),
('about_title', 'Tentang Yayasan SBK Indonesia'),
('about_description', 'Yayasan Saling Bantu Kreasi (SBK) Indonesia adalah organisasi nirlaba yang bergerak di bidang sosial, pendidikan, kesehatan, dan pemberdayaan masyarakat.'),
('about_visi', 'Menjadi yayasan terdepan dalam pemberdayaan masyarakat dan inovasi sosial untuk Indonesia yang lebih baik, adil, dan sejahtera.'),
('about_misi_1', 'Menyelenggarakan program pendidikan berkualitas dan beasiswa bagi anak-anak kurang mampu.'),
('about_misi_2', 'Mengembangkan program kesehatan masyarakat dan bantuan medis.'),
('about_misi_3', 'Memberdayakan UMKM dan ekonomi kreatif masyarakat.'),
('about_misi_4', 'Mengelola wakaf produktif untuk kesejahteraan umat.'),
('about_misi_5', 'Melakukan kegiatan sosial kemanusiaan dan tanggap bencana.'),
('contact_maps_embed', '')
ON CONFLICT (key) DO NOTHING;
