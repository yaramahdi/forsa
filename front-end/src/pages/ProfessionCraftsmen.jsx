import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Briefcase, CircleDollarSign, User } from 'lucide-react';
import './professionCraftsmen.css';
import { getCraftsmanImage } from '../utils/getCraftsmanImage';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

function readJsonSafe(response) {
  return response.json().catch(() => null);
}

function extractCraftsmen(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.craftsmen)) return payload.craftsmen;
  if (Array.isArray(payload?.data?.craftsmen)) return payload.data.craftsmen;
  return [];
}

function getCurrentLoggedInCraftsmanId() {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem('forsaCraftsman');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return String(parsed?._id || parsed?.id || '').trim();
  } catch {
    return '';
  }
}

function formatPrice(price) {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return 'السعر غير محدد';
  return `${numericPrice} ₪ / ساعة`;
}

export default function ProfessionCraftsmen() {
  const navigate = useNavigate();
  const { profession } = useParams();
  const currentLoggedInCraftsmanId = useMemo(() => getCurrentLoggedInCraftsmanId(), []);

  const [craftsmen, setCraftsmen] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const professionMap = useMemo(
    () => ({
      engineer: 'مهندس',
      plumber: 'سباك',
      painter: 'دهان',
      carpenter: 'نجار',
      electrician: 'كهربائي',
      technician: 'فني',
      driver: 'سائق',
      mechanic: 'ميكانيكي',
      other: 'أخرى',
      مهندس: 'مهندس',
      سباك: 'سباك',
      دهان: 'دهان',
      نجار: 'نجار',
      كهربائي: 'كهربائي',
      فني: 'فني',
      سائق: 'سائق',
      ميكانيكي: 'ميكانيكي',
      أخرى: 'أخرى'
    }),
    []
  );

  const normalizedProfession = useMemo(() => {
    return professionMap[profession] || profession || '';
  }, [profession, professionMap]);

  const pageTitle = normalizedProfession || 'حرفي';

  useEffect(() => {
    const fetchCraftsmen = async () => {
      try {
        setLoading(true);
        setError('');

        let url = `${API_BASE_URL}/api/craftsmen?profession=${encodeURIComponent(normalizedProfession)}`;

        if (selectedCity) {
          url += `&city=${encodeURIComponent(selectedCity)}`;
        }

        const response = await fetch(url);
        const result = await readJsonSafe(response);

        const isSuccess =
          response.ok &&
          (result?.success === true || result?.status?.status === true);

        if (!isSuccess) {
          setError(
            result?.message ||
              result?.status?.message ||
              'حدث خطأ أثناء جلب الحرفيين'
          );
          setCraftsmen([]);
          return;
        }

        setCraftsmen(extractCraftsmen(result));
      } catch (err) {
        setError('تعذر الاتصال بالسيرفر');
        setCraftsmen([]);
      } finally {
        setLoading(false);
      }
    };

    if (normalizedProfession) {
      fetchCraftsmen();
    } else {
      setLoading(false);
      setCraftsmen([]);
      setError('المهنة غير صحيحة');
    }
  }, [normalizedProfession, selectedCity]);

  const visibleCraftsmen = useMemo(() => {
    if (!currentLoggedInCraftsmanId) return craftsmen;
    return craftsmen.filter(
      (item) => String(item._id || item.id || '') !== String(currentLoggedInCraftsmanId)
    );
  }, [craftsmen, currentLoggedInCraftsmanId]);

  return (
    <div className="profession-page">
      <div className="profession-page-container">
        <div className="profession-page-topbar">
          <button
            type="button"
            className="back-home-button"
            onClick={() => navigate('/')}
          >
            العودة إلى الرئيسية
          </button>
        </div>

        <div className="profession-hero">
          <h1>{pageTitle}ون في غزة</h1>
          <p>استعرض قائمة {pageTitle}ين المتاحين في مدينة غزة</p>
        </div>

        <div className="filters-card">
          <div className="filters-row">
            <div className="city-pill-box">
              <span className="pill-value">{selectedCity || 'كل المناطق'}</span>
            </div>

            <div className="city-select-box">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select"
              >
                <option value="">كل المناطق</option>
                <option value="غزة">غزة</option>
                <option value="شمال غزة">شمال غزة</option>
                <option value="الوسطى">الوسطى</option>
                <option value="الجنوب">الجنوب</option>
              </select>
            </div>
          </div>
        </div>

        {loading && <p className="page-state">جاري تحميل الحرفيين...</p>}
        {error && <p className="page-state error-text">{error}</p>}

        {!loading && !error && visibleCraftsmen.length === 0 && (
          <p className="page-state">لا يوجد حرفيون ضمن هذه المهنة حاليًا.</p>
        )}

        {!loading && !error && visibleCraftsmen.length > 0 && (
          <div className="craftsmen-list">
            {visibleCraftsmen.map((craftsman) => (
              <div className="craftsman-card-horizontal" key={craftsman._id || craftsman.id}>
                {/* 1. الصورة على اليمين */}
                <div className="craftsman-image-right">
                  <img
                    src={getCraftsmanImage(craftsman)}
                    alt={`${craftsman.firstName} ${craftsman.lastName}`}
                    className="profile-img-horizontal"
                  />
                </div>

                {/* 2. المحتوى في المنتصف (بيانات تحت بعضها) */}
                <div className="craftsman-info-center">
                  <h2 className="craftsman-name-text">
                    {craftsman.firstName} {craftsman.lastName}
                  </h2>
                  <p className="craftsman-job-text">
                    {professionMap[craftsman.profession] || craftsman.profession} - حي {craftsman.neighborhood}
                  </p>
                  
                  <div className="craftsman-details-column">
                    <div className="detail-item">
                      <Briefcase size={14} className="icon-brand" />
                      <span>الخبرة {craftsman.yearsOfExperience} سنوات</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={14} className="icon-brand" />
                      <span>{craftsman.city}</span>
                    </div>
                    <div className="detail-item">
                      <CircleDollarSign size={14} className="icon-brand" />
                      <span>{formatPrice(craftsman.price)}</span>
                    </div>
                  </div>
                </div>

                {/* 3. زر الطلب على اليسار */}
                <div className="craftsman-action-left">
                  <button
                    type="button"
                    className="request-service-btn-main"
                    onClick={() => navigate(`/craftsman/${craftsman._id || craftsman.id}`)}
                  >
                    اطلب الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}