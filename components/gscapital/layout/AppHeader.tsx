"use client";

import { useEffect, useState } from "react";
import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import { NAV_BY_TAB } from "@/lib/gscapital/constants";

export function AppHeader() {
  const { activeTab, setActiveTab } = useGSCapital();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue("");
  }, [activeTab]);

  const currentLabel = NAV_BY_TAB[activeTab];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="hidden items-center gap-2 md:flex">
          <h2 className="text-lg font-semibold text-slate-800">{currentLabel}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Dashboard</span>
        </div>

        <div className="relative ml-auto w-full max-w-md">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Buscar clientes, operaciones o herramientas..."
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-16 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline">
            ⌘K
          </kbd>
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notificaciones"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800 md:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
          Ayuda
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("asesoramiento")}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo cliente
        </button>
      </div>
    </header>
  );
}