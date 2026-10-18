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
      <aside v-if="page.relativePath === 'reference/compatibility.md'" class="verification-note" aria-label="Documentation source verification">
        <template v-if="manifest.commit">
          <strong>Documentation source</strong>
          This documentation describes <a :href="`${manifest.repository}/tree/${manifest.commit}`">Polariton commit {{ manifest.commit.slice(0, 12) }}</a>.
        </template>
        <template v-else>
          <strong>Documentation source verification pending</strong>
          The release label comes from the supplied documentation. The exact Polariton source commit and corresponding upstream files have not yet been verified for this documentation snapshot.
        </template>
      </aside>
    </template>
  </Layout>
</template>
