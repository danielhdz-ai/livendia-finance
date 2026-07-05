# Calificación Financiera

Aplicación web para evaluar la salud financiera personal mediante un cuestionario interactivo. Genera una puntuación de 0 a 100, clasifica el perfil y entrega recomendaciones accionables.

## Características

- Cuestionario de 8 preguntas sobre ingresos, deuda, ahorro, crédito y planificación
- Puntuación global y desglose por categoría
- Recomendaciones según el nivel obtenido
- Interfaz responsive en español
- Guardado de evaluaciones en Supabase
- Lista para desplegar en Vercel

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase

## Configurar Supabase

### 1. Crear proyecto en Supabase

1. Entra a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Crea un proyecto nuevo llamado `calificacion-financiera`
3. Copia la **Project URL** y la **anon public key**

### 2. Crear la tabla

En el **SQL Editor** de Supabase, ejecuta el contenido de:

`supabase/setup_database.sql`

### 3. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

En Vercel, agrega las mismas variables en **Settings → Environment Variables**.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Despliegue en Vercel

1. Importa el repositorio de GitHub en [vercel.com/new](https://vercel.com/new)
2. Selecciona el repositorio `danielhdz-ai/calificacion-financiera`
3. Vercel detectará Next.js automáticamente
4. Haz clic en **Deploy**

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — servidor de producción
- `npm run lint` — lint del proyecto

## Licencia

Proyecto privado.
