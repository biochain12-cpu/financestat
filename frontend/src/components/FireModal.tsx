import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

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
  isAdmin?: boolean;
  onDeleteAll?: () => void;
  onMarkRead?: () => void;
};

export default function FireModal({ open, onClose, fire, isAdmin, onDeleteAll, onMarkRead }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 3, borderRadius: 2, minWidth: 320, maxWidth: 500, maxHeight: "80vh", overflowY: "auto"
      }}>
        <Typography variant="h6" mb={2}>🔥 Информационная доска</Typography>
        {fire.length === 0 && <Typography color="text.secondary">Нет сообщений</Typography>}
        {fire.map(msg => (
          <Box key={msg.id} mb={2} sx={{ borderBottom: "1px solid #eee", pb: 1 }}>
            <Typography>{msg.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              {msg.author_id}, {new Date(msg.date).toLocaleString()}
            </Typography>
          </Box>
        ))}
        <Box mt={2} display="flex" gap={2}>
          {isAdmin && onDeleteAll && (
            <Button variant="contained" color="error" onClick={onDeleteAll}>Удалить все</Button>
          )}
          {onMarkRead && (
            <Button variant="contained" color="success" onClick={onMarkRead}>Прочитать всё</Button>
          )}
          <Button variant="outlined" onClick={onClose}>Закрыть</Button>
        </Box>
      </Box>
    </Modal>
  );
}

