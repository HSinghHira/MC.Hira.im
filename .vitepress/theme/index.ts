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
import DataView from 'primevue/dataview';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect';
import IftaLabel from 'primevue/iftalabel';
import Select from 'primevue/select';
import FloatLabel from "primevue/floatlabel";


import { HomeUnderline } from '@theojs/lumen'

import Layout from './Layout.vue'
import Download from './components/Download.vue'
import LitematicViewer from './components/LitematicViewer.vue'
import MinecraftServerPing from './components/MinecraftServerPing.vue'
import MeteorArchivesTable from './components/MeteorArchivesTable.vue'
import AddonDataView from './components/AddonDataView.vue';


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
    app.component('DataView', DataView)
    app.component('MultiSelect', MultiSelect)
    app.component('DataTable', DataTable)
    app.component('Column', Column)
    app.component('InputText', InputText)
    app.component('Dialog', Dialog)
    app.component('IftaLabel', IftaLabel)
    app.component('Select', Select)
    app.component('FloatLabel', FloatLabel)    
    
    app.component('Home', HomeUnderline)
    app.component('Download', Download)
    app.component('LitematicViewer', LitematicViewer)
    app.component('MinecraftServerPing', MinecraftServerPing)
    app.component('MeteorArchivesTable', MeteorArchivesTable)
    app.component('AddonDataView', AddonDataView)

  },
} satisfies Theme