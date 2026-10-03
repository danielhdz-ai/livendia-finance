"use client";

import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import {
  CollaboratorManager,
  type CollaboratorConfig,
} from "@/components/gscapital/tabs/CollaboratorManager";
import type { Notaria } from "@/lib/gscapital/types";

const emptyForm: Notaria = {
  id: "",
  notaria: "",
  name: "",
  phone: "",
  email: "",
  zona: "",
  notas: "",
};

export function NotariasTab() {
  const { notarias, saveNotaria, deleteNotaria } = useGSCapital();

  const config: CollaboratorConfig<Notaria> = {
    title: "Colaboradores de Notarías",
    description: "Notarios y notarías con los que firmas operaciones.",
    itemName: "Colaborador",
    emptyMessage: "Aún no tienes colaboradores de notarías.",
    accentLabel: (item) => item.notaria || "Sin notaría",
    fields: [
      { key: "notaria", label: "Notaría", required: true, placeholder: "Notaría Pérez & Asociados" },
      { key: "name", label: "Nombre del contacto", required: true, placeholder: "Tu contacto" },
      { key: "phone", label: "Teléfono", type: "tel", placeholder: "+34 …" },
      { key: "email", label: "Correo electrónico", type: "email", placeholder: "contacto@notaria.com" },
      { key: "zona", label: "Zona", placeholder: "Centro, Sarrià…" },
      { key: "notas", label: "Notas / Condiciones", multiline: true, span: 2, placeholder: "Aranceles, plazos…" },
    ],
    listColumns: [
      { label: "Nombre", get: (i) => i.name },
      { label: "Notaría", get: (i) => i.notaria },
      { label: "Teléfono", get: (i) => i.phone },
      { label: "Email", get: (i) => i.email },
      { label: "Zona", get: (i) => i.zona },
      { label: "Notas", get: (i) => i.notas },
    ],
    searchFields: (i) =>
      [i.notaria, i.name, i.phone, i.email, i.zona, i.notas]
        .filter(Boolean)
        .join(" "),
    makeEmpty: () => emptyForm,
    api: {
      save: saveNotaria,
      remove: deleteNotaria,
    },
  };

  return <CollaboratorManager items={notarias} config={config} />;
}