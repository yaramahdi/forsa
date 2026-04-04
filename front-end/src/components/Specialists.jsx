import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { MapPin, Star, MessageSquare, ChevronLeft, ChevronRight, Phone, User } from 'lucide-react'

export default function Specialists({ searchProfession }) {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key
  const [displayedSpecialists, setDisplayedSpecialists] = useState([])
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [forceShowArrows, setForceShowArrows] = useState(true)

  // قاعدة بيانات شاملة للحرفيين (ستُستبدل بـ API لاحقاً)
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
      image: '👨‍🔧',
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
      image: '👨‍🔨',
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
      image: '👨‍🎨',
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
      image: '⚡',
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
      image: '📐',
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
      image: '👨‍🔧',
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
      image: '❄️',
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
      image: '🧱',
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
      image: '🏗️',
      professionImage: '/images/construction.png',
      verified: true
    }
  ]

  useEffect(() => {
    // إذا كانت هناك عملية بحث، فلتّر النتائج
    if (searchProfession) {
      const filtered = allSpecialists.filter(spec =>
        spec.profession === searchProfession.name_en ||
        spec.profession_ar === searchProfession.name
      )
      setDisplayedSpecialists(filtered.length > 0 ? filtered : allSpecialists)
    } else {
      setDisplayedSpecialists(allSpecialists)
    }
  }, [searchProfession])

  // التحقق من إمكانية التمرير
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      // إجبار إظهار الأسهم في البداية
      setTimeout(() => setForceShowArrows(true), 100)
      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [displayedSpecialists])

  // دوال التمرير
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const container = scrollContainerRef.current
      console.log(`تمرير ${direction}, الموضع الحالي:`, container.scrollLeft)
      
      // محاولة scrollBy أولاً
      if (typeof container.scrollBy === 'function') {
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        })
      } else {
        // fallback للمتصفحات القديمة
        const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
        smoothScroll(container, targetScroll)
      }
    }
  }

  // دالة smooth scroll للمتصفحات التي لا تدعمها
  const smoothScroll = (element, targetScroll) => {
    const startScroll = element.scrollLeft
    const distance = targetScroll - startScroll
    const duration = 500
    const startTime = Date.now()

    const animateScroll = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      element.scrollLeft = startScroll + distance * easeInOutQuad(progress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    animateScroll()
  }

  // دالة التسريع للـ smooth scroll
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const renderStars = (rating) => {
    return Array(rating).fill('⭐').join('')
  }

  const handleRequestService = (specialist) => {
    console.log('Requesting service from:', specialist.name)
    // سيتم توجيهه لصفحة الطلب لاحقاً
  }

  return (
    <section className="specialists container" id="search-results">
      <h2 className="title-dark">
        {searchProfession ? t('searchResults') : t('specialistsTitle')}
      </h2>
      
      {displayedSpecialists.length > 0 ? (
        <div className="scroll-container-wrapper">
          {/* سهم اليسار */}
          {forceShowArrows && (
            <button 
              className="scroll-arrow scroll-left-arrow"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              title="تمرير للخلف"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* حاوية البطاقات */}
          <div className="grid-workers" ref={scrollContainerRef}>
            {displayedSpecialists.map(specialist => (
              <div key={specialist.id} className="worker-card-modern">
                {/* صورة المهنة - الجزء العلوي */}
                <div className="profession-image-section">
                  <img 
                    src={specialist.professionImage} 
                    alt={language === 'ar' ? specialist.profession_ar : specialist.profession}
                    className="profession-image"
                  />
                  <div className="profession-label">
                    {language === 'ar' ? specialist.profession_ar : specialist.profession}
                  </div>
                </div>
                <div className="worker-info-bottom">
                  {/* أيقونة الشخص - دائرية في المنتصف */}
                  <div className="profile-avatar-container">
                    <div className="profile-avatar">
                      <User size={50} strokeWidth={1.5} />
                    </div>
                    {specialist.verified && <span className="verified-badge-new">✓</span>}
                  </div>

                  {/* بيانات الحرفي */}
                  <div className="specialist-details">
                    {/* اسم الحرفي */}
                    <h3 className="worker-name-modern">
                      {language === 'ar' ? specialist.name : specialist.name_en}
                    </h3>

                    {/* الموقع الجغرافي */}
                    <div className="worker-location-modern">
                      <MapPin size={14} />
                      <span>
                        {language === 'ar' ? specialist.location : specialist.location_en}
                      </span>
                    </div>

                    {/* التقييم */}
                    <div className="worker-rating-modern">
                      <span className="stars">{renderStars(specialist.rating)}</span>
                    </div>

                    {/* زر الطلب */}
                    <button
                      className="request-service-btn-modern"
                      onClick={() => handleRequestService(specialist)}
                      title={language === 'ar' ? 'تواصل مع الحرفي' : 'Contact the specialist'}
                    >
                      <Phone size={18} />
                      <span>{t('requestService')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* سهم اليمين */}
          {forceShowArrows && (
            <button 
              className="scroll-arrow scroll-right-arrow"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              title="تمرير للأمام"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      ) : (
        <div className="no-results-message">
          <p>{t('noResults')}</p>
        </div>
      )}
    </section>
  )
}
