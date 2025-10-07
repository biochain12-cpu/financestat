import { currencies } from "./currencies";

const rubWallets = [
  "RUB", "SBER", "Tinkoff", "SBP", "ЮMoney", "AlfaBank", "Mir", "Ozon", "VTB",
  "VoletRUB", "PayeerRUB", "CapitalistRUB", "VisaRUB"
];
const usdWallets = [
  "USD", "VoletUSD", "PayeerUSD", "CapitalistUSD", "MoneyGoUSD", "USDT", "VisaUSD"
];
const eurWallets = [
  "EUR", "VoletEUR", "PayeerEUR", "CapitalistEUR"
];
const kztWallets = ["KZT", "Kaspi", "Jusan", "VisaKZT"];
const cnyWallets = ["CNY", "AlipayCNY", "WeChatCNY"];
const tryWallets = ["TRY", "VisaTRY"];

// АКТУАЛЬНЫЕ дефолты (на октябрь 2025)
const DEFAULT_KZT_RUB = 0.15;
const DEFAULT_TRY_RUB = 2.0;

export function applyCustomRates(rawRates: any) {
  const result: any = { ...rawRates };

  currencies.forEach(cur => {
    if (rubWallets.includes(cur.code)) {
      result[cur.code] = { RUB: 1 };
    } else if (usdWallets.includes(cur.code)) {
      result[cur.code] = { USD: 1, RUB: rawRates.USD?.RUB || 0 };
    } else if (eurWallets.includes(cur.code)) {
      result[cur.code] = { EUR: 1, RUB: rawRates.EUR?.RUB || 0 };
    } else if (kztWallets.includes(cur.code)) {
      // Если курса нет или он 0 — дефолт 0.15
      const rub = (rawRates.KZT?.RUB !== undefined && rawRates.KZT?.RUB !== 0)
        ? rawRates.KZT.RUB
        : DEFAULT_KZT_RUB;
      result[cur.code] = { KZT: 1, RUB: rub };
    } else if (cnyWallets.includes(cur.code)) {
      result[cur.code] = { CNY: 1, RUB: rawRates.CNY?.RUB || 0 };
    } else if (tryWallets.includes(cur.code)) {
      // Если курса нет или он 0 — дефолт 2.0
      const rub = (rawRates.TRY?.RUB !== undefined && rawRates.TRY?.RUB !== 0)
        ? rawRates.TRY.RUB
        : DEFAULT_TRY_RUB;
      result[cur.code] = { TRY: 1, RUB: rub };
    }
    // Крипта и остальные — по реальному курсу (уже есть в rawRates)
  });

  return result;
}