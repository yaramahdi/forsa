import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  Search,
  MapPin,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  CircleDollarSign,
  X,
} from 'lucide-react'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const ALL_CRAFTSMEN_ENDPOINT = `${API_BASE_URL}/api/craftsmen`
const DEFAULT_PROFILE_IMAGE = '/images/default-user.png'
const PER_PAGE = 10

const pageCss = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}

.all-craftsmen-page {
  direction: rtl;
  font-family: 'Cairo', sans-serif;
  background: linear-gradient(180deg, #f4f8fd 0%, #eef4fb 100%);
  min-height: 100vh;
  padding: 28px 16px 40px;
}

.all-craftsmen-shell {
  max-width: 1280px;
  margin: 0 auto;
}

.all-craftsmen-header {
  margin-bottom: 22px;
}

.all-craftsmen-title {
  color: #1b3a5c;
  font-family: 'Tajawal', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  margin: 0 0 8px;
}

.all-craftsmen-subtitle {
  color: #5f7390;
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
}

.all-craftsmen-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.ac-sidebar {
  position: sticky;
  top: 92px;
}

.ac-sidebar-card,
.ac-main-card {
  background: #fff;
  border: 1px solid #dbe6f2;
  border-radius: 24px;
  box-shadow: 0 14px 34px rgba(27, 58, 92, 0.08);
}

.ac-sidebar-card {
  padding: 18px;
}

.ac-sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1b3a5c;
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e7eef7;
}

.ac-filter-group + .ac-filter-group {
  margin-top: 18px;
}

.ac-filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1b3a5c;
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.ac-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 230px;
  overflow: auto;
  padding-left: 4px;
}

.ac-checkbox-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: #f8fbff;
  border: 1px solid #e2ecf6;
  border-radius: 14px;
  padding: 9px 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

.ac-checkbox-item:hover {
  border-color: #bfd5ef;
  background: #f2f8ff;
}

.ac-checkbox-item input {
  accent-color: #2563a8;
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.ac-checkbox-text {
  flex: 1;
  color: #24486d;
  font-size: 0.92rem;
  font-weight: 600;
}

.ac-checkbox-count {
  color: #6f85a2;
  background: #eaf2fb;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.ac-price-row {
  display: grid;
  grid-template-columns: 1fr 22px 1fr;
  gap: 8px;
  align-items: center;
}

.ac-price-separator {
  color: #6c7f98;
  text-align: center;
  font-weight: 700;
}

.ac-price-input {
  width: 100%;
  border: 1px solid #d8e4f0;
  background: #f8fbff;
  color: #1b3a5c;
  border-radius: 14px;
  padding: 10px 12px;
  outline: none;
  font-family: 'Cairo', sans-serif;
  font-size: 0.92rem;
  text-align: center;
}

.ac-price-input:focus {
  border-color: #2563a8;
  background: #fff;
}

.ac-price-note {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #7a8ea9;
  line-height: 1.7;
  background: #f7fbff;
  border: 1px dashed #d6e5f5;
  border-radius: 14px;
  padding: 10px 12px;
}

.ac-clear-btn {
  width: 100%;
  margin-top: 18px;
  border: 1px solid #d8e4f0;
  background: transparent;
  color: #5f7390;
  border-radius: 14px;
  padding: 11px 14px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.ac-clear-btn:hover {
  background: #f4f8fd;
  color: #1b3a5c;
  border-color: #bfd5ef;
}

.ac-main-card {
  padding: 18px;
  min-width: 0;
}

.ac-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.ac-search-wrap {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.ac-search-input {
  width: 100%;
  height: 48px;
  border: 1px solid #d8e4f0;
  background: #f8fbff;
  color: #1b3a5c;
  border-radius: 16px;
  padding: 12px 44px 12px 14px;
  outline: none;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
}

.ac-search-input:focus {
  border-color: #2563a8;
  background: #fff;
}

.ac-search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6f85a2;
  pointer-events: none;
}

.ac-results-chip {
  background: #edf5ff;
  color: #2563a8;
  border: 1px solid #cfe0f5;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 0.88rem;
  font-weight: 800;
  white-space: nowrap;
}

.ac-active-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.ac-active-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #eef5ff;
  color: #2563a8;
  border: 1px solid #d4e4f7;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.84rem;
  font-weight: 700;
}

.ac-active-tag button {
  border: none;
  background: transparent;
  color: #2563a8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0;
}

.ac-list-head {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) 160px 155px 125px 150px;
  gap: 12px;
  padding: 0 14px 12px;
  color: #67809f;
  font-size: 0.84rem;
  font-weight: 800;
  border-bottom: 1px solid #e7eef7;
}

.ac-list {
  display: flex;
  flex-direction: column;
}

.ac-row {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) 160px 155px 125px 150px;
  gap: 12px;
  align-items: center;
  padding: 16px 14px;
  border-bottom: 1px solid #eef3f8;
  transition: 0.2s ease;
}

.ac-row:last-child {
  border-bottom: none;
}

.ac-row:hover {
  background: #fbfdff;
}

.ac-user {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.ac-avatar {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e1edf9;
  background: #f3f8ff;
  flex-shrink: 0;
}

.ac-user-info {
  min-width: 0;
}

.ac-name {
  color: #1b3a5c;
  font-size: 1rem;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ac-profession {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  padding: 5px 11px;
  border-radius: 999px;
  background: #eef5ff;
  color: #2563a8;
  border: 1px solid #d7e6fb;
  font-size: 0.82rem;
  font-weight: 800;
}

.ac-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #6d819a;
  font-size: 0.84rem;
  font-weight: 600;
}

.ac-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.ac-col {
  color: #1f3855;
  font-size: 0.92rem;
  font-weight: 700;
}

.ac-col-muted {
  color: #70859f;
  font-weight: 600;
  font-size: 0.88rem;
}

.ac-phone {
  direction: ltr;
  display: inline-block;
  text-align: right;
}

.ac-price-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f5f9ff;
  border: 1px solid #d7e6fb;
  color: #1b3a5c;
  font-size: 0.85rem;
  font-weight: 800;
}

.ac-request-btn {
  width: 100%;
  border: none;
  background: #2563a8;
  color: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.22s ease;
  box-shadow: 0 10px 18px rgba(37, 99, 168, 0.2);
}

.ac-request-btn:hover {
  background: #1b3a5c;
  transform: translateY(-1px);
}

.ac-request-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.ac-empty,
.ac-loading,
.ac-error {
  text-align: center;
  padding: 40px 16px;
  border-radius: 20px;
  background: #fbfdff;
  border: 1px dashed #d8e4f0;
  color: #617894;
}

.ac-empty-title,
.ac-loading-title,
.ac-error-title {
  color: #1b3a5c;
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.ac-empty-desc,
.ac-loading-desc,
.ac-error-desc {
  font-size: 0.93rem;
  line-height: 1.8;
}

.ac-empty-btn {
  margin-top: 16px;
  border: none;
  background: #2563a8;
  color: #fff;
  border-radius: 14px;
  padding: 11px 16px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
}

.ac-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.ac-page-btn {
  min-width: 40px;
  height: 40px;
  border: 1px solid #d8e4f0;
  background: #fff;
  color: #1b3a5c;
  border-radius: 12px;
  padding: 0 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.ac-page-btn:hover {
  background: #f3f8ff;
  border-color: #bfd5ef;
}

.ac-page-btn.active {
  background: #2563a8;
  color: #fff;
  border-color: #2563a8;
}

.ac-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ac-page-dots {
  color: #7990ac;
  font-weight: 800;
  padding: 0 4px;
}

.ac-mobile-card-list {
  display: none;
}

@media (max-width: 1100px) {
  .ac-list-head,
  .ac-row {
    grid-template-columns: minmax(0, 1.4fr) 140px 140px 110px 140px;
  }
}

@media (max-width: 920px) {
  .all-craftsmen-layout {
    grid-template-columns: 1fr;
  }

  .ac-sidebar {
    position: static;
  }

  .ac-list-head {
    display: none;
  }

  .ac-list {
    display: none;
  }

  .ac-mobile-card-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ac-mobile-card {
    border: 1px solid #e7eef7;
    border-radius: 20px;
    padding: 14px;
    background: #fff;
  }

  .ac-mobile-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .ac-mobile-middle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }

  .ac-mobile-box {
    background: #f7fbff;
    border: 1px solid #e3edf8;
    border-radius: 14px;
    padding: 10px;
  }

  .ac-mobile-box-label {
    color: #6f85a2;
    font-size: 0.78rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .ac-mobile-box-value {
    color: #1b3a5c;
    font-size: 0.88rem;
    font-weight: 800;
  }
}

@media (max-width: 640px) {
  .all-craftsmen-title {
    font-size: 1.6rem;
  }

  .ac-mobile-middle {
    grid-template-columns: 1fr;
  }

  .ac-topbar {
    align-items: stretch;
  }

  .ac-search-wrap {
    min-width: 0;
  }

  .ac-results-chip {
    width: 100%;
    text-align: center;
  }
}
`

const professionMeta = {
  engineer: { key: 'engineer', ar: 'مهندس', en: 'Engineer' },
  plumber: { key: 'plumber', ar: 'سباك', en: 'Plumber' },
  painter: { key: 'painter', ar: 'دهان', en: 'Painter' },
  carpenter: { key: 'carpenter', ar: 'نجار', en: 'Carpenter' },
  electrician: { key: 'electrician', ar: 'كهربائي', en: 'Electrician' },
  technician: { key: 'technician', ar: 'فني', en: 'Technician' },
  driver: { key: 'driver', ar: 'سائق', en: 'Driver' },
  mechanic: { key: 'mechanic', ar: 'ميكانيكي', en: 'Mechanic' },

  مهندس: { key: 'engineer', ar: 'مهندس', en: 'Engineer' },
  سباك: { key: 'plumber', ar: 'سباك', en: 'Plumber' },
  'سبّاك': { key: 'plumber', ar: 'سباك', en: 'Plumber' },
  دهان: { key: 'painter', ar: 'دهان', en: 'Painter' },
  نجار: { key: 'carpenter', ar: 'نجار', en: 'Carpenter' },
  كهربائي: { key: 'electrician', ar: 'كهربائي', en: 'Electrician' },
  فني: { key: 'technician', ar: 'فني', en: 'Technician' },
  سائق: { key: 'driver', ar: 'سائق', en: 'Driver' },
  ميكانيكي: { key: 'mechanic', ar: 'ميكانيكي', en: 'Mechanic' },
}

const regionOrder = ['غزة', 'شمال غزة', 'الوسطى', 'الجنوب']

function readJsonSafe(response) {
  return response.json().catch(() => null)
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.craftsmen)) return payload.craftsmen
  if (Array.isArray(payload?.data?.craftsmen)) return payload.data.craftsmen
  if (Array.isArray(payload?.data?.craftsmenList)) return payload.data.craftsmenList
  return []
}

function resolveImage(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/uploads')) return `${API_BASE_URL}${src}`
  return src
}

function getCurrentLoggedInCraftsmanId() {
  if (typeof window === 'undefined') return ''
  try {
    const raw = window.localStorage.getItem('forsaCraftsman')
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    return String(parsed?._id || parsed?.id || '').trim()
  } catch {
    return ''
  }
}

function normalizePriceValue(item) {
  const candidates = [
    item?.price,
    item?.hourlyRate,
    item?.servicePrice,
    item?.startingPrice,
    item?.minPrice,
    item?.priceRange?.min,
  ]

  const found = candidates.find((value) => value !== undefined && value !== null && value !== '')
  if (found === undefined) return null

  const numeric = Number(found)
  return Number.isFinite(numeric) ? numeric : null
}

function normalizeCraftsman(item) {
  const rawProfession = String(item?.profession || '').trim()
  const professionInfo = professionMeta[rawProfession] || {
    key: rawProfession.toLowerCase(),
    ar: rawProfession || 'غير محدد',
    en: rawProfession || 'Unknown',
  }

  const firstName = item?.firstName || ''
  const lastName = item?.lastName || ''

  return {
    id: item?._id || item?.id || '',
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim() || 'بدون اسم',
    professionKey: professionInfo.key,
    professionAr: professionInfo.ar,
    professionEn: professionInfo.en,
    city: item?.city || '',
    neighborhood: item?.neighborhood || '',
    phone: item?.phone || '',
    email: item?.email || '',
    years: Number(item?.yearsOfExperience ?? item?.years ?? 0),
    profileImage: item?.profileImage || item?.avatar || item?.image || '',
    featured: Boolean(item?.featured ?? item?.isFeatured ?? false),
    price: normalizePriceValue(item),
  }
}

function getPageNumbers(totalPages, currentPage) {
  const pages = []

  for (let i = 1; i <= totalPages; i += 1) {
    const shouldShow =
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 1

    if (shouldShow) {
      pages.push(i)
    } else {
      const prev = pages[pages.length - 1]
      if (prev !== 'dots') {
        pages.push('dots')
      }
    }
  }

  return pages
}

export default function AllCraftsmen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useLanguage()
  const currentLoggedInCraftsmanId = useMemo(() => getCurrentLoggedInCraftsmanId(), [])

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'استعراض كل الحرفيين',
            subtitle:
              'تصفّح جميع الحرفيين المسجلين في المنصة، حتى لو لم تكن حرفتهم موجودة ضمن التصنيفات الرئيسية.',
            filtersTitle: 'تصفية النتائج',
            searchPlaceholder: 'ابحث بالاسم، الحرفة، المنطقة أو رقم الهاتف',
            resultsCount: 'حرفي',
            profession: 'الحرفة',
            region: 'المنطقة',
            price: 'رينج الأسعار',
            priceFrom: 'من',
            priceTo: 'إلى',
            priceUnknown: 'السعر غير محدد',
            pricePerHour: '₪ / ساعة',
            noPriceData:
              'حقل السعر غير موجود حالياً في بيانات الحرفيين، لذلك هذا الفلتر جاهز وسيعمل مباشرة بعد إضافة السعر في الباك.',
            experience: 'الخبرة',
            years: 'سنة',
            location: 'الموقع',
            phone: 'رقم الهاتف',
            requestService: 'اطلب الخدمة',
            clearFilters: 'مسح الفلاتر',
            noResultsTitle: 'لا توجد نتائج مطابقة',
            noResultsDesc: 'جرّبي تعديل الفلاتر أو البحث بكلمة أخرى.',
            clearResultsFilters: 'إزالة الفلاتر',
            loadingTitle: 'جاري تحميل الحرفيين',
            loadingDesc: 'يرجى الانتظار قليلاً حتى يتم جلب البيانات.',
            errorTitle: 'تعذر تحميل البيانات',
            errorDesc: 'حدث خطأ أثناء جلب الحرفيين من قاعدة البيانات.',
            retry: 'إعادة المحاولة',
            allRegions: 'كل المناطق',
            page: 'صفحة',
            of: 'من',
            badgeFeatured: 'مميز',
            locationUnknown: 'الموقع غير محدد',
            phoneUnknown: 'لا يوجد رقم',
          }
        : {
            title: 'Browse All Craftsmen',
            subtitle:
              'View all craftsmen registered on the platform, even if their profession is not part of the main categories.',
            filtersTitle: 'Filter Results',
            searchPlaceholder: 'Search by name, profession, region or phone',
            resultsCount: 'craftsmen',
            profession: 'Profession',
            region: 'Region',
            price: 'Price Range',
            priceFrom: 'From',
            priceTo: 'To',
            priceUnknown: 'Price not specified',
            pricePerHour: '₪ / hour',
            noPriceData:
              'Price is not currently stored in craftsmen data. This filter is ready and will start working once the backend sends a price field.',
            experience: 'Experience',
            years: 'years',
            location: 'Location',
            phone: 'Phone',
            requestService: 'Request Service',
            clearFilters: 'Clear Filters',
            noResultsTitle: 'No matching results',
            noResultsDesc: 'Try changing filters or searching with another keyword.',
            clearResultsFilters: 'Reset Filters',
            loadingTitle: 'Loading craftsmen',
            loadingDesc: 'Please wait while data is being fetched.',
            errorTitle: 'Failed to load data',
            errorDesc: 'Something went wrong while fetching craftsmen from the database.',
            retry: 'Try Again',
            allRegions: 'All regions',
            page: 'Page',
            of: 'of',
            badgeFeatured: 'Featured',
            locationUnknown: 'Location not specified',
            phoneUnknown: 'No phone',
          },
    [language]
  )

  const params = new URLSearchParams(location.search)
  const initialProfessionParam = params.get('profession') || ''

  const [allCraftsmen, setAllCraftsmen] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedProfessions, setSelectedProfessions] = useState([])
  const [selectedRegions, setSelectedRegions] = useState([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!initialProfessionParam) return

    const professionInfo =
      professionMeta[initialProfessionParam] ||
      professionMeta[String(initialProfessionParam).trim()] ||
      null

    if (!professionInfo?.key) return

    setSelectedProfessions([professionInfo.key])
  }, [initialProfessionParam])

  const fetchCraftsmen = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(ALL_CRAFTSMEN_ENDPOINT)
      const payload = await readJsonSafe(response)

      if (!response.ok) {
        throw new Error(payload?.status?.message || payload?.message || 'Failed to fetch craftsmen')
      }

      const normalized = extractList(payload).map(normalizeCraftsman)
      setAllCraftsmen(normalized)
    } catch (err) {
      setAllCraftsmen([])
      setError(err.message || 'Failed to fetch craftsmen')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCraftsmen()
  }, [])

  const visibleCraftsmen = useMemo(() => {
    if (!currentLoggedInCraftsmanId) return allCraftsmen
    return allCraftsmen.filter(
      (item) => String(item.id || '') !== String(currentLoggedInCraftsmanId)
    )
  }, [allCraftsmen, currentLoggedInCraftsmanId])

  const professionOptions = useMemo(() => {
    const map = new Map()

    visibleCraftsmen.forEach((craftsman) => {
      if (!craftsman.professionKey) return

      if (!map.has(craftsman.professionKey)) {
        map.set(craftsman.professionKey, {
          key: craftsman.professionKey,
          label: language === 'ar' ? craftsman.professionAr : craftsman.professionEn,
          count: 0,
        })
      }

      map.get(craftsman.professionKey).count += 1
    })

    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [visibleCraftsmen, language])

  const regionOptions = useMemo(() => {
    const counts = {}

    visibleCraftsmen.forEach((craftsman) => {
      const region = craftsman.city
      if (!region) return
      counts[region] = (counts[region] || 0) + 1
    })

    const fetchedRegions = Object.keys(counts)
    const ordered = [...new Set([...regionOrder, ...fetchedRegions])]

    return ordered
      .filter((region) => counts[region])
      .map((region) => ({
        key: region,
        label: region,
        count: counts[region],
      }))
  }, [visibleCraftsmen])

  const hasAnyPriceData = useMemo(
    () => visibleCraftsmen.some((craftsman) => craftsman.price !== null),
    [visibleCraftsmen]
  )

  const filteredCraftsmen = useMemo(() => {
    const query = search.trim().toLowerCase()
    const hasPriceFilter = priceMin !== '' || priceMax !== ''

    return visibleCraftsmen.filter((craftsman) => {
      const searchableText = [
        craftsman.fullName,
        craftsman.professionAr,
        craftsman.professionEn,
        craftsman.city,
        craftsman.neighborhood,
        craftsman.phone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (query && !searchableText.includes(query)) {
        return false
      }

      if (
        selectedProfessions.length > 0 &&
        !selectedProfessions.includes(craftsman.professionKey)
      ) {
        return false
      }

      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(craftsman.city)
      ) {
        return false
      }

      if (hasPriceFilter) {
        if (craftsman.price === null) return false

        const numericMin = priceMin === '' ? -Infinity : Number(priceMin)
        const numericMax = priceMax === '' ? Infinity : Number(priceMax)

        if (craftsman.price < numericMin || craftsman.price > numericMax) {
          return false
        }
      }

      return true
    })
  }, [visibleCraftsmen, search, selectedProfessions, selectedRegions, priceMin, priceMax])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedProfessions, selectedRegions, priceMin, priceMax])

  const totalPages = Math.max(1, Math.ceil(filteredCraftsmen.length / PER_PAGE))

  const paginatedCraftsmen = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE
    return filteredCraftsmen.slice(start, start + PER_PAGE)
  }, [filteredCraftsmen, currentPage])

  const activeFilters = useMemo(() => {
    const tags = []

    selectedProfessions.forEach((key) => {
      const profession = professionOptions.find((item) => item.key === key)
      if (profession) {
        tags.push({
          type: 'profession',
          value: key,
          label: profession.label,
        })
      }
    })

    selectedRegions.forEach((region) => {
      tags.push({
        type: 'region',
        value: region,
        label: region,
      })
    })

    if (priceMin !== '' || priceMax !== '') {
      tags.push({
        type: 'price',
        value: 'price-range',
        label:
          language === 'ar'
            ? `السعر: ${priceMin || '0'} - ${priceMax || '∞'}`
            : `Price: ${priceMin || '0'} - ${priceMax || '∞'}`,
      })
    }

    return tags
  }, [selectedProfessions, selectedRegions, priceMin, priceMax, professionOptions, language])

  const pageNumbers = getPageNumbers(totalPages, currentPage)

  const toggleProfession = (professionKey) => {
    setSelectedProfessions((prev) =>
      prev.includes(professionKey)
        ? prev.filter((item) => item !== professionKey)
        : [...prev, professionKey]
    )
  }

  const toggleRegion = (regionKey) => {
    setSelectedRegions((prev) =>
      prev.includes(regionKey)
        ? prev.filter((item) => item !== regionKey)
        : [...prev, regionKey]
    )
  }

  const removeFilterTag = (tag) => {
    if (tag.type === 'profession') {
      setSelectedProfessions((prev) => prev.filter((item) => item !== tag.value))
      return
    }

    if (tag.type === 'region') {
      setSelectedRegions((prev) => prev.filter((item) => item !== tag.value))
      return
    }

    if (tag.type === 'price') {
      setPriceMin('')
      setPriceMax('')
    }
  }

  const clearAllFilters = () => {
    setSearch('')
    setSelectedProfessions([])
    setSelectedRegions([])
    setPriceMin('')
    setPriceMax('')
    setCurrentPage(1)
  }

  const handleRequestService = (craftsman) => {
    if (!craftsman?.id) return
    navigate(`/craftsman/${craftsman.id}`)
  }

  const getProfileImage = (craftsman) => {
    return resolveImage(craftsman?.profileImage) || DEFAULT_PROFILE_IMAGE
  }

  const getProfessionLabel = (craftsman) => {
    return language === 'ar' ? craftsman.professionAr : craftsman.professionEn
  }

  const getLocationText = (craftsman) => {
    return [craftsman.city, craftsman.neighborhood].filter(Boolean).join(' - ') || labels.locationUnknown
  }

  return (
    <section className="all-craftsmen-page">
      <style>{pageCss}</style>

      <div className="all-craftsmen-shell">
        <div className="all-craftsmen-header">
          <h1 className="all-craftsmen-title">{labels.title}</h1>
          <p className="all-craftsmen-subtitle">{labels.subtitle}</p>
        </div>

        <div className="all-craftsmen-layout">
          <aside className="ac-sidebar">
            <div className="ac-sidebar-card">
              <div className="ac-sidebar-title">
                <Filter size={18} />
                <span>{labels.filtersTitle}</span>
              </div>

              <div className="ac-filter-group">
                <div className="ac-filter-label">
                  <Briefcase size={16} />
                  <span>{labels.profession}</span>
                </div>

                <div className="ac-checkbox-list">
                  {professionOptions.map((profession) => (
                    <label key={profession.key} className="ac-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedProfessions.includes(profession.key)}
                        onChange={() => toggleProfession(profession.key)}
                      />
                      <span className="ac-checkbox-text">{profession.label}</span>
                      <span className="ac-checkbox-count">{profession.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ac-filter-group">
                <div className="ac-filter-label">
                  <MapPin size={16} />
                  <span>{labels.region}</span>
                </div>

                <div className="ac-checkbox-list">
                  {regionOptions.map((region) => (
                    <label key={region.key} className="ac-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region.key)}
                        onChange={() => toggleRegion(region.key)}
                      />
                      <span className="ac-checkbox-text">{region.label}</span>
                      <span className="ac-checkbox-count">{region.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ac-filter-group">
                <div className="ac-filter-label">
                  <CircleDollarSign size={16} />
                  <span>{labels.price}</span>
                </div>

                <div className="ac-price-row">
                  <input
                    type="number"
                    min="0"
                    className="ac-price-input"
                    placeholder={labels.priceFrom}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />

                  <span className="ac-price-separator">—</span>

                  <input
                    type="number"
                    min="0"
                    className="ac-price-input"
                    placeholder={labels.priceTo}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>

                {!hasAnyPriceData ? (
                  <div className="ac-price-note">{labels.noPriceData}</div>
                ) : null}
              </div>

              <button type="button" className="ac-clear-btn" onClick={clearAllFilters}>
                {labels.clearFilters}
              </button>
            </div>
          </aside>

          <main className="ac-main-card">
            <div className="ac-topbar">
              <div className="ac-search-wrap">
                <input
                  type="text"
                  className="ac-search-input"
                  placeholder={labels.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="ac-search-icon">
                  <Search size={18} />
                </span>
              </div>

              <div className="ac-results-chip">
                {filteredCraftsmen.length} {labels.resultsCount}
              </div>
            </div>

            {activeFilters.length > 0 ? (
              <div className="ac-active-filters">
                {activeFilters.map((tag) => (
                  <span key={`${tag.type}-${tag.value}`} className="ac-active-tag">
                    {tag.label}
                    <button type="button" onClick={() => removeFilterTag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            {loading ? (
              <div className="ac-loading">
                <div className="ac-loading-title">{labels.loadingTitle}</div>
                <div className="ac-loading-desc">{labels.loadingDesc}</div>
              </div>
            ) : error ? (
              <div className="ac-error">
                <div className="ac-error-title">{labels.errorTitle}</div>
                <div className="ac-error-desc">{labels.errorDesc}</div>
                <button type="button" className="ac-empty-btn" onClick={fetchCraftsmen}>
                  {labels.retry}
                </button>
              </div>
            ) : filteredCraftsmen.length === 0 ? (
              <div className="ac-empty">
                <div className="ac-empty-title">{labels.noResultsTitle}</div>
                <div className="ac-empty-desc">{labels.noResultsDesc}</div>
                <button type="button" className="ac-empty-btn" onClick={clearAllFilters}>
                  {labels.clearResultsFilters}
                </button>
              </div>
            ) : (
              <>
                <div className="ac-list-head">
                  <div>{labels.profession}</div>
                  <div>{labels.location}</div>
                  <div>{labels.phone}</div>
                  <div>{labels.experience}</div>
                  <div>{labels.requestService}</div>
                </div>

                <div className="ac-list">
                  {paginatedCraftsmen.map((craftsman) => (
                    <div key={craftsman.id} className="ac-row">
                      <div className="ac-user">
                        <img
                          src={getProfileImage(craftsman)}
                          alt={craftsman.fullName}
                          className="ac-avatar"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />

                        <div className="ac-user-info">
                          <div className="ac-name">{craftsman.fullName}</div>

                          <div className="ac-profession">
                            {getProfessionLabel(craftsman)}
                          </div>

                          <div className="ac-meta">
                            <span className="ac-meta-item">
                              <MapPin size={14} />
                              {getLocationText(craftsman)}
                            </span>

                            {craftsman.featured ? (
                              <span className="ac-meta-item">{labels.badgeFeatured}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="ac-col">
                        <div>{craftsman.city || labels.locationUnknown}</div>
                        <div className="ac-col-muted">
                          {craftsman.neighborhood || labels.locationUnknown}
                        </div>
                      </div>

                      <div className="ac-col">
                        <span className="ac-phone">
                          {craftsman.phone || labels.phoneUnknown}
                        </span>
                      </div>

                      <div className="ac-col">
                        <div>
                          {craftsman.years} {labels.years}
                        </div>

                        <div style={{ marginTop: 8 }}>
                          <span className="ac-price-badge">
                            {craftsman.price !== null
                              ? `${craftsman.price} ${labels.pricePerHour}`
                              : labels.priceUnknown}
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          className="ac-request-btn"
                          onClick={() => handleRequestService(craftsman)}
                          disabled={!craftsman.id}
                        >
                          {labels.requestService}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ac-mobile-card-list">
                  {paginatedCraftsmen.map((craftsman) => (
                    <div key={craftsman.id} className="ac-mobile-card">
                      <div className="ac-mobile-top">
                        <img
                          src={getProfileImage(craftsman)}
                          alt={craftsman.fullName}
                          className="ac-avatar"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />

                        <div className="ac-user-info">
                          <div className="ac-name">{craftsman.fullName}</div>
                          <div className="ac-profession">{getProfessionLabel(craftsman)}</div>
                        </div>
                      </div>

                      <div className="ac-mobile-middle">
                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.location}</div>
                          <div className="ac-mobile-box-value">{getLocationText(craftsman)}</div>
                        </div>

                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.phone}</div>
                          <div className="ac-mobile-box-value ac-phone">
                            {craftsman.phone || labels.phoneUnknown}
                          </div>
                        </div>

                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.experience}</div>
                          <div className="ac-mobile-box-value">
                            {craftsman.years} {labels.years}
                          </div>
                        </div>

                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.price}</div>
                          <div className="ac-mobile-box-value">
                            {craftsman.price !== null
                              ? `${craftsman.price} ${labels.pricePerHour}`
                              : labels.priceUnknown}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ac-request-btn"
                        onClick={() => handleRequestService(craftsman)}
                        disabled={!craftsman.id}
                      >
                        {labels.requestService}
                      </button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="ac-pagination">
                    <button
                      type="button"
                      className="ac-page-btn"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight size={18} />
                    </button>

                    {pageNumbers.map((item, index) =>
                      item === 'dots' ? (
                        <span key={`dots-${index}`} className="ac-page-dots">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`ac-page-btn ${currentPage === item ? 'active' : ''}`}
                          onClick={() => setCurrentPage(item)}
                        >
                          {item}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      className="ac-page-btn"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}