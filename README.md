# The Defining Place — THE ALTAR
> *"Find your stillness in the Word — A ministry of sacred quiet company."*
> Led by **Rev. Tresh** · Lagos, Nigeria & Global Digital Sanctuary

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981.svg)](#progressive-web-app-pwa)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000.svg)](#deploying-to-vercel)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20%2F%20Supabase-336791.svg)](#database-setup)

---

## 📖 Overview

**The Defining Place** is a spiritual sanctuary web application and installable Progressive Web App (PWA). It bridges ancient contemplative truth and modern life, offering spiritual literature, video sermons, audio soaking chords, confidential pastoral care, and multi-currency giving.

---

## 🌟 Key Features

### 1. Seeker Sanctuary Experience
- **The Bookshelf (`/#books`)**: Digital bookstore with interactive in-browser sample reading modal, custom font scaling (A− / A / A+), and paper themes (*Parchment*, *Pure White*, *Midnight*).
- **Audio Teachings & Soaking Dock (`/#audio`)**: Persistent bottom audio companion bar with playback scrubber, playback speed controls, and a built-in **Web Audio API procedural ambient chord synthesizer** for serene prayer backgrounds.
- **Video Sanctuary (`/#videos`)**: Responsive 16:9 sermons and worship gatherings with pastoral takeaways, key scripture references, and reflection questions.
- **Sow a Seed / Giving (`/#give`)**: Dynamic multi-currency giving (NGN ₦, USD $, GBP £, EUR €) supporting card payments, instant copyable Nigerian Access Bank / UK Barclays bank transfer details, celebratory confetti, and instant printable charitable tax receipts.
- **Prayer & Pastoral Care (`/#prayer`)**: Confidential prayer and counseling form generating an encrypted tracking code (`ALTR-CONF-XXXX`), backed by a 2-day pastoral response pledge.
- **Sanctuary Account Portal**: Member library tracking reading history, prayer status, and past donation receipts.
- **Sacred Aesthetic**: Custom classical editorial typography (*Playfair Display*, *Cormorant Garamond*, *Plus Jakarta Sans*) with **Daylight Parchment** and **Midnight Sanctuary** theme modes.

### 2. Pastor Admin Dashboard — "The Pastor's Study" (`/#admin`)
A dedicated oversight and content management portal for **Rev. Tresh** and ministry leadership:
- **Pastoral Security Gate**: Protected by Master Pastoral Access Key (Demo key: `altar777`).
- **Real-Time Live Activity Feed**: Chronological stream of seeker activities across the platform (prayer requests, seeds sown, audio streams, book reads).
- **Video Sermon Publisher**: Post new YouTube/Vimeo sermons, set durations, series categories, scripture references, and reflection study questions.
- **Book Publishing & Pricing Editor**: Publish new books, edit NGN / USD pricing, and manage sample chapter excerpts for the in-browser reader.
- **Audio Teachings Manager**: Upload and categorize sermon tracks and ambient prayer chords.
- **Prayer & Pastoral Intercession**: Review incoming seeker prayer requests, update intercession status (*Awaiting Prayer*, *In Intercession*, *Answered Praise*), and record confidential pastoral notes.
- **Giving & Seeds Sown Records**: Audit all contributions across NGN, USD, GBP, and EUR with 1-click **CSV Export for Church Accounting**.
- **Daily Word / Marquee Editor**: Live editor to update the sacred scripture banner that scrolls across the top of the entire website.

### 3. Progressive Web App (PWA)
- **Installable**: Full web app manifest with standalone display and high-resolution icons (192px, 512px, maskable, apple-touch-icon, and favicon).
- **Offline Shell**: Service worker (`sw.js`) precaches core assets and provides stale-while-revalidate caching for audio, images, and fonts.
- **Smart Install Prompts**: Custom sanctuary install banner with step-by-step guidance for iOS Safari users (*Share → Add to Home Screen*).

---

## 🚀 Deploying to Vercel

This repository is optimized for **1-click deployment on Vercel**:

1. **Push to GitHub**:
   Ensure this project is pushed to your GitHub account.
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
   - Select your GitHub repository (`td-prime-the-defining-place`).
   - Framework preset: **Vite** (Root Directory: `./`).
3. **Configure Environment Variables in Vercel**:
   Under **Project Settings → Environment Variables**, add:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgres://...` | Connection string for Neon, Supabase, or Vercel Postgres |
   | `PASTOR_ADMIN_KEY` | `altar777` *(or custom password)* | Security key to unlock the Pastor's Study dashboard |
4. **Deploy**:
   Click **Deploy**. Vercel will build the SPA and deploy the serverless functions in `/api/`.

---

## 🗄️ Database Setup (Neon / Supabase / Vercel Postgres)

A complete PostgreSQL schema is included in [`database/schema.sql`](file:///c:/Users/USER/Desktop/TD%20Prime/database/schema.sql).

### Tables Created:
- `pastor_admins`: Authorized leadership accounts
- `videos`: Sermons, livestreams, and study notes
- `books`: Bookshelf titles, pricing, and sample chapters
- `audio_teachings`: Audio sermon recordings and playlists
- `prayer_requests`: Seeker prayer needs and confidential pastoral notes
- `donations`: Seeds sown records, currencies, and receipt numbers
- `daily_scriptures`: Daily Word banner ticker
- `activity_logs`: Real-time site activity tracking

### Applying the Schema:
Run the SQL queries in `database/schema.sql` inside the **SQL Editor** of your Neon console, Supabase dashboard, or Vercel Postgres dashboard.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
├── api/                      # Vercel Serverless Functions
│   ├── db.js                 # PostgreSQL connection pool helper
│   ├── stats.js              # Aggregated metrics for Pastor Dashboard
│   ├── prayers.js            # Seeker prayer submission & pastoral care API
│   ├── donations.js          # Seeds sown recording & donation records API
│   └── content.js            # Video, Book, Audio & Daily Word CRUD API
├── database/
│   └── schema.sql            # PostgreSQL database migration script
├── public/
│   ├── icons/                # High-res PWA icons (192, 512, maskable)
│   ├── images/               # Official ministry covers & portraits
│   ├── manifest.json         # Web App Manifest
│   └── sw.js                 # Service worker with offline caching
├── src/
│   ├── components/           # Navbar, Footer, AudioPlayerBar, Modals, PWA prompt
│   ├── data/
│   │   ├── adminStore.js     # Reactive client/server state manager & logger
│   │   └── ministryData.js   # Seed ministry catalog & exchange rates
│   ├── utils/
│   │   └── audioSynthesizer.js # Web Audio API ambient chords synthesizer
│   ├── views/                # Home, Books, Audio, Videos, Give, Prayer, About, Admin
│   ├── App.jsx               # Application root & hash router
│   ├── components.css        # Sanctuary & Admin Dashboard styling
│   └── index.css             # Design tokens & classical typography
├── vercel.json               # Vercel SPA routing & PWA caching headers
└── .env.example              # Environment variables template
```

---

## ⚖️ License & Ministry Rights

© 2026 **THE ALTAR · The Defining Place for Rest International Ministries**. All rights reserved.
Lagos, Nigeria & Global Digital Sanctuary.
