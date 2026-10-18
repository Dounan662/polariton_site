<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData } from 'vitepress'
import manifest from '../../content-manifest.json'
const { page } = useData()
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="release-note">
        <span class="release-dot" aria-hidden="true"></span>
        Preview · {{ manifest.release }}
      </div>
      <aside v-if="page.relativePath === 'guides/research-example.md' && !manifest.tutorialLiveVerified" class="verification-note" aria-label="Tutorial verification status">
        <strong>Walkthrough verification pending</strong>
        The arithmetic has been checked; this tutorial has not yet been verified live in Polariton.
      </aside>
    </template>
    <template #doc-after>
      <div class="source-note">
        <template v-if="manifest.commit">
          Documentation source: <a :href="`${manifest.repository}/tree/${manifest.commit}`">{{ manifest.commit.slice(0, 12) }}</a>
        </template>
        <template v-else>Local documentation snapshot · upstream source commit not yet verified.</template>
      </div>
    </template>
  </Layout>
</template>
