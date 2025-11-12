import { currencies } from "../utils/currencies";

export function exportShiftReport({
  transactions,
  shift,
  rates,
  balances = {},
}: {
  transactions: any[];
  shift: number;
  rates: { [currency: string]: { RUB: number } };
  balances?: { [currency: string]: number };
}) {
  // 1. Прибыль по обменам (только за текущую смену)
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

  // 3. Расходы и корректировки (только за текущую смену)
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
        // Если валюта не RUB, показываем RUB и исходную валюту в скобках
        if (cur !== "RUB" && rates[cur]?.RUB) {
          return `  ${sign} ${rub.toFixed(2).replace(".", ",")} RUB (≈${val.toFixed(2).replace(".", ",")} ${cur})`;
        } else {
          return `  ${sign} ${val.toFixed(2).replace(".", ",")} RUB`;
        }
      })
      .join("\n");
  } else {
    txt += "  нет";
  }

  // 4. Балансы на конец смены по всем валютам
  txt += "\n\nБалансы на конец смены:\n";
  const allCurrencyCodes = currencies
    ? currencies.map(c => c.code)
    : Object.keys(rates);

  allCurrencyCodes.forEach(code => {
    const value = balances[code] ?? 0;
    txt += `  ${code}: ${value.toFixed(2).replace(".", ",")}\n`;
  });

  // --- Скачка TXT-отчёта ---
  const blob = new Blob([txt], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `shift_${shift}_report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // --- Скачка CSV с курсами ---
  const lines = [];
  lines.push("Валюта;Курс");
  Object.entries(rates).forEach(([cur, val]: any) => {
    if (val && typeof val.RUB === "number") {
      lines.push(`${cur};${String(val.RUB).replace(".", ",")}`);
    }
  });
  const blob2 = new Blob([lines.join("\n")], { type: "text/csv" });
  const a2 = document.createElement("a");
  a2.href = URL.createObjectURL(blob2);
  a2.download = `shift_${shift}_rates.csv`;
  document.body.appendChild(a2);
  setTimeout(() => {
    a2.click();
    document.body.removeChild(a2);
  }, 100);
}
