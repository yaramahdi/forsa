import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

export default function Hero() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key
  
  const [visibleWords, setVisibleWords] = useState([])
  const text = t('heroTitle')
  const words = text.split(" ")

  useEffect(() => {
    setVisibleWords([])
    words.forEach((word, index) => {
      setTimeout(() => {
        setVisibleWords(prev => [...prev, index])
      }, index * 400)
    })
  }, [language])

  const handleSearch = () => {
    const searchInput = document.querySelector('.search-input')
    const value = searchInput.value.trim()
    if (value) {
      alert(t('searchAlert') + value)
    } else {
      alert(t('searchAlertError'))
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <h1 className="animated-title">
          {words.map((word, index) => (
            <span
              key={index}
              className={`word ${visibleWords.includes(index) ? 'visible' : ''} ${
                (language === 'ar' && word.includes('الأحلام')) || (language === 'en' && word.includes('dreams')) ? 'highlight-word' : ''
              }`}
            >
              {word}
            </span>
          ))}
        </h1>
        
        <p className="hero-sub">{t('heroSubtitle')}</p>
        
        <div className="search-wrapper">
          <button className="action-btn-green" onClick={handleSearch}>{t('searchBtn')}</button>
          
          <div className="search-container-transparent">
            <input type="text" className="search-input" placeholder={t('searchPlaceholder')} />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </section>
  )
}
