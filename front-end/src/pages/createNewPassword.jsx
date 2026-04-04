import { useMemo, useState } from "react";
import "./createNewPassword.css";

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

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Za-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&_\-#^()+=]/.test(password)) score++;



  return {};
}

export default function CreateNewPassword() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
  email: "",
  newPassword: "",
  confirmPassword: "",
});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  
  
 const validate = () => {
  const newErrors = {
    email: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!formData.email.trim()) {
    newErrors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
    newErrors.email = "يجب أن يكون البريد من نوع @gmail.com";
  }

  if (!formData.newPassword.trim()) {
    newErrors.newPassword = "كلمة المرور مطلوبة";
  } else if (formData.newPassword.length < 8) {
    newErrors.newPassword = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  } else if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_\-#^()+=]).{8,}$/.test(
      formData.newPassword
    )
  ) {
    newErrors.newPassword =
      "كلمة المرور يجب أن تحتوي على حروف وأرقام ورمز خاص";
  }

  if (!formData.confirmPassword.trim()) {
    newErrors.confirmPassword = "تأكيد كلمة المرور مطلوبة";
  } else if (formData.confirmPassword !== formData.newPassword) {
    newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
  }

  return newErrors;
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

    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

if (
  validationErrors.email ||
  validationErrors.newPassword ||
  validationErrors.confirmPassword
)
  return;
    setLoading(true);
    setSuccessMsg("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccessMsg("تمت إعادة تعيين كلمة المرور بنجاح");
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
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

        </div>

        <form className="reset-form" onSubmit={handleSubmit} noValidate>
          
       <div className="reset-field">
  <label>البريد الإلكتروني</label>

  <div className="reset-input-wrap">
    
    {/* الأيقونة */}
    <span className="reset-input-icon right">
      <EmailIcon />
    </span>

    <input
      type="email"
      name="email"
      placeholder="example@gmail.com"
      value={formData.email}
      onChange={handleChange}
      className={errors.email ? "error" : ""}
    />

  </div>
  {errors.email && (
    <div className="reset-error">
      <AlertIcon />
      <span>{errors.email}</span>
    </div>
  )}
            <label>كلمة المرور الجديدة</label>
            <div className="reset-input-wrap">
              <span className="reset-input-icon right">
                <LockIcon />
              </span>

              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "error" : ""}
              />

              <button
                type="button"
                className="reset-eye-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label="إظهار أو إخفاء كلمة المرور"
              >
                <EyeIcon open={showNewPassword} />
              </button>
            </div>

            {errors.newPassword && (
              <div className="reset-error">
                <AlertIcon />
                <span>{errors.newPassword}</span>
              </div>
            )}

          <div className="reset-field">
            <label>تأكيد كلمة المرور</label>
            <div className="reset-input-wrap">
              <span className="reset-input-icon right">
                <LockIcon />
              </span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
              />

              <button
                type="button"
                className="reset-eye-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label="إظهار أو إخفاء كلمة المرور"
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>

            {errors.confirmPassword && (
              <div className="reset-error">
                <AlertIcon />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>
          </div>


          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "جاري إعادة التعيين..." : "إعادة تعيين ←"}
          </button>

          {successMsg && <div className="reset-success">{successMsg}</div>}
        </form>
      </div>
    </div>
  );
}
