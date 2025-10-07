export function exportToCSV(filename: string, rows: any[], headers: string[]) {
  const csvContent =
    headers.join(",") +
    "\n" +
    rows
      .map(row =>
        headers.map(h => JSON.stringify(row[h] ?? "")).join(",")
      )
      .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}