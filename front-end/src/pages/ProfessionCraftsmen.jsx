import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import './professionCraftsmen.css';

export default function ProfessionCraftsmen() {
  const navigate = useNavigate();
  const { profession } = useParams();

  const [craftsmen, setCraftsmen] = useState([]);
  const [selectedCity, setSelectedCity] = useState('غزة');
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
      other: 'أخرى'
    }),
    []
  );

  const pageTitle = professionMap[profession] || profession;

  useEffect(() => {
    const fetchCraftsmen = async () => {
      try {
        setLoading(true);
        setError('');

        let url = `http://localhost:5000/api/craftsmen?profession=${encodeURIComponent(profession)}`;

        if (selectedCity) {
          url += `&city=${encodeURIComponent(selectedCity)}`;
        }

        const response = await fetch(url);
        const result = await response.json();

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

        setCraftsmen(result?.data || []);
      } catch (err) {
        setError('تعذر الاتصال بالسيرفر');
        setCraftsmen([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCraftsmen();
  }, [profession, selectedCity]);

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
              <span className="pill-label">المنطقة</span>
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

        {!loading && !error && craftsmen.length === 0 && (
          <p className="page-state">لا يوجد حرفيون ضمن هذه المهنة حاليًا.</p>
        )}

        {!loading && !error && craftsmen.length > 0 && (
          <div className="craftsmen-list">
            {craftsmen.map((craftsman) => (
              <div className="craftsman-card" key={craftsman._id}>
                <div className="craftsman-action">
                  <button type="button" className="request-service-btn">
                    اطلب الآن
                  </button>
                </div>

                <div className="craftsman-content">
                  <h2 className="craftsman-name">
                    {craftsman.firstName} {craftsman.lastName}
                  </h2>

                  <p className="craftsman-job-line">
                    {professionMap[craftsman.profession] || craftsman.profession} - {craftsman.neighborhood}
                  </p>

                  <div className="craftsman-meta">
                    <div className="meta-row">
                      <Briefcase size={17} />
                      <span>الخبرة {craftsman.yearsOfExperience} سنوات</span>
                    </div>

                    <div className="meta-row">
                      <MapPin size={17} />
                      <span>{craftsman.city}</span>
                    </div>
                  </div>
                </div>

                <div className="craftsman-image-wrap">
                  <img
                    src={
                      craftsman.workImages?.[0]
                        ? `http://localhost:5000${craftsman.workImages[0]}`
                        : 'https://via.placeholder.com/180x180?text=Forsa'
                    }
                    alt={`${craftsman.firstName} ${craftsman.lastName}`}
                    className="craftsman-image"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}