import React, { useEffect, useState } from "react";
import { getMe, logout } from "../api/auth";
import { getTransactions, deleteTransaction } from "../api/transactions";
import { getFireMessages, createFireMessage, deleteFireMessage } from "../api/fire";
import { getBalances } from "../api/balances";
import { getRates } from "../utils/getRates";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, Modal, Avatar, TextField, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import { currencies } from "../utils/currencies";
import { applyCustomRates } from "../utils/applyCustomRates";
import AddTransactionModal from "../components/AddTransactionModal";
import FilterModal from "../components/FilterModal";
import CongratsModal from "../components/CongratsModal";
import { exportShiftReport } from "../utils/exportShiftReport";
import { FaPlus, FaFilter, FaFileExport, FaInfoCircle, FaTrash } from "react-icons/fa";

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

  // DEBUG LOG
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

  const safeCurrencies = Array.isArray(currencies) ? currencies : [];
  const mainCurrencies = safeCurrencies.filter(c => mainCodes.includes(c.code)).sort((a, b) => a.code.localeCompare(b.code));
  const otherCurrencies = safeCurrencies.filter(c => !mainCodes.includes(c.code)).sort((a, b) => a.code.localeCompare(b.code));

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const filteredTransactions = safeTransactions.filter(tx =>
    !showOnlyCurrentShift || tx.shift === currentShift
  );

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

        {/* Кнопки действий */}
        <Box className="center-actions" sx={{
          display: "flex", justifyContent: "center", gap: 2, my: 3, flexWrap: "wrap"
        }}>
          <Button
            variant="contained"
            color="success"
            startIcon={FaPlus({ size: 18 })}
            onClick={() => setAddOpen(true)}
            sx={{ minWidth: 120, fontWeight: 600, borderRadius: 2 }}
          >
            Добавить запись
          </Button>
          <Button
            variant="outlined"
            startIcon={FaFilter({ size: 18 })}
            onClick={() => setFilterOpen(true)}
            sx={{ minWidth: 120, fontWeight: 600, borderRadius: 2 }}
          >
            Фильтры истории
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={FaFileExport({ size: 18 })}
            onClick={() => {
              const lines = [
                "ID,Мы получили,Мы отдали,Δ,Тип,Автор,Время,Смена,Комментарий",
                ...transactions.map(tx =>
                  [
                    tx.id,
                    `${tx.to_amount || ""} ${tx.to_currency || ""}`,
                    `${tx.from_amount || ""} ${tx.from_currency || ""}`,
                    calcRubDelta(tx).toFixed(2).replace(".", ","),
                    tx.type,
                    tx.author?.login || tx.author?.name || tx.author || "-",
                    tx.date ? new Date(tx.date).toLocaleString("ru-RU") : "",
                    tx.shift,
                    tx.comment || ""
                  ].join(",")
                ),
              ];
              const blob = new Blob([lines.join("\n")], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "history.csv";
              a.click();
            }}
            sx={{ minWidth: 120, fontWeight: 600, borderRadius: 2 }}
          >
            Экспорт в CSV
          </Button>
        </Box>

        {/* Балансы */}
        <Paper className="balances-block" sx={{
          background: "#f8fafc", borderRadius: "14px", p: 2, mb: 2, boxShadow: "0 2px 16px #e0e6ef80", border: "1.5px solid #e0e6ef"
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Балансы</Typography>
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
            width: "100%"
          }}>
            {safeCurrencies
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((cur, i) => (
                <Box key={cur.code + i} sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 90,
                  maxWidth: 120,
                  p: "4px 10px",
                  borderRadius: "50px",
                  background: "#f3f6fa",
                  fontWeight: 600,
                  fontSize: "1em",
                  border: "1.5px solid #e0e6ef",
                  m: "0 6px 6px 0",
                  justifyContent: "center"
                }}>
                  {cur.icon}
                  <span>{cur.code}</span>
                  <span style={{ marginLeft: 4, fontWeight: 400 }}>
                    {balances[cur.code] !== undefined ? balances[cur.code] : 0}
                  </span>
                </Box>
              ))}
          </Box>
        </Paper>

        {/* Курсы валют */}
        <Paper className="rates-block" sx={{
          background: "#fff", borderRadius: "14px", p: 2, mb: 2, boxShadow: "0 2px 16px #e0e6ef80", border: "1.5px solid #e0e6ef"
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Курсы валют (к RUB)</Typography>
          <Box className="rates-row" sx={{
            display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", width: "100%"
          }}>
            {mainCurrencies.map((cur, i) => (
              <Box key={cur.code + i} className="currency-cell" sx={{
                display: "flex", alignItems: "center", gap: 1, minWidth: 90, p: "6px 12px", borderRadius: "50px",
                background: "#f3f6fa", fontWeight: 600, fontSize: "1em", border: "1.5px solid #e0e6ef", m: "0 6px 0 0"
              }}>
                {cur.icon}
                <span>{cur.code}</span>
                <span style={{ marginLeft: 4, fontWeight: 400 }}>
                  {rates[cur.code]?.RUB !== undefined ? rates[cur.code].RUB.toFixed(2) : "—"}
                </span>
              </Box>
            ))}
          </Box>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setShowAllRates(true)}>
            Показать все курсы
          </Button>
          <Modal open={showAllRates} onClose={() => setShowAllRates(false)}>
            <Box className="modal-content" sx={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              bgcolor: "#fff", p: 3, borderRadius: 2, minWidth: 320, maxWidth: 600, maxHeight: "80vh", overflowY: "auto", border: "2px solid #3b82f6"
            }}>
              <Typography variant="h6" mb={2}>Все курсы валют</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {otherCurrencies.map((cur, i) => (
                  <Box key={cur.code + i} className="currency-cell" sx={{
                    display: "flex", alignItems: "center", gap: 1, minWidth: 90, p: "6px 12px", borderRadius: "50px",
                    background: "#f3f6fa", fontWeight: 600, fontSize: "1em", border: "1.5px solid #e0e6ef", m: "0 6px 0 0"
                  }}>
                    {cur.icon}
                    <span>{cur.code}</span>
                    <span style={{ marginLeft: 4, fontWeight: 400 }}>
                      {rates[cur.code]?.RUB !== undefined ? rates[cur.code].RUB.toFixed(2) : "—"}
                    </span>
                  </Box>
                ))}
              </Box>
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setShowAllRates(false)}>
                Закрыть
              </Button>
            </Box>
          </Modal>
        </Paper>

        {/* История операций */}
        <Paper className="history-block" sx={{
          background: "#fff", borderRadius: "14px", boxShadow: "0 2px 16px #e0e6ef80",
          border: "1.5px solid #e0e6ef", p: 3, mb: 2, minWidth: 0, overflowX: "auto"
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>История операций</Typography>
          {filteredTransactions.length === 0 && <Typography color="text.secondary">Нет операций</Typography>}
          <table id="historyTable" style={{ width: "100%", marginTop: 8, borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ background: "#e6f7ee" }}>Мы получили</th>
                <th style={{ background: "#ffeaea" }}>Мы отдали</th>
                <th className="profit-cell">Δ (RUB)</th>
                <th className="type-cell">Тип</th>
                <th className="author-cell">Автор</th>
                <th className="date-cell">Время</th>
                <th className="shift-cell">Смена</th>
                <th style={{ background: "#fffbe7" }}>Комментарий</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ background: "#e6f7ee", fontWeight: 600 }}>
                    {tx.type === "exchange" || tx.type === "adjustment" ? (
                      <>
                        {getCurrencyIcon(tx.to_currency)} {tx.to_amount} {tx.to_currency}
                      </>
                    ) : ""}
                  </td>
                  <td style={{ background: "#ffeaea", fontWeight: 600 }}>
                    {tx.type === "exchange" || tx.type === "expense" ? (
                      <>
                        {getCurrencyIcon(tx.from_currency)} {tx.from_amount} {tx.from_currency}
                      </>
                    ) : ""}
                  </td>
                  <td className="profit-cell" style={{
                    color: calcRubDelta(tx) > 0 ? "#22c55e" : calcRubDelta(tx) < 0 ? "#ef4444" : "#222",
                    fontWeight: 700
                  }}>
                    {calcRubDelta(tx) > 0 ? "+" : ""}{calcRubDelta(tx).toFixed(2)}
                  </td>
                  <td className="type-cell">
                    {tx.type === "exchange" ? "Обмен" : tx.type === "adjustment" ? "Корректировка" : "Расход"}
                  </td>
                  <td className="author-cell">{tx.author?.login || tx.author?.name || tx.author || "-"}</td>
                  <td className="date-cell">{tx.date ? new Date(tx.date).toLocaleString("ru-RU") : "-"}</td>
                  <td className="shift-cell">{tx.shift}</td>
                  <td style={{ background: "#fffbe7", textAlign: "right", maxWidth: 180, wordBreak: "break-word" }}>
                    <span style={{ color: "#b45309" }}>{tx.comment || "-"}</span>
                  </td>
                  <td>
                    <IconButton color="error" onClick={() => handleDelete(tx.id)} title="Удалить">
                      {FaTrash({ size: 16 })}
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>

        {/* Модальные окна */}
        <AddTransactionModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={handleAddTransaction}
          currentShift={currentShift}
        />
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onFilter={params => {
            setFilterOpen(false);
            toast.info("Фильтр применён");
          }}
        />
        <CongratsModal open={congratsOpen} onClose={() => setCongratsOpen(false)} />

        {/* Модалка подтверждения завершения смены */}
        <Modal open={confirmShift} onClose={() => setConfirmShift(false)}>
          <Box className="modal-content" sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            bgcolor: "#fff", p: 3, borderRadius: 2, minWidth: 320, textAlign: "center", border: "2px solid #22c55e"
          }}>
            <Typography variant="h6" mb={2}>Вы действительно хотите завершить смену?</Typography>
            <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={handleConfirmFinish}>
              Да, завершить и выгрузить отчёт
            </Button>
            <Button variant="outlined" color="error" onClick={() => setConfirmShift(false)}>
              Нет, отмена
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}