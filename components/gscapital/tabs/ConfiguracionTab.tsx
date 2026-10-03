"use client";

import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import { Panel, PrimaryButton, SecondaryButton } from "@/components/gscapital/ui/Panel";

export function ConfiguracionTab() {
  const {
    clients,
    collaborators,
    inmobiliarios,
    notarias,
    tasadores,
    replaceAllData,
    refreshAll,
  } = useGSCapital();

  function downloadEncargo() {
    const link = document.createElement("a");
    link.href = "/Livendia_Encargo_Servicios_Financiacion.docx";
    link.download = "Livendia_Encargo_Servicios_Financiacion.docx";
    link.click();
  }

  function exportJson() {
    const blob = new Blob(
      [
        JSON.stringify(
          { clients, collaborators, inmobiliarios, notarias, tasadores },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `livendia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(String(reader.result)) as {
          clients?: typeof clients;
          collaborators?: typeof collaborators;
          inmobiliarios?: typeof inmobiliarios;
          notarias?: typeof notarias;
          tasadores?: typeof tasadores;
        };
        await replaceAllData({
          clients: data.clients ?? [],
          collaborators: data.collaborators ?? [],
          inmobiliarios: data.inmobiliarios ?? [],
          notarias: data.notarias ?? [],
          tasadores: data.tasadores ?? [],
        });
      } catch {
        // Silently handle invalid JSON — no notifications shown to the user.
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configuración y Gestión de Datos</h2>
      <Panel>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Exportar Datos</h3>
            <p className="mb-4 text-gray-600">
              Guarda una copia de clientes, colaboradores bancarios, inmobiliarios, notarías y tasadores.
            </p>
            <PrimaryButton type="button" onClick={exportJson}>
              Exportar a JSON
            </PrimaryButton>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Importar Datos</h3>
            <p className="mb-4 text-gray-600">
              Carga datos desde JSON y reemplaza la información actual.
            </p>
            <label className="inline-block">
              <PrimaryButton type="button">Importar desde JSON</PrimaryButton>
              <input type="file" accept=".json" className="hidden" onChange={importJson} />
            </label>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="mb-3 text-lg font-semibold">Encargo</h3>
          <p className="mb-4 text-gray-600">
            Descarga la plantilla de encargo de servicios de financiación en Word para rellenarla con el cliente.
          </p>
          <PrimaryButton type="button" onClick={downloadEncargo}>
            Descargar encargo (.docx)
          </PrimaryButton>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="mb-3 text-lg font-semibold">Sincronización</h3>
          <p className="mb-4 text-gray-600">
            Recarga todos los datos desde la nube.
          </p>
          <SecondaryButton type="button" onClick={() => void refreshAll()}>
            Recargar datos
          </SecondaryButton>
        </div>
      </Panel>
    </div>
  );
}
