import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Chip from 'primevue/chip';

import '@theojs/lumen/theme'


import Button from 'primevue/button'
import Tag from 'primevue/tag';
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
    app.component('Tag', Tag)
    app.component('Chip', Chip)
    app.component('Home', HomeUnderline)

  }
} satisfies Theme
