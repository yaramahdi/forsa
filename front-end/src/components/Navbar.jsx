import React, { useEffect, useMemo, useState } from 'react'
import { LogIn, UserPlus, Globe, User } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()

  const t = (key) => translations[language]?.[key] || key

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [craftsmanData, setCraftsmanData] = useState(null)

  useEffect(() => {
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

  return (
    <header className="navbar-sticky">
      <div className="container nav-flex">
        {/* الصورة قبل الشعار فقط عند تسجيل الدخول */}
        {isLoggedIn && (
          <div className="profile-right-group">
            <button
              type="button"
              className="profile-avatar-btn"
              onClick={() => navigate('/profile')}
              title="الملف الشخصي"
            >
              {craftsmanData?.profileImage ? (
                <img
                  src={`http://localhost:5000${craftsmanData.profileImage}`}
                  alt="profile"
                  className="profile-avatar-image"
                />
              ) : avatarLetter ? (
                <span className="profile-avatar-letter">{avatarLetter}</span>
              ) : (
                <User size={18} />
              )}
            </button>
          </div>
        )}

        <div className="logo-container">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleScroll('hero')
            }}
          >
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
          {!isLoggedIn && (
            <>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                <LogIn size={18} />
                <span>{t('login')}</span>
              </button>

              <button className="btn-primary" onClick={() => navigate('/signup')}>
                <UserPlus size={18} />
                <span>{t('signup')}</span>
              </button>
            </>
          )}

          <button className="btn-language" onClick={toggleLanguage} title="تبديل اللغة">
            <Globe size={18} />
<span className="lang-text">{language === 'ar' ? 'EN' : 'AR'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
