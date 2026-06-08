import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '24px',
          direction: 'rtl',
          fontFamily: "'Cairo', sans-serif",
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px 32px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#1b3a5c', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
              حدث خطأ غير متوقع
            </h2>
            <p style={{ color: '#6b7a90', fontSize: '15px', lineHeight: 1.8, marginBottom: '28px' }}>
              نعتذر، حصل خطأ ما. جرّب تحديث الصفحة
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #1b4b82 0%, #2f7dd6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '11px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                تحديث الصفحة
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                style={{
                  background: '#fff',
                  color: '#1b3a5c',
                  border: '1.5px solid #d9e1eb',
                  borderRadius: '12px',
                  padding: '11px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
