"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/gscapital/layout/AppHeader";
import { Sidebar } from "@/components/gscapital/layout/Sidebar";
import { AsesoramientoTab } from "@/components/gscapital/tabs/AsesoramientoTab";
import { ColaboradoresTab } from "@/components/gscapital/tabs/ColaboradoresTab";
import { ConfiguracionTab } from "@/components/gscapital/tabs/ConfiguracionTab";
import { DatabaseTab } from "@/components/gscapital/tabs/DatabaseTab";
import { HipotecaTab } from "@/components/gscapital/tabs/HipotecaTab";
import { InmobiliariosTab } from "@/components/gscapital/tabs/InmobiliariosTab";
import { NotariasTab } from "@/components/gscapital/tabs/NotariasTab";
import { PrestamoTab } from "@/components/gscapital/tabs/PrestamoTab";
import { TasadoresTab } from "@/components/gscapital/tabs/TasadoresTab";
import {
  GSCapitalProvider,
  useGSCapital,
} from "@/components/gscapital/GSCapitalContext";
import { AGENT_INFO } from "@/lib/gscapital/constants";
import { createClient } from "@/lib/supabase/client";

function TabContent() {
  const { activeTab, loading } = useGSCapital();

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="h-full">
      {activeTab === "asesoramiento" ? <AsesoramientoTab /> : null}
      {activeTab === "hipoteca" ? <HipotecaTab /> : null}
      {activeTab === "prestamo" ? <PrestamoTab /> : null}
      {activeTab === "database" ? <DatabaseTab /> : null}
      {activeTab === "colaboradores" ? <ColaboradoresTab /> : null}
      {activeTab === "inmobiliarios" ? <InmobiliariosTab /> : null}
      {activeTab === "notarias" ? <NotariasTab /> : null}
      {activeTab === "tasadores" ? <TasadoresTab /> : null}
      {activeTab === "configuracion" ? <ConfiguracionTab /> : null}
    </div>
  );
}

function GSCapitalShell() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useGSCapital();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onChange={setActiveTab}
        userEmail={userEmail}
        onLogout={() => void handleLogout()}
      />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto h-full max-w-7xl px-6 py-6">
            <TabContent />
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white px-6 py-3 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {AGENT_INFO.company} · Todos los derechos reservados
        </footer>
      </div>
    </div>
  );
}

export function GSCapitalApp() {
  return (
    <GSCapitalProvider>
      <GSCapitalShell />
    </GSCapitalProvider>
  );
}