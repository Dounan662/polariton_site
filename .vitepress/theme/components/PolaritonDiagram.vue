<script setup lang="ts">
import { computed, onMounted, ref, watch, useId } from 'vue'
import { useData } from 'vitepress'
import { illustration } from '../illustrations'
const props = defineProps<{ source: string; kind?: string }>()
const { isDark } = useData()
const drawingId = `diagram-${useId().replaceAll(':', '-')}`
const custom = computed(() => illustration(props.kind ?? '', drawingId))
const svg = ref('')
const failed = ref(false)
const original = computed(() => new TextDecoder().decode(Uint8Array.from(atob(props.source), c => c.charCodeAt(0))))
let generation = 0
const caption = computed(() => failed.value ? 'Diagram source (rendering unavailable)' : 'View diagram source')
async function render() {
  if (custom.value) return
  const current = ++generation
  try {
    // Presentation-only removal: retain the original Mermaid verbatim in the disclosure.
    let diagram = original.value.split('\n').filter(line => !/^\s*(classDef |class |style |linkStyle |%%\{init:)/.test(line)).join('\n')
    if (diagram.includes('subgraph Project[')) diagram = diagram.replace('flowchart TB', 'flowchart LR')
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: 'base', look: 'classic',
      fontFamily: 'Arial, Helvetica, sans-serif',
      themeCSS: '.nodeLabel p, .edgeLabel p { margin: 0; font-size: 14px; line-height: 1.5; }',
      themeVariables: {
        fontSize: '14px',
        primaryColor: isDark.value ? '#243446' : '#edf2f7',
        primaryTextColor: isDark.value ? '#e3e8ef' : '#171e27',
        primaryBorderColor: isDark.value ? '#8b9cac' : '#7d8b99',
        lineColor: isDark.value ? '#a0b9d2' : '#547698',
        secondaryColor: isDark.value ? '#1c2630' : '#f2f5f8',
        tertiaryColor: isDark.value ? '#14191f' : '#fcfcfd',
        clusterBkg: isDark.value ? '#1c2630' : '#f8fafc',
        clusterBorder: isDark.value ? '#536477' : '#c2ccd6',
      },
      flowchart: { htmlLabels: true, useMaxWidth: true, curve: 'linear', wrappingWidth: 220, nodeSpacing: 28, rankSpacing: 44, padding: 16, subGraphTitleMargin: { top: 12, bottom: 20 } },
    })
    const result = await mermaid.render(`polariton-${Math.random().toString(36).slice(2)}`, diagram)
    if (current === generation) { svg.value = result.svg; failed.value = false }
  } catch { if (current === generation) failed.value = true }
}
onMounted(render)
watch([isDark, () => props.source], render)
</script>

<template>
  <figure class="research-diagram">
    <div v-if="custom || svg" class="diagram-scroll" tabindex="0" role="region" aria-label="Research diagram; scroll horizontally if needed" v-html="custom || svg"></div>
    <p v-else-if="!failed" class="diagram-loading">Loading diagram…</p>
    <p class="diagram-hint">Scroll horizontally to view the full diagram.</p>
    <details :open="failed">
      <summary>{{ caption }}</summary>
      <pre><code>{{ original }}</code></pre>
    </details>
  </figure>
</template>
