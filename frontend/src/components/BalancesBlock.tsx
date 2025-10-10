import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { currencies } from "../utils/currencies";

type Balance = {
  [currency: string]: number;
};

type Props = {
  balances: Balance;
  selectedCurrencies: string[];
  setSelectedCurrencies: (codes: string[]) => void;
};

const getCurrencyIcon = (code: string) => currencies.find(c => c.code === code)?.icon || null;

export default function BalancesBlock({ balances, selectedCurrencies, setSelectedCurrencies }: Props) {
  const displayedCurrencies = selectedCurrencies.length
    ? currencies.filter(cur => selectedCurrencies.includes(cur.code))
    : currencies;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" mb={2}>Балансы по валютам</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(45px, 1fr))",
          gap: 0.5,
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {displayedCurrencies
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((cur, i) => {
            const value = balances[cur.code] ?? 0;
            return (
              <Box
                key={cur.code + i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: "2px 1px",
                  borderRadius: "8px",
                  background: "#f8fafc",
                  fontWeight: 500,
                  fontSize: "0.8em",
                  border: "1px solid #e0e6ef",
                  minWidth: 40,
                  maxWidth: 60,
                  boxSizing: "border-box",
                  cursor: "pointer",
                  backgroundColor: selectedCurrencies.includes(cur.code) ? "#dbeafe" : "#f8fafc"
                }}
                onClick={() => {
                  setSelectedCurrencies(
                    selectedCurrencies.includes(cur.code)
                      ? selectedCurrencies.filter(c => c !== cur.code)
                      : [...selectedCurrencies, cur.code]
                  );
                }}
              >
                <span style={{ fontSize: 8, marginBottom: 1 }}>{getCurrencyIcon(cur.code)}</span>
                <span style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>{cur.code}</span>
                <span style={{ fontWeight: 500, fontSize: 10 }}>
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button
            style={{
              marginLeft: 4,
              fontSize: 9,
              height: 22,
              padding: "0 8px",
              borderRadius: 6,
              border: "1px solid #e0e6ef",
              background: "#fff",
              cursor: "pointer"
            }}
            onClick={() => setSelectedCurrencies([])}
          >
            Show all
          </button>
        </Box>
      </Box>
    </Paper>
  );
}