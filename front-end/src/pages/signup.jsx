import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Hammer,
  Briefcase,
  CircleDollarSign,
  X,
  ArrowLeft,
  ImagePlus,
  Check,
} from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const PROFESSION_LABELS = {
  engineer: 'مهندس',
  plumber: 'سباك',
  carpenter: 'نجار',
  electrician: 'كهربائي',
  painter: 'دهان',
  technician: 'فني',
  driver: 'سائق',
  mechanic: 'ميكانيكي',
};

const STEP_TITLES = [
  'المعلومات الأساسية',
  'بيانات المهنة',
  'صور الأعمال',
];

const STEP_SUBTITLES = [
  'الخطوة 1 من 3 — أدخل بياناتك الشخصية',
  'الخطوة 2 من 3 — أخبرنا عن مهنتك',
  'الخطوة 3 من 3 — أضف صور أعمالك السابقة',
];

function readJsonSafe(response) {
  return response.json().catch(() => null);
}

export default function Signup() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    yearsOfExperience: '',
    price: '',
    city: '',
    neighborhood: '',
    profession: '',
    customProfession: '',
    bio: '',
    workImages: [],
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

  const progressPercent = useMemo(() => {
    if (currentStep === 1) return 33;
    if (currentStep === 2) return 66;
    return 100;
  }, [currentStep]);

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

    if (!data.price.trim()) {
      newErrors.price = 'سعر الساعة مطلوب';
    } else if (!/^\d+$/.test(data.price) || Number(data.price) < 1) {
      newErrors.price = 'سعر الساعة يجب أن يكون رقماً أكبر من أو يساوي 1';
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

  const getStepFields = (step, data = formData) => {
    if (step === 1) {
      return ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone'];
    }

    if (step === 2) {
      const fields = ['yearsOfExperience', 'price', 'city', 'neighborhood', 'profession'];
      if (data.profession === 'other') {
        fields.push('customProfession');
      }
      return fields;
    }

    return ['workImages'];
  };

  const validateCurrentStep = (step = currentStep, data = formData) => {
    const validationErrors = validateForm(data);
    const stepFields = getStepFields(step, data);

    const stepErrors = {};
    stepFields.forEach((field) => {
      if (validationErrors[field]) {
        stepErrors[field] = validationErrors[field];
      }
    });

    return { validationErrors, stepErrors, stepFields };
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

    if (name === 'yearsOfExperience' || name === 'price') {
      if (!/^\d*$/.test(value)) return;
    }

    const updatedData = {
      ...formData,
      [name]: value,
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
      [name]: true,
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
        workImages: true,
      }));
      setErrors((prev) => ({
        ...prev,
        workImages: 'يسمح فقط برفع صور',
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
        workImages: true,
      }));
      setErrors((prev) => ({
        ...prev,
        workImages: 'حجم كل صورة يجب أن يكون أقل من 2MB',
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
      workImages: updatedImages,
    };

    setFormData(updatedData);
    setTouched((prev) => ({
      ...prev,
      workImages: true,
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
      workImages: updatedImages,
    };

    setFormData(updatedData);
    setTouched((prev) => ({
      ...prev,
      workImages: true,
    }));
    setErrors(validateForm(updatedData));
    setSuccessMessage('');
    setServerError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextStep = () => {
    const { validationErrors, stepErrors, stepFields } = validateCurrentStep(currentStep);

    setErrors(validationErrors);
    setTouched((prev) => {
      const nextTouched = { ...prev };
      stepFields.forEach((field) => {
        nextTouched[field] = true;
      });
      return nextTouched;
    });

    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setServerError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitAttempted(true);
    setSuccessMessage('');
    setServerError('');

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const step1Fields = getStepFields(1, formData);
      const step2Fields = getStepFields(2, formData);
      const step3Fields = getStepFields(3, formData);

      if (step1Fields.some((field) => validationErrors[field])) {
        setCurrentStep(1);
      } else if (step2Fields.some((field) => validationErrors[field])) {
        setCurrentStep(2);
      } else if (step3Fields.some((field) => validationErrors[field])) {
        setCurrentStep(3);
      }
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = new FormData();

      const professionToSend =
        formData.profession === 'other'
          ? formData.customProfession.trim()
          : PROFESSION_LABELS[formData.profession] || formData.profession;

      submitData.append('firstName', formData.firstName.trim());
      submitData.append('lastName', formData.lastName.trim());
      submitData.append('email', formData.email.trim().toLowerCase());
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone.trim());
      submitData.append('yearsOfExperience', formData.yearsOfExperience);
      submitData.append('price', formData.price);
      submitData.append('city', formData.city.trim());
      submitData.append('neighborhood', formData.neighborhood.trim());
      submitData.append('profession', professionToSend);
      submitData.append('bio', formData.bio.trim());

      formData.workImages.forEach((file) => {
        submitData.append('workImages', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/craftsmen/register`, {
        method: 'POST',
        body: submitData,
      });

      const result = await readJsonSafe(response);

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
        price: '',
        city: '',
        neighborhood: '',
        profession: '',
        customProfession: '',
        bio: '',
        workImages: [],
      });

      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
      setCurrentStep(1);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setServerError('تعذر الاتصال بالسيرفر، تأكد أن الباك شغال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = (fieldName) => {
    return (touched[fieldName] || submitAttempted) && errors[fieldName];
  };

  const renderStepState = (stepNumber) => {
    if (currentStep > stepNumber) return 'done';
    if (currentStep === stepNumber) return 'active';
    return 'idle';
  };

  return (
    <div className="signup-page" dir="rtl">
      <div className="signup-shell">
        <div className="signup-form-panel">
          <div className="signup-form-scroll">
            <div className="signup-form-card">
              <div className="signup-topbar">
                <button
                  type="button"
                  className="signup-home-btn"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft size={15} />
                  الرئيسية
                </button>

                <div className="signup-login-hint">
                  لديك حساب؟{' '}
                  <span className="signup-login-link" onClick={() => navigate('/login')}>
                    سجل الدخول
                  </span>
                </div>
              </div>

              <div className="signup-step-header">
                <h1 className="signup-step-title">{STEP_TITLES[currentStep - 1]}</h1>
                <p className="signup-step-subtitle">{STEP_SUBTITLES[currentStep - 1]}</p>
              </div>

              <div className="signup-progress-bar">
                <div
                  className="signup-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                {currentStep === 1 && (
                  <div className="signup-step-page visible">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="signup-label">الاسم الأول</label>
                        <div className={`input-box ${showError('firstName') ? 'input-box-error' : ''}`}>
                          <input
                            type="text"
                            name="firstName"
                            placeholder="أدخل الاسم الأول"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <span className="icon"><User size={18} /></span>
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
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <span className="icon"><User size={18} /></span>
                        </div>
                        {showError('lastName') && <p className="field-error">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="signup-label">البريد الإلكتروني</label>
                      <div className={`input-box ${showError('email') ? 'input-box-error' : ''}`}>
                        <input
                          type="email"
                          name="email"
                          placeholder="example@gmail.com"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="icon"><Mail size={18} /></span>
                      </div>
                      {showError('email') && <p className="field-error">{errors.email}</p>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="signup-label">كلمة المرور</label>
                        <div className={`input-box ${showError('password') ? 'input-box-error' : ''}`}>
                          <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <span className="icon"><Lock size={18} /></span>
                        </div>
                        {showError('password') && <p className="field-error">{errors.password}</p>}
                      </div>

                      <div className="form-group">
                        <label className="signup-label">تأكيد كلمة المرور</label>
                        <div className={`input-box ${showError('confirmPassword') ? 'input-box-error' : ''}`}>
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <span className="icon"><Lock size={18} /></span>
                        </div>
                        {showError('confirmPassword') && (
                          <p className="field-error">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="signup-label">رقم الهاتف</label>
                      <div className={`input-box ${showError('phone') ? 'input-box-error' : ''}`}>
                        <input
                          type="text"
                          name="phone"
                          placeholder="05XXXXXXXX"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="icon"><Phone size={18} /></span>
                      </div>
                      {showError('phone') && <p className="field-error">{errors.phone}</p>}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="signup-step-page visible">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="signup-label">المهنة</label>
                        <div className={`input-box ${showError('profession') ? 'input-box-error' : ''}`}>
                          <select
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                          <span className="icon"><Briefcase size={18} /></span>
                        </div>
                        {showError('profession') && <p className="field-error">{errors.profession}</p>}
                      </div>

                      <div className="form-group">
                        <label className="signup-label">سنوات الخبرة</label>
                        <div className={`input-box ${showError('yearsOfExperience') ? 'input-box-error' : ''}`}>
                          <input
                            type="text"
                            name="yearsOfExperience"
                            placeholder="مثال: 5"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <span className="icon"><Hammer size={18} /></span>
                        </div>
                        {showError('yearsOfExperience') && (
                          <p className="field-error">{errors.yearsOfExperience}</p>
                        )}
                      </div>
                    </div>

                    {formData.profession === 'other' && (
                      <div className="form-group full-width extra-field">
                        <label className="signup-label">اكتب مهنتك</label>
                        <div className={`input-box ${showError('customProfession') ? 'input-box-error' : ''}`}>
                          <input
                            type="text"
                            name="customProfession"
                            placeholder="اكتب مهنتك"
                            value={formData.customProfession}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        {showError('customProfession') && (
                          <p className="field-error">{errors.customProfession}</p>
                        )}
                      </div>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label className="signup-label">المنطقة</label>
                        <div className={`input-box ${showError('city') ? 'input-box-error' : ''}`}>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="" disabled hidden>
                              اختر المنطقة
                            </option>
                            <option value="غزة">غزة</option>
                            <option value="شمال غزة">شمال غزة</option>
                            <option value="الوسطى">الوسطى</option>
                            <option value="الجنوب">الجنوب</option>
                          </select>
                          <span className="icon"><MapPin size={18} /></span>
                        </div>
                        {showError('city') && <p className="field-error">{errors.city}</p>}
                      </div>

                      <div className="form-group">
                        <label className="signup-label">نطاق السعر (₪/ساعة)</label>
                        <div className={`input-box ${showError('price') ? 'input-box-error' : ''}`}>
                          <input
                            type="text"
                            name="price"
                            placeholder="مثال: 80"
                            value={formData.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <span className="icon"><CircleDollarSign size={18} /></span>
                        </div>
                        {showError('price') && <p className="field-error">{errors.price}</p>}
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="signup-label">عنوان السكن بالتفصيل</label>
                      <div className={`input-box ${showError('neighborhood') ? 'input-box-error' : ''}`}>
                        <input
                          type="text"
                          name="neighborhood"
                          placeholder="الحي، الشارع، رقم المبنى..."
                          value={formData.neighborhood}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="icon"><MapPin size={18} /></span>
                      </div>
                      {showError('neighborhood') && (
                        <p className="field-error">{errors.neighborhood}</p>
                      )}
                    </div>

                    <div className="section-divider">نبذة مختصرة (اختياري)</div>

                    <div className="form-group full-width">
                      <textarea
                        className="signup-textarea"
                        name="bio"
                        rows="4"
                        placeholder="اكتب وصفاً قصيراً عن خبرتك وخدماتك..."
                        value={formData.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="signup-step-page visible">
                    <div
                      className={`photos-upload ${showError('workImages') ? 'photos-upload-error' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="upload-ico">
                        <ImagePlus size={18} />
                      </div>
                      <div className="upload-txt">اسحب الصور هنا أو اضغط للرفع</div>
                      <div className="upload-sub">PNG, JPG حتى 5MB لكل صورة</div>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />

                    <div className="upload-grid">
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

                    {showError('workImages') && (
                      <p className="field-error">{errors.workImages}</p>
                    )}

                    <div className="upload-tip-card">
                      <div className="upload-tip-title">نصائح لصور احترافية</div>
                      <div className="upload-tip-text">
                        أضف صورًا واضحة بإضاءة جيدة لأعمالك السابقة — الحرفيون الذين يعرضون
                        صورًا أوضح يحصلون على طلبات أكثر
                      </div>
                    </div>
                  </div>
                )}

                <div className="signup-actions-row">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className="signup-btn-secondary"
                      onClick={handlePrevStep}
                    >
                      السابق
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      className="signup-btn-primary"
                      onClick={handleNextStep}
                    >
                      التالي
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="signup-btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'جاري إنشاء الحساب...'
                      ) : (
                        <>
                          <Check size={16} />
                          إنشاء الحساب
                        </>
                      )}
                    </button>
                  )}
                </div>

                {serverError && (
                  <p className="field-error center-text">{serverError}</p>
                )}

                {successMessage && (
                  <p className="success-message">{successMessage}</p>
                )}
              </form>
            </div>
          </div>
        </div>

        <aside className="signup-side-panel">
          <img
            src="/images/sidebarCraftmen.png"
            alt="حرفيون"
            className="signup-side-bg-image"
          />

          <div className="signup-side-overlay" />

        

          <div className="signup-side-body">
            <h2 className="signup-side-title">
              أنشئ حسابك
              <br />
              كحرفي موثوق
            </h2>

            <p className="signup-side-subtitle">
              انضم لقائمة الحرفيين الذين يحصلون على طلباتهم يوميًا من خلال المنصة
            </p>

            <div className="signup-side-steps">
              {[1, 2, 3].map((step) => {
                const state = renderStepState(step);

                return (
                  <div className="side-step-row" key={step}>
                    <div className={`side-step-circle ${state}`}>
                      {state === 'done' ? <Check size={12} /> : step}
                    </div>
                    <div className={`side-step-text ${state === 'active' ? 'active' : ''}`}>
                      {STEP_TITLES[step - 1]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="signup-side-footer">منصة فُرصة · فلسطين</div>
        </aside>
      </div>
    </div>
  );
}