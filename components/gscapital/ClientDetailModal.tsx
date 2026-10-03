"use client";

import { useEffect } from "react";
import { AGENT_INFO } from "@/lib/gscapital/constants";
import { downloadClientSummary } from "@/lib/gscapital/client-document";
import { formatCurrency } from "@/lib/gscapital/format";
import {
  formatTitularesLabel,
  getOperationDisplayName,
  getOwnersFromClient,
} from "@/lib/gscapital/owners";
import type { Client, OwnerData } from "@/lib/gscapital/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-700">
        {title}
      </h4>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">
        {value === undefined || value === null || value === "" ? "—" : value}
      </dd>
    </div>
  );
}

function OwnerSection({ owner, index }: { owner: OwnerData; index: number }) {
  return (
    <Section title={`Titular ${index + 1}`}>
      <Row label="Nombre" value={owner.fullName} />
      <Row label="Edad" value={owner.age} />
      <Row label="Nacionalidad" value={owner.nationality} />
      <Row label="Teléfono" value={owner.phone} />
      <Row label="Email" value={owner.email} />
      <Row label="DNI/NIE" value={owner.dni} />
      <Row label="Banco" value={owner.bank} />
      <Row label="Empresa" value={owner.company} />
      <Row label="Contrato" value={owner.contractType} />
      <Row label="Antigüedad" value={owner.seniority} />
      <Row label="Nómina" value={formatCurrency(owner.payslips)} />
      <Row label="Ahorros" value={formatCurrency(owner.savings)} />
      <Row label="Préstamos (cuota)" value={formatCurrency(owner.loans)} />
    </Section>
  );
}

export function ClientDetailModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const ai = client.additionalInfo ?? {};
  const ms = client.mortgageSnapshot;
  const pl = client.personalLoan;
  const owners = getOwnersFromClient(client);
  const shortfall =
    ms?.shortfall ??
    (ms?.ahorrosNecesarios && ms.availableSavings !== undefined
      ? Math.max(0, ms.ahorrosNecesarios - ms.availableSavings)
      : 0);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-900">
              {getOperationDisplayName(client)}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {AGENT_INFO.company} · {AGENT_INFO.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {owners.map((owner, index) => (
            <OwnerSection key={index} owner={owner} index={index} />
          ))}

          <Section title="Totales de la operación">
            <Row label="Copropietarios" value={formatTitularesLabel(client.numTitulares)} />
            <Row label="Ingresos totales" value={formatCurrency(client.income)} />
            <Row label="Ahorros totales" value={formatCurrency(client.availableSavings)} />
            <Row label="Deudas totales" value={formatCurrency(client.debts)} />
          </Section>

          <Section title="Información adicional">
            <Row label="Hijos" value={ai.children} />
            <Row label="Estado civil" value={ai.maritalStatus} />
            <Row label="Alquiler" value={ai.rental} />
            <Row label="Inmuebles" value={ai.properties} />
            <Row
              label="Valor vivienda objetivo"
              value={formatCurrency(ai.propertyValue ?? client.housePrice)}
            />
            <Row label="Zonas" value={ai.zonesOfInterest || client.zone} />
            {ai.observations ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Observaciones</dt>
                <dd className="mt-1 whitespace-pre-line rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                  {ai.observations}
                </dd>
              </div>
            ) : null}
          </Section>

          <Section title="Cálculo de hipoteca">
            <Row label="Titulares" value={formatTitularesLabel(client.numTitulares)} />
            <Row
              label="Financiación"
              value={client.financiacionPct ? `${client.financiacionPct}%` : undefined}
            />
            <Row
              label="Precio vivienda"
              value={formatCurrency(ms?.precioMaximoVivienda ?? client.housePrice)}
            />
            <Row
              label="Importe hipoteca"
              value={formatCurrency(ms?.importeHipoteca ?? client.mortgageAmount)}
            />
            <Row
              label="Cuota mensual"
              value={formatCurrency(ms?.cuotaMensual ?? client.monthlyPayment)}
            />
            <Row
              label="Plazo"
              value={
                ms?.loanTerm
                  ? `${ms.loanTerm} años`
                  : client.loanTerm
                    ? `${client.loanTerm} años`
                    : undefined
              }
            />
            <Row
              label="Tipo interés"
              value={
                ms?.hipotecaInterestRate
                  ? `${ms.hipotecaInterestRate}%`
                  : client.hipotecaInterestRate
                    ? `${client.hipotecaInterestRate}%`
                    : undefined
              }
            />
            <Row
              label="ITP"
              value={
                client.itpPercentage
                  ? `${client.itpPercentage}% (${formatCurrency(client.itpValue)})`
                  : undefined
              }
            />
            <Row label="Ahorros necesarios" value={formatCurrency(ms?.ahorrosNecesarios)} />
            <Row label="Notaría" value={formatCurrency(client.notaria)} />
            <Row label="Registro" value={formatCurrency(client.registro)} />
            <Row label="Gestoría" value={formatCurrency(client.gestoria)} />
            <Row label="Tasación" value={formatCurrency(client.tasacion)} />
            <Row label="Honorarios" value={formatCurrency(client.honorariosGSCapital)} />
            {shortfall > 0 ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-amber-700">
                  Financiación adicional sugerida
                </dt>
                <dd className="mt-1 rounded-md bg-amber-50 px-3 py-2 text-base font-bold text-amber-700">
                  {formatCurrency(shortfall)}
                </dd>
              </div>
            ) : null}
          </Section>

          {pl?.loanAmount ? (
            <Section title="Préstamo personal">
              <Row label="Importe" value={formatCurrency(pl.loanAmount)} />
              <Row
                label="Plazo"
                value={pl.loanTermYears ? `${pl.loanTermYears} años` : undefined}
              />
              <Row label="TIN" value={pl.tin ? `${pl.tin}%` : undefined} />
              <Row label="Cuota mensual" value={formatCurrency(pl.cuotaMensual)} />
              <Row label="Total adeudado" value={formatCurrency(pl.totalAdeudado)} />
            </Section>
          ) : null}

          <div className="rounded-md bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">Estado</p>
            <p className="mt-1 text-base font-semibold capitalize text-slate-900">
              {client.status}
            </p>
          </div>
        </div>

        <footer className="flex flex-wrap gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={() => void downloadClientSummary(client)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Descargar PDF para el cliente
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}