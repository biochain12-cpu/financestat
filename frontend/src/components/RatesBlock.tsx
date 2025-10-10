import React, { useState } from "react";
import { Paper, Box, Typography, Button, Modal } from "@mui/material";
import { currencies } from "../utils/currencies";

type Rates = {
  [currency: string]: { RUB: number };
};

type Props = {
  rates: Rates;
};

const getCurrencyIcon = (code: string) => currencies.find(c => c.code === code)?.icon || null;

export default function RatesBlock({ rates }: Props) {
  const [showAll, setShowAll] = useState(false);

  const mainCodes = ["RUB", "USD", "EUR", "BTC", "ETH", "LTC", "XMR"];
  const mainCurrencies = currencies.filter(c => mainCodes.includes(c.code));
  const otherCurrencies = currencies.filter(c => !mainCodes.includes(c.code));

  const formatRate = (val?: number) =>
    val !== undefined
      ? val.toFixed(2).replace(".", ",")
      : "—";

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" mb={2}>Курсы валют (к RUB)</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
          gap: 0.5,
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {mainCurrencies.map((cur, i) => (
          <Box key={cur.code + i} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: "2px 1px",
            borderRadius: "8px",
            background: "#f8fafc",
            fontWeight: 500,
            fontSize: "0.8em",
            border: "1px solid #e0e6ef",
            minWidth: 45,
            maxWidth: 60,
            boxSizing: "border-box",
          }}>
            <span style={{ fontSize: 8, marginBottom: 1 }}>{getCurrencyIcon(cur.code)}</span>
            <span style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>{cur.code}</span>
            <span style={{ fontWeight: 500, fontSize: 10 }}>
              {formatRate(rates[cur.code]?.RUB)}
            </span>
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
              gap: 0.5,
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {otherCurrencies.map((cur, i) => (
              <Box key={cur.code + i} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "2px 1px",
                borderRadius: "8px",
                background: "#f8fafc",
                fontWeight: 500,
                fontSize: "0.8em",
                border: "1px solid #e0e6ef",
                minWidth: 45,
                maxWidth: 60,
                boxSizing: "border-box",
              }}>
                <span style={{ fontSize: 8, marginBottom: 1 }}>{getCurrencyIcon(cur.code)}</span>
                <span style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>{cur.code}</span>
                <span style={{ fontWeight: 500, fontSize: 10 }}>
                  {formatRate(rates[cur.code]?.RUB)}
                </span>
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