import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { api } from '../api'
import Button from '../components/Button'
import { GlassCard, Badge, StatusBadge, PriorityBadge, EmptyState, ProgressBar, FormInput, Modal } from '../components/UI'

// ===== PROJECTS PAGE =====
export function ProjectsPage({ projects, tasks, allUsers, token, onRefresh }) {
  const { user } = useAuth()
  const toast = useToast()
  const isAdmin = user?.role === 'ADMIN'

  const [showCreate, setShowCreate] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [assignProjectId, setAssignProjectId] = useState(null)
  const [projMembers, setProjMembers] = useState([])
  const [projName, setProjName] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [loading, setLoading] = useState(false)

  async function createProject() {
    if (!projName.trim()) return toast('Project name is required', 'error')
    setLoading(true)
    try {
      await api('POST', '/projects', { name: projName, description: projDesc }, token)
      toast('Project created!', 'success')
      setShowCreate(false); setProjName(''); setProjDesc('')
      onRefresh()
    } catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  async function openAssign(projectId) {
    setAssignProjectId(projectId); setAssignUserId(''); setShowAssign(true)
    try {
      const members = await api('GET', `/projects/${projectId}/members`, null, token)
      setProjMembers(members)
    } catch { setProjMembers([]) }
  }

  async function assignUser() {
    if (!assignUserId) return toast('Select a user', 'error')
    setLoading(true)
    try {
      await api('POST', `/projects/${assignProjectId}/assign`, { user_id: parseInt(assignUserId) }, token)
      toast('User assigned!', 'success')
      setShowAssign(false); onRefresh()
    } catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  const assignedIds = projMembers.map(m => m.id)
  const unassigned = allUsers.filter(u => !assignedIds.includes(u.id))

  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:800, fontFamily:'Outfit,sans-serif', marginBottom:4, background:'linear-gradient(135deg,#f0eeff,#c4b5fd 60%,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Projects</h1>
        <p style={{ color:'var(--muted)', fontSize:14 }}>All projects you're part of</p>
      </div>

      {isAdmin && (
        <div style={{ marginBottom:20 }}>
          <Button variant="primary" onClick={() => setShowCreate(true)} style={{ width:'auto', padding:'12px 24px' }}>+ New Project</Button>
        </div>
      )}

      {!projects.length ? (
        <EmptyState icon="📂" title="No projects found" sub="Projects you're part of will appear here" />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {projects.map((p, i) => {
            const projTasks = tasks.filter(t => t.project_id === p.id)
            const donePct = projTasks.length ? Math.round(projTasks.filter(t=>t.status==='DONE').length / projTasks.length * 100) : 0
            return (
              <div key={p.id} className="animate-fadeUp" style={{
                background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.10)', borderRadius:20, padding:24,
                transition:'all 0.35s cubic-bezier(0.34,1.3,0.64,1)',
                position:'relative', overflow:'hidden',
                boxShadow:'0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                animationDelay:`${i*0.07}s`,
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(167,139,250,0.30)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(167,139,250,0.15)' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' }}
              >
                {/* Left accent bar */}
                <div style={{ position:'absolute',top:0,left:0,bottom:0,width:3, background:'linear-gradient(to bottom,#a78bfa,#f472b6)' }} />
                <div style={{ position:'absolute',inset:0, background:'radial-gradient(circle at top right,rgba(167,139,250,0.08) 0%,transparent 50%)', pointerEvents:'none' }} />

                <div style={{ paddingLeft:12 }}>
                  <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{p.name}</div>
                  <div style={{ color:'var(--muted)', fontSize:13, marginBottom:14 }}>{p.description || 'No description'}</div>
                  {projTasks.length > 0 && (
                    <div style={{ marginBottom:14 }}>
                      <ProgressBar pct={donePct} />
                      <div style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>{projTasks.length} task{projTasks.length!==1?'s':''} · {projTasks.filter(t=>t.status==='DONE').length} done</div>
                    </div>
                  )}
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <Badge type="todo">Project #{p.id}</Badge>
                    {isAdmin && <Button variant="ghost" size="sm" onClick={() => openAssign(p.id)}>+ Assign User</Button>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Project"
        footer={<>
          <Button variant="ghost" onClick={() => setShowCreate(false)} style={{width:'auto'}}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={createProject} style={{width:'auto'}}>Create</Button>
        </>}
      >
        <FormInput label="Project Name *" type="text" placeholder="e.g. Website Redesign" value={projName} onChange={e=>setProjName(e.target.value)} />
        <FormInput label="Description" as="textarea" rows={3} placeholder="Brief description..." value={projDesc} onChange={e=>setProjDesc(e.target.value)} />
      </Modal>

      {/* Assign User Modal */}
      <Modal open={showAssign} onClose={() => setShowAssign(false)} title="Assign User to Project"
        footer={<>
          <Button variant="ghost" onClick={() => setShowAssign(false)} style={{width:'auto'}}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={assignUser} style={{width:'auto'}}>Assign</Button>
        </>}
      >
        {projMembers.length > 0 && (
          <div style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.20)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#c4b5fd', marginBottom:16 }}>
            Already assigned: {projMembers.map(m=>m.username).join(', ')}
          </div>
        )}
        <FormInput label="Select User" as="select" value={assignUserId} onChange={e=>setAssignUserId(e.target.value)}>
          <option value="">Select user to assign</option>
          {unassigned.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
        </FormInput>
      </Modal>
    </div>
  )
}

// ===== TASKS PAGE =====
export function TasksPage({ tasks, projects, onUpdateStatus }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  function getProjectName(id) { const p = projects.find(p=>p.id===id); return p?p.name:`#${id}` }

  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:800, fontFamily:'Outfit,sans-serif', marginBottom:4, background:'linear-gradient(135deg,#f0eeff,#c4b5fd 60%,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          {isAdmin ? 'All Tasks' : 'My Tasks'}
        </h1>
        <p style={{ color:'var(--muted)', fontSize:14 }}>{isAdmin ? 'All tasks across all projects' : 'Tasks assigned to you'}</p>
      </div>

      <GlassCard>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily:'Outfit,sans-serif', fontSize:15, fontWeight:700, background:'linear-gradient(90deg,#f0eeff,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {isAdmin ? 'Complete Task Overview' : 'All Assigned Tasks'}
          </span>
        </div>
        {!tasks.length ? (
          <EmptyState icon="🎯" title="No tasks found" sub="Tasks will appear here" />
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Task','Status','Priority','Project', isAdmin&&'Assigned To','Due Date','Action'].filter(Boolean).map(h=>(
                    <th key={h} style={{ textAlign:'left', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--muted)', padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(167,139,250,0.07)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'14px' }}>
                      <div style={{ fontWeight:600 }}>{t.title}</div>
                      {t.description && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{t.description}</div>}
                    </td>
                    <td style={{ padding:'14px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding:'14px' }}><PriorityBadge priority={t.priority||'MEDIUM'} /></td>
                    <td style={{ padding:'14px', fontSize:13, color:'var(--muted)' }}>{getProjectName(t.project_id)}</td>
                    {isAdmin && <td style={{ padding:'14px', fontSize:13, color:'var(--muted)' }}>{t.assignee_name||`#${t.assigned_to}`}</td>}
                    <td style={{ padding:'14px', fontSize:13, color:'var(--muted)' }}>{t.due_date||'—'}</td>
                    <td style={{ padding:'14px' }}>
                      {t.status==='DONE'
                        ? <span style={{ color:'var(--muted)', fontSize:13 }}>Completed</span>
                        : <Button variant="ghost" size="sm" onClick={()=>onUpdateStatus(t)}>{t.status==='TO_DO'?'Start':'Mark Done'}</Button>
                      }
                    </td>
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

// ===== USERS PAGE =====
export function UsersPage({ users, tasks }) {
  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:800, fontFamily:'Outfit,sans-serif', marginBottom:4, background:'linear-gradient(135deg,#f0eeff,#c4b5fd 60%,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Users</h1>
        <p style={{ color:'var(--muted)', fontSize:14 }}>All registered users</p>
      </div>
      <GlassCard>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily:'Outfit,sans-serif', fontSize:15, fontWeight:700, background:'linear-gradient(90deg,#f0eeff,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>User Directory</span>
        </div>
        {!users.length ? (
          <EmptyState icon="👥" title="No users found" sub="Registered users will appear here" />
        ) : users.map((u,i) => {
          const userTasks = tasks.filter(t=>t.assigned_to===u.id)
          const active = userTasks.filter(t=>t.status!=='DONE').length
          const done   = userTasks.filter(t=>t.status==='DONE').length
          return (
            <div key={u.id} className="animate-fadeUp" style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
              borderBottom:'1px solid rgba(255,255,255,0.06)',
              transition:'all 0.2s', animationDelay:`${i*0.05}s`,
              position:'relative', overflow:'hidden',
            }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(167,139,250,0.07)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{
                width:36, height:36, borderRadius:'50%',
                background:`linear-gradient(135deg,${u.role==='ADMIN'?'#ef4444,#fca5a5':'#5b6af0,#7c8bff'})`,
                display:'grid', placeItems:'center', fontSize:14, fontWeight:700, flexShrink:0,
                boxShadow:'0 2px 10px rgba(167,139,250,0.3)',
              }}>
                {(u.username||'U')[0].toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{u.username}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{u.email}</div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginLeft:'auto' }}>
                {active>0 && <Badge type="inprog">{active} active</Badge>}
                {done>0   && <Badge type="done">{done} done</Badge>}
                <Badge type={u.role==='ADMIN'?'admin':'user'}>{u.role}</Badge>
              </div>
            </div>
          )
        })}
      </GlassCard>
    </div>
  )
}

// ===== WORKFLOW BOARD PAGE =====
export function WorkflowPage({ tasks, projects, allUsers, token, onRefresh, onUpdateStatus }) {
  const toast = useToast()
  const [filterProject, setFilterProject] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [taskTitle, setTaskTitle]   = useState('')
  const [taskDesc, setTaskDesc]     = useState('')
  const [taskProject, setTaskProject] = useState('')
  const [taskUser, setTaskUser]     = useState('')
  const [taskPriority, setTaskPriority] = useState('MEDIUM')
  const [taskDue, setTaskDue]       = useState('')
  const [projectMembers, setProjectMembers] = useState([])
  const [loading, setLoading]       = useState(false)
  const { token: authToken } = useAuth()
  const tkn = token || authToken

  async function loadMembers(projectId) {
    setTaskUser(''); setProjectMembers([])
    if (!projectId) return
    try {
      const members = await api('GET', `/projects/${projectId}/members`, null, tkn)
      setProjectMembers(members)
    } catch { toast('Could not load members', 'error') }
  }

  async function createTask() {
    if (!taskTitle || !taskProject || !taskUser) return toast('Fill in all required fields', 'error')
    setLoading(true)
    try {
      await api('POST', '/tasks', { title:taskTitle, description:taskDesc, project_id:parseInt(taskProject), assigned_to:parseInt(taskUser), priority:taskPriority, due_date:taskDue||null }, tkn)
      toast('Task created!', 'success')
      setShowCreate(false); setTaskTitle(''); setTaskDesc(''); setTaskProject(''); setTaskUser('')
      onRefresh()
    } catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  const filtered = filterProject ? tasks.filter(t=>String(t.project_id)===filterProject) : tasks
  const cols = [
    { status:'TO_DO',       label:'To Do',       dot:'#818cf8' },
    { status:'IN_PROGRESS', label:'In Progress',  dot:'#fbbf24' },
    { status:'DONE',        label:'Done',         dot:'#34d399' },
  ]

  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:800, fontFamily:'Outfit,sans-serif', marginBottom:4, background:'linear-gradient(135deg,#f0eeff,#c4b5fd 60%,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Workflow Board</h1>
        <p style={{ color:'var(--muted)', fontSize:14 }}>Manage all project tasks and transitions</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <Button variant="primary" onClick={()=>setShowCreate(true)} style={{ width:'auto', padding:'12px 24px' }}>+ Create Task</Button>
        <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} style={{
          padding:'10px 14px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
          borderRadius:14, color:'var(--text)', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14,
          outline:'none', backdropFilter:'blur(8px)', width:200,
        }}>
          <option value="">All Projects</option>
          {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Kanban Board */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {cols.map(col => {
          const colTasks = filtered.filter(t=>t.status===col.status)
          return (
            <div key={col.status} style={{
              background:'rgba(255,255,255,0.04)', backdropFilter:'blur(16px)',
              border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, overflow:'hidden',
              boxShadow:'0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
              transition:'all 0.3s ease',
            }}>
              <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.15)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'Outfit,sans-serif', fontSize:13, fontWeight:700 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:col.dot, boxShadow:`0 0 6px ${col.dot}`, animation:col.status==='TO_DO'?'pulse 2s ease infinite':'none' }} />
                  {col.label}
                </div>
                <span style={{ fontSize:11, fontWeight:700, background:'rgba(0,0,0,0.25)', padding:'2px 8px', borderRadius:10, color:'var(--muted)' }}>{colTasks.length}</span>
              </div>
              <div style={{ padding:12, minHeight:180 }}>
                {colTasks.length ? colTasks.map(t => (
                  <div key={t.id} onClick={()=>onUpdateStatus(t)} style={{
                    background:'rgba(255,255,255,0.05)', backdropFilter:'blur(12px)',
                    border:'1px solid rgba(255,255,255,0.10)', borderRadius:14, padding:'14px 16px',
                    marginBottom:10, cursor:'pointer',
                    transition:'all 0.25s cubic-bezier(0.34,1.3,0.64,1)',
                    position:'relative', overflow:'hidden',
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.background='rgba(167,139,250,0.10)'; e.currentTarget.style.borderColor='rgba(167,139,250,0.30)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)' }}
                    onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
                  >
                    <div style={{ position:'absolute',left:0,top:0,bottom:0,width:3, background:'linear-gradient(to bottom,#a78bfa,#f472b6)', transform:'scaleY(0)', transformOrigin:'top', transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
                      ref={el=>{ if(el) el.closest('[data-card]') }} />
                    <div style={{ fontWeight:600, fontSize:13, marginBottom:8 }}>{t.title}</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                      <PriorityBadge priority={t.priority||'MEDIUM'} />
                      <span style={{ color:'var(--muted)', fontSize:12 }}>{projects.find(p=>p.id===t.project_id)?.name || `#${t.project_id}`}</span>
                    </div>
                    {t.assignee_name && <div style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>👤 {t.assignee_name}</div>}
                  </div>
                )) : (
                  <EmptyState icon="🕳️" title="" sub="No tasks here" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Task Modal */}
      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Create New Task"
        footer={<>
          <Button variant="ghost" onClick={()=>setShowCreate(false)} style={{width:'auto'}}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={createTask} style={{width:'auto'}}>Create Task</Button>
        </>}
      >
        <FormInput label="Title *" type="text" placeholder="Task title" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} />
        <FormInput label="Description" as="textarea" rows={2} placeholder="Details..." value={taskDesc} onChange={e=>setTaskDesc(e.target.value)} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FormInput label="Project *" as="select" value={taskProject} onChange={e=>{ setTaskProject(e.target.value); loadMembers(e.target.value) }}>
            <option value="">Select project</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </FormInput>
          <FormInput label="Assign To *" as="select" value={taskUser} onChange={e=>setTaskUser(e.target.value)}>
            <option value="">Select user</option>
            {projectMembers.map(u=><option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
          </FormInput>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FormInput label="Priority" as="select" value={taskPriority} onChange={e=>setTaskPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </FormInput>
          <FormInput label="Due Date" type="date" value={taskDue} onChange={e=>setTaskDue(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
