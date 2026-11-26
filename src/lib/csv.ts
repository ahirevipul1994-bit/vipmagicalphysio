/** RFC 4180-style CSV, including spreadsheet-formula injection mitigation. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]!);
  const cell = (value: unknown) => {
    let text = value == null ? '' : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return '\ufeff' + [keys.map(cell).join(','), ...rows.map(row => keys.map(k => cell(row[k])).join(','))].join('\r\n');
}
