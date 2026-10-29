import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Sparkles, ChevronUp, 
  ChevronDown, X, RotateCcw, RotateCw, Radio, Music 
} from 'lucide-react';
import { startAmbientSanctuary, stopAmbientSanctuary, setAmbientVolume, isAmbientPlaying } from '../utils/audioSynthesizer';

export default function AudioPlayerBar({ activeAudio, setActiveAudio, isPlaying, setIsPlaying }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2280); // default ~38 mins
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [ambientActive, setAmbientActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (activeAudio) {
      setCurrentTime(0);
      setDuration(activeAudio.durationSec || 1800);
      setIsPlaying(true);
      // Automatically activate ambient peace sound as well
      if (!ambientActive) {
        startAmbientSanctuary(volume * 0.4);
        setAmbientActive(true);
      }
    }
  }, [activeAudio]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, playbackSpeed]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      if (!ambientActive) {
        startAmbientSanctuary(volume * 0.4);
        setAmbientActive(true);
      }
    } else {
      if (ambientActive && !activeAudio) {
        stopAmbientSanctuary();
        setAmbientActive(false);
      }
    }
  };

  const toggleAmbientOnly = () => {
    if (ambientActive) {
      stopAmbientSanctuary();
      setAmbientActive(false);
    } else {
      startAmbientSanctuary(volume * 0.4);
      setAmbientActive(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setAmbientVolume(volume * 0.4);
    } else {
      setIsMuted(true);
      setAmbientVolume(0);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(false);
    setAmbientVolume(newVol * 0.4);
  };

  const handleSeek = (e) => {
    const newTime = parseInt(e.target.value, 10);
    setCurrentTime(newTime);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.85];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!activeAudio && !ambientActive) {
    return null;
  }

  const title = activeAudio ? activeAudio.title : "Ambient Stillness — Sanctuary Chords";
  const speaker = activeAudio ? (activeAudio.speaker || "Rev. Tresh") : "Soaking Meditation";

  return (
    <aside className={`audio-player-dock ${isMinimized ? 'minimized' : ''}`} aria-label="Audio Companion Player">
      <div className="container audio-dock-inner">
        {/* Track Info */}
        <div className="audio-track-info">
          <div className="track-icon-badge">
            {ambientActive ? (
              <span className="live-equalizer">
                <span className="eq-bar bar-1"></span>
                <span className="eq-bar bar-2"></span>
                <span className="eq-bar bar-3"></span>
              </span>
            ) : (
              <Music size={18} className="text-gold" />
            )}
          </div>
          <div className="track-text">
            <span className="track-title">{title}</span>
            <span className="track-speaker">
              {speaker} · {activeAudio?.series || "The ALTAR Archive"}
            </span>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        {!isMinimized && (
          <div className="audio-center-controls">
            <div className="audio-btn-row">
              <button 
                className="audio-sub-btn"
                onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                title="Rewind 15 seconds"
              >
                <RotateCcw size={15} />
              </button>

              <button 
                className="audio-play-btn"
                onClick={togglePlay}
                title={isPlaying ? "Pause teaching" : "Play teaching"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
              </button>

              <button 
                className="audio-sub-btn"
                onClick={() => setCurrentTime((t) => Math.min(duration, t + 30))}
                title="Forward 30 seconds"
              >
                <RotateCw size={15} />
              </button>

              <button 
                className="audio-speed-btn"
                onClick={cycleSpeed}
                title="Change playback speed"
              >
                {playbackSpeed}x
              </button>
            </div>

            <div className="audio-scrub-row">
              <span className="time-label">{formatTime(currentTime)}</span>
              <input 
                type="range"
                className="audio-progress-slider"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="time-label">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Right Actions: Volume & Ambient Sanctuary toggle */}
        <div className="audio-right-actions">
          {/* Mobile Direct Play/Pause Button */}
          <button 
            className="mobile-play-action-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="translate-x-px" />}
          </button>

          {/* Ambient Soaking Sound Toggle */}
          <button 
            className={`ambient-toggle-btn ${ambientActive ? 'active' : ''}`}
            onClick={toggleAmbientOnly}
            title={ambientActive ? "Turn off ambient soaking pad" : "Turn on background prayer ambience"}
          >
            <Sparkles size={14} className={ambientActive ? 'text-gold animate-pulse' : ''} />
            <span className="hide-mobile">Ambient Pad</span>
          </button>

          {/* Volume */}
          {!isMinimized && (
            <div className="volume-control-wrap hide-mobile">
              <button onClick={toggleMute} className="vol-btn" title="Toggle mute">
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          )}

          {/* Minimize / Expand */}
          <button 
            className="dock-toggle-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand player" : "Minimize player"}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Close */}
          <button 
            className="dock-close-btn"
            onClick={() => {
              setIsPlaying(false);
              stopAmbientSanctuary();
              setAmbientActive(false);
              setActiveAudio(null);
            }}
            title="Close audio companion"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
