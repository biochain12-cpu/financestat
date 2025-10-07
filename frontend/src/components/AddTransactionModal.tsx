import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, InputAdornment } from "@mui/material";
import { currencies } from "../utils/currencies";
import { FaSearch } from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (tx: any) => void;
  currentShift: number;
};

export default function AddTransactionModal({ open, onClose, onAdd, currentShift }: Props) {
  const [type, setType] = useState("exchange");
  const [from_currency, setFromCurrency] = useState("RUB");
  const [from_amount, setFromAmount] = useState<number | "">("");
  const [to_currency, setToCurrency] = useState("USD");
  const [to_amount, setToAmount] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");

  // Фильтрация валют только по коду
  const filteredCurrencies = currencies.filter(c =>
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      type,
      shift: currentShift,
      from_currency,
      from_amount: from_amount === "" ? null : Number(from_amount),
      to_currency,
      to_amount: to_amount === "" ? null : Number(to_amount),
      comment,
    });
    onClose();
    setFromCurrency("RUB");
    setFromAmount("");
    setToCurrency("USD");
    setToAmount("");
    setComment("");
    setCurrencySearch("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 3, borderRadius: 2, minWidth: 350, width: 400, boxShadow: 24
      }}>
        <Typography variant="h6" mb={2}>Добавить запись</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select label="Тип" value={type} onChange={e => setType(e.target.value)}
            fullWidth margin="normal"
          >
            <MenuItem value="exchange">Обмен</MenuItem>
            <MenuItem value="adjustment">Корректировка</MenuItem>
            <MenuItem value="expense">Расход</MenuItem>
          </TextField>

          {/* Поиск валюты */}
          <TextField
            label="Поиск валюты (по коду)"
            value={currencySearch}
            onChange={e => setCurrencySearch(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {FaSearch({ size: 14 })}
                  </span>
                </InputAdornment>
              ),
            }}
          />

          {/* Сначала "Получили" */}
          {(type === "exchange" || type === "adjustment") && (
            <>
              <TextField
                select
                label="Получили (валюта)"
                value={to_currency}
                onChange={e => setToCurrency(e.target.value)}
                fullWidth margin="normal"
              >
                {filteredCurrencies.map((c, i) => (
                  <MenuItem key={c.code + i} value={c.code}>
                    {c.icon} {c.code}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Сумма получили"
                type="number"
                value={to_amount}
                onChange={e => setToAmount(e.target.value === "" ? "" : Number(e.target.value))}
                fullWidth margin="normal"
              />
            </>
          )}

          {/* Потом "Отдали" */}
          {(type === "exchange" || type === "expense") && (
            <>
              <TextField
                select
                label="Отдали (валюта)"
                value={from_currency}
                onChange={e => setFromCurrency(e.target.value)}
                fullWidth margin="normal"
              >
                {filteredCurrencies.map((c, i) => (
                  <MenuItem key={c.code + i} value={c.code}>
                    {c.icon} {c.code}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Сумма отдали"
                type="number"
                value={from_amount}
                onChange={e => setFromAmount(e.target.value === "" ? "" : Number(e.target.value))}
                fullWidth margin="normal"
              />
            </>
          )}

          <TextField
            label="Комментарий"
            value={comment}
            onChange={e => setComment(e.target.value)}
            fullWidth margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Добавить
          </Button>
        </form>
      </Box>
    </Modal>
  );
}