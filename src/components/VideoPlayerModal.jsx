import React, { useState } from 'react';
import { X, Play, Pause, Volume2, Maximize, Share2, Download, BookOpen, Clock, User } from 'lucide-react';

export default function VideoPlayerModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // notes, scripture, reflection

  if (!video) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="video-modal-header">
          <div className="video-title-wrap">
            <span className="eyebrow">Video Sanctuary</span>
            <h2 className="video-modal-title">{video.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close video player">
            <X size={20} />
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="video-screen-wrapper">
          <img src={video.thumbnail} alt={video.title} className="video-screen-bg" />
          <div className="video-screen-overlay">
            <button 
              className="center-video-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="translate-x-0.5" />}
            </button>

            {/* Video Controls Bar */}
            <div className="video-controls-overlay">
              <div className="video-scrub-bar">
                <div className="video-progress" style={{ width: isPlaying ? '35%' : '15%' }}></div>
              </div>
              <div className="video-controls-row">
                <div className="controls-left">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="vid-btn">
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <span className="vid-time">14:28 / {video.duration}</span>
                </div>
                <div className="controls-right">
                  <button className="vid-btn" title="Volume">
                    <Volume2 size={16} />
                  </button>
                  <button className="vid-btn" title="Full screen">
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Details & Study Tabs */}
        <div className="video-modal-content">
          <div className="video-meta-bar">
            <div className="speaker-meta">
              <User size={15} className="text-gold" />
              <span>{video.speaker}</span>
              <span className="dot-divider">•</span>
              <Clock size={15} className="text-teal" />
              <span>{video.duration}</span>
            </div>

            <div className="video-action-pills">
              <button 
                className="pill-action-btn"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
              <button 
                className="pill-action-btn"
                onClick={() => alert("Downloading Study Guide notes (PDF)...")}
              >
                <Download size={14} />
                <span>Sermon Guide (PDF)</span>
              </button>
            </div>
          </div>

          <p className="video-lead-description">{video.description}</p>

          {/* Tab Navigation */}
          <div className="study-tabs-nav">
            <button 
              className={`study-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Teaching Key Takeaways
            </button>
            <button 
              className={`study-tab-btn ${activeTab === 'scripture' ? 'active' : ''}`}
              onClick={() => setActiveTab('scripture')}
            >
              Scripture References
            </button>
            <button 
              className={`study-tab-btn ${activeTab === 'reflection' ? 'active' : ''}`}
              onClick={() => setActiveTab('reflection')}
            >
              Reflection Questions
            </button>
          </div>

          {/* Tab Content */}
          <div className="study-tab-body">
            {activeTab === 'notes' && (
              <ul className="study-notes-list">
                <li><strong>The Danger of Frantic Ministry:</strong> When activity outpaces intimacy, burnout is inevitable. God never invited us to carry what only His sovereignty can bear.</li>
                <li><strong>The Sacred Threshold:</strong> Removing your sandals at the burning bush represents letting go of personal leverage and entering God's timing.</li>
                <li><strong>Rest as Spiritual Warfare:</strong> In a world that idolizes exhaustion, resting in God is the ultimate defiance against fear.</li>
              </ul>
            )}

            {activeTab === 'scripture' && (
              <div className="scripture-references-box">
                <div className="scripture-pill">
                  <strong>Matthew 11:28-30:</strong> “Come unto me, all ye that labour and are heavy laden...”
                </div>
                <div className="scripture-pill">
                  <strong>Exodus 33:14:</strong> “My presence shall go with thee, and I will give thee rest.”
                </div>
                <div className="scripture-pill">
                  <strong>Psalm 62:1:</strong> “Truly my soul waiteth upon God: from him cometh my salvation.”
                </div>
              </div>
            )}

            {activeTab === 'reflection' && (
              <div className="reflection-questions">
                <p>1. Where in your life are you currently confusing urgency with significance?</p>
                <p>2. What would it look like for you to institute two uninterrupted hours of silence this week?</p>
                <p>3. What fear arises when you consider stopping your work before everything is checked off?</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
