import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import PolaritonDiagram from './components/PolaritonDiagram.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) { app.component('PolaritonDiagram', PolaritonDiagram) },
} satisfies Theme
