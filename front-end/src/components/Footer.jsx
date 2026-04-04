import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
export default function Footer() {
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || translations.ar[key] || key


  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* اسم المنصة */}
        <div className="footer-col">
          <h3>{t('platformName')}</h3>
          <p>{t('footerDesc')}</p>
        </div>

        {/* الروابط */}
        <div className="footer-col">
          <h4>{t('links')}</h4>
          <ul>
    <li><a href="#hero">{t('home')}</a></li>
    <li><a href="#why-forsa">{t('about')}</a></li>
    <li><a href="#categories">{t('footerCraftsmen')}</a></li>
           
            
          </ul>
        </div>

        {/* الفئات */}
        <div className="footer-col">
          <h4>{t('categories')}</h4>
          <ul>
            <li>{t('plumber')}</li>
            <li>{t('electrician')}</li>
            <li>{t('painter')}</li>
            <li>{t('more')}</li>
          </ul>
        </div>

        {/* تابعنا */}
        <div className="footer-col">
          <h4>{t('followUs')}</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label={t('facebook')}>
              <img src="icons/facebook.png" alt={t('facebook')} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label={t('instagram')}>
              <img src="icons/instagram.png" alt={t('instagram')} />
            </a>

          </div>
        </div>

      </div>

      {/* الحقوق */}
      <div className="footer-bottom">
        <p>{t('footer')}</p>
      </div>
    </footer>
  )
}