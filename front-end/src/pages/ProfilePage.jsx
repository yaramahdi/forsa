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
  --gray-bg:#F4F7FC;
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
.sidebar{width:230px;background:var(--blue-dark);display:flex;flex-direction:column;position:fixed;top:0;right:0;bottom:0;z-index:100;box-shadow:var(--shadow-lg)}
.sb-brand{padding:22px 18px 18px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:10px}
.sb-brand-icon{width:38px;height:38px;background:var(--blue-mid);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;transform:rotate(-3deg);flex-shrink:0}
.sb-brand-name{font-family:'Tajawal',sans-serif;font-size:20px;font-weight:800;color:#fff}
.sb-brand-name span{color:#7DC8FF}
.sb-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
.sb-item{display:flex;align-items:center;justify-content:space-between;gap:11px;padding:11px 13px;border-radius:11px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,0.62);font-size:14px;font-weight:500;border:none;background:none;width:100%;text-align:right;font-family:'Cairo',sans-serif}
.sb-item:hover{background:rgba(255,255,255,0.08);color:#fff}
.sb-item.active{background:var(--blue-mid);color:#fff;box-shadow:0 4px 14px rgba(58,123,213,0.4)}
.sb-item-main{display:flex;align-items:center;gap:11px}
.sb-count{min-width:24px;height:24px;border-radius:999px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;padding:0 7px}
.sb-logout{margin:10px;padding:11px 13px;border-radius:11px;cursor:pointer;display:flex;align-items:center;gap:10px;color:rgba(255,110,110,0.85);font-size:14px;font-weight:600;border:1px solid rgba(255,100,100,0.22);background:rgba(255,100,100,0.07);transition:all .2s;font-family:'Cairo',sans-serif}
.sb-logout:hover{background:rgba(255,100,100,0.15);color:#ff8888}

/* Main */
.main{margin-right:230px;flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0}

/* Cover */
.cover{height:170px;background:linear-gradient(135deg,var(--blue-dark) 0%,var(--blue) 55%,var(--blue-mid) 100%);position:relative;overflow:hidden}
.cover-lines{position:absolute;inset:0;opacity:.06;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:22px 22px}
.cover-circle{position:absolute;bottom:-70px;right:-50px;width:260px;height:260px;background:radial-gradient(circle,rgba(125,200,255,0.22) 0%,transparent 70%)}
.cover-circle2{position:absolute;top:-40px;left:80px;width:160px;height:160px;background:radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)}

/* Profile bar */
.profile-bar{background:var(--white);padding:0 36px 22px;border-bottom:1px solid var(--gray-border);position:relative}
.avatar-wrap{position:relative;display:inline-block;margin-top:-52px}
.avatar{width:102px;height:102px;border-radius:50%;border:4px solid var(--white);object-fit:cover;background:var(--blue-light);display:flex;align-items:center;justify-content:center;font-size:38px;color:var(--blue);box-shadow:0 4px 20px rgba(37,99,168,0.2);font-weight:800}
.avatar-edit-btn{position:absolute;bottom:4px;left:0;width:30px;height:30px;background:var(--blue);border-radius:50%;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(37,99,168,0.35);transition:background .2s}
.avatar-edit-btn:hover{background:var(--blue-mid)}
.profile-info{margin-top:12px}
.profile-name{font-family:'Tajawal',sans-serif;font-size:22px;font-weight:800;color:var(--text)}
.profile-meta{display:flex;align-items:center;gap:14px;margin-top:7px;flex-wrap:wrap}
.meta-chip{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--gray-text);font-weight:500}
.badge-pro{background:var(--blue-light);color:var(--blue);border:1px solid var(--blue-border);border-radius:20px;padding:3px 13px;font-size:12px;font-weight:700}

/* Content */
.content{flex:1;padding:28px 36px;animation:fadeIn .35s ease;min-width:0}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.sec-title{font-family:'Tajawal',sans-serif;font-size:19px;font-weight:800;color:var(--blue-dark);margin-bottom:18px;display:flex;align-items:center;gap:10px}
.sec-title::after{content:'';flex:1;height:2px;background:linear-gradient(to left,transparent,var(--blue-border))}
.card{background:var(--white);border-radius:16px;box-shadow:var(--shadow);padding:26px;border:1px solid var(--gray-border)}

.fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:17px}
.fg{display:flex;flex-direction:column;gap:6px}
.fg.full{grid-column:1/-1}
.flabel{font-size:13px;font-weight:700;color:var(--blue-dark);display:flex;align-items:center;gap:6px}
.fval{background:var(--gray-bg);border:1.5px solid var(--gray-border);border-radius:10px;padding:11px 14px;font-size:14px;color:var(--text)}
.fval.muted{color:var(--gray-text)}
.finput{background:var(--blue-light);border:1.5px solid var(--blue-border);border-radius:10px;padding:11px 14px;font-size:14px;color:var(--text);font-family:'Cairo',sans-serif;outline:none;width:100%;direction:rtl;transition:border-color .2s,box-shadow .2s}
.finput:focus,.ftextarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,168,0.12)}
.ftextarea{background:var(--blue-light);border:1.5px solid var(--blue-border);border-radius:10px;padding:11px 14px;font-size:14px;color:var(--text);font-family:'Cairo',sans-serif;outline:none;width:100%;direction:rtl;transition:border-color .2s,box-shadow .2s;resize:vertical;min-height:110px}
.edit-bar{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}
.notice{background:var(--blue-light);border:1px solid var(--blue-border);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--blue);display:flex;align-items:center;gap:8px;margin-bottom:16px}
.edit-toggle{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:10px;font-size:13px;font-weight:700;font-family:'Cairo',sans-serif;cursor:pointer;background:var(--blue-light);color:var(--blue);border:1.5px solid var(--blue-border);transition:all .2s;margin-bottom:18px}
.edit-toggle:hover{background:var(--blue);color:#fff}

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
  .requests-shell{
    max-height:58vh;
  }
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

/* Helpers */
const getToken = () =>
  localStorage.getItem("forsaToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

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
    yearsOfExperience: craftsman?.yearsOfExperience ?? "",
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
    status: item?.status || "pending",
    createdAt: item?.createdAt || "",
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("data");
  const [editing, setEditing] = useState(false);
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
    () =>
      serviceRequests.filter((item) =>
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

      const response = await fetch(PROFILE_ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
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

      const response = await fetch(MY_REQUESTS_ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if ((tab === "requests" || tab === "confirmed") && !requestsFetched) {
      fetchMyServiceRequests();
    }
  }, [tab, requestsFetched]);

  const handleSave = async () => {
    if (!draft) return;

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await fetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: draft.firstName.trim(),
          lastName: draft.lastName.trim(),
          phone: draft.phone.trim(),
          city: draft.city.trim(),
          neighborhood: draft.neighborhood.trim(),
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
      setEditing(false);

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
    setEditing(false);
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

      const response = await fetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

      const response = await fetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

      const response = await fetch(
        `${API_BASE_URL}/api/service-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "confirmed",
          }),
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

  const ReadonlyField = ({ label, value, icon }) => (
    <div className="fg">
      <div className="flabel">
        {icon && <span style={{ color: "var(--blue)" }}>{icon}</span>}
        {label}
      </div>
      <div className="fval muted">{value || "—"}</div>
    </div>
  );

  const EditableField = ({ label, key_, placeholder, icon }) => (
    <div className="fg">
      <div className="flabel">
        {icon && <span style={{ color: "var(--blue)" }}>{icon}</span>}
        {label}
      </div>
      {editing ? (
        <input
          className="finput"
          value={draft?.[key_] || ""}
          placeholder={placeholder}
          onChange={(e) => setDraft((d) => ({ ...d, [key_]: e.target.value }))}
        />
      ) : (
        <div className="fval">
          {form?.[key_] || <span style={{ color: "var(--gray-text)" }}>—</span>}
        </div>
      )}
    </div>
  );

  const SBItem = ({ id, icon, label, count }) => (
    <button className={`sb-item${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
      <div className="sb-item-main">
        {icon}
        {label}
      </div>
      {typeof count === "number" ? <span className="sb-count">{count}</span> : null}
    </button>
  );

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
            <div className="request-cell name">{request.clientName}</div>

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
            <div className="sb-brand-icon">🔨</div>
            <div className="sb-brand-name">فُر<span>صة</span></div>
          </div>

          <div className="sb-nav">
            <SBItem id="data" icon={<IcPerson />} label="بياناتي الشخصية" />
            <SBItem id="requests" icon={<IcBell />} label="طلبات قيد الانتظار" count={pendingRequests.length} />
            <SBItem id="confirmed" icon={<IcCheckCircle />} label="الطلبات المؤكدة" count={confirmedRequests.length} />
            <SBItem id="photos" icon={<IcGrid />} label="صور أعمالي" />
          </div>

          <button className="sb-logout" onClick={handleLogout}>
            <IcLogout /> تسجيل الخروج
          </button>
        </div>

        <div className="main">
          <div className="cover">
            <div className="cover-lines" />
            <div className="cover-circle" />
            <div className="cover-circle2" />
          </div>

          <div className="profile-bar">
            <div className="avatar-wrap">
              {form?.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="avatar"
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
                <span className="meta-chip">
                  <IcPin />
                  {form?.city}
                </span>
                <span className="meta-chip">
                  <IcPhone />
                  {form?.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="content">
            {tab === "data" && (
              <>
                <div className="sec-title">
                  <IcPerson /> البيانات الشخصية
                </div>

                <div className="card">
                  {!editing && (
                    <button
                      className="edit-toggle"
                      onClick={() => {
                        setDraft(form);
                        setEditing(true);
                      }}
                    >
                      <IcEdit /> تعديل البيانات
                    </button>
                  )}

                  {editing && (
                    <div className="notice">
                      <IcInfo /> الحقول المحاطة بإطار أزرق قابلة للتعديل
                    </div>
                  )}

                  <div className="fields-grid">
                    <EditableField label="الاسم الأول" key_="firstName" placeholder="أدخل الاسم الأول" icon={<IcPerson />} />
                    <EditableField label="الاسم الثاني" key_="lastName" placeholder="أدخل الاسم الثاني" icon={<IcPerson />} />
                    <ReadonlyField label="البريد الإلكتروني" value={form?.email} icon={<IcMail />} />
                    <EditableField label="رقم الهاتف" key_="phone" placeholder="059XXXXXXXX" icon={<IcPhone />} />
                    <ReadonlyField label="المهنة" value={form?.profession} icon={<IcBag />} />
                    <ReadonlyField label="سنوات الخبرة" value={`${form?.yearsOfExperience} سنوات`} icon={<IcClock />} />
                    <EditableField label="المنطقة" key_="city" placeholder="أدخل المنطقة" icon={<IcPin />} />

                    <div className="fg full">
                      <div className="flabel">
                        <span style={{ color: "var(--blue)" }}><IcPin /></span>
                        عنوان السكن بالتفصيل
                      </div>

                      {editing ? (
                        <input
                          className="finput"
                          value={draft?.neighborhood || ""}
                          placeholder="أدخل عنوانك بالتفصيل"
                          onChange={(e) => setDraft((d) => ({ ...d, neighborhood: e.target.value }))}
                        />
                      ) : (
                        <div className="fval">{form?.neighborhood || "—"}</div>
                      )}
                    </div>

                    <div className="fg full">
                      <div className="flabel">
                        <span style={{ color: "var(--blue)" }}><IcInfo /></span>
                        نبذة مختصرة
                      </div>

                      {editing ? (
                        <textarea
                          className="ftextarea"
                          value={draft?.bio || ""}
                          placeholder="اكتب نبذة مختصرة عنك"
                          onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                        />
                      ) : (
                        <div className="fval">{form?.bio || "لا يوجد نبذة مضافة بعد"}</div>
                      )}
                    </div>
                  </div>

                  {editing && (
                    <div className="edit-bar">
                      <button className="btn btn-ghost" onClick={handleCancel} disabled={savingProfile}>
                        إلغاء
                      </button>
                      <button className="btn btn-primary" onClick={handleSave} disabled={savingProfile}>
                        <IcCheck /> {savingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "requests" && (
              <>
                <div className="sec-title">
                  <IcBell /> طلبات الخدمة قيد الانتظار
                </div>

                <div className="requests-wrap">
                  <div className="requests-toolbar">
                    <div className="notice" style={{ marginBottom: 0 }}>
                      <IcInfo />
                      تم تصغير عرض القسم وإضافة سكرول داخلي حتى لا يتمدد بشكل مزعج عند كثرة الطلبات
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
                        <img src={src} alt={`عمل ${i + 1}`} />
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