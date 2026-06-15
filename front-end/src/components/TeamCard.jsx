import React from 'react'
import { Linkedin, Instagram } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function TeamCard({ member }) {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  return (
    <div className="team-card">
      <div className="team-card-image-container">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="team-card-image"
            loading="lazy"
          />
        ) : (
          <div className="team-card-image-placeholder">
            <span className="placeholder-initial">
              {member.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="team-card-content">
        <h3 className="team-card-name">{member.name}</h3>
        <p className="team-card-role">{member.role}</p>
        <p className="team-card-description">{member.description}</p>

        <div className="team-card-socials">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="team-card-social-btn linkedin"
              title="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="team-card-social-btn instagram"
              title="Instagram Profile"
            >
              <Instagram size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
