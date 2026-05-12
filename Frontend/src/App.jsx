import { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { api } from './api'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import { ProjectsPage, TasksPage, UsersPage, WorkflowPage } from './pages/Pages'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Modal, FormInput } from './components/UI'
import Button from './components/Button'

function AppContent() {
  const { user, token } = useAuth()
  const toast = useToast()

  const [page,       setPage]       = useState('dashboard')
  const [projects,   setProjects]   = useState([])
  const [tasks,      setTasks]      = useState([])
  const [allUsers,   setAllUsers]   = useState([])

  // Update status modal
  const [updateModal, setUpdateModal] = useState(false)
  const [updateTask,  setUpdateTask]  = useState(null)
  const [newStatus,   setNewStatus]   = useState('')
  const [updating,    setUpdating]    = useState(false)

  const isAdmin = user?.role === 'ADMIN'

  const loadAll = useCallback(async () => {
    if (!token) return
    try { setProjects(await api('GET', '/projects', null, token)) } catch { setProjects([]) }
    try {
      setTasks(await api('GET', isAdmin ? '/tasks/all' : '/tasks/my-tasks', null, token))
    } catch { setTasks([]) }
    if (isAdmin) {
      try { setAllUsers(await api('GET', '/tasks/users-list', null, token)) } catch { setAllUsers([]) }
    }
  }, [token, isAdmin])

  useEffect(() => { if (token) loadAll() }, [loadAll, token])

  function openUpdateStatus(task) {
    if (task.status === 'DONE') { toast('This task is already completed.', 'info'); return }
    setUpdateTask(task)
    const transitions = { TO_DO: 'IN_PROGRESS', IN_PROGRESS: 'DONE' }
    setNewStatus(transitions[task.status] || '')
    setUpdateModal(true)
  }

  async function handleUpdateStatus() {
    if (!newStatus) return
    setUpdating(true)
    try {
      await api('PUT', `/tasks/${updateTask.id}/status`, { status: newStatus }, token)
      toast('Task status updated!', 'success')
      setUpdateModal(false)
      await loadAll()
    } catch (e) { toast(e.message, 'error') }
    finally { setUpdating(false) }
  }

  if (!token || !user) return <AuthPage />

  const counts = { projects: projects.length, tasks: tasks.length }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
      <Navbar />
      <div style={{ display:'flex', flex:1 }}>
        <Sidebar activePage={page} onNavigate={setPage} counts={counts} />
        <main style={{ flex:1, padding:32, overflowY:'auto', minHeight:'calc(100vh - 68px)', position:'relative', zIndex:1 }}>
          {page === 'dashboard' && (
            <Dashboard projects={projects} tasks={tasks} onUpdateStatus={openUpdateStatus} />
          )}
          {page === 'projects' && (
            <ProjectsPage projects={projects} tasks={tasks} allUsers={allUsers} token={token} onRefresh={loadAll} />
          )}
          {page === 'tasks' && (
            <TasksPage tasks={tasks} projects={projects} onUpdateStatus={openUpdateStatus} />
          )}
          {page === 'users' && isAdmin && (
            <UsersPage users={allUsers} tasks={tasks} />
          )}
          {page === 'workflow' && isAdmin && (
            <WorkflowPage tasks={tasks} projects={projects} allUsers={allUsers} token={token} onRefresh={loadAll} onUpdateStatus={openUpdateStatus} />
          )}
        </main>
      </div>

      {/* Update Status Modal */}
      <Modal open={updateModal} onClose={() => setUpdateModal(false)} title="Update Task Status"
        footer={<>
          <Button variant="ghost" onClick={() => setUpdateModal(false)} style={{width:'auto'}}>Cancel</Button>
          <Button variant="primary" loading={updating} onClick={handleUpdateStatus} style={{width:'auto'}}>Update</Button>
        </>}
      >
        {updateTask && (
          <p style={{ color:'var(--muted)', fontSize:14, marginBottom:16 }}>"{updateTask.title}"</p>
        )}
        <FormInput label="New Status" as="select" value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
          {updateTask?.status === 'TO_DO'       && <option value="IN_PROGRESS">In Progress</option>}
          {updateTask?.status === 'IN_PROGRESS'  && <option value="DONE">Done</option>}
        </FormInput>
      </Modal>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}
