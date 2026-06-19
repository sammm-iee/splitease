const express = require('express')
const router = express.Router()
const Group = require('../models/Group')
const Expense = require('../models/Expense')
const min_Transactions = require('../utils/min_Transactions')

// POST /api/groups — create a new group
router.post('/', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' })
    }

    const group = new Group({ name, members: [] })
    await group.save()

    res.status(201).json(group)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/groups/:id — get group with all its expenses
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    const expenses = await Expense.find({ groupId: req.params.id })

    res.json({ ...group.toObject(), expenses })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/groups/:id/members — add a member to a group
router.post('/:id/members', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Member name is required' })
    }

    const group = await Group.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    // check if member already exists
    const exists = group.members.some(
      (m) => m.name.toLowerCase() === name.toLowerCase()
    )

    if (exists) {
      return res.status(400).json({ error: 'Member already in group' })
    }

    group.members.push({ name })
    await group.save()

    res.status(201).json(group)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/groups/:id/expenses — add an expense
router.post('/:id/expenses', async (req, res) => {
  try {
    const { description, amount, paidBy, splitAmong } = req.body

    if (!description || !amount || !paidBy || !splitAmong?.length) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const group = await Group.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    const expense = new Expense({
      groupId: req.params.id,
      description,
      amount,
      paidBy,
      splitAmong
    })

    await expense.save()

    res.status(201).json(expense)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/groups/:id/expenses/:eid — delete an expense
router.delete('/:id/expenses/:eid', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.eid)

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    // make sure the expense belongs to this group
    if (expense.groupId.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Expense does not belong to this group' })
    }

    await expense.deleteOne()

    res.json({ message: 'Expense deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/groups/:id/settlements — run the algorithm and return who pays whom
router.get('/:id/settlements', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    const expenses = await Expense.find({ groupId: req.params.id })

    if (expenses.length === 0) {
      return res.json({ transactions: [] })
    }

        // ADD THIS LINE TEMPORARILY
    console.log('Members:', JSON.stringify(group.members))
    console.log('Expenses:', JSON.stringify(expenses))

    const transactions = min_Transactions(group.members, expenses)

    res.json({ transactions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router