import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const PROFILE_ENDPOINT = `${API_BASE_URL}/api/craftsmen/me`;
const MY_REQUESTS_ENDPOINT = `${API_BASE_URL}/api/service-requests/me`;
const DEFAULT_PROFILE_IMAGE = "/images/default-user.png";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --blue-dark:#1B3A5C;
  --blue:#2563A8;
  --blue-mid:#3A7BD5;
  --blue-light:#EBF3FF;
  --blue-border:#C5D9F2;
  --white:#FFFFFF;
  --gray-bg:#D6E8FF;
  --gray-text:#6B7A99;
  --gray-border:#DDE4EF;
  --text:#1A2740;
  --red:#E53E3E;
  --green:#16A34A;
  --green-bg:#DCFCE7;
  --yellow:#D97706;
  --yellow-bg:#FEF3C7;
  --yellow-border:#FCD34D;
  --sky:#0284c7;
  --sky-bg:#E0F2FE;
  --shadow:0 2px 16px rgba(37,99,168,0.10);
  --shadow-lg:0 8px 32px rgba(37,99,168,0.15);
}
html,body{height:100%;font-family:'Cairo',sans-serif;background:var(--gray-bg);color:var(--text);direction:rtl}
body{overflow-x:hidden}
.app{display:flex;min-height:100vh;width:100%}

/* Sidebar */
.sidebar{width:230px;background:#fff;display:flex;flex-direction:column;position:fixed;top:0;right:0;bottom:0;z-index:100;box-shadow:0 0 24px rgba(0,0,0,0.09);border-left:1px solid #e8ecf3}
.sb-brand{padding:0 18px;height:56px;background:#1B3A5C;display:flex;align-items:center;gap:10px;flex-shrink:0}
.sb-brand-icon{width:32px;height:32px;background:rgba(255,255,255,0.18);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sb-brand-name{font-family:'Tajawal',sans-serif;font-size:19px;font-weight:800;color:#fff}
.sb-brand-name span{color:#7DC8FF}
.sb-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
.sb-divider{height:1px;background:#EEF1F6;margin:8px 4px}
.sb-section-label{font-size:10px;font-weight:700;color:#A0AABF;letter-spacing:.8px;padding:6px 10px 2px;text-transform:uppercase}
.sb-item{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .18s;color:#4B5675;font-size:13.5px;font-weight:600;border:none;background:none;width:100%;text-align:right;font-family:'Cairo',sans-serif}
.sb-item:hover{background:#EBF3FF;color:#2563A8}
.sb-item.active{background:#2563A8;color:#fff;box-shadow:0 4px 14px rgba(37,99,168,0.22)}
.sb-item-main{display:flex;align-items:center;gap:9px}
.sb-count{min-width:20px;height:20px;border-radius:999px;background:#2563A8;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;padding:0 6px}
.sb-item.active .sb-count{background:rgba(255,255,255,0.25);color:#fff}
.sb-footer{border-top:1px solid #EEF1F6;padding:12px 10px}
.sb-footer-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:#F4F7FB}
.sb-footer-avatar-img{width:38px;height:38px;border-radius:50%;border:2px solid #e2e8f0;object-fit:cover;flex-shrink:0}
.sb-footer-avatar-letter{width:38px;height:38px;border-radius:50%;border:2px solid #e2e8f0;background:#2563A8;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0}
.sb-footer-info{flex:1;min-width:0}
.sb-footer-name{font-size:13px;font-weight:700;color:#1A2740;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
.sb-footer-role{font-size:11px;color:#6B7A99;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-footer-logout{width:30px;height:30px;border-radius:8px;border:none;background:#FEE2E2;color:#DC2626;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .2s}
.sb-footer-logout:hover{background:#FECACA;color:#B91C1C}

/* Main */
.main{margin-right:230px;flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0}

/* Page top header */
.page-top{height:56px;background:#1B3A5C;display:flex;align-items:center;padding:0 28px;box-shadow:0 2px 10px rgba(27,58,92,0.25);flex-shrink:0}
.page-top-title{font-family:'Tajawal',sans-serif;font-size:16px;font-weight:800;color:#fff;letter-spacing:.2px}

/* Profile card */
.profile-card{background:var(--white);border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:16px;box-shadow:var(--shadow);border:1px solid var(--gray-border);margin-bottom:18px}
.avatar-wrap{position:relative;display:inline-block;flex-shrink:0}
.avatar{width:72px;height:72px;border-radius:50%;border:3px solid var(--blue-light);object-fit:cover;background:var(--blue-light);display:flex;align-items:center;justify-content:center;font-size:26px;color:var(--blue);font-weight:800}
.avatar-edit-btn{position:absolute;bottom:1px;left:0;width:24px;height:24px;background:var(--blue);border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(37,99,168,0.35);transition:background .2s}
.avatar-edit-btn:hover{background:var(--blue-mid)}
.profile-info{flex:1;min-width:0}
.profile-name{font-family:'Tajawal',sans-serif;font-size:18px;font-weight:800;color:var(--text)}
.profile-meta{display:flex;align-items:center;gap:10px;margin-top:5px;flex-wrap:wrap}
.meta-chip{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--gray-text);font-weight:500}
.badge-pro{background:var(--blue-light);color:var(--blue);border:1px solid var(--blue-border);border-radius:20px;padding:2px 11px;font-size:12px;font-weight:700}

/* Content */
.content{flex:1;padding:20px 26px;animation:fadeIn .35s ease;min-width:0}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.sec-title{font-family:'Tajawal',sans-serif;font-size:16px;font-weight:800;color:var(--blue-dark);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.sec-title::after{content:'';flex:1;height:2px;background:linear-gradient(to left,transparent,var(--blue-border))}
.card{background:var(--white);border-radius:14px;box-shadow:var(--shadow);padding:20px 22px;border:1px solid var(--gray-border)}

.fields-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-top:1px solid var(--gray-border)}
.fg{display:flex;flex-direction:column;gap:5px;padding:18px 0;border-bottom:1px solid var(--gray-border)}
.fg.full{grid-column:1/-1}
.flabel{font-size:12px;font-weight:600;color:var(--gray-text);display:flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:.3px}
.flabel svg{color:var(--blue)}
.fval{font-size:15px;font-weight:700;color:var(--text);padding:1px 0}
.fval.muted{color:var(--text);font-weight:600}
.finput{background:var(--blue-light);border:1.5px solid var(--blue-border);border-radius:10px;padding:11px 14px;font-size:14px;color:var(--text);font-family:'Cairo',sans-serif;outline:none;width:100%;direction:rtl;transition:border-color .2s,box-shadow .2s}
.finput:focus,.ftextarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,168,0.12)}
.ftextarea{background:var(--blue-light);border:1.5px solid var(--blue-border);border-radius:10px;padding:11px 14px;font-size:14px;color:var(--text);font-family:'Cairo',sans-serif;outline:none;width:100%;direction:rtl;transition:border-color .2s,box-shadow .2s;resize:vertical;min-height:110px}
.edit-bar{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}
.notice{background:var(--blue-light);border:1px solid var(--blue-border);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--blue);display:flex;align-items:center;gap:8px;margin-bottom:16px}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0;padding-bottom:18px}
.card-title{font-family:'Tajawal',sans-serif;font-size:17px;font-weight:800;color:var(--blue-dark);display:flex;align-items:center;gap:8px}
.card-title svg{color:var(--blue)}
.edit-toggle{display:inline-flex;align-items:center;gap:7px;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:700;font-family:'Cairo',sans-serif;cursor:pointer;background:var(--blue);color:#fff;border:none;transition:all .2s;box-shadow:0 2px 8px rgba(37,99,168,0.22)}
.edit-toggle:hover{background:var(--blue-dark)}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--blue-dark);color:#fff;padding:13px 28px;border-radius:14px;font-size:14px;font-weight:700;font-family:'Cairo',sans-serif;box-shadow:0 8px 28px rgba(27,58,92,0.3);z-index:9999;white-space:nowrap;animation:fadeIn .25s ease}

.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:700;font-family:'Cairo',sans-serif;cursor:pointer;border:none;transition:all .2s}
.btn-primary{background:var(--blue);color:#fff;box-shadow:0 4px 14px rgba(37,99,168,0.28)}
.btn-primary:hover{background:var(--blue-dark);transform:translateY(-1px)}
.btn-ghost{background:var(--gray-bg);color:var(--gray-text);border:1.5px solid var(--gray-border)}
.btn-ghost:hover{background:var(--gray-border)}
.btn-success{background:var(--green);color:#fff;box-shadow:0 4px 14px rgba(22,163,74,0.22)}
.btn-success:hover{filter:brightness(.95)}
.btn-primary:disabled,.btn-ghost:disabled,.btn-success:disabled{opacity:.65;cursor:not-allowed;transform:none}

.photos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px}
.photo-card{border-radius:13px;overflow:hidden;aspect-ratio:1;position:relative;background:var(--blue-light);border:2px solid var(--blue-border);transition:transform .2s,box-shadow .2s}
.photo-card:hover{transform:scale(1.02);box-shadow:0 8px 24px rgba(37,99,168,0.2)}
.photo-card img{width:100%;height:100%;object-fit:cover}
.photo-card-label{position:absolute;bottom:0;right:0;left:0;background:linear-gradient(to top,rgba(0,0,0,.6),transparent);color:#fff;padding:16px 10px 10px;font-size:12px;font-weight:600}
.photo-add{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--blue);border:2px dashed var(--blue-border);background:var(--blue-light);cursor:pointer;border-radius:13px;aspect-ratio:1;transition:all .2s;font-size:13px;font-weight:600}
.photo-add:hover{background:#D6E9FF;border-color:var(--blue)}
.add-circle{width:44px;height:44px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;box-shadow:0 4px 14px rgba(37,99,168,0.3)}

/* Requests */
.requests-wrap{
  max-width:980px;
  width:100%;
  margin-inline:auto;
}

.requests-toolbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  margin-bottom:14px;
}

.requests-refresh{
  border:none;
  background:var(--blue-light);
  color:var(--blue);
  border:1px solid var(--blue-border);
  border-radius:10px;
  padding:10px 14px;
  font-family:'Cairo',sans-serif;
  font-weight:700;
  cursor:pointer;
}

.requests-refresh:hover{
  background:#dbeafe;
}

.requests-shell{
  background:var(--white);
  border:1px solid var(--gray-border);
  border-radius:18px;
  box-shadow:var(--shadow);
  padding:14px;
  max-width:980px;
  width:100%;
  margin-inline:auto;
  max-height:62vh;
  overflow-y:auto;
  overflow-x:auto;
}

.requests-table{
  min-width:900px;
}

.requests-head-row,
.request-row-item{
  display:grid;
  grid-template-columns: 1.1fr 1fr 1.3fr .9fr 1.35fr 1fr;
  gap:10px;
  align-items:center;
}

.requests-head-row{
  position:sticky;
  top:0;
  z-index:3;
  background:var(--gray-bg);
  border:1px solid var(--gray-border);
  border-radius:14px;
  padding:12px 14px;
  margin-bottom:10px;
}

.requests-head-cell{
  font-size:13px;
  font-weight:800;
  color:var(--blue-dark);
  white-space:nowrap;
}

.request-row-item{
  background:#fcfdff;
  border:1px solid var(--gray-border);
  border-radius:14px;
  padding:12px 14px;
  margin-bottom:10px;
}

.request-cell{
  min-width:0;
}

.request-cell.name{
  font-size:14px;
  font-weight:800;
  color:var(--blue-dark);
}

.request-cell.phone{
  direction:ltr;
  unicode-bidi:plaintext;
  font-size:14px;
  font-weight:800;
  color:var(--text);
}

.request-cell.date{
  font-size:13px;
  font-weight:700;
  color:var(--text);
}

.request-status{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius:999px;
  padding:6px 12px;
  font-size:12px;
  font-weight:800;
  white-space:nowrap;
}

.request-status.pending{
  background:var(--yellow-bg);
  color:var(--yellow);
  border:1px solid var(--yellow-border);
}

.request-status.confirmed,
.request-status.contacted{
  background:var(--sky-bg);
  color:var(--sky);
  border:1px solid #bae6fd;
}

.request-status.completed{
  background:var(--green-bg);
  color:var(--green);
  border:1px solid #86efac;
}

.request-status.cancelled{
  background:#fee2e2;
  color:#dc2626;
  border:1px solid #fecaca;
}

.request-wa-group{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.request-wa{
  display:inline-flex;
  align-items:center;
  gap:7px;
  background:#25D366;
  color:#fff;
  text-decoration:none;
  border-radius:10px;
  padding:9px 12px;
  font-size:12px;
  font-weight:800;
  white-space:nowrap;
}

.request-wa:hover{
  filter:brightness(.96);
}

.request-action{
  display:flex;
  justify-content:flex-start;
}

.empty{
  text-align:center;
  padding:52px 24px;
  color:var(--gray-text);
}

.empty-icon{
  font-size:50px;
  margin-bottom:12px;
  opacity:.45;
}

.empty-txt{
  font-size:15px;
  font-weight:600;
}

.loading-box,.error-box{
  background:#fff;
  border:1px solid var(--gray-border);
  border-radius:16px;
  padding:24px;
  text-align:center;
}

.error-box{
  color:var(--red);
}

@media(max-width:768px){
  .sidebar{display:none}
  .main{margin-right:0}
  .page-top{padding:0 16px}
  .content{padding:14px 16px}
  .profile-card{flex-direction:column;align-items:flex-start;gap:12px}
  .requests-shell{max-height:58vh}
  .fields-grid{grid-template-columns:1fr}
}
`;

/* ═══════════ SVG ICONS ═══════════ */
const Ic = ({ d, s = 16 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const IcPerson = () => <Ic s={17} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
const IcGrid = () => <Ic s={17} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />;
const IcBell = () => <Ic s={17} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />;
const IcCheckCircle = () => <Ic s={17} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />;
const IcLogout = () => <Ic s={15} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const IcEdit = () => <Ic s={14} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IcCheck = () => <Ic s={14} d="M20 6L9 17l-5-5" />;
const IcPin = () => <Ic s={14} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IcPhone = () => <Ic s={14} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z" />;
const IcCam = () => <Ic s={13} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IcInfo = () => <Ic s={14} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v4M12 16h.01" />;
const IcMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IcBag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IcClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcWhatsApp = () => (
  <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M19.11 17.21c-.28-.14-1.64-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.31.21-.59.07-.28-.14-1.16-.43-2.21-1.36-.81-.72-1.36-1.61-1.52-1.89-.16-.28-.02-.43.12-.57.13-.13.28-.34.43-.5.14-.17.19-.28.29-.47.1-.19.05-.36-.02-.5-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.46h-.52c-.18 0-.47.07-.71.34-.25.28-.95.93-.95 2.27s.98 2.64 1.12 2.82c.14.19 1.92 2.93 4.66 4.11.65.28 1.16.45 1.56.57.66.21 1.27.18 1.74.11.53-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.19-.53-.33Z"/>
    <path d="M16.02 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.45 1.71 6.39L3 29l6.83-1.79a12.72 12.72 0 0 0 6.19 1.58h.01c7.05 0 12.77-5.72 12.77-12.77S23.08 3.2 16.02 3.2Zm0 23.35h-.01a10.54 10.54 0 0 1-5.38-1.47l-.39-.23-4.05 1.06 1.08-3.95-.25-.41a10.58 10.58 0 1 1 9 4.99Z"/>
  </svg>
);

const IcShekel = ({ s = 17 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2.5"
      y="2.5"
      width="19"
      height="19"
      rx="9.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <text
      x="12"
      y="15.5"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Cairo, Arial, sans-serif"
    >
      ₪
    </text>
  </svg>
);

/* Helpers */
const getToken = () =>
  localStorage.getItem("forsaToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

function formatPrice(price) {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "غير محدد";
  }
  return `${numericPrice} ₪ / ساعة`;
}

function normalizeDigits(value) {
  const map = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return String(value || "").replace(/[٠-٩]/g, (digit) => map[digit] || digit);
}

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`;
  if (src.startsWith("uploads")) return `${API_BASE_URL}/${src}`;
  return src;
}

function buildWhatsAppOptions(phone) {
  const cleaned = normalizeDigits(phone).trim().replace(/[^\d+]/g, "");

  if (!cleaned) return [];

  const noPlus = cleaned.replace(/^\+/, "");

  if (noPlus.startsWith("972")) {
    return [{ label: "تواصل واتساب", url: `https://wa.me/${noPlus}` }];
  }

  if (noPlus.startsWith("970")) {
    return [{ label: "تواصل واتساب", url: `https://wa.me/${noPlus}` }];
  }

  if (noPlus.startsWith("0")) {
    const localNumber = noPlus.slice(1);

    return [
      { label: "واتساب (+972)", url: `https://wa.me/972${localNumber}` },
      { label: "واتساب (+970)", url: `https://wa.me/970${localNumber}` },
    ];
  }

  return [{ label: "تواصل واتساب", url: `https://wa.me/${noPlus}` }];
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "confirmed":
      return "مؤكد";
    case "contacted":
      return "تم التواصل";
    case "completed":
      return "مكتمل";
    case "cancelled":
      return "ملغي";
    case "pending":
    default:
      return "قيد الانتظار";
  }
}

function normalizeCraftsman(craftsman) {
  return {
    firstName: craftsman?.firstName || "",
    lastName: craftsman?.lastName || "",
    phone: craftsman?.phone || "",
    email: craftsman?.email || "",
    city: craftsman?.city || "",
    neighborhood: craftsman?.neighborhood || "",
    profession: craftsman?.profession || "",
    yearsOfExperience:
      craftsman?.yearsOfExperience !== undefined && craftsman?.yearsOfExperience !== null
        ? String(craftsman.yearsOfExperience)
        : "",
    price:
      craftsman?.price !== undefined && craftsman?.price !== null
        ? String(craftsman.price)
        : "",
    bio: craftsman?.bio || "",
    profileImage: craftsman?.profileImage ? resolveImage(craftsman.profileImage) : "",
    workImages: Array.isArray(craftsman?.workImages)
      ? craftsman.workImages.map(resolveImage).filter(Boolean)
      : [],
  };
}

function extractRequests(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.serviceRequests)) return payload.serviceRequests;
  if (Array.isArray(payload?.data?.serviceRequests)) return payload.data.serviceRequests;
  return [];
}

function normalizeRequest(item) {
  return {
    id: item?._id || item?.id || Math.random().toString(36),
    clientName: item?.clientName || "بدون اسم",
    clientPhone: item?.clientPhone || "-",
    jobDetails: item?.jobDetails || "",
    status: item?.status || "pending",
    createdAt: item?.createdAt || "",
  };
}

/* Reusable UI Components */
function ReadonlyField({ label, value, icon }) {
  return (
    <div className="fg">
      <div className="flabel">
        {icon && <span style={{ color: "var(--blue)" }}>{icon}</span>}
        {label}
      </div>
      <div className="fval muted">{value || "—"}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  displayValue,
  placeholder,
  icon,
  editing,
  onChange,
  inputMode = "text",
  dir = "rtl",
  textarea = false,
  className = "",
}) {
  return (
    <div className={`fg${className ? ` ${className}` : ""}`}>
      <div className="flabel">
        {icon && <span style={{ color: "var(--blue)" }}>{icon}</span>}
        {label}
      </div>

      {editing ? (
        textarea ? (
          <textarea
            className="ftextarea"
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            dir={dir}
          />
        ) : (
          <input
            className="finput"
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            inputMode={inputMode}
            dir={dir}
          />
        )
      ) : (
        <div className="fval">
          {displayValue || value || <span style={{ color: "var(--gray-text)" }}>—</span>}
        </div>
      )}
    </div>
  );
}

function SBItem({ id, icon, label, count, tab, setTab }) {
  return (
    <button className={`sb-item${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
      <div className="sb-item-main">
        {icon}
        {label}
      </div>
      {typeof count === "number" ? <span className="sb-count">{count}</span> : null}
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const apiFetch = (url, options = {}) => {
    const token = getToken();
    const headers = {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("forsaToken");
        localStorage.removeItem("token");
        localStorage.removeItem("forsaCraftsman");
        localStorage.removeItem("forsaAdmin");
        localStorage.removeItem("forsaAdminEmail");
        navigate("/login");
      }
      return res;
    });
  };

  const [tab, setTab] = useState("data");
  const [editing, setEditing] = useState(null); // null | 'personal' | 'work'
  const [form, setForm] = useState(null);
  const [draft, setDraft] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addingPhotos, setAddingPhotos] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [pageError, setPageError] = useState("");

  const [serviceRequests, setServiceRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [requestsFetched, setRequestsFetched] = useState(false);
  const [confirmingId, setConfirmingId] = useState("");

  const photoRef = useRef(null);
  const avatarRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = (msg, icon = "✅") => {
    setToast({ msg, icon });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  };

  const avatarLetter = useMemo(() => {
    const letter = form?.firstName?.trim()?.charAt(0);
    return letter || "ح";
  }, [form]);

  const pendingRequests = useMemo(
    () => serviceRequests.filter((item) => item.status === "pending"),
    [serviceRequests]
  );

  const confirmedRequests = useMemo(
    () => serviceRequests.filter((item) =>
      ["confirmed", "contacted", "completed"].includes(item.status)
    ),
    [serviceRequests]
  );

  const fetchMyProfile = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingProfile(true);
      setPageError("");

      const response = await apiFetch(PROFILE_ENDPOINT, { method: "GET" });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        if (response.status === 401) return;
        setPageError(
          result?.message ||
            result?.status?.message ||
            "تعذر جلب بيانات الملف الشخصي"
        );
        return;
      }

      const craftsman = result?.data || {};
      const normalized = normalizeCraftsman(craftsman);

      setForm(normalized);
      setDraft(normalized);

      localStorage.setItem("forsaCraftsman", JSON.stringify(craftsman));
    } catch (error) {
      setPageError("تعذر الاتصال بالسيرفر");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchMyServiceRequests = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingRequests(true);
      setRequestsError("");

      const response = await apiFetch(MY_REQUESTS_ENDPOINT, { method: "GET" });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        throw new Error(
          result?.message ||
            result?.status?.message ||
            "تعذر جلب طلبات الخدمة"
        );
      }

      const normalized = extractRequests(result).map(normalizeRequest);
      setServiceRequests(normalized);
      setRequestsFetched(true);
    } catch (error) {
      setRequestsError(error.message || "تعذر الاتصال بالسيرفر");
      setServiceRequests([]);
      setRequestsFetched(true);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMyProfile();
    fetchMyServiceRequests();

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleDraftChange = (key, value) => {
    let nextValue = value;

    if (["phone", "yearsOfExperience", "price"].includes(key)) {
      nextValue = normalizeDigits(nextValue).replace(/[^\d]/g, "");
    }

    if (key === "phone") {
      nextValue = nextValue.slice(0, 10);
    }

    setDraft((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  const handleSave = async () => {
    if (!draft) return;

    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      showToast("الاسم الأول والثاني مطلوبان", "⚠️");
      return;
    }

    if (!draft.phone.trim() || !/^059\d{7}$/.test(draft.phone.trim())) {
      showToast("رقم الهاتف يجب أن يبدأ بـ 059 ويتكون من 10 أرقام", "⚠️");
      return;
    }

    if (!draft.city.trim()) {
      showToast("المنطقة مطلوبة", "⚠️");
      return;
    }

    if (!draft.neighborhood.trim()) {
      showToast("عنوان السكن مطلوب", "⚠️");
      return;
    }

    if (draft.yearsOfExperience === "" || Number(draft.yearsOfExperience) < 0) {
      showToast("سنوات الخبرة غير صحيحة", "⚠️");
      return;
    }

    if (draft.price === "" || Number(draft.price) < 1) {
      showToast("سعر الساعة يجب أن يكون رقمًا أكبر من أو يساوي 1", "⚠️");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await apiFetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: draft.firstName.trim(),
          lastName: draft.lastName.trim(),
          phone: draft.phone.trim(),
          city: draft.city.trim(),
          neighborhood: draft.neighborhood.trim(),
          yearsOfExperience: Number(draft.yearsOfExperience),
          price: Number(draft.price),
          bio: draft.bio.trim(),
        }),
      });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        showToast(
          result?.message ||
            result?.status?.message ||
            "فشل حفظ التعديلات",
          "⚠️"
        );
        return;
      }

      const updatedCraftsman = result?.data || {};
      const normalized = normalizeCraftsman(updatedCraftsman);

      setForm(normalized);
      setDraft(normalized);
      setEditing(null);

      localStorage.setItem("forsaCraftsman", JSON.stringify(updatedCraftsman));
      showToast("تم حفظ التغييرات بنجاح");
    } catch (error) {
      showToast("تعذر الاتصال بالسيرفر", "⚠️");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancel = () => {
    setDraft(form);
    setEditing(null);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("يسمح فقط برفع صورة", "⚠️");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("حجم صورة البروفايل يجب أن يكون أقل من 2MB", "⚠️");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUploadingAvatar(true);

      const submitData = new FormData();
      submitData.append("profileImage", file);

      const response = await apiFetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        body: submitData,
      });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        showToast(
          result?.message ||
            result?.status?.message ||
            "فشل تحديث صورة البروفايل",
          "⚠️"
        );
        return;
      }

      const updatedCraftsman = result?.data || {};
      const normalized = normalizeCraftsman(updatedCraftsman);

      setForm(normalized);
      setDraft(normalized);

      localStorage.setItem("forsaCraftsman", JSON.stringify(updatedCraftsman));
      showToast("تم تحديث صورة البروفايل بنجاح");
    } catch (error) {
      showToast("تعذر الاتصال بالسيرفر", "⚠️");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddWorkImages = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    if (files.length === 0) return;

    const invalidType = files.some((file) => !file.type.startsWith("image/"));
    if (invalidType) {
      showToast("يسمح فقط برفع صور", "⚠️");
      return;
    }

    const invalidSize = files.some((file) => file.size > 2 * 1024 * 1024);
    if (invalidSize) {
      showToast("حجم كل صورة يجب أن يكون أقل من 2MB", "⚠️");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingPhotos(true);

      const submitData = new FormData();
      files.forEach((file) => {
        submitData.append("workImages", file);
      });

      const response = await apiFetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        body: submitData,
      });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        showToast(
          result?.message ||
            result?.status?.message ||
            "فشل إضافة صور الأعمال",
          "⚠️"
        );
        return;
      }

      const updatedCraftsman = result?.data || {};
      const normalized = normalizeCraftsman(updatedCraftsman);

      setForm(normalized);
      setDraft(normalized);

      localStorage.setItem("forsaCraftsman", JSON.stringify(updatedCraftsman));
      showToast("تمت إضافة صور الأعمال بنجاح");
    } catch (error) {
      showToast("تعذر الاتصال بالسيرفر", "⚠️");
    } finally {
      setAddingPhotos(false);
    }
  };

  const handleConfirmRequest = async (requestId) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setConfirmingId(requestId);

      const response = await apiFetch(
        `${API_BASE_URL}/api/service-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        throw new Error(
          result?.message ||
            result?.status?.message ||
            "فشل تحديث حالة الطلب"
        );
      }

      setServiceRequests((prev) =>
        prev.map((item) =>
          item.id === requestId ? { ...item, status: "confirmed" } : item
        )
      );

      showToast("تم تأكيد الطلب ونقله إلى الطلبات المؤكدة");
    } catch (error) {
      showToast(error.message || "تعذر تحديث الحالة", "⚠️");
    } finally {
      setConfirmingId("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("forsaToken");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("forsaCraftsman");
    showToast("تم تسجيل الخروج 👋");
    setTimeout(() => navigate("/"), 600);
  };

  const renderRequestTable = (list, mode = "pending") => {
    if (loadingRequests) {
      return <div className="loading-box">جاري تحميل طلبات الخدمة...</div>;
    }

    if (requestsError) {
      return <div className="error-box">{requestsError}</div>;
    }

    if (!list.length) {
      return (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <div className="empty-txt">
            {mode === "confirmed"
              ? "لا توجد طلبات مؤكدة حتى الآن"
              : "لا توجد طلبات قيد الانتظار حاليًا"}
          </div>
        </div>
      );
    }

    return (
      <div className="requests-table">
        <div className="requests-head-row">
          <div className="requests-head-cell">الاسم</div>
          <div className="requests-head-cell">رقم الهاتف</div>
          <div className="requests-head-cell">تاريخ الطلب</div>
          <div className="requests-head-cell">الحالة</div>
          <div className="requests-head-cell">واتساب</div>
          <div className="requests-head-cell">
            {mode === "pending" ? "إجراء" : "متابعة"}
          </div>
        </div>

        {list.map((request) => {
          const whatsAppOptions = buildWhatsAppOptions(request.clientPhone);

          return (
            <div className="request-row-item" key={request.id}>
              <div className="request-cell name">
                <div>{request.clientName}</div>
                {request.jobDetails ? (
                  <div style={{ fontSize: "12px", color: "var(--gray-text)", marginTop: "4px", fontWeight: 500, lineHeight: 1.6 }}>
                    {request.jobDetails}
                  </div>
                ) : null}
              </div>

              <div className="request-cell phone">{request.clientPhone}</div>

              <div className="request-cell date">{formatDate(request.createdAt)}</div>

              <div className="request-cell">
                <span className={`request-status ${request.status}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>

              <div className="request-cell">
                <div className="request-wa-group">
                  {whatsAppOptions.map((option, index) => (
                    <a
                      key={`${option.url}-${index}`}
                      href={option.url}
                      target="_blank"
                      rel="noreferrer"
                      className="request-wa"
                    >
                      <IcWhatsApp />
                      {option.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="request-cell request-action">
                {mode === "pending" ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleConfirmRequest(request.id)}
                    disabled={confirmingId === request.id}
                  >
                    <IcCheck />
                    {confirmingId === request.id ? "جاري التأكيد..." : "تأكيد"}
                  </button>
                ) : (
                  <span style={{ color: "var(--gray-text)", fontWeight: 700 }}>
                    تم التأكيد
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loadingProfile) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div className="main" style={{ marginRight: 0 }}>
            <div className="content">
              <div className="loading-box">جاري تحميل الملف الشخصي...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (pageError) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div className="main" style={{ marginRight: 0 }}>
            <div className="content">
              <div className="error-box">{pageError}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <input
        ref={avatarRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleProfileImageChange}
      />

      <input
        ref={photoRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAddWorkImages}
      />

      <div className="app">
        <div className="sidebar">
          <div className="sb-brand">
            <div className="sb-brand-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div className="sb-brand-name">فُر<span>صة</span></div>
          </div>

          <div className="sb-nav">
            <div className="sb-section-label">الحساب</div>
            <SBItem id="data" icon={<IcPerson />} label="بياناتي الشخصية" tab={tab} setTab={setTab} />
            <SBItem id="photos" icon={<IcGrid />} label="صور أعمالي" tab={tab} setTab={setTab} />
            <div className="sb-divider" />
            <div className="sb-section-label">الطلبات</div>
            <SBItem id="requests" icon={<IcBell />} label="طلبات قيد الانتظار" count={pendingRequests.length} tab={tab} setTab={setTab} />
            <SBItem id="confirmed" icon={<IcCheckCircle />} label="الطلبات المؤكدة" count={confirmedRequests.length} tab={tab} setTab={setTab} />
          </div>

          <div className="sb-footer">
            <div className="sb-footer-row">
              {form?.profileImage ? (
                <img
                  src={form.profileImage}
                  alt=""
                  className="sb-footer-avatar-img"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="sb-footer-avatar-letter">{avatarLetter}</div>
              )}
              <div className="sb-footer-info">
                <div className="sb-footer-name">{form?.firstName} {form?.lastName}</div>
                <div className="sb-footer-role">{form?.profession}</div>
              </div>
              <button className="sb-footer-logout" onClick={handleLogout} title="تسجيل الخروج">
                <IcLogout />
              </button>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="page-top">
            <div className="page-top-title">ملفي الشخصي</div>
          </div>

          <div className="content">
            <div className="profile-card">
              <div className="avatar-wrap">
                {form?.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt="Profile"
                    className="avatar"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                ) : (
                  <div className="avatar">{avatarLetter}</div>
                )}

                <div
                  className="avatar-edit-btn"
                  onClick={() => avatarRef.current?.click()}
                  title={uploadingAvatar ? "جاري الرفع..." : "تغيير الصورة الشخصية"}
                >
                  <IcCam />
                </div>
              </div>

              <div className="profile-info">
                <div className="profile-name">
                  {form?.firstName} {form?.lastName}
                </div>
                <div className="profile-meta">
                  <span className="badge-pro">{form?.profession}</span>
                  <span className="meta-chip"><IcPin /> {form?.city}</span>
                  <span className="meta-chip"><IcPhone /> {form?.phone}</span>
                  <span className="meta-chip"><IcShekel s={13} /> {formatPrice(form?.price)}</span>
                </div>
              </div>
            </div>
            {tab === "data" && (
              <div style={{ width: "96%", maxWidth: "980px", marginLeft: "auto", marginRight: "auto" }}>
                {/* Card 1: Personal info */}
                <div className="card" style={{ marginBottom: "18px" }}>
                  <div className="card-header">
                    <div className="card-title"><IcPerson /> البيانات الشخصية</div>
                    {editing === null && (
                      <button className="edit-toggle" onClick={() => { setDraft(form); setEditing("personal"); }}>
                        <IcEdit /> تعديل
                      </button>
                    )}
                  </div>

                  {editing === "personal" && (
                    <div className="notice"><IcInfo /> الحقول المحاطة بإطار أزرق قابلة للتعديل</div>
                  )}

                  <div className="fields-grid">
                    <EditableField
                      label="الاسم الأول"
                      value={draft?.firstName}
                      placeholder="أدخل الاسم الأول"
                      icon={<IcPerson />}
                      editing={editing === "personal"}
                      onChange={(value) => handleDraftChange("firstName", value)}
                    />

                    <EditableField
                      label="الاسم الثاني"
                      value={draft?.lastName}
                      placeholder="أدخل الاسم الثاني"
                      icon={<IcPerson />}
                      editing={editing === "personal"}
                      onChange={(value) => handleDraftChange("lastName", value)}
                    />

                    <ReadonlyField label="البريد الإلكتروني" value={form?.email} icon={<IcMail />} />

                    <EditableField
                      label="رقم الهاتف"
                      value={draft?.phone}
                      placeholder="059XXXXXXXX"
                      icon={<IcPhone />}
                      editing={editing === "personal"}
                      onChange={(value) => handleDraftChange("phone", value)}
                      inputMode="numeric"
                      dir="ltr"
                    />
                  </div>

                  {editing === "personal" && (
                    <div className="edit-bar">
                      <button className="btn btn-ghost" onClick={handleCancel} disabled={savingProfile}>إلغاء</button>
                      <button className="btn btn-primary" onClick={handleSave} disabled={savingProfile}>
                        <IcCheck /> {savingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Card 2: Professional info */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><IcBag /> بيانات المهنة والموقع</div>
                    {editing === null && (
                      <button className="edit-toggle" onClick={() => { setDraft(form); setEditing("work"); }}>
                        <IcEdit /> تعديل
                      </button>
                    )}
                  </div>

                  {editing === "work" && (
                    <div className="notice"><IcInfo /> الحقول المحاطة بإطار أزرق قابلة للتعديل</div>
                  )}

                  <div className="fields-grid">
                    <ReadonlyField label="المهنة" value={form?.profession} icon={<IcBag />} />

                    <EditableField
                      label="سنوات الخبرة"
                      value={draft?.yearsOfExperience}
                      displayValue={form?.yearsOfExperience ? `${form.yearsOfExperience} سنوات` : "—"}
                      placeholder="أدخل سنوات الخبرة"
                      icon={<IcClock />}
                      editing={editing === "work"}
                      onChange={(value) => handleDraftChange("yearsOfExperience", value)}
                      inputMode="numeric"
                    />

                    <EditableField
                      label="سعر الساعة"
                      value={draft?.price}
                      displayValue={formatPrice(form?.price)}
                      placeholder="مثال: 50"
                      icon={<IcShekel />}
                      editing={editing === "work"}
                      onChange={(value) => handleDraftChange("price", value)}
                      inputMode="numeric"
                    />

                    <EditableField
                      label="المنطقة"
                      value={draft?.city}
                      placeholder="أدخل المنطقة"
                      icon={<IcPin />}
                      editing={editing === "work"}
                      onChange={(value) => handleDraftChange("city", value)}
                    />

                    <div className="fg">
                      <div className="flabel">
                        <span style={{ color: "var(--blue)" }}><IcPin /></span>
                        عنوان السكن بالتفصيل
                      </div>
                      {editing === "work" ? (
                        <input
                          className="finput"
                          value={draft?.neighborhood || ""}
                          placeholder="أدخل عنوانك بالتفصيل"
                          onChange={(e) => handleDraftChange("neighborhood", e.target.value)}
                        />
                      ) : (
                        <div className="fval">{form?.neighborhood || "—"}</div>
                      )}
                    </div>

                    <EditableField
                      label="نبذة مختصرة"
                      value={draft?.bio}
                      displayValue={form?.bio || "لا يوجد نبذة مضافة بعد"}
                      placeholder="اكتب نبذة مختصرة عنك"
                      icon={<IcInfo />}
                      editing={editing === "work"}
                      onChange={(value) => handleDraftChange("bio", value)}
                      textarea
                      dir="rtl"
                    />
                  </div>

                  {editing === "work" && (
                    <div className="edit-bar">
                      <button className="btn btn-ghost" onClick={handleCancel} disabled={savingProfile}>إلغاء</button>
                      <button className="btn btn-primary" onClick={handleSave} disabled={savingProfile}>
                        <IcCheck /> {savingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "requests" && (
              <>
                <div className="sec-title">
                  <IcBell /> طلبات الخدمة قيد الانتظار
                </div>

                <div className="requests-wrap">
                  <div className="requests-toolbar">
                   

                    <button
                      className="requests-refresh"
                      onClick={fetchMyServiceRequests}
                      disabled={loadingRequests}
                      type="button"
                    >
                      {loadingRequests ? "جاري التحديث..." : "تحديث الطلبات"}
                    </button>
                  </div>

                  <div className="requests-shell">
                    {renderRequestTable(pendingRequests, "pending")}
                  </div>
                </div>
              </>
            )}

            {tab === "confirmed" && (
              <>
                <div className="sec-title">
                  <IcCheckCircle /> الطلبات المؤكدة
                </div>

                <div className="requests-wrap">
                  <div className="requests-toolbar">
                    <div className="notice" style={{ marginBottom: 0 }}>
                      <IcInfo />
                      أي طلب يتم تأكيده من تبويب الانتظار سيظهر هنا مباشرة
                    </div>

                    <button
                      className="requests-refresh"
                      onClick={fetchMyServiceRequests}
                      disabled={loadingRequests}
                      type="button"
                    >
                      {loadingRequests ? "جاري التحديث..." : "تحديث الطلبات"}
                    </button>
                  </div>

                  <div className="requests-shell">
                    {renderRequestTable(confirmedRequests, "confirmed")}
                  </div>
                </div>
              </>
            )}

            {tab === "photos" && (
              <>
                <div className="sec-title">
                  <IcGrid /> صور الأعمال السابقة
                </div>

                <div className="notice" style={{ marginBottom: "18px" }}>
                  <IcInfo />
                  يمكنك إضافة صور أعمال جديدة، وسيتم حفظها فوق الصور القديمة
                </div>

                <div className="photos-grid">
                  <div className="photo-add" onClick={() => photoRef.current?.click()}>
                    <div className="add-circle">+</div>
                    {addingPhotos ? "جاري الرفع..." : "إضافة صور جديدة"}
                  </div>

                  {form?.workImages?.length > 0 ? (
                    form.workImages.map((src, i) => (
                      <div className="photo-card" key={i}>
                        <img src={src} alt={`عمل ${i + 1}`} loading="lazy" />
                        <div className="photo-card-label">صورة العمل {i + 1}</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty" style={{ gridColumn: "1 / -1" }}>
                      <div className="empty-icon">🖼️</div>
                      <div className="empty-txt">لا توجد صور أعمال حالياً</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast.icon} {toast.msg}</div>}
    </>
  );
}