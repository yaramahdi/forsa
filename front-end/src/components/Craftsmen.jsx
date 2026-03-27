import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'

export default function Craftsmen() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  return (
    <section className="craftsmen-section" id="craftsmen">
      <div className="container">
        <div className="craftsmen-single-wrapper">
          
          {/* البطاقة الموحدة للحرفيين */}
          <div className="craftsmen-cta-card full-width">
            <div className="cta-overlay"></div>

            <div className="cta-content">
              
              {/* واجهة العرض الرئيسية فقط */}
              <div className="cta-main-view">
                <div className="cta-text-side">

                  <h2 className="cta-title">هل أنت حرفي؟</h2>
                  <p className="cta-desc">
                    انضم إلى آلاف الحرفيين الذين يعملون عبر منصة فرصة ووسّع نطاق عملك
                  </p>

                  <button className="modern-glow-btn">
                    <span>{t('registerNow')}</span>
                  </button>

                </div>

                {/* الصورة */}
                <div className="cta-floating-img-v2">
                  <img src="images/حرفيين.png" alt="Craftsman" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}