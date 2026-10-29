import React from 'react';
import { 
  BookOpen, Heart, ShieldCheck, Headphones, ArrowRight, 
  Sparkles, Star, CheckCircle, Volume2, Play, Quote, Globe, Share2 
} from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function HomeView({ 
  setActivePage, 
  openReaderModal, 
  openGivingModal, 
  setActiveAudio, 
  currency 
}) {
  const currencyObj = ministryData.currencies[currency];

  const formatPrice = (usd, ngn) => {
    if (currency === 'NGN') return `₦${ngn.toLocaleString()}`;
    const rate = currencyObj.rate || 1;
    return `${currencyObj.symbol}${(usd * rate).toFixed(2)}`;
  };

  const handleShareDailyVerse = () => {
    navigator.clipboard.writeText("“Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.” — Psalm 46:10 (The Defining Place)");
    alert("Verse copied to clipboard! Share the blessing.");
  };

  return (
    <div className="home-view animate-fade-in">
      {/* ===================================================================
          HERO SECTION
          =================================================================== */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow">The Defining Place</span>
              <span className="live-indicator-pill hide-mobile">
                <span className="pulse-dot"></span>
                <span>Gatherings from Lagos to the World</span>
              </span>
            </div>

            <h1 className="hero-title">
              Find Your <span className="text-gold-gradient">Stillness</span> In The Word.
            </h1>

            <p className="hero-description">
              Wisdom and quiet counsel for the modern seeker — bridging ancient truth 
              and everyday life, from Nigeria to the world.
            </p>

            <div className="hero-action-group">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setActivePage('books')}
              >
                <BookOpen size={18} />
                <span>Read The Books</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className="btn btn-outline btn-lg"
                onClick={() => setActivePage('prayer')}
              >
                <ShieldCheck size={18} className="text-gold" />
                <span>Share A Need</span>
              </button>

              <button 
                className="hero-listen-btn hide-mobile"
                onClick={() => setActiveAudio(ministryData.audioTeachings[0])}
                title="Listen to foundational message"
              >
                <div className="listen-play-circle">
                  <Play size={14} fill="currentColor" />
                </div>
                <span>Listen to Today's Word</span>
              </button>
            </div>

            <div className="hero-trust-row">
              <div className="trust-item">
                <Globe size={16} className="text-gold" />
                <span>Readers across 42 countries</span>
              </div>
              <div className="trust-item">
                <ShieldCheck size={16} className="text-teal" />
                <span>100% Confidential Pastoral Counsel</span>
              </div>
            </div>
          </div>

          {/* Hero Portrait Card */}
          <div className="hero-visual-card">
            <div className="portrait-wrapper">
              <div className="portrait-frame">
                <div className="portrait-header-bar">
                  <span className="portrait-tag">REV. TRESH</span>
                </div>
                <img 
                  src="/images/rev-tresh.jpg" 
                  alt="Rev. Tresh - The Defining Place" 
                  className="portrait-img"
                />
                <div className="portrait-glass-overlay">
                  <div className="overlay-badge">
                    <Sparkles size={16} className="text-gold" />
                    <div>
                      <span className="overlay-title">Rev. Tresh</span>
                      <span className="overlay-desc">Author & Pastoral Counselor</span>
                    </div>
                  </div>
                  <button 
                    className="portrait-audio-btn"
                    onClick={() => setActiveAudio(ministryData.audioTeachings[0])}
                    title="Listen to Rev. Tresh teach on Rest"
                  >
                    <Headphones size={15} />
                    <span>Listen (38m)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          DAILY STILLNESS SPOTLIGHT
          =================================================================== */}
      <section className="daily-stillness-strip">
        <div className="container">
          <div className="daily-stillness-card">
            <div className="stillness-left">
              <span className="stillness-badge">Word for Today</span>
              <p className="stillness-scripture">
                “Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.”
              </p>
              <span className="stillness-reference">— Psalm 46:10</span>
            </div>
            <div className="stillness-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={handleShareDailyVerse}
              >
                <Share2 size={14} />
                <span>Share Blessing</span>
              </button>
              <button 
                className="btn btn-gold btn-sm"
                onClick={() => setActiveAudio(ministryData.audioTeachings[0])}
              >
                <Volume2 size={14} />
                <span>Audio Meditation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          THREE PATHS, ONE HOME
          =================================================================== */}
      <section className="section-spacing three-paths-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="eyebrow">Three Paths, One Home</span>
            <h2 className="section-title">Read a book. Give a gift. Share a need.</h2>
            <p className="section-subtitle">
              Every seeker enters through a different door. Choose the path that meets your soul today.
            </p>
          </div>

          <div className="three-paths-grid">
            {/* Path 1: Books */}
            <div className="path-card">
              <div className="path-header">
                <BookOpen size={20} className="path-icon text-gold" />
                <h3 className="path-title">READ MY BOOKS</h3>
              </div>
              <div className="path-body">
                <p className="path-desc">
                  Devotionals and spiritual essays for the modern seeker. Read free sample chapters right 
                  in your browser or download to keep.
                </p>
                <button 
                  className="btn btn-primary path-btn"
                  onClick={() => setActivePage('books')}
                >
                  <span>View Catalog</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Path 2: Giving */}
            <div className="path-card">
              <div className="path-header">
                <Heart size={20} className="path-icon text-teal" />
                <h3 className="path-title">GIVE A DONATION</h3>
              </div>
              <div className="path-body">
                <p className="path-desc">
                  Support confidential counseling, free book funds for readers without means, 
                  and youth outreach in Lagos — one time or monthly, in your currency.
                </p>
                <button 
                  className="btn btn-primary path-btn"
                  onClick={() => openGivingModal()}
                >
                  <span>Contribute Now</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Path 3: Prayer */}
            <div className="path-card">
              <div className="path-header">
                <ShieldCheck size={20} className="path-icon text-gold" />
                <h3 className="path-title">SHARE A NEED</h3>
              </div>
              <div className="path-body">
                <p className="path-desc">
                  Submit a private prayer or counseling request. Rev. Tresh and a trained team 
                  will respond personally in strict confidence within two days.
                </p>
                <button 
                  className="btn btn-primary path-btn"
                  onClick={() => setActivePage('prayer')}
                >
                  <span>Request Support</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          THE BOOKSHELF SECTION
          =================================================================== */}
      <section className="section-spacing bookshelf-section">
        <div className="container">
          <div className="bookshelf-header">
            <div>
              <span className="eyebrow">Current Works</span>
              <h2 className="section-title">The Bookshelf</h2>
              <p className="section-subtitle">
                Each volume is crafted to meet you in quiet places. Read sample chapters free in your browser.
              </p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setActivePage('books')}
            >
              <span>View All Books</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="bookshelf-grid">
            {ministryData.books.map((book) => (
              <div key={book.id} className="book-card-elevated">
                <div className="book-card-top-bar">
                  <span className="book-card-bar-title">{book.title.toUpperCase()}</span>
                </div>

                <div className="book-cover-stage">
                  <img src={book.coverImage} alt={book.title} className="book-cover-image" />
                  <div className="book-hover-actions">
                    <button 
                      className="btn btn-gold btn-sm"
                      onClick={() => openReaderModal(book)}
                    >
                      <BookOpen size={14} />
                      <span>Read Sample</span>
                    </button>
                  </div>
                </div>

                <div className="book-card-body">
                  <h3 className="book-item-title">{book.title}</h3>
                  <p className="book-item-subtitle">{book.subtitle}</p>
                  
                  <div className="book-price-row">
                    <span className="book-price font-bold text-gold">
                      {formatPrice(book.priceUSD, book.priceNGN)}
                    </span>
                    <span className="book-format-tag">{book.formats[0]}</span>
                  </div>

                  <div className="book-card-actions">
                    <button 
                      className="btn btn-outline btn-sm w-full"
                      onClick={() => openReaderModal(book)}
                    >
                      <BookOpen size={14} />
                      <span>Sample Chapter</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SACRED AUDIO FEATURE SPOTLIGHT
          =================================================================== */}
      <section className="section-spacing audio-spotlight-section">
        <div className="container">
          <div className="audio-spotlight-card">
            <div className="audio-spotlight-grid">
              <div className="spotlight-text">
                <span className="eyebrow">Sacred Voice & Teachings</span>
                <h2 className="section-title">The Altar of Rest</h2>
                <p className="spotlight-lead">
                  “Where striving ends and rest begins.” Rev. Tresh’s landmark teaching on recovering 
                  from soul-exhaustion, laying down performance culture, and walking with God in ordinary peace.
                </p>

                <div className="audio-meta-pills">
                  <span className="meta-pill"><Headphones size={14} className="text-teal" /> 38 Minutes</span>
                  <span className="meta-pill"><Sparkles size={14} className="text-gold" /> Matthew 11:28-30</span>
                  <span className="meta-pill"><Globe size={14} /> Recorded Live in Lagos</span>
                </div>

                <div className="spotlight-actions">
                  <button 
                    className="btn btn-gold btn-lg"
                    onClick={() => setActiveAudio(ministryData.audioTeachings[0])}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Listen To Message Now</span>
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setActivePage('audio')}
                  >
                    <span>Browse All Audio (6)</span>
                  </button>
                </div>
              </div>

              <div className="spotlight-waveform-visual">
                <div className="waveform-box">
                  <div className="waveform-header">
                    <span className="waveform-label">AUDIO STREAM · 320 KBPS</span>
                    <span className="waveform-speaker">REV. TRESH</span>
                  </div>
                  <div className="waveform-bars">
                    {[40, 65, 80, 50, 95, 70, 85, 45, 60, 90, 75, 55, 85, 65, 40, 70, 90, 60, 80, 50, 75, 95, 60, 45, 80].map((h, i) => (
                      <span key={i} className="wave-bar" style={{ height: `${h}%` }}></span>
                    ))}
                  </div>
                  <div className="waveform-footer">
                    <span>The ALTAR Series · Part 1</span>
                    <button 
                      className="inline-play-link"
                      onClick={() => setActiveAudio(ministryData.audioTeachings[0])}
                    >
                      Play Stream →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          TESTIMONIAL QUOTE SECTION
          =================================================================== */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-quote-wrap">
            <Quote size={48} className="quote-mark text-gold" />
            <blockquote className="testimonial-quote">
              “I found The Defining Place during the hardest year of my life. 
              The counseling team answered within a day, and Rev. Tresh's book met me where I was. 
              This is a place that keeps its promises.”
            </blockquote>
            <cite className="testimonial-author">— Chidinma, Lagos, Nigeria</cite>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SUPPORT OUR GLOBAL MINISTRY (GIVING CARD)
          =================================================================== */}
      <section className="section-spacing ministry-support-section">
        <div className="container">
          <div className="support-card-main">
            <div className="support-card-grid">
              <div className="support-card-left">
                <span className="eyebrow">Sow a Seed</span>
                <h2 className="support-heading">Support Our Global Ministry.</h2>
                <p className="support-subheading">
                  Your gift funds counseling, publishes books for readers who cannot pay, 
                  and sustains our Lagos youth programme.
                </p>

                <div className="support-btn-group">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => openGivingModal()}
                  >
                    <Heart size={18} />
                    <span>Give Now ({currencyObj.symbol})</span>
                  </button>
                  <button 
                    className="btn btn-outline btn-lg"
                    onClick={() => setActivePage('give')}
                  >
                    <span>View Ministry Funds</span>
                  </button>
                </div>
              </div>

              <div className="support-card-right">
                <div className="where-it-goes-card">
                  <div className="where-header">
                    <h4>WHERE IT GOES</h4>
                  </div>
                  <ul className="where-list">
                    <li>
                      <CheckCircle size={16} className="text-teal" />
                      <span>Trained counseling for prayer and mental-health requests</span>
                    </li>
                    <li>
                      <CheckCircle size={16} className="text-teal" />
                      <span>Free devotional books for readers who cannot pay</span>
                    </li>
                    <li>
                      <CheckCircle size={16} className="text-teal" />
                      <span>Nigeria Youth Outreach — programmes in Lagos</span>
                    </li>
                    <li>
                      <CheckCircle size={16} className="text-teal" />
                      <span>Publishing, translation, and international distribution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
