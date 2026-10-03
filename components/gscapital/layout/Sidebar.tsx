"use client";

import Image from "next/image";
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
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

export function Sidebar({
  activeTab,
  onChange,
  userEmail,
  onLogout,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  userEmail?: string | null;
  onLogout?: () => void;
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

  const displayName = userEmail ?? AGENT_INFO.email;
  const compactEmail = displayName.length > 22 ? `${displayName.slice(0, 21)}…` : displayName;

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0b3fb0] text-white shadow-xl">
      <div className="flex items-center gap-3 px-5 pb-6">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/20">
          <Image
            src="/logo-livendia.png"
            alt="Livendia Finance"
            width={40}
            height={40}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-white">livendia</span>
          <span className="truncate text-[10px] uppercase tracking-[0.18em] text-white/70">
            Plataforma financiera
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4 pt-1">
        {groups.map((group) => {
          const items = SIDEBAR_NAV.filter((item) => item.group === group.key);
          return (
            <div key={group.key}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">
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
                          ? "bg-white/15 text-white shadow-inner ring-1 ring-white/10"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <ItemIcon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive ? "text-white" : "text-white/70 group-hover:text-white"
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

      <div className="border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 rounded-md px-2 py-2">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0b3fb0]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white" title={AGENT_INFO.name}>
              {AGENT_INFO.name}
            </p>
            <p className="truncate text-[11px] text-white/70" title={displayName}>
              {compactEmail}
            </p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
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
        <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-white/70">
          <span className="rounded-full bg-white/15 px-2 py-0.5 font-semibold text-white">Plan Pro</span>
          <span>v2.2</span>
        </div>
      </div>
    </aside>
  );
}