import type { Theme as ThemeConfig } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from 'vue'

import { Underline } from '@theojs/lumen'

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import {
  LayoutSwitch,
  ScreenLayoutSwitch,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

import {
  NolebaseGitChangelogPlugin
} from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

// Existing components
import Chip from "primevue/chip";
import Button from "primevue/button";
import Tag from "primevue/tag";
import FileUpload from "primevue/fileupload";
import Avatar from "primevue/avatar";
import Card from "primevue/card";
import DataView from "primevue/dataview";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import MultiSelect from "primevue/multiselect";
import IftaLabel from "primevue/iftalabel";
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";

import Layout from "./Layout.vue";
import Download from "./components/Download.vue";
import LitematicViewer from "./components/LitematicViewer.vue";
import MinecraftServerPing from "./components/MinecraftServerPing.vue";
import MeteorArchivesTable from "./components/MeteorArchivesTable.vue";
import AddonDataView from "./components/AddonDataView.vue";

import "./tailwind.css";
import "primeicons/primeicons.css";
import '@theojs/lumen/style'
import './var.css'

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => [
        h(NolebaseEnhancedReadabilitiesMenu),
      ],
      'nav-screen-content-after': () => [
        h(NolebaseEnhancedReadabilitiesScreenMenu),
        h(ScreenLayoutSwitch),
      ],
    })
  },
  enhanceApp({ app, router }) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".dark",
        },
      },
    });

    app.use(NolebaseGitChangelogPlugin, {
      locales: {
        'en': {
          changelog: {
            title: 'Page Edit History',
          },
          contributors: {
            title: 'Authors',
          }
        },
      }
    })

    app.component("Button", Button);
    app.component("Tag", Tag);
    app.component("Chip", Chip);
    app.component("FileUpload", FileUpload);
    app.component("Avatar", Avatar);
    app.component("Card", Card);
    app.component("DataView", DataView);
    app.component("MultiSelect", MultiSelect);
    app.component("DataTable", DataTable);
    app.component("Column", Column);
    app.component("InputText", InputText);
    app.component("Dialog", Dialog);
    app.component("IftaLabel", IftaLabel);
    app.component("Select", Select);
    app.component("FloatLabel", FloatLabel);

    app.component("Underline", Underline);
    app.use(NolebaseGitChangelogPlugin);

    app.component("Download", Download);
    app.component("LitematicViewer", LitematicViewer);
    app.component("MinecraftServerPing", MinecraftServerPing);
    app.component("MeteorArchivesTable", MeteorArchivesTable);
    app.component("AddonDataView", AddonDataView);
  },
} satisfies ThemeConfig;

export default Theme;