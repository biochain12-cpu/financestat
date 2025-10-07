import React from "react";
import { Box, Button, Typography } from "@mui/material";

type Props = {
  currentShift: number;
  setShift: (n: number) => void;
};

export default function SessionBar({ currentShift, setShift }: Props) {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
      <Typography>Смена:</Typography>
      {[1, 2, 3].map(n => (
        <Button
          key={n}
          variant={currentShift === n ? "contained" : "outlined"}
          color={currentShift === n ? "primary" : "inherit"}
          onClick={() => setShift(n)}
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