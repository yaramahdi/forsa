import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { MapPin, ChevronLeft, ChevronRight, Phone } from 'lucide-react'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const FEATURED_ENDPOINT = `${API_BASE_URL}/api/craftsmen/featured`

const sectionCss = `
.specialists-section {
  position: relative;
  padding: 20px 0 10px;
}

.specialists-title {
  color: var(--forsa-blue);
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 26px;
  text-align: right;
}

.specialists-wrapper {
  position: relative;
  padding: 0 6px;
}

.specialists-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 56px 16px;
  scrollbar-width: none;
}

.specialists-arrow.left {
  left: 8px;
}

.specialists-arrow.right {
  right: 8px;
}

.specialists-scroll::-webkit-scrollbar {
  display: none;
}

.specialist-card {
  min-width: 250px;
  max-width: 250px;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(27, 58, 92, 0.12);
  border: 1px solid #eef2f7;
  flex-shrink: 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.specialist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px rgba(27, 58, 92, 0.16);
}

.specialist-cover {
  position: relative;
  height: 142px;
  overflow: hidden;
}

.specialist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #eef3f8;
}

.specialist-body {
  position: relative;
  padding: 42px 16px 18px;
  text-align: center;
}

.specialist-avatar-wrap {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  width: 78px;
  height: 78px;
}

.specialist-avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 4px solid #fff;
  overflow: hidden;
  background: #f3f6fb;
  box-shadow: 0 8px 20px rgba(27, 58, 92, 0.15);
}

.specialist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #f3f6fb;
}

.specialist-verified {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1ea84a;
  color: #fff;
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 4px 10px rgba(30, 168, 74, 0.25);
}

.specialist-name {
  color: var(--forsa-blue);
  font-size: 1.4rem;
  font-weight: 900;
  margin-bottom: 10px;
  line-height: 1.2;
}

.specialist-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #6a7c90;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.specialist-profession-text {
  color: #1b3a5c;
  font-size: 0.96rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: #eef5ff;
  border: 1px solid #d7e6fb;
  border-radius: 999px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.specialist-request-btn {
  width: 100%;
  border: none;
  background: var(--forsa-blue);
  color: white;
  border-radius: 12px;
  padding: 12px 14px;
  font-family: 'Cairo', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 10px 18px rgba(37, 99, 168, 0.2);
}

.specialist-request-btn:hover {
  background: #1b3a5c;
  transform: translateY(-1px);
}

.specialists-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--forsa-blue);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(27, 58, 92, 0.22);
  z-index: 20;
  transition: 0.2s ease;
}

.specialists-arrow:hover {
  background: #1b3a5c;
}



.specialists-arrow:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.specialists-empty {
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 18px;
  padding: 24px;
  text-align: center;
  color: #6a7c90;
  font-weight: 700;
}

@media (max-width: 768px) {
  .specialists-title {
    font-size: 1.55rem;
  }

  .specialist-card {
    min-width: 220px;
    max-width: 220px;
  }

  .specialist-cover {
    height: 128px;
  }

  .specialists-arrow {
    display: none;
  }
}
`

const professionMeta = {
  مهندس: { key: 'engineer', en: 'Engineer' },
  engineer: { key: 'engineer', ar: 'مهندس', en: 'Engineer' },

  سباك: { key: 'plumber', en: 'Plumber' },
  plumber: { key: 'plumber', ar: 'سباك', en: 'Plumber' },

  دهان: { key: 'painter', en: 'Painter' },
  painter: { key: 'painter', ar: 'دهان', en: 'Painter' },

  نجار: { key: 'carpenter', en: 'Carpenter' },
  carpenter: { key: 'carpenter', ar: 'نجار', en: 'Carpenter' },

  كهربائي: { key: 'electrician', en: 'Electrician' },
  electrician: { key: 'electrician', ar: 'كهربائي', en: 'Electrician' },

  فني: { key: 'technician', en: 'Technician' },
  technician: { key: 'technician', ar: 'فني', en: 'Technician' },

  سائق: { key: 'driver', en: 'Driver' },
  driver: { key: 'driver', ar: 'سائق', en: 'Driver' },

  ميكانيكي: { key: 'mechanic', en: 'Mechanic' },
  mechanic: { key: 'mechanic', ar: 'ميكانيكي', en: 'Mechanic' }
}

const professionImageMap = {
  engineer: '/images/engineer.png',
  plumber: '/images/plumber.png',
  painter: '/images/painter.png',
  carpenter: '/images/carpenter.png',
  electrician: '/images/electrician.png',
  technician: '/images/engineer.png',
  driver: '/images/plumber.png',
  mechanic: '/images/engineer.png'
}

function readJsonSafe(response) {
  return response.json().catch(() => null)
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.craftsmen)) return payload.craftsmen
  if (Array.isArray(payload?.data?.craftsmen)) return payload.data.craftsmen
  return []
}

function resolveImage(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/uploads')) return `${API_BASE_URL}${src}`
  return src
}

function normalizeSpecialist(item) {
  const rawProfession = String(item?.profession || '').trim()
  const professionInfo = professionMeta[rawProfession] || {}

  return {
    id: item?._id || item?.id,
    firstName: item?.firstName || '',
    lastName: item?.lastName || '',
    city: item?.city || '',
    neighborhood: item?.neighborhood || '',
    profileImage: item?.profileImage || '',
    verified: true,
    professionKey: professionInfo.key || rawProfession.toLowerCase(),
    profession_ar: professionInfo.ar || rawProfession || 'غير محدد',
    profession_en: professionInfo.en || rawProfession || 'Unknown'
  }
}

function getProfessionBackgroundImage(specialist) {
  return professionImageMap[specialist?.professionKey] || '/images/craftsman.png'
}

function getProfileImage(specialist) {
  return resolveImage(specialist?.profileImage) || '/images/default-user.png'
}

export default function Specialists({ searchProfession }) {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  const [allSpecialists, setAllSpecialists] = useState([])
  const [displayedSpecialists, setDisplayedSpecialists] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true)

        const response = await fetch(FEATURED_ENDPOINT)
        const payload = await readJsonSafe(response)

        if (!response.ok) {
          throw new Error(payload?.status?.message || payload?.message || 'Failed to fetch featured craftsmen')
        }

        const normalized = extractList(payload).map(normalizeSpecialist)
        setAllSpecialists(normalized)
      } catch (error) {
        console.error('Failed to fetch featured craftsmen:', error)
        setAllSpecialists([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  const specialistsData = useMemo(() => allSpecialists, [allSpecialists])

  useEffect(() => {
    if (searchProfession) {
      const normalizedSearchAr = String(searchProfession.name || '').trim()
      const normalizedSearchEn = String(searchProfession.name_en || '').trim().toLowerCase()

      const filtered = specialistsData.filter((spec) => {
        return (
          spec.profession_ar === normalizedSearchAr ||
          spec.profession_en.toLowerCase() === normalizedSearchEn ||
          spec.professionKey === normalizedSearchEn
        )
      })

      setDisplayedSpecialists(filtered)
    } else {
      setDisplayedSpecialists(specialistsData)
    }
  }, [searchProfession, specialistsData])

const checkScroll = () => {
  const container = scrollContainerRef.current
  if (!container) return

  const cards = container.querySelectorAll('.specialist-card')
  if (!cards.length) {
    setCanScrollLeft(false)
    setCanScrollRight(false)
    return
  }

  const containerRect = container.getBoundingClientRect()
  const firstCardRect = cards[0].getBoundingClientRect()
  const lastCardRect = cards[cards.length - 1].getBoundingClientRect()

  // لأن الصفحة RTL:
  // أول عنصر يكون على اليمين، وآخر عنصر يكون على اليسار
  const hasMoreOnLeft = lastCardRect.left < containerRect.left - 4
  const hasMoreOnRight = firstCardRect.right > containerRect.right + 4

  setCanScrollLeft(hasMoreOnLeft)
  setCanScrollRight(hasMoreOnRight)
}

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'auto'
      })
      checkScroll()
    }
  }, [displayedSpecialists])
  useEffect(() => {
    const container = scrollContainerRef.current
    checkScroll()

    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)

      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [displayedSpecialists])

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return

    const amount = 320
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    })
  }

  const handleRequestService = (specialist) => {
    console.log('Request service from:', specialist)
  }

  const getSpecialistName = (specialist) => {
    return `${specialist.firstName} ${specialist.lastName}`.trim() || 'بدون اسم'
  }

  const getSpecialistLocation = (specialist) => {
    const city = specialist.city || ''
    const neighborhood = specialist.neighborhood || ''
    return [city, neighborhood].filter(Boolean).join(' - ') || 'الموقع غير محدد'
  }

  const getSpecialistProfession = (specialist) => {
    return language === 'ar'
      ? specialist.profession_ar
      : specialist.profession_en
  }

  return (
    <section className="specialists container" id="search-results">
      <style>{sectionCss}</style>

      <div className="specialists-section">
        <h2 className="specialists-title">
          {searchProfession ? t('searchResults') : t('specialistsTitle')}
        </h2>

        {loading ? (
          <div className="specialists-empty">
            <p>جاري تحميل الحرفيين المميزين...</p>
          </div>
        ) : displayedSpecialists.length > 0 ? (
          <div className="specialists-wrapper">
            <button
              className="specialists-arrow left"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              type="button"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="specialists-scroll" ref={scrollContainerRef}>
              {displayedSpecialists.map((specialist) => (
                <div key={specialist.id} className="specialist-card">
                  <div className="specialist-cover">
                    <img
                      src={getProfessionBackgroundImage(specialist)}
                      alt={getSpecialistProfession(specialist)}
                    />
                  </div>

                  <div className="specialist-body">
                    <div className="specialist-avatar-wrap">
                      <div className="specialist-avatar">
                        <img
                          src={getProfileImage(specialist)}
                          alt={getSpecialistName(specialist)}
                        />
                      </div>

                      {specialist.verified && (
                        <span className="specialist-verified">✓</span>
                      )}
                    </div>

                    <h3 className="specialist-name">
                      {getSpecialistName(specialist)}
                    </h3>

                    <div className="specialist-location">
                      <MapPin size={14} />
                      <span>{getSpecialistLocation(specialist)}</span>
                    </div>

                    <div className="specialist-profession-text">
                      {getSpecialistProfession(specialist)}
                    </div>

                    <button
                      className="specialist-request-btn"
                      onClick={() => handleRequestService(specialist)}
                      type="button"
                    >
                      <Phone size={18} />
                      <span>{t('requestService')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="specialists-arrow right"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              type="button"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <div className="specialists-empty">
            <p>{t('noResults')}</p>
          </div>
        )}
      </div>
    </section>
  )
}