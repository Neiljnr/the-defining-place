import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, ChevronDown, ChevronUp, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Pastoral Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const faqs = [
    {
      q: "How does the confidential pastoral counseling work?",
      a: "When you submit a request through 'Share a Need', it goes directly to Rev. Tresh and our confidential pastoral team. We never publish names or requests. We reply personally within 48 business hours with prayer and scriptural counsel."
    },
    {
      q: "Where do Sunday and Friday gatherings take place?",
      a: "Our monthly Gatherings are held on Victoria Island, Lagos, Nigeria on the last Friday of every month. Online livestream gatherings are broadcast across YouTube and our digital sanctuary."
    },
    {
      q: "How can I obtain physical copies of Rev. Tresh's books outside Nigeria?",
      a: "Physical hardcover and paperback editions are distributed via international courier across the UK, US, and Canada. Digital EPUB and PDF editions are available instantly worldwide upon purchase."
    },
    {
      q: "How are ministry donations tracked and receipted?",
      a: "All gifts made in Naira, USD, or GBP are directly receipted with an official charitable reference. Quarterly transparency statements are emailed to all partners."
    }
  ];

  return (
    <div className="contact-view animate-fade-in">
      {/* Header */}
      <section className="page-header-banner">
        <div className="container text-center">
          <span className="eyebrow">Reach Out</span>
          <h1 className="page-title">We are here to listen.</h1>
          <p className="page-subtitle">
            Whether you have a question about our publications, wish to RSVP for a Lagos gathering, 
            or need pastoral direction, our doors are open.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section-spacing pt-0">
        <div className="container">
          <div className="contact-grid-layout">
            {/* Left: Contact Info */}
            <div className="contact-info-panel">
              <h2 className="contact-panel-heading">Ministry Gathering & Office</h2>
              <p className="contact-lead-text">
                The Defining Place for Rest International Ministries operates from Lagos, Nigeria 
                with correspondents in London and Atlanta.
              </p>

              <div className="contact-cards-stack">
                <div className="contact-meta-card">
                  <MapPin size={20} className="text-gold" />
                  <div>
                    <h4>Lagos Sanctuary Gathering</h4>
                    <p>The Defining Place Centre, Victoria Island, Lagos, Nigeria</p>
                    <span className="meta-time">Monthly Gatherings: Last Friday, 6:00 PM WAT</span>
                  </div>
                </div>

                <div className="contact-meta-card">
                  <Mail size={20} className="text-teal" />
                  <div>
                    <h4>Pastoral & Counseling Inquiries</h4>
                    <p className="mono font-semibold">counsel@thedefiningplace.org</p>
                    <span className="meta-time">Confidential response within 2 business days</span>
                  </div>
                </div>

                <div className="contact-meta-card">
                  <Clock size={20} className="text-gold" />
                  <div>
                    <h4>Publishing & Partnerships</h4>
                    <p className="mono font-semibold">partners@thedefiningplace.org</p>
                    <span className="meta-time">Book distribution, translations & inquiries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="contact-form-panel">
              <div className="contact-form-card">
                <h3 className="form-card-title">Send a Direct Message</h3>

                {!sent ? (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select
                        className="form-select"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        <option value="General Pastoral Inquiry">General Pastoral Inquiry</option>
                        <option value="Lagos Monthly Gathering RSVP">Lagos Monthly Gathering RSVP</option>
                        <option value="Book Distribution & Bulk Orders">Book Distribution & Bulk Orders</option>
                        <option value="Partnership & Sponsorship">Partnership & Sponsorship</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Message</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="How can we assist or minister to you today?"
                        className="form-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full">
                      <Send size={16} />
                      <span>Send Message</span>
                    </button>
                  </form>
                ) : (
                  <div className="contact-sent-view animate-fade-in">
                    <CheckCircle size={36} className="text-teal" />
                    <h4>Thank You, {name || 'Friend'}</h4>
                    <p>
                      Your message has reached our ministry team. We will respond to <strong>{email}</strong> within 48 business hours.
                    </p>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setSent(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="faq-section">
            <div className="text-center mb-8">
              <span className="eyebrow">Common Questions</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>

            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button 
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer-body animate-fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
