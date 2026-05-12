// ===== BADGE =====
export function Badge({ type = 'todo', children }) {
  const styles = {
    todo:    { bg: 'rgba(129,140,248,0.15)', color: '#c7d2fe', border: '1px solid rgba(129,140,248,0.30)' },
    inprog:  { bg: 'rgba(251,191,36,0.12)',  color: '#fde68a', border: '1px solid rgba(251,191,36,0.30)' },
    done:    { bg: 'rgba(52,211,153,0.12)',  color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.30)' },
    high:    { bg: 'rgba(248,113,113,0.12)', color: '#fecaca', border: '1px solid rgba(248,113,113,0.30)' },
    medium:  { bg: 'rgba(251,191,36,0.12)',  color: '#fde68a', border: '1px solid rgba(251,191,36,0.30)' },
    low:     { bg: 'rgba(52,211,153,0.12)',  color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.30)' },
    admin:   { bg: 'rgba(244,114,182,0.15)', color: '#fbcfe8', border: '1px solid rgba(244,114,182,0.30)' },
    user:    { bg: 'rgba(52,211,153,0.12)',  color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.30)' },
  }
  const dotColors = { todo: '#818cf8', inprog: '#fbbf24', done: '#34d399', high: '#f87171', medium: '#fbbf24', low: '#34d399', admin: '#f472b6', user: '#34d399' }
  const s = styles[type] || styles.todo
  const showDot = ['todo','inprog','done'].includes(type)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      background: s.bg, color: s.color, border: s.border,
      transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {showDot && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: dotColors[type],
          animation: ['todo','inprog'].includes(type) ? 'pulse 2s ease infinite' : 'none',
          boxShadow: `0 0 4px ${dotColors[type]}`,
        }} />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = { TO_DO: ['todo','To Do'], IN_PROGRESS: ['inprog','In Progress'], DONE: ['done','Done'] }
  const [type, label] = map[status] || ['todo', status]
  return <Badge type={type}>{label}</Badge>
}

export function PriorityBadge({ priority }) {
  const map = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
  return <Badge type={map[priority] || 'medium'}>{priority}</Badge>
}

// ===== MODAL =====
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(5,3,20,0.75)',
      backdropFilter: 'blur(12px)',
      zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: 'rgba(20,14,60,0.88)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 24, padding: 36,
        width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
        animation: 'scaleIn 0.3s cubic-bezier(0.34,1.3,0.64,1)',
        position: 'relative',
      }}>
        {/* top gradient bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, #a78bfa, #f472b6, #22d3ee)',
          backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite',
          borderRadius: '24px 24px 0 0',
        }} />
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700,
          marginBottom: 20,
          background: 'linear-gradient(135deg, #f0eeff, #c4b5fd)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{title}</h2>
        {children}
        {footer && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ===== FORM INPUT =====
export function FormInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 700,
          color: '#9b93c8', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 6,
        }}>{label}</label>
      )}
      {props.as === 'select' ? (
        <select {...props} as={undefined} style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, color: 'var(--text)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14,
          outline: 'none', backdropFilter: 'blur(8px)',
          transition: 'all 0.25s cubic-bezier(0.34,1.3,0.64,1)',
          ...props.style,
        }}>
          {props.children}
        </select>
      ) : props.as === 'textarea' ? (
        <textarea {...props} as={undefined} style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, color: 'var(--text)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14,
          outline: 'none', backdropFilter: 'blur(8px)', resize: 'vertical',
          ...props.style,
        }} />
      ) : (
        <input {...props} style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, color: 'var(--text)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14,
          outline: 'none', backdropFilter: 'blur(8px)',
          transition: 'all 0.25s cubic-bezier(0.34,1.3,0.64,1)',
          ...props.style,
        }} />
      )}
    </div>
  )
}

// ===== STAT CARD =====
export function StatCard({ icon, value, label, color = 'accent', delay = 0 }) {
  const colors = {
    accent: { bar: 'linear-gradient(90deg,#a78bfa,#818cf8)', glow: 'rgba(167,139,250,0.7)' },
    green:  { bar: 'linear-gradient(90deg,#34d399,#10b981)', glow: 'rgba(52,211,153,0.7)' },
    amber:  { bar: 'linear-gradient(90deg,#fbbf24,#f59e0b)', glow: 'rgba(251,191,36,0.7)' },
    red:    { bar: 'linear-gradient(90deg,#f472b6,#ec4899)', glow: 'rgba(244,114,182,0.7)' },
  }
  const c = colors[color] || colors.accent
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20, padding: 24,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.10)',
      animation: `fadeUp 0.4s ease ${delay}s both`,
      transition: 'all 0.3s cubic-bezier(0.34,1.3,0.64,1)',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
        const ico = e.currentTarget.querySelector('.stat-icon')
        if (ico) { ico.style.transform = 'scale(1.25) rotate(-5deg)'; ico.style.filter = 'drop-shadow(0 0 16px rgba(167,139,250,0.6))' }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.10)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
        const ico = e.currentTarget.querySelector('.stat-icon')
        if (ico) { ico.style.transform = ''; ico.style.filter = 'drop-shadow(0 0 8px rgba(167,139,250,0.3))' }
      }}
    >
      {/* inner glow */}
      <div style={{ position:'absolute',inset:0, background:'radial-gradient(circle at top right, rgba(255,255,255,0.06) 0%, transparent 60%)', pointerEvents:'none' }} />
      <div className="stat-icon" style={{ fontSize: 24, marginBottom: 12, display:'inline-block', filter:'drop-shadow(0 0 8px rgba(167,139,250,0.3))', transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease' }}>{icon}</div>
      <div style={{ fontFamily:'Outfit,sans-serif', fontSize:32, fontWeight:800, marginBottom:2, background:'linear-gradient(135deg,#fff 30%,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{value}</div>
      <div style={{ color:'var(--muted)', fontSize:13 }}>{label}</div>
      {/* bottom accent bar */}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:2, background:c.bar, boxShadow:`0 0 12px ${c.glow}` }} />
    </div>
  )
}

// ===== GLASS CARD =====
export function GlassCard({ children, style, hover = true }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
      transition: hover ? 'all 0.3s ease' : 'none',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ===== EMPTY STATE =====
export function EmptyState({ icon = '📭', title = 'Nothing here', sub = '' }) {
  return (
    <div style={{ textAlign:'center', padding:'48px 24px', color:'var(--muted)' }}>
      <div style={{ fontSize:40, marginBottom:12, opacity:0.5, animation:'pulse 3s ease-in-out infinite', display:'inline-block', filter:'drop-shadow(0 0 12px rgba(167,139,250,0.4))' }}>{icon}</div>
      <div style={{ fontSize:15, fontWeight:600, marginBottom:4, color:'var(--text)', opacity:0.5 }}>{title}</div>
      <div style={{ fontSize:13 }}>{sub}</div>
    </div>
  )
}

// ===== PROGRESS BAR =====
export function ProgressBar({ pct }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--muted)', marginBottom:4 }}>
        <span>Progress</span><span>{pct}%</span>
      </div>
      <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:4, height:6, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:4,
          background:'linear-gradient(90deg,#a78bfa,#f472b6)',
          width:`${pct}%`,
          boxShadow:'0 0 8px rgba(167,139,250,0.6)',
          transition:'width 0.7s cubic-bezier(0.34,1.3,0.64,1)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',top:0,left:'-100%',width:'100%',height:'100%',
            background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)',
            animation:'shimmer 2.5s ease infinite',
          }} />
        </div>
      </div>
    </div>
  )
}
