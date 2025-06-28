# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

---



# Savr-Frontend Nuxt

Das Frontend wird mit Vue in Kombination mit Nuxt und Typescript entwickelt. Nuxt bietet die Möglichkeit, mithilfe der Erweiterung des Modularen-Ansatz durch die Ordnerstrukur, mit welcher Logik und Komponenten automatisch importiert werden und in den Komponenten zur Verfügung stehen. Zudem bietet es Möglichkeiten des Fetchings inklusive caching.

# Struktur

```
.
├── pages/         # Beinhaltet alle Routen des Projekts
├── components/    # Wiederverwendbare UI-Komponenten
├── layouts/       # Layout-Vorlagen
├── assets/        # Unkompilierte statische Dateien (SCSS, Bilder)
├── public/        # Statische Dateien (öffentlich zugänglich)
├── stores/        # loakler Nuxt-Storage durch Pinia
├── utils/         # Beinhaltet sämtliche Helferfunktionen
├── interfaces/    # Alle Types und Interfaces für die 
├── .env           # Alle wichtigen Variablen für die Funktion des Frontends
├── app.vue        # Hauptpunkt der App
└── nuxt.config.ts # Nuxt Konfiguration
```



## Pages

Der `Pages` Ordner beinhaltet sämtliche Seiten die für die Nutzer aufrubar sein sollen. Durch das Anlegen einer `.vue` Datei erstellt Nuxt automatisch im Router eine neue Route mit dem Namen der Datei. Jeglicher Inhalt, der sich in dieser Datei befindet, wird dabei beim Aufruf angezeigt.

Beispiel:

```
├── pages/
	└──  Impressum.vue

Neue Route: http://localhost:3000/impressum

```

## Components

Im Components Ordner werden alle wiederverwendbaren Komponenten abgelegt. Diese können dann mittels den Namen der Datei in anderen `.vue`Dateien eingebunden werden. Wichtig ist zu beachten, dass die gesamte Logik die nötig ist für die Komponente in dieser auch einzufügen, damit diese überall eingebunden werden kann.

Beispiel:

```
├── components/
	└──  Counter.vue


# index.vue

<template>
	<div>
		<Counter />
	</div>
</template>
```


## Layouts

Im Layouts Ordner können vorgefertige Strukturen für andere Seiten erstellt werden. Diese können dann nach Belieben in anderen Dateien zu Beginn inkludiert werden.


Beispiel:

```
├── layouts/
	└──  default.vue
└──  app.vue

# layouts/default.vue

<template>

	<div class="min-h-screen flex flex-col">

		<Navbar />

			<main class="flex flex-1">

				<slot />

			</main>

		<Footer />

	</div>

</template>

---

# app.vue

<template>

	<NuxtLayout>

		<h1> Hello World! </h1>

	</NuxtLayout>

</template>


# Rendered Ergebnis:

<div class="min-h-screen flex flex-col">

	<Navbar />

		<main class="flex flex-1">

			<h1> Hello World! </h1>

		</main>

	<Footer />

</div>
```



## Stores

In `stores` können eigene lokale Storages angelegt werden, die je nach Bedarf verschiedene Werte speicher und auch persistieren. Dadurch können wichtige Infos auch außerhalb von der Session bewahrt werden, sollten sie zu einem späteren Zeitpunkt oder beim erneuten Aufruf der Seite benötigt werden.

```

├── stores/
	└── textStore.ts

# useTextStore.ts

import { defineStore } from 'pinia'

export const useTextStore = defineStore('text', () => {

const importantText = ref<string>();
  

return { importantText }

}, {

persist: true,

});


# example.vue

<script setup lang="ts">

const textStore = useTextStore();

textStore.importantText = 'Keep that text even after closing the site!'

</script>

```


## Utils

Im Utils-Ordner werden sämtlicher Helferfunktionen abgelegt, die in mehreren Komponenten vorkommt. Diese werden beim Anlegen im Ordner automatisch in jeder Komponente verfügbar.

```

├── utils/
	└── textReturner.ts

# textReturner.ts

export const textReturner = () => {
 return "Text";
}
  

# example.vue

<script setup lang="ts">

const text = textReturner();

</script>

```

## Interfaces

In Interfaces werden alle `Types` und `Interfaces` gespeichert, die später im Code benötigt werden.

```
├── interfaces/
	└──  auth/
		└── user.ts

# user.ts

export interface User {
	username:  string;
	firstName: string;
	lastName:  string;
}


# example.vue

<script setup lang="ts">

import type {User} from '~/interfaces/auth/user.ts'

const user: User = {
	username: 'x',
	firstName: 'y',
	lastName: 'z'
}
</script>
```


## .env

In der .env Datei werden sämtliche ENV-Variablen eingefügt, die die Webseite im Laufe der Verwendung benötigen könnte, wie unter Anderem die URL zum Backend.


```
# .env

API_URL = http://localhost:4000

# nuxt.config.ts

runtimeConfig: {
	public: {

		apiBaseUrl: process.env.API_URL,

	}
}
```


## Nuxt config

In der Nuxt Config können weitere Änderungen an Nuxt vorgenommen werden. Hier werden auch weitere Module eingefügt wenn diese benötigt werden. Zudem werden hier auch wichtige Runtime-Variablen eingefügt die während der Verwendung notwendig sind.

```

import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
 
  ssr: true,
  modules: [],

  typescript: {
    strict: true
  },


  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_URL,
    }
  },
});

```
