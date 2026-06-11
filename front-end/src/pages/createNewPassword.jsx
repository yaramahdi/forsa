import { useEffect, useState } from "react";
import "./createNewPassword.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16v16H4z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V8a5 5 0 0 1 10 0v3" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Converts Eastern Arabic numerals to Western for consistent comparison with stored hash
function convertArabicNumerals(value) {
  return String(value).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

export default function CreateNewPassword() {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background =
      "linear-gradient(135deg, #89aacb 0%, #a1bddc 35%, #a4c2e4 68%, #a4c6e8 100%)";
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  // ── Step 1 state ──────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fetchingQuestion, setFetchingQuestion] = useState(false);

  // ── Step 2 state ──────────────────────────────────────────────────
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // ── Shared state ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  // ── Step 1: fetch security question ──────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setServerError("");

    if (!email.trim()) {
      setEmailError("البريد الإلكتروني مطلوب");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setEmailError("يجب أن يكون البريد من نوع @gmail.com");
      return;
    }

    setFetchingQuestion(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/craftsmen/get-security-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(
          result?.status?.message || result?.message || "حدث خطأ، حاول مرة أخرى"
        );
        return;
      }

      const question = result?.data?.question;

      if (!question) {
        setServerError(
          "هذا الحساب لا يملك سؤال أمان. تواصل مع الإدارة لإعادة تعيين كلمة مرورك."
        );
        return;
      }

      setSecurityQuestion(question);
      setStep(2);
    } catch {
      setServerError("تعذر الاتصال بالسيرفر");
    } finally {
      setFetchingQuestion(false);
    }
  };

  // ── Step 2: reset password ────────────────────────────────────────
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setAnswerError("");
    setPasswordError("");
    setConfirmError("");
    setServerError("");

    let hasError = false;

    if (!securityAnswer.trim()) {
      setAnswerError("إجابة سؤال الأمان مطلوبة");
      hasError = true;
    }

    if (!newPassword.trim()) {
      setPasswordError("كلمة المرور مطلوبة");
      hasError = true;
    } else if (newPassword.length < 8) {
      setPasswordError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      hasError = true;
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_\-#^()+=]).{8,}$/.test(newPassword)) {
      setPasswordError("كلمة المرور يجب أن تحتوي على حروف وأرقام ورمز خاص");
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmError("تأكيد كلمة المرور مطلوب");
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      setConfirmError("كلمتا المرور غير متطابقتين");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/craftsmen/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          securityAnswer: convertArabicNumerals(securityAnswer.trim()),
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg =
          result?.status?.message || result?.message || "حدث خطأ، حاول مرة أخرى";
        setServerError(msg);
        return;
      }

      setSuccessMsg("تمت إعادة تعيين كلمة المرور بنجاح ✅");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch {
      setServerError("تعذر الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-bg-icons">
        <span>⚒</span>
        <span>⚙</span>
        <span>🪛</span>
        <span>👷</span>
      </div>

      <div className="reset-card" dir="rtl">
        <div className="reset-lock-wrap">
          <div className="reset-lock-circle">
            <div className="reset-lock-icon">
              <LockIcon />
            </div>
          </div>
        </div>

        <div className="reset-header">
          <h1>إعادة تعيين كلمة المرور</h1>
          <p style={{ color: "#6a84a3", fontSize: "14px", margin: "4px 0 0", fontFamily: "Cairo, sans-serif" }}>
            {step === 1
              ? "الخطوة 1 من 2 — أدخل بريدك الإلكتروني"
              : "الخطوة 2 من 2 — أجب على سؤال الأمان"}
          </p>
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form className="reset-form" onSubmit={handleEmailSubmit} noValidate>
            <div className="reset-field">
              <label>البريد الإلكتروني</label>
              <div className="reset-input-wrap">
                <span className="reset-input-icon right">
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setServerError("");
                  }}
                  className={emailError ? "error" : ""}
                />
              </div>
              {emailError && (
                <div className="reset-error">
                  <AlertIcon />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            {serverError && (
              <div className="reset-error" style={{ marginBottom: "12px" }}>
                <AlertIcon />
                <span>{serverError}</span>
              </div>
            )}

            <button type="submit" className="reset-btn" disabled={fetchingQuestion}>
              {fetchingQuestion ? "جاري البحث..." : "التالي ←"}
            </button>
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form className="reset-form" onSubmit={handleResetSubmit} noValidate>
            {/* Display the fetched security question */}
            <div
              style={{
                background: "#eef5ff",
                border: "1.5px solid #c5d9f2",
                borderRadius: "16px",
                padding: "14px 18px",
                color: "#1b4b82",
                fontWeight: "700",
                fontSize: "15px",
                textAlign: "center",
                lineHeight: "1.7",
                fontFamily: "Cairo, sans-serif",
              }}
            >
              {securityQuestion}
            </div>

            <div className="reset-field">
              <label>إجابة سؤال الأمان</label>
              <div className="reset-input-wrap">
                <span className="reset-input-icon right">
                  <LockIcon />
                </span>
                <input
                  type="text"
                  placeholder="اكتب إجابتك هنا"
                  value={securityAnswer}
                  onChange={(e) => {
                    setSecurityAnswer(e.target.value);
                    setAnswerError("");
                    setServerError("");
                  }}
                  className={answerError ? "error" : ""}
                />
              </div>
              {answerError && (
                <div className="reset-error">
                  <AlertIcon />
                  <span>{answerError}</span>
                </div>
              )}
            </div>

            <div className="reset-field">
              <label>كلمة المرور الجديدة</label>
              <div className="reset-input-wrap">
                <span className="reset-input-icon right">
                  <LockIcon />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                    setServerError("");
                  }}
                  className={passwordError ? "error" : ""}
                />
                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowNewPassword((p) => !p)}
                  aria-label="إظهار أو إخفاء كلمة المرور"
                >
                  <EyeIcon open={showNewPassword} />
                </button>
              </div>
              {passwordError && (
                <div className="reset-error">
                  <AlertIcon />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="reset-field">
              <label>تأكيد كلمة المرور</label>
              <div className="reset-input-wrap">
                <span className="reset-input-icon right">
                  <LockIcon />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmError("");
                    setServerError("");
                  }}
                  className={confirmError ? "error" : ""}
                />
                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  aria-label="إظهار أو إخفاء كلمة المرور"
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
              {confirmError && (
                <div className="reset-error">
                  <AlertIcon />
                  <span>{confirmError}</span>
                </div>
              )}
            </div>

            {serverError && (
              <div className="reset-error" style={{ marginBottom: "12px" }}>
                <AlertIcon />
                <span>{serverError}</span>
              </div>
            )}

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? "جاري إعادة التعيين..." : "إعادة تعيين ←"}
            </button>

            {successMsg && <div className="reset-success">{successMsg}</div>}

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setServerError("");
                setSecurityAnswer("");
                setAnswerError("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordError("");
                setConfirmError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#6a84a3",
                cursor: "pointer",
                fontSize: "14px",
                textAlign: "center",
                fontFamily: "Cairo, sans-serif",
                fontWeight: "600",
                marginTop: "-8px",
              }}
            >
              ← تغيير البريد الإلكتروني
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
