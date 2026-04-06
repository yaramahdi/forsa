//هنا صفحة بتعرض تفاصيل الحرفي حين يتم الضغط على زر اطلب الخدمة
//بظهر كل بيانات الحرفي مع الخريطة ولما يقرر يطلب الخدمة بظهرلو فورم بسيط عشان يعبي بياناتو

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CraftsmanProfile.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const DEFAULT_PROFILE_IMAGE = "/images/default-user.png";
const SERVICE_REQUESTS_ENDPOINT = `${API_BASE_URL}/api/service-requests`;

const Ic = ({ d, s = 16, sw = 2 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const IcPin = () => (
  <Ic s={17} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
);
const IcMail = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IcPhone = () => (
  <Ic
    s={17}
    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z"
  />
);
const IcStar = () => (
  <Ic s={17} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
);
const IcArrow = () => <Ic s={16} d="M5 12h14M12 5l7 7-7 7" />;
const IcClose = () => <Ic s={15} sw={2.5} d="M18 6L6 18M6 6l12 12" />;
const IcCheck = () => <Ic s={16} d="M20 6L9 17l-5-5" />;
const IcUser = () => <Ic s={14} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
const IcAlert = () => <Ic s={12} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v4M12 16h.01" />;
const IcWrench = () => <Ic s={17} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />;
const IcImages = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IcBack = () => <Ic s={16} d="M19 12H5M12 19l-7-7 7-7" />;

function readJsonSafe(response) {
  return response.json().catch(() => null);
}

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`;
  return src;
}

function extractCraftsman(payload) {
  if (payload?.data?._id || payload?.data?.id) return payload.data;
  if (payload?._id || payload?.id) return payload;
  if (payload?.data?.craftsman) return payload.data.craftsman;
  return null;
}

function buildAddress(craftsman) {
  return [craftsman?.city, craftsman?.neighborhood].filter(Boolean).join(" - ") || "العنوان غير متوفر";
}

function normalizeCraftsman(item) {
  if (!item) return null;

  return {
    id: item._id || item.id,
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    profession: item.profession || "غير محدد",
    city: item.city || "",
    neighborhood: item.neighborhood || "",
    address: buildAddress(item),
    email: item.email || "غير متوفر",
    phone: item.phone || "غير متوفر",
    yearsOfExperience: Number(item.yearsOfExperience ?? 0),
    bio: item.bio || "",
    profileImage: resolveImage(item.profileImage) || DEFAULT_PROFILE_IMAGE,
    workImages: Array.isArray(item.workImages) ? item.workImages.map(resolveImage).filter(Boolean) : [],
  };
}

function getMapQuery(craftsman) {
  return [craftsman?.city, craftsman?.neighborhood, "فلسطين"].filter(Boolean).join(" ");
}

function buildWhatsAppOptions(phone) {
  const cleaned = String(phone || "").trim().replace(/[^\d+]/g, "");

  if (!cleaned) return [];

  const noPlus = cleaned.replace(/^\+/, "");

  if (noPlus.startsWith("972")) {
    return [
      {
        label: "تواصل عبر واتساب",
        url: `https://wa.me/${noPlus}`,
      },
    ];
  }

  if (noPlus.startsWith("970")) {
    return [
      {
        label: "تواصل عبر واتساب",
        url: `https://wa.me/${noPlus}`,
      },
    ];
  }

  if (noPlus.startsWith("0")) {
    const localNumber = noPlus.slice(1);

    return [
      {
        label: "واتساب (+972)",
        url: `https://wa.me/972${localNumber}`,
      },
      {
        label: "واتساب (+970)",
        url: `https://wa.me/970${localNumber}`,
      },
    ];
  }

  return [
    {
      label: "تواصل عبر واتساب",
      url: `https://wa.me/${noPlus}`,
    },
  ];
}

function RequestModal({ craftsman, onClose }) {
  const [form, setForm] = useState({ clientName: "", clientPhone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [whatsAppOptions, setWhatsAppOptions] = useState([]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.clientName.trim()) {
      nextErrors.clientName = "الاسم مطلوب";
    }

    const cleanedPhone = form.clientPhone.replace(/\s+/g, "").trim();
    if (!cleanedPhone) {
      nextErrors.clientPhone = "رقم الهاتف مطلوب";
    } else if (!/^\d{10}$/.test(cleanedPhone)) {
      nextErrors.clientPhone = "رقم الهاتف يجب أن يكون 10 أرقام";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      const response = await fetch(SERVICE_REQUESTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: form.clientName.trim(),
          clientPhone: form.clientPhone.trim(),
          craftsmanId: craftsman.id,
        }),
      });

      const payload = await readJsonSafe(response);

      if (!response.ok) {
        throw new Error(payload?.status?.message || payload?.message || "تعذر إرسال الطلب");
      }

      const craftsmanPhone = payload?.data?.craftsmanPhone || craftsman.phone;
      setWhatsAppOptions(buildWhatsAppOptions(craftsmanPhone));
      setDone(true);
    } catch (error) {
      setSubmitError(error.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cp-modal">
        <button className="cp-modal-close" onClick={onClose} aria-label="إغلاق" type="button">
          <IcClose />
        </button>

        {done ? (
          <div className="cp-success-box">
            <div className="cp-success-icon">✅</div>
            <div className="cp-modal-title cp-center">تم إرسال الطلب بنجاح</div>
            <p className="cp-success-text">
              تم تسجيل طلبك وسيظهر للحرفي داخل لوحة الطلبات الخاصة به.
            </p>

            <div className="cp-success-actions">
              {whatsAppOptions.length > 0 ? (
                <div className="cp-whatsapp-options">
                  {whatsAppOptions.map((option, index) => (
                    <a
                      key={`${option.url}-${index}`}
                      href={option.url}
                      target="_blank"
                      rel="noreferrer"
                      className="cp-whatsapp-btn"
                    >
                      {option.label}
                    </a>
                  ))}
                </div>
              ) : null}

              <button onClick={onClose} className="cp-modal-submit cp-secondary-btn" type="button">
                <IcCheck /> حسناً
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="cp-modal-title">إرسال طلب خدمة</div>
            <div className="cp-modal-sub">
              املأ البيانات التالية ليتم إرسال طلبك إلى {craftsman.firstName} {craftsman.lastName}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="cp-form-group">
                <label className="cp-form-label"><IcUser /> اسمك الكامل</label>
                <input
                  className={`cp-form-input${errors.clientName ? " err" : ""}`}
                  placeholder="مثال: محمد أحمد"
                  value={form.clientName}
                  onChange={(e) => setField("clientName", e.target.value)}
                />
                {errors.clientName ? (
                  <span className="cp-err-msg"><IcAlert /> {errors.clientName}</span>
                ) : null}
              </div>

              <div className="cp-form-group">
                <label className="cp-form-label"><IcPhone /> رقم الهاتف</label>
                <input
                  className={`cp-form-input${errors.clientPhone ? " err" : ""}`}
                  placeholder="0590000000"
                  value={form.clientPhone}
                  onChange={(e) => setField("clientPhone", e.target.value)}
                  type="tel"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
                {errors.clientPhone ? (
                  <span className="cp-err-msg"><IcAlert /> {errors.clientPhone}</span>
                ) : null}
              </div>

              {submitError ? <div className="cp-submit-error">❌ {submitError}</div> : null}

              <button type="submit" className="cp-modal-submit" disabled={loading}>
                {loading ? <><span className="cp-spinner" /> جاري الإرسال...</> : <><IcArrow /> إرسال الطلب</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function CraftsmanProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [craftsman, setCraftsman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCraftsman = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/craftsmen/${id}`);
        const payload = await readJsonSafe(response);

        if (!response.ok) {
          throw new Error(payload?.status?.message || payload?.message || "تعذر جلب بيانات الحرفي");
        }

        const normalized = normalizeCraftsman(extractCraftsman(payload));

        if (!normalized) {
          throw new Error("بيانات الحرفي غير مكتملة");
        }

        setCraftsman(normalized);
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل الصفحة");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCraftsman();
    }
  }, [id]);

  const mapSrc = useMemo(() => {
    if (!craftsman) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(getMapQuery(craftsman))}&z=14&output=embed`;
  }, [craftsman]);

  if (loading) {
    return (
      <div className="cp-state-page">
        <div className="cp-state-card">
          <div className="cp-state-emoji">⏳</div>
          <h2>جاري تحميل بيانات الحرفي...</h2>
        </div>
      </div>
    );
  }

  if (error || !craftsman) {
    return (
      <div className="cp-state-page">
        <div className="cp-state-card cp-error-card">
          <div className="cp-state-emoji">❌</div>
          <h2>تعذر فتح صفحة الحرفي</h2>
          <p>{error || "الحرفي غير موجود"}</p>
          <button type="button" className="cp-back-btn" onClick={() => navigate(-1)}>
            <IcBack /> رجوع
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cp-page">
        <div className="cp-cover">
          <div className="cp-cover-lines" />
          <div className="cp-cover-glow" />
        </div>

        <div className="cp-header-tools">
          <button type="button" className="cp-back-btn" onClick={() => navigate(-1)}>
            <IcBack /> رجوع
          </button>
        </div>

        <div className="cp-header">
          <div className="cp-header-right">
            <div className="cp-avatar-wrap">
              <img
                src={craftsman.profileImage}
                alt={`${craftsman.firstName} ${craftsman.lastName}`}
                className="cp-avatar"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
            </div>

            <div className="cp-name-block">
              <div className="cp-name">
                {craftsman.firstName} {craftsman.lastName}
              </div>

              {craftsman.bio?.trim() ? (
                <p className="cp-header-bio">{craftsman.bio}</p>
              ) : null}

              <div className="cp-meta">
                <span className="cp-badge">{craftsman.profession}</span>
                <span className="cp-meta-chip">
                  <IcPin />
                  {craftsman.address}
                </span>
                <span className="cp-meta-chip">
                  <IcWrench />
                  {craftsman.yearsOfExperience} سنوات خبرة
                </span>
              </div>
            </div>
          </div>

          <div className="cp-header-left">
            <button className="cp-cta-btn" onClick={() => setModalOpen(true)} type="button">
              <IcArrow /> اطلب الخدمة
            </button>
          </div>
        </div>

        <div className="cp-body">
          <div className="cp-card">
            <div className="cp-section-title">
              <IcPhone /> التواصل
            </div>

            <div className="cp-contact-stack">
              <div className="cp-info-row">
                <div className="cp-info-row-text">
                  <div className="cp-info-label">العنوان</div>
                  <div className="cp-info-value rtl">{craftsman.address}</div>
                </div>
                <div className="cp-info-icon"><IcPin /></div>
              </div>

              <div className="cp-info-row">
                <div className="cp-info-row-text">
                  <div className="cp-info-label">رقم الهاتف</div>
                  <div className="cp-info-value">{craftsman.phone}</div>
                </div>
                <div className="cp-info-icon"><IcPhone /></div>
              </div>

              <div className="cp-info-row">
                <div className="cp-info-row-text">
                  <div className="cp-info-label">البريد الإلكتروني</div>
                  <div className="cp-info-value">{craftsman.email}</div>
                </div>
                <div className="cp-info-icon"><IcMail /></div>
              </div>

              <div className="cp-info-row cp-no-border">
                <div className="cp-info-row-text">
                  <div className="cp-info-label">سنوات الخبرة</div>
                  <div className="cp-info-value">
                    <span className="cp-exp-badge">
                      <IcStar />
                      {craftsman.yearsOfExperience} سنوات خبرة
                    </span>
                  </div>
                </div>
                <div className="cp-info-icon"><IcWrench /></div>
              </div>
            </div>

            <div className="cp-map-panel">
              <iframe title="خريطة موقع الحرفي" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>

          <div className="cp-card">
            <div className="cp-section-title">
              <IcImages /> نماذج من الأعمال السابقة
            </div>

            {craftsman.workImages.length > 0 ? (
              <div className="cp-photos-grid">
                {craftsman.workImages.map((src, index) => (
                  <div key={`${src}-${index}`} className="cp-photo-item">
                    <img src={src} alt={`عمل ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="cp-photos-empty">لا توجد صور أعمال مرفوعة لهذا الحرفي حالياً</div>
            )}
          </div>
        </div>
      </div>

      {modalOpen ? <RequestModal craftsman={craftsman} onClose={() => setModalOpen(false)} /> : null}
    </>
  );
}