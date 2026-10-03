"use client";

import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import {
  CollaboratorManager,
  type CollaboratorConfig,
} from "@/components/gscapital/tabs/CollaboratorManager";
import type { Inmobiliario } from "@/lib/gscapital/types";

const emptyForm: Inmobiliario = {
  id: "",
  inmobiliaria: "",
  name: "",
  phone: "",
  email: "",
  zona: "",
  notas: "",
};

export function InmobiliariosTab() {
  const { inmobiliarios, saveInmobiliario, deleteInmobiliario } = useGSCapital();

  const config: CollaboratorConfig<Inmobiliario> = {
    title: "Colaboradores Inmobiliarios",
    description: "Agencias y agentes con los que trabajas en operaciones.",
    itemName: "Colaborador",
    emptyMessage: "Aún no tienes colaboradores inmobiliarios.",
    accentLabel: (item) => item.inmobiliaria || "Sin inmobiliaria",
    fields: [
      { key: "inmobiliaria", label: "Inmobiliaria / Agencia", required: true, placeholder: "Engel & Völkers, Coldwell Banker…" },
      { key: "name", label: "Nombre del agente", required: true, placeholder: "Tu contacto" },
      { key: "phone", label: "Teléfono", type: "tel", placeholder: "+34 …" },
      { key: "email", label: "Correo electrónico", type: "email", placeholder: "contacto@inmo.com" },
      { key: "zona", label: "Zona de trabajo", placeholder: "Eixample, Gràcia…" },
      { key: "notas", label: "Notas / Condiciones", multiline: true, span: 2, placeholder: "Comisiones, exclusividad…" },
    ],
    listColumns: [
      { label: "Nombre", get: (i) => i.name },
      { label: "Inmobiliaria", get: (i) => i.inmobiliaria },
      { label: "Teléfono", get: (i) => i.phone },
      { label: "Email", get: (i) => i.email },
      { label: "Zona", get: (i) => i.zona },
      { label: "Notas", get: (i) => i.notas },
    ],
    searchFields: (i) =>
      [i.inmobiliaria, i.name, i.phone, i.email, i.zona, i.notas]
        .filter(Boolean)
        .join(" "),
    makeEmpty: () => emptyForm,
    api: {
      save: saveInmobiliario,
      remove: deleteInmobiliario,
    },
  };

  return <CollaboratorManager items={inmobiliarios} config={config} />;
}