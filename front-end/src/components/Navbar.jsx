import React, { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
import { LogIn, UserPlus, Globe, User, Menu, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()

  const t = (key) => translations[language]?.[key] || key

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [craftsmanData, setCraftsmanData] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const adminFlag = localStorage.getItem('forsaAdmin')
    if (adminFlag === 'true') {
      setIsAdmin(true)
      return
    }

    const token = localStorage.getItem('forsaToken')
    const storedCraftsman = localStorage.getItem('forsaCraftsman')

    if (token && storedCraftsman) {
      try {
        setCraftsmanData(JSON.parse(storedCraftsman))
        setIsLoggedIn(true)
      } catch (error) {
        setCraftsmanData(null)
        setIsLoggedIn(false)
      }
    } else {
      setCraftsmanData(null)
      setIsLoggedIn(false)
    }
  }, [])

  const avatarLetter = useMemo(() => {
    if (craftsmanData?.firstName?.trim()) {
      return craftsmanData.firstName.trim().charAt(0).toUpperCase()
    }
    return null
  }, [craftsmanData])

  const handleScroll = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavClick = (sectionId) => {
    handleScroll(sectionId)
    setMenuOpen(false)
  }

  return (
    <header className="navbar-sticky">
      <div className="container nav-flex">
        <div className="logo-container">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('hero')
            }}
          >
            <img src="/images/logo2.png" alt="لوجو منصة فرصة" className="main-logo-img" loading="lazy" />
          </a>
        </div>

        <nav className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          <button className="nav-link" onClick={() => handleNavClick('hero')}>{t('home')}</button>
          <button className="nav-link" onClick={() => handleNavClick('categories')}>{t('categories')}</button>
          <button className="nav-link" onClick={() => handleNavClick('why-forsa')}>{t('whyForsaTitle')}</button>
          <button className="nav-link" onClick={() => handleNavClick('craftsmen')}>{t('iAmCraftsman')}</button>
          <button className="nav-link" onClick={() => handleNavClick('specialists')}>{t('features')}</button>
          <button className="nav-link" onClick={() => { navigate('/team'); setMenuOpen(false) }}>{t('team')}</button>
          <button className="nav-link" onClick={() => handleNavClick('contact')}>{t('contact')}</button>
        </nav>

        <div className="auth-group">
          {isAdmin ? (
            <button
              type="button"
              className="profile-avatar-btn"
              onClick={() => navigate('/admin')}
              title="لوحة الإدارة"
            >
              <img
                src="/images/admin.png"
                alt="admin"
                className="profile-avatar-image"
                loading="lazy"
              />
            </button>
          ) : isLoggedIn ? (
            <button
              type="button"
              className="profile-avatar-btn"
              onClick={() => navigate('/profile')}
              title="الملف الشخصي"
            >
              {craftsmanData?.profileImage ? (
                <img
                  src={craftsmanData.profileImage.startsWith('http') ? craftsmanData.profileImage : `${API_BASE_URL}${craftsmanData.profileImage}`}
                  alt="profile"
                  className="profile-avatar-image"
                  loading="lazy"
                />
              ) : avatarLetter ? (
                <span className="profile-avatar-letter">{avatarLetter}</span>
              ) : (
                <User size={18} />
              )}
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                <LogIn size={18} />
                <span className="btn-text">{t('login')}</span>
              </button>
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                <UserPlus size={18} />
                <span className="btn-text">{t('signup')}</span>
              </button>
            </>
          )}

          <button className="btn-language" onClick={toggleLanguage} title="تبديل اللغة">
            <Globe size={18} />
            <span className="lang-text">{language === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="القائمة"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  )
}
