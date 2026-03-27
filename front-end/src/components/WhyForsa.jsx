import React from 'react'
import { Shield, Zap, MessageSquare, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

export default function WhyForsa() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  const features = [
    {
      id: 1,
      icon: Shield,
      title: t('security'),
      description: t('securityDesc')
    },
    {
      id: 2,
      icon: Zap,
      title: t('fastResponse'),
      description: t('fastResponseDesc')
    },
    {
      id: 3,
      icon: MessageSquare,
      title: t('directContact'),
      description: t('directContactDesc')
    },
    {
      id: 4,
      icon: CheckCircle,
      title: t('trustedSpecialists'),
      description: t('trustedSpecialistsDesc')
    }
  ]

  return (
    <section className="why-forsa-section">
      <div className="container">
        <h2 className="why-forsa-title">{t('whyForsaTitle')}</h2>
        
        <div className="why-forsa-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div key={feature.id} className="why-forsa-card">
                <div className="why-forsa-icon">
                  <IconComponent size={40} />
                </div>
                <h3 className="why-forsa-card-title">{feature.title}</h3>
                <p className="why-forsa-card-desc">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
