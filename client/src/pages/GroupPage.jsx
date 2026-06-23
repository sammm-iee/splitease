import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import MemberSection from '../components/MemberSection'
import ExpenseSection from '../components/ExpenseSection'

function GroupPage() {
  const { id } = useParams()  // gets the group ID from the URL

  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // fetch group data when page loads
  useEffect(() => {
    fetchGroup()
  }, [id])

  const fetchGroup = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/groups/${id}`)
      setGroup(res.data)
      setExpenses(res.data.expenses || [])
    } catch (err) {
      setError('Group not found. Check the link and try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Loading group...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={{ color: '#e53e3e' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{group.name}</h1>
          <p style={styles.subtitle}>{group.members.length} members · {expenses.length} expenses</p>
        </div>
        <button style={styles.copyButton} onClick={copyLink}>
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
      </div>

      {/* Main content */}
      <div style={styles.grid}>
        <MemberSection
          groupId={id}
          members={group.members}
          onMemberAdded={fetchGroup}
        />
        <ExpenseSection
          groupId={id}
          members={group.members}
          expenses={expenses}
          onExpenseChanged={fetchGroup}
        />
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  centered: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginTop: '4px',
  },
  copyButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    background: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
    alignItems: 'start',
  },
}

export default GroupPage