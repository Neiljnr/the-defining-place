import React from 'react';
import { Play, Clock, User, Download, Share2, Sparkles, Video as VideoIcon } from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function VideosView({ openVideoModal }) {
  return (
    <div className="videos-view animate-fade-in">
      {/* Header */}
      <section className="page-header-banner">
        <div className="container text-center">
          <span className="eyebrow">Watch & Worship</span>
          <h1 className="page-title">Videos</h1>
          <p className="page-subtitle">
            Full services, short teachings, and highlights from our monthly prayer and 
            counseling nights. Experience the atmosphere of The ALTAR from anywhere in the world.
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="section-spacing pt-0">
        <div className="container">
          <div className="videos-catalog-grid">
            {ministryData.videos.map((vid) => (
              <div key={vid.id} className="video-card-item">
                <div className="video-thumbnail-stage" onClick={() => openVideoModal(vid)}>
                  <img src={vid.thumbnail} alt={vid.title} className="video-thumb-img" />
                  <div className="video-play-overlay">
                    <div className="play-pulse-circle">
                      <Play size={24} fill="currentColor" className="translate-x-0.5" />
                    </div>
                  </div>
                  <span className="video-duration-badge">
                    <Clock size={12} />
                    <span>{vid.duration}</span>
                  </span>
                </div>

                <div className="video-card-body">
                  <div className="video-top-meta">
                    <span className="video-speaker-tag">
                      <User size={13} className="text-gold" />
                      <span>{vid.speaker}</span>
                    </span>
                  </div>

                  <h2 className="video-card-title" onClick={() => openVideoModal(vid)}>
                    {vid.title}
                  </h2>
                  <p className="video-card-description">{vid.description}</p>

                  <div className="video-topic-pills">
                    {vid.topics.map((t, idx) => (
                      <span key={idx} className="topic-pill">{t}</span>
                    ))}
                  </div>

                  <div className="video-card-actions">
                    <button 
                      className="btn btn-primary btn-sm w-full"
                      onClick={() => openVideoModal(vid)}
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Watch Full Service</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lagos Gathering Banner */}
          <div className="gathering-banner">
            <div className="gathering-content">
              <span className="eyebrow">Gather With Us in Person</span>
              <h3>Monthly Lagos Counsel & Worship Nights</h3>
              <p>
                Held the final Friday of every month on Victoria Island, Lagos. 
                Doors open at 6:00 PM WAT for silent prayer, followed by worship, teaching, and individual counseling.
              </p>
              <button 
                className="btn btn-gold btn-sm"
                onClick={() => alert("Lagos Gathering RSVP: Next session is Friday, 6:00 PM at The Altar Centre, Victoria Island. Free admission. All seekers welcome.")}
              >
                <span>RSVP for Next Lagos Gathering</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
