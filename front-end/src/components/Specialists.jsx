import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

export default function Specialists() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  const specialists = [
    { id: 1, profession: t('painter'), name: 'سعيد محمد', rating: 5 },
    { id: 2, profession: t('carpenter'), name: 'أحمد الحلو', rating: 5 },
    { id: 3, profession: t('engineer'), name: 'أسماء عادل', rating: 5 },
    { id: 4, profession: t('electrician'), name: 'معتصم السعدي', rating: 5 }
  ]

  const renderStars = (rating) => {
    return '⭐'.repeat(rating)
  }

  return (
    <section className="specialists container">
      <h2 className="title-dark">{t('specialistsTitle')}</h2>
      <div className="grid-workers">
        {specialists.map(specialist => (
          <div key={specialist.id} className="worker-card">
            <div className="worker-img">👤</div>
            <h3>{specialist.profession}</h3>
            <p>{specialist.name}</p>
            <div className="stars">{renderStars(specialist.rating)}</div>
          </div>
        ))}
      </div>
   
    </section>
  )
}
