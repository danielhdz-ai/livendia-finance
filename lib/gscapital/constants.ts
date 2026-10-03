export const AGENT_INFO = {
  name: "Daniel Hernández",
  title: "Gestor",
  phone: "60037742",
  email: "admin.livendia@gmail.com",
  company: "Livendia Finance",
  address: "08001 Barcelona",
  landline: "60037742",
  website: "https://livendia.com",
};

export const DEFAULT_PERSONAL_LOAN_INTEREST_RATE = 0.065;
export const PERSONAL_LOAN_COMMISSION = 0.025;

export const WHATSAPP_MESSAGE_TEMPLATE =
  "Hola buenos días, soy el equipo de Livendia Finance. Realizamos un estudio financiero hace un tiempo, ¿le sigue interesando poder comprar? Llegaron inmuebles nuevos que quizás le interesen. Un saludo.";

export type SidebarIconKey =
  | "home"
  | "calc"
  | "coin"
  | "users"
  | "building"
  | "file"
  | "grid"
  | "settings";

export type SidebarGroup = "principal" | "datos" | "herramientas";

export type SidebarItem = {
  id:
    | "asesoramiento"
    | "hipoteca"
    | "prestamo"
    | "database"
    | "colaboradores"
    | "inmobiliarios"
    | "notarias"
    | "tasadores"
    | "configuracion";
  label: string;
  group: SidebarGroup;
  icon: SidebarIconKey;
};

export const SIDEBAR_NAV: SidebarItem[] = [
  { id: "asesoramiento", label: "Asesoramiento", group: "principal", icon: "calc" },
  { id: "hipoteca", label: "Calculadora Hipoteca", group: "principal", icon: "home" },
  { id: "prestamo", label: "Préstamo Personal", group: "principal", icon: "coin" },
  { id: "database", label: "Base de Datos Clientes", group: "datos", icon: "users" },
  { id: "colaboradores", label: "Colaboradores Banca", group: "datos", icon: "building" },
  { id: "inmobiliarios", label: "Colaboradores Inmobiliarios", group: "datos", icon: "building" },
  { id: "notarias", label: "Colaboradores Notarías", group: "datos", icon: "file" },
  { id: "tasadores", label: "Tasadores", group: "datos", icon: "grid" },
  { id: "configuracion", label: "Configuración", group: "herramientas", icon: "settings" },
];

export const TABS = [
  { id: "asesoramiento", label: "Asesoramiento" },
  { id: "hipoteca", label: "Calculadora de Hipoteca" },
  { id: "prestamo", label: "Préstamo Personal" },
  { id: "database", label: "Base de Datos Clientes" },
  { id: "colaboradores", label: "Colaboradores de Banca" },
  { id: "inmobiliarios", label: "Colaboradores Inmobiliarios" },
  { id: "notarias", label: "Colaboradores Notarías" },
  { id: "tasadores", label: "Tasadores" },
  { id: "configuracion", label: "Configuración" },
] as const;

export const NAV_BY_TAB: Record<SidebarItem["id"], string> = SIDEBAR_NAV.reduce(
  (acc, item) => {
    acc[item.id] = item.label;
    return acc;
  },
  {} as Record<SidebarItem["id"], string>,
);

export const CLIENT_STATUS_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "activo", label: "Activo" },
  { value: "noactivo", label: "No Activo" },
] as const;