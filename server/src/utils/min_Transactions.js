function min_Transactions(members , expenses){
    const balances = {}
    members.forEach((member) => {
        balances[member.name] = 0
    })

    expenses.forEach((expense) => {
        const {amount, paidBy, splitAmong } = expense
        const share = amount / splitAmong.length
        
        balances[paidBy] += amount
        splitAmong.forEach((person) => {
            balances[person] -= share
        })
    })

    const creditors = []
    const debtors = []

    Object.entries(balances).forEach(([name, balance]) => {
        if (balance > 0.01) creditors.push({ name, amount: balance })
            if (balance < -0.01) debtors.push({ name, amount: -balance })
    })

    const transactions = []
    while (debtors.length >0 && creditors.length > 0 ){
        debtors.sort((a, b) => b.amount - a.amount)
        creditors.sort((a, b) => b.amount - a.amount)

        const debtor = debtors[0]
        const creditor = creditors[0]

        const transferAmount = Math.min(debtor.amount , creditor.amount)
        transactions.push({
            from: debtor.name ,
            to: creditor.name,
            amount : Math.round(transferAmount * 100) / 100
        })

        debtor.amount -= transferAmount
        creditor.amount -= transferAmount

        if (debtor.amount < 0.01) debtors.shift()
        if (creditor.amount < 0.01) creditors.shift()
    }

    return transactions
}
module.exports = min_Transactions