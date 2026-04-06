//هاي الفنكشن البسيطة عشان يظهر صورة الحرفي لو موجوجة, ولو مش موجودة بظهر الصورة الديفولت

export function getCraftsmanImage(craftsman) {
  if (craftsman?.profileImage) {
    return `http://localhost:5000${craftsman.profileImage}`;
  }

  return "/images/default-user.png";
}