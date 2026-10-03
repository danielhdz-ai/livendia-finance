export function formatCurrency(value: number | string | undefined | null): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(num);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
}

/** Parsea input numérico; cadena vacía = 0 */
export function parseNumberInput(raw: string): number {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "" || normalized === "-") return 0;
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Muestra vacío en lugar de 0 para permitir escribir importes manualmente */
export function optionalNumberDisplay(value: number | undefined | null): string {
  if (value === undefined || value === null || value === 0) return "";
  return String(value);
}

export function parsePositiveNumber(value: unknown): number {
  const parsed = parseFloat(String(value ?? "").trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function createId(): string {
  return `${Date.now()}${Math.random().toString(16).slice(2)}`;
}

export function getStatusColor(status?: string): string {
  switch (status) {
    case "aprobado":
      return "bg-green-100 text-green-800";
    case "rechazado":
      return "bg-red-100 text-red-800";
    case "activo":
      return "bg-blue-100 text-blue-800";
    case "noactivo":
      return "bg-gray-200 text-gray-700";
    case "pendiente":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}
