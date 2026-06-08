export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', percent: 0, color: '#E5E7EB' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = {
    0: { label: '', percent: 0, color: '#E5E7EB' },
    1: { label: 'ضعيفة', percent: 25, color: '#DC2626' },
    2: { label: 'متوسطة', percent: 50, color: '#D97706' },
    3: { label: 'جيدة', percent: 75, color: '#059669' },
    4: { label: 'ممتازة', percent: 100, color: '#059669' },
  };

  return { score, ...levels[score] };
}
