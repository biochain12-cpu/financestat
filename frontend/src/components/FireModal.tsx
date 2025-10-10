import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { FaTrash } from "react-icons/fa";

type FireMessage = {
  id: number;
  text: string;
  author_id: number | string;
  date: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  fire: FireMessage[];
  onAdd: (msg: string) => void;
  onDelete: (id: number) => void;
  page: number;
  setPage: (n: number) => void;
  firePerPage: number;
};

export default function FireModal({
  open, onClose, fire, onAdd, onDelete, page, setPage, firePerPage
}: Props) {
  const [msg, setMsg] = useState("");
  const totalPages = Math.max(1, Math.ceil(fire.length / firePerPage));
  const pageData = fire.slice((page - 1) * firePerPage, page * firePerPage);

  // Получаем id последнего просмотренного сообщения из localStorage
  const lastReadFireId = Number(localStorage.getItem("lastReadFireId") || 0);

  // При открытии FireModal обновляем lastReadFireId на максимальный id в fire
  React.useEffect(() => {
    if (open && fire.length > 0) {
      const maxId = Math.max(...fire.map(f => f.id));
      localStorage.setItem("lastReadFireId", String(maxId));
    }
    // eslint-disable-next-line
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 3, borderRadius: 2, minWidth: 320, maxWidth: 500, maxHeight: "80vh", overflowY: "auto"
      }}>
        <Typography variant="h6" mb={2}>🔥 Информационная доска</Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            size="small"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Добавить сообщение"
            fullWidth
          />
          <Button variant="contained" color="warning" onClick={() => { onAdd(msg); setMsg(""); }}>
            Добавить
          </Button>
        </Box>
        {pageData.length === 0 && <Typography color="text.secondary">Нет сообщений</Typography>}
        {pageData.map(m => {
          const isNew = m.id > lastReadFireId;
          return (
            <Box
              key={m.id}
              mb={2}
              sx={{
                borderBottom: "1px solid #eee",
                pb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isNew ? "#fffbe7" : "inherit"
              }}
            >
              <Box>
                <Typography fontWeight={isNew ? 700 : 400} color={isNew ? "orange" : "inherit"}>
                  {m.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {m.author_id}, {new Date(m.date).toLocaleString()}
                </Typography>
              </Box>
              <IconButton color="error" onClick={() => onDelete(m.id)} title="Удалить">
                {FaTrash({ size: 16 })}
              </IconButton>
            </Box>
          );
        })}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="small"
              variant={page === i + 1 ? "contained" : "outlined"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={onClose}>Закрыть</Button>
      </Box>
    </Modal>
  );
}