import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { currencies } from "../utils/currencies";

type Balance = {
  [currency: string]: number;
};

type Rates = {
  [currency: string]: { RUB: number };
};

type Props = {
  balances: Balance;
  rates?: Rates; // Передавай сюда актуальные курсы, если хочешь показывать RUB-эквивалент
};

export default function BalancesBlock({ balances, rates }: Props) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Балансы по валютам</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
        {currencies.map((cur, i) => {
          const value = balances[cur.code] ?? 0;
          // RUB-эквивалент (если есть rates)
          let rubValue = "";
          if (rates && rates[cur.code]?.RUB !== undefined) {
            rubValue = (value * rates[cur.code].RUB).toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
          return (
            <Box key={cur.code + i} sx={{ minWidth: 120, display: "flex", alignItems: "center", gap: 1 }}>
              {cur.icon}
              <Typography fontWeight={600}>{cur.code}:</Typography>
              <Typography>
                {typeof value === "number"
                  ? value.toLocaleString("ru-RU", {
                      minimumFractionDigits: cur.code === "BTC" || cur.code === "ETH" ? 6 : 2,
                      maximumFractionDigits: cur.code === "BTC" || cur.code === "ETH" ? 8 : 2,
                    })
                  : 0}
              </Typography>
              {rates && cur.code !== "RUB" && (
                <Typography sx={{ color: "#888", fontSize: "0.95em", ml: 1 }}>
                  ≈ {rubValue} RUB
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}