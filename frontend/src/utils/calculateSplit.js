
export function calculateSplit(expenses, memberIds) {
  if (!memberIds.length) return [];

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonShare = totalSpent / memberIds.length;

  const paidByMember = {};
  memberIds.forEach((id) => (paidByMember[id] = 0));
  expenses.forEach((e) => {
    if (paidByMember[e.paidBy] !== undefined) {
      paidByMember[e.paidBy] += e.amount;
    }
  });

  return memberIds.map((userId) => ({
    userId,
    totalPaid: paidByMember[userId] ?? 0,
    share: perPersonShare,
    balance: (paidByMember[userId] ?? 0) - perPersonShare,
  }));
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
