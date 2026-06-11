import React, { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { useNavigate } from "react-router-dom";
//صفحة هل انت حرفي ؟ سجل الان
export default function Craftsmen() {
   const navigate = useNavigate();
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key

  // Detect logged-in craftsman using the existing localStorage keys
  const loggedInCraftsman = useMemo(() => {
    try {
      const token = localStorage.getItem('forsaToken');
      const raw = localStorage.getItem('forsaCraftsman');
      if (!token || !raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const firstName = loggedInCraftsman?.firstName?.trim() || '';

  return (
    <section className="craftsmen-section">
      <div className="container">
        <div className="craftsmen-single-wrapper">

          {/* البطاقة الموحدة للحرفيين */}
          <div className="craftsmen-cta-card full-width">
            <div className="cta-overlay"></div>

            <div className="cta-content">

              {/* واجهة العرض الرئيسية فقط */}
              <div className="cta-main-view">
                <div className="cta-text-side">

                  {loggedInCraftsman ? (
                    <>
                      <h2 className="cta-title">
                        {t('craftsmanWelcome')} {firstName || t('craftsmanFallback')}!
                      </h2>
                      <p className="cta-desc">{t('craftsmanLoggedInSubtitle')}</p>
                      <button className="modern-glow-btn" onClick={() => navigate('/profile')}>
                        <span>{t('goToProfile')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="cta-title">{t('areYouCraftsman')}</h2>
                      <p className="cta-desc">{t('craftsmanSubtitle')}</p>
                      <button className="modern-glow-btn" onClick={() => navigate('/signup')}>
                        <span>{t('registerNow')}</span>
                      </button>
                    </>
                  )}

                </div>

                {/* الصورة */}
                <div className="cta-floating-img-v2">
                  <img src="images/craftsman.png" alt="Craftsman" loading="lazy" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}