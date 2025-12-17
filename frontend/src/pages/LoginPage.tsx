import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success("Успешный вход!");
      navigate("/");
    } catch (err: any) {
      toast.error("Ошибка входа: " + (err.response?.data?.detail || "Неизвестная ошибка"));
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Вход в учёт финансов</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Логин"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

