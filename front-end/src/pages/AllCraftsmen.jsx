import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  Search,
  MapPin,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  CircleDollarSign,
  X,
} from 'lucide-react'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const ALL_CRAFTSMEN_ENDPOINT = `${API_BASE_URL}/api/craftsmen`
const DEFAULT_PROFILE_IMAGE = '/images/default-user.png'
const PER_PAGE = 10

const pageCss = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ── Background orb animations ── */
@keyframes ac-orb-1 {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-60px); }
}

@keyframes ac-orb-2 {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(50px); }
}

@keyframes ac-orb-3 {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(40px); }
}

@keyframes ac-fade-up {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes ac-header-shine {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(280%); }
}

@keyframes ac-badge-shine {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(220%); }
}

/* ── Page shell ── */
.all-craftsmen-page {
  direction: rtl;
  font-family: 'Cairo', sans-serif;
  background: #eef4fb;
  min-height: 100vh;
  padding: 36px 20px 60px;
  position: relative;
  overflow: clip;
}

.all-craftsmen-page::before {
  content: '';
  position: absolute;
  top: -140px;
  right: -140px;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37,99,168,0.11) 0%, transparent 68%);
  animation: ac-orb-1 16s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}

.all-craftsmen-page::after {
  content: '';
  position: absolute;
  bottom: 60px;
  left: -110px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(27,58,92,0.09) 0%, transparent 68%);
  animation: ac-orb-2 20s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}

.all-craftsmen-shell {
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ── Hero header ── */
.all-craftsmen-header {
  margin-bottom: 28px;
  padding: 40px 40px 44px;
  background:
    radial-gradient(rgba(255,255,255,0.045) 1.5px, transparent 1.5px),
    linear-gradient(135deg, #0d2442 0%, #1b3a5c 45%, #2563a8 100%);
  background-size: 26px 26px, 100% 100%;
  border-radius: 22px;
  color: #fff;
  position: relative;
  overflow: hidden;
  animation: ac-fade-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
  box-shadow: 0 16px 48px rgba(37, 99, 168, 0.32), 0 2px 8px rgba(0,0,0,0.12);
}

.all-craftsmen-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 55%;
  height: 100%;
  background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.07) 50%, transparent 80%);
  animation: ac-header-shine 6s ease-in-out infinite;
  animation-delay: 1.8s;
  pointer-events: none;
  will-change: transform;
}

.all-craftsmen-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #fbbf24 30%, #f59e0b 70%, transparent 100%);
  border-radius: 0 0 22px 22px;
}

.ac-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.ac-header-text {
  flex: 1;
  min-width: 0;
}

.all-craftsmen-title {
  font-family: 'Tajawal', sans-serif;
  font-size: 2.35rem;
  font-weight: 900;
  margin: 0 0 10px;
  color: #fff;
  line-height: 1.2;
  text-shadow: 0 2px 14px rgba(0,0,0,0.22);
}

.ac-header-rule {
  display: block;
  width: 56px;
  height: 3px;
  background: linear-gradient(90deg, #fbbf24, rgba(251,191,36,0.25));
  border-radius: 2px;
  margin-bottom: 14px;
}

.all-craftsmen-subtitle {
  font-size: 0.96rem;
  line-height: 1.9;
  margin: 0;
  color: rgba(255,255,255,0.70);
  max-width: 560px;
}

.ac-header-deco {
  flex-shrink: 0;
  color: rgba(255,255,255,0.08);
  margin-left: 28px;
  line-height: 1;
  position: relative;
  z-index: 2;
}

/* ── Two-column layout ── */
.all-craftsmen-layout {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

/* ── Sidebar ── */
.ac-sidebar {
  position: sticky;
  top: 92px;
}

.ac-sidebar-card {
  background: #fff;
  border: 1px solid #dce8f5;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(27, 58, 92, 0.07);
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  scrollbar-width: thin;
  scrollbar-color: #d0e0f0 transparent;
  animation: ac-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.15s;
}

.ac-sidebar-card::-webkit-scrollbar {
  width: 4px;
}

.ac-sidebar-card::-webkit-scrollbar-track {
  background: transparent;
}

.ac-sidebar-card::-webkit-scrollbar-thumb {
  background: #d0e0f0;
  border-radius: 4px;
}

.ac-main-card {
  background: #fff;
  border: 1px solid #dce8f5;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(27, 58, 92, 0.07);
  padding: 22px;
  min-width: 0;
  overflow: hidden;
  animation: ac-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.25s;
}

.ac-sidebar-title {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  margin: -20px -20px 18px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #1b3a5c 0%, #2563a8 100%);
  border-bottom: none;
}

.ac-filter-count-badge {
  margin-right: auto;
  background: rgba(255,255,255,0.22);
  border-radius: 999px;
  padding: 1px 9px;
  font-size: 0.75rem;
  font-weight: 900;
}

.ac-filter-group + .ac-filter-group {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #eef3f9;
}

.ac-filter-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #5a7a9a;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #eef3f9;
}

.ac-filter-label svg {
  color: #2563a8;
  flex-shrink: 0;
}

/* ── Checkbox list ── */
.ac-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d0e0f0 transparent;
}

.ac-checkbox-list::-webkit-scrollbar {
  width: 4px;
}

.ac-checkbox-list::-webkit-scrollbar-track {
  background: transparent;
}

.ac-checkbox-list::-webkit-scrollbar-thumb {
  background: #d0e0f0;
  border-radius: 4px;
}

.ac-checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 11px;
  padding: 9px 11px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  border: 1.5px solid transparent;
  background: #f5f9ff;
}

.ac-checkbox-item:hover {
  background: #eaf4ff;
  border-color: #c4dcf4;
}

.ac-checkbox-item:has(input:checked) {
  background: #eaf4ff;
  border-color: #2563a8;
}

.ac-checkbox-item input {
  accent-color: #2563a8;
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.ac-checkbox-text {
  flex: 1;
  color: #1f3855;
  font-size: 0.9rem;
  font-weight: 600;
}

.ac-checkbox-item:has(input:checked) .ac-checkbox-text {
  color: #1b4a8a;
  font-weight: 700;
}

.ac-checkbox-count {
  color: #7a90ab;
  background: #e4eef8;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

.ac-checkbox-item:has(input:checked) .ac-checkbox-count {
  background: #2563a8;
  color: #fff;
}

/* ── Price range ── */
.ac-price-row {
  display: grid;
  grid-template-columns: 1fr 18px 1fr;
  gap: 8px;
  align-items: center;
}

.ac-price-separator {
  color: #a8bfd6;
  text-align: center;
  font-weight: 700;
}

.ac-price-input {
  width: 100%;
  border: 1.5px solid #d2e3f0;
  background: #f5f9ff;
  color: #1b3a5c;
  border-radius: 11px;
  padding: 9px 10px;
  outline: none;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  text-align: center;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.ac-price-input:focus {
  border-color: #2563a8;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 168, 0.1);
}

.ac-price-note {
  margin-top: 10px;
  font-size: 0.77rem;
  color: #7a90ab;
  line-height: 1.75;
  background: #f5f9ff;
  border: 1px dashed #cddff0;
  border-radius: 10px;
  padding: 10px 12px;
}

/* ── Clear filters button ── */
.ac-clear-btn {
  width: 100%;
  margin-top: 20px;
  border: 1.5px solid #d2e3f0;
  background: transparent;
  color: #6d839d;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.ac-clear-btn:hover {
  background: #fff0f0;
  color: #c0392b;
  border-color: #f0b8b4;
}

/* ── Top bar ── */
.ac-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: -22px -22px 16px;
  padding: 16px 22px;
  background: #f5f9ff;
  border-bottom: 1.5px solid #e4eef8;
  border-radius: 20px 20px 0 0;
}

.ac-search-wrap {
  position: relative;
  flex: 1;
  min-width: 240px;
}

.ac-search-input {
  width: 100%;
  height: 50px;
  border: 1.5px solid #d2e3f0;
  background: #f5f9ff;
  color: #1b3a5c;
  border-radius: 14px;
  padding: 0 48px 0 16px;
  outline: none;
  font-family: 'Cairo', sans-serif;
  font-size: 0.94rem;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.ac-search-input:focus {
  border-color: #2563a8;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 168, 0.1);
}

.ac-search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #98b2cb;
  pointer-events: none;
}

.ac-results-chip {
  background: linear-gradient(135deg, #2563a8 0%, #1b3a5c 100%);
  color: #fff;
  border-radius: 999px;
  padding: 11px 20px;
  font-size: 0.85rem;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(37, 99, 168, 0.28);
}

/* ── Active filter tags ── */
.ac-active-filters {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  padding: 10px 14px;
  background: #f0f7ff;
  border-radius: 12px;
  border: 1px solid #d8ebf9;
}

.ac-active-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563a8;
  color: #fff;
  border-radius: 999px;
  padding: 5px 12px 5px 8px;
  font-size: 0.81rem;
  font-weight: 700;
}

.ac-active-tag button {
  border: none;
  background: rgba(255,255,255,0.22);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: background 0.15s;
}

.ac-active-tag button:hover {
  background: rgba(255,255,255,0.4);
}

/* ── Desktop table ── */
.ac-list-head {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 160px 158px 122px 150px;
  gap: 12px;
  padding: 0 16px 12px;
  color: #9ab0c8;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border-bottom: 2px solid #eef3f9;
}

.ac-list {
  display: flex;
  flex-direction: column;
}

.ac-row {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 160px 158px 122px 150px;
  gap: 12px;
  align-items: center;
  padding: 13px 16px;
  border-radius: 12px;
  border-bottom: 1px solid #f0f5fb;
  margin: 1px 0;
  transition: background 0.18s ease, box-shadow 0.18s ease;
  animation: ac-fade-up 0.4s ease both;
}

.ac-row:nth-child(1)  { animation-delay: 0.05s; }
.ac-row:nth-child(2)  { animation-delay: 0.10s; }
.ac-row:nth-child(3)  { animation-delay: 0.15s; }
.ac-row:nth-child(4)  { animation-delay: 0.20s; }
.ac-row:nth-child(5)  { animation-delay: 0.25s; }
.ac-row:nth-child(6)  { animation-delay: 0.30s; }
.ac-row:nth-child(7)  { animation-delay: 0.35s; }
.ac-row:nth-child(8)  { animation-delay: 0.40s; }
.ac-row:nth-child(9)  { animation-delay: 0.45s; }
.ac-row:nth-child(10) { animation-delay: 0.50s; }

.ac-row:last-child {
  border-bottom: none;
}

.ac-row:hover {
  background: #f0f7ff;
  box-shadow: 0 2px 14px rgba(37, 99, 168, 0.08);
}

/* ── Craftsman identity ── */
.ac-user {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.ac-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddeaf8;
  background: #edf5ff;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.ac-row:hover .ac-avatar {
  border-color: #2563a8;
  box-shadow: 0 0 0 4px rgba(37, 99, 168, 0.13);
}

.ac-user-info {
  min-width: 0;
}

.ac-name {
  color: #1b3a5c;
  font-size: 0.96rem;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Profession badge ── */
.ac-profession {
  display: inline-flex;
  align-items: center;
  margin-top: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #eef5ff;
  color: #2563a8;
  border: 1px solid #c4dcf5;
  font-size: 0.77rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

/* ── Meta row under name ── */
.ac-meta {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #98b0c8;
  font-size: 0.79rem;
  font-weight: 600;
}

.ac-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ── Featured badge ── */
.ac-featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: linear-gradient(90deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.72rem;
  font-weight: 800;
  border: 1px solid #fcd34d;
  margin-top: 4px;
  margin-bottom: 3px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.28);
}

.ac-featured-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.72) 50%, transparent 100%);
  transform: translateX(-100%);
  animation: ac-badge-shine 3.5s ease-in-out infinite;
  animation-delay: 2.5s;
  pointer-events: none;
  will-change: transform;
}

/* ── Table columns ── */
.ac-col {
  color: #1f3855;
  font-size: 0.9rem;
  font-weight: 700;
}

.ac-col-muted {
  color: #98b0c8;
  font-weight: 600;
  font-size: 0.83rem;
  margin-top: 3px;
}

.ac-phone {
  direction: ltr;
  display: inline-block;
}

.ac-price-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 999px;
  background: #f0f7ff;
  border: 1px solid #c4dcf5;
  color: #2563a8;
  font-size: 0.81rem;
  font-weight: 800;
}

/* ── CTA button ── */
.ac-request-btn {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #2563a8 0%, #1d4f8f 100%);
  color: #fff;
  border-radius: 12px;
  padding: 11px 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.86rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 168, 0.28);
  letter-spacing: 0.01em;
}

.ac-request-btn:hover {
  background: linear-gradient(135deg, #1b3a5c 0%, #1b3a5c 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(27, 58, 92, 0.32);
}

.ac-request-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Loading skeletons ── */
@keyframes ac-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.ac-skeleton {
  border-radius: 8px;
  background: #e4edf8;
  position: relative;
  overflow: hidden;
}

.ac-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
  animation: ac-shimmer 1.5s infinite;
}

.ac-skeleton-desktop {
  display: flex;
  flex-direction: column;
}

.ac-skeleton-mobile {
  display: none;
}

.ac-skeleton-row {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 160px 158px 122px 150px;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f5fb;
}

.ac-skeleton-row:last-child {
  border-bottom: none;
}

.ac-skeleton-user {
  display: flex;
  align-items: center;
  gap: 13px;
}

.ac-skeleton-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ac-skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ac-skeleton-name   { height: 14px; width: 65%; }
.ac-skeleton-badge  { height: 20px; width: 42%; border-radius: 999px; }
.ac-skeleton-text   { height: 13px; width: 80%; }
.ac-skeleton-btn    { height: 38px; border-radius: 12px; }

/* ── Empty / Error states ── */
.ac-empty,
.ac-error {
  text-align: center;
  padding: 60px 24px;
  border-radius: 16px;
  background: #f5f9ff;
  border: 1.5px dashed #ccddf0;
  color: #617894;
}

.ac-state-icon {
  font-size: 2.6rem;
  margin-bottom: 14px;
  display: block;
  line-height: 1;
}

.ac-empty-title,
.ac-error-title {
  color: #1b3a5c;
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.ac-empty-desc,
.ac-error-desc {
  font-size: 0.9rem;
  line-height: 1.9;
  color: #7a90ab;
}

.ac-empty-btn {
  margin-top: 20px;
  border: none;
  background: linear-gradient(135deg, #2563a8 0%, #1d4f8f 100%);
  color: #fff;
  border-radius: 12px;
  padding: 12px 22px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.91rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 168, 0.28);
  transition: all 0.2s ease;
}

.ac-empty-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 99, 168, 0.38);
}

/* ── Pagination ── */
.ac-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eef3f9;
}

.ac-page-btn {
  min-width: 38px;
  height: 38px;
  border: 1.5px solid #d2e3f0;
  background: #fff;
  color: #3d5a78;
  border-radius: 10px;
  padding: 0 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.18s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ac-page-btn:hover:not(:disabled):not(.active) {
  background: #edf5ff;
  border-color: #9fc0e0;
  color: #2563a8;
}

.ac-page-btn.active {
  background: linear-gradient(135deg, #2563a8 0%, #1d4f8f 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(37, 99, 168, 0.3);
}

.ac-page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ac-page-dots {
  color: #a8bfd6;
  font-weight: 800;
  padding: 0 4px;
}

/* ── Mobile cards ── */
.ac-mobile-card-list {
  display: none;
}

/* ── Scroll-to-filter FAB ── */
.ac-scroll-filter-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 99;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #1b3a5c 0%, #2563a8 100%);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 13px 20px 13px 16px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(37, 99, 168, 0.42);
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  will-change: opacity, transform;
}

.ac-scroll-filter-fab.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.ac-scroll-filter-fab:hover {
  background: linear-gradient(135deg, #0d2442 0%, #1b3a5c 100%);
  box-shadow: 0 12px 36px rgba(37, 99, 168, 0.55);
  transform: translateY(-2px);
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .ac-list-head,
  .ac-row,
  .ac-skeleton-row {
    grid-template-columns: minmax(0, 1.5fr) 145px 145px 110px 140px;
  }
}

@media (max-width: 920px) {
  .all-craftsmen-layout {
    grid-template-columns: 1fr;
  }

  .ac-sidebar {
    position: static;
  }

  .ac-list-head,
  .ac-list,
  .ac-skeleton-desktop {
    display: none;
  }

  .ac-mobile-card-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ac-mobile-card {
    border: 1.5px solid #dde9f6;
    border-radius: 18px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(27, 58, 92, 0.05);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    animation: ac-fade-up 0.45s ease both;
  }

  .ac-mobile-card:nth-child(1) { animation-delay: 0.05s; }
  .ac-mobile-card:nth-child(2) { animation-delay: 0.12s; }
  .ac-mobile-card:nth-child(3) { animation-delay: 0.19s; }
  .ac-mobile-card:nth-child(4) { animation-delay: 0.26s; }
  .ac-mobile-card:nth-child(5) { animation-delay: 0.33s; }

  .ac-mobile-card:hover {
    box-shadow: 0 6px 24px rgba(27, 58, 92, 0.11);
    border-color: #b8d2ee;
  }

  .ac-mobile-top {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }

  .ac-mobile-middle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .ac-mobile-box {
    background: #f5f9ff;
    border: 1px solid #d8eaf7;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .ac-mobile-box-label {
    color: #98b0c8;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }

  .ac-mobile-box-value {
    color: #1b3a5c;
    font-size: 0.9rem;
    font-weight: 800;
  }

  .ac-skeleton-mobile {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ac-skeleton-mobile .ac-mobile-card {
    pointer-events: none;
  }
}

@media (max-width: 640px) {
  .all-craftsmen-page {
    padding: 20px 14px 44px;
  }

  .all-craftsmen-header {
    padding: 26px 22px;
  }

  .all-craftsmen-title {
    font-size: 1.65rem;
  }

  .ac-mobile-middle {
    grid-template-columns: 1fr;
  }

  .ac-topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .ac-search-wrap {
    min-width: 0;
  }

  .ac-results-chip {
    text-align: center;
  }
}

`

const professionMeta = {
  engineer: { key: 'engineer', ar: 'مهندس', en: 'Engineer' },
  plumber: { key: 'plumber', ar: 'سباك', en: 'Plumber' },
  painter: { key: 'painter', ar: 'دهان', en: 'Painter' },
  carpenter: { key: 'carpenter', ar: 'نجار', en: 'Carpenter' },
  electrician: { key: 'electrician', ar: 'كهربائي', en: 'Electrician' },
  technician: { key: 'technician', ar: 'فني', en: 'Technician' },
  driver: { key: 'driver', ar: 'سائق', en: 'Driver' },
  mechanic: { key: 'mechanic', ar: 'ميكانيكي', en: 'Mechanic' },

  مهندس: { key: 'engineer', ar: 'مهندس', en: 'Engineer' },
  سباك: { key: 'plumber', ar: 'سباك', en: 'Plumber' },
  'سبّاك': { key: 'plumber', ar: 'سباك', en: 'Plumber' },
  دهان: { key: 'painter', ar: 'دهان', en: 'Painter' },
  نجار: { key: 'carpenter', ar: 'نجار', en: 'Carpenter' },
  كهربائي: { key: 'electrician', ar: 'كهربائي', en: 'Electrician' },
  فني: { key: 'technician', ar: 'فني', en: 'Technician' },
  سائق: { key: 'driver', ar: 'سائق', en: 'Driver' },
  ميكانيكي: { key: 'mechanic', ar: 'ميكانيكي', en: 'Mechanic' },
}

const regionOrder = ['غزة', 'شمال غزة', 'الوسطى', 'الجنوب']

function readJsonSafe(response) {
  return response.json().catch(() => null)
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.craftsmen)) return payload.craftsmen
  if (Array.isArray(payload?.data?.craftsmen)) return payload.data.craftsmen
  if (Array.isArray(payload?.data?.craftsmenList)) return payload.data.craftsmenList
  return []
}

function resolveImage(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/uploads')) return `${API_BASE_URL}${src}`
  return src
}

function getCurrentLoggedInCraftsmanId() {
  if (typeof window === 'undefined') return ''
  try {
    const raw = window.localStorage.getItem('forsaCraftsman')
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    return String(parsed?._id || parsed?.id || '').trim()
  } catch {
    return ''
  }
}

function normalizePriceValue(item) {
  const candidates = [
    item?.price,
    item?.hourlyRate,
    item?.servicePrice,
    item?.startingPrice,
    item?.minPrice,
    item?.priceRange?.min,
  ]

  const found = candidates.find((value) => value !== undefined && value !== null && value !== '')
  if (found === undefined) return null

  const numeric = Number(found)
  return Number.isFinite(numeric) ? numeric : null
}

function normalizeCraftsman(item) {
  const rawProfession = String(item?.profession || '').trim()
  const professionInfo = professionMeta[rawProfession] || {
    key: rawProfession.toLowerCase(),
    ar: rawProfession || 'غير محدد',
    en: rawProfession || 'Unknown',
  }

  const firstName = item?.firstName || ''
  const lastName = item?.lastName || ''

  return {
    id: item?._id || item?.id || '',
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim() || 'بدون اسم',
    professionKey: professionInfo.key,
    professionAr: professionInfo.ar,
    professionEn: professionInfo.en,
    city: item?.city || '',
    neighborhood: item?.neighborhood || '',
    phone: item?.phone || '',
    email: item?.email || '',
    years: Number(item?.yearsOfExperience ?? item?.years ?? 0),
    profileImage: item?.profileImage || item?.avatar || item?.image || '',
    featured: Boolean(item?.featured ?? item?.isFeatured ?? false),
    price: normalizePriceValue(item),
  }
}

function getPageNumbers(totalPages, currentPage) {
  const pages = []

  for (let i = 1; i <= totalPages; i += 1) {
    const shouldShow =
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 1

    if (shouldShow) {
      pages.push(i)
    } else {
      const prev = pages[pages.length - 1]
      if (prev !== 'dots') {
        pages.push('dots')
      }
    }
  }

  return pages
}

export default function AllCraftsmen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useLanguage()
  const currentLoggedInCraftsmanId = useMemo(() => getCurrentLoggedInCraftsmanId(), [])
  const filterRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'استعراض كل الحرفيين',
            subtitle:
              'تصفّح جميع الحرفيين المسجلين في المنصة، حتى لو لم تكن حرفتهم موجودة ضمن التصنيفات الرئيسية.',
            filtersTitle: 'تصفية النتائج',
            searchPlaceholder: 'ابحث بالاسم، الحرفة، المنطقة أو رقم الهاتف',
            resultsCount: 'حرفي',
            profession: 'الحرفة',
            region: 'المنطقة',
            price: 'رينج الأسعار',
            priceFrom: 'من',
            priceTo: 'إلى',
            priceUnknown: 'السعر غير محدد',
            pricePerHour: '₪ / ساعة',
            noPriceData:
              'حقل السعر غير موجود حالياً في بيانات الحرفيين، لذلك هذا الفلتر جاهز وسيعمل مباشرة بعد إضافة السعر في الباك.',
            experience: 'الخبرة',
            years: 'سنة',
            location: 'الموقع',
            phone: 'رقم الهاتف',
            requestService: 'عرض التفاصيل',
            clearFilters: 'مسح الفلاتر',
            noResultsTitle: 'لا توجد نتائج مطابقة',
            noResultsDesc: 'جرّبي تعديل الفلاتر أو البحث بكلمة أخرى.',
            clearResultsFilters: 'إزالة الفلاتر',
            loadingTitle: 'جاري تحميل الحرفيين',
            loadingDesc: 'يرجى الانتظار قليلاً حتى يتم جلب البيانات.',
            errorTitle: 'تعذر تحميل البيانات',
            errorDesc: 'حدث خطأ أثناء جلب الحرفيين من قاعدة البيانات.',
            retry: 'إعادة المحاولة',
            allRegions: 'كل المناطق',
            page: 'صفحة',
            of: 'من',
            badgeFeatured: 'مميز',
            locationUnknown: 'الموقع غير محدد',
            phoneUnknown: 'لا يوجد رقم',
            scrollToFilter: 'تصفية النتائج',
          }
        : {
            title: 'Browse All Craftsmen',
            subtitle:
              'View all craftsmen registered on the platform, even if their profession is not part of the main categories.',
            filtersTitle: 'Filter Results',
            searchPlaceholder: 'Search by name, profession, region or phone',
            resultsCount: 'craftsmen',
            profession: 'Profession',
            region: 'Region',
            price: 'Price Range',
            priceFrom: 'From',
            priceTo: 'To',
            priceUnknown: 'Price not specified',
            pricePerHour: '₪ / hour',
            noPriceData:
              'Price is not currently stored in craftsmen data. This filter is ready and will start working once the backend sends a price field.',
            experience: 'Experience',
            years: 'years',
            location: 'Location',
            phone: 'Phone',
            requestService: 'View Details',
            clearFilters: 'Clear Filters',
            noResultsTitle: 'No matching results',
            noResultsDesc: 'Try changing filters or searching with another keyword.',
            clearResultsFilters: 'Reset Filters',
            loadingTitle: 'Loading craftsmen',
            loadingDesc: 'Please wait while data is being fetched.',
            errorTitle: 'Failed to load data',
            errorDesc: 'Something went wrong while fetching craftsmen from the database.',
            retry: 'Try Again',
            allRegions: 'All regions',
            page: 'Page',
            of: 'of',
            badgeFeatured: 'Featured',
            locationUnknown: 'Location not specified',
            phoneUnknown: 'No phone',
            scrollToFilter: 'Filter',
          },
    [language]
  )

  const params = new URLSearchParams(location.search)
  const initialProfessionParam = params.get('profession') || ''

  const [allCraftsmen, setAllCraftsmen] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedProfessions, setSelectedProfessions] = useState([])
  const [selectedRegions, setSelectedRegions] = useState([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToFilter = () => {
    if (!filterRef.current) return
    const top = filterRef.current.getBoundingClientRect().top + window.scrollY - 20
    window.scrollTo({ top, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!initialProfessionParam) return

    const professionInfo =
      professionMeta[initialProfessionParam] ||
      professionMeta[String(initialProfessionParam).trim()] ||
      null

    if (!professionInfo?.key) return

    setSelectedProfessions([professionInfo.key])
  }, [initialProfessionParam])

  const fetchCraftsmen = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${ALL_CRAFTSMEN_ENDPOINT}?limit=100`)
      const payload = await readJsonSafe(response)

      if (!response.ok) {
        throw new Error(payload?.status?.message || payload?.message || 'Failed to fetch craftsmen')
      }

      const normalized = extractList(payload).map(normalizeCraftsman)
      setAllCraftsmen(normalized)
    } catch (err) {
      setAllCraftsmen([])
      setError(err.message || 'Failed to fetch craftsmen')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCraftsmen()
  }, [])

  const visibleCraftsmen = useMemo(() => {
    if (!currentLoggedInCraftsmanId) return allCraftsmen
    return allCraftsmen.filter(
      (item) => String(item.id || '') !== String(currentLoggedInCraftsmanId)
    )
  }, [allCraftsmen, currentLoggedInCraftsmanId])

  const professionOptions = useMemo(() => {
    const map = new Map()

    visibleCraftsmen.forEach((craftsman) => {
      if (!craftsman.professionKey) return

      if (!map.has(craftsman.professionKey)) {
        map.set(craftsman.professionKey, {
          key: craftsman.professionKey,
          label: language === 'ar' ? craftsman.professionAr : craftsman.professionEn,
          count: 0,
        })
      }

      map.get(craftsman.professionKey).count += 1
    })

    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [visibleCraftsmen, language])

  const regionOptions = useMemo(() => {
    const counts = {}

    visibleCraftsmen.forEach((craftsman) => {
      const region = craftsman.city
      if (!region) return
      counts[region] = (counts[region] || 0) + 1
    })

    const fetchedRegions = Object.keys(counts)
    const ordered = [...new Set([...regionOrder, ...fetchedRegions])]

    return ordered
      .filter((region) => counts[region])
      .map((region) => ({
        key: region,
        label: region,
        count: counts[region],
      }))
  }, [visibleCraftsmen])

  const hasAnyPriceData = useMemo(
    () => visibleCraftsmen.some((craftsman) => craftsman.price !== null),
    [visibleCraftsmen]
  )

  const filteredCraftsmen = useMemo(() => {
    const query = search.trim().toLowerCase()
    const hasPriceFilter = priceMin !== '' || priceMax !== ''

    return visibleCraftsmen.filter((craftsman) => {
      const searchableText = [
        craftsman.fullName,
        craftsman.professionAr,
        craftsman.professionEn,
        craftsman.city,
        craftsman.neighborhood,
        craftsman.phone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (query && !searchableText.includes(query)) {
        return false
      }

      if (
        selectedProfessions.length > 0 &&
        !selectedProfessions.includes(craftsman.professionKey)
      ) {
        return false
      }

      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(craftsman.city)
      ) {
        return false
      }

      if (hasPriceFilter) {
        if (craftsman.price === null) return false

        const numericMin = priceMin === '' ? -Infinity : Number(priceMin)
        const numericMax = priceMax === '' ? Infinity : Number(priceMax)

        if (craftsman.price < numericMin || craftsman.price > numericMax) {
          return false
        }
      }

      return true
    })
  }, [visibleCraftsmen, search, selectedProfessions, selectedRegions, priceMin, priceMax])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedProfessions, selectedRegions, priceMin, priceMax])

  const totalPages = Math.max(1, Math.ceil(filteredCraftsmen.length / PER_PAGE))

  const paginatedCraftsmen = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE
    return filteredCraftsmen.slice(start, start + PER_PAGE)
  }, [filteredCraftsmen, currentPage])

  const activeFilters = useMemo(() => {
    const tags = []

    selectedProfessions.forEach((key) => {
      const profession = professionOptions.find((item) => item.key === key)
      if (profession) {
        tags.push({
          type: 'profession',
          value: key,
          label: profession.label,
        })
      }
    })

    selectedRegions.forEach((region) => {
      tags.push({
        type: 'region',
        value: region,
        label: region,
      })
    })

    if (priceMin !== '' || priceMax !== '') {
      tags.push({
        type: 'price',
        value: 'price-range',
        label:
          language === 'ar'
            ? `السعر: ${priceMin || '0'} - ${priceMax || '∞'}`
            : `Price: ${priceMin || '0'} - ${priceMax || '∞'}`,
      })
    }

    return tags
  }, [selectedProfessions, selectedRegions, priceMin, priceMax, professionOptions, language])

  const pageNumbers = getPageNumbers(totalPages, currentPage)

  const toggleProfession = (professionKey) => {
    setSelectedProfessions((prev) =>
      prev.includes(professionKey)
        ? prev.filter((item) => item !== professionKey)
        : [...prev, professionKey]
    )
  }

  const toggleRegion = (regionKey) => {
    setSelectedRegions((prev) =>
      prev.includes(regionKey)
        ? prev.filter((item) => item !== regionKey)
        : [...prev, regionKey]
    )
  }

  const removeFilterTag = (tag) => {
    if (tag.type === 'profession') {
      setSelectedProfessions((prev) => prev.filter((item) => item !== tag.value))
      return
    }

    if (tag.type === 'region') {
      setSelectedRegions((prev) => prev.filter((item) => item !== tag.value))
      return
    }

    if (tag.type === 'price') {
      setPriceMin('')
      setPriceMax('')
    }
  }

  const clearAllFilters = () => {
    setSearch('')
    setSelectedProfessions([])
    setSelectedRegions([])
    setPriceMin('')
    setPriceMax('')
    setCurrentPage(1)
  }

  const handleRequestService = (craftsman) => {
    if (!craftsman?.id) return
    navigate(`/craftsman/${craftsman.id}`)
  }

  const getProfileImage = (craftsman) => {
    return resolveImage(craftsman?.profileImage) || DEFAULT_PROFILE_IMAGE
  }

  const getProfessionLabel = (craftsman) => {
    return language === 'ar' ? craftsman.professionAr : craftsman.professionEn
  }

  const getLocationText = (craftsman) => {
    return [craftsman.city, craftsman.neighborhood].filter(Boolean).join(' - ') || labels.locationUnknown
  }

  return (
    <section className="all-craftsmen-page">
      <style>{pageCss}</style>

      <div className="all-craftsmen-shell">
        <div className="all-craftsmen-header">
          <div className="ac-header-inner">
            <div className="ac-header-text">
              <h1 className="all-craftsmen-title">{labels.title}</h1>
              <span className="ac-header-rule" aria-hidden="true"></span>
              <p className="all-craftsmen-subtitle">{labels.subtitle}</p>
            </div>
            <div className="ac-header-deco" aria-hidden="true">
              <Briefcase size={104} strokeWidth={0.7} />
            </div>
          </div>
        </div>

        <div className="all-craftsmen-layout">
          <aside className="ac-sidebar" ref={filterRef}>
            <div className="ac-sidebar-card">
              <div className="ac-sidebar-title">
                <Filter size={18} />
                <span>{labels.filtersTitle}</span>
                {activeFilters.length > 0 && (
                  <span className="ac-filter-count-badge">{activeFilters.length}</span>
                )}
              </div>

              <div className="ac-filter-group">
                <div className="ac-filter-label">
                  <Briefcase size={16} />
                  <span>{labels.profession}</span>
                </div>

                <div className="ac-checkbox-list">
                  {professionOptions.map((profession) => (
                    <label key={profession.key} className="ac-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedProfessions.includes(profession.key)}
                        onChange={() => toggleProfession(profession.key)}
                      />
                      <span className="ac-checkbox-text">{profession.label}</span>
                      <span className="ac-checkbox-count">{profession.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ac-filter-group">
                <div className="ac-filter-label">
                  <MapPin size={16} />
                  <span>{labels.region}</span>
                </div>

                <div className="ac-checkbox-list">
                  {regionOptions.map((region) => (
                    <label key={region.key} className="ac-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region.key)}
                        onChange={() => toggleRegion(region.key)}
                      />
                      <span className="ac-checkbox-text">{region.label}</span>
                      <span className="ac-checkbox-count">{region.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ac-filter-group">
                <div className="ac-filter-label">
                  <CircleDollarSign size={16} />
                  <span>{labels.price}</span>
                </div>

                <div className="ac-price-row">
                  <input
                    type="number"
                    min="0"
                    className="ac-price-input"
                    placeholder={labels.priceFrom}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />

                  <span className="ac-price-separator">—</span>

                  <input
                    type="number"
                    min="0"
                    className="ac-price-input"
                    placeholder={labels.priceTo}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>

                {!hasAnyPriceData ? (
                  <div className="ac-price-note">{labels.noPriceData}</div>
                ) : null}
              </div>

              <button type="button" className="ac-clear-btn" onClick={clearAllFilters}>
                {labels.clearFilters}
              </button>
            </div>
          </aside>

          <main className="ac-main-card">
            <div className="ac-topbar">
              <div className="ac-search-wrap">
                <input
                  type="text"
                  className="ac-search-input"
                  placeholder={labels.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="ac-search-icon">
                  <Search size={18} />
                </span>
              </div>

              <div className="ac-results-chip">
                {filteredCraftsmen.length} {labels.resultsCount}
              </div>
            </div>

            {activeFilters.length > 0 ? (
              <div className="ac-active-filters">
                {activeFilters.map((tag) => (
                  <span key={`${tag.type}-${tag.value}`} className="ac-active-tag">
                    {tag.label}
                    <button type="button" onClick={() => removeFilterTag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            {loading ? (
              <>
                <div className="ac-skeleton-desktop">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="ac-skeleton-row">
                      <div className="ac-skeleton-user">
                        <div className="ac-skeleton ac-skeleton-avatar" />
                        <div className="ac-skeleton-lines">
                          <div className="ac-skeleton ac-skeleton-name" />
                          <div className="ac-skeleton ac-skeleton-badge" />
                        </div>
                      </div>
                      <div className="ac-skeleton ac-skeleton-text" />
                      <div className="ac-skeleton ac-skeleton-text" />
                      <div className="ac-skeleton ac-skeleton-text" />
                      <div className="ac-skeleton ac-skeleton-btn" />
                    </div>
                  ))}
                </div>
                <div className="ac-skeleton-mobile">
                  {[1,2,3].map((i) => (
                    <div key={i} className="ac-mobile-card">
                      <div className="ac-mobile-top">
                        <div className="ac-skeleton ac-skeleton-avatar" />
                        <div className="ac-skeleton-lines">
                          <div className="ac-skeleton ac-skeleton-name" />
                          <div className="ac-skeleton ac-skeleton-badge" />
                        </div>
                      </div>
                      <div className="ac-mobile-middle">
                        <div className="ac-skeleton" style={{height:'58px',borderRadius:'12px'}} />
                        <div className="ac-skeleton" style={{height:'58px',borderRadius:'12px'}} />
                        <div className="ac-skeleton" style={{height:'58px',borderRadius:'12px'}} />
                        <div className="ac-skeleton" style={{height:'58px',borderRadius:'12px'}} />
                      </div>
                      <div className="ac-skeleton ac-skeleton-btn" />
                    </div>
                  ))}
                </div>
              </>
            ) : error ? (
              <div className="ac-error">
                <span className="ac-state-icon">⚠️</span>
                <div className="ac-error-title">{labels.errorTitle}</div>
                <div className="ac-error-desc">{labels.errorDesc}</div>
                <button type="button" className="ac-empty-btn" onClick={fetchCraftsmen}>
                  {labels.retry}
                </button>
              </div>
            ) : filteredCraftsmen.length === 0 ? (
              <div className="ac-empty">
                <span className="ac-state-icon">🔍</span>
                <div className="ac-empty-title">{labels.noResultsTitle}</div>
                <div className="ac-empty-desc">{labels.noResultsDesc}</div>
                <button type="button" className="ac-empty-btn" onClick={clearAllFilters}>
                  {labels.clearResultsFilters}
                </button>
              </div>
            ) : (
              <>
                <div className="ac-list-head">
                  <div>{labels.profession}</div>
                  <div>{labels.location}</div>
                  <div>{labels.phone}</div>
                  <div>{labels.experience}</div>
                  <div>{labels.requestService}</div>
                </div>

                <div className="ac-list">
                  {paginatedCraftsmen.map((craftsman) => (
                    <div key={craftsman.id} className="ac-row">
                      <div className="ac-user">
                        <img
                          src={getProfileImage(craftsman)}
                          alt={craftsman.fullName}
                          className="ac-avatar"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />

                        <div className="ac-user-info">
                          <div className="ac-name">{craftsman.fullName}</div>

                          <div className="ac-profession">
                            {getProfessionLabel(craftsman)}
                          </div>

                          {craftsman.featured ? (
                            <span className="ac-featured-badge">★ {labels.badgeFeatured}</span>
                          ) : null}

                          <div className="ac-meta">
                            <span className="ac-meta-item">
                              <MapPin size={14} />
                              {getLocationText(craftsman)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ac-col">
                        <div>{craftsman.city || labels.locationUnknown}</div>
                        <div className="ac-col-muted">
                          {craftsman.neighborhood || labels.locationUnknown}
                        </div>
                      </div>

                      <div className="ac-col">
                        <span className="ac-phone">
                          {craftsman.phone || labels.phoneUnknown}
                        </span>
                      </div>

                      <div className="ac-col">
                        <div>
                          {craftsman.years} {labels.years}
                        </div>

                        <div style={{ marginTop: 8 }}>
                          <span className="ac-price-badge">
                            {craftsman.price !== null
                              ? `${craftsman.price} ${labels.pricePerHour}`
                              : labels.priceUnknown}
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          className="ac-request-btn"
                          onClick={() => handleRequestService(craftsman)}
                          disabled={!craftsman.id}
                        >
                          {labels.requestService}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ac-mobile-card-list">
                  {paginatedCraftsmen.map((craftsman) => (
                    <div key={craftsman.id} className="ac-mobile-card">
                      <div className="ac-mobile-top">
                        <img
                          src={getProfileImage(craftsman)}
                          alt={craftsman.fullName}
                          className="ac-avatar"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                          }}
                        />

                        <div className="ac-user-info">
                          <div className="ac-name">{craftsman.fullName}</div>
                          <div className="ac-profession">{getProfessionLabel(craftsman)}</div>
                        </div>
                      </div>

                      <div className="ac-mobile-middle">
                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.location}</div>
                          <div className="ac-mobile-box-value">{getLocationText(craftsman)}</div>
                        </div>

                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.phone}</div>
                          <div className="ac-mobile-box-value ac-phone">
                            {craftsman.phone || labels.phoneUnknown}
                          </div>
                        </div>

                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.experience}</div>
                          <div className="ac-mobile-box-value">
                            {craftsman.years} {labels.years}
                          </div>
                        </div>

                        <div className="ac-mobile-box">
                          <div className="ac-mobile-box-label">{labels.price}</div>
                          <div className="ac-mobile-box-value">
                            {craftsman.price !== null
                              ? `${craftsman.price} ${labels.pricePerHour}`
                              : labels.priceUnknown}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ac-request-btn"
                        onClick={() => handleRequestService(craftsman)}
                        disabled={!craftsman.id}
                      >
                        {labels.requestService}
                      </button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="ac-pagination">
                    <button
                      type="button"
                      className="ac-page-btn"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight size={18} />
                    </button>

                    {pageNumbers.map((item, index) =>
                      item === 'dots' ? (
                        <span key={`dots-${index}`} className="ac-page-dots">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`ac-page-btn ${currentPage === item ? 'active' : ''}`}
                          onClick={() => setCurrentPage(item)}
                        >
                          {item}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      className="ac-page-btn"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </main>
        </div>
      </div>

      <button
        type="button"
        className={`ac-scroll-filter-fab${showScrollBtn ? ' visible' : ''}`}
        onClick={scrollToFilter}
        aria-label={labels.filtersTitle}
      >
        <Filter size={17} />
        <span>{labels.scrollToFilter}</span>
      </button>
    </section>
  )
}
