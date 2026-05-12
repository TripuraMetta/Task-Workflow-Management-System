import { useAuth } from '../context/AuthContext'
import Button from './Button'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(15,12,41,0.75)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 28px', height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800,
          background: 'linear-gradient(135deg, #c4b5fd, #f9a8d4, #67e8f9)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 12px rgba(167,139,250,0.4))',
        }}>FlowDesk</div>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em',
          background: 'rgba(167,139,250,0.15)', color: '#c4b5fd',
          padding: '3px 8px', borderRadius: 20,
          border: '1px solid rgba(167,139,250,0.30)',
        }}>{user?.role}</span>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'6px 14px',
          background:'rgba(255,255,255,0.08)',
          border:'1px solid rgba(255,255,255,0.14)',
          borderRadius:40, backdropFilter:'blur(12px)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,0.10)',
        }}>
          <div style={{
            width:28, height:28, borderRadius:'50%',
            background:'linear-gradient(135deg,#a78bfa,#f472b6)',
            display:'grid', placeItems:'center',
            fontSize:12, fontWeight:700,
            boxShadow:'0 2px 10px rgba(167,139,250,0.4)',
          }}>
            {(user?.username || 'U')[0].toUpperCase()}
          </div>
          <span style={{ fontSize:13, fontWeight:500 }}>{user?.username}</span>
        </div>
        <Button
          variant="ghost" size="sm"
          onClick={logout}
          style={{
            background:'rgba(244,114,182,0.08)',
            borderColor:'rgba(244,114,182,0.20)',
            color:'#fda4c4',
          }}
        >Sign Out</Button>
      </div>
    </nav>
  )
}
