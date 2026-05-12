import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', adminOnly: false },
  { id: 'projects',  icon: '📁', label: 'Projects',  adminOnly: false, countKey: 'projects' },
  { id: 'tasks',     icon: '✅', label: 'My Tasks',  adminOnly: false, countKey: 'tasks' },
  { id: 'users',     icon: '👥', label: 'Users',     adminOnly: true },
  { id: 'workflow',  icon: '🔄', label: 'Workflow Board', adminOnly: true },
]

export default function Sidebar({ activePage, onNavigate, counts = {} }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside style={{
      width: 250, minHeight: 'calc(100vh - 68px)',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      padding: '24px 14px',
      flexShrink: 0,
      position: 'sticky', top: 68,
      height: 'calc(100vh - 68px)',
      overflowY: 'auto',
      animation: 'slideRight 0.4s ease',
      zIndex: 1,
    }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--muted)',
          padding: '0 8px', marginBottom: 6,
        }}>Navigation</div>

        {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => {
          const active = activePage === item.id
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 14,
                cursor: 'pointer', fontSize: 14, fontWeight: 500,
                color: active ? '#c4b5fd' : 'var(--muted)',
                background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
                border: `1px solid ${active ? 'rgba(167,139,250,0.25)' : 'transparent'}`,
                boxShadow: active ? 'inset 0 0 20px rgba(167,139,250,0.05), 0 0 0 1px rgba(167,139,250,0.10)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative', overflow: 'hidden',
                marginBottom: 2,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='var(--text)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--muted)' } }}
            >
              {/* Left indicator bar */}
              <div style={{
                position:'absolute', left:0, top:'50%',
                width:3,
                height: active ? '70%' : '0%',
                background:'linear-gradient(to bottom,#a78bfa,#f472b6)',
                borderRadius:'0 3px 3px 0',
                transform:'translateY(-50%)',
                transition:'height 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow:'0 0 8px rgba(167,139,250,0.6)',
              }} />
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.countKey && counts[item.countKey] !== undefined && (
                <span style={{
                  fontSize:11, fontWeight:700,
                  background: active ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.07)',
                  color: active ? '#c4b5fd' : 'var(--muted)',
                  padding:'1px 7px', borderRadius:10,
                }}>{counts[item.countKey]}</span>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
