export function exportShiftReport({ transactions, shift, rates }) {
  const profitTxs = transactions.filter(
    (tx) => tx.shift === shift && tx.type === "exchange"
  );
  const profit = profitTxs.reduce((sum, tx) => {
    const toRub = (rates[tx.to_currency]?.RUB || 0) * (tx.to_amount || 0);
    const fromRub = (rates[tx.from_currency]?.RUB || 0) * (tx.from_amount || 0);
    return sum + (toRub - fromRub);
  }, 0);

  // Количество заявок — это количество profitTxs (обменов за смену)
  const requestsCount = profitTxs.length;

  const expenses = transactions.filter(
    (tx) =>
      tx.shift === shift &&
      (tx.type === "expense" || tx.type === "adjustment")
  );

  let txt = `Смена: ${shift}
Дата: ${new Date().toLocaleString()}

1. Прибыль: ${(profit > 0 ? "+" : "") + profit.toFixed(2)} RUB
2. Количество заявок: ${requestsCount}

3. Расходы и корректировки:
`;

  if (expenses.length) {
    txt += expenses
      .map((e) => {
        const val = e.from_amount || e.to_amount || 0;
        const cur = e.from_currency || e.to_currency || "";
        const rub = (rates[cur]?.CNY || 0) * val;
        return `  ${val} ${cur} (RUB ${rub.toFixed(2)})  — ${e.comment || ""}`;
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