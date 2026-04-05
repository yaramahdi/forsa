export function getCraftsmanImage(craftsman) {
  if (craftsman?.profileImage) {
    return `http://localhost:5000${craftsman.profileImage}`;
  }

  return "/images/default-user.png";
}