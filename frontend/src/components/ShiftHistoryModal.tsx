import React, { useEffect, useState } from "react";
import { getShiftSnapshots } from "../api/shiftSnapshot";
import { Modal, Box, Typography, Button } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ShiftHistoryModal({ open, onClose }: Props) {
  const [snapshots, setSnapshots] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getShiftSnapshots().then(setSnapshots);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "#fff", p: 3, borderRadius: 2, minWidth: 320, maxWidth: 600, maxHeight: "80vh", overflowY: "auto"
      }}>
        <Typography variant="h6" mb={2}>История смен</Typography>
        {snapshots.length === 0 && <Typography color="text.secondary">Нет данных</Typography>}
        {snapshots.map(snap => (
          <Box key={snap.id} mb={2} sx={{ borderBottom: "1px solid #eee", pb: 1 }}>
            <Typography>Смена: {snap.shift_number}</Typography>
            <Typography>Дата: {new Date(snap.datetime).toLocaleString("ru-RU")}</Typography>
            <Typography>Балансы: {JSON.stringify(snap.balances)}</Typography>
            <Typography>Курсы: {JSON.stringify(snap.rates)}</Typography>
          </Box>
        ))}
        <Button sx={{ mt: 2 }} variant="outlined" onClick={onClose}>Закрыть</Button>
      </Box>
    </Modal>
  );
}