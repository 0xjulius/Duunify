export function exportToCsv(filename: string, rows: Record<string, string>[]) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: string) => {
    const needsQuotes = /[",\n;]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const lines = [
    headers.map(escapeCell).join(";"),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h] ?? "")).join(";")),
  ];

  // BOM varmistaa, että ääkköset näkyvät oikein Excelissä
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}