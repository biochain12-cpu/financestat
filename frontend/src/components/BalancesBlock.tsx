import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { currencies } from "../utils/currencies";

type Balance = {
  [currency: string]: number;
};

type Props = {
  balances: Balance;
};

const getCurrencyIcon = (code: string) => currencies.find(c => c.code === code)?.icon || null;

export default function BalancesBlock({ balances }: Props) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" mb={2}>Балансы по валютам</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 1.5,
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {currencies.map((cur, i) => {
          const value = balances[cur.code] ?? 0;
          return (
            <Box
              key={cur.code + i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "8px 2px",
                borderRadius: "10px",
                background: "#f8fafc",
                fontWeight: 600,
                fontSize: "1em",
                border: "1px solid #e0e6ef",
                minWidth: 80,
                maxWidth: 120,
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: 16, marginBottom: 2 }}>{getCurrencyIcon(cur.code)}</span>
              <span style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>{cur.code}</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                {typeof value === "number"
                  ? value.toLocaleString("ru-RU", {
                      minimumFractionDigits: cur.code === "BTC" || cur.code === "ETH" ? 6 : 2,
                      maximumFractionDigits: cur.code === "BTC" || cur.code === "ETH" ? 8 : 2,
                    })
                  : 0}
              </span>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

