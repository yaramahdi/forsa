import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

export default function Categories() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  // مهن الصفحة الرئيسية
  // professionKey هو المفتاح الذي نرسله بالرابط والباك
  // بعض الصور الجديدة مكررة مؤقتًا حتى يجهز فريق الفرونت صورها
  const categories = [
    { id: 1, image: 'images/engineer.png', name: t('engineer'), professionKey: 'engineer' },
    { id: 2, image: 'images/plumber.png', name: t('plumber'), professionKey: 'plumber' },
    { id: 3, image: 'images/painter.png', name: t('painter'), professionKey: 'painter' },
    { id: 4, image: 'images/carpenter.png', name: t('carpenter'), professionKey: 'carpenter' },
    { id: 5, image: 'images/electrician.png', name: t('electrician'), professionKey: 'electrician' },

    // مهن جديدة
    { id: 6, image: 'images/engineer.png', name: 'فني', professionKey: 'technician' },
    { id: 7, image: 'images/plumber.png', name: 'سائق', professionKey: 'driver' },
    { id: 8, image: 'images/engineer.png', name: 'ميكانيكي', professionKey: 'mechanic' }
  ]

  return (
    <section className="categories">
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
      </div>
    </section>
  )
}