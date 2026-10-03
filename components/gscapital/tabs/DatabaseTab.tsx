"use client";

import { useMemo, useState } from "react";
import { ClientDetailModal } from "@/components/gscapital/ClientDetailModal";
import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import { Field, Input, Panel, Select, Tag } from "@/components/gscapital/ui/Panel";
import { WHATSAPP_MESSAGE_TEMPLATE } from "@/lib/gscapital/constants";
import { downloadClientSummary } from "@/lib/gscapital/client-document";
import { formatCurrency } from "@/lib/gscapital/format";
import {
  formatNumTitulares,
  getOperationDisplayName,
  getOwnersFromClient,
} from "@/lib/gscapital/owners";
import type { Client } from "@/lib/gscapital/types";

const STATUS_TONE: Record<
  Client["status"],
  React.ComponentProps<typeof Tag>["tone"]
> = {
  pendiente: "warning",
  aprobado: "success",
  rechazado: "danger",
  activo: "info",
  noactivo: "neutral",
};

export function DatabaseTab() {
  const { clients, setCurrentClient, setActiveTab, deleteClient } = useGSCapital();
  const [statusFilter, setStatusFilter] = useState("todos");
  const [zoneFilter, setZoneFilter] = useState("");
  const [viewClient, setViewClient] = useState<Client | null>(null);

  const filtered = useMemo(
    () =>
      clients.filter((client) => {
        const zone =
          client.zone || client.additionalInfo?.zonesOfInterest || "";
        const statusMatch =
          statusFilter === "todos" || client.status === statusFilter;
        const zoneMatch =
          !zoneFilter || zone.toLowerCase().includes(zoneFilter.toLowerCase());
        return statusMatch && zoneMatch;
      }),
    [clients, statusFilter, zoneFilter],
  );

  function openWhatsApp(phone?: string) {
    if (!phone) {
      alert("El cliente no tiene teléfono registrado.");
      return;
    }
    let normalized = phone.replace(/[\s\-()]/g, "");
    if (normalized.length === 9 && !normalized.startsWith("34")) {
      normalized = `34${normalized}`;
    }
    window.open(
      `https://wa.me/${normalized}?text=${encodeURIComponent(WHATSAPP_MESSAGE_TEMPLATE)}`,
      "_blank",
    );
  }

  return (
    <Panel
      title="Base de Datos Global de Clientes"
      description="Listado completo de operaciones y clientes registrados en Supabase."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Field label="Filtrar por estado">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
            <option value="activo">Activo</option>
            <option value="noactivo">No Activo</option>
          </Select>
        </Field>
        <Field label="Filtrar por zona">
          <Input
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            placeholder="Ej: Eixample, Gràcia..."
          />
        </Field>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
          No hay clientes que coincidan con los filtros aplicados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[1200px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Zona</th>
                <th className="px-4 py-3 text-right">Ingresos</th>
                <th className="px-4 py-3 text-right">Deudas</th>
                <th className="px-4 py-3 text-center">Titulares</th>
                <th className="px-4 py-3 text-right">Financ.</th>
                <th className="px-4 py-3 text-right">Ahorros</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">Hipoteca</th>
                <th className="px-4 py-3 text-right">Cuota</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
                <tr key={client.id} className="text-slate-700 transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {getOperationDisplayName(client)}
                  </td>
                  <td className="px-4 py-3">
                    {client.zone || client.additionalInfo?.zonesOfInterest || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(client.income)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(client.debts)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatNumTitulares(client.numTitulares)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {client.financiacionPct ?? "—"}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(client.availableSavings)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(client.housePrice)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(client.mortgageAmount)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(client.monthlyPayment)}
                  </td>
                  <td className="px-4 py-3">
                    <Tag tone={STATUS_TONE[client.status]}>
                      {client.status}
                    </Tag>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2 text-xs">
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                        onClick={() => setViewClient(client)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                        onClick={() => void downloadClientSummary(client)}
                      >
                        Descargar
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                        onClick={() => {
                          setCurrentClient(client);
                          setActiveTab("asesoramiento");
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 font-medium text-blue-700 transition hover:bg-blue-100"
                        onClick={() => {
                          setCurrentClient(client);
                          setActiveTab("hipoteca");
                        }}
                      >
                        Hipoteca
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-medium text-emerald-700 transition hover:bg-emerald-100"
                        onClick={() => openWhatsApp(getOwnersFromClient(client)[0]?.phone)}
                      >
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 font-medium text-red-700 transition hover:bg-red-100"
                        onClick={() => {
                          if (confirm(`¿Eliminar la operación ${getOperationDisplayName(client)}?`)) {
                            void deleteClient(client.id);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewClient ? (
        <ClientDetailModal
          client={viewClient}
          onClose={() => setViewClient(null)}
        />
      ) : null}
    </Panel>
  );
}