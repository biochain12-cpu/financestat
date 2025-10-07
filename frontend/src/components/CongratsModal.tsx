import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
};

const messages = [
  "Ваша смена завершена! Вы — герой финансов!",
  "Поздравляем с успешным окончанием смены!",
  "Отличная работа! Пусть прибыль всегда будет с вами!",
  "Вы вдохновляете команду своим трудом!",
  "Спасибо за вашу отдачу и профессионализм!",
];

export default function CongratsModal({ open, onClose }: Props) {
  const msg = messages[Math.floor(Math.random() * messages.length)];
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 3, borderRadius: 2, minWidth: 320, textAlign: "center"
      }}>
        <Typography variant="h4" mb={2}>🎉</Typography>
        <Typography variant="h6" mb={2}>{msg}</Typography>
        <Button variant="contained" onClick={onClose}>Продолжить</Button>
      </Box>
    </Modal>
  );
}