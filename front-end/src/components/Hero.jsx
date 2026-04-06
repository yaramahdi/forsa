import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { Search } from 'lucide-react'

export default function Hero({ onProfessionSelect }) {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key
  const navigate = useNavigate()
  
  const [visibleWords, setVisibleWords] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [selectedProfession, setSelectedProfession] = useState(null)
  const searchContainerRef = useRef(null)
  const suggestionsRef = useRef(null)

  // قائمة الحرف المتاحة - مهن الحرفيين المختلفة مع أيقونات
  const professions = [
    { id: 1, name: 'سباك', name_en: 'Plumber', icon: '🔧' },
    { id: 2, name: 'نجار', name_en: 'Carpenter', icon: '🪵' },
    { id: 3, name: 'كهربائي', name_en: 'Electrician', icon: '⚡' },
    { id: 4, name: 'دهان', name_en: 'Painter', icon: '🎨' },
    { id: 5, name: 'فني تكييف', name_en: 'AC Technician', icon: '❄️' },
    { id: 6, name: 'بلاط', name_en: 'Tiler', icon: '🧱' },
    { id: 7, name: 'مهندس', name_en: 'Engineer', icon: '📐' },
    { id: 8, name: 'بناء', name_en: 'Construction', icon: '🏗️' }
  ]

  const getProfessionName = (profession) => {
    return language === 'ar' ? profession.name : profession.name_en
  }

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

  // معالجة تغيير البحث
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    setShowSuggestions(true)

    if (value.trim()) {
      const filtered = professions.filter(prof => {
        if (language === 'ar') {
          return prof.name.includes(value)
        } else {
          return prof.name_en.toLowerCase().includes(value.toLowerCase())
        }
      })
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions(professions)
    }
  }

  // معالجة اختيار اقتراح
  const handleSelectSuggestion = (profession) => {
    const displayName = language === 'ar' ? profession.name : profession.name_en
    setSearchValue(displayName)
    setSelectedProfession(profession)
    setShowSuggestions(false)
    
    // التوجيه لصفحة نتائج البحث بدلاً من التمرير لأسفل
    navigate(`/search-results?q=${encodeURIComponent(displayName)}`)
  }

  // معالجة البحث
  const handleSearch = () => {
    if (searchValue.trim()) {
      // البحث عن مهنة محددة
      const profession = professions.find(p => {
        if (language === 'ar') {
          return p.name.includes(searchValue)
        } else {
          return p.name_en.toLowerCase().includes(searchValue.toLowerCase())
        }
      })
      
      const query = profession ? getProfessionName(profession) : searchValue.trim()
      navigate(`/search-results?q=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
    } else {
      // إذا كان الحقل فارغاً، اعرض جميع المهن
      setShowSuggestions(true)
      setFilteredSuggestions(professions)
    }
  }

  // معالجة المفاتيح
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // إخفاء الاقتراحات عند النقر خارج المربع
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container-transparent')) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <section className="hero-section" id="search-hero">
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
          
          <div className="search-container-transparent" ref={searchContainerRef}>
            <input
              type="text"
              className="search-input"
              placeholder={t('searchPlaceholder')}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (!searchValue.trim()) {
                  setFilteredSuggestions(professions)
                }
                setShowSuggestions(true)
              }}
            />
            <span className="search-icon">
              <Search size={20} strokeWidth={2.5} />
            </span>

            {/* قائمة الاقتراحات */}
            {showSuggestions && (
              <div 
                className="suggestions-dropdown"
                ref={suggestionsRef}
              >
                <p className="suggestions-label">{t('searchSuggestions')}</p>
                {filteredSuggestions.length > 0 ? (
                  <ul className="suggestions-list">
                    {filteredSuggestions.map(profession => (
                      <li
                        key={profession.id}
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(profession)}
                      >
                        <span className="suggestion-name">{getProfessionName(profession)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-suggestions">{t('noResults')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}