"use client";

import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import type { TabId } from "@/lib/gscapital/types";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  primary?: boolean;
  badge?: string;
  icon: (props: { className?: string }) => React.ReactNode;
  target: TabId;
};

const ACTIONS: QuickAction[] = [
  {
    id: "asesoramiento",
    title: "Nuevo estudio",
    description: "Empieza un estudio financiero",
    primary: true,
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 19h2M12 19h2M16 19h0" />
      </svg>
    ),
    target: "asesoramiento",
  },
  {
    id: "hipoteca",
    title: "Calcular hipoteca",
    description: "Estimar capacidad de compra",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
    target: "hipoteca",
  },
  {
    id: "database",
    title: "Base de clientes",
    description: "Consultar operaciones",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3" />
      </svg>
    ),
    target: "database",
  },
  {
    id: "colaboradores",
    title: "Colaboradores",
    description: "Banca, notarías, tasadores",
    badge: "Red",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    target: "colaboradores",
  },
];

const SETUP_STEPS = [
  { id: "perfil", label: "Perfil profesional", completed: true },
  { id: "clientes", label: "Primer cliente", completed: false, active: true },
  { id: "catalogo", label: "Productos financieros", completed: true },
  { id: "banco", label: "Colaborador bancario", completed: false },
  { id: "aeat", label: "Encargo firmado", completed: false, optional: true },
];

export function DashboardOverview() {
  const { clients, setActiveTab, darkMode } = useGSCapital();

  const completed = SETUP_STEPS.filter((step) => step.completed).length;
  const total = SETUP_STEPS.length;
  const progressPct = Math.round((completed / total) * 100);
  const nextStep = SETUP_STEPS.find((step) => step.active) ?? SETUP_STEPS.find((step) => !step.completed);

  return (
    <div className="mb-8 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Configuración inicial</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {progressPct}% listo para tu próximo estudio financiero
              </h2>
              <p className="text-sm text-slate-600">
                Siguiente: <span className="font-semibold text-slate-900">{nextStep?.label}</span> — completa los pasos para empezar.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Asistente completo
                </button>
              </div>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2 lg:w-96">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {completed} de {total} pasos completados
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SETUP_STEPS.map((step) => {
              const status = step.completed
                ? "done"
                : step.active
                  ? "active"
                  : "pending";
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                    darkMode
                      ? status === "done"
                        ? "bg-emerald-500/10 text-emerald-100"
                        : status === "active"
                          ? "bg-blue-500/10 text-blue-100"
                          : "bg-slate-800 text-slate-300"
                      : status === "done"
                        ? "bg-emerald-50 text-emerald-700"
                        : status === "active"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                      status === "done"
                        ? darkMode
                          ? "bg-emerald-500 text-white"
                          : "bg-emerald-500 text-white"
                        : status === "active"
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "bg-slate-700 text-slate-400"
                            : "bg-white text-slate-400 ring-1 ring-slate-200"
                    }`}
                  >
                    {status === "done" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    ) : status === "active" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <path d="M5 12h14" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate font-medium">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              ¡Hola! <span aria-hidden>👋</span>
            </h2>
            <p className="text-sm text-slate-500">
              Da el primer paso y empieza a captar nuevas operaciones hoy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("database")}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            + Nuevo cliente
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => setActiveTab(action.target)}
              className={`group relative flex flex-col gap-2 rounded-xl p-5 text-left transition ${
                action.primary
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-blue-300 hover:shadow"
              }`}
            >
              <div className="flex items-center justify-between">
                <action.icon
                  className={`h-5 w-5 ${
                    action.primary ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                  }`}
                />
                {action.badge ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      action.primary
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {action.badge}
                  </span>
                ) : null}
              </div>
              <p className="text-base font-semibold">{action.title}</p>
              <p
                className={`text-xs ${
                  action.primary ? "text-white/80" : "text-slate-500"
                }`}
              >
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Operaciones activas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {clients.filter((c) => c.status === "activo" || c.status === "pendiente").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            de {clients.length} totales en base de datos
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Aprobadas</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {clients.filter((c) => c.status === "aprobado").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Operaciones con financiación concedida</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {clients.filter((c) => c.status === "pendiente").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Esperando respuesta de la entidad</p>
        </div>
      </div>
    </div>
  );
}