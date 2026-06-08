const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export function getCraftsmanImage(craftsman) {
  if (craftsman?.profileImage) {
    const src = craftsman.profileImage;
    if (src.startsWith('http')) return src;
    return `${API_BASE_URL}${src}`;
  }
  return '/images/default-user.png';
}