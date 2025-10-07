export function exportShiftReport({ transactions, shift, rates }: { transactions: any[]; shift: number; rates: any }) {
  const profitTxs = transactions.filter(
    (tx) => tx.shift === shift && tx.type === "exchange"
  );
  const profit = profitTxs.reduce((sum, tx) => {
    const toRub = (rates[tx.to_currency]?.RUB || 0) * (tx.to_amount || 0);
    const fromRub = (rates[tx.from_currency]?.RUB || 0) * (tx.from_amount || 0);
    return sum + (toRub - fromRub);
  }, 0);

  const exchangesWithId = profitTxs.filter(
    (tx) => (tx.comment || "").trim().toLowerCase().startsWith("id")
  ).length;

  const expenses = transactions.filter(
    (tx) =>
      tx.shift === shift &&
      (tx.type === "expense" || tx.type === "adjustment")
  );

  let txt = `Смена: ${shift}
Дата: ${new Date().toLocaleString()}

1. Прибыль: ${(profit > 0 ? "+" : "") + profit.toFixed(2)} RUB
2. Количество обменов с комментарием, начинающимся на "id": ${exchangesWithId}

3. Расходы и корректировки:
`;

  if (expenses.length) {
    txt += expenses
      .map((e) => {
        const val = e.from_amount || e.to_amount || 0;
        const cur = e.from_currency || e.to_currency || "";
        const rub = (rates[cur]?.RUB || 0) * val;
        const sign = e.type === "expense" ? "-" : "+";
        return `  ${sign} ${cur} ${val} (${rub.toFixed(2)} RUB) — ${e.comment || ""}`;
      })
      .join("\n");
  } else {
    txt += "  нет";
  }

  // Скачка TXT
  const blob = new Blob([txt], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `shift_${shift}_report.txt`;
  a.click();
}