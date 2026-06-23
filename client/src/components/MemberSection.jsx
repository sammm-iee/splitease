import { useState } from 'react'
import api from '../api/axios'

function MemberSection({ groupId, members, onMemberAdded }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('Enter a name')
      return
    }

    try {
      setLoading(true)
      setError('')
      await api.post(`/groups/${groupId}/members`, { name: name.trim() })
      setName('')
      onMemberAdded()  // tells GroupPage to re-fetch so UI updates
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Members</h2>

      {/* Member list */}
      <div style={styles.memberList}>
        {members.length === 0 && (
          <p style={styles.empty}>No members yet</p>
        )}
        {members.map((member) => (
          <div key={member._id} style={styles.memberItem}>
            <div style={styles.avatar}>
              {member.name.charAt(0).toUpperCase()}
            </div>
            <span style={styles.memberName}>{member.name}</span>
          </div>
        ))}
      </div>

      {/* Add member */}
      <div style={styles.addSection}>
        <input
          style={styles.input}
          type="text"
          placeholder="Member name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button
          style={styles.button}
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? 'Adding...' : '+ Add Member'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a',
  },
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#4f46e5',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    flexShrink: 0,
  },
  memberName: {
    fontSize: '14px',
    color: '#333',
  },
  empty: {
    fontSize: '13px',
    color: '#aaa',
  },
  addSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
  },
  error: {
    color: '#e53e3e',
    fontSize: '12px',
  },
}

export default MemberSection