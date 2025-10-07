const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

async function fetchWiseRate(from, to) {
  try {
    const url = `https://wise.com/ru/currency-converter/${from}-to-${to}-rate?amount=1000`;
    const res = await fetch(url);
    const html = await res.text();
    // Ищем строку типа: <span class="text-success">2,56</span>
    const match = html.match(/<span class="text-success">([\d.,]+)<\/span>/);
    if (match && match[1]) {
      return parseFloat(match[1].replace(",", "."));
    }
    return 0;
  } catch {
    return 0;
  }
}

router.get("/wise-rates", async (req, res) => {
  const tryRub = await fetchWiseRate("try", "rub");
  const kztRub = await fetchWiseRate("kzt", "rub");
  res.json({ TRY: tryRub, KZT: kztRub });
});

module.exports = router;