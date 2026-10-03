"use client";

import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import {
  CollaboratorManager,
  type CollaboratorConfig,
} from "@/components/gscapital/tabs/CollaboratorManager";
import type { Collaborator } from "@/lib/gscapital/types";

const emptyForm: Collaborator = {
  id: "",
  bank: "",
  name: "",
  phone: "",
  email: "",
  office: "",
  conditions: "",
};

export function ColaboradoresTab() {
  const { collaborators, saveCollaborator, deleteCollaborator } = useGSCapital();

  const config: CollaboratorConfig<Collaborator> = {
    title: "Colaboradores de Banca",
    description: "Contactos bancarios con los que trabajas habitualmente.",
    itemName: "Colaborador",
    emptyMessage: "Aún no tienes colaboradores bancarios.",
    accentLabel: (item) => item.bank || "Sin banco",
    fields: [
      { key: "bank", label: "Banco", required: true, placeholder: "CaixaBank, BBVA…" },
      { key: "name", label: "Nombre", required: true, placeholder: "Tu contacto" },
      { key: "phone", label: "Teléfono", type: "tel", placeholder: "+34 …" },
      { key: "email", label: "Correo electrónico", type: "email", placeholder: "contacto@banco.com" },
      { key: "office", label: "Oficina", placeholder: "Sucursal o zona" },
      { key: "conditions", label: "Condiciones", multiline: true, span: 2, placeholder: "Tipos, condiciones especiales…" },
    ],
    listColumns: [
      { label: "Nombre", get: (i) => i.name },
      { label: "Banco", get: (i) => i.bank },
      { label: "Teléfono", get: (i) => i.phone },
      { label: "Email", get: (i) => i.email },
      { label: "Oficina", get: (i) => i.office },
      { label: "Notas", get: (i) => i.conditions },
    ],
    searchFields: (i) =>
      [i.bank, i.name, i.phone, i.email, i.office, i.conditions]
        .filter(Boolean)
        .join(" "),
    makeEmpty: () => emptyForm,
    api: {
      save: saveCollaborator,
      remove: deleteCollaborator,
    },
  };

  return <CollaboratorManager items={collaborators} config={config} />;
}