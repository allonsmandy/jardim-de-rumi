<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} · Jardim de Rumi` : 'Jardim de Rumi'),
})
useSeoMeta({ ogSiteName: 'Jardim de Rumi', ogLocale: 'pt_BR', twitterCard: 'summary' })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
