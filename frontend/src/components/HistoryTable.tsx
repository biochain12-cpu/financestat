import React from "react";
import { Paper, Typography, Button } from "@mui/material";

type Props = {
  transactions: any[];
  onDelete: (id: number) => void;
  user: any;
};

export default function HistoryTable({ transactions, onDelete, user }: Props) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">История операций</Typography>
      {transactions.length === 0 && (
        <Typography color="text.secondary">Нет операций</Typography>
      )}
      <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тип</th>
            <th>Смена</th>
            <th>Комментарий</th>
            <th>Дата</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.type === "exchange" ? "Обмен" : tx.type === "adjustment" ? "Корректировка" : "Расход"}</td>
              <td>{tx.shift}</td>
              <td>{tx.comment || ""}</td>
              <td>
                {tx.date
                  ? new Date(tx.date).toLocaleString("ru-RU")
                  : ""}
              </td>
              <td>
                {(user?.role === "admin" || tx.author_id === user?.id) && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(tx.id)}
                  >
                    Удалить
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}