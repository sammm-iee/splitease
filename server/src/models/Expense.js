const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min : 0
        },
        paidBy: {
            type: String,
            required: true
            },
            splitAmong: [
                {
                    type: String
                }
            ]
        },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Expense', ExpenseSchema)