import { useAuth } from '../context/AuthContext'
import { StatCard, GlassCard, StatusBadge, EmptyState } from '../components/UI'
import Button from '../components/Button'

export default function Dashboard({ projects, tasks, onUpdateStatus }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const done   = tasks.filter(t => t.status === 'DONE').length
  const inprog = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo   = tasks.filter(t => t.status === 'TO_DO').length

  function getProjectName(id) {
    const p = projects.find(p => p.id === id)
    return p ? p.name : `#${id}`
  }

  function actionBtn(task) {
    if (task.status === 'DONE') return <span style={{ color:'var(--muted)', fontSize:13 }}>Completed</span>
    return (
      <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(task)}>
        {task.status === 'TO_DO' ? 'Start' : 'Mark Done'}
      </Button>
    )
  }

  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize:28, fontWeight:800, fontFamily:'Outfit,sans-serif', marginBottom:4, background:'linear-gradient(135deg,#f0eeff 0%,#c4b5fd 60%,#f9a8d4 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 2px 8px rgba(167,139,250,0.2))' }}>Dashboard</h1>
        <p style={{ color:'var(--muted)', fontSize:14 }}>Your overview at a glance</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:32 }}>
        <StatCard icon="📁" value={projects.length} label="Projects"   color="accent" delay={0} />
        <StatCard icon="✅" value={done}             label="Tasks Done"  color="green"  delay={0.05} />
        <StatCard icon="⚡" value={inprog}           label="In Progress" color="amber"  delay={0.1} />
        <StatCard icon="🎯" value={todo}             label="To Do"       color="red"    delay={0.15} />
      </div>

      {/* Recent Tasks */}
      <GlassCard>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily:'Outfit,sans-serif', fontSize:15, fontWeight:700, background:'linear-gradient(90deg,#f0eeff,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Recent Tasks</span>
        </div>
        {!tasks.length ? (
          <EmptyState icon="📭" title="No tasks yet" sub="Tasks assigned to you will appear here" />
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Title','Status','Project', isAdmin && 'Assigned To','Action'].filter(Boolean).map(h => (
                    <th key={h} style={{ textAlign:'left', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--muted)', padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0,8).map(t => (
                  <tr key={t.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', transition:'background 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(167,139,250,0.07)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'14px', fontWeight:600, fontSize:14 }}>
                      <div>{t.title}</div>
                      {t.description && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{t.description}</div>}
                    </td>
                    <td style={{ padding:'14px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding:'14px', fontSize:13, color:'var(--muted)' }}>{getProjectName(t.project_id)}</td>
                    {isAdmin && <td style={{ padding:'14px', fontSize:13, color:'var(--muted)' }}>{t.assignee_name || `#${t.assigned_to}`}</td>}
                    <td style={{ padding:'14px' }}>{actionBtn(t)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
