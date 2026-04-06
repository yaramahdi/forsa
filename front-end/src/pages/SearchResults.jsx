import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import {
  MapPin,
  Phone,
  ArrowRight,
  SearchX,
  Briefcase,
  Loader2
} from 'lucide-react'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const DEFAULT_PROFILE_IMAGE = '/images/default-user.png'

const pageCss = `
.sr-page {
  min-height: 100vh;
  background: #f8f7ef;
  direction: rtl;
  padding: 32px 0 50px;
}

.sr-container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
}

.sr-header {
  background: #fff;
  border: 1px solid #e6edf5;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(27, 58, 92, 0.08);
}

.sr-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #cfddeb;
  color: #1b3a5c;
  border-radius: 12px;
  padding: 10px 14px;
  font-family: 'Cairo', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.sr-back-btn:hover {
  background: #eef5ff;
}

.sr-title {
  color: #1b3a5c;
  font-size: 2rem;
  font-weight: 900;
  margin: 18px 0 10px;
  line-height: 1.3;
}

.sr-title span {
  color: #2563a8;
}

.sr-count {
  color: #6a7c90;
  font-size: 1rem;
  font-weight: 700;
}

.sr-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.sr-card {
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(27, 58, 92, 0.12);
  border: 1px solid #eef2f7;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sr-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px rgba(27, 58, 92, 0.16);
}

.sr-cover {
  position: relative;
  height: 170px;
  overflow: hidden;
}

.sr-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #eef3f8;
}

.sr-profession-pill {
  position: absolute;
  top: 14px;
  right: 14px;
  background: #2d5f97;
  color: #fff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(37, 99, 168, 0.18);
}

.sr-body {
  position: relative;
  padding: 58px 18px 18px;
  text-align: center;
}

.sr-avatar-wrap {
  position: absolute;
  top: -42px;
  left: 50%;
  transform: translateX(-50%);
  width: 92px;
  height: 92px;
}

.sr-avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 5px solid #fff;
  overflow: hidden;
  background: #f3f6fb;
  box-shadow: 0 8px 20px rgba(27, 58, 92, 0.15);
}

.sr-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #f3f6fb;
  border-radius: 50%;
}

.sr-verified {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1ea84a;
  color: #fff;
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 4px 10px rgba(30, 168, 74, 0.25);
}

.sr-name {
  color: #1b3a5c;
  font-size: 1.55rem;
  font-weight: 900;
  margin-bottom: 10px;
  line-height: 1.2;
}

.sr-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #6a7c90;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 14px;
}

.sr-location svg {
  flex-shrink: 0;
}

.sr-exp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #1b3a5c;
  font-size: 1.05rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.sr-exp svg {
  color: #1b3a5c;
  flex-shrink: 0;
}

.sr-request-btn {
  width: 100%;
  border: none;
  background: #1f4772;
  color: white;
  border-radius: 14px;
  padding: 14px 16px;
  font-family: 'Cairo', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 10px 18px rgba(37, 99, 168, 0.2);
}

.sr-request-btn:hover {
  background: #16395b;
  transform: translateY(-1px);
}

.sr-empty {
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 22px;
  padding: 42px 24px;
  text-align: center;
  color: #6a7c90;
  font-weight: 700;
  box-shadow: 0 10px 28px rgba(27, 58, 92, 0.08);
}

.sr-empty-icon {
  margin-bottom: 16px;
}

.sr-empty-title {
  color: #1b3a5c;
  font-size: 1.55rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.sr-empty-text {
  color: #6a7c90;
  line-height: 1.9;
  font-size: 1rem;
  max-width: 680px;
  margin: 0 auto 18px;
}

.sr-primary-btn {
  border: none;
  background: #2563a8;
  color: #fff;
  border-radius: 12px;
  padding: 12px 20px;
  font-family: 'Cairo', sans-serif;
  font-weight: 800;
  cursor: pointer;
}

.sr-loader-spin {
  animation: srSpin 1s linear infinite;
}

@keyframes srSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .sr-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .sr-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sr-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 560px) {
  .sr-page {
    padding: 18px 0 36px;
  }

  .sr-container {
    width: min(100%, calc(100% - 20px));
  }

  .sr-header {
    padding: 18px 14px;
    border-radius: 18px;
  }

  .sr-grid {
    grid-template-columns: 1fr;
  }

  .sr-cover {
    height: 158px;
  }

  .sr-name {
    font-size: 1.35rem;
  }
}
`

const professionMeta = {
  مهندس: { key: 'engineer', en: 'Engineer', ar: 'مهندس' },
  engineer: { key: 'engineer', en: 'Engineer', ar: 'مهندس' },

  سباك: { key: 'plumber', en: 'Plumber', ar: 'سباك' },
  plumber: { key: 'plumber', en: 'Plumber', ar: 'سباك' },

  دهان: { key: 'painter', en: 'Painter', ar: 'دهان' },
  painter: { key: 'painter', en: 'Painter', ar: 'دهان' },

  نجار: { key: 'carpenter', en: 'Carpenter', ar: 'نجار' },
  carpenter: { key: 'carpenter', en: 'Carpenter', ar: 'نجار' },

  كهربائي: { key: 'electrician', en: 'Electrician', ar: 'كهربائي' },
  electrician: { key: 'electrician', en: 'Electrician', ar: 'كهربائي' },

  فني: { key: 'technician', en: 'Technician', ar: 'فني' },
  technician: { key: 'technician', en: 'Technician', ar: 'فني' },

  سائق: { key: 'driver', en: 'Driver', ar: 'سائق' },
  driver: { key: 'driver', en: 'Driver', ar: 'سائق' },

  ميكانيكي: { key: 'mechanic', en: 'Mechanic', ar: 'ميكانيكي' },
  mechanic: { key: 'mechanic', en: 'Mechanic', ar: 'ميكانيكي' }
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

function extractCraftsmen(payload) {
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

function normalizeCraftsman(item) {
  const rawProfession = String(item?.profession || '').trim()
  const professionInfo = professionMeta[rawProfession] || {}

  return {
    id: item?._id || item?.id,
    firstName: item?.firstName || '',
    lastName: item?.lastName || '',
    fullName: `${item?.firstName || ''} ${item?.lastName || ''}`.trim() || 'بدون اسم',
    profession_ar: professionInfo.ar || rawProfession || 'غير محدد',
    profession_en: professionInfo.en || rawProfession || 'Unknown',
    professionKey: professionInfo.key || rawProfession.toLowerCase(),
    city: item?.city || '',
    neighborhood: item?.neighborhood || '',
    yearsOfExperience: Number(item?.yearsOfExperience ?? 0),
    profileImage: resolveImage(item?.profileImage || ''),
    verified: true
  }
}

function getCraftsmanLocation(craftsman) {
  return [craftsman?.city, craftsman?.neighborhood].filter(Boolean).join(' - ') || 'الموقع غير محدد'
}

function getCraftsmanProfession(craftsman, language) {
  return language === 'ar' ? craftsman.profession_ar : craftsman.profession_en
}

function getProfessionBackgroundImage(craftsman) {
  return professionImageMap[craftsman?.professionKey] || '/images/craftsman.png'
}

function getProfileImage(craftsman) {
  return craftsman?.profileImage || DEFAULT_PROFILE_IMAGE
}

export default function SearchResults() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const searchQuery = (queryParams.get('q') || '').trim()

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const pageTitle = useMemo(() => {
    if (!searchQuery) {
      return language === 'ar' ? 'كل الحرفيين' : 'All craftsmen'
    }

    return language === 'ar'
      ? `نتائج البحث عن: ${searchQuery}`
      : `Search results for: ${searchQuery}`
  }, [searchQuery, language])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError('')

        const url = searchQuery
          ? `${API_BASE_URL}/api/craftsmen?search=${encodeURIComponent(searchQuery)}`
          : `${API_BASE_URL}/api/craftsmen`

        const response = await fetch(url)
        const payload = await readJsonSafe(response)

        const isSuccess =
          response.ok &&
          (payload?.success === true || payload?.status?.status === true)

        if (!isSuccess) {
          throw new Error(
            payload?.message ||
            payload?.status?.message ||
            'حدث خطأ أثناء جلب نتائج البحث'
          )
        }

        const normalized = extractCraftsmen(payload).map(normalizeCraftsman)
        setResults(normalized)
      } catch (err) {
        setResults([])
        setError(err.message || 'تعذر الاتصال بالسيرفر')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
    window.scrollTo(0, 0)
  }, [searchQuery])

  return (
    <div className="sr-page">
      <style>{pageCss}</style>

      <div className="sr-container">
        <div className="sr-header">
          <button className="sr-back-btn" onClick={() => navigate('/')}>
            <ArrowRight size={20} />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>

          <h1 className="sr-title">
            {language === 'ar' ? 'نتائج البحث عن: ' : 'Search results for: '}
            <span>{searchQuery || (language === 'ar' ? 'كل الحرفيين' : 'All craftsmen')}</span>
          </h1>

          {!loading && !error ? (
            <p className="sr-count">
              {results.length > 0 ? (
                language === 'ar'
                  ? `تم العثور على ${results.length} حرفي`
                  : `Found ${results.length} craftsmen`
              ) : (
                language === 'ar'
                  ? 'لا توجد نتائج'
                  : 'No results found'
              )}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="sr-empty">
            <div className="sr-empty-icon">
              <Loader2 size={78} color="#1b3d5f" strokeWidth={1.5} className="sr-loader-spin" />
            </div>
            <h2 className="sr-empty-title">
              {language === 'ar' ? 'جاري تحميل النتائج...' : 'Loading results...'}
            </h2>
          </div>
        ) : error ? (
          <div className="sr-empty">
            <div className="sr-empty-icon">
              <SearchX size={80} color="#1b3d5f" strokeWidth={1.5} />
            </div>
            <h2 className="sr-empty-title">
              {language === 'ar' ? 'تعذر تحميل النتائج' : 'Failed to load results'}
            </h2>
            <p className="sr-empty-text">{error}</p>
            <button className="sr-primary-btn" onClick={() => navigate('/')}>
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </div>
        ) : results.length > 0 ? (
          <div className="sr-grid">
            {results.map((craftsman) => (
              <div key={craftsman.id} className="sr-card">
                <div className="sr-cover">
                  <img
                    src={getProfessionBackgroundImage(craftsman)}
                    alt={getCraftsmanProfession(craftsman, language)}
                  />
                  <div className="sr-profession-pill">
                    {getCraftsmanProfession(craftsman, language)}
                  </div>
                </div>

                <div className="sr-body">
                  <div className="sr-avatar-wrap">
                    <div className="sr-avatar">
                      <img
                        src={getProfileImage(craftsman)}
                        alt={craftsman.fullName}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                        }}
                      />
                    </div>
                    {craftsman.verified && <span className="sr-verified">✓</span>}
                  </div>

                  <h3 className="sr-name">{craftsman.fullName}</h3>

                  <div className="sr-location">
                    <MapPin size={14} />
                    <span>{getCraftsmanLocation(craftsman)}</span>
                  </div>

                  <div className="sr-exp">
                    <Briefcase size={16} />
                    <span>
                      {language === 'ar'
                        ? `${craftsman.yearsOfExperience} سنوات خبرة`
                        : `${craftsman.yearsOfExperience} years experience`}
                    </span>
                  </div>

                  <button
                    className="sr-request-btn"
                    onClick={() => navigate(`/craftsman/${craftsman.id}`)}
                    type="button"
                  >
                    <Phone size={18} />
                    <span>{t('requestService')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sr-empty">
            <div className="sr-empty-icon">
              <SearchX size={80} color="#1b3d5f" strokeWidth={1.5} />
            </div>
            <h2 className="sr-empty-title">
              {language === 'ar' ? 'عذراً، لم يتم العثور على حرفي' : 'Sorry, no craftsman found'}
            </h2>
            <p className="sr-empty-text">
              {language === 'ar'
                ? `لم نجد أي حرفيين يطابقون "${searchQuery}". يمكنك تجربة البحث بالاسم أو المهنة أو الحي.`
                : `We couldn't find any craftsmen matching "${searchQuery}". Try searching by name, profession, or neighborhood.`}
            </p>
            <button className="sr-primary-btn" onClick={() => navigate('/')}>
              {language === 'ar' ? 'العودة للبحث' : 'Back to Search'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}