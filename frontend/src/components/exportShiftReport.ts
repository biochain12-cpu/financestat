export function exportShiftReport({
  transactions,
  shift,
  rates,
}: {
  transactions: any[];
  shift: number;
  rates: { [currency: string]: { RUB: number } };
}) {
  // 1. Прибыль по обменам
  const profitTxs = transactions.filter(
    (tx) => tx.shift === shift && tx.type === "exchange"
  );
  const profit = profitTxs.reduce((sum, tx) => {
    const toRub = (rates[tx.to_currency]?.RUB || 0) * (tx.to_amount || 0);
    const fromRub = (rates[tx.from_currency]?.RUB || 0) * (tx.from_amount || 0);
    return sum + (toRub - fromRub);
  }, 0);

  // 2. Количество обменов с комментарием, начинающимся на "id"
  const exchangesWithId = profitTxs.filter(
    (tx) => (tx.comment || "").trim().toLowerCase().startsWith("id")
  ).length;

  // 3. Расходы и корректировки
  const expenses = transactions.filter(
    (tx) =>
      tx.shift === shift &&
      (tx.type === "expense" || tx.type === "adjustment")
  );

  let txt = `Смена: ${shift}
Дата: ${new Date().toLocaleString()}

1. Прибыль: ${(profit > 0 ? "+" : "") + profit.toFixed(2).replace(".", ",")} RUB
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
        return `  ${sign} ${cur} ${val.toFixed(2).replace(".", ",")} (${rub.toFixed(2).replace(".", ",")} RUB) — ${e.comment || ""}`;
      })
      .join("\n");
  } else {
    txt += "  нет";
  }

  // --- Скачка TXT-отчёта ---
  const blob = new Blob([txt], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `shift_${shift}_report.txt`;
  a.click();

  // --- Скачка CSV с курсами ---
  // Включаем все основные фиатные и всю крипту, которые есть в rates
  const lines = [];
  lines.push("Валюта;Курс к RUB");
  Object.entries(rates).forEach(([cur, val]) => {
    if (val && typeof val.RUB === "number") {
      // Заменяем точку на запятую
      lines.push(`${cur};${val.RUB.toFixed(6).replace(".", ",")}`);
    }
  });
  const blob2 = new Blob([lines.join("\n")], { type: "text/csv" });
  const a2 = document.createElement("a");
  a2.href = URL.createObjectURL(blob2);
  a2.download = `shift_${shift}_rates.csv`;
  a2.click();
}