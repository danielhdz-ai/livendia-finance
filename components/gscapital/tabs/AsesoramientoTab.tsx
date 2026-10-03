"use client";

import { useEffect, useMemo, useState } from "react";
import { useGSCapital } from "@/components/gscapital/GSCapitalContext";
import {
  Field,
  Input,
  Panel,
  PrimaryButton,
  SecondaryButton,
  Select,
  Tag,
  TextArea,
} from "@/components/gscapital/ui/Panel";
import { AGENT_INFO } from "@/lib/gscapital/constants";
import {
  aggregateOwnerTotals,
  ensureOwnersForCount,
  getOperationDisplayName,
  getOwnerCount,
  type OwnerCount,
} from "@/lib/gscapital/owners";
import type { Client, OwnerData } from "@/lib/gscapital/types";

function buildClientFromForm(
  current: Client,
  form: FormData,
  ownerCount: OwnerCount,
): Client {
  const owners: OwnerData[] = [];
  for (let i = 0; i < ownerCount; i += 1) {
    owners.push({
      fullName: String(form.get(`owner${i}FullName`) ?? ""),
      age: String(form.get(`owner${i}Age`) ?? ""),
      nationality: String(form.get(`owner${i}Nationality`) ?? ""),
      phone: String(form.get(`owner${i}Phone`) ?? ""),
      dni: String(form.get(`owner${i}DNI`) ?? ""),
      bank: String(form.get(`owner${i}Bank`) ?? ""),
      email: String(form.get(`owner${i}Email`) ?? ""),
      company: String(form.get(`owner${i}Company`) ?? ""),
      contractType: String(form.get(`owner${i}ContractType`) ?? ""),
      seniority: String(form.get(`owner${i}Seniority`) ?? ""),
      payslips: String(form.get(`owner${i}Payslips`) ?? ""),
      savings: String(form.get(`owner${i}Savings`) ?? ""),
      loans: String(form.get(`owner${i}Loans`) ?? ""),
    });
  }

  const totals = aggregateOwnerTotals(owners);
  const displayName = getOperationDisplayName({ ...current, owners });

  const additionalInfo = {
    children: String(form.get("clientChildren") ?? ""),
    properties: String(form.get("clientProperties") ?? ""),
    rental: String(form.get("clientRental") ?? ""),
    maritalStatus: String(form.get("clientMaritalStatus") ?? ""),
    propertyValue: String(form.get("clientPropertyValue") ?? ""),
    zonesOfInterest: String(form.get("clientZonesOfInterest") ?? ""),
    observations: String(form.get("clientObservations") ?? ""),
  };

  return {
    ...current,
    name: displayName,
    owners,
    personalData: owners[0],
    numTitulares: String(ownerCount),
    zone: additionalInfo.zonesOfInterest || current.zone,
    income: totals.income,
    availableSavings: totals.savings,
    debts: totals.debts,
    housePrice: additionalInfo.propertyValue.trim()
      ? parseFloat(additionalInfo.propertyValue) || 0
      : 0,
    additionalInfo,
  };
}

const STATUS_TONE: Record<
  Client["status"],
  React.ComponentProps<typeof Tag>["tone"]
> = {
  pendiente: "warning",
  aprobado: "success",
  rechazado: "danger",
  activo: "info",
  noactivo: "neutral",
};

function OwnerFields({
  index,
  owner,
}: {
  index: number;
  owner: OwnerData;
}) {
  const prefix = `owner${index}`;
  const labels = ["Primer titular", "Segundo titular", "Tercer titular"];

  return (
    <Panel
      title={`${labels[index]}`}
      description={`Datos del copropietario ${index + 1} de la operación.`}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Nombre completo" className="lg:col-span-2">
          <Input name={`${prefix}FullName`} defaultValue={owner.fullName ?? ""} />
        </Field>
        <Field label="Edad">
          <Input name={`${prefix}Age`} defaultValue={owner.age ?? ""} placeholder="Ej: 30" />
        </Field>
        <Field label="Nacionalidad">
          <Input name={`${prefix}Nationality`} defaultValue={owner.nationality ?? ""} />
        </Field>
        <Field label="Teléfono">
          <Input name={`${prefix}Phone`} defaultValue={owner.phone ?? ""} placeholder="+34..." />
        </Field>
        <Field label="DNI/NIE">
          <Input name={`${prefix}DNI`} defaultValue={owner.dni ?? ""} />
        </Field>
        <Field label="Correo Electrónico" className="lg:col-span-2">
          <Input name={`${prefix}Email`} type="email" defaultValue={owner.email ?? ""} />
        </Field>
        <Field label="Empresa">
          <Input name={`${prefix}Company`} defaultValue={owner.company ?? ""} />
        </Field>
        <Field label="Tipo de Contrato">
          <Input name={`${prefix}ContractType`} defaultValue={owner.contractType ?? ""} placeholder="Indefinido, temporal..." />
        </Field>
        <Field label="Antigüedad">
          <Input name={`${prefix}Seniority`} defaultValue={owner.seniority ?? ""} placeholder="Ej: 5 años" />
        </Field>
        <Field label="Su Banco">
          <Input name={`${prefix}Bank`} defaultValue={owner.bank ?? ""} placeholder="Banco principal" />
        </Field>
        <Field label="Nómina mensual (€)">
          <Input name={`${prefix}Payslips`} type="number" defaultValue={owner.payslips ?? ""} placeholder="0,00" />
        </Field>
        <Field label="Ahorros para hipoteca (€)">
          <Input name={`${prefix}Savings`} type="number" defaultValue={owner.savings ?? ""} placeholder="0,00" />
        </Field>
        <Field label="Cuotas de préstamos (€)">
          <Input name={`${prefix}Loans`} type="number" defaultValue={owner.loans ?? ""} placeholder="0,00" />
        </Field>
      </div>
    </Panel>
  );
}

export function AsesoramientoTab() {
  const { currentClient, createClient, updateClient, setCurrentClient, clients } =
    useGSCapital();
  const [formKey, setFormKey] = useState(0);
  const [ownerCount, setOwnerCount] = useState<OwnerCount>(() =>
    getOwnerCount(currentClient),
  );

  useEffect(() => {
    setOwnerCount(getOwnerCount(currentClient));
  }, [currentClient]);

  const owners = useMemo(
    () => ensureOwnersForCount(currentClient, ownerCount),
    [currentClient, ownerCount, formKey],
  );

  async function handleNewClient() {
    const count = ownerCount;
    const promptMessage =
      count === 1
        ? "Ingrese el nombre del titular:"
        : `Ingrese el nombre del primer titular (${count} copropietarios en la operación):`;
    const name = prompt(promptMessage);
    if (!name?.trim()) return;
    try {
      await createClient(name.trim(), count);
      setFormKey((value) => value + 1);
    } catch {
      alert("No se pudo guardar el cliente en Supabase.");
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentClient) {
      alert("Cree un nuevo cliente primero.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const updated = buildClientFromForm(currentClient, form, ownerCount);
    try {
      await updateClient(updated);
      alert("Información guardada correctamente en Supabase.");
    } catch {
      alert("No se pudo guardar en Supabase.");
    }
  }

  function handleClear() {
    setCurrentClient(null);
    setOwnerCount(1);
    setFormKey((value) => value + 1);
  }

  const ai = currentClient?.additionalInfo ?? {};

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Panel
        title="Asesoramiento Financiero"
        description="Tu información profesional y la operación en curso."
      >
        <dl className="mb-6 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Asesor
            </dt>
            <dd className="mt-0.5 font-medium text-slate-900">{AGENT_INFO.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Dirección
            </dt>
            <dd className="mt-0.5 text-slate-700">{AGENT_INFO.address}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Teléfono
            </dt>
            <dd className="mt-0.5 text-slate-700">{AGENT_INFO.landline}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Web
            </dt>
            <dd className="mt-0.5 text-slate-700">{AGENT_INFO.website}</dd>
          </div>
        </dl>

        <div className="border-t border-slate-200 pt-5">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Operación actual</h4>
          {currentClient ? (
            <div className="space-y-3">
              <p className="text-base font-semibold text-slate-900">
                {getOperationDisplayName(currentClient)}
              </p>
              <p className="text-xs text-slate-500">
                {ownerCount} copropietario{ownerCount > 1 ? "s" : ""} en la misma operación
              </p>
              <Field label="Estado">
                <Select
                  value={currentClient.status}
                  onChange={(event) =>
                    void updateClient({
                      ...currentClient,
                      status: event.target.value as Client["status"],
                    })
                  }
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="activo">Activo</option>
                  <option value="noactivo">No Activo</option>
                </Select>
              </Field>
              <div>
                <Tag tone={STATUS_TONE[currentClient.status]} className="capitalize">
                  {currentClient.status}
                </Tag>
              </div>
            </div>
          ) : (
            <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">
              No hay operación seleccionada. Crea una nueva para empezar.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
          <PrimaryButton type="button" className="w-full" onClick={handleNewClient}>
            + Nueva operación
          </PrimaryButton>
          <SecondaryButton type="button" className="w-full" onClick={handleClear}>
            Limpiar campos
          </SecondaryButton>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Total operaciones en base de datos:{" "}
          <span className="font-semibold text-slate-900">{clients.length}</span>
        </p>
      </Panel>

      <form key={`${formKey}-${ownerCount}`} onSubmit={handleSave} className="space-y-6">
        <Panel title="Copropietarios de la operación">
          <Field
            label="Número de titulares en la financiación"
            hint="Todos los titulares forman parte de la misma operación de financiación."
          >
            <Select
              value={String(ownerCount)}
              onChange={(event) => {
                setOwnerCount(parseInt(event.target.value, 10) as OwnerCount);
              }}
            >
              <option value="1">1 titular</option>
              <option value="2">2 copropietarios</option>
              <option value="3">3 copropietarios</option>
            </Select>
          </Field>
        </Panel>

        {owners.map((owner, index) => (
          <OwnerFields key={index} index={index} owner={owner} />
        ))}

        <Panel title="Información adicional de la operación">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Hijos"><Input name="clientChildren" defaultValue={ai.children ?? ""} /></Field>
            <Field label="Estado civil"><Input name="clientMaritalStatus" defaultValue={ai.maritalStatus ?? ""} /></Field>
            <Field label="¿Está en alquiler?">
              <Select name="clientRental" defaultValue={ai.rental ?? ""}>
                <option value="">Seleccionar</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </Select>
            </Field>
            <Field label="Inmuebles capitalizados"><Input name="clientProperties" defaultValue={ai.properties ?? ""} /></Field>
            <Field label="Valor de la vivienda objetivo (€)" hint="Opcional. Déjalo vacío para estimarlo en la calculadora.">
              <Input
                name="clientPropertyValue"
                type="text"
                inputMode="decimal"
                defaultValue={
                  ai.propertyValue && String(ai.propertyValue) !== "0"
                    ? ai.propertyValue
                    : currentClient?.housePrice && currentClient.housePrice > 0
                      ? currentClient.housePrice
                      : ""
                }
                placeholder="0,00"
              />
            </Field>
            <Field label="Zonas de interés"><Input name="clientZonesOfInterest" defaultValue={ai.zonesOfInterest ?? currentClient?.zone ?? ""} placeholder="Ej: Eixample, Gràcia..." /></Field>
            <div className="md:col-span-2 lg:col-span-3">
              <Field label="Observaciones">
                <TextArea name="clientObservations" rows={4} defaultValue={ai.observations ?? ""} />
              </Field>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
            <PrimaryButton type="submit">Guardar información</PrimaryButton>
            <SecondaryButton type="button" onClick={handleClear}>
              Limpiar formulario
            </SecondaryButton>
          </div>
        </Panel>
      </form>
    </div>
  );
}