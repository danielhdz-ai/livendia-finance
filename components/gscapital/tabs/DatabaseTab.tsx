"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const STATUS_LABEL: Record<Client["status"], string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  activo: "Activo",
  noactivo: "No activo",
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.6 6.3A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.8 12L4 20l4.2-1.1A7.94 7.94 0 0 0 20 10.6a7.85 7.85 0 0 0-2.4-4.3Zm-5.6 12.2a6.61 6.61 0 0 1-3.4-.9l-.2-.1-2.5.6.7-2.4-.2-.3a6.61 6.61 0 0 1 10.2-8.2 6.55 6.55 0 0 1 1.9 4.6 6.61 6.61 0 0 1-6.5 6.7Zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.6-.7.8-.1.1-.3.1-.5 0a5.4 5.4 0 0 1-2.7-2.4c-.2-.3.2-.3.5-1 .1-.1.1-.2.1-.3s0-.2-.1-.3l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9c0 1.1.8 2.2.9 2.4a8.7 8.7 0 0 0 3.4 3c.5.2.8.3 1.1.2a1.9 1.9 0 0 0 1.2-.8 1.5 1.5 0 0 0 .1-.8c-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.charAt(0) ?? "") + (parts[1]?.charAt(0) ?? "")).toUpperCase() || "•";
}

export function DatabaseTab() {
  const { clients, setCurrentClient, setActiveTab, deleteClient } = useGSCapital();
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [zoneFilter, setZoneFilter] = useState("");
  const [search, setSearch] = useState("");
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const zoneTerm = zoneFilter.trim().toLowerCase();
    const searchTerm = search.trim().toLowerCase();
    return clients.filter((client) => {
      const zone =
        client.zone || client.additionalInfo?.zonesOfInterest || "";
      const statusMatch =
        statusFilter === "todos" || client.status === statusFilter;
      const zoneMatch = !zoneTerm || zone.toLowerCase().includes(zoneTerm);
      const searchMatch =
        !searchTerm ||
        getOperationDisplayName(client).toLowerCase().includes(searchTerm) ||
        zone.toLowerCase().includes(searchTerm);
      return statusMatch && zoneMatch && searchMatch;
    });
  }, [clients, statusFilter, zoneFilter, search]);

  function openWhatsApp(phone?: string) {
    if (!phone) return;
    let normalized = phone.replace(/[\s\-()]/g, "");
    if (normalized.length === 9 && !normalized.startsWith("34")) {
      normalized = `34${normalized}`;
    }
    window.open(
      `https://wa.me/${normalized}?text=${encodeURIComponent(WHATSAPP_MESSAGE_TEMPLATE)}`,
      "_blank",
    );
  }

  function handleEdit(client: Client) {
    setCurrentClient(client);
    setActiveTab("asesoramiento");
    setOpenMenuId(null);
  }

  function handleHipoteca(client: Client) {
    setCurrentClient(client);
    setActiveTab("hipoteca");
    setOpenMenuId(null);
  }

  async function handleDelete(id: string) {
    setOpenMenuId(null);
    await deleteClient(id);
  }

  const total = clients.length;
  const visible = filtered.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Base de Datos Clientes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Listado completo de operaciones y clientes registrados.
          </p>
        </div>
        <div className="flex items-center gap-6 text-right text-xs text-slate-500">
          <div>
            <span className="block text-2xl font-bold text-slate-900">{total}</span>
            operaciones totales
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900">{visible}</span>
            visibles
          </div>
        </div>
      </header>

      <Panel>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Buscar" hint="Por nombre o zona">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: Dilma, hospitalet…"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </Field>
          <Field label="Filtrar por estado">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
              <option value="activo">Activo</option>
              <option value="noactivo">No activo</option>
            </Select>
          </Field>
          <Field label="Filtrar por zona">
            <Input
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              placeholder="Eixample, Gràcia…"
            />
          </Field>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <Panel>
          <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              {total === 0 ? "Aún no hay operaciones registradas" : "Sin coincidencias"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {total === 0
                ? "Crea una nueva operación desde Asesoramiento."
                : "Prueba a cambiar los filtros o el término de búsqueda."}
            </p>
          </div>
        </Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" ref={menuRef}>
          {filtered.map((client) => {
            const displayName = getOperationDisplayName(client);
            const zone =
              client.zone ||
              client.additionalInfo?.zonesOfInterest ||
              "Sin zona";
            const owners = getOwnersFromClient(client);
            const phone = owners[0]?.phone;
            return (
              <article
                key={client.id}
                className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {initialsOf(displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-slate-900" title={displayName}>
                      {displayName || "—"}
                    </h4>
                    <p className="truncate text-xs text-slate-500" title={zone}>
                      {zone}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Acciones"
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      onClick={() =>
                        setOpenMenuId(openMenuId === client.id ? null : client.id)
                      }
                    >
                      <MoreIcon className="h-4 w-4" />
                    </button>
                    {openMenuId === client.id ? (
                      <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setViewClient(client);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <EyeIcon className="h-4 w-4 text-slate-500" />
                          Ver detalle
                        </button>
                        <button
                          type="button"
                          onClick={() => void downloadClientSummary(client).then(() => setOpenMenuId(null))}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <DownloadIcon className="h-4 w-4 text-slate-500" />
                          Descargar resumen
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(client)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <PencilIcon className="h-4 w-4 text-slate-500" />
                          Editar en Asesoramiento
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHipoteca(client)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <HomeIcon className="h-4 w-4 text-slate-500" />
                          Calcular hipoteca
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            openWhatsApp(phone);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <WhatsAppIcon className="h-4 w-4 text-emerald-600" />
                          Abrir WhatsApp
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => void handleDelete(client.id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Eliminar operación
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-slate-500">Ingresos</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(client.income)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Deudas</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(client.debts)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Titulares</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">
                      {formatNumTitulares(client.numTitulares)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Financiación</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 tabular-nums">
                      {client.financiacionPct ?? "—"}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Precio vivienda</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(client.housePrice)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Cuota estimada</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(client.monthlyPayment)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <Tag tone={STATUS_TONE[client.status]}>{STATUS_LABEL[client.status]}</Tag>
                  <button
                    type="button"
                    onClick={() => setViewClient(client)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Ver detalle →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {viewClient ? (
        <ClientDetailModal
          client={viewClient}
          onClose={() => setViewClient(null)}
        />
      ) : null}
    </div>
  );
}