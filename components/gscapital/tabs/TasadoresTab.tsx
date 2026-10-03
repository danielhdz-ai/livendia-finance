"use client";

import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import {
  CollaboratorManager,
  type CollaboratorConfig,
} from "@/components/gscapital/tabs/CollaboratorManager";
import type { Tasador } from "@/lib/gscapital/types";

const emptyForm: Tasador = {
  id: "",
  empresa: "",
  name: "",
  phone: "",
  email: "",
  zona: "",
  notas: "",
};

export function TasadoresTab() {
  const { tasadores, saveTasador, deleteTasador } = useGSCapital();

  const config: CollaboratorConfig<Tasador> = {
    title: "Tasadores y Peritos",
    description: "Empresas y profesionales para las tasaciones de tus operaciones.",
    itemName: "Tasador",
    emptyMessage: "Aún no tienes tasadores registrados.",
    accentLabel: (item) => item.empresa || "Sin empresa",
    fields: [
      { key: "empresa", label: "Empresa / Entidad", required: true, placeholder: "Tinsa, Euroval…" },
      { key: "name", label: "Nombre del tasador", required: true, placeholder: "Tu contacto" },
      { key: "phone", label: "Teléfono", type: "tel", placeholder: "+34 …" },
      { key: "email", label: "Correo electrónico", type: "email", placeholder: "contacto@tasadora.com" },
      { key: "zona", label: "Zona de cobertura", placeholder: "Cataluña, Madrid…" },
      { key: "notas", label: "Notas / Condiciones", multiline: true, span: 2, placeholder: "Plazos, tarifas…" },
    ],
    listColumns: [
      { label: "Nombre", get: (i) => i.name },
      { label: "Empresa", get: (i) => i.empresa },
      { label: "Teléfono", get: (i) => i.phone },
      { label: "Email", get: (i) => i.email },
      { label: "Zona", get: (i) => i.zona },
      { label: "Notas", get: (i) => i.notas },
    ],
    searchFields: (i) =>
      [i.empresa, i.name, i.phone, i.email, i.zona, i.notas]
        .filter(Boolean)
        .join(" "),
    makeEmpty: () => emptyForm,
    api: {
      save: saveTasador,
      remove: deleteTasador,
    },
  };

  return <CollaboratorManager items={tasadores} config={config} />;
}