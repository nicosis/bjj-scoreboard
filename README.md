# BJJ Scoreboard - Marcador para Competiciones de Jiu-Jitsu

Aplicación de escritorio para llevar el marcador y cronómetro en competiciones de Brazilian Jiu-Jitsu (BJJ).

## 🎯 Descripción

Sistema completo de scoreboard diseñado específicamente para torneos de BJJ que permite:

- Temporizador con cuenta regresiva configurable
- Marcador para dos competidores
- Puntos, ventajas y penalidades
- Información editable de competidores, categorías y evento
- Control completo por teclado
- Interfaz responsive y adaptable

## 🚀 Uso del Ejecutable (para el evento del 6 de Diciembre)

### Instalación

1. Busca el archivo `.exe` o `.msi` en la carpeta `src-tauri/target/release/bundle/`
2. Ejecuta el instalador
3. La aplicación se abrirá en pantalla completa

### Controles Principales

#### ⌨️ Atajos de Teclado

- **ESPACIO**: Play/Pause del temporizador
- **ESCAPE**: Reset completo (tiempo y marcadores)

#### 🕐 Temporizador

- **Play** (verde): Inicia el contador
- **Pause** (amarillo): Pausa el contador
- **Reset** (rojo): Reinicia el tiempo
- **+1m / -1m**: Añadir/restar 1 minuto (solo cuando está pausado)
- **+10s / -10s**: Añadir/restar 10 segundos (solo cuando está pausado)

#### 🥋 Información de Competidores

**Haz click en cualquier texto para editarlo:**

- Nombre del competidor
- Nombre del equipo/academia
- Nombre del evento (arriba izquierda)
- Categoría
- Tatami

#### 📊 Puntuación

**Panel Izquierdo (Verde):**

- Botones **+4, +3, +2**: Añadir puntos
- Botones **-4, -3, -2**: Restar puntos (aparecen solo si hay puntos)

**Panel Derecho (Blanco):**

- Botones **+4, +3, +2**: Añadir puntos
- Botones **-4, -3, -2**: Restar puntos (aparecen solo si hay puntos)

**Ventajas (Amarillo):**

- Botón **+**: Añadir ventaja
- Botón **-**: Restar ventaja (aparece solo si hay ventajas)

**Penalidades (Rojo):**

- Botón **+**: Añadir penalidad
- Botón **-**: Restar penalidad (aparece solo si hay penalidades)
- Se muestran como números negativos (-1, -2, -3...)

### 📝 Flujo de Trabajo Recomendado

1. **Antes de la pelea:**

   - Configura el tiempo deseado (usa +1m/-1m y +10s/-10s)
   - Haz click y edita los nombres de los competidores
   - Edita los equipos/academias
   - Edita la categoría si es necesario

2. **Durante la pelea:**

   - Presiona ESPACIO o el botón Play para iniciar
   - Usa los botones de puntuación según corresponda
   - Presiona ESPACIO o Pause si necesitas detener el tiempo

3. **Después de la pelea:**
   - Presiona ESCAPE para resetear todo
   - O haz reset manual del tiempo y ajusta marcadores

### ⚠️ Notas Importantes

- Los campos de texto solo se pueden editar haciendo click (NO cuando estás enfocado en un input)
- Los botones de ajuste de tiempo (+/-) solo funcionan cuando el temporizador está pausado
- La barra espaciadora NO funciona cuando estás editando un campo de texto
- Los números se animan al cambiar para mejor visibilidad
- Las penalidades entran desde arriba al aumentar, desde abajo al disminuir

## 🛠️ Para Desarrolladores

### Tecnologías Utilizadas

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (Build tool)
- **Tailwind CSS v4** (Estilos)
- **Tauri** (Desktop app)

### Configuración del Proyecto

```sh
npm install
```

### Desarrollo (Modo Web)

```sh
npm run dev
```

### Desarrollo (Modo Tauri)

```sh
npm run tauri dev
```

### Build para Producción

```sh
npm run tauri build
```

El ejecutable se generará en `src-tauri/target/release/bundle/`

### Estructura del Proyecto

```
src/
├── components/
│   ├── Countdown.vue         # Temporizador
│   ├── EditableText.vue      # Campos editables
│   ├── Header.vue            # Barra superior
│   ├── PlayerPanel.vue       # Panel de competidor
│   ├── ScoreBoard.vue        # Contenedor de paneles
│   └── SlidingNumber.vue     # Animación de números
├── composables/
│   └── useCountdown.js       # Lógica del temporizador
├── data/
│   └── competitors.json      # Lista de competidores
├── assets/
│   └── main.css             # Estilos base + Tailwind
├── App.vue                  # Componente principal
└── main.js                  # Entry point

public/
└── MG-Team-Logo.png        # Logo del evento
```

### Características Técnicas

- **Edición inline**: Click para editar cualquier campo de texto
- **Animaciones**: Números animados con `SlidingNumber.vue`
- **Reactividad**: Vue 3 Composition API con `ref` y `reactive`
- **Control de teclado**: Listeners globales con prevención en campos de input
- **Temporizador**: Implementado con `setInterval` y limpieza automática
- **Tailwind v4**: Configuración CSS con `@theme` en lugar de `tailwind.config.js`

## 📅 Evento

**MG Interclub - 6 de Diciembre de 2025**

Esta aplicación fue desarrollada específicamente para el interclub de MG Team Barcelona.

## 📄 Licencia

Proyecto privado - MG Team Barcelona

---

Desarrollado con ❤️ para la comunidad de BJJ
