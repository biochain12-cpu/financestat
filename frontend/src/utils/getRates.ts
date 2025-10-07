async function fetchBackendWiseRates(): Promise<{ KZT: number; TRY: number }> {
  try {
    const res = await fetch("/api/wise-rates");
    if (!res.ok) throw new Error("Wise backend error");
    return await res.json();
  } catch {
    return { KZT: 0, TRY: 0 };
  }
}

export async function getRates() {
  // --- CBR ---
  let usdRub = 0, eurRub = 0, cnyRub = 0;
  try {
    const cbrRes = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    const cbrData = await cbrRes.json();
    usdRub = cbrData.Valute.USD.Value;
    eurRub = cbrData.Valute.EUR.Value;
    cnyRub = cbrData.Valute.CNY ? cbrData.Valute.CNY.Value : 0;
  } catch {
    usdRub = 90; eurRub = 100; cnyRub = 12;
  }

  // --- Wise ---
  let kztRub = 0, tryRub = 0;
  try {
    const wiseRates = await fetchBackendWiseRates();
    kztRub = wiseRates.KZT || 0;
    tryRub = wiseRates.TRY || 0;
  } catch {
    kztRub = 0; tryRub = 0;
  }

  // --- Bybit ---
  let tickers: any[] = [];
  try {
    const bybitRes = await fetch("https://api.bybit.com/v5/market/tickers?category=spot");
    const bybitData = await bybitRes.json();
    tickers = bybitData.result?.list || [];
  } catch {
    tickers = [];
  }
  const getPrice = (symbol: string) => {
    const t = tickers.find((t: any) => t.symbol === symbol);
    return t ? parseFloat(t.lastPrice) : 0;
  };

  // --- Kraken XMR ---
  let xmrUsdt = 0;
  try {
    const krakenRes = await fetch("https://api.kraken.com/0/public/Ticker?pair=XMRUSDT");
    const krakenData = await krakenRes.json();
    const ticker = krakenData.result && Object.values(krakenData.result)[0];
    xmrUsdt = ticker ? parseFloat(ticker.c[0]) : 0;
  } catch {
    xmrUsdt = 0;
  }

  // --- Формируем итоговый объект ---
  const rates = {
    RUB: { RUB: 1 },
    USD: { RUB: usdRub },
    EUR: { RUB: eurRub },
    KZT: { RUB: kztRub },
    CNY: { RUB: cnyRub },
    TRY: { RUB: tryRub },
    BTC: { RUB: getPrice("BTCUSDT") * usdRub, USDT: getPrice("BTCUSDT") },
    ETH: { RUB: getPrice("ETHUSDT") * usdRub, USDT: getPrice("ETHUSDT") },
    LTC: { RUB: getPrice("LTCUSDT") * usdRub, USDT: getPrice("LTCUSDT") },
    XMR: { RUB: xmrUsdt * usdRub, USDT: xmrUsdt },
    SOL: { RUB: getPrice("SOLUSDT") * usdRub, USDT: getPrice("SOLUSDT") },
    TON: { RUB: getPrice("TONUSDT") * usdRub, USDT: getPrice("TONUSDT") },
    TRX: { RUB: getPrice("TRXUSDT") * usdRub, USDT: getPrice("TRXUSDT") },
    XRP: { RUB: getPrice("XRPUSDT") * usdRub, USDT: getPrice("XRPUSDT") },
    DOGE: { RUB: getPrice("DOGEUSDT") * usdRub, USDT: getPrice("DOGEUSDT") },
    ADA: { RUB: getPrice("ADAUSDT") * usdRub, USDT: getPrice("ADAUSDT") },
    USDT: { RUB: usdRub, USDT: 1 },
    USDC: { RUB: getPrice("USDCUSDT") * usdRub, USDT: getPrice("USDCUSDT") },
    DAI: { RUB: getPrice("DAIUSDT") * usdRub, USDT: getPrice("DAIUSDT") },
    BNB: { RUB: getPrice("BNBUSDT") * usdRub, USDT: getPrice("BNBUSDT") }
  };

  return rates;
}