import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    // Здесь можно добавить имитацию успешного входа
    toast.success("Вход без авторизации!");
    navigate("/");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Вход в учёт финансов</Typography>
        <form onSubmit={handleLogin}>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </form>
      </Paper>
    </Box>
  );
}