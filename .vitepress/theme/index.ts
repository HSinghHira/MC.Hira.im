import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Chip from 'primevue/chip'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

import { HomeUnderline } from '@theojs/lumen'

import Layout from './Layout.vue'
import Download from './components/Download.vue'
import LitematicViewer from './components/LitematicViewer.vue'


import './style.css'
import './tailwind.css'
import 'primeicons/primeicons.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        }
      }
    })

    app.component('Button', Button)
    app.component('Tag', Tag)
    app.component('Chip', Chip)
    app.component('Home', HomeUnderline)
    app.component('Download', Download)
    app.component('LitematicViewer', LitematicViewer)


  },

} satisfies Theme
