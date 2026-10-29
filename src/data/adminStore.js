import { useState, useEffect } from 'react';
import { ministryData } from './ministryData';

// Storage keys
const STORAGE_KEYS = {
  BOOKS: 'altar_admin_books',
  VIDEOS: 'altar_admin_videos',
  AUDIO: 'altar_admin_audio',
  DAILY_WORD: 'altar_admin_daily_word',
  PRAYERS: 'altar_admin_prayers',
  DONATIONS: 'altar_admin_donations',
  ACTIVITIES: 'altar_admin_activities',
  AUTH: 'altar_pastor_auth'
};

// Initial Mock Activity Feed & Inquiries to showcase Pastor Dashboard immediately
const INITIAL_PRAYERS = [
  {
    id: 'pr-101',
    trackingCode: 'ALTAR-98214',
    name: 'Brother Babatunde A.',
    email: 'babatunde@example.com',
    phone: '+234 803 123 4567',
    category: 'Spiritual Direction & Calling',
    urgency: 'high',
    message: 'Seeking God\'s clear direction regarding a career relocation and church planting effort in Ibadan. Need Rev. Tresh to pray with me for clarity.',
    status: 'needs_prayer',
    pastorNotes: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'pr-102',
    trackingCode: 'ALTAR-77412',
    name: 'Sister Folashade M.',
    email: 'folashade@example.com',
    phone: '+234 809 887 6543',
    category: 'Emotional Solace & Healing',
    urgency: 'standard',
    message: 'Lost my mother two months ago. Walking through deep grief and praying for supernatural peace in our family.',
    status: 'interceding',
    pastorNotes: 'Prayed during morning altar vigil. Sending comfort devotionals.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 'pr-103',
    trackingCode: 'ALTAR-33981',
    name: 'Grace O. (Anonymous)',
    email: 'grace@example.com',
    phone: '',
    category: 'Family Peace & Reconciliation',
    urgency: 'standard',
    message: 'Reconciliation with my estranged brother before our father\'s anniversary.',
    status: 'answered',
    pastorNotes: 'Grace confirmed reconciliation on Wednesday! Praise God.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString()
  }
];

const INITIAL_DONATIONS = [
  {
    id: 'don-501',
    receiptCode: 'ALTAR-GIV-9982',
    donorName: 'Elder Kunle Adeyemi',
    email: 'kunle.a@example.com',
    fund: 'The Altar Book Outreach Fund',
    amount: 50000,
    currency: 'NGN',
    paymentMethod: 'Direct Bank Transfer (Access Bank)',
    note: 'In honor of our 25th wedding anniversary.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    id: 'don-502',
    receiptCode: 'ALTAR-GIV-9975',
    donorName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    fund: 'Quiet Waters Sanctuary & Media Fund',
    amount: 150,
    currency: 'USD',
    paymentMethod: 'International Domiciliary Transfer',
    note: 'Thank you for the podcast teachings.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: 'don-503',
    receiptCode: 'ALTAR-GIV-9960',
    donorName: 'Anonymous Seeker',
    email: '',
    fund: 'Pastoral Care & Youth Assistance',
    amount: 100,
    currency: 'GBP',
    paymentMethod: 'UK FPS Transfer (Barclays)',
    note: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'prayer',
    title: 'New Prayer Request',
    description: 'Brother Babatunde A. requested prayer: Spiritual Direction & Calling',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'act-2',
    type: 'donation',
    title: 'Seed Sown: ₦50,000',
    description: 'Elder Kunle Adeyemi sowed for The Altar Book Outreach Fund',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    id: 'act-3',
    type: 'audio',
    title: 'Audio Sermon Streamed',
    description: 'Seeker listened to "The Altar of Rest" (Foundational Teachings)',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
  {
    id: 'act-4',
    type: 'book',
    title: 'Sample Chapter Read',
    description: 'Reader completed Chapter 1 of "The Defining Path"',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];

// In-Memory store with local storage sync and listeners
class SanctuaryAdminStore {
  constructor() {
    this.listeners = new Set();
    this.books = this.load(STORAGE_KEYS.BOOKS, ministryData.books);
    this.videos = this.load(STORAGE_KEYS.VIDEOS, ministryData.videos);
    this.audioTeachings = this.load(STORAGE_KEYS.AUDIO, ministryData.audioTeachings);
    this.dailyScripture = this.load(STORAGE_KEYS.DAILY_WORD, {
      verse: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
      reference: "Psalm 46:10",
      theme: "Peace"
    });
    this.prayers = this.load(STORAGE_KEYS.PRAYERS, INITIAL_PRAYERS);
    this.donations = this.load(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
    this.activities = this.load(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  }

  notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // -------------------------------------------------------------
  // Activities Logger
  // -------------------------------------------------------------
  logActivity(type, title, description) {
    const activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString()
    };
    this.activities = [activity, ...this.activities.slice(0, 49)];
    this.save(STORAGE_KEYS.ACTIVITIES, this.activities);
    this.notify();
  }

  // -------------------------------------------------------------
  // Videos Management (Pastor Sermons & Livestreams)
  // -------------------------------------------------------------
  getVideos() {
    return this.videos;
  }

  addVideo(videoData) {
    const id = videoData.id || `video-${Date.now()}`;
    const newVideo = {
      id,
      title: videoData.title,
      speaker: videoData.speaker || 'Rev. Tresh',
      duration: videoData.duration || '35 min',
      thumbnail: videoData.thumbnail || '/images/video-service.jpg',
      videoUrl: videoData.videoUrl || '',
      description: videoData.description || '',
      topics: videoData.topics || ['Stillness', 'Faith'],
      takeaways: videoData.takeaways || [],
      reflectionQuestions: videoData.reflectionQuestions || [],
      createdAt: new Date().toISOString()
    };
    this.videos = [newVideo, ...this.videos];
    this.save(STORAGE_KEYS.VIDEOS, this.videos);
    this.logActivity('video', 'New Video Published', `Rev. Tresh published: "${newVideo.title}"`);
    this.notify();
    return newVideo;
  }

  updateVideo(id, updatedFields) {
    this.videos = this.videos.map(v => v.id === id ? { ...v, ...updatedFields } : v);
    this.save(STORAGE_KEYS.VIDEOS, this.videos);
    this.notify();
  }

  deleteVideo(id) {
    const found = this.videos.find(v => v.id === id);
    this.videos = this.videos.filter(v => v.id !== id);
    this.save(STORAGE_KEYS.VIDEOS, this.videos);
    if (found) {
      this.logActivity('video', 'Video Removed', `Removed video: "${found.title}"`);
    }
    this.notify();
  }

  // -------------------------------------------------------------
  // Books Management (Publish & Edit Books)
  // -------------------------------------------------------------
  getBooks() {
    return this.books;
  }

  addBook(bookData) {
    const id = bookData.id || `book-${Date.now()}`;
    const newBook = {
      id,
      title: bookData.title,
      subtitle: bookData.subtitle || 'A Sanctuary Publication',
      author: bookData.author || 'Rev. Tresh',
      priceUSD: Number(bookData.priceUSD) || 12.00,
      priceNGN: Number(bookData.priceNGN) || 6000,
      coverImage: bookData.coverImage || '/images/book-defining-path.jpg',
      status: bookData.status || 'Available Now',
      rating: 5.0,
      reviewsCount: 1,
      pages: Number(bookData.pages) || 200,
      formats: bookData.formats || ['Paperback', 'EPUB', 'PDF'],
      synopsis: bookData.synopsis || '',
      sampleChapter: bookData.sampleChapter || {
        title: 'Chapter 1: The Altar of Quiet Rest',
        epigraph: '“Rest is not the absence of labor, but the presence of peace.”',
        paragraphs: [
          'Stillness begins the moment you cease negotiating with God\'s peace. In quiet company, the heart finds its true compass.'
        ]
      },
      createdAt: new Date().toISOString()
    };
    this.books = [newBook, ...this.books];
    this.save(STORAGE_KEYS.BOOKS, this.books);
    this.logActivity('book', 'New Book Published', `Rev. Tresh added book: "${newBook.title}"`);
    this.notify();
    return newBook;
  }

  updateBook(id, updatedFields) {
    this.books = this.books.map(b => b.id === id ? { ...b, ...updatedFields } : b);
    this.save(STORAGE_KEYS.BOOKS, this.books);
    this.notify();
  }

  deleteBook(id) {
    const found = this.books.find(b => b.id === id);
    this.books = this.books.filter(b => b.id !== id);
    this.save(STORAGE_KEYS.BOOKS, this.books);
    if (found) {
      this.logActivity('book', 'Book Removed', `Removed book: "${found.title}"`);
    }
    this.notify();
  }

  // -------------------------------------------------------------
  // Audio Teachings Management
  // -------------------------------------------------------------
  getAudio() {
    return this.audioTeachings;
  }

  addAudio(audioData) {
    const id = audioData.id || `audio-${Date.now()}`;
    const newAudio = {
      id,
      title: audioData.title,
      series: audioData.series || 'Sanctuary Teachings',
      speaker: audioData.speaker || 'Rev. Tresh',
      duration: audioData.duration || '30 min',
      durationSec: Number(audioData.durationSec) || 1800,
      scripture: audioData.scripture || 'Psalm 23',
      description: audioData.description || '',
      audioUrl: audioData.audioUrl || 'ambient_rest',
      createdAt: new Date().toISOString()
    };
    this.audioTeachings = [newAudio, ...this.audioTeachings];
    this.save(STORAGE_KEYS.AUDIO, this.audioTeachings);
    this.logActivity('audio', 'Audio Teaching Uploaded', `Rev. Tresh uploaded: "${newAudio.title}"`);
    this.notify();
    return newAudio;
  }

  updateAudio(id, updatedFields) {
    this.audioTeachings = this.audioTeachings.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    this.save(STORAGE_KEYS.AUDIO, this.audioTeachings);
    this.notify();
  }

  deleteAudio(id) {
    const found = this.audioTeachings.find(a => a.id === id);
    this.audioTeachings = this.audioTeachings.filter(a => a.id !== id);
    this.save(STORAGE_KEYS.AUDIO, this.audioTeachings);
    if (found) {
      this.logActivity('audio', 'Audio Removed', `Removed message: "${found.title}"`);
    }
    this.notify();
  }

  // -------------------------------------------------------------
  // Daily Word / Ticker Scripture
  // -------------------------------------------------------------
  getDailyScripture() {
    return this.dailyScripture;
  }

  updateDailyScripture(verseObj) {
    this.dailyScripture = {
      verse: verseObj.verse || this.dailyScripture.verse,
      reference: verseObj.reference || this.dailyScripture.reference,
      theme: verseObj.theme || 'Stillness'
    };
    this.save(STORAGE_KEYS.DAILY_WORD, this.dailyScripture);
    this.logActivity('daily_word', 'Sanctuary Word Updated', `New Scripture ticker: ${this.dailyScripture.reference}`);
    this.notify();
  }

  // -------------------------------------------------------------
  // Prayer & Pastoral Care Requests
  // -------------------------------------------------------------
  getPrayers() {
    return this.prayers;
  }

  addPrayerRequest(prayer) {
    const trackingCode = `ALTAR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPrayer = {
      id: `pr-${Date.now()}`,
      trackingCode,
      name: prayer.name || 'Anonymous Seeker',
      email: prayer.email || '',
      phone: prayer.phone || '',
      category: prayer.category || 'Spiritual Direction',
      urgency: prayer.urgency || 'standard',
      message: prayer.message || '',
      status: 'needs_prayer',
      pastorNotes: '',
      createdAt: new Date().toISOString()
    };
    this.prayers = [newPrayer, ...this.prayers];
    this.save(STORAGE_KEYS.PRAYERS, this.prayers);
    this.logActivity('prayer', 'New Prayer Need Submitted', `${newPrayer.name} requested prayer (${newPrayer.category})`);
    this.notify();
    return newPrayer;
  }

  updatePrayerStatus(id, status, notes = '') {
    this.prayers = this.prayers.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: status || p.status,
          pastorNotes: notes !== undefined ? notes : p.pastorNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    this.save(STORAGE_KEYS.PRAYERS, this.prayers);
    this.notify();
  }

  // -------------------------------------------------------------
  // Giving & Seed Sown Records
  // -------------------------------------------------------------
  getDonations() {
    return this.donations;
  }

  recordDonation(donation) {
    const receiptCode = `ALTAR-GIV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation = {
      id: `don-${Date.now()}`,
      receiptCode,
      donorName: donation.donorName || 'Anonymous Seeker',
      email: donation.email || '',
      fund: donation.fund || 'General Ministry & Altar Fund',
      amount: Number(donation.amount) || 0,
      currency: donation.currency || 'NGN',
      paymentMethod: donation.paymentMethod || 'Direct Bank Transfer',
      note: donation.note || '',
      createdAt: new Date().toISOString()
    };
    this.donations = [newDonation, ...this.donations];
    this.save(STORAGE_KEYS.DONATIONS, this.donations);
    
    const currSymbol = donation.currency === 'USD' ? '$' : donation.currency === 'GBP' ? '£' : donation.currency === 'EUR' ? '€' : '₦';
    this.logActivity('donation', `Seed Sown: ${currSymbol}${newDonation.amount.toLocaleString()}`, `${newDonation.donorName} gave to ${newDonation.fund}`);
    this.notify();
    return newDonation;
  }

  // -------------------------------------------------------------
  // Aggregated Pastoral Metrics
  // -------------------------------------------------------------
  getStats() {
    const totalDonations = {
      NGN: this.donations.filter(d => d.currency === 'NGN').reduce((sum, d) => sum + d.amount, 0),
      USD: this.donations.filter(d => d.currency === 'USD').reduce((sum, d) => sum + d.amount, 0),
      GBP: this.donations.filter(d => d.currency === 'GBP').reduce((sum, d) => sum + d.amount, 0),
      EUR: this.donations.filter(d => d.currency === 'EUR').reduce((sum, d) => sum + d.amount, 0),
    };

    const needsPrayerCount = this.prayers.filter(p => p.status === 'needs_prayer').length;
    const intercedingCount = this.prayers.filter(p => p.status === 'interceding').length;
    const answeredCount = this.prayers.filter(p => p.status === 'answered').length;

    return {
      totalDonations,
      donationsCount: this.donations.length,
      prayersCount: this.prayers.length,
      needsPrayerCount,
      intercedingCount,
      answeredCount,
      booksCount: this.books.length,
      videosCount: this.videos.length,
      audioCount: this.audioTeachings.length,
      activitiesCount: this.activities.length
    };
  }

  // -------------------------------------------------------------
  // Pastor Authentication Gate
  // -------------------------------------------------------------
  isPastorAuthenticated() {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'authorized';
    } catch {
      return false;
    }
  }

  authenticatePastor(key) {
    // Default master sanctuary key or custom key
    if (key.trim().toLowerCase() === 'altar777' || key.trim() === 'revtresh') {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'authorized');
      return true;
    }
    return false;
  }

  logoutPastor() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    this.notify();
  }
}

// Singleton instance
export const adminStore = new SanctuaryAdminStore();

// React Hook for dynamic reactive re-renders
export function useSanctuaryAdmin() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    books: adminStore.getBooks(),
    videos: adminStore.getVideos(),
    audioTeachings: adminStore.getAudio(),
    dailyScripture: adminStore.getDailyScripture(),
    prayers: adminStore.getPrayers(),
    donations: adminStore.getDonations(),
    activities: adminStore.activities,
    stats: adminStore.getStats(),
    isPastorAuthenticated: adminStore.isPastorAuthenticated(),

    // Actions
    addVideo: (data) => adminStore.addVideo(data),
    updateVideo: (id, data) => adminStore.updateVideo(id, data),
    deleteVideo: (id) => adminStore.deleteVideo(id),

    addBook: (data) => adminStore.addBook(data),
    updateBook: (id, data) => adminStore.updateBook(id, data),
    deleteBook: (id) => adminStore.deleteBook(id),

    addAudio: (data) => adminStore.addAudio(data),
    updateAudio: (id, data) => adminStore.updateAudio(id, data),
    deleteAudio: (id) => adminStore.deleteAudio(id),

    updateDailyScripture: (data) => adminStore.updateDailyScripture(data),
    addPrayerRequest: (data) => adminStore.addPrayerRequest(data),
    updatePrayerStatus: (id, status, notes) => adminStore.updatePrayerStatus(id, status, notes),
    recordDonation: (data) => adminStore.recordDonation(data),
    logActivity: (type, title, desc) => adminStore.logActivity(type, title, desc),

    authenticatePastor: (key) => adminStore.authenticatePastor(key),
    logoutPastor: () => adminStore.logoutPastor()
  };
}
