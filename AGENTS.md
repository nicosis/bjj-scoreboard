# AGENTE PRINCIPAL – ESPECIFICACIONES DE LA APP BJJ SCOREBOARD

Este documento define todas las reglas y requisitos para generar el código de una aplicación basada en Vue 3 + Tailwind CSS que luego será empaquetada con Tauri como aplicación de escritorio.

La aplicación es un marcador (scoreboard) y sistema de cuenta regresiva (timer) para peleas de Brazilian Jiu-Jitsu (BJJ).

---

## 🧩 Tecnologías

- Vue 3 (Composition API + `<script setup>`)
- Vite
- Tailwind CSS (instalado por NPM, no por CDN)
- PostCSS configurado con `@tailwindcss/postcss`
- App pensada para ser luego empaquetada en **Tauri**
- Toda la lógica del temporizador y del puntaje debe ser implementada en **JavaScript dentro de Vue**, sin librerías externas.

---

## 🖥 Objetivo General

Construir una pantalla completa (full screen) que muestre:

- Nombre del organizador del evento (editable)
- Categoría y tatami (editable)
- Un temporizador de cuenta regresiva grande, claro y visible desde lejos
- Dos paneles de competidores, izquierda y derecha:
  - Nombre del competidor (editable)
  - Nombre del equipo / academia (editable)
  - Puntos (con botones +4, +3, +2 y -4, -3, -2)
  - Ventajas (ADV) con +1 y -1
  - Penalidades (PEN) con +1 y -1

Todo debe ser **totalmente responsivo** usando solo clases utilitarias de Tailwind.

---

## ✏️ Edición inline (click para editar)

Todos estos campos deben ser editables haciendo click:

- Nombre del organizador
- Línea de información (categoría, tatami)
- Nombre del competidor 1
- Equipo del competidor 1
- Nombre del competidor 2
- Equipo del competidor 2

Comportamiento:

1. Modo texto normal.
2. El usuario hace click → se transforma en `<input>` o `<textarea>`.
3. Al perder foco o presionar Enter → vuelve a modo texto con valor actualizado.

Implementado **solo con reactividad de Vue** (`ref`, `reactive`, etc.).

---

## ⏱ Temporizador

Características requeridas:

- Muestra tiempo en formato `mm:ss` siempre con ceros a la izquierda.
- Botones:
  - PLAY (inicia)
  - PAUSE
  - RESET (vuelve al tiempo inicial configurado)
- Ajustes permitidos **solo cuando el timer está pausado**:
  - Los ajustes se aplican sobre el tiempo que se muestra actualmente en pantalla (no solo sobre el tiempo inicial), cualquiera que sea, con un mínimo de cero.
  - +1 minuto
  - -1 minuto
  - +10 segundos
  - -10 segundos
- Cuando llega a 00:00 debe detenerse automáticamente.
- Implementación del temporizador:
  - `setInterval` o `requestAnimationFrame`
  - Limpieza automática de intervalos al pausar o resetear
  - Todo dentro de Vue, sin DOM nativo.

---

## 🎯 Diseño (UI/UX)

- Pantalla limpia, moderna, fácil de leer.
- Temporizador en tamaño MUY grande.
- Paneles de competidores con colores diferenciados.
- Puntos en tamaño grande, ventajas y penalidades más pequeñas.
- En móvil, los paneles deben apilarse verticalmente.
- En desktop, deben mostrarse en dos columnas.
- Uso estricto de utilidades Tailwind (sin clases custom cuando no hace falta).

---

## 🧱 Estructura esperada del proyecto

Al menos:

src/
├─ main.js
└─ App.vue

Se permite crear componentes como:

- `<CompetitorPanel />`
- `<EditableText />`
- `<TimerDisplay />`

Solo si ayudan a la claridad del código.

---

## 🔧 Reglas para Codex / Copilot

- Siempre escribir el código en **Vue Single File Components**.
- Usar `<script setup>` y Composition API.
- No incluir Tailwind por CDN.
- No usar manipulación directa de DOM.
- No incluir texto explicativo fuera de bloques de código.
- Producir código funcional, legible y organizado con comentarios claros.

### Directivas de Implementación

1. **Crear composable `useCountdown.js`**

   - Ubicar en `src/composables/useCountdown.js`
   - Implementar lógica completa del temporizador con:
     - `start()` - Inicia el temporizador
     - `pause()` - Pausa el temporizador
     - `reset()` - Resetea al tiempo inicial configurado
     - `addTime(seconds)` - Añade tiempo (máximo el tiempo actual + incremento)
     - `subtractTime(seconds)` - Resta tiempo (mínimo 0)
   - Exponer estado reactivo: `time`, `isRunning`, `initialTime`
   - Usar `ref` para valores reactivos y `computed` si es necesario
   - Implementar con `setInterval` y limpieza automática

2. **Separar la pantalla en componentes**

   - `Countdown.vue` - Temporizador con controles (play, pause, reset, +/-10s, +/-1min)
   - `ScoreBoard.vue` - Contenedor principal de los dos paneles de competidores
   - `PlayerPanel.vue` - Panel individual de competidor (reutilizable para ambos lados)
   - `EditableText.vue` - Componente reutilizable para campos editables al hacer click
   - `Header.vue` - Barra superior con organizador, categoría y tatami
   - Cada componente debe ser autocontenido y recibir props cuando sea necesario

3. **Agregar lógica de puntos en PlayerPanel**

   - Estado reactivo para: `points`, `advantages`, `penalties`
   - Métodos para: `addPoints(value)`, `subtractPoints(value)`, `addAdvantage()`, `subtractAdvantage()`, `addPenalty()`, `subtractPenalty()`
   - Validaciones: puntos no negativos, ventajas y penalidades entre 0 y un máximo razonable
   - Emitir eventos si el estado debe compartirse con el padre

4. **Integración en App.vue**
   - Importar y usar todos los componentes creados
   - Mantener estado global si es necesario (nombres, equipos, configuración)
   - Coordinar la comunicación entre componentes mediante props y eventos
   - Mantener el diseño responsivo usando clases de Tailwind

Este documento define las reglas del proyecto.  
El código generado en los archivos debe cumplirlas siempre.

Maquetacion generada por stitch - referencia inicial:

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>BJJ Championship Scoreboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings:
            'FILL' 1,
            'wght' 700,
            'GRAD' 0,
            'opsz' 48;
        }
    </style>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#81d40c",
              "background-light": "#f7f8f5",
              "background-dark": "#121212",
            },
            fontFamily: {
              "display": ["Lexend", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
    </script>
</head>
<body class="font-display bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
<div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-hidden">
<div class="layout-container flex h-full grow flex-col">
<div class="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
<div class="layout-content-container flex flex-col max-w-7xl flex-1">
<!-- Top Navigation Bar -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3">
<div class="flex items-center gap-4 text-gray-900 dark:text-white">
<div class="size-6 text-primary">
<svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
</svg>
</div>
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">BJJ Championship</h2>
</div>
<div class="flex flex-1 justify-end items-center gap-6 sm:gap-8">
<div class="hidden sm:flex items-center gap-6">
<span class="text-sm font-medium leading-normal">Category: Adult / Black Belt</span>
<span class="text-sm font-medium leading-normal">Tatami: 01</span>
</div>
<button class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
<span class="material-symbols-outlined !text-2xl dark:hidden">dark_mode</span>
<span class="material-symbols-outlined !text-2xl hidden dark:inline">light_mode</span>
</button>
</div>
</header>
<!-- Timer and Controls Section -->
<div class="flex flex-col md:flex-row items-center justify-center gap-4 py-4 sm:py-6 w-full">
<div class="flex-1 flex items-center justify-center relative">
<div class="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
<button class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-500/20 text-gray-500"><span class="material-symbols-outlined !text-lg">add</span></button>
<button class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-500/20 text-gray-500"><span class="material-symbols-outlined !text-lg">remove</span></button>
</div>
<h1 class="text-lime-500 text-[12vw] sm:text-[10vw] md:text-9xl font-black leading-none tracking-tighter" style="font-feature-settings: 'tnum' on, 'lnum' on;">06:00</h1>
<div class="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
<button class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-500/20 text-gray-500"><span class="material-symbols-outlined !text-lg">add</span></button>
<button class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-500/20 text-gray-500"><span class="material-symbols-outlined !text-lg">remove</span></button>
</div>
</div>
<div class="flex md:flex-col gap-3 pt-2 md:pt-0">
<button class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white"><span class="material-symbols-outlined !text-3xl">play_arrow</span></button>
<button class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-white"><span class="material-symbols-outlined !text-3xl">pause</span></button>
<button class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white"><span class="material-symbols-outlined !text-3xl">restart_alt</span></button>
</div>
</div>
<!-- Competitors Section -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 flex-1">
<!-- Competitor 1 (Left) -->
<div class="flex flex-col gap-4 sm:gap-6 w-full">
<div class="text-center">
<h2 class="text-[4vw] sm:text-4xl font-bold leading-tight tracking-tight uppercase">COMPETITOR NAME</h2>
<p class="text-[3vw] sm:text-2xl font-normal leading-normal uppercase text-gray-600 dark:text-gray-400">TEAM / ACADEMY NAME</p>
</div>
<div class="flex flex-col gap-3 sm:gap-4 flex-1">
<!-- Points -->
<div class="bg-green-500 text-white rounded-xl p-3 flex items-center justify-center relative flex-1">
<span class="font-black text-[20vw] sm:text-8xl md:text-[12vw] lg:text-[10rem] leading-none" style="font-feature-settings: 'tnum' on, 'lnum' on;">0</span>
<div class="absolute inset-y-0 left-3 flex flex-col justify-around">
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 text-white text-sm sm:text-base font-bold">+4</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 text-white text-sm sm:text-base font-bold">+3</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 text-white text-sm sm:text-base font-bold">+2</button>
</div>
<div class="absolute inset-y-0 right-3 flex flex-col justify-around">
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/20 text-white text-sm sm:text-base font-bold">-4</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/20 text-white text-sm sm:text-base font-bold">-3</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/20 text-white text-sm sm:text-base font-bold">-2</button>
</div>
</div>
<div class="grid grid-cols-2 gap-3 sm:gap-4">
<!-- Advantages -->
<div class="bg-amber-500 text-white rounded-lg p-3 flex items-center justify-center relative">
<div class="absolute inset-y-0 left-3 flex flex-col justify-center gap-2">
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white"><span class="material-symbols-outlined !text-lg">add</span></button>
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white"><span class="material-symbols-outlined !text-lg">remove</span></button>
</div>
<span class="font-bold text-5xl sm:text-6xl" style="font-feature-settings: 'tnum' on, 'lnum' on;">0</span>
</div>
<!-- Penalties -->
<div class="bg-red-600 text-white rounded-lg p-3 flex items-center justify-center relative">
<div class="absolute inset-y-0 left-3 flex flex-col justify-center gap-2">
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white"><span class="material-symbols-outlined !text-lg">add</span></button>
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white"><span class="material-symbols-outlined !text-lg">remove</span></button>
</div>
<span class="font-bold text-5xl sm:text-6xl" style="font-feature-settings: 'tnum' on, 'lnum' on;">0</span>
</div>
</div>
</div>
</div>
<!-- Competitor 2 (Right) -->
<div class="flex flex-col gap-4 sm:gap-6 w-full">
<div class="text-center">
<h2 class="text-[4vw] sm:text-4xl font-bold leading-tight tracking-tight uppercase">COMPETITOR NAME</h2>
<p class="text-[3vw] sm:text-2xl font-normal leading-normal uppercase text-gray-600 dark:text-gray-400">TEAM / ACADEMY NAME</p>
</div>
<div class="flex flex-col gap-3 sm:gap-4 flex-1">
<!-- Points -->
<div class="bg-white text-gray-900 rounded-xl p-3 flex items-center justify-center relative flex-1">
<span class="font-black text-[20vw] sm:text-8xl md:text-[12vw] lg:text-[10rem] leading-none" style="font-feature-settings: 'tnum' on, 'lnum' on;">0</span>
<div class="absolute inset-y-0 left-3 flex flex-col justify-around">
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/10 text-gray-900 text-sm sm:text-base font-bold">+4</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/10 text-gray-900 text-sm sm:text-base font-bold">+3</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/10 text-gray-900 text-sm sm:text-base font-bold">+2</button>
</div>
<div class="absolute inset-y-0 right-3 flex flex-col justify-around">
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/20 text-white text-sm sm:text-base font-bold">-4</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/20 text-white text-sm sm:text-base font-bold">-3</button>
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black/20 text-white text-sm sm:text-base font-bold">-2</button>
</div>
</div>
<div class="grid grid-cols-2 gap-3 sm:gap-4">
<!-- Advantages -->
<div class="bg-amber-500 text-white rounded-lg p-3 flex items-center justify-center relative">
<div class="absolute inset-y-0 left-3 flex flex-col justify-center gap-2">
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white"><span class="material-symbols-outlined !text-lg">add</span></button>
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white"><span class="material-symbols-outlined !text-lg">remove</span></button>
</div>
<span class="font-bold text-5xl sm:text-6xl" style="font-feature-settings: 'tnum' on, 'lnum' on;">0</span>
</div>
<!-- Penalties -->
<div class="bg-red-600 text-white rounded-lg p-3 flex items-center justify-center relative">
<div class="absolute inset-y-0 left-3 flex flex-col justify-center gap-2">
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white"><span class="material-symbols-outlined !text-lg">add</span></button>
<button class="flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white"><span class="material-symbols-outlined !text-lg">remove</span></button>
</div>
<span class="font-bold text-5xl sm:text-6xl" style="font-feature-settings: 'tnum' on, 'lnum' on;">0</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</body></html>
