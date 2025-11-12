import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { api } from "../api/backend";

type Props = {
  currentShift: number;
  setShift: (n: number) => void;
  userId: number;
};

export default function SessionBar({ currentShift, setShift, userId }: Props) {
  // Получаем смену с сервера при монтировании
  useEffect(() => {
    async function fetchShift() {
      const res = await api.get(`/user/${userId}/shift`);
      if (res.data?.shift) setShift(res.data.shift);
    }
    fetchShift();
  }, [userId, setShift]);

  // При смене смены — отправляем на сервер
  const handleShiftChange = async (n: number) => {
    await api.post(`/user/${userId}/shift`, { shift: n });
    setShift(n);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
      <Typography>Смена:</Typography>
      {[1, 2, 3].map(n => (
        <Button
          key={n}
          variant={currentShift === n ? "contained" : "outlined"}
          color={currentShift === n ? "primary" : "inherit"}
          onClick={() => handleShiftChange(n)}
          disabled={currentShift === n}
          sx={{ minWidth: 40, fontWeight: 600 }}
        >
          {n}
        </Button>
      ))}
      <Typography ml={2}>
        Текущая: <b>{currentShift}</b>
      </Typography>
    </Box>
  );
}
