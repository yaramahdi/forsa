import { useEffect, useMemo, useState } from "react";

/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const ADMIN_CRAFTSMEN_ENDPOINT = `${API_BASE_URL}/api/admin/craftsmen`;
const DEFAULT_PROFILE_IMAGE = "/images/default-user.png";

const BASE_PROFESSIONS = ["مهندس", "سباك", "دهان", "نجار", "كهربائي"];
const PROFESSION_LABELS = {
  engineer: "مهندس",
  plumber: "سباك",
  painter: "دهان",
  carpenter: "نجار",
  electrician: "كهربائي",
  technician: "فني",
  driver: "سائق",
  mechanic: "ميكانيكي",
};

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --blue-dark:#1B3A5C;--blue:#2563A8;--blue-mid:#3A7BD5;
  --blue-light:#EBF3FF;--blue-border:#C5D9F2;--white:#fff;
  --gray-bg:#F4F7FC;--gray-text:#6B7A99;--gray-border:#DDE4EF;
  --text:#1A2740;--green:#16A34A;--green-bg:#DCFCE7;--green-border:#86EFAC;
  --yellow:#D97706;--yellow-bg:#FEF3C7;--yellow-border:#FCD34D;
  --red:#DC2626;--red-bg:#FEE2E2;--red-border:#FECACA;
  --purple-bg:#F3E8FF;
  --shadow:0 2px 16px rgba(37,99,168,.09);
  --shadow-lg:0 8px 32px rgba(37,99,168,.14);
}
html,body,#root{
  height:100%;
  font-family:'Cairo',sans-serif;
  background:var(--gray-bg);
  color:var(--text);
  direction:rtl;
}
body{
  overflow-x:hidden;
}
.app{
  display:flex;
  min-height:100vh;
  width:100%;
}

/* ── Sidebar ── */
.sidebar{
  width:215px;
  background:var(--blue-dark);
  display:flex;
  flex-direction:column;
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  z-index:100;
  box-shadow:var(--shadow-lg);
}
.sb-brand{
  padding:20px 16px 16px;
  border-bottom:1px solid rgba(255,255,255,.1);
  display:flex;
  align-items:center;
  gap:10px;
}
.sb-ico{
  width:36px;
  height:36px;
  background:var(--blue-mid);
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:17px;
  transform:rotate(-3deg);
  flex-shrink:0;
}
.sb-name{
  font-family:'Tajawal',sans-serif;
  font-size:19px;
  font-weight:800;
  color:#fff;
}
.sb-name span{color:#7DC8FF}
.sb-role{
  font-size:11px;
  color:rgba(255,255,255,.4);
  padding:6px 16px;
  font-weight:600;
  letter-spacing:.5px;
  text-transform:uppercase;
  margin-top:4px;
}
.sb-nav{
  flex:1;
  padding:10px 9px;
  display:flex;
  flex-direction:column;
  gap:8px;
}
.sb-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:12px;
  border-radius:10px;
  cursor:pointer;
  transition:all .2s;
  color:rgba(255,255,255,.6);
  font-size:13.5px;
  font-weight:500;
  border:none;
  background:none;
  width:100%;
  text-align:right;
  font-family:'Cairo',sans-serif;
}
.sb-item:hover{
  background:rgba(255,255,255,.08);
  color:#fff;
}
.sb-item.active{
  background:var(--blue-mid);
  color:#fff;
  box-shadow:0 4px 14px rgba(58,123,213,.4);
}
.sb-logout{
  margin:10px;
  padding:11px 12px;
  border-radius:10px;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:9px;
  color:rgba(255,110,110,.9);
  font-size:13.5px;
  font-weight:600;
  border:1px solid rgba(255,100,100,.22);
  background:rgba(255,100,100,.07);
  transition:all .2s;
  font-family:'Cairo',sans-serif;
}
.sb-logout:hover{
  background:rgba(255,100,100,.15);
  color:#ffb4b4;
}

/* ── Main ── */
.main{
  margin-right:215px;
  width:calc(100% - 215px);
  max-width:calc(100% - 215px);
  min-width:0;
  flex:1;
  display:flex;
  flex-direction:column;
  min-height:100vh;
  overflow:hidden;
}
.topbar{
  background:var(--white);
  border-bottom:1px solid var(--gray-border);
  padding:14px 24px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  box-shadow:0 1px 6px rgba(37,99,168,.06);
  flex-wrap:wrap;
}
.topbar-title{
  font-family:'Tajawal',sans-serif;
  font-size:19px;
  font-weight:800;
  color:var(--blue-dark);
  display:flex;
  align-items:center;
  gap:9px;
}
.topbar-right{
  display:flex;
  align-items:center;
  gap:12px;
}
.admin-chip{
  background:var(--blue-light);
  color:var(--blue);
  border:1px solid var(--blue-border);
  border-radius:20px;
  padding:4px 14px;
  font-size:12px;
  font-weight:700;
}

/* ── Stats ── */
.stats-row{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:14px;
  padding:22px 24px 0;
  min-width:0;
}
.stat-card{
  background:var(--white);
  border:1px solid var(--gray-border);
  border-radius:13px;
  padding:16px 18px;
  display:flex;
  align-items:center;
  gap:14px;
  box-shadow:var(--shadow);
  min-width:0;
}
.stat-icon{
  width:42px;
  height:42px;
  border-radius:11px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:19px;
  flex-shrink:0;
}
.stat-icon.blue{background:var(--blue-light)}
.stat-icon.green{background:var(--green-bg)}
.stat-icon.yellow{background:var(--yellow-bg)}
.stat-icon.purple{background:var(--purple-bg)}
.stat-num{
  font-family:'Tajawal',sans-serif;
  font-size:22px;
  font-weight:800;
  color:var(--text);
  line-height:1;
}
.stat-lbl{
  font-size:12px;
  color:var(--gray-text);
  margin-top:3px;
  font-weight:500;
}

/* ── Content ── */
.content{
  padding:20px 24px 30px;
  flex:1;
  min-width:0;
  overflow:hidden;
}

/* ── Filter bar ── */
.filter-bar{
  background:var(--white);
  border:1px solid var(--gray-border);
  border-radius:13px;
  padding:16px 18px;
  margin-bottom:16px;
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
  box-shadow:var(--shadow);
  min-width:0;
}
.filter-label{
  font-size:13px;
  font-weight:700;
  color:var(--blue-dark);
  white-space:nowrap;
  display:flex;
  align-items:center;
  gap:6px;
}
.filter-chips{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  flex:1 1 300px;
  min-width:0;
}
.chip{
  padding:7px 16px;
  border-radius:20px;
  font-size:13px;
  font-weight:600;
  font-family:'Cairo',sans-serif;
  cursor:pointer;
  border:1.5px solid var(--gray-border);
  background:var(--white);
  color:var(--gray-text);
  transition:all .2s;
}
.chip:hover{
  border-color:var(--blue);
  color:var(--blue);
  background:var(--blue-light);
}
.chip.active{
  background:var(--blue);
  color:#fff;
  border-color:var(--blue);
  box-shadow:0 3px 10px rgba(37,99,168,.28);
}
.search-wrap{
  position:relative;
  flex:0 1 280px;
  min-width:220px;
  max-width:100%;
}
.search-inp{
  background:var(--gray-bg);
  border:1.5px solid var(--gray-border);
  border-radius:10px;
  padding:8px 36px 8px 14px;
  font-size:13px;
  font-family:'Cairo',sans-serif;
  color:var(--text);
  outline:none;
  width:100%;
  direction:rtl;
  transition:border-color .2s;
}
.search-inp:focus{
  border-color:var(--blue);
  background:var(--blue-light);
}
.search-ico{
  position:absolute;
  right:11px;
  top:50%;
  transform:translateY(-50%);
  color:var(--gray-text);
  pointer-events:none;
}

/* ── Table ── */
.table-wrap{
  background:var(--white);
  border:1px solid var(--gray-border);
  border-radius:14px;
  box-shadow:var(--shadow);
  min-width:0;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.table-head-bar{
  padding:14px 20px;
  border-bottom:1px solid var(--gray-border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
}
.table-title{
  font-family:'Tajawal',sans-serif;
  font-size:16px;
  font-weight:800;
  color:var(--blue-dark);
  display:flex;
  align-items:center;
  gap:8px;
}
.count-badge{
  background:var(--blue-light);
  color:var(--blue);
  border-radius:20px;
  padding:2px 10px;
  font-size:12px;
  font-weight:700;
}
.refresh-btn{
  border:none;
  background:var(--blue-light);
  color:var(--blue);
  padding:8px 14px;
  border-radius:10px;
  font-family:'Cairo',sans-serif;
  font-size:12.5px;
  font-weight:700;
  cursor:pointer;
  border:1px solid var(--blue-border);
}
.refresh-btn:hover{
  background:#dbeafe;
}

.tbl-outer{
  overflow:auto;
  max-height:62vh;
  min-width:0;
}

table{
  width:100%;
  border-collapse:collapse;
  min-width:1020px;
  table-layout:auto;
}

thead th{
  position:sticky;
  top:0;
  z-index:2;
  background:var(--gray-bg);
  padding:10px 12px;
  font-size:12px;
  font-weight:700;
  color:var(--blue-dark);
  text-align:right;
  white-space:nowrap;
  border-bottom:2px solid var(--gray-border);
}

tbody tr{
  border-bottom:1px solid var(--gray-border);
  transition:background .15s;
}
tbody tr:last-child{
  border-bottom:none;
}
tbody tr:hover{
  background:#F8FBFF;
}
tbody td{
  padding:10px 12px;
  font-size:12.5px;
  color:var(--text);
  vertical-align:middle;
  background:transparent;
}

/* ── Sticky featured column ── */
.sticky-featured{
  position:sticky;
  left:0;
  z-index:3;
  background:var(--white);
  min-width:132px;
  box-shadow:-8px 0 12px rgba(27,58,92,.04);
}
thead .sticky-featured{
  z-index:5;
  background:var(--gray-bg);
}
tbody tr:hover .sticky-featured{
  background:#F8FBFF;
}

/* ── Cell types ── */
.user-cell{
  display:flex;
  align-items:center;
  gap:10px;
  min-width:190px;
}
.user-avatar{
  width:46px;
  height:46px;
  border-radius:50%;
  object-fit:cover;
  border:2px solid var(--blue-border);
  background:#fff;
  flex-shrink:0;
}
.cell-name{
  font-weight:700;
  color:var(--blue-dark);
  white-space:nowrap;
}
.cell-sub{
  font-size:11.5px;
  color:var(--gray-text);
  margin-top:2px;
}
.cell-badge{
  display:inline-flex;
  align-items:center;
  gap:5px;
  background:var(--blue-light);
  color:var(--blue);
  border:1px solid var(--blue-border);
  border-radius:20px;
  padding:3px 10px;
  font-size:11.5px;
  font-weight:700;
  white-space:nowrap;
}
.cell-muted{
  color:var(--gray-text);
  font-size:12px;
}
.cell-phone{
  direction:ltr;
  display:inline-block;
  font-size:12px;
}
.location-cell{
  min-width:130px;
}
.location-main{
  font-weight:700;
  color:var(--text);
  font-size:12.5px;
}
.location-sub{
  font-size:11px;
  color:var(--gray-text);
  margin-top:2px;
}
.email-cell{
  max-width:160px;
  display:inline-block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  direction:ltr;
}

/* ── Work photos mini ── */
.photos-mini{
  display:flex;
  gap:4px;
  align-items:center;
}
.photo-mini{
  width:32px;
  height:32px;
  border-radius:7px;
  object-fit:cover;
  border:1.5px solid var(--blue-border);
  flex-shrink:0;
  background:#f4f7fc;
}
.photo-more{
  width:32px;
  height:32px;
  border-radius:7px;
  background:var(--blue-light);
  border:1.5px solid var(--blue-border);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:10px;
  font-weight:700;
  color:var(--blue);
  flex-shrink:0;
}

/* ── Featured toggle ── */
.feat-cell{
  text-align:center;
}
.feat-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:7px 12px;
  min-width:112px;
  border-radius:9px;
  font-size:12px;
  font-weight:700;
  font-family:'Cairo',sans-serif;
  cursor:pointer;
  border:1.5px solid;
  transition:all .2s;
  white-space:nowrap;
}
.feat-btn:disabled{
  opacity:.65;
  cursor:not-allowed;
}
.feat-btn.yes{
  background:var(--green-bg);
  color:var(--green);
  border-color:var(--green-border);
}
.feat-btn.yes:hover{
  background:#BBF7D0;
}
.feat-btn.no{
  background:var(--gray-bg);
  color:var(--gray-text);
  border-color:var(--gray-border);
}
.feat-btn.no:hover{
  background:var(--yellow-bg);
  color:var(--yellow);
  border-color:var(--yellow-border);
}

/* ── States ── */
.state-wrap{
  padding:44px 24px;
  text-align:center;
  color:var(--gray-text);
}
.state-ico{
  font-size:40px;
  opacity:.5;
  margin-bottom:10px;
}
.state-title{
  font-size:15px;
  font-weight:700;
  color:var(--blue-dark);
  margin-bottom:6px;
}
.state-desc{
  font-size:13px;
}
.error-box{
  margin-bottom:16px;
  background:var(--red-bg);
  border:1px solid var(--red-border);
  color:var(--red);
  padding:12px 14px;
  border-radius:12px;
  font-size:13px;
  font-weight:600;
}

/* ── Toast ── */
.toast{
  position:fixed;
  bottom:24px;
  left:50%;
  transform:translateX(-50%);
  background:var(--blue-dark);
  color:#fff;
  padding:12px 24px;
  border-radius:11px;
  font-size:13.5px;
  font-weight:600;
  box-shadow:var(--shadow-lg);
  z-index:9999;
  display:flex;
  align-items:center;
  gap:8px;
  animation:toastIn .3s ease;
  pointer-events:none;
}
@keyframes toastIn{
  from{opacity:0;transform:translateX(-50%) translateY(10px)}
  to{opacity:1;transform:translateX(-50%) translateY(0)}
}

@media(max-width:1100px){
  .stats-row{
    grid-template-columns:1fr 1fr;
  }
}

@media(max-width:900px){
  .sidebar{
    width:190px;
  }
  .main{
    margin-right:190px;
    width:calc(100% - 190px);
    max-width:calc(100% - 190px);
  }
  .content,.stats-row,.topbar{
    padding-left:16px;
    padding-right:16px;
  }
  .filter-bar{
    align-items:stretch;
  }
  .filter-chips{
    flex-basis:100%;
  }
  .search-wrap{
    width:100%;
    min-width:0;
    flex:1 1 100%;
  }
  table{
    min-width:900px;
  }
}

@media(max-width:640px){
  .stats-row{
    grid-template-columns:1fr;
  }
}
`;

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function Ic({ d, s = 16, stroke = 2 }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}


const IcUsers = () => <Ic s={17} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcFilter = () => <Ic s={15} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />;
const IcSearch = () => <Ic s={15} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const IcLogout = () => <Ic s={15} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const IcGrid = () => <Ic s={17} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />;
const IcCheck = () => <Ic s={13} d="M20 6L9 17l-5-5" />;
const IcX = () => <Ic s={13} d="M18 6L6 18M6 6l12 12" />;

function getAuthToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

function getHeaders(includeJson = false) {
  const token = getAuthToken();
  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function extractCraftsmen(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.craftsmen)) return payload.data.craftsmen;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.craftsmen)) return payload.craftsmen;
  return [];
}

function normalizeArrayImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [];
}
function normalizeProfessionName(value) {
  if (!value) return "غير محدد";

  const trimmed = String(value).trim();
  return PROFESSION_LABELS[trimmed] || trimmed;
}
function resolveImageUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`;
  return src;
}

function getDisplayProfileImage(craftsman) {
  return resolveImageUrl(craftsman?.profileImage) || DEFAULT_PROFILE_IMAGE;
}

function getDisplayWorkImage(src) {
  return resolveImageUrl(src);
}

function normalizeCraftsman(item) {
  const fullName =
    `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
    item?.name ||
    "بدون اسم";

  return {
    id: item?._id || item?.id,
    firstName: item?.firstName || "",
    lastName: item?.lastName || "",
    fullName,
    phone: item?.phone || "-",
    email: item?.email || "-",
    profession: normalizeProfessionName(item?.profession),
    years: Number(item?.yearsOfExperience ?? item?.years ?? 0),
    city: item?.city || item?.region || "-",
    neighborhood: item?.neighborhood || item?.address || "",
    photos: normalizeArrayImages(item?.workImages || item?.photos || item?.images),
    profileImage: item?.profileImage || item?.avatar || item?.image || "",
    featured: Boolean(item?.isFeatured ?? item?.featured ?? false),
  };
}

function uniqueProfessions(list) {
  const fetched = list.map((item) => item.profession).filter(Boolean);
  return ["الكل", ...new Set([...BASE_PROFESSIONS, ...fetched])];
}

async function readJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AdminPage() {
  const [craftsmen, setCraftsmen] = useState([]);
  const [profession, setProfession] = useState("الكل");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const showToast = (msg, icon = "✅") => {
    setToast({ msg, icon });
    window.clearTimeout(window.__forsaToastTimer);
    window.__forsaToastTimer = window.setTimeout(() => setToast(null), 2600);
  };

  const fetchCraftsmen = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(ADMIN_CRAFTSMEN_ENDPOINT, {
        method: "GET",
        headers: getHeaders(),
      });

      const payload = await readJsonSafe(response);

      if (!response.ok) {
        throw new Error(payload?.status?.message || payload?.message || "فشل جلب بيانات الحرفيين");
      }

      const normalized = extractCraftsmen(payload).map(normalizeCraftsman);
      setCraftsmen(normalized);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      setCraftsmen([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCraftsmen();
  }, []);

  const professions = useMemo(() => uniqueProfessions(craftsmen), [craftsmen]);

  const filtered = useMemo(() => {
    let list = [...craftsmen];

    if (profession !== "الكل") {
      list = list.filter((item) => item.profession === profession);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((item) =>
        [
          item.fullName,
          item.phone,
          item.email,
          item.city,
          item.neighborhood,
          item.profession,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q))
      );
    }

    return list;
  }, [craftsmen, profession, search]);

  const featuredCount = useMemo(() => craftsmen.filter((item) => item.featured).length, [craftsmen]);
  const citiesCount = useMemo(() => new Set(craftsmen.map((item) => item.city).filter(Boolean)).size, [craftsmen]);

  const toggleFeatured = async (craftsman) => {
    const nextFeatured = !craftsman.featured;

    try {
      setUpdatingId(craftsman.id);

      const response = await fetch(`${ADMIN_CRAFTSMEN_ENDPOINT}/${craftsman.id}/featured`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({
          featured: nextFeatured,
          isFeatured: nextFeatured,
        }),
      });

      const payload = await readJsonSafe(response);

      if (!response.ok) {
        throw new Error(payload?.status?.message || payload?.message || "فشل تحديث حالة الترشيح");
      }

      const serverFeatured = Boolean(
        payload?.data?.isFeatured ??
        payload?.data?.featured ??
        payload?.isFeatured ??
        payload?.featured ??
        nextFeatured
      );

      setCraftsmen((prev) =>
        prev.map((item) =>
          item.id === craftsman.id ? { ...item, featured: serverFeatured } : item
        )
      );

      showToast(
        serverFeatured ? "تم ترشيح الحرفي ضمن المميزين" : "تم إلغاء ترشيح الحرفي",
        serverFeatured ? "⭐" : "↩️"
      );
    } catch (err) {
      showToast(err.message || "تعذر تحديث الحالة", "❌");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <>
      <style>{css}</style>

      <div className="app">
        <aside className="sidebar">
          <div className="sb-brand">
            <div className="sb-ico">🔨</div>
            <div className="sb-name">فُر<span>صة</span></div>
          </div>

          <div className="sb-role">لوحة الإدارة</div>

          <div className="sb-nav">
            <button type="button" className="sb-item active">
              <IcUsers /> إدارة الحرفيين
            </button>
          </div>

          <button type="button" className="sb-logout" onClick={handleLogout}>
            <IcLogout /> تسجيل الخروج
          </button>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="topbar-title">
              <IcGrid /> إدارة الحرفيين
            </div>
            <div className="topbar-right">
              <span className="admin-chip">🛡️ مدير النظام</span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon blue">👷</div>
              <div>
                <div className="stat-num">{craftsmen.length}</div>
                <div className="stat-lbl">إجمالي الحرفيين</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">⭐</div>
              <div>
                <div className="stat-num">{featuredCount}</div>
                <div className="stat-lbl">حرفيون مميزون</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">🏘️</div>
              <div>
                <div className="stat-num">{citiesCount}</div>
                <div className="stat-lbl">مدن مختلفة</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">🔧</div>
              <div>
                <div className="stat-num">{professions.length - 1}</div>
                <div className="stat-lbl">مهن مختلفة</div>
              </div>
            </div>
          </div>

          <div className="content">
            {error ? <div className="error-box">❌ {error}</div> : null}

            <div className="filter-bar">
              <div className="filter-label">
                <IcFilter /> تصفية حسب المهنة:
              </div>

              <div className="filter-chips">
                {professions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`chip${profession === item ? " active" : ""}`}
                    onClick={() => setProfession(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="search-wrap">
                <input
                  className="search-inp"
                  placeholder="بحث بالاسم، الهاتف، المدينة أو المهنة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="search-ico">
                  <IcSearch />
                </span>
              </div>
            </div>

            <div className="table-wrap">
              <div className="table-head-bar">
                <div className="table-title">
                  <IcUsers /> قائمة الحرفيين
                  <span className="count-badge">{filtered.length}</span>
                </div>

                <button type="button" className="refresh-btn" onClick={fetchCraftsmen}>
                  تحديث البيانات
                </button>
              </div>

              {loading ? (
                <div className="state-wrap">
                  <div className="state-ico">⏳</div>
                  <div className="state-title">جاري تحميل الحرفيين</div>
                  <div className="state-desc">انتظر قليلاً حتى نجلب البيانات من قاعدة البيانات</div>
                </div>
              ) : (
                <div className="tbl-outer">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الحرفي</th>
                        <th>المهنة</th>
                        <th>سنوات الخبرة</th>
                        <th>المدينة / الحي</th>
                        <th>رقم الهاتف</th>
                        <th>البريد الإلكتروني</th>
                        <th>صور الأعمال</th>
                        <th className="sticky-featured" style={{ textAlign: "center" }}>مميز؟</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={9}>
                            <div className="state-wrap">
                              <div className="state-ico">🔍</div>
                              <div className="state-title">لا توجد نتائج مطابقة</div>
                              <div className="state-desc">جرّب تغيير التصفية أو كلمة البحث</div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((craftsman, index) => (
                          <tr key={craftsman.id || index}>
                            <td className="cell-muted">{index + 1}</td>

                            <td>
                              <div className="user-cell">
                                <img
                                  src={getDisplayProfileImage(craftsman)}
                                  alt={craftsman.fullName}
                                  className="user-avatar"
                                />
                                <div>
                                  <div className="cell-name">{craftsman.fullName}</div>
                                  <div className="cell-sub">ID: {craftsman.id || "-"}</div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="cell-badge">🔧 {craftsman.profession}</span>
                            </td>

                            <td>
                              <span style={{ fontWeight: 700, color: "var(--blue-dark)" }}>{craftsman.years}</span>
                              <span className="cell-muted"> سنة</span>
                            </td>

                            <td className="location-cell">
                              <div className="location-main">{craftsman.city || "-"}</div>
                              <div className="location-sub">{craftsman.neighborhood || "لا يوجد حي مسجل"}</div>
                            </td>

                            <td>
                              <span className="cell-phone cell-muted">{craftsman.phone}</span>
                            </td>

                            <td>
                              <span className="cell-muted email-cell">{craftsman.email}</span>
                            </td>

                            <td>
                              {craftsman.photos.length === 0 ? (
                                <span className="cell-muted" style={{ fontSize: "12px" }}>لا توجد صور</span>
                              ) : (
                                <div className="photos-mini">
                                  {craftsman.photos.slice(0, 3).map((src, idx) => (
                                    <img
                                      key={idx}
                                      src={getDisplayWorkImage(src)}
                                      alt="work"
                                      className="photo-mini"
                                    />
                                  ))}
                                  {craftsman.photos.length > 3 ? (
                                    <div className="photo-more">+{craftsman.photos.length - 3}</div>
                                  ) : null}
                                </div>
                              )}
                            </td>

                            <td className="feat-cell sticky-featured">
                              <button
                                type="button"
                                className={`feat-btn ${craftsman.featured ? "yes" : "no"}`}
                                onClick={() => toggleFeatured(craftsman)}
                                disabled={updatingId === craftsman.id}
                              >
                                {updatingId === craftsman.id ? (
                                  <>⏳ جاري...</>
                                ) : craftsman.featured ? (
                                  <>
                                    <IcCheck /> مُرشَّح
                                  </>
                                ) : (
                                  <>
                                    <IcX /> غير مرشّح
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {toast ? <div className="toast">{toast.icon} {toast.msg}</div> : null}
    </>
  );
}