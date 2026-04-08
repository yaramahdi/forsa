import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

const categoriesExtraCss = `
.categories-footer-actions {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}

.view-all-craftsmen-btn {
  border: none;
  background: linear-gradient(135deg, #2563a8 0%, #1b3a5c 100%);
  color: #fff;
  padding: 13px 24px;
  border-radius: 999px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(37, 99, 168, 0.2);
  transition: 0.22s ease;
}

.view-all-craftsmen-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(37, 99, 168, 0.26);
}

.view-all-craftsmen-btn:active {
  transform: translateY(0);
}
`

export default function Categories() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  const allCraftsmenButtonLabel =
    language === 'ar' ? 'استعراض كل الحرفيين' : 'Browse All Craftsmen'

  // مهن الصفحة الرئيسية
  // professionKey هو المفتاح الذي نرسله بالرابط والباك
  const categories = [
    { id: 1, image: 'images/engineer.png', name: t('engineer'), professionKey: 'engineer' },
    { id: 2, image: 'images/plumber.png', name: t('plumber'), professionKey: 'plumber' },
    { id: 3, image: 'images/painter.png', name: t('painter'), professionKey: 'painter' },
    { id: 4, image: 'images/carpenter.png', name: t('carpenter'), professionKey: 'carpenter' },
    { id: 5, image: 'images/electrician.png', name: t('electrician'), professionKey: 'electrician' },

    // مهن جديدة
    { id: 6, image: 'images/engineer.png', name: 'فني', professionKey: 'technician' },
    { id: 7, image: 'images/plumber.png', name: 'سائق', professionKey: 'driver' },
    { id: 8, image: 'images/engineer.png', name: 'ميكانيكي', professionKey: 'mechanic' },
  ]

  return (
    <section className="categories" id="categories">
      <style>{categoriesExtraCss}</style>

      <div className="white-card-bg">
        <h2 className="section-title">{t('categoriesTitle')}</h2>

        <div className="categories-slider-wrapper">
          <div className="grid-categories">
            {categories.map((category) => (
              <div
                key={category.id}
                className="cat-item"
                onClick={() => navigate(`/craftsmen/${category.professionKey}`)}
              >
                <div className="icon-box">
                  <img src={category.image} alt={category.name} />
                </div>
                <p>{category.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="categories-footer-actions">
          <button
            type="button"
            className="view-all-craftsmen-btn"
            onClick={() => navigate('/all-craftsmen')}
          >
            {allCraftsmenButtonLabel}
          </button>
        </div>
      </div>
    </section>
  )
}