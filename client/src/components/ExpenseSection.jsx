import { useState } from 'react'
import api from '../api/axios'

function ExpenseSection({ groupId, members, expenses, onExpenseChanged }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitAmong: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.paidBy || form.splitAmong.length === 0) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      setError('')
      await api.post(`/groups/${groupId}/expenses`, {
        description: form.description,
        amount: parseFloat(form.amount),
        paidBy: form.paidBy,
        splitAmong: form.splitAmong,
      })
      setForm({ description: '', amount: '', paidBy: '', splitAmong: [] })
      setShowForm(false)
      onExpenseChanged()  // re-fetch group data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`)
      onExpenseChanged()
    } catch (err) {
      alert('Failed to delete expense')
    }
  }

  const toggleSplitMember = (memberName) => {
    setForm((prev) => ({
      ...prev,
      splitAmong: prev.splitAmong.includes(memberName)
        ? prev.splitAmong.filter((m) => m !== memberName)
        : [...prev.splitAmong, memberName],
    }))
  }

  const selectAllMembers = () => {
    setForm((prev) => ({
      ...prev,
      splitAmong: members.map((m) => m.name),
    }))
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Expenses</h2>
        <button
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Add expense form */}
      {showForm && (
        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Description (e.g. Hotel booking)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          {/* Paid by dropdown */}
          <select
            style={styles.input}
            value={form.paidBy}
            onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
          >
            <option value="">Who paid?</option>
            {members.map((m) => (
              <option key={m._id} value={m.name}>{m.name}</option>
            ))}
          </select>

          {/* Split among checkboxes */}
          <div style={styles.splitSection}>
            <div style={styles.splitHeader}>
              <span style={styles.splitLabel}>Split among</span>
              <button style={styles.selectAllBtn} onClick={selectAllMembers}>
                Select all
              </button>
            </div>
            <div style={styles.checkboxGrid}>
              {members.map((m) => (
                <label key={m._id} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.splitAmong.includes(m.name)}
                    onChange={() => toggleSplitMember(m.name)}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      )}

      {/* Expense list */}
      <div style={styles.expenseList}>
        {expenses.length === 0 && (
          <p style={styles.empty}>No expenses yet. Add one above!</p>
        )}
        {expenses.map((expense) => (
          <div key={expense._id} style={styles.expenseItem}>
            <div style={styles.expenseLeft}>
              <p style={styles.expenseDesc}>{expense.description}</p>
              <p style={styles.expenseMeta}>
                Paid by <strong>{expense.paidBy}</strong> · Split among {expense.splitAmong.join(', ')}
              </p>
            </div>
            <div style={styles.expenseRight}>
              <p style={styles.expenseAmount}>₹{expense.amount}</p>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(expense._id)}
              >
                ✕
              </button>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
    background: 'white',
  },
  splitSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  splitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#555',
  },
  selectAllBtn: {
    fontSize: '12px',
    color: '#4f46e5',
    background: 'none',
    border: 'none',
    fontWeight: '500',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#333',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
  },
  expenseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  expenseLeft: {
    flex: 1,
  },
  expenseDesc: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  expenseMeta: {
    fontSize: '12px',
    color: '#888',
  },
  expenseRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  expenseAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4f46e5',
  },
  deleteButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #e0e0e0',
    background: 'white',
    color: '#888',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontSize: '13px',
    color: '#aaa',
    textAlign: 'center',
    padding: '20px 0',
  },
  error: {
    color: '#e53e3e',
    fontSize: '12px',
  },
}

export default ExpenseSection