"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Field,
  Input,
  Panel,
  PrimaryButton,
  SecondaryButton,
  Tag,
  TextArea,
} from "@/components/gscapital/ui/Panel";
import { createId } from "@/lib/gscapital/format";

export type CollaboratorField<T> = {
  key: keyof T;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  span?: 1 | 2;
};

type SaveDelete<T> = {
  save: (item: T) => Promise<void> | void;
  remove: (id: string) => Promise<void> | void;
};

export type CollaboratorConfig<T> = {
  title: string;
  description: string;
  itemName: string;
  emptyMessage: string;
  accentLabel: (item: T) => string;
  fields: CollaboratorField<T>[];
  listColumns: { label: string; get: (item: T) => string | undefined }[];
  searchFields: (item: T) => string;
  makeEmpty: () => T;
  api: SaveDelete<T>;
};

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.charAt(0) ?? "") + (parts[1]?.charAt(0) ?? "")).toUpperCase() || "•";
}

function FieldInput<T>({
  field,
  value,
  onChange,
}: {
  field: CollaboratorField<T>;
  value: string;
  onChange: (next: string) => void;
}) {
  if (field.multiline) {
    return (
      <TextArea
        rows={4}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return (
    <Input
      type={field.type ?? "text"}
      required={field.required}
      placeholder={field.placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function CollaboratorManager<T extends { id: string }>({
  items,
  config,
}: {
  items: T[];
  config: CollaboratorConfig<T>;
}) {
  const [form, setForm] = useState<T>(config.makeEmpty());
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleEdit(item: T) {
    setForm(item);
    setOpenMenuId(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(id: string) {
    setOpenMenuId(null);
    await config.api.remove(id);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const requiredOk = config.fields
      .filter((f) => f.required)
      .every((f) => String(form[f.key] ?? "").trim().length > 0);
    if (!requiredOk) return;
    await config.api.save({ ...form, id: form.id || createId() });
    setForm(config.makeEmpty());
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      config.searchFields(item).toLowerCase().includes(term),
    );
  }, [items, search, config]);

  const total = items.length;
  const visible = filtered.length;
  const isEditing = Boolean(form.id);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {config.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <span className="block text-2xl font-bold text-slate-900">{total}</span>
          {config.itemName.toLowerCase()}{total === 1 ? "" : "es"} en la red
        </div>
      </header>

      <Panel
        title={isEditing ? `Editar ${config.itemName.toLowerCase()}` : `Añadir ${config.itemName.toLowerCase()}`}
        description={
          isEditing
            ? "Modifica los datos y guarda los cambios."
            : `Rellena los campos para añadir un ${config.itemName.toLowerCase()} a tu red.`
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {config.fields.map((field) => (
              <Field
                key={String(field.key)}
                label={field.label}
                className={field.span === 2 ? "md:col-span-2" : undefined}
              >
                <FieldInput
                  field={field}
                  value={String(form[field.key] ?? "")}
                  onChange={(next) => setForm({ ...form, [field.key]: next })}
                />
              </Field>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
            <PrimaryButton type="submit">
              {isEditing ? "Guardar cambios" : `+ Añadir ${config.itemName.toLowerCase()}`}
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={() => setForm(config.makeEmpty())}
            >
              {isEditing ? "Cancelar edición" : "Limpiar formulario"}
            </SecondaryButton>
          </div>
        </form>
      </Panel>

      <Panel
        title={`Listado de ${config.itemName.toLowerCase()}s`}
        description={
          search.trim()
            ? `Mostrando ${visible} de ${total} que coinciden con "${search}".`
            : `${total} ${config.itemName.toLowerCase()}${total === 1 ? "" : "es"} en tu red.`
        }
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Buscar ${config.itemName.toLowerCase()}s…`}
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              {search.trim() ? "Sin coincidencias" : config.emptyMessage}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {search.trim()
                ? "Prueba con otro término de búsqueda."
                : `Añade el primero usando el panel superior.`}
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            ref={menuContainerRef}
          >
            {filtered.map((item, index) => {
              const primary = config.listColumns[0]?.get(item) ?? "";
              const secondary = config.listColumns[1]?.get(item) ?? "";
              return (
                <article
                  key={item.id}
                  className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                  data-index={index}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {initialsOf(primary)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-slate-900" title={primary || ""}>
                        {primary || "—"}
                      </h4>
                      {secondary ? (
                        <p className="truncate text-xs text-slate-600" title={secondary}>
                          {secondary}
                        </p>
                      ) : null}
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Acciones"
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={() =>
                          setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }
                      >
                        <MoreIcon className="h-4 w-4" />
                      </button>
                      {openMenuId === item.id ? (
                        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <PencilIcon className="h-4 w-4 text-slate-500" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(item.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <dl className="mt-4 space-y-2 text-xs">
                    {config.listColumns.slice(2).map((col) => {
                      const value = col.get(item);
                      if (!value) return null;
                      return (
                        <div
                          key={col.label}
                          className="flex items-start justify-between gap-3"
                        >
                          <dt className="text-slate-500">{col.label}</dt>
                          <dd className="max-w-[60%] text-right font-medium text-slate-700">
                            {value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <Tag tone="info">{config.accentLabel(item)}</Tag>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}