export const translations = {
  ar: {
    // Navbar
    home: 'الرئيسية',
    categories: 'الفئات',
    features: 'المميزات',
    contact: 'اتصل بنا',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',

    // Hero
    heroTitle: 'من الركام.. نبني الأحلام',
    heroSubtitle: ' حرفيون محترفون بالقرب منك لجميع مشاريعك',
    searchPlaceholder: 'ابحث عن الحرفي',
    searchBtn: '  ابحث  ',
    searchAlert: 'سيتم البحث عن أفضل المحترفين في: ',
    searchAlertError: 'يرجى إدخال الحرفة التي تبحث عنها أولاً',

    // Categories
    categoriesTitle: 'اختر الحرفي المناسب لعملك',
    engineer: 'مهندس',
    plumber: 'سباك',
    painter: 'دهان',
    carpenter: 'نجار',
    electrician: 'كهربائي',

    // Why Forsa
    whyForsaTitle: 'لماذا فرصة؟',
    security: 'أمان وخصوصية',
    securityDesc: 'احمِ بيانات عملائك وحرفييك بأعلى معايير الأمان والسرية',
    fastResponse: 'استجابة سريعة',
    fastResponseDesc: 'احصل على ردود فورية من الحرفيين المتخصصين في الخدمة المطلوبة',
    directContact: 'توصل مباشر',
    directContactDesc: 'تواصل مباشرة مع الحرفيين دون وسيط للتفاهم على تفاصيل الخدمة',
    trustedSpecialists: 'حرفيون موثوقون',
    trustedSpecialistsDesc: 'اختر من حرفيين مقيمين ومؤثقين بعناية لضمان جودة الخدمة',

    // Specialists
    specialistsTitle: 'حرفيون مميزون',
    more: 'المزيد',

    // Craftsmen Section
    iAmCraftsman: 'أنا حرفي',
    areYouCraftsman: 'هل أنت حرفي؟',
    craftsmanSubtitle: 'انضم إلى آلاف الحرفيين الذين يعملون عبر منصة فرصة ووسّع نطاق عملك',
    registerNow: 'سجل الآن',

    // Footer
    footerDesc: 'المنصة الاولى للعثور على الحرفيين في قطاع غزة',
    links: 'روابط',
    about: 'من نحن',
    craftsmen: 'الحرفيون',
    followUs: 'تابعنا',
    footer: '© 2026 جميع الحقوق محفوظة لمنصة فُرصة'
  },
  en: {
    // Navbar
    home: 'Home',
    categories: 'Categories',
    features: 'Features',
    contact: 'Contact Us',
    login: 'Login',
    signup: 'Sign Up',

    // Hero
    heroTitle: 'From ruins... We build dreams',
    heroSubtitle: 'Certified professionals near you for all your projects',
    searchPlaceholder: 'Search for a specialist',
    searchBtn: 'Search',
    searchAlert: 'Searching for the best professionals in: ',
    searchAlertError: 'Please enter the trade you are looking for first',

    // Categories
    categoriesTitle: 'Choose the right specialist for your job',
    engineer: 'Engineer',
    plumber: 'Plumber',
    painter: 'Painter',
    carpenter: 'Carpenter',
    electrician: 'Electrician',

    // Why Forsa
    whyForsaTitle: 'Why Forsa Platform?',
    security: 'Safety and Privacy',
    securityDesc: 'Protect your clients and specialists data with the highest security and confidentiality standards',
    fastResponse: 'Fast Response',
    fastResponseDesc: 'Get immediate responses from specialists specialized in the required service',
    directContact: 'Direct Contact',
    directContactDesc: 'Communicate directly with specialists without intermediaries to agree on service details',
    trustedSpecialists: 'Trusted Specialists',
    trustedSpecialistsDesc: 'Choose from carefully verified and certified specialists to ensure service quality',

    // Specialists
    specialistsTitle: 'Outstanding Specialists',
    more: 'More',

    // Craftsmen Section
    iAmCraftsman: 'I am a Craftsman',
    areYouCraftsman: 'Are you a Craftsman?',
    craftsmanSubtitle: 'Join thousands of craftsmen working through Forsa platform and expand your business',
    registerNow: 'Register Now',

    // Footer
    footer: '© 2026 All rights reserved for Forsa Platform'
  }
}

export function t(key, language) {
  return translations[language]?.[key] || translations.ar[key] || key
}
