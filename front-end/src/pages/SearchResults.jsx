import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { MapPin, Star, Phone, User, ArrowRight, SearchX } from 'lucide-react'
import './SearchResults.css'

export default function SearchResults() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key
  const location = useLocation()
  const navigate = useNavigate()
  
  // استخراج كلمة البحث من الرابط
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''

  const [results, setResults] = useState([])

  // قاعدة بيانات الحرفيين
  const allSpecialists = [
    {
      id: 1,
      profession: 'Plumber',
      profession_ar: 'سباك',
      name: 'معتصم السعدي',
      name_en: 'Mutasem Al-Saadi',
      location: 'غزة - الرمال',
      location_en: 'Gaza - Ramla',
      rating: 5,
      professionImage: '/images/plumber.png',
      verified: true
    },
    {
      id: 2,
      profession: 'Carpenter',
      profession_ar: 'نجار',
      name: 'أحمد الحلو',
      name_en: 'Ahmad Al-Hallo',
      location: 'غزة - الشجاعية',
      location_en: 'Gaza - Shjaiya',
      rating: 5,
      professionImage: '/images/carpenter.png',
      verified: true
    },
    {
      id: 3,
      profession: 'Painter',
      profession_ar: 'دهان',
      name: 'سعيد محمد',
      name_en: 'Said Muhammad',
      location: 'غزة - الزيتون',
      location_en: 'Gaza - Zaytoun',
      rating: 5,
      professionImage: '/images/painter.png',
      verified: true
    },
    {
      id: 4,
      profession: 'Electrician',
      profession_ar: 'كهربائي',
      name: 'اشرف عادل',
      name_en: 'Ashraf Adel',
      location: 'غزة - الرمال',
      location_en: 'Gaza - Ramla',
      rating: 5,
      professionImage: '/images/electrician.png',
      verified: true
    },
    {
      id: 5,
      profession: 'Engineer',
      profession_ar: 'مهندس',
      name: 'محمود الأشرم',
      name_en: 'Mahmoud Al-Ashram',
      location: 'غزة - بيت لاهيا',
      location_en: 'Gaza - Beit Lahia',
      rating: 5,
      professionImage: '/images/engineer.png',
      verified: true
    },
    {
      id: 6,
      profession: 'Plumber',
      profession_ar: 'سباك',
      name: 'محمود أبو عيشة',
      name_en: 'Mahmoud Abu Aisha',
      location: 'غزة - خانيونس',
      location_en: 'Gaza - Khan Yunis',
      rating: 5,
      professionImage: '/images/plumber.png',
      verified: true
    },
    {
      id: 7,
      profession: 'AC Technician',
      profession_ar: 'فني تكييف',
      name: 'رامي النجار',
      name_en: 'Rami Al-Najar',
      location: 'غزة - الرمال',
      location_en: 'Gaza - Ramla',
      rating: 5,
      professionImage: '/images/ac_technician.png',
      verified: true
    },
    {
      id: 8,
      profession: 'Tiler',
      profession_ar: 'بلاط',
      name: 'خالد مصطفى',
      name_en: 'Khaled Mustafa',
      location: 'غزة - الشجاعية',
      location_en: 'Gaza - Shjaiya',
      rating: 5,
      professionImage: '/images/tiler.png',
      verified: true
    },
    {
      id: 9,
      profession: 'Construction',
      profession_ar: 'بناء',
      name: 'يوسف عبدالله',
      name_en: 'Youssef Abdullah',
      location: 'غزة - بيت لاهيا',
      location_en: 'Gaza - Beit Lahia',
      rating: 5,
      professionImage: '/images/construction.png',
      verified: true
    }
  ]

  useEffect(() => {
    if (searchQuery) {
      const filtered = allSpecialists.filter(spec => 
        spec.profession_ar.includes(searchQuery) || 
        spec.profession.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults(allSpecialists)
    }
    window.scrollTo(0, 0)
  }, [searchQuery])

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {Array(rating).fill(null).map((_, index) => (
          <Star
            key={index}
            size={16}
            className="star-icon"
            fill="currentColor"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="search-results-page no-nav-footer">
      <div className="results-header-section">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowRight size={20} />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
          <h1 className="results-title">
            {language === 'ar' ? 'نتائج البحث عن: ' : 'Search results for: '}
            <span className="query-highlight">{searchQuery}</span>
          </h1>
          <p className="results-count">
            {results.length > 0 ? (
              language === 'ar' 
                ? `تم العثور على ${results.length} حرفي` 
                : `Found ${results.length} specialists`
            ) : (
              language === 'ar' ? 'لا توجد نتائج' : 'No results found'
            )}
          </p>
        </div>
      </div>

      <main className="results-main container">
        {results.length > 0 ? (
          <div className="results-grid">
            {results.map(specialist => (
              <div key={specialist.id} className="worker-card-modern">
                <div className="profession-image-section">
                  <img 
                    src={specialist.professionImage} 
                    alt={language === 'ar' ? specialist.name : specialist.name_en}
                    className="profession-image"
                  />
                  <div className="profession-label">
                    {language === 'ar' ? specialist.profession_ar : specialist.profession}
                  </div>
                </div>
                <div className="worker-info-bottom">
                  <div className="profile-avatar-container">
                    <div className="profile-avatar">
                      <User size={50} strokeWidth={1.5} />
                    </div>
                    {specialist.verified && <span className="verified-badge-new">✓</span>}
                  </div>

                  <div className="specialist-details">
                    <h3 className="worker-name-modern">
                      {language === 'ar' ? specialist.name : specialist.name_en}
                    </h3>

                    <div className="worker-location-modern">
                      <MapPin size={14} />
                      <span>
                        {language === 'ar' ? specialist.location : specialist.location_en}
                      </span>
                    </div>

                    <div className="worker-rating-modern">
                      {renderStars(specialist.rating)}
                    </div>

                    <button
                      className="request-service-btn-modern"
                      onClick={() => console.log('Contacting:', specialist.name)}
                    >
                      <Phone size={18} />
                      <span>{t('requestService')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* حالة عدم وجود نتائج - الرسالة المطلوبة */
          <div className="no-results-container">
            <div className="no-results-icon">
              <SearchX size={80} color="#1b3d5f" strokeWidth={1.5} />
            </div>
            <h2 className="no-results-title">
              {language === 'ar' ? 'عذراً، لم يتم العثور على حرفي' : 'Sorry, no specialist found'}
            </h2>
            <p className="no-results-text">
              {language === 'ar' 
                ? `لم نجد أي حرفيين مسجلين تحت مهنة "${searchQuery}". يرجى التأكد من كتابة المهنة بشكل صحيح أو تجربة مهنة أخرى.` 
                : `We couldn't find any specialists registered under "${searchQuery}". Please check the spelling or try another trade.`}
            </p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              {language === 'ar' ? 'العودة للبحث' : 'Back to Search'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}