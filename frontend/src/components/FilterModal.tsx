import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onFilter: (params: any) => void;
};

export default function FilterModal({ open, onClose, onFilter }: Props) {
  const [shift, setShift] = useState("all");
  const [type, setType] = useState("all");
  const [comment, setComment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState(""); // Новый state для быстрого поиска

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      shift: shift === "all" ? undefined : Number(shift),
      type: type === "all" ? undefined : type,
      comment: comment || undefined,
      from_date: from || undefined,
      to_date: to || undefined,
      search: search || undefined, // Передаём быстрый поиск
    });
    onClose();
  };

  const handleReset = () => {
    setShift("all");
    setType("all");
    setComment("");
    setFrom("");
    setTo("");
    setSearch("");
    onFilter({});
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 3, borderRadius: 2, minWidth: 320
      }}>
        <Typography variant="h6" mb={2}>Фильтры истории</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Быстрый поиск (комментарий, автор, валюта)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth margin="normal"
          />
          <TextField
            select label="Смена" value={shift} onChange={e => setShift(e.target.value)}
            fullWidth margin="normal"
          >
            <MenuItem value="all">Все</MenuItem>
            {[1, 2, 3].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </TextField>
          <TextField
            select label="Тип" value={type} onChange={e => setType(e.target.value)}
            fullWidth margin="normal"
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="exchange">Обмен</MenuItem>
            <MenuItem value="adjustment">Корректировка</MenuItem>
            <MenuItem value="expense">Расход</MenuItem>
          </TextField>
          <TextField
            label="Комментарий" value={comment} onChange={e => setComment(e.target.value)}
            fullWidth margin="normal"
          />
          <TextField
            label="С (дата)" type="date" value={from} onChange={e => setFrom(e.target.value)}
            fullWidth margin="normal" InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="По (дата)" type="date" value={to} onChange={e => setTo(e.target.value)}
            fullWidth margin="normal" InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Применить фильтр
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleReset}
          >
            Сбросить фильтры
          </Button>
        </form>
      </Box>
    </Modal>
  );
}