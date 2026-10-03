"use client";

import type { ReactNode } from "react";
import type { TabId } from "@/lib/gscapital/types";
import {
  AGENT_INFO,
  SIDEBAR_NAV,
  type SidebarIconKey,
  type SidebarItem,
} from "@/lib/gscapital/constants";

type IconProps = { className?: string };

const Icons: Record<SidebarIconKey, (props: IconProps) => ReactNode> = {
  home: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  calc: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 19h2M12 19h2M16 19h0" />
    </svg>
  ),
  coin: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  ),
  users: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  building: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </svg>
  ),
  file: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  ),
  grid: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  settings: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M5 12H1M23 12h-5" />
    </svg>
  ),
};

export function Sidebar({
  activeTab,
  onChange,
  userEmail,
  onLogout,
  darkMode,
  onToggleDarkMode,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  userEmail?: string | null;
  onLogout?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  const groups: Array<{ key: SidebarItem["group"]; title: string }> = [
    { key: "principal", title: "Principal" },
    { key: "datos", title: "Datos y colaboradores" },
    { key: "herramientas", title: "Herramientas" },
  ];

  const initials = (AGENT_INFO.name || "DH")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-100">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M4 13 12 5l8 8" />
            <path d="M7 11v8h10v-8" />
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-white">livendia</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Plataforma financiera</span>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4 pt-2">
        {groups.map((group) => {
          const items = SIDEBAR_NAV.filter((item) => item.group === group.key);
          return (
            <div key={group.key}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = activeTab === item.id;
                  const ItemIcon = Icons[item.icon];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChange(item.id)}
                      className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      }`}
                    >
                      <ItemIcon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{AGENT_INFO.name}</p>
            <p className="truncate text-xs text-slate-400">
              {userEmail ?? AGENT_INFO.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Cambiar tema"
            title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5M21 12H9" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-slate-400">
          <span className="rounded-full bg-blue-600/15 px-2 py-0.5 font-medium text-blue-300">Plan Pro</span>
          <span>v2.2</span>
        </div>
      </div>
    </aside>
  );
}