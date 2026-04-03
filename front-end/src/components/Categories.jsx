import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

export default function Categories() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key


  // قائمة الفئات مع صور لكل فئة
  const categories = [
    { id: 1, image: "images/engineer.png", name: t('engineer') },
    { id: 2, image: "images/plumber.png", name: t('plumber') },
    { id: 3, image: "images/painter.png", name: t('painter') },
    { id: 4, image: "images/carpenter.png", name: t('carpenter') },
    { id: 5, image: "images/electrician.png", name: t('electrician') }
  ]

  return (
    <section className="categories">
      <div className="white-card-bg">
        <h2 className="section-title">{t('categoriesTitle')}</h2>
        <div className="grid-categories">
          {categories.map(category => (
            <div key={category.id} className="cat-item">
              <div className="icon-box">
                <img src={category.image} alt={category.name} />
              </div>
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}