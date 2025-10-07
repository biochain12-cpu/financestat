import React, { useState } from "react";
import { Paper, Box, Typography, Button, Modal } from "@mui/material";
import { currencies } from "../utils/currencies";

type Rates = {
  [currency: string]: { RUB: number };
};

type Props = {
  rates: Rates;
};

export default function RatesBlock({ rates }: Props) {
  const [showAll, setShowAll] = useState(false);

  // Основные валюты
  const mainCodes = ["RUB", "USD", "EUR", "BTC", "ETH", "LTC", "XMR"];
  const mainCurrencies = currencies.filter(c => mainCodes.includes(c.code));
  const otherCurrencies = currencies.filter(c => !mainCodes.includes(c.code));

  // Форматирование курса с запятой
  const formatRate = (val?: number) =>
    val !== undefined
      ? val.toFixed(2).replace(".", ",")
      : "—";

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Курсы валют (к RUB)</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
        {mainCurrencies.map((cur, i) => (
          <Box key={cur.code + i} sx={{ minWidth: 100, display: "flex", alignItems: "center", gap: 1 }}>
            {cur.icon}
            <Typography fontWeight={600}>{cur.code}:</Typography>
            <Typography>
              {formatRate(rates[cur.code]?.RUB)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setShowAll(true)}>
        Показать все курсы
      </Button>
      <Modal open={showAll} onClose={() => setShowAll(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          bgcolor: "background.paper", p: 3, borderRadius: 2, minWidth: 320, maxWidth: 600, maxHeight: "80vh", overflowY: "auto"
        }}>
          <Typography variant="h6" mb={2}>Все курсы валют</Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {otherCurrencies.map((cur, i) => (
              <Box key={cur.code + i} sx={{ minWidth: 100, display: "flex", alignItems: "center", gap: 1 }}>
                {cur.icon}
                <Typography fontWeight={600}>{cur.code}:</Typography>
                <Typography>
                  {formatRate(rates[cur.code]?.RUB)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setShowAll(false)}>
            Закрыть
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}