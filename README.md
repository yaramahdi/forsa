# منصة فُرصة (Forsa)

منصة ويب تربط الحرفيين (سباك، كهربائي، نجار، دهان، مهندس...) بالزبائن اللي بيدوروا على خدمة، بواجهة عربية بالكامل (RTL).

A full-stack web platform connecting craftspeople with customers, built with a React front-end and an Express/MongoDB back-end.

## 🧱 هيكلية المشروع (Project Structure)

```
Forsa/
├── front-end/     # React + Vite client (RTL, Arabic UI)
└── back-end/      # Express REST API + MongoDB
```

## 🛠️ Tech Stack

**Front-end**
- React 18 + Vite
- React Router
- lucide-react (icons)

**Back-end**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication, bcryptjs
- Helmet, CORS, express-mongo-sanitize, express-rate-limit (security hardening)
- Multer (image uploads)

## 🚀 التشغيل محليًا (Getting Started)

### المتطلبات
- Node.js (v18 أو أحدث)
- قاعدة بيانات MongoDB (محلية أو Atlas)

### 1. الباك-إند (Back-end)

```bash
cd back-end
npm install
cp .env.example .env   # عبّي القيم (MONGO_URI, JWT_SECRET, ...)
npm run dev
```

يشتغل السيرفر افتراضيًا على `http://localhost:5000`.

أهم متغيرات البيئة (راجع `.env.example` للتفاصيل الكاملة):

| المتغير | الوصف |
|---|---|
| `PORT` | منفذ السيرفر |
| `MONGO_URI` | رابط الاتصال بقاعدة بيانات MongoDB |
| `JWT_SECRET` | مفتاح توقيع JWT |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | بيانات حساب الأدمن |
| `ALLOWED_ORIGINS` | نطاقات الفرونت-إند المسموح لها بالوصول (CORS) |

### 2. الفرونت-إند (Front-end)

```bash
cd front-end
npm install
npm run dev
```

يفتح التطبيق على `http://localhost:5173`.

## 📡 نظرة عامة على الـ API

| Method | Endpoint | الوصف |
|---|---|---|
| POST | `/api/craftsmen/register` | تسجيل حرفي جديد |
| POST | `/api/craftsmen/login` | تسجيل دخول حرفي |
| GET | `/api/craftsmen` | جلب كل الحرفيين (Pagination) |
| GET | `/api/craftsmen/featured` | الحرفيون المميزون |
| GET | `/api/craftsmen/:id` | حرفي معين |
| GET/PATCH | `/api/craftsmen/me` | ملف الحرفي الحالي |
| POST | `/api/service-requests` | إنشاء طلب خدمة |
| GET | `/api/service-requests/me` | طلبات الخدمة الخاصة بالحرفي |
| PATCH | `/api/service-requests/:requestId/status` | تحديث حالة الطلب |
| POST | `/api/admin/login` | تسجيل دخول الأدمن |
| GET/PATCH/DELETE | `/api/admin/craftsmen/...` | إدارة الحرفيين (محمي) |

## 📄 الرخصة

© 2026 جميع الحقوق محفوظة لمنصة فُرصة
