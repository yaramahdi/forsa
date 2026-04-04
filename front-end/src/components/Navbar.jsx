import React from 'react'
import { LogIn, UserPlus, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  const handleScroll = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="navbar-sticky">
      <div className="container nav-flex">
        <div className="logo-container">
          <a href="#hero" onClick={() => handleScroll('hero')}>
            <img src="/images/logo2.png" alt="لوجو منصة فرصة" className="main-logo-img" />
          </a>
        </div>

        <nav className="nav-links">
          <button className="nav-link" onClick={() => handleScroll('hero')}>
            {t('home')}
          </button>
          <button className="nav-link" onClick={() => handleScroll('categories')}>
            {t('categories')}
          </button>
          <button className="nav-link" onClick={() => handleScroll('why-forsa')}>
            {t('whyForsaTitle')}
          </button>
          <button className="nav-link" onClick={() => handleScroll('craftsmen')}>
            {t('iAmCraftsman')}
          </button>
          <button className="nav-link" onClick={() => handleScroll('specialists')}>
            {t('features')}
          </button>
          <button className="nav-link" onClick={() => handleScroll('contact')}>
            {t('contact')}
          </button>
        </nav>

        <div className="auth-group">
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            <LogIn size={18} />
            <span>{t('login')}</span>
          </button>

          <button className="btn-primary" onClick={() => navigate('/signup')}>
            <UserPlus size={18} />
            <span>{t('signup')}</span>
          </button>

          <button className="btn-language" onClick={toggleLanguage} title="تبديل اللغة">
            <Globe size={18} />
            <span className="lang-text">{language === 'ar' ? 'EN' : 'AR'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}