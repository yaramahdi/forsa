import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function VisualPanel() {
  return (
    <div className="visual-panel">
      <img
        src="/images/workers.jpg"
        alt="workers"
        className="visual-img"
      />

      <div className="visual-content" dir="rtl">
        <h2 className="visual-title">
          اطلب… واحنا ننفذ
          <br />
          أفضل الحرفيين بانتظارك لإنجاز أعمالك بسرعة وثقة.
        </h2>

        <p className="visual-subtitle">
          وصلنا أصحاب المهن بمن يحتاجهم
          <br />
          بكل سرعة وثقة
        </p>

        <div className="visual-tags">
          <span>نجار 🪚</span>
          <span>كهربائي 🔌</span>
          <span>سباك 🪠</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // في صفحة الدخول نتحقق فقط من وجود القيم
  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validate();
  setErrors(newErrors);
  setServerError("");

  if (newErrors.email || newErrors.password) return;

  const email = formData.email.trim().toLowerCase();
  const password = formData.password;

  // دخول الأدمن المباشر
  if (email === "admin@gmail.com" && password === "a123456@") {
    localStorage.setItem("forsaAdmin", "true");
    localStorage.setItem("forsaAdminEmail", email);
    navigate("/admin");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/craftsmen/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    const isSuccess =
      response.ok &&
      (result?.success === true || result?.status?.status === true);

    if (!isSuccess) {
      setServerError(
        result?.message ||
          result?.status?.message ||
          "بيانات الدخول غير صحيحة"
      );
      return;
    }

    const token = result?.data?.token || result?.token;
    const craftsman = result?.data?.craftsman || result?.craftsman;

    if (token) {
      localStorage.setItem("forsaToken", token);
    }

    if (craftsman) {
      localStorage.setItem("forsaCraftsman", JSON.stringify(craftsman));
    }

    navigate("/");
  } catch (error) {
    setServerError("تعذر الاتصال بالسيرفر");
  } finally {
    setLoading(false);
  }
};
  




  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  return (
    <div className="login-root">
      <div className="login-wrapper">
        <VisualPanel />

        <div className="form-panel">
          
          <div className="form-box" dir="rtl">
            <div className="login-top-bar">
  <button onClick={() => navigate('/')} className="back-home-btn">
     العودة للرئيسية←
  </button>
</div>
            <div className="form-header">
              <div className="form-eyebrow">مرحباً بعودتك</div>
              <div className="form-title">تسجيل الدخول</div>
              <div className="form-subtitle">أدخل بياناتك للوصول إلى حسابك</div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label className="field-label">البريد الإلكتروني</label>

                <div className="field-wrap">
                  <input
                    type="email"
                    name="email"
                    className={`field-input ${errors.email ? "error" : ""}`}
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="field-icon">
                    <EmailIcon />
                  </span>
                </div>

                {errors.email && (
                  <div className="error-msg">
                    <AlertIcon />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">كلمة المرور</label>

                <div className="field-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    className={`field-input ${errors.password ? "error" : ""}`}
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <span className="field-icon">
                    <LockIcon />
                  </span>

                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPw((prev) => !prev)}
                    aria-label="إظهار أو إخفاء كلمة المرور"
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>

                {errors.password && (
                  <div className="error-msg">
                    <AlertIcon />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {serverError && (
                <div className="error-msg" style={{ marginBottom: "14px" }}>
                  <AlertIcon />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="forgot-row">
                <button
                  type="button"
                  className="link"
                  onClick={() => navigate("/create-new-password")}
                >
                  هل نسيت كلمة المرور؟
                </button>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "جاري الدخول..." : "دخول ←"}
              </button>
            </form>

            <div className="signup-row">
              <span>ليس لديك حساب؟ </span>
              <button
                type="button"
                className="link signup-link"
                onClick={() => navigate("/signup")}
              >
                أنشئ الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
