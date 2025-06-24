import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Existing components
import Chip from 'primevue/chip'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import FileUpload from 'primevue/fileupload'
import Avatar from 'primevue/avatar'
import Card from 'primevue/card'

// New components for DataTable
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'

import { HomeUnderline } from '@theojs/lumen'

import Layout from './Layout.vue'
import Download from './components/Download.vue'
import LitematicViewer from './components/LitematicViewer.vue'
import MinecraftServerPing from './components/MinecraftServerPing.vue'
import MeteorArchivesTable from './components/MeteorArchivesTable.vue'
import ProfileCard from './components/ProfileCard.vue'

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

    // Existing components
    app.component('Button', Button)
    app.component('Tag', Tag)
    app.component('Chip', Chip)
    app.component('FileUpload', FileUpload)
    app.component('Avatar', Avatar)
    app.component('Card', Card)
    
    // New DataTable components
    app.component('DataTable', DataTable)
    app.component('Column', Column)
    app.component('InputText', InputText)
    app.component('Dialog', Dialog)
    
    app.component('Home', HomeUnderline)
    app.component('Download', Download)
    app.component('LitematicViewer', LitematicViewer)
    app.component('MinecraftServerPing', MinecraftServerPing)
    app.component('MeteorArchivesTable', MeteorArchivesTable)
    app.component('ProfileCard', ProfileCard)
  },
} satisfies Theme