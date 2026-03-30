import React, { useState, useEffect, useRef } from 'react';
import './signup.css';

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Hammer,
  Briefcase
} from 'lucide-react';

export default function Signup() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    yearsOfExperience: '',
    area: '',
    address: '',
    profession: '',
    customProfession: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const urls = formData.images.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.images]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    value = value.trimStart();
    value = value.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

    if (name === 'phonenumber') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === 'yearsOfExperience') {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('يسمح فقط برفع صور');
    }

    const filteredBySize = validFiles.filter(
      (file) => file.size <= 2 * 1024 * 1024
    );
    if (filteredBySize.length !== validFiles.length) {
      alert('حجم الصورة يجب أن يكون أقل من 2MB');
    }

    setFormData((prev) => {
      const combinedImages = [...prev.images, ...filteredBySize];

      if (combinedImages.length > 5) {
        alert('يمكنك رفع 5 صور فقط');
      }

      return {
        ...prev,
        images: combinedImages.slice(0, 5)
      };
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phonenumber,
      yearsOfExperience,
      area,
      address,
      profession,
      customProfession,
      images
    } = formData;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !phonenumber.trim() ||
      !yearsOfExperience.trim() ||
      !area.trim() ||
      !address.trim() ||
      !profession
    ) {
      alert('يرجى تعبئة جميع الحقول');
      return;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      alert('يجب أن يحتوي الإيميل على @gmail.com');
      return;
    }

    if (password.length < 8) {
      alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      alert('كلمة المرور يجب أن تحتوي على أحرف وأرقام ورمز خاص');
      return;
    }

    if (password !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين');
      return;
    }

    if (!phonenumber.startsWith('059') || phonenumber.length !== 10) {
      alert('رقم الهاتف يجب أن يبدأ بـ 059 ويتكون من 10 أرقام');
      return;
    }

    if (profession === 'other' && !customProfession.trim()) {
      alert('يرجى كتابة مهنتك');
      return;
    }

    if (images.length === 0) {
      alert('يرجى إضافة صورة واحدة على الأقل');
      return;
    }

    alert('تم إنشاء الحساب بنجاح 🎉');

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phonenumber: '',
      yearsOfExperience: '',
      area: '',
      address: '',
      profession: '',
      customProfession: '',
      images: []
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">انشاء حساب للحرفيين</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">الاسم الأول</label>
              <div className="input-box">
                <input
                  type="text"
                  name="firstName"
                  placeholder="أدخل الاسم الأول"
                  className="signup-form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <span className="icon">
                  <User size={18} />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="signup-label">الاسم الثاني</label>
              <div className="input-box">
                <input
                  type="text"
                  name="lastName"
                  placeholder="أدخل الاسم الثاني"
                  className="signup-form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <span className="icon">
                  <User size={18} />
                </span>
              </div>
            </div>
          </div>

          <label className="signup-label">البريد الإلكتروني</label>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="signup-form-control"
              value={formData.email}
              onChange={handleChange}
            />
            <span className="icon">
              <Mail size={18} />
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">كلمة المرور</label>
              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  className="signup-form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span className="icon">
                  <Lock size={18} />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="signup-label">تأكيد كلمة المرور</label>
              <div className="input-box">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="تأكيد كلمة المرور"
                  className="signup-form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span className="icon">
                  <Lock size={18} />
                </span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">رقم الهاتف</label>
              <div className="input-box">
                <input
                  type="text"
                  name="phonenumber"
                  placeholder="059XXXXXXXX"
                  className="signup-form-control"
                  value={formData.phonenumber}
                  onChange={handleChange}
                />
                <span className="icon">
                  <Phone size={18} />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="signup-label">عدد سنين الخبرة</label>
              <div className="input-box">
                <input
                  type="text"
                  name="yearsOfExperience"
                  placeholder="ادخل عدد سنين خبرتك"
                  className="signup-form-control"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                />
                <span className="icon">
                  <Hammer size={18} />
                </span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="signup-label">المنطقة</label>
              <div className="input-box">
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
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
            </div>

            <div className="form-group">
              <label className="signup-label">عنوان السكن في غزة</label>
              <div className="input-box">
                <input
                  type="text"
                  name="address"
                  placeholder="ادخل عنوانك بالتفصيل"
                  className="signup-form-control"
                  value={formData.address}
                  onChange={handleChange}
                />
                <span className="icon">
                  <MapPin size={18} />
                </span>
              </div>
            </div>
          </div>

          <label className="signup-label">المهنة</label>
          <div className="input-box">
            <select
              name="profession"
              value={formData.profession}
              onChange={handleChange}
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

          {formData.profession === 'other' && (
            <input
              type="text"
              name="customProfession"
              placeholder="اكتب مهنتك"
              className="signup-form-control"
              value={formData.customProfession}
              onChange={handleChange}
            />
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

            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImages[index] ? (
                  <img src={previewImages[index]} alt={`preview-${index}`} />
                ) : (
                  <span>+</span>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="signup-btn">
            انشاء حسابي
          </button>

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