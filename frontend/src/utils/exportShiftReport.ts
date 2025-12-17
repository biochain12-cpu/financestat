export function exportShiftReport({
  transactions,
  shift,
  rates,
}: {
  transactions: any[];
  shift: number;
  rates: any;
}) {
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
        // Определяем валюту: если from_currency не RUB, берем её, иначе to_currency
        let cur = e.from_currency && e.from_currency !== "RUB"
          ? e.from_currency
          : (e.to_currency && e.to_currency !== "RUB" ? e.to_currency : e.from_currency || e.to_currency || "");
        const val = e.from_amount || e.to_amount || 0;
        const rub = (rates[cur]?.RUB || 0) * val;
        return `${rub.toFixed(2)} RUB (${val} ${cur}) — ${e.comment || ""}`;
      })
      .join("\n");
  } else {
    txt += "нет";
  }

  // Скачка TXT
  const blob = new Blob([txt], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `shift_${shift}_report.txt`;
  a.click();
}