import React, { useEffect, useState } from "react";
import { getMe, logout } from "../api/auth";
import { getTransactions, deleteTransaction } from "../api/transactions";
import { getFireMessages, createFireMessage, deleteFireMessage } from "../api/fire";
import { getBalances } from "../api/balances";
import { getRates } from "../utils/getRates";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, Modal, Avatar, TextField, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { toast } from "react-toastify";
import { currencies } from "../utils/currencies";
import { applyCustomRates } from "../utils/applyCustomRates";
import AddTransactionModal from "../components/AddTransactionModal";
import FilterModal from "../components/FilterModal";
import CongratsModal from "../components/CongratsModal";
import { exportShiftReport } from "../utils/exportShiftReport";
import { FaPlus, FaFilter, FaFileExport, FaFileAlt, FaInfoCircle, FaTrash } from "react-icons/fa";

const mainCodes = [
  "RUB", "USD", "EUR", "KZT", "TRY", "CNY",
  "BTC", "ETH", "LTC", "XMR"
];
const getCurrencyIcon = (code: string) => currencies.find(c => c.code === code)?.icon || null;

export default function MainPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fire, setFire] = useState<any[]>([]);
  const [balances, setBalances] = useState<any>({});
  const [rates, setRates] = useState<any>({});
  const [addOpen, setAddOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [showAllRates, setShowAllRates] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentShift, setCurrentShift] = useState(() => {
    const saved = localStorage.getItem("currentShift");
    return saved ? Number(saved) : 1;
  });
  const [confirmShift, setConfirmShift] = useState(false);
  const [fireMsg, setFireMsg] = useState("");
  const [firePage, setFirePage] = useState(1);
  const firePerPage = 5;
  const [showOnlyCurrentShift, setShowOnlyCurrentShift] = useState(false);
  const navigate = useNavigate();

  // ВСТАВЛЕНО ДЛЯ ОТЛАДКИ:
  console.log("MainPage рендерится", {
    user,
    loading,
    transactions,
    fire,
    balances,
    rates
  });

  useEffect(() => {
    setLoading(true);
    getMe().then(setUser).catch(() => {
      logout();
      navigate("/login");
    });
    Promise.all([
      getTransactions().then(setTransactions),
      getFireMessages().then(setFire),
      getBalances().then(setBalances),
      getRates().then(rawRates => setRates(applyCustomRates(rawRates))),
    ]).finally(() => setLoading(false));
  }, [navigate]);

  const handleAddTransaction = (tx: any) => {
    tx.shift = currentShift;
    setTransactions([tx, ...(Array.isArray(transactions) ? transactions : [])]);
    getBalances().then(setBalances);
    toast.success("Запись добавлена!");
  };

  const handleFinishShift = () => setConfirmShift(true);
  const handleConfirmFinish = () => {
    exportShiftReport({ transactions, shift: currentShift, rates });
    setConfirmShift(false);
    setCongratsOpen(true);
    const nextShift = currentShift === 3 ? 1 : currentShift + 1;
    setCurrentShift(nextShift);
    localStorage.setItem("currentShift", String(nextShift));
    toast.success("Смена завершена!");
  };

  // Защита для currencies
  const safeCurrencies = Array.isArray(currencies) ? currencies : [];
  const mainCurrencies = safeCurrencies.filter(c => mainCodes.includes(c.code)).sort((a, b) => a.code.localeCompare(b.code));
  const otherCurrencies = safeCurrencies.filter(c => !mainCodes.includes(c.code)).sort((a, b) => a.code.localeCompare(b.code));

  // Защита для transactions
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const filteredTransactions = safeTransactions.filter(tx =>
    !showOnlyCurrentShift || tx.shift === currentShift
  );

  // Защита для fire
  const safeFire = Array.isArray(fire) ? fire : [];
  const fireTotalPages = Math.max(1, Math.ceil(safeFire.length / firePerPage));
  const firePageData = safeFire.slice((firePage - 1) * firePerPage, firePage * firePerPage);

  const calcRubDelta = (tx: any) => {
    if (tx.type !== "exchange") return 0;
    const toRub = (rates[tx.to_currency]?.RUB || 0) * (tx.to_amount || 0);
    const fromRub = (rates[tx.from_currency]?.RUB || 0) * (tx.from_amount || 0);
    return toRub - fromRub;
  };
  const profit = filteredTransactions
    .filter(tx => tx.type === "exchange")
    .reduce((sum, tx) => sum + calcRubDelta(tx), 0);

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions(safeTransactions.filter(t => t.id !== id));
      getBalances().then(setBalances);
      toast.success("Операция удалена");
    } catch (e: any) {
      toast.error("Ошибка удаления: " + (e?.response?.data?.detail || e.message));
    }
  };

  const handleAddFire = async () => {
    if (!fireMsg.trim()) return;
    try {
      const msg = await createFireMessage(fireMsg);
      setFire([msg, ...safeFire]);
      setFireMsg("");
      toast.success("Сообщение добавлено!");
    } catch {
      toast.error("Ошибка при добавлении сообщения");
    }
  };

  const handleDeleteFire = async (id: number) => {
    try {
      await deleteFireMessage(id);
      setFire(safeFire.filter(f => f.id !== id));
      toast.success("Сообщение удалено");
    } catch {
      toast.error("Ошибка при удалении сообщения");
    }
  };

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem("token", user.token);
    }
  }, [user]);
  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100vw",
      bgcolor: "#f7fafd",
      color: "#222",
      fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
      p: 0,
      m: 0,
    }}>
      <Box className="container" sx={{
        flex: "1 1 auto",
        maxWidth: "100vw",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "0 0 14px 14px",
        boxShadow: "0 2px 16px #e0e6ef80",
        p: { xs: "8px 2vw", md: "36px 18px 32px 18px" },
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
        border: "none",
        backdropFilter: "blur(1.5px)",
      }}>
        {/* Top Bar */}
        <Box className="top-bar" sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2
        }}>
          <Typography variant="h4" sx={{ color: "#3b82f6", fontWeight: 700, letterSpacing: 1 }}>
            Финансовый учёт
          </Typography>
          <Box className="user-block" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user?.avatar && (
              <Avatar src={user.avatar} alt={user.login} sx={{ width: 32, height: 32, mr: 1 }} />
            )}
            <Typography id="currentUserDisplay" sx={{ color: "#6b7280", fontSize: "1em", mr: 2 }}>
              {user?.login} ({user?.role})
            </Typography>
            <Button
              id="logoutBtn"
              variant="outlined"
              color="primary"
              onClick={() => { logout(); navigate("/login"); }}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Сменить пользователя
            </Button>
          </Box>
        </Box>

        {/* Session Bar */}
        <Box className="session-bar" sx={{
          display: "flex", alignItems: "center", gap: 2, mb: 2
        }}>
          <Typography className="session-label" sx={{ color: "#6b7280", fontSize: "1.08em", mr: 1 }}>
            Смена:
          </Typography>
          <Typography className="current-session" sx={{ fontWeight: 700, color: "#22c55e", ml: 2 }}>
            <b>{currentShift}</b>
          </Typography>
          <Button
            id="switchShiftBtn"
            className="primary"
            variant="contained"
            color="success"
            sx={{ ml: 2, borderRadius: 2 }}
            onClick={handleFinishShift}
          >
            Переключить смену
          </Button>
        </Box>

        {/* Важная информация */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={FaInfoCircle({ size: 18 })}
            onClick={() => setInfoOpen(true)}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Важная информация
          </Button>
          <Modal open={infoOpen} onClose={() => setInfoOpen(false)}>
            <Box className="modal-content" sx={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              bgcolor: "#fff", p: 3, borderRadius: 2, minWidth: 320, maxWidth: 500, maxHeight: "80vh", overflowY: "auto", border: "2px solid #3b82f6"
            }}>
              <Typography variant="h6" mb={2}>🔥 Важная информация</Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  value={fireMsg}
                  onChange={e => setFireMsg(e.target.value)}
                  placeholder="Добавить сообщение"
                  fullWidth
                />
                <Button variant="contained" color="warning" onClick={handleAddFire}>
                  {FaPlus({ size: 16 })} Добавить
                </Button>
              </Box>
              {firePageData.length === 0 && <Typography color="text.secondary">Нет сообщений</Typography>}
              {firePageData.map(msg => (
                <Box key={msg.id} mb={2} sx={{ borderBottom: "1px solid #eee", pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography>{msg.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {msg.author_id || "-"}, {msg.date ? new Date(msg.date).toLocaleString("ru-RU") : ""}
                    </Typography>
                  </Box>
                  <IconButton color="error" onClick={() => handleDeleteFire(msg.id)} title="Удалить">
                    {FaTrash({ size: 16 })}
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                {Array.from({ length: fireTotalPages }, (_, i) => (
                  <Button
                    key={i}
                    size="small"
                    variant={firePage === i + 1 ? "contained" : "outlined"}
                    onClick={() => setFirePage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setInfoOpen(false)}>
                Закрыть
              </Button>
            </Box>
          </Modal>
        </Box>

        {/* ... Остальной JSX (балансы, курсы, история, модальные окна и т.д.) ... */}
      </Box>
    </Box>
  );
}