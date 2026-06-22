import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Home() {
  const navigate = useNavigate()

  // state for creating a group
  const [groupName, setGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  // state for joining a group
  const [joinId, setJoinId] = useState('')
  const [joinError, setJoinError] = useState('')

  // create a new group and navigate to its page
  const handleCreate = async () => {
    if (!groupName.trim()) {
      setCreateError('Please enter a group name')
      return
    }

    try {
      setCreating(true)
      setCreateError('')
      const res = await api.post('/groups', { name: groupName })
      navigate(`/group/${res.data._id}`)  // go to the group page immediately
    } catch (err) {
      setCreateError('Failed to create group. Is your server running?')
    } finally {
      setCreating(false)
    }
  }

  // join existing group by ID
  const handleJoin = async () => {
    if (!joinId.trim()) {
      setJoinError('Please enter a group ID')
      return
    }

    try {
      // verify the group exists before navigating
      await api.get(`/groups/${joinId.trim()}`)
      navigate(`/group/${joinId.trim()}`)
    } catch (err) {
      setJoinError('Group not found. Check the ID and try again.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SplitEase</h1>
        <p style={styles.subtitle}>Split expenses with friends, simplified</p>

        {/* Create group section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Create a group</h2>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Goa Trip, Flat expenses"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          {createError && <p style={styles.error}>{createError}</p>}
          <button
            style={styles.primaryButton}
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        {/* Join group section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Join existing group</h2>
          <input
            style={styles.input}
            type="text"
            placeholder="Paste group ID here"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          {joinError && <p style={styles.error}>{joinError}</p>}
          <button
            style={styles.secondaryButton}
            onClick={handleJoin}
          >
            Join Group
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#888',
    marginBottom: '32px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  primaryButton: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: '12px',
    borderRadius: '8px',
    border: '1.5px solid #4f46e5',
    background: 'white',
    color: '#4f46e5',
    fontSize: '15px',
    fontWeight: '600',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '12px',
  },
  dividerText: {
    color: '#aaa',
    fontSize: '14px',
    flexShrink: 0,
  },
  error: {
    color: '#e53e3e',
    fontSize: '13px',
  },
}

export default Home