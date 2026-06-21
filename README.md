# StudyFlow AI

Plataforma educativa con IA para crear sesiones de estudio desde un tema o PDF. Genera resúmenes estructurados, flashcards, quizzes y apoyo con tutor IA. Incluye resolvedor de matemáticas paso a paso.

---

## Funciones disponibles (beta)

| Función | Estado | Plan |
|---|---|---|
| Registro / Login / Logout | ✅ Funcional | Todos |
| Recuperación de contraseña | ✅ Funcional | Todos |
| Crear sesiones por tema | ✅ Funcional | Todos |
| Generar resumen con IA | ✅ Funcional | Free (5/día) · PRO/MAX |
| Generar flashcards con IA | ✅ Funcional | Free (5/día) · PRO/MAX |
| Generar quiz con IA | ✅ Funcional | Free (5/día) · PRO/MAX |
| Tutor IA contextual | ✅ Funcional | Free (20 msg/día) · PRO/MAX |
| Resolvedor de matemáticas | ✅ Funcional | PRO (3/día) · MAX (50/día) |
| Materias / organización | ✅ Funcional | Todos |
| Progreso y racha de estudio | ✅ Funcional | Todos |
| Subida de PDFs | 🧪 Beta | Todos (texto seleccionable) |
| Planes de pago (Pro/Max) | 🔜 Próximamente | — |

---

## Stack

- **Framework**: Next.js 16 (App Router)
- **Base de datos / Auth**: Supabase (PostgreSQL + Row-Level Security)
- **IA**: OpenAI API (`gpt-4o-mini`)
- **Estilos**: Tailwind CSS v4
- **Bot protection**: hCaptcha
- **Deploy**: Netlify

---

## Requisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com)
- API key de [OpenAI](https://platform.openai.com)
- Site key de [hCaptcha](https://www.hcaptcha.com) (configurada en Supabase Auth)

---

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública de Supabase |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | Site key de hCaptcha |
| `OPENAI_API_KEY` | API key de OpenAI (solo servidor, nunca al cliente) |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (ej. `https://tudominio.com`) |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (futuro — no activo aún) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret del webhook de Stripe |
| `STRIPE_PRO_PRICE_ID` | Price ID del plan Pro en Stripe |
| `STRIPE_MAX_PRICE_ID` | Price ID del plan Max en Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave publicable de Stripe |

> La `OPENAI_API_KEY` nunca se expone al cliente — solo se usa en API routes del servidor.

---

## Instalación

```bash
npm install
npm run dev
```

El servidor corre en `http://localhost:3000`.

---

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Verifica errores de ESLint |
| `npm run typecheck` | Verifica tipos con TypeScript |
| `npm run predeploy` | Ejecuta lint + typecheck + build |

---

## Base de datos

El esquema completo está en `supabase/schema.sql`. Aplícalo en el SQL Editor de tu proyecto Supabase.

**Tablas principales:**
- `profiles` — Perfil de usuario (plan, nombre)
- `subscriptions` — Suscripciones Stripe (poblada por webhook)
- `study_sessions` — Sesiones de estudio con resumen
- `subjects` — Materias para organizar sesiones
- `flashcards` — Tarjetas generadas por IA
- `quiz_questions` — Preguntas de opción múltiple
- `tutor_messages` — Historial del tutor IA
- `math_solver_requests` — Historial del resolvedor
- `ai_usage_events` — Registro de uso de IA (cuotas)
- `study_activity` — Tiempo de estudio por sesión
- `legal_acceptances` — Registro de aceptación de términos

**Función crítica:** `try_consume_ai_quota` — maneja las cuotas diarias con `pg_advisory_xact_lock` para evitar race conditions.

---

## Seguridad

- Todas las tablas tienen **Row-Level Security** activo.
- Los prompts de IA se construyen **solo en el servidor** — el cliente nunca envía prompts libres.
- La `OPENAI_API_KEY` nunca llega al navegador.
- Las cuotas se verifican atómicamente con `pg_advisory_xact_lock`.
- `try_consume_ai_quota` valida `auth.uid() = p_user_id` para evitar consumo cruzado de cuotas.
- hCaptcha protege login y registro contra bots.
- El middleware en `src/middleware.ts` protege todas las rutas `/dashboard`.

---

## Deploy en Netlify

1. Conecta el repositorio en [app.netlify.com](https://app.netlify.com)
2. Agrega las variables de entorno en **Site Settings → Environment Variables**
3. El `netlify.toml` en la raíz configura: build command, directorio de publicación y el plugin de Next.js
4. En Supabase Auth: agrega `https://tudominio.netlify.app` (o tu dominio personalizado) como **Site URL** y en **Redirect URLs**
5. En hCaptcha Dashboard: agrega el dominio de Netlify a los sitios permitidos

Verifica antes de hacer push:
```bash
npm run predeploy
```

---

## Checklist antes de producción

- [ ] Variables de entorno configuradas en Netlify
- [ ] Schema SQL aplicado al proyecto Supabase de producción
- [ ] hCaptcha site key + secret key configurados (secret key en Supabase Auth)
- [ ] Dominio personalizado configurado en Supabase Auth (Site URL)
- [ ] Confirmar email habilitado en Supabase Auth settings
- [ ] Revisar límites de uso en `src/lib/ai/limits.ts`
- [ ] Verificar que `OPENAI_API_KEY` tiene créditos suficientes
- [ ] Textos de Términos y Privacidad actualizados con contenido legal definitivo
- [ ] Configurar Stripe e implementar `src/app/api/stripe/` (checkout, webhook, portal)
- [ ] Aplicar migración de la tabla `subscriptions` en Supabase de producción

---

## Arquitectura

```
src/
├── app/
│   ├── api/ai/            # API routes del servidor (OpenAI — nunca al cliente)
│   │   ├── generate-summary/
│   │   ├── generate-flashcards/
│   │   ├── generate-quiz/
│   │   ├── tutor/         # Streaming SSE
│   │   └── math-solver/
│   ├── api/auth/          # Auth utilities (record-legal, etc.)
│   ├── api/stripe/        # Stubs para checkout, webhook y portal (TODO)
│   ├── dashboard/         # App autenticada (protegida por middleware)
│   ├── auth/callback/     # Intercambio de código OAuth/recovery
│   ├── forgot-password/
│   ├── reset-password/
│   ├── login/
│   ├── register/
│   ├── privacy/
│   └── terms/
├── components/
│   ├── dashboard/         # SessionDetail, MathGraph, AppSidebar, etc.
│   ├── landing/           # HeroSection, FlowSection, etc.
│   └── ui/                # Button, Badge, EmptyState, etc.
├── lib/
│   ├── ai/                # limits.ts, prompts.ts, validators.ts, usage.ts
│   ├── db/                # study-sessions.ts
│   └── supabase/          # client.ts (browser), server.ts (server)
├── middleware.ts           # Protección de rutas /dashboard
└── types/index.ts         # Tipos TypeScript globales
supabase/
└── schema.sql             # Esquema completo con RLS y función de cuotas
```
