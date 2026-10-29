import React from 'react';
import { ArrowRight, BookOpen, Heart, Sparkles, MapPin, Globe, CheckCircle } from 'lucide-react';

export default function AboutView({ setActivePage, openGivingModal }) {
  return (
    <div className="about-view animate-fade-in">
      {/* Header */}
      <section className="page-header-banner">
        <div className="container-narrow text-center">
          <span className="eyebrow">About</span>
          <h1 className="page-title">A ministry of quiet company.</h1>
        </div>
      </section>

      {/* Main Content & Portrait */}
      <section className="section-spacing pt-0">
        <div className="container-narrow">
          <div className="about-portrait-card">
            <img 
              src="/images/rev-tresh.jpg" 
              alt="Rev. Tresh" 
              className="about-portrait-image"
            />
          </div>

          <div className="about-editorial-prose">
            <p className="lead-paragraph">
              The Defining Place began the way most defining places do — quietly, and out of need. 
              Rev. Tresh has spent two decades listening to people at the edges of a hard season, 
              and writing what he learned in the margins.
            </p>

            <p>
              Today the ministry has three pillars. <strong>Books</strong>, because words held together carefully 
              can carry a person a long way. <strong>Giving</strong>, because a mission can only travel as far as its 
              supporters send it. And <strong>quiet counsel</strong>, because sometimes the most sacred thing anyone can 
              offer is to read your letter and write back.
            </p>

            <p>
              The work is rooted in Lagos and reaches around the world. It is intentionally small, 
              intentionally personal, and intentionally slow — because that is what the work requires.
            </p>

            <div className="about-actions-row">
              <button 
                className="btn btn-primary"
                onClick={() => setActivePage('books')}
              >
                <span>Read the books</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className="btn btn-outline"
                onClick={() => openGivingModal()}
              >
                <span>Support the mission</span>
              </button>
            </div>
          </div>

          {/* Core Convictions */}
          <div className="convictions-section">
            <h2 className="convictions-heading">Our Three Foundational Anchors</h2>
            <div className="convictions-grid">
              <div className="conviction-card">
                <span className="conviction-num">01</span>
                <h3>The Altar of Rest</h3>
                <p>We reject spiritual burnout as a virtue. Rest is not the absence of purpose, but the soil of endurance.</p>
              </div>

              <div className="conviction-card">
                <span className="conviction-num">02</span>
                <h3>Slow, Pastoral Listening</h3>
                <p>In a world addicted to mass broadcast, we prioritize the sacred, confidential one-on-one pastoral letter.</p>
              </div>

              <div className="conviction-card">
                <span className="conviction-num">03</span>
                <h3>Lagos to the Nations</h3>
                <p>Rooted with humility in Nigeria, carrying a message of serene, timeless biblical hope to seekers in every timezone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
