import React, { useState } from 'react';
import { 
  X, User, BookOpen, Heart, ShieldCheck, Download, 
  Clock, CheckCircle, LogOut, Sparkles, Key 
} from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function MyAccountModal({ 
  isOpen, 
  onClose, 
  openReaderModal, 
  openGivingModal 
}) {
  const [activeTab, setActiveTab] = useState('library'); // library, giving, prayer, settings
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState('faithful.seeker@example.com');
  const [loginInput, setLoginInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="account-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="account-header">
          <div className="account-avatar-row">
            <div className="avatar-circle">
              <User size={22} className="text-gold" />
            </div>
            <div>
              <h2 className="account-name">
                {isLoggedIn ? "My Sanctuary Account" : "Sign In to Your Sanctuary"}
              </h2>
              <p className="account-email">
                {isLoggedIn ? userEmail : "Access your saved devotionals, giving history, and prayer updates."}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {isLoggedIn ? (
          <div>
            {/* Account Tab Navigation */}
            <div className="account-tabs-nav">
              <button 
                className={`acc-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => setActiveTab('library')}
              >
                <BookOpen size={15} />
                <span>My Library (3)</span>
              </button>
              <button 
                className={`acc-tab-btn ${activeTab === 'giving' ? 'active' : ''}`}
                onClick={() => setActiveTab('giving')}
              >
                <Heart size={15} />
                <span>Giving Receipts (2)</span>
              </button>
              <button 
                className={`acc-tab-btn ${activeTab === 'prayer' ? 'active' : ''}`}
                onClick={() => setActiveTab('prayer')}
              >
                <ShieldCheck size={15} />
                <span>Prayer Requests (1)</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="account-tab-body">
              {/* Library Tab */}
              {activeTab === 'library' && (
                <div className="account-library-grid">
                  {ministryData.books.slice(0, 3).map((book) => (
                    <div key={book.id} className="library-card">
                      <img src={book.coverImage} alt={book.title} className="library-thumb" />
                      <div className="library-info">
                        <h4 className="library-title">{book.title}</h4>
                        <span className="library-author">{book.author}</span>
                        <div className="library-progress-bar">
                          <div className="progress-fill" style={{ width: '68%' }}></div>
                        </div>
                        <span className="progress-text">Sample Chapter Read · 68%</span>
                        <div className="library-actions">
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              openReaderModal(book);
                              onClose();
                            }}
                          >
                            Continue Reading
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Giving History Tab */}
              {activeTab === 'giving' && (
                <div className="account-giving-list">
                  <div className="giving-record-card">
                    <div className="record-header">
                      <div>
                        <span className="record-fund">General Ministry & Lagos Youth Outreach</span>
                        <span className="record-date">October 14, 2026</span>
                      </div>
                      <span className="record-amt font-bold text-gold">$50.00</span>
                    </div>
                    <div className="record-footer">
                      <span className="record-ref mono">Ref: ALTR-USD-849201</span>
                      <button 
                        className="receipt-btn-link"
                        onClick={() => window.print()}
                      >
                        <Download size={13} />
                        <span>Print Receipt (PDF)</span>
                      </button>
                    </div>
                  </div>

                  <div className="giving-record-card">
                    <div className="record-header">
                      <div>
                        <span className="record-fund">Pastoral Counseling & Mental Health Care</span>
                        <span className="record-date">August 29, 2026</span>
                      </div>
                      <span className="record-amt font-bold text-gold">₦25,000</span>
                    </div>
                    <div className="record-footer">
                      <span className="record-ref mono">Ref: ALTR-NGN-194022</span>
                      <button 
                        className="receipt-btn-link"
                        onClick={() => window.print()}
                      >
                        <Download size={13} />
                        <span>Print Receipt (PDF)</span>
                      </button>
                    </div>
                  </div>

                  <div className="account-give-cta">
                    <button className="btn btn-gold btn-sm" onClick={() => { openGivingModal(); onClose(); }}>
                      <Heart size={14} />
                      <span>Sow a New Seed</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Prayer Requests Tab */}
              {activeTab === 'prayer' && (
                <div className="account-prayer-list">
                  <div className="prayer-record-card">
                    <div className="prayer-record-header">
                      <span className="prayer-category-tag">Pastoral Counseling</span>
                      <span className="prayer-status-badge status-praying">
                        <Clock size={12} />
                        <span>Under Pastoral Prayer</span>
                      </span>
                    </div>
                    <p className="prayer-summary">
                      “Seeking guidance on family transition and navigating season of career waiting...”
                    </p>
                    <div className="pastoral-response-note">
                      <Sparkles size={14} className="text-gold" />
                      <div>
                        <strong>Note from Rev. Tresh:</strong>
                        <p>“Dear seeker, our team is carrying you in the noon watch. Psalm 32:8 is your anchor this week. Hold your peace.”</p>
                      </div>
                    </div>
                    <span className="prayer-ref-code mono">Confidential Token: ALTR-REQ-9831</span>
                  </div>
                </div>
              )}
            </div>

            <div className="account-footer-bar">
              <button 
                className="logout-btn"
                onClick={() => setIsLoggedIn(false)}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <form 
            className="signin-form animate-fade-in"
            onSubmit={(e) => {
              e.preventDefault();
              if (loginInput) setUserEmail(loginInput);
              setIsLoggedIn(true);
            }}
          >
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email"
                required
                placeholder="you@example.com"
                className="form-input"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Access Passcode or Magic Link</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="form-input"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <Key size={16} />
              <span>Enter My Sanctuary</span>
            </button>
            <p className="signin-notice">
              No account yet? Entering your email will automatically create your secure sanctuary account upon first gift or prayer request.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
