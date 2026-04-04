import React, { useState, useEffect, useRef } from 'react';
import './signup.css';

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Hammer,
  Briefcase,
  X
} from 'lucide-react';

export default function Signup() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    yearsOfExperience: '',
    city: '',
    neighborhood: '',
    profession: '',
    customProfession: '',
    workImages: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const urls = formData.workImages.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.workImages]);

  const convertArabicNumbersToEnglish = (value) => {
    return value.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'الاسم الثاني مطلوب';
    }

    if (!data.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!data.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'يجب أن يحتوي الإيميل على @gmail.com';
    }

    if (!data.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (data.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(data.password)) {
      newErrors.password = 'يجب أن تحتوي على أحرف وأرقام ورمز خاص';
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!data.phone.startsWith('059') || data.phone.length !== 10) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 059 ويتكون من 10 أرقام';
    }

    if (!data.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = 'عدد سنين الخبرة مطلوب';
    }

    if (!data.city.trim()) {
      newErrors.city = 'المنطقة مطلوبة';
    }

    if (!data.neighborhood.trim()) {
      newErrors.neighborhood = 'عنوان السكن مطلوب';
    }

    if (!data.profession) {
      newErrors.profession = 'المهنة مطلوبة';
    }

    if (data.profession === 'other' && !data.customProfession.trim()) {
      newErrors.customProfession = 'يرجى كتابة مهنتك';
    }

    if (data.workImages.length !== 3) {
      newErrors.workImages = 'يجب إضافة 3 صور أعمال بالضبط';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name !== 'password' && name !== 'confirmPassword') {
      value = value.trimStart();
    }

    value = convertArabicNumbersToEnglish(value);

    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === 'yearsOfExperience') {
      if (!/^\d*$/.test(value)) return;
    }

    const updatedData = {
      ...formData,
      [name]: value
    };

    if (name === 'profession' && value !== 'other') {
      updatedData.customProfession = '';
    }

    setFormData(updatedData);
    setErrors(validateForm(updatedData));
    setSuccessMessage('');
    setServerError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    setErrors(validateForm(formData));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    let updatedImages = [...formData.workImages];

    const invalidTypeExists = files.some((file) => !file.type.startsWith('image/'));
    if (invalidTypeExists) {
      setTouched((prev) => ({
        ...prev,
        workImages: true
      }));
      setErrors((prev) => ({
        ...prev,
        workImages: 'يسمح فقط برفع صور'
      }));
      setSuccessMessage('');
      setServerError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const invalidSizeExists = files.some((file) => file.size > 2 * 1024 * 1024);
    if (invalidSizeExists) {
      setTouched((prev) => ({
        ...prev,
        workImages: true
      }));
      setErrors((prev) => ({
        ...prev,
        workImages: 'حجم كل صورة يجب أن يكون أقل من 2MB'
      }));
      setSuccessMessage('');
      setServerError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const totalImagesAfterAdd = updatedImages.length + files.length;
    const exceededLimit = totalImagesAfterAdd > 3;

    updatedImages = [...updatedImages, ...files].slice(0, 3);

    const updatedData = {
      ...formData,
      workImages: updatedImages
    };

    setFormData(updatedData);
    setTouched((prev) => ({
      ...prev,
      workImages: true
    }));

    const validationErrors = validateForm(updatedData);

    if (exceededLimit) {
      validationErrors.workImages = 'يمكنك رفع 3 صور فقط';
    }

    setErrors(validationErrors);
    setSuccessMessage('');
    setServerError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.workImages.filter((_, i) => i !== index);

    const updatedData = {
      ...formData,
      workImages: updatedImages
    };

    setFormData(updatedData);
    setTouched((prev) => ({
      ...prev,
      workImages: true
    }));
    setErrors(validateForm(updatedData));
    setSuccessMessage('');
    setServerError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitAttempted(true);
    setSuccessMessage('');
    setServerError('');

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = new FormData();

      submitData.append('firstName', formData.firstName.trim());
      submitData.append('lastName', formData.lastName.trim());
      submitData.append('email', formData.email.trim().toLowerCase());
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone.trim());
      submitData.append('yearsOfExperience', formData.yearsOfExperience);
      submitData.append('city', formData.city.trim());
      submitData.append('neighborhood', formData.neighborhood.trim());
      submitData.append(
        'profession',
        formData.profession === 'other'
          ? formData.customProfession.trim()
          : formData.profession
      );
      submitData.append('bio', '');

      formData.workImages.forEach((file) => {
        submitData.append('workImages', file);
      });

      const response = await fetch('http://localhost:5000/api/craftsmen/register', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      const isSuccess =
        response.ok &&
        (result?.success === true || result?.status?.status === true);

      if (!isSuccess) {
        setServerError(
          result?.message ||
            result?.status?.message ||
            'حدث خطأ أثناء إنشاء الحساب'
        );
        return;
      }

      setSuccessMessage('تم إنشاء الحساب بنجاح 🎉');

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        yearsOfExperience: '',
        city: '',
        neighborhood: '',
        profession: '',
        customProfession: '',
        workImages: []
      });

      setErrors({});
      setTouched({});
      setSubmitAttempted(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setServerError('تعذر الاتصال بالسيرفر، تأكد أن الباك شغال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = (fieldName) => {
    return (touched[fieldName] || submitAttempted) && errors[fieldName];
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">انشاء حساب للحرفيين</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">الاسم الأول</label>
              <div className={`input-box ${showError('firstName') ? 'input-box-error' : ''}`}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="أدخل الاسم الأول"
                  className="signup-form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <User size={18} />
                </span>
              </div>
              {showError('firstName') && <p className="field-error">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label className="signup-label">الاسم الثاني</label>
              <div className={`input-box ${showError('lastName') ? 'input-box-error' : ''}`}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="أدخل الاسم الثاني"
                  className="signup-form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <User size={18} />
                </span>
              </div>
              {showError('lastName') && <p className="field-error">{errors.lastName}</p>}
            </div>
          </div>

          <label className="signup-label">البريد الإلكتروني</label>
          <div className={`input-box ${showError('email') ? 'input-box-error' : ''}`}>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="signup-form-control"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span className="icon">
              <Mail size={18} />
            </span>
          </div>
          {showError('email') && <p className="field-error">{errors.email}</p>}

          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">كلمة المرور</label>
              <div className={`input-box ${showError('password') ? 'input-box-error' : ''}`}>
                <input
                  type="password"
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  className="signup-form-control"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <Lock size={18} />
                </span>
              </div>
              {showError('password') && <p className="field-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="signup-label">تأكيد كلمة المرور</label>
              <div className={`input-box ${showError('confirmPassword') ? 'input-box-error' : ''}`}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="تأكيد كلمة المرور"
                  className="signup-form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <Lock size={18} />
                </span>
              </div>
              {showError('confirmPassword') && (
                <p className="field-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">رقم الهاتف</label>
              <div className={`input-box ${showError('phone') ? 'input-box-error' : ''}`}>
                <input
                  type="text"
                  name="phone"
                  placeholder="059XXXXXXXX"
                  className="signup-form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <Phone size={18} />
                </span>
              </div>
              {showError('phone') && <p className="field-error">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="signup-label">عدد سنين الخبرة</label>
              <div
                className={`input-box ${showError('yearsOfExperience') ? 'input-box-error' : ''}`}
              >
                <input
                  type="text"
                  name="yearsOfExperience"
                  placeholder="ادخل عدد سنين خبرتك"
                  className="signup-form-control"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <Hammer size={18} />
                </span>
              </div>
              {showError('yearsOfExperience') && (
                <p className="field-error">{errors.yearsOfExperience}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">المنطقة</label>
              <div className={`input-box ${showError('city') ? 'input-box-error' : ''}`}>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="signup-form-control"
                >
                  <option value="" disabled hidden>
                    اختر المنطقة
                  </option>
                  <option value="غزة">غزة</option>
                  <option value="شمال غزة">شمال غزة</option>
                  <option value="الوسطى">الوسطى</option>
                  <option value="الجنوب">الجنوب</option>
                </select>
                <span className="icon">
                  <MapPin size={18} />
                </span>
              </div>
              {showError('city') && <p className="field-error">{errors.city}</p>}
            </div>

            <div className="form-group">
              <label className="signup-label">عنوان السكن في غزة</label>
              <div className={`input-box ${showError('neighborhood') ? 'input-box-error' : ''}`}>
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="ادخل عنوانك بالتفصيل"
                  className="signup-form-control"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="icon">
                  <MapPin size={18} />
                </span>
              </div>
              {showError('neighborhood') && (
                <p className="field-error">{errors.neighborhood}</p>
              )}
            </div>
          </div>

          <label className="signup-label">المهنة</label>
          <div className={`input-box ${showError('profession') ? 'input-box-error' : ''}`}>
            <select
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              onBlur={handleBlur}
              className="signup-form-control"
            >
              <option value="" disabled hidden>
                اختر مهنتك
              </option>
              <option value="engineer">مهندس</option>
              <option value="plumber">سباك</option>
              <option value="carpenter">نجار</option>
              <option value="electrician">كهربائي</option>
              <option value="painter">دهان</option>
              <option value="technician">فني</option>
              <option value="driver">سائق</option>
              <option value="mechanic">ميكانيكي</option>
              <option value="other">أخرى</option>
            </select>
            <span className="icon">
              <Briefcase size={18} />
            </span>
          </div>
          {showError('profession') && <p className="field-error">{errors.profession}</p>}

          {formData.profession === 'other' && (
            <>
              <div
                className={`input-box extra-field ${
                  showError('customProfession') ? 'input-box-error' : ''
                }`}
              >
                <input
                  type="text"
                  name="customProfession"
                  placeholder="اكتب مهنتك"
                  className="signup-form-control"
                  value={formData.customProfession}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {showError('customProfession') && (
                <p className="field-error">{errors.customProfession}</p>
              )}
            </>
          )}

          <label className="signup-label">صور أعمالك</label>

          <div className="upload-grid">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`upload-box ${showError('workImages') ? 'upload-box-error' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImages[index] ? (
                  <div className="preview-wrapper">
                    <img src={previewImages[index]} alt={`preview-${index}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <span>+</span>
                )}
              </div>
            ))}
          </div>

          {showError('workImages') && <p className="field-error">{errors.workImages}</p>}

          <button type="submit" className="signup-btn" disabled={isSubmitting}>
            {isSubmitting ? 'جاري إنشاء الحساب...' : 'انشاء حسابي'}
          </button>

          {serverError && (
            <p className="field-error" style={{ textAlign: 'center' }}>
              {serverError}
            </p>
          )}

          {successMessage && <p className="success-message">{successMessage}</p>}

          <p className="login-text">
            هل لديك حساب بالفعل؟{' '}
            <span
              className="login-link"
              onClick={() => alert('صفحة تسجيل الدخول قريباً')}
            >
              تسجيل الدخول
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}