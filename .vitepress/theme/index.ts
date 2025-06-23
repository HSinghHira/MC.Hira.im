import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Chip from 'primevue/chip'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import FileUpload from 'primevue/fileupload'

import { HomeUnderline } from '@theojs/lumen'

import Layout from './Layout.vue'
import Download from './components/Download.vue'
import LitematicViewer from './components/LitematicViewer.vue'
import MinecraftServerPing from './components/MinecraftServerPing.vue'

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
    app.component('FileUpload', FileUpload)
    app.component('Home', HomeUnderline)
    app.component('Download', Download)
    app.component('LitematicViewer', LitematicViewer)
    app.component('MinecraftServerPing', MinecraftServerPing)
  },
} satisfies Theme