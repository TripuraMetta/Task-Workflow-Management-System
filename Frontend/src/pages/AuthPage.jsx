import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { api } from '../api'
import Button from '../components/Button'
import { FormInput } from '../components/UI'

export default function AuthPage() {
  const [tab, setTab]       = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const { login }  = useAuth()
  const toast      = useToast()

  // Login state
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // Register state
  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail]       = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole]         = useState('USER')

  async function handleLogin() {
    if (!email || !password) return setError('Please fill in all fields')
    setLoading(true); setError('')
    try {
      const data = await api('POST', '/auth/login', { email, password })
      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      const userData = { id: parseInt(payload.sub), role: data.role, username: email.split('@')[0], email }
      login(data.access_token, userData)
      toast('Welcome back!', 'success')
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleRegister() {
    if (!regUsername || !regEmail || !regPassword) return setError('Please fill in all fields')
    setLoading(true); setError('')
    try {
      await api('POST', '/auth/register', { username: regUsername, email: regEmail, password: regPassword, role: regRole })
      toast('Account created! Please sign in.', 'success')
      setTab('login'); setEmail(regEmail)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleKey(e) { if (e.key === 'Enter') tab === 'login' ? handleLogin() : handleRegister() }

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
      {/* Animated orbs */}
      {[
        { w:600,h:600, bg:'rgba(167,139,250,0.18)', top:'-150px', right:'-150px', delay:'0s' },
        { w:500,h:500, bg:'rgba(244,114,182,0.14)', bottom:'-100px', left:'-100px', delay:'2s' },
        { w:400,h:400, bg:'rgba(34,211,238,0.10)', top:'35%', left:'35%', delay:'4s' },
      ].map((o,i) => (
        <div key={i} style={{
          position:'fixed', borderRadius:'50%', filter:'blur(80px)',
          pointerEvents:'none', zIndex:0,
          width:o.w, height:o.h, background:o.bg,
          top:o.top, right:o.right, bottom:o.bottom, left:o.left,
          animation:`floatOrb 6s ease-in-out ${o.delay} infinite`,
        }} />
      ))}

      <div className="animate-scaleIn" style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 28, padding: 48,
        width: '100%', maxWidth: 430,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        position: 'relative', overflow: 'hidden', zIndex: 1,
      }} onKeyDown={handleKey}>
        {/* Top gradient bar */}
        <div style={{ position:'absolute',top:0,left:0,right:0,height:2, background:'linear-gradient(90deg,#a78bfa,#f472b6,#22d3ee,#a78bfa)', backgroundSize:'300% 100%', animation:'shimmer 4s linear infinite', zIndex:1 }} />
        {/* Inner glow */}
        <div style={{ position:'absolute',inset:0, background:'radial-gradient(ellipse at top left, rgba(167,139,250,0.12) 0%, transparent 60%)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
          <div style={{ width:40,height:40, background:'linear-gradient(135deg,#a78bfa,#f472b6)', borderRadius:10, display:'grid', placeItems:'center', fontSize:18, boxShadow:'0 4px 16px rgba(167,139,250,0.4)' }}>⚡</div>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:22, fontWeight:800, background:'linear-gradient(135deg,#c4b5fd,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FlowDesk</div>
        </div>

        <h2 style={{ fontSize:26, marginBottom:6, fontFamily:'Outfit,sans-serif' }}>Welcome back</h2>
        <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>Sign in or create an account to continue</p>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:4, marginBottom:24 }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{
              flex:1, padding:'8px', border:'none', cursor:'pointer',
              fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, fontWeight:600,
              borderRadius:10, transition:'all 0.25s',
              background: tab===t ? 'rgba(167,139,250,0.20)' : 'transparent',
              color: tab===t ? '#c4b5fd' : 'var(--muted)',
              boxShadow: tab===t ? '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.10)' : 'none',
              border: tab===t ? '1px solid rgba(167,139,250,0.25)' : '1px solid transparent',
            }}>{t === 'login' ? 'Sign In' : 'Register'}</button>
          ))}
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <div className="animate-fadeUp">
            <FormInput label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <FormInput label="Password" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <div className="animate-fadeUp">
            <FormInput label="Username" type="text" placeholder="johndoe" value={regUsername} onChange={e=>setRegUsername(e.target.value)} />
            <FormInput label="Email" type="email" placeholder="you@example.com" value={regEmail} onChange={e=>setRegEmail(e.target.value)} />
            <FormInput label="Password" type="password" placeholder="••••••••" value={regPassword} onChange={e=>setRegPassword(e.target.value)} />
            <FormInput label="Role" as="select" value={regRole} onChange={e=>setRegRole(e.target.value)}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </FormInput>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background:'rgba(244,114,182,0.10)', border:'1px solid rgba(244,114,182,0.25)', color:'#fbcfe8', borderRadius:10, padding:'10px 14px', fontSize:13, marginBottom:12 }}>
            {error}
          </div>
        )}

        <Button
          variant="primary" loading={loading}
          onClick={tab === 'login' ? handleLogin : handleRegister}
          style={{ marginTop: 8 }}
        >
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </div>
    </div>
  )
}
