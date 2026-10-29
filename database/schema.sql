-- ===================================================================
-- THE DEFINING PLACE — THE ALTAR
-- PostgreSQL Database Schema (Neon / Vercel Postgres / Supabase)
-- ===================================================================

-- 1. Pastor Admin Accounts
CREATE TABLE IF NOT EXISTS pastor_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) DEFAULT 'Rev. Tresh',
    role VARCHAR(50) DEFAULT 'pastor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Videos Catalog (Sermons & Livestreams)
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    series VARCHAR(150),
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration VARCHAR(50),
    date_recorded VARCHAR(100),
    speaker VARCHAR(150) DEFAULT 'Rev. Tresh',
    key_scripture VARCHAR(200),
    description TEXT,
    takeaways JSONB DEFAULT '[]'::jsonb,
    reflection_questions JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Books & Devotionals Catalog
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    tagline TEXT,
    cover_image_url TEXT,
    badge VARCHAR(50),
    price_ngn NUMERIC(10, 2) DEFAULT 7500,
    price_usd NUMERIC(10, 2) DEFAULT 12,
    price_gbp NUMERIC(10, 2) DEFAULT 9.5,
    price_eur NUMERIC(10, 2) DEFAULT 11,
    synopsis TEXT,
    sample_chapter_title VARCHAR(255),
    sample_chapter_text TEXT,
    purchase_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    reads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Audio Teachings & Soaking Chords
CREATE TABLE IF NOT EXISTS audio_teachings (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker VARCHAR(150) DEFAULT 'Rev. Tresh',
    category VARCHAR(100) DEFAULT 'Sermon',
    duration VARCHAR(50),
    audio_url TEXT,
    scripture VARCHAR(200),
    date_preached VARCHAR(100),
    plays_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Prayer & Pastoral Care Requests
CREATE TABLE IF NOT EXISTS prayer_requests (
    id SERIAL PRIMARY KEY,
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    urgency VARCHAR(50) DEFAULT 'standard',
    is_confidential BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'needs_prayer', -- needs_prayer, interceding, answered
    pastor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Giving & Seed Sown Records
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    receipt_code VARCHAR(50) UNIQUE NOT NULL,
    donor_name VARCHAR(150) DEFAULT 'Anonymous Seeker',
    donor_email VARCHAR(255),
    donor_phone VARCHAR(50),
    fund VARCHAR(150) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
    payment_method VARCHAR(50) DEFAULT 'Direct Bank Transfer',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Daily Scripture Marquee / Sanctuary Word
CREATE TABLE IF NOT EXISTS daily_scriptures (
    id SERIAL PRIMARY KEY,
    verse_text TEXT NOT NULL,
    reference VARCHAR(150) NOT NULL,
    reflection TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Real-time Activity Logs (Pastor Overview)
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal queries
CREATE INDEX IF NOT EXISTS idx_prayer_tracking ON prayer_requests(tracking_code);
CREATE INDEX IF NOT EXISTS idx_prayer_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_donations_fund ON donations(fund);
CREATE INDEX IF NOT EXISTS idx_donations_currency ON donations(currency);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
