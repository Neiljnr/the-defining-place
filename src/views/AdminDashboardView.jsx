import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Video, BookOpen, Music, 
  HeartHandshake, Heart, Sparkles, Plus, Trash2, Edit3, 
  CheckCircle2, Clock, AlertCircle, ArrowUpRight, Search, 
  Filter, Download, Eye, ExternalLink, Calendar, User, 
  ChevronRight, RefreshCw, Send, Check
} from 'lucide-react';
import { useSanctuaryAdmin } from '../data/adminStore';

export default function AdminDashboardView({ setActivePage }) {
  const {
    books, videos, audioTeachings, dailyScripture, prayers, donations, activities, stats,
    isPastorAuthenticated,
    addVideo, updateVideo, deleteVideo,
    addBook, updateBook, deleteBook,
    addAudio, updateAudio, deleteAudio,
    updateDailyScripture,
    updatePrayerStatus,
    authenticatePastor, logoutPastor
  } = useSanctuaryAdmin();

  // Local login state
  const [accessKey, setAccessKey] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, videos, books, audio, prayers, giving, daily_word

  // Form states for modals/drawers
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [pastorNoteInput, setPastorNoteInput] = useState('');

  // New Video Form state
  const [newVideo, setNewVideo] = useState({
    title: '',
    series: 'Sunday Service',
    duration: '45 min',
    videoUrl: '',
    thumbnail: '/images/video-service.jpg',
    description: '',
    scripture: 'Psalm 46:10',
    topics: 'Stillness, Faith'
  });

  // New Book Form state
  const [newBook, setNewBook] = useState({
    title: '',
    subtitle: '',
    author: 'Rev. Tresh',
    priceNGN: 6000,
    priceUSD: 12,
    coverImage: '/images/book-defining-path.jpg',
    synopsis: '',
    sampleTitle: 'Chapter 1: The Altar of Rest',
    sampleText: 'In quiet company, the heart ceases its striving and anchors in God\'s presence.'
  });

  // New Audio Form state
  const [newAudio, setNewAudio] = useState({
    title: '',
    series: 'Foundational Teachings',
    speaker: 'Rev. Tresh',
    duration: '32 min',
    scripture: 'Matthew 11:28',
    description: '',
    audioUrl: 'ambient_rest'
  });

  // Daily Word Form state
  const [editingWord, setEditingWord] = useState({
    verse: dailyScripture.verse,
    reference: dailyScripture.reference
  });
  const [wordSaved, setWordSaved] = useState(false);

  // Filters
  const [prayerFilter, setPrayerFilter] = useState('all'); // all, needs_prayer, interceding, answered
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (authenticatePastor(accessKey)) {
      setAuthError(false);
      setAccessKey('');
    } else {
      setAuthError(true);
    }
  };

  // Handle Video Submit
  const handleCreateVideo = (e) => {
    e.preventDefault();
    if (!newVideo.title) return;
    addVideo({
      ...newVideo,
      topics: newVideo.topics.split(',').map(t => t.trim())
    });
    setShowVideoModal(false);
    setNewVideo({
      title: '',
      series: 'Sunday Service',
      duration: '45 min',
      videoUrl: '',
      thumbnail: '/images/video-service.jpg',
      description: '',
      scripture: 'Psalm 46:10',
      topics: 'Stillness, Faith'
    });
  };

  // Handle Book Submit
  const handleCreateBook = (e) => {
    e.preventDefault();
    if (!newBook.title) return;
    addBook({
      title: newBook.title,
      subtitle: newBook.subtitle,
      author: newBook.author,
      priceNGN: Number(newBook.priceNGN),
      priceUSD: Number(newBook.priceUSD),
      coverImage: newBook.coverImage,
      synopsis: newBook.synopsis,
      sampleChapter: {
        title: newBook.sampleTitle,
        epigraph: '“Rest is holy ground.”',
        paragraphs: newBook.sampleText.split('\n\n').filter(Boolean)
      }
    });
    setShowBookModal(false);
    setNewBook({
      title: '',
      subtitle: '',
      author: 'Rev. Tresh',
      priceNGN: 6000,
      priceUSD: 12,
      coverImage: '/images/book-defining-path.jpg',
      synopsis: '',
      sampleTitle: 'Chapter 1: The Altar of Rest',
      sampleText: 'In quiet company, the heart ceases its striving and anchors in God\'s presence.'
    });
  };

  // Handle Audio Submit
  const handleCreateAudio = (e) => {
    e.preventDefault();
    if (!newAudio.title) return;
    addAudio({
      ...newAudio,
      durationSec: 1800
    });
    setShowAudioModal(false);
    setNewAudio({
      title: '',
      series: 'Foundational Teachings',
      speaker: 'Rev. Tresh',
      duration: '32 min',
      scripture: 'Matthew 11:28',
      description: '',
      audioUrl: 'ambient_rest'
    });
  };

  // Handle Daily Word Save
  const handleSaveDailyWord = (e) => {
    e.preventDefault();
    updateDailyScripture(editingWord);
    setWordSaved(true);
    setTimeout(() => setWordSaved(false), 3000);
  };

  // Handle Prayer Status Update
  const handleSavePrayerNote = (prayerId, newStatus) => {
    updatePrayerStatus(prayerId, newStatus, pastorNoteInput);
    if (selectedPrayer && selectedPrayer.id === prayerId) {
      setSelectedPrayer(prev => ({
        ...prev,
        status: newStatus,
        pastorNotes: pastorNoteInput
      }));
    }
  };

  // Filtered Prayers
  const filteredPrayers = prayers.filter(p => {
    if (prayerFilter !== 'all' && p.status !== prayerFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.message.toLowerCase().includes(q) ||
        p.trackingCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Export Donations to CSV
  const handleExportDonations = () => {
    const headers = ['Receipt #', 'Date', 'Donor Name', 'Email', 'Fund', 'Amount', 'Currency', 'Payment Method'];
    const rows = donations.map(d => [
      d.receiptCode,
      new Date(d.createdAt).toLocaleDateString(),
      `"${d.donorName}"`,
      d.email,
      `"${d.fund}"`,
      d.amount,
      d.currency,
      `"${d.paymentMethod}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `altar_donations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -----------------------------------------------------------------
  // Pastoral Access Gate (If Not Logged In)
  // -----------------------------------------------------------------
  if (!isPastorAuthenticated) {
    return (
      <div className="admin-gate-wrapper animate-fade-in">
        <div className="container container-narrow">
          <div className="admin-gate-card glass-card">
            <div className="admin-gate-header text-center">
              <div className="gate-icon-circle">
                <Lock size={32} className="text-gold" />
              </div>
              <span className="eyebrow mt-3">Sanctuary Leadership</span>
              <h1 className="gate-title font-serif mt-2">The Pastor’s Study</h1>
              <p className="gate-subtitle">
                Authorized pastoral access for Rev. Tresh & ministry leadership. Oversee site activity, post sermons, and manage pastoral care.
              </p>
            </div>

            <form onSubmit={handleLogin} className="gate-form mt-4">
              <div className="form-group">
                <label htmlFor="pastor-key">Master Pastoral Access Key</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="pastor-key"
                    type="password"
                    placeholder="Enter security key..."
                    value={accessKey}
                    onChange={(e) => {
                      setAccessKey(e.target.value);
                      setAuthError(false);
                    }}
                    autoFocus
                    required
                  />
                </div>
                {authError && (
                  <p className="error-text mt-2 text-center text-sm">
                    Access key incorrect. (Default demo key: <code>altar777</code>)
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-gold w-full mt-3">
                <ShieldCheck size={18} />
                <span>Enter Sanctuary Portal</span>
              </button>
            </form>

            <div className="gate-footer mt-4 text-center">
              <button 
                type="button" 
                className="text-link text-sm text-muted"
                onClick={() => setActivePage('home')}
              >
                ← Return to Public Sanctuary Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // Authorized Pastor Dashboard
  // -----------------------------------------------------------------
  return (
    <div className="admin-dashboard-page animate-fade-in">
      {/* Top Pastor Header Banner */}
      <div className="admin-top-banner">
        <div className="container">
          <div className="admin-header-flex">
            <div className="admin-profile-brand">
              <div className="pastor-avatar-badge">
                <img src="/images/rev-tresh.jpg" alt="Rev. Tresh" className="pastor-mini-img" />
                <span className="online-dot" title="Live Sync Active"></span>
              </div>
              <div>
                <div className="admin-badge-row">
                  <span className="sanctuary-pill">Lead Pastor Oversight</span>
                  <span className="database-pill">Database Connected</span>
                </div>
                <h1 className="admin-welcome font-serif">Welcome, Rev. Tresh</h1>
                <p className="admin-welcome-sub">
                  The Defining Place — Real-time Sanctuary Activity & Content Management
                </p>
              </div>
            </div>

            <div className="admin-header-actions">
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setActivePage('home')}
                title="View site as a seeker"
              >
                <Eye size={15} />
                <span>View Public Site</span>
              </button>
              <button 
                className="btn btn-outline btn-sm logout-btn" 
                onClick={logoutPastor}
                title="Sign out of pastoral session"
              >
                <LogOut size={15} />
                <span>Lock Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="admin-metrics-grid mt-4">
            <div className="metric-card glass-card">
              <div className="metric-icon-wrap gold-wrap">
                <HeartHandshake size={22} className="text-gold" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Seeds Sown</span>
                <span className="metric-value font-serif">
                  ₦{stats.totalDonations.NGN.toLocaleString()}
                  <span className="metric-subval"> + ${stats.totalDonations.USD}</span>
                </span>
                <span className="metric-note">{stats.donationsCount} donation records logged</span>
              </div>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-icon-wrap teal-wrap">
                <Heart size={22} className="text-teal" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Prayer Requests</span>
                <span className="metric-value font-serif">{stats.needsPrayerCount} Awaiting</span>
                <span className="metric-note">{stats.intercedingCount} in intercession · {stats.answeredCount} answered</span>
              </div>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-icon-wrap purple-wrap">
                <Video size={22} className="text-purple" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Sermons & Audios</span>
                <span className="metric-value font-serif">{stats.videosCount + stats.audioCount} Messages</span>
                <span className="metric-note">{stats.videosCount} video recordings · {stats.audioCount} audio teachings</span>
              </div>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-icon-wrap green-wrap">
                <BookOpen size={22} className="text-green" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Sanctuary Books</span>
                <span className="metric-value font-serif">{stats.booksCount} Titles</span>
                <span className="metric-note">Live reader & sample chapters active</span>
              </div>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <nav className="admin-nav-tabs mt-4" aria-label="Pastor Sections">
            <button 
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Sparkles size={16} />
              <span>Live Activities</span>
              <span className="tab-count-pill">{activities.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              <Video size={16} />
              <span>Videos & Sermons</span>
              <span className="tab-count-pill">{videos.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <BookOpen size={16} />
              <span>Books & Devotionals</span>
              <span className="tab-count-pill">{books.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              <Music size={16} />
              <span>Audio Teachings</span>
              <span className="tab-count-pill">{audioTeachings.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'prayers' ? 'active' : ''}`}
              onClick={() => setActiveTab('prayers')}
            >
              <Heart size={16} />
              <span>Prayer Care</span>
              {stats.needsPrayerCount > 0 && (
                <span className="tab-alert-pill">{stats.needsPrayerCount}</span>
              )}
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'giving' ? 'active' : ''}`}
              onClick={() => setActiveTab('giving')}
            >
              <HeartHandshake size={16} />
              <span>Giving Log</span>
              <span className="tab-count-pill">{donations.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'daily_word' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily_word')}
            >
              <Edit3 size={16} />
              <span>Daily Scripture</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="container py-4">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & LIVE ACTIVITIES                         */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Sanctuary Live Stream & Activities</h2>
                <p className="text-muted text-sm">
                  Real-time activity log of seeker interactions, prayer needs, seeds sown, and sermon streams.
                </p>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => window.location.reload()}
                title="Refresh feed"
              >
                <RefreshCw size={14} />
                <span>Refresh Activity</span>
              </button>
            </div>

            <div className="activities-stream-card glass-card">
              {activities.length === 0 ? (
                <div className="empty-state-p text-center py-5">
                  <p className="text-muted">No activities recorded yet. When seekers visit, pray, or give, events appear here.</p>
                </div>
              ) : (
                <div className="activity-timeline">
                  {activities.map((act) => (
                    <div key={act.id} className="timeline-item">
                      <div className={`timeline-dot dot-${act.type}`}>
                        {act.type === 'prayer' && <Heart size={14} />}
                        {act.type === 'donation' && <HeartHandshake size={14} />}
                        {act.type === 'video' && <Video size={14} />}
                        {act.type === 'audio' && <Music size={14} />}
                        {act.type === 'book' && <BookOpen size={14} />}
                        {act.type === 'daily_word' && <Sparkles size={14} />}
                      </div>
                      <div className="timeline-body">
                        <div className="timeline-top">
                          <span className="timeline-title font-serif">{act.title}</span>
                          <span className="timeline-time text-xs text-muted">
                            <Clock size={12} className="inline-icon mr-1" />
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(act.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="timeline-desc text-sm">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VIDEOS MANAGEMENT                                  */}
        {/* ========================================================= */}
        {activeTab === 'videos' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Video Sermons & Livestreams</h2>
                <p className="text-muted text-sm">
                  Publish Sunday services, prayer nights, and study notes for the global congregation.
                </p>
              </div>
              <button 
                className="btn btn-gold btn-sm"
                onClick={() => setShowVideoModal(true)}
              >
                <Plus size={16} />
                <span>Post New Sermon Video</span>
              </button>
            </div>

            <div className="admin-card-grid">
              {videos.map((vid) => (
                <div key={vid.id} className="admin-content-card glass-card">
                  <div className="card-thumb-wrap">
                    <img src={vid.thumbnail} alt={vid.title} className="card-thumb-img" />
                    <span className="card-duration-badge">{vid.duration}</span>
                  </div>
                  <div className="admin-content-body">
                    <span className="card-series-tag">{vid.speaker || 'Rev. Tresh'}</span>
                    <h3 className="card-item-title font-serif">{vid.title}</h3>
                    <p className="card-item-desc text-sm text-muted">{vid.description}</p>
                    <div className="card-topics-row">
                      {vid.topics && vid.topics.map((t, idx) => (
                        <span key={idx} className="topic-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="admin-card-actions">
                    <button 
                      className="card-action-btn delete-btn"
                      onClick={() => {
                        if (confirm(`Remove sermon "${vid.title}"?`)) {
                          deleteVideo(vid.id);
                        }
                      }}
                      title="Delete video"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BOOKS MANAGEMENT                                   */}
        {/* ========================================================= */}
        {activeTab === 'books' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Bookshelf & Digital Devotionals</h2>
                <p className="text-muted text-sm">
                  Add new books, update pricing, and edit in-browser sample reading chapters.
                </p>
              </div>
              <button 
                className="btn btn-gold btn-sm"
                onClick={() => setShowBookModal(true)}
              >
                <Plus size={16} />
                <span>Publish New Book</span>
              </button>
            </div>

            <div className="admin-card-grid">
              {books.map((bk) => (
                <div key={bk.id} className="admin-content-card book-admin-card glass-card">
                  <div className="book-thumb-col">
                    <img src={bk.coverImage} alt={bk.title} className="book-cover-img" />
                  </div>
                  <div className="admin-content-body">
                    <span className="card-series-tag">{bk.status || 'Available'}</span>
                    <h3 className="card-item-title font-serif">{bk.title}</h3>
                    <p className="book-subtitle text-xs text-muted mb-2">{bk.subtitle}</p>
                    <div className="book-pricing-row">
                      <span className="price-tag">₦{bk.priceNGN?.toLocaleString()}</span>
                      <span className="price-usd">${bk.priceUSD} USD</span>
                    </div>
                    <p className="card-item-desc text-sm text-muted mt-2">
                      {bk.synopsis ? bk.synopsis.slice(0, 110) + '...' : ''}
                    </p>
                    {bk.sampleChapter && (
                      <span className="sample-available-badge">
                        <Check size={12} className="inline-icon mr-1" />
                        Sample Chapter: {bk.sampleChapter.title}
                      </span>
                    )}
                  </div>
                  <div className="admin-card-actions">
                    <button 
                      className="card-action-btn delete-btn"
                      onClick={() => {
                        if (confirm(`Remove book "${bk.title}"?`)) {
                          deleteBook(bk.id);
                        }
                      }}
                      title="Delete book"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AUDIO TEACHINGS MANAGEMENT                         */}
        {/* ========================================================= */}
        {activeTab === 'audio' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Audio Sermons & Ambient Soaking</h2>
                <p className="text-muted text-sm">
                  Upload audio teachings and companion recordings for the persistent sanctuary player.
                </p>
              </div>
              <button 
                className="btn btn-gold btn-sm"
                onClick={() => setShowAudioModal(true)}
              >
                <Plus size={16} />
                <span>Add Audio Sermon</span>
              </button>
            </div>

            <div className="admin-table-card glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title & Series</th>
                    <th>Speaker</th>
                    <th>Duration</th>
                    <th>Scripture</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {audioTeachings.map((aud) => (
                    <tr key={aud.id}>
                      <td>
                        <div className="table-item-title font-serif">{aud.title}</div>
                        <span className="text-xs text-muted">{aud.series}</span>
                      </td>
                      <td>{aud.speaker || 'Rev. Tresh'}</td>
                      <td>{aud.duration}</td>
                      <td>
                        <span className="scripture-pill">{aud.scripture || 'Scripture'}</span>
                      </td>
                      <td className="text-right">
                        <button 
                          className="table-action-btn delete-btn"
                          onClick={() => {
                            if (confirm(`Delete audio "${aud.title}"?`)) {
                              deleteAudio(aud.id);
                            }
                          }}
                          title="Delete audio"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PRAYER & PASTORAL CARE                             */}
        {/* ========================================================= */}
        {activeTab === 'prayers' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Seeker Prayer Needs & Intercession</h2>
                <p className="text-muted text-sm">
                  Confidential prayer requests submitted by seekers. Review needs, record pastoral notes, and mark as interceded.
                </p>
              </div>
              <div className="prayer-filters-bar">
                <button 
                  className={`filter-btn ${prayerFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setPrayerFilter('all')}
                >
                  All ({prayers.length})
                </button>
                <button 
                  className={`filter-btn ${prayerFilter === 'needs_prayer' ? 'active' : ''}`}
                  onClick={() => setPrayerFilter('needs_prayer')}
                >
                  Awaiting ({prayers.filter(p => p.status === 'needs_prayer').length})
                </button>
                <button 
                  className={`filter-btn ${prayerFilter === 'interceding' ? 'active' : ''}`}
                  onClick={() => setPrayerFilter('interceding')}
                >
                  In Intercession ({prayers.filter(p => p.status === 'interceding').length})
                </button>
                <button 
                  className={`filter-btn ${prayerFilter === 'answered' ? 'active' : ''}`}
                  onClick={() => setPrayerFilter('answered')}
                >
                  Answered ({prayers.filter(p => p.status === 'answered').length})
                </button>
              </div>
            </div>

            <div className="prayer-requests-list">
              {filteredPrayers.length === 0 ? (
                <div className="glass-card text-center py-5">
                  <p className="text-muted">No prayer requests matching filter.</p>
                </div>
              ) : (
                filteredPrayers.map((pr) => (
                  <div key={pr.id} className="prayer-admin-card glass-card mb-3">
                    <div className="prayer-card-header">
                      <div className="prayer-seeker-info">
                        <span className="tracking-code-pill">{pr.trackingCode}</span>
                        <h4 className="seeker-name font-serif">{pr.name}</h4>
                        <span className="seeker-contact text-xs text-muted">
                          {pr.email} {pr.phone ? `· ${pr.phone}` : ''}
                        </span>
                      </div>
                      <div className="prayer-card-status">
                        <span className={`status-pill status-${pr.status}`}>
                          {pr.status === 'needs_prayer' && 'Awaiting Prayer'}
                          {pr.status === 'interceding' && 'In Intercession'}
                          {pr.status === 'answered' && 'Answered Praise'}
                        </span>
                        <span className="submission-date text-xs text-muted mt-1">
                          {new Date(pr.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="prayer-category-row mt-2">
                      <span className="category-pill">{pr.category}</span>
                      {pr.urgency === 'high' && (
                        <span className="urgent-pill">Urgent Intercession</span>
                      )}
                    </div>

                    <p className="prayer-message-body mt-2">
                      "{pr.message}"
                    </p>

                    {pr.pastorNotes && (
                      <div className="pastor-notes-box mt-2">
                        <strong>Rev. Tresh's Note:</strong> {pr.pastorNotes}
                      </div>
                    )}

                    <div className="prayer-actions-footer mt-3">
                      <div className="status-change-buttons">
                        <button 
                          className={`btn-sm btn-status ${pr.status === 'needs_prayer' ? 'active-status' : ''}`}
                          onClick={() => handleSavePrayerNote(pr.id, 'needs_prayer')}
                        >
                          Mark Awaiting
                        </button>
                        <button 
                          className={`btn-sm btn-status ${pr.status === 'interceding' ? 'active-status' : ''}`}
                          onClick={() => handleSavePrayerNote(pr.id, 'interceding')}
                        >
                          Mark Interceding
                        </button>
                        <button 
                          className={`btn-sm btn-status ${pr.status === 'answered' ? 'active-status' : ''}`}
                          onClick={() => handleSavePrayerNote(pr.id, 'answered')}
                        >
                          Mark Answered
                        </button>
                      </div>

                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setSelectedPrayer(pr);
                          setPastorNoteInput(pr.pastorNotes || '');
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Pastoral Note</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: GIVING & SEEDS SOWN LOG                            */}
        {/* ========================================================= */}
        {activeTab === 'giving' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Giving & Seeds Sown Records</h2>
                <p className="text-muted text-sm">
                  Complete record of contributions for books outreach, sanctuary media, and pastoral care.
                </p>
              </div>
              <button 
                className="btn btn-gold btn-sm"
                onClick={handleExportDonations}
              >
                <Download size={14} />
                <span>Export CSV for Accounts</span>
              </button>
            </div>

            <div className="admin-table-card glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Date</th>
                    <th>Donor</th>
                    <th>Designated Fund</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <span className="receipt-mono font-mono">{d.receiptCode}</span>
                      </td>
                      <td className="text-sm text-muted">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="donor-name-cell font-serif">{d.donorName}</div>
                        {d.email && <span className="text-xs text-muted">{d.email}</span>}
                      </td>
                      <td>
                        <span className="fund-tag">{d.fund}</span>
                      </td>
                      <td>
                        <span className="amount-cell font-serif font-bold">
                          {d.currency === 'USD' ? '$' : d.currency === 'GBP' ? '£' : d.currency === 'EUR' ? '€' : '₦'}
                          {d.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-xs text-muted">{d.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: DAILY WORD / MARQUEE                               */}
        {/* ========================================================= */}
        {activeTab === 'daily_word' && (
          <div className="admin-tab-pane animate-fade-in">
            <div className="pane-header-row mb-3">
              <div>
                <h2 className="pane-title font-serif">Daily Sanctuary Scripture Ticker</h2>
                <p className="text-muted text-sm">
                  Update the sacred scripture verse that scrolls across the top banner of the entire sanctuary site.
                </p>
              </div>
            </div>

            <div className="glass-card p-4 max-w-2xl">
              <form onSubmit={handleSaveDailyWord}>
                <div className="form-group mb-3">
                  <label htmlFor="daily-verse-input">Scripture Verse Text</label>
                  <textarea
                    id="daily-verse-input"
                    rows={4}
                    value={editingWord.verse}
                    onChange={(e) => setEditingWord({ ...editingWord, verse: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="daily-ref-input">Scripture Reference</label>
                  <input
                    id="daily-ref-input"
                    type="text"
                    value={editingWord.reference}
                    onChange={(e) => setEditingWord({ ...editingWord, reference: e.target.value })}
                    required
                  />
                </div>

                <div className="ticker-preview-box mb-3 p-3">
                  <span className="text-xs uppercase text-gold font-bold">Live Preview:</span>
                  <p className="ticker-preview-text font-serif mt-1">
                    "{editingWord.verse}" — <strong>{editingWord.reference}</strong>
                  </p>
                </div>

                <button type="submit" className="btn btn-gold">
                  <Check size={16} />
                  <span>Update Live Sanctuary Ticker</span>
                </button>

                {wordSaved && (
                  <span className="ml-3 text-sm text-green animate-fade-in">
                    ✓ Daily Word updated across the entire site!
                  </span>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: POST NEW VIDEO SERMON                             */}
      {/* ========================================================= */}
      {showVideoModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowVideoModal(false)}>
          <div className="modal-card admin-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-serif">Post New Sermon Video</h3>
              <button className="modal-close-btn" onClick={() => setShowVideoModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateVideo} className="p-4">
              <div className="form-group mb-3">
                <label>Sermon Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Entering into Divine Stillness"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row mb-3">
                <div className="form-group flex-1">
                  <label>Series / Category</label>
                  <input
                    type="text"
                    value={newVideo.series}
                    onChange={(e) => setNewVideo({ ...newVideo, series: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 52 min"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>YouTube / Video URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideo.videoUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Thumbnail Image URL</label>
                <input
                  type="text"
                  value={newVideo.thumbnail}
                  onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Key Scripture Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Psalm 46:10; Hebrews 4:9"
                  value={newVideo.scripture}
                  onChange={(e) => setNewVideo({ ...newVideo, scripture: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Sermon Description & Pastoral Summary</label>
                <textarea
                  rows={3}
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label>Topics (comma separated)</label>
                <input
                  type="text"
                  value={newVideo.topics}
                  onChange={(e) => setNewVideo({ ...newVideo, topics: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold w-full">
                <span>Publish Video to Sanctuary</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PUBLISH NEW BOOK                                  */}
      {/* ========================================================= */}
      {showBookModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowBookModal(false)}>
          <div className="modal-card admin-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-serif">Publish New Sanctuary Book</h3>
              <button className="modal-close-btn" onClick={() => setShowBookModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateBook} className="p-4">
              <div className="form-group mb-3">
                <label>Book Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Rivers of Stillness"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Spiritual Contemplations for Weary Hearts"
                  value={newBook.subtitle}
                  onChange={(e) => setNewBook({ ...newBook, subtitle: e.target.value })}
                />
              </div>

              <div className="form-row mb-3">
                <div className="form-group flex-1">
                  <label>Price in Naira (₦)</label>
                  <input
                    type="number"
                    value={newBook.priceNGN}
                    onChange={(e) => setNewBook({ ...newBook, priceNGN: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Price in USD ($)</label>
                  <input
                    type="number"
                    value={newBook.priceUSD}
                    onChange={(e) => setNewBook({ ...newBook, priceUSD: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Cover Image URL</label>
                <input
                  type="text"
                  value={newBook.coverImage}
                  onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Book Synopsis</label>
                <textarea
                  rows={2}
                  placeholder="Overview of the devotional..."
                  value={newBook.synopsis}
                  onChange={(e) => setNewBook({ ...newBook, synopsis: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Sample Chapter Title</label>
                <input
                  type="text"
                  value={newBook.sampleTitle}
                  onChange={(e) => setNewBook({ ...newBook, sampleTitle: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label>Sample Reading Excerpt (for In-Browser Reader)</label>
                <textarea
                  rows={4}
                  placeholder="Paste excerpt paragraphs separated by blank lines..."
                  value={newBook.sampleText}
                  onChange={(e) => setNewBook({ ...newBook, sampleText: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold w-full">
                <span>Add Book to Bookshelf</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD AUDIO SERMON                                  */}
      {/* ========================================================= */}
      {showAudioModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAudioModal(false)}>
          <div className="modal-card admin-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-serif">Add Audio Message</h3>
              <button className="modal-close-btn" onClick={() => setShowAudioModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateAudio} className="p-4">
              <div className="form-group mb-3">
                <label>Message Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Walking in Quiet Grace"
                  value={newAudio.title}
                  onChange={(e) => setNewAudio({ ...newAudio, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row mb-3">
                <div className="form-group flex-1">
                  <label>Series</label>
                  <input
                    type="text"
                    value={newAudio.series}
                    onChange={(e) => setNewAudio({ ...newAudio, series: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={newAudio.duration}
                    onChange={(e) => setNewAudio({ ...newAudio, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Scripture Reference</label>
                <input
                  type="text"
                  value={newAudio.scripture}
                  onChange={(e) => setNewAudio({ ...newAudio, scripture: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={newAudio.description}
                  onChange={(e) => setNewAudio({ ...newAudio, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold w-full">
                <span>Add Audio to Sanctuary</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: PASTOR INTERCESSION NOTE MODAL                    */}
      {/* ========================================================= */}
      {selectedPrayer && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedPrayer(null)}>
          <div className="modal-card admin-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-serif">Pastoral Intercession Note</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPrayer(null)}>✕</button>
            </div>
            <div className="p-4">
              <div className="prayer-summary-box mb-3 p-3">
                <span className="text-xs text-gold uppercase font-bold">{selectedPrayer.trackingCode}</span>
                <h4 className="font-serif mt-1">{selectedPrayer.name}</h4>
                <p className="text-sm text-muted mt-1">"{selectedPrayer.message}"</p>
              </div>

              <div className="form-group mb-3">
                <label>Confidential Pastoral Note (Visible to Rev. Tresh)</label>
                <textarea
                  rows={4}
                  placeholder="Record scripture given, date prayed for, or counseling follow-up..."
                  value={pastorNoteInput}
                  onChange={(e) => setPastorNoteInput(e.target.value)}
                />
              </div>

              <div className="status-selection-row mb-4">
                <label className="block text-xs uppercase mb-1">Update Status:</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    className={`btn-sm btn-status ${selectedPrayer.status === 'needs_prayer' ? 'active-status' : ''}`}
                    onClick={() => handleSavePrayerNote(selectedPrayer.id, 'needs_prayer')}
                  >
                    Awaiting
                  </button>
                  <button 
                    type="button"
                    className={`btn-sm btn-status ${selectedPrayer.status === 'interceding' ? 'active-status' : ''}`}
                    onClick={() => handleSavePrayerNote(selectedPrayer.id, 'interceding')}
                  >
                    In Intercession
                  </button>
                  <button 
                    type="button"
                    className={`btn-sm btn-status ${selectedPrayer.status === 'answered' ? 'active-status' : ''}`}
                    onClick={() => handleSavePrayerNote(selectedPrayer.id, 'answered')}
                  >
                    Answered
                  </button>
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-gold w-full"
                onClick={() => {
                  handleSavePrayerNote(selectedPrayer.id, selectedPrayer.status);
                  setSelectedPrayer(null);
                }}
              >
                <span>Save Pastoral Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
