import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';
import SampleReaderModal from './components/SampleReaderModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import GivingModal from './components/GivingModal';
import SearchModal from './components/SearchModal';
import MyAccountModal from './components/MyAccountModal';
import PwaInstallPrompt from './components/PwaInstallPrompt';

import HomeView from './views/HomeView';
import BooksView from './views/BooksView';
import AudioView from './views/AudioView';
import VideosView from './views/VideosView';
import GiveView from './views/GiveView';
import PrayerCareView from './views/PrayerCareView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import AdminDashboardView from './views/AdminDashboardView';

import { ministryData } from './data/ministryData';
import { useSanctuaryAdmin } from './data/adminStore';

export default function App() {
  // Sanctuary Reactive Admin Data Store (Videos, Books, Audios, Prayers, Daily Word)
  const { 
    books, 
    videos, 
    audioTeachings, 
    dailyScripture,
    isPastorAuthenticated 
  } = useSanctuaryAdmin();

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('altar_theme') || 'light';
  });

  // Currency state
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('altar_currency') || 'NGN';
  });

  // Navigation page state
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Persistent Audio Player state
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Modal states
  const [readerBook, setReaderBook] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const [givingModalOpen, setGivingModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Sync theme to root DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('altar_theme', theme);
  }, [theme]);

  // Sync currency
  useEffect(() => {
    localStorage.setItem('altar_currency', currency);
  }, [currency]);

  // Sync URL hash with activePage
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'books', 'audio', 'videos', 'give', 'prayer', 'about', 'contact', 'admin'].includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="sanctuary-app">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        toggleTheme={toggleTheme}
        dailyScripture={dailyScripture}
        openGivingModal={() => setGivingModalOpen(true)}
        openSearchModal={() => setSearchModalOpen(true)}
        openAccountModal={() => setAccountModalOpen(true)}
      />

      {/* Main View Router */}
      <main id="main-content" className="main-content-flow">
        {activePage === 'home' && (
          <HomeView
            setActivePage={handleNavigate}
            openReaderModal={(book) => setReaderBook(book)}
            openGivingModal={() => setGivingModalOpen(true)}
            setActiveAudio={setActiveAudio}
            currency={currency}
            books={books}
            videos={videos}
            audioTeachings={audioTeachings}
            dailyScripture={dailyScripture}
          />
        )}

        {activePage === 'books' && (
          <BooksView
            openReaderModal={(book) => setReaderBook(book)}
            openGivingModal={() => setGivingModalOpen(true)}
            currency={currency}
            books={books}
          />
        )}

        {activePage === 'audio' && (
          <AudioView
            activeAudio={activeAudio}
            setActiveAudio={setActiveAudio}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            audioTeachings={audioTeachings}
          />
        )}

        {activePage === 'videos' && (
          <VideosView
            openVideoModal={(video) => setVideoModal(video)}
            videos={videos}
          />
        )}

        {activePage === 'give' && (
          <GiveView
            openGivingModal={() => setGivingModalOpen(true)}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}

        {activePage === 'prayer' && (
          <PrayerCareView />
        )}

        {activePage === 'about' && (
          <AboutView
            setActivePage={handleNavigate}
            openGivingModal={() => setGivingModalOpen(true)}
          />
        )}

        {activePage === 'contact' && (
          <ContactView />
        )}

        {activePage === 'admin' && (
          <AdminDashboardView
            setActivePage={handleNavigate}
          />
        )}
      </main>

      {/* Persistent Audio Companion Dock */}
      <AudioPlayerBar
        activeAudio={activeAudio}
        setActiveAudio={setActiveAudio}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      {/* Footer */}
      <Footer
        setActivePage={handleNavigate}
        openGivingModal={() => setGivingModalOpen(true)}
        openAccountModal={() => setAccountModalOpen(true)}
      />

      {/* Modals */}
      {readerBook && (
        <SampleReaderModal
          book={readerBook}
          onClose={() => setReaderBook(null)}
          openGivingModal={() => setGivingModalOpen(true)}
          currency={currency}
        />
      )}

      {videoModal && (
        <VideoPlayerModal
          video={videoModal}
          onClose={() => setVideoModal(null)}
        />
      )}

      {givingModalOpen && (
        <GivingModal
          isOpen={givingModalOpen}
          onClose={() => setGivingModalOpen(false)}
          currency={currency}
          setCurrency={setCurrency}
        />
      )}

      {searchModalOpen && (
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          setActivePage={handleNavigate}
          openReaderModal={(book) => setReaderBook(book)}
          setActiveAudio={setActiveAudio}
          openVideoModal={(video) => setVideoModal(video)}
        />
      )}

      {accountModalOpen && (
        <MyAccountModal
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          openReaderModal={(book) => setReaderBook(book)}
          openGivingModal={() => setGivingModalOpen(true)}
        />
      )}

      {/* PWA In-App Install Prompt Banner */}
      <PwaInstallPrompt />
    </div>
  );
}
