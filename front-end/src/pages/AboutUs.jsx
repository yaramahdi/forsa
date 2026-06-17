import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import './AboutUs.css'

function useFadeIn(refs) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })
    return () => observer.disconnect()
  }, [refs])
}

export default function AboutUs() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const s1 = useRef(null)
  const s2 = useRef(null)
  const s3 = useRef(null)
  const s4 = useRef(null)
  const s5 = useRef(null)
  const quote = useRef(null)

  useFadeIn([s1, s2, s3, s4, s5, quote])

  const features = [
    t('aboutFeature1'),
    t('aboutFeature2'),
    t('aboutFeature3'),
    t('aboutFeature4'),
    t('aboutFeature5'),
  ]

  return (
    <div className="about-page">
      <button className="about-back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={18} />
        <span>{t('home')}</span>
      </button>

      {/* Hero */}
      <div className="about-hero">
        <span className="about-hero-label">{t('platformName')}</span>
        <h1 className="about-hero-title">{t('aboutHeroTitle')}</h1>
        <p className="about-hero-intro">{t('aboutHeroIntro')}</p>
      </div>

      {/* Content */}
      <div className="about-content">

        <div className="about-section" ref={s1}>
          <h2 className="about-section-heading">{t('aboutOriginTitle')}</h2>
          <hr className="about-divider" />
          <p className="about-body">{t('aboutOriginBody1')}</p>
          <br />
          <p className="about-body">{t('aboutOriginBody2')}</p>
        </div>

        <div className="about-section" ref={s2}>
          <h2 className="about-section-heading">{t('aboutVisionTitle')}</h2>
          <hr className="about-divider" />
          <p className="about-body">{t('aboutVisionBody')}</p>
        </div>

        <div className="about-section" ref={s3}>
          <h2 className="about-section-heading">{t('aboutMissionTitle')}</h2>
          <hr className="about-divider" />
          <p className="about-body">{t('aboutMissionBody')}</p>
        </div>

        <div className="about-section" ref={s4}>
          <h2 className="about-section-heading">{t('aboutFeaturesTitle')}</h2>
          <hr className="about-divider" />
          <ul className="about-features">
            {features.map((item, i) => (
              <li key={i}>
                <span className="about-feature-dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-section" ref={s5}>
          <div className="about-closing">{t('aboutClosing')}</div>
        </div>

      </div>

      {/* Quote */}
      <div className="about-quote-section" ref={quote}>
        <span className="about-quote-line" />
        <p className="about-quote-text">
          {t('aboutQuote')} <em>{t('platformName') === 'Forsa Platform' ? 'Forsa' : 'فرصة'}</em>
        </p>
      </div>
    </div>
  )
}
