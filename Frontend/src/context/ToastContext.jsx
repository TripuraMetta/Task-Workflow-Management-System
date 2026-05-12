import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10
      }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px', borderRadius: 12,
            fontSize: 13, fontWeight: 500,
            minWidth: 260, maxWidth: 380,
            animation: 'fadeUp 0.3s cubic-bezier(0.34,1.3,0.64,1)',
            backdropFilter: 'blur(20px)',
            background: t.type === 'success' ? 'rgba(52,211,153,0.12)' : t.type === 'error' ? 'rgba(244,114,182,0.12)' : 'rgba(167,139,250,0.12)',
            border: `1px solid ${t.type === 'success' ? 'rgba(52,211,153,0.30)' : t.type === 'error' ? 'rgba(244,114,182,0.30)' : 'rgba(167,139,250,0.30)'}`,
            color: t.type === 'success' ? '#a7f3d0' : t.type === 'error' ? '#fbcfe8' : '#c4b5fd',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <span style={{ fontSize: 16 }}>
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
