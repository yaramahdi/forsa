import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../translations'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TeamCard from '../components/TeamCard'
import './Team.css'

export default function Team() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key) => translations[language]?.[key] || key
  const isRTL = language === 'ar'

  const teamMembers = [
    {
      id: 1,
      name: 'Eng.Nora Ayman Al-Batsh',
      role: 'Software Engineer & Front-end Developer',
      description: 'I developed and implemented interactive user interfaces, connected pages to the server, improved user experience, and ensured design compatibility across different devices ',
      image: '/images/Nora5.jpeg',
      linkedin: 'https://www.linkedin.com/in/nora-albatsh-25a8093b9',
      instagram: 'https://www.instagram.com/nora.ayman20?igsh=ajJzbjltZ3o3N3Js&utm_source=qr'
    },
    {
      id: 2,
      name: 'Eng.Yara Hatem Mahdi',
      role: 'Full-Stack Developer',
      description: 'Built the back-end architecture and database structure, and developed multiple front-end pages including the Admin dashboard, Craftsman details, User profile, and All Craftsmen listing.',
      image: '/images/yara.png',
      linkedin: 'https://www.linkedin.com/in/yara-hatem-mahdi-552083410/',
      instagram: 'https://www.instagram.com/yaramahdi18?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    },
    {
      id: 3,
      name: 'Eng.Sozan Waleed Ashour',
      role: 'Full-STACK DEVELOPER',
      description: 'I developed the login page, account creation page, and password reset page — including full frontend implementation and UI design. I also contributed designs for several other pages across the application.',
      image: '/images/sozan.jpg?v=4',
      linkedin: 'https://www.linkedin.com/in/sozan-ashour-528784389?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      instagram: 'https://www.instagram.com/sozan_ashour?igsh=MnFmbjlwZWExMWkz&utm_source=qr'
    },
    {
      id: 4,
      name: 'Ruba Hamada',
      role: 'UI/UX Designer',
      description: '',
      image: null
    }
  ]

  return (
    <div className="team-page">
      <button 
        className="team-back-button"
        onClick={() => navigate('/')}
        title={t('back') || 'العودة'}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="team-container">
        <div className="team-header">
          <h1 className="team-title">{t('teamTitle') || 'فريق العمل'}</h1>
          <p className="team-subtitle">{t('teamSubtitle') || 'التعريف بفريقنا الذي يعمل بجد لتقديم أفضل الخدمات'}</p>
        </div>

        <div className={`team-cards-grid ${isRTL ? 'rtl' : 'ltr'}`}>
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  )
}
