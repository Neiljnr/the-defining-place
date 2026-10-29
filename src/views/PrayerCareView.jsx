import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, Lock, Users, Sparkles, CheckCircle, 
  Send, Heart, RefreshCw, Bookmark 
} from 'lucide-react';
import { ministryData } from '../data/ministryData';
import { adminStore } from '../data/adminStore';

export default function PrayerCareView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [supportType, setSupportType] = useState('Prayer request');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isStrictlyConfidential, setIsStrictlyConfidential] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [solaceVerseIndex, setSolaceVerseIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrayer = adminStore.addPrayerRequest({
      name: isAnonymous ? 'Anonymous Seeker' : (name || 'Anonymous Seeker'),
      email: isAnonymous ? '' : email,
      category: supportType,
      message: message,
      urgency: 'standard'
    });
    setTicketNumber(newPrayer.trackingCode);
    setIsSubmitted(true);
  };

  const nextSolaceVerse = () => {
    setSolaceVerseIndex((prev) => (prev + 1) % ministryData.comfortVerses.length);
  };

  const activeVerse = ministryData.comfortVerses[solaceVerseIndex];

  return (
    <div className="prayer-care-view animate-fade-in">
      {/* Header */}
      <section className="page-header-banner">
        <div className="container text-center">
          <span className="eyebrow">Held In Confidence</span>
          <h1 className="page-title">Share what weighs on you.</h1>
          <p className="page-subtitle">
            Prayer requests, counseling questions, or a testimony you'd like us to celebrate — 
            send it here. Rev. Tresh and a small trained team will respond personally.
          </p>

          {/* 3 Assurance Badges */}
          <div className="assurance-badges-grid">
            <div className="assurance-card">
              <div className="icon-badge-round">
                <Clock size={20} className="text-teal" />
              </div>
              <h3 className="assurance-title">Response within 2 days</h3>
              <p className="assurance-desc">Every request receives a personal, prayerful reply during business days.</p>
            </div>

            <div className="assurance-card">
              <div className="icon-badge-round">
                <Lock size={20} className="text-gold" />
              </div>
              <h3 className="assurance-title">Encrypted at rest</h3>
              <p className="assurance-desc">Only Rev. Tresh and the designated prayer lead can access your submission.</p>
            </div>

            <div className="assurance-card">
              <div className="icon-badge-round">
                <Users size={20} className="text-teal" />
              </div>
              <h3 className="assurance-title">A team behind every reply</h3>
              <p className="assurance-desc">Rev. Tresh leads a small circle of trained pastoral and counseling volunteers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Request Form Section */}
      <section className="section-spacing pt-0">
        <div className="container-narrow">
          {/* Calming Scripture Solace Card */}
          <div className="solace-card">
            <div className="solace-header">
              <div className="solace-title-group">
                <Sparkles size={16} className="text-gold" />
                <span>Scripture Solace Before You Write</span>
              </div>
              <button className="solace-refresh-btn" onClick={nextSolaceVerse} title="Next comforting scripture">
                <RefreshCw size={14} />
                <span>Another Verse</span>
              </button>
            </div>
            <p className="solace-text">“{activeVerse.text}”</p>
            <span className="solace-ref">— {activeVerse.ref}</span>
          </div>

          <div className="prayer-form-card">
            <h2 className="prayer-card-heading">Your request</h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="prayer-form">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="form-input"
                      disabled={isAnonymous}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <input
                      type="email"
                      required={!isAnonymous}
                      placeholder="Email address"
                      className="form-input"
                      disabled={isAnonymous}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label-caps">What kind of support?</label>
                  <select
                    className="form-select"
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value)}
                  >
                    <option value="Prayer request">Prayer request</option>
                    <option value="Pastoral counseling question">Pastoral counseling question</option>
                    <option value="Grief or loss support">Grief or loss support</option>
                    <option value="Testimony / Praise report to celebrate">Testimony / Praise report to celebrate</option>
                  </select>
                </div>

                <div className="form-group">
                  <textarea
                    rows={6}
                    required
                    maxLength={5000}
                    placeholder="Tell us about your need. You can share as much or as little as you like."
                    className="form-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="textarea-counter">
                    <span>{message.length} / 5000</span>
                  </div>
                </div>

                <div className="checkbox-stack">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <span>Submit anonymously (we won't be able to write back, but we will pray)</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isStrictlyConfidential}
                      onChange={(e) => setIsStrictlyConfidential(e.target.checked)}
                    />
                    <span>Keep strictly confidential — seen only by Rev. Tresh and the prayer lead</span>
                  </label>
                </div>

                <div className="sacred-promise-box">
                  Your message is encrypted at rest. Prayer requests are held in confidence and are never shared publicly or used in fundraising copy. This is a sacred promise.
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full">
                  <Send size={16} />
                  <span>Submit request</span>
                </button>
              </form>
            ) : (
              /* Submission Confirmation */
              <div className="prayer-confirmation-view animate-fade-in">
                <div className="confirm-icon-circle">
                  <CheckCircle size={36} className="text-teal" />
                </div>
                <h3 className="confirm-title">Your Need Has Been Received In Sacred Trust</h3>
                <p className="confirm-sub">
                  Rev. Tresh and our prayer team have received your request ({supportType}). 
                  We are lifting you in prayer today.
                </p>

                <div className="confirm-ticket-box">
                  <span className="ticket-label">Confidential Tracking Code</span>
                  <span className="ticket-token mono text-gold">{ticketNumber}</span>
                  <p className="ticket-instruction">
                    If you provided an email, you will receive our personal pastoral response within 48 business hours.
                  </p>
                </div>

                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setMessage('');
                    setIsSubmitted(false);
                  }}
                >
                  Submit Another Need
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
