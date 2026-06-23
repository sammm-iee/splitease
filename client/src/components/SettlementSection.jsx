import { useState, useEffect } from 'react'
import api from '../api/axios'

function SettlementSection({ groupId, expenses }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // re-fetch settlements whenever expenses change
  useEffect(() => {
    fetchSettlements()
  }, [expenses])

  const fetchSettlements = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/groups/${groupId}/settlements`)
      setTransactions(res.data.transactions)
    } catch (err) {
      setError('Failed to calculate settlements')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.card}>
        <p style={styles.empty}>Calculating...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.card}>
        <p style={styles.errorText}>{error}</p>
      </div>
    )
  }

  // no expenses added yet
  if (expenses.length === 0) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Settle Up</h2>
        <div style={styles.emptyState}>
          <p style={styles.emptyEmoji}>🧾</p>
          <p style={styles.emptyText}>No expenses yet</p>
          <p style={styles.emptySubtext}>
            Add expenses in the Expenses tab to see who owes what
          </p>
        </div>
      </div>
    )
  }

  // everyone is settled
  if (transactions.length === 0) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Settle Up</h2>
        <div style={styles.emptyState}>
          <p style={styles.emptyEmoji}>🎉</p>
          <p style={styles.emptyText}>All settled!</p>
          <p style={styles.emptySubtext}>
            Everyone is even — no payments needed
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Settle Up</h2>
        <span style={styles.badge}>
          {transactions.length} payment{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <p style={styles.hint}>
        Minimum transactions to settle all debts
      </p>

      <div style={styles.transactionList}>
        {transactions.map((t, index) => (
          <div key={index} style={styles.transactionCard}>
            {/* From */}
            <div style={styles.person}>
              <div style={{ ...styles.avatar, background: '#fee2e2' }}>
                <span style={{ color: '#e53e3e' }}>
                  {t.from.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={styles.personName}>{t.from}</span>
            </div>

            {/* Arrow + amount */}
            <div style={styles.middle}>
              <p style={styles.amount}>₹{t.amount}</p>
              <div style={styles.arrow}>→</div>
            </div>

            {/* To */}
            <div style={styles.person}>
              <div style={{ ...styles.avatar, background: '#dcfce7' }}>
                <span style={{ color: '#16a34a' }}>
                  {t.to.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={styles.personName}>{t.to}</span>
            </div>
          </div>
        ))}
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  badge: {
    background: '#ede9fe',
    color: '#4f46e5',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 10px',
    borderRadius: '20px',
  },
  hint: {
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '20px',
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transactionCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '10px',
    background: '#fafafa',
    border: '1px solid #f0f0f0',
  },
  person: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    width: '80px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
  },
  personName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  middle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
  },
  amount: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  arrow: {
    fontSize: '20px',
    color: '#aaa',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 0',
  },
  emptyEmoji: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px',
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#aaa',
    maxWidth: '220px',
    margin: '0 auto',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    padding: '20px 0',
    fontSize: '14px',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px 0',
  },
}

export default SettlementSection