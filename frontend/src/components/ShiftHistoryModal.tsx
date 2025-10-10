import React, { useEffect, useState } from "react";
import { getShiftSnapshots } from "../api/shiftSnapshot";
import { Modal, Box, Typography, Button } from "@mui/material";
import { currencies } from "../utils/currencies";

type Props = {
  open: boolean;
  onClose: () => void;
};

const getCurrencyIcon = (code: string) => currencies.find(c => c.code === code)?.icon || null;

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
        bgcolor: "#fff", p: 3, borderRadius: 2, minWidth: 350, maxWidth: 900, maxHeight: "80vh", overflowY: "auto"
      }}>
        <Typography variant="h6" mb={2}>История смен</Typography>
        {snapshots.length === 0 && <Typography color="text.secondary">Нет данных</Typography>}
        {snapshots.map(snap => (
          <Box key={snap.id} mb={4} sx={{ borderBottom: "1px solid #eee", pb: 2, display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography fontWeight={700} mb={1}>
                Смена: {snap.shift_number} &nbsp; {new Date(snap.datetime).toLocaleString("ru-RU")}
              </Typography>
              <Typography variant="subtitle1" mt={2} mb={1}>Балансы на конец смены:</Typography>
              <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(55px, 1fr))",
                gap: 0.5,
                alignItems: "center",
                maxWidth: 250
              }}>
                {Object.entries(snap.balances).map(([code, value]) => (
                  <Box key={code} sx={{
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
                    <span style={{ fontSize: 8, marginBottom: 1 }}>{getCurrencyIcon(code)}</span>
                    <span style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>{code}</span>
                    <span style={{ fontWeight: 500, fontSize: 10 }}>
                      {value === undefined || value === null
                        ? "-"
                        : typeof value === "number"
                          ? value.toLocaleString("ru-RU", { maximumFractionDigits: 8 })
                          : String(value)}
                    </span>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography variant="subtitle1" mt={2} mb={1}>Курсы на конец смены:</Typography>
              <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(55px, 1fr))",
                gap: 0.5,
                alignItems: "center",
                maxWidth: 250
              }}>
                {Object.entries(snap.rates).map(([code, val]: any) => (
                  <Box key={code} sx={{
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
                    <span style={{ fontSize: 8, marginBottom: 1 }}>{getCurrencyIcon(code)}</span>
                    <span style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>{code}</span>
                    <span style={{ fontWeight: 500, fontSize: 10 }}>
                      {val.RUB !== undefined
                        ? Number(val.RUB).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(".", ",")
                        : "-"}
                    </span>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
        <Button sx={{ mt: 2 }} variant="outlined" onClick={onClose}>Закрыть</Button>
      </Box>
    </Modal>
  );
}