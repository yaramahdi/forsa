import { getPasswordStrength } from '../utils/passwordStrength';

const REQUIREMENTS = [
  { label: '8 أحرف على الأقل', test: (p) => p.length >= 8 },
  { label: 'حرف كبير (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'رقم (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'رمز خاص (!@#$)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordStrengthIndicator({ password }) {
  if (!password) return null;

  const { label, percent, color } = getPasswordStrength(password);

  return (
    <div style={{ marginTop: '8px', direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          flex: 1,
          height: '6px',
          background: '#E5E7EB',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: color,
            borderRadius: '6px',
            transition: 'width 0.25s ease, background-color 0.25s ease',
          }} />
        </div>
        {label && (
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: color,
            minWidth: '42px',
            textAlign: 'right',
            transition: 'color 0.25s ease',
          }}>
            {label}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
        {REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <span key={req.label} style={{
              fontSize: '11px',
              color: met ? '#059669' : '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'color 0.2s ease',
            }}>
              <span style={{ fontWeight: 700 }}>{met ? '✓' : '○'}</span>
              {req.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
