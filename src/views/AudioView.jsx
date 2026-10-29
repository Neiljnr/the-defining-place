import React from 'react';
import { Headphones, Play, Pause, Clock, Sparkles, Download, Share2, Volume2, Music } from 'lucide-react';
import { ministryData } from '../data/ministryData';
import { startAmbientSanctuary, stopAmbientSanctuary, isAmbientPlaying } from '../utils/audioSynthesizer';

export default function AudioView({ activeAudio, setActiveAudio, isPlaying, setIsPlaying }) {
  const [ambientActive, setAmbientActive] = React.useState(isAmbientPlaying());

  const handlePlayTeaching = (teaching) => {
    if (activeAudio?.id === teaching.id && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveAudio(teaching);
      setIsPlaying(true);
    }
  };

  const toggleAmbientSanctuary = () => {
    if (ambientActive) {
      stopAmbientSanctuary();
      setAmbientActive(false);
    } else {
      startAmbientSanctuary(0.35);
      setAmbientActive(true);
    }
  };

  return (
    <div className="audio-view animate-fade-in">
      {/* Header */}
      <section className="page-header-banner">
        <div className="container text-center">
          <span className="eyebrow">Listen & Rest</span>
          <h1 className="page-title">Audio Messages</h1>
          <p className="page-subtitle">
            Teachings from The ALTAR, recorded at our gatherings in Lagos and released free 
            for anyone who needs them. Stream anytime or let the ambient sanctuary soothe your spirit.
          </p>

          {/* Ambient Soaking Sound Feature Card */}
          <div className="ambient-feature-bar">
            <div className="ambient-feature-content">
              <Sparkles size={20} className="text-gold" />
              <div>
                <strong>Ambient Sanctuary Chords (Synthesized Live)</strong>
                <p>Gentle, warm, non-looping contemplative piano & soft strings for quiet prayer or study.</p>
              </div>
            </div>
            <button 
              className={`btn ${ambientActive ? 'btn-gold' : 'btn-outline'}`}
              onClick={toggleAmbientSanctuary}
            >
              <Volume2 size={16} />
              <span>{ambientActive ? 'Soaking Music Active' : 'Start Ambient Peace'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Audio Messages Grid */}
      <section className="section-spacing pt-0">
        <div className="container">
          <div className="audio-cards-grid">
            {ministryData.audioTeachings.map((teaching) => {
              const isCurrentPlaying = activeAudio?.id === teaching.id && isPlaying;

              return (
                <div key={teaching.id} className={`audio-card-item ${isCurrentPlaying ? 'is-active-track' : ''}`}>
                  <div className="audio-card-top-strip">
                    <Headphones size={15} className="text-teal" />
                    <span className="audio-series-tag">{teaching.series.toUpperCase()}</span>
                    <span className="audio-duration-pill">
                      <Clock size={12} />
                      <span>{teaching.duration}</span>
                    </span>
                  </div>

                  <div className="audio-card-body">
                    <h2 className="audio-teaching-title">{teaching.title}</h2>
                    <span className="audio-speaker-meta">{teaching.speaker}</span>
                    <p className="audio-teaching-desc">{teaching.description}</p>
                    
                    <div className="audio-scripture-tag">
                      <span>Scripture: {teaching.scripture}</span>
                    </div>

                    <div className="audio-card-actions">
                      <button 
                        className={`btn ${isCurrentPlaying ? 'btn-gold' : 'btn-primary'} w-full`}
                        onClick={() => handlePlayTeaching(teaching)}
                      >
                        {isCurrentPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                        <span>{isCurrentPlaying ? "Pause Message" : "Listen Now"}</span>
                      </button>

                      <button 
                        className="btn btn-outline btn-sm download-btn"
                        onClick={() => alert(`Beginning download of "${teaching.title}" (320kbps MP3)`)}
                        title="Download audio message"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
