import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import '@theojs/lumen/theme'


import Button from 'primevue/button'
import { HomeUnderline } from '@theojs/lumen'

import Layout from './Layout.vue'

import './style.css'
import './tailwind.css'
import 'primeicons/primeicons.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark', // Enable dark mode support
        }
      }
    })

    // Register components globally
    app.component('Button', Button)
    app.component('Home', HomeUnderline)

  }
} satisfies Theme
