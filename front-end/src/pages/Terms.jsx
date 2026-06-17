import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, CheckCircle, Target, UserCheck,
  Shield, Briefcase, AlertCircle, RefreshCw, MessageCircle
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import './Terms.css'

export default function Terms() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  const SECTIONS = [
    { id: 'acceptance',            title: t('termsAcceptanceTitle'),        Icon: CheckCircle  },
    { id: 'purpose',               title: t('termsPurposeTitle'),           Icon: Target       },
    { id: 'user-responsibilities', title: t('termsUserRespTitle'),          Icon: UserCheck    },
    { id: 'content-behavior',      title: t('termsContentBehaviorTitle'),   Icon: Shield       },
    { id: 'provider-resp',         title: t('termsProviderRespTitle'),      Icon: Briefcase    },
    { id: 'platform-limits',       title: t('termsPlatformLimitsTitle'),    Icon: AlertCircle  },
    { id: 'modifications',         title: t('termsModificationsTitle'),     Icon: RefreshCw    },
    { id: 'contact',               title: t('termsContactTitle'),           Icon: MessageCircle },
  ]

  const [activeSection, setActiveSection] = useState('acceptance')
  const footerNoteRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /* Active section highlight */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [language])

  /* Fade-in on scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.terms-section, .terms-footer-note').forEach(el => {
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="terms-page">
      <button className="terms-back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={18} />
        <span>{t('home')}</span>
      </button>

      {/* ── Hero ── */}
      <div className="terms-hero">
        <span className="terms-hero-label">{t('platformName')}</span>
        <h1 className="terms-hero-title">{t('termsHeroTitle')}</h1>
        <p className="terms-hero-intro">{t('termsHeroIntro')}</p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="terms-layout">

        {/* Sticky TOC */}
        <aside className="terms-toc">
          <div className="terms-toc-inner">
            <p className="terms-toc-heading">{t('termsTocHeading')}</p>
            <nav>
              {SECTIONS.map(({ id, title, Icon }) => (
                <button
                  key={id}
                  className={`terms-toc-btn ${activeSection === id ? 'active' : ''}`}
                  onClick={() => scrollTo(id)}
                >
                  <Icon size={14} />
                  <span>{title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="terms-main">

          <section id="acceptance" className="terms-section">
            <div className="terms-section-header">
              <CheckCircle size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsAcceptanceTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsAcceptanceBody')}</p>
          </section>

          <section id="purpose" className="terms-section">
            <div className="terms-section-header">
              <Target size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsPurposeTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsPurposeBody')}</p>
          </section>

          <section id="user-responsibilities" className="terms-section">
            <div className="terms-section-header">
              <UserCheck size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsUserRespTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsUserRespIntro')}</p>
            <ul className="terms-list">
              <li>{t('termsUserRespItem1')}</li>
              <li>{t('termsUserRespItem2')}</li>
              <li>{t('termsUserRespItem3')}</li>
              <li>{t('termsUserRespItem4')}</li>
            </ul>
          </section>

          <section id="content-behavior" className="terms-section">
            <div className="terms-section-header">
              <Shield size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsContentBehaviorTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsContentBehaviorIntro')}</p>
            <ul className="terms-list">
              <li>{t('termsContentBehaviorItem1')}</li>
              <li>{t('termsContentBehaviorItem2')}</li>
              <li>{t('termsContentBehaviorItem3')}</li>
              <li>{t('termsContentBehaviorItem4')}</li>
            </ul>
          </section>

          <section id="provider-resp" className="terms-section">
            <div className="terms-section-header">
              <Briefcase size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsProviderRespTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsProviderRespBody')}</p>
          </section>

          <section id="platform-limits" className="terms-section">
            <div className="terms-section-header">
              <AlertCircle size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsPlatformLimitsTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsPlatformLimitsBody')}</p>
          </section>

          <section id="modifications" className="terms-section">
            <div className="terms-section-header">
              <RefreshCw size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsModificationsTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsModificationsBody')}</p>
          </section>

          <section id="contact" className="terms-section">
            <div className="terms-section-header">
              <MessageCircle size={21} className="terms-section-icon" />
              <h2 className="terms-section-title">{t('termsContactTitle')}</h2>
            </div>
            <hr className="terms-divider" />
            <p className="terms-body">{t('termsContactBody')}</p>
          </section>

          {/* Footer note */}
          <div className="terms-footer-note" ref={footerNoteRef}>
            <p className="terms-last-update">{t('termsLastUpdate')}</p>
            <p className="terms-note-text">{t('termsFooterNote')}</p>
          </div>

        </main>
      </div>
    </div>
  )
}
