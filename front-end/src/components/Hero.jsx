import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { Search } from 'lucide-react'

const SEARCH_OPTIONS = [
  { id: 1, name: 'سباك', name_en: 'Plumber' },
  { id: 2, name: 'نجار', name_en: 'Carpenter' },
  { id: 3, name: 'كهربائي', name_en: 'Electrician' },
  { id: 4, name: 'دهان', name_en: 'Painter' },
  { id: 5, name: 'مهندس', name_en: 'Engineer' },
  { id: 6, name: 'فني', name_en: 'Technician' },
  { id: 7, name: 'سائق', name_en: 'Driver' },
  { id: 8, name: 'ميكانيكي', name_en: 'Mechanic' }
]

export default function Hero() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key
  const navigate = useNavigate()

  const [visibleWords, setVisibleWords] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(SEARCH_OPTIONS)
  const searchContainerRef = useRef(null)

  const getOptionLabel = (option) => {
    return language === 'ar' ? option.name : option.name_en
  }

  const text = t('heroTitle')
  const words = text.split(' ')

  useEffect(() => {
    setVisibleWords([])
    words.forEach((word, index) => {
      setTimeout(() => {
        setVisibleWords((prev) => [...prev, index])
      }, index * 400)
    })
  }, [language, text])

  const filterSuggestions = (value) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      setFilteredSuggestions(SEARCH_OPTIONS)
      return
    }

    const filtered = SEARCH_OPTIONS.filter((option) => {
      return language === 'ar'
        ? option.name.includes(trimmedValue)
        : option.name_en.toLowerCase().includes(trimmedValue.toLowerCase())
    })

    setFilteredSuggestions(filtered)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    setShowSuggestions(true)
    filterSuggestions(value)
  }

  const goToSearchResults = (query) => {
    const finalQuery = String(query || '').trim()
    if (!finalQuery) return

    navigate(`/search-results?q=${encodeURIComponent(finalQuery)}`)
    setShowSuggestions(false)
  }

  const handleSelectSuggestion = (option) => {
    const label = getOptionLabel(option)
    setSearchValue(label)
    goToSearchResults(label)
  }

  const handleSearch = () => {
    const query = searchValue.trim()

    if (query) {
      goToSearchResults(query)
      return
    }

    setFilteredSuggestions(SEARCH_OPTIONS)
    setShowSuggestions(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!searchContainerRef.current?.contains(e.target)) {
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
                (language === 'ar' && word.includes('الأحلام')) ||
                (language === 'en' && word.includes('dreams'))
                  ? 'highlight-word'
                  : ''
              }`}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-sub">{t('heroSubtitle')}</p>

        <div className="search-wrapper">
          <button className="action-btn-green" onClick={handleSearch}>
            {t('searchBtn')}
          </button>

          <div className="search-container-transparent" ref={searchContainerRef}>
            <input
              type="text"
              className="search-input"
              placeholder={t('searchPlaceholder')}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              onFocus={() => {
                filterSuggestions(searchValue)
                setShowSuggestions(true)
              }}
            />

            <span className="search-icon">
              <Search size={20} strokeWidth={2.5} />
            </span>

            {showSuggestions && (
              <div className="suggestions-dropdown">
                <p className="suggestions-label">{t('searchSuggestions')}</p>

                {filteredSuggestions.length > 0 ? (
                  <ul className="suggestions-list">
                    {filteredSuggestions.map((option) => (
                      <li
                        key={option.id}
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(option)}
                      >
                        <span className="suggestion-name">{getOptionLabel(option)}</span>
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