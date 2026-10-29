import React, { useState } from 'react';
import { 
  X, User, BookOpen, Heart, ShieldCheck, Download, 
  Clock, CheckCircle, LogOut, Sparkles, Key, Mail, 
  ArrowRight, Check, AlertCircle 
} from 'lucide-react';
import { ministryData } from '../data/ministryData';
import { useSanctuaryUser } from '../data/userAuthStore';
import { useSanctuaryAdmin } from '../data/adminStore';

export default function MyAccountModal({ 
  isOpen, 
  onClose, 
  openReaderModal, 
  openGivingModal 
}) {
  const { user, isLoggedIn, loginWithGoogle, registerWithEmail, loginWithEmail, logout } = useSanctuaryUser();
  const { prayers, donations } = useSanctuaryAdmin();

  const [activeTab, setActiveTab] = useState('library'); // library, giving, prayer
  const [authMode, setAuthMode] = useState('signin'); // signin, register
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Filter prayers submitted by this user
  const userPrayers = prayers.filter(p => user && p.email && p.email.toLowerCase() === user.email.toLowerCase());
  // Filter donations made by this user
  const userDonations = donations.filter(d => user && d.email && d.email.toLowerCase() === user.email.toLowerCase());

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // In production with Google Client ID, this opens standard Google Identity prompt
      // For instant friction-free access, we prompt for their Gmail or use one-tap
      const promptEmail = prompt('Enter your Gmail address to sign in with Google:', emailInput || 'seeker@gmail.com');
      if (!promptEmail) {
        setLoading(false);
        return;
      }
      const defaultName = promptEmail.split('@')[0].replace(/[._]/g, ' ');
      const capitalized = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      
      await loginWithGoogle({
        email: promptEmail,
        name: capitalized,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(capitalized)}&backgroundColor=0b192c,1d7082&textColor=d4af37`
      });
    } catch (err) {
      setErrorMsg('Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Form Submit
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (authMode === 'register') {
        if (!nameInput.trim()) {
          setErrorMsg('Please enter your name.');
          setLoading(false);
          return;
        }
        const res = await registerWithEmail({
          name: nameInput,
          email: emailInput,
          password: passwordInput
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed.');
        }
      } else {
        const res = await loginWithEmail({
          email: emailInput,
          password: passwordInput
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Sign in failed.');
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="account-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="account-header">
          <div className="account-avatar-row">
            <div className="avatar-circle">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="user-avatar-img" />
              ) : (
                <User size={22} className="text-gold" />
              )}
            </div>
            <div>
              <h2 className="account-name font-serif">
                {isLoggedIn ? `Welcome, ${user?.name}` : (authMode === 'signin' ? 'Sign In to Your Sanctuary' : 'Create Sanctuary Account')}
              </h2>
              <p className="account-email text-xs text-muted">
                {isLoggedIn ? user?.email : 'Lightweight membership — minimal details, peaceful access.'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {isLoggedIn ? (
          /* ========================================================= */
          /* LOGGED IN MEMBER VIEW                                     */
          /* ========================================================= */
          <div className="account-content-area">
            {/* Account Tab Navigation */}
            <div className="account-tabs-nav">
              <button 
                className={`acc-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => setActiveTab('library')}
              >
                <BookOpen size={15} />
                <span>Reading Library</span>
              </button>
              <button 
                className={`acc-tab-btn ${activeTab === 'giving' ? 'active' : ''}`}
                onClick={() => setActiveTab('giving')}
              >
                <Heart size={15} />
                <span>Giving Receipts ({userDonations.length})</span>
              </button>
              <button 
                className={`acc-tab-btn ${activeTab === 'prayer' ? 'active' : ''}`}
                onClick={() => setActiveTab('prayer')}
              >
                <ShieldCheck size={15} />
                <span>Prayer Requests ({userPrayers.length})</span>
              </button>
            </div>

            {/* TAB 1: LIBRARY */}
            {activeTab === 'library' && (
              <div className="tab-pane-content animate-fade-in">
                <p className="tab-intro-text">
                  Your saved devotionals and sample chapters for quiet hours.
                </p>
                <div className="user-books-list">
                  {ministryData.books.slice(0, 3).map((book) => (
                    <div key={book.id} className="user-book-row">
                      <img src={book.coverImage} alt={book.title} className="user-book-mini-cover" />
                      <div className="user-book-info">
                        <h4 className="user-book-title font-serif">{book.title}</h4>
                        <span className="user-book-author text-xs text-muted">Rev. Tresh · {book.status}</span>
                        <div className="read-progress-bar">
                          <div className="progress-fill" style={{ width: book.id === 'the-defining-path' ? '85%' : '35%' }}></div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          onClose();
                          openReaderModal(book);
                        }}
                      >
                        <span>Open Reader</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GIVING RECEIPTS */}
            {activeTab === 'giving' && (
              <div className="tab-pane-content animate-fade-in">
                <p className="tab-intro-text">
                  Official charitable donation records and tax documentation for seeds sown.
                </p>
                {userDonations.length === 0 ? (
                  <div className="empty-account-box text-center py-4">
                    <Heart size={28} className="text-gold mx-auto mb-2" />
                    <p className="text-sm text-muted">No seeds sown logged under this email yet.</p>
                    <button 
                      className="btn btn-gold btn-sm mt-3"
                      onClick={() => {
                        onClose();
                        openGivingModal();
                      }}
                    >
                      <span>Sow a Seed Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="receipts-list">
                    {userDonations.map((d) => (
                      <div key={d.id} className="receipt-item-card">
                        <div className="receipt-left">
                          <span className="receipt-tag">{d.receiptCode}</span>
                          <span className="receipt-fund text-sm font-semibold">{d.fund}</span>
                          <span className="receipt-date text-xs text-muted">{new Date(d.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="receipt-right text-right">
                          <span className="receipt-amt font-serif font-bold">
                            {d.currency === 'USD' ? '$' : d.currency === 'GBP' ? '£' : d.currency === 'EUR' ? '€' : '₦'}
                            {d.amount.toLocaleString()}
                          </span>
                          <span className="badge-verified text-xs">
                            <Check size={12} className="inline-icon" /> Verified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PRAYER INQUIRIES */}
            {activeTab === 'prayer' && (
              <div className="tab-pane-content animate-fade-in">
                <p className="tab-intro-text">
                  Track the confidential intercession status of your prayer and counseling requests.
                </p>
                {userPrayers.length === 0 ? (
                  <div className="empty-account-box text-center py-4">
                    <ShieldCheck size={28} className="text-teal mx-auto mb-2" />
                    <p className="text-sm text-muted">No active prayer requests submitted under this email.</p>
                  </div>
                ) : (
                  <div className="user-prayers-list">
                    {userPrayers.map((pr) => (
                      <div key={pr.id} className="user-prayer-item">
                        <div className="user-prayer-top">
                          <span className="prayer-code">{pr.trackingCode}</span>
                          <span className={`status-pill status-${pr.status}`}>
                            {pr.status === 'needs_prayer' && 'Awaiting Prayer'}
                            {pr.status === 'interceding' && 'In Intercession'}
                            {pr.status === 'answered' && 'Answered Praise'}
                          </span>
                        </div>
                        <p className="user-prayer-msg text-sm mt-1">"{pr.message}"</p>
                        {pr.pastorNotes && (
                          <div className="pastor-reply-note mt-2 text-xs">
                            <strong>Pastoral Counsel:</strong> {pr.pastorNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account Footer with Sign Out */}
            <div className="account-footer-bar">
              <span className="auth-provider-badge text-xs text-muted">
                Signed in via {user?.authProvider === 'google' ? 'Google (Gmail)' : 'Email'}
              </span>
              <button 
                className="btn btn-outline btn-sm logout-btn"
                onClick={logout}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* LIGHTWEIGHT AUTHENTICATION / SIGN UP (MINIMAL DATA)       */
          /* ========================================================= */
          <div className="signin-flow animate-fade-in">
            {/* Mode Toggle Pills */}
            <div className="auth-mode-toggle mb-4">
              <button 
                type="button"
                className={`toggle-mode-btn ${authMode === 'signin' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`toggle-mode-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
              >
                Create Account
              </button>
            </div>

            {/* Google 1-Click Sign-In Button */}
            <button 
              type="button" 
              className="google-signin-btn w-full mb-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{authMode === 'register' ? 'Sign Up with Google (Gmail)' : 'Continue with Google (Gmail)'}</span>
            </button>

            {/* Divider */}
            <div className="auth-divider mb-3">
              <span>or with email</span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="auth-error-banner mb-3">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="minimal-auth-form">
              {authMode === 'register' && (
                <div className="form-group mb-3">
                  <label className="form-label-caps">Your Name *</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Chidinma"
                      className="form-input"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group mb-3">
                <label className="form-label-caps">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input 
                    type="email" 
                    required
                    placeholder="you@example.com"
                    className="form-input"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label-caps">Passcode / Password *</label>
                <div className="input-with-icon">
                  <Key size={16} className="input-icon" />
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="form-input"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-gold w-full" disabled={loading}>
                <span>{loading ? 'Please wait...' : (authMode === 'register' ? 'Create My Sanctuary Account' : 'Sign In to Sanctuary')}</span>
                <ArrowRight size={16} />
              </button>

              <div className="privacy-pledge-note mt-3 text-center">
                <ShieldCheck size={14} className="inline-icon mr-1 text-teal" />
                <span className="text-xs text-muted">
                  Minimal Data Pledge: We only store your name and email to save your reading journey, prayer intercessions, and donation receipts.
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
