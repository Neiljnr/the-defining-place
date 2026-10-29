import React, { useState } from 'react';
import { X, Search, BookOpen, Headphones, Video, Heart, ArrowRight } from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function SearchModal({ 
  isOpen, 
  onClose, 
  setActivePage, 
  openReaderModal, 
  setActiveAudio, 
  openVideoModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase().trim();

  const matchingBooks = ministryData.books.filter(b => 
    !term || b.title.toLowerCase().includes(term) || b.synopsis.toLowerCase().includes(term)
  );

  const matchingAudio = ministryData.audioTeachings.filter(a => 
    !term || a.title.toLowerCase().includes(term) || a.description.toLowerCase().includes(term) || a.scripture.toLowerCase().includes(term)
  );

  const matchingVideos = ministryData.videos.filter(v => 
    !term || v.title.toLowerCase().includes(term) || v.description.toLowerCase().includes(term)
  );

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-bar-header">
          <Search size={22} className="text-gold search-lead-icon" />
          <input
            type="text"
            autoFocus
            placeholder="Search books, audio teachings, scriptures, or prayer topics..."
            className="search-modal-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Results Container */}
        <div className="search-results-body">
          {/* Books */}
          {matchingBooks.length > 0 && (
            <div className="search-category-group">
              <span className="search-category-label">
                <BookOpen size={14} className="text-gold" />
                <span>Books & Devotionals ({matchingBooks.length})</span>
              </span>
              <div className="search-item-list">
                {matchingBooks.map((book) => (
                  <div 
                    key={book.id} 
                    className="search-item-row"
                    onClick={() => {
                      openReaderModal(book);
                      onClose();
                    }}
                  >
                    <img src={book.coverImage} alt={book.title} className="search-thumb" />
                    <div className="search-item-info">
                      <span className="search-item-title">{book.title}</span>
                      <span className="search-item-desc">{book.subtitle}</span>
                    </div>
                    <span className="search-item-action">Read Sample →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Messages */}
          {matchingAudio.length > 0 && (
            <div className="search-category-group">
              <span className="search-category-label">
                <Headphones size={14} className="text-teal" />
                <span>Audio Teachings ({matchingAudio.length})</span>
              </span>
              <div className="search-item-list">
                {matchingAudio.map((audio) => (
                  <div 
                    key={audio.id} 
                    className="search-item-row"
                    onClick={() => {
                      setActiveAudio(audio);
                      onClose();
                    }}
                  >
                    <div className="search-audio-badge">
                      <Headphones size={16} className="text-teal" />
                    </div>
                    <div className="search-item-info">
                      <span className="search-item-title">{audio.title}</span>
                      <span className="search-item-desc">{audio.speaker} · {audio.duration} · {audio.scripture}</span>
                    </div>
                    <span className="search-item-action">Listen Now →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {matchingVideos.length > 0 && (
            <div className="search-category-group">
              <span className="search-category-label">
                <Video size={14} className="text-gold" />
                <span>Video Gatherings ({matchingVideos.length})</span>
              </span>
              <div className="search-item-list">
                {matchingVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className="search-item-row"
                    onClick={() => {
                      openVideoModal(video);
                      onClose();
                    }}
                  >
                    <img src={video.thumbnail} alt={video.title} className="search-thumb video-thumb" />
                    <div className="search-item-info">
                      <span className="search-item-title">{video.title}</span>
                      <span className="search-item-desc">{video.duration}</span>
                    </div>
                    <span className="search-item-action">Watch →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingBooks.length === 0 && matchingAudio.length === 0 && matchingVideos.length === 0 && (
            <div className="no-search-results">
              <p>No resources found matching "{searchTerm}".</p>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
