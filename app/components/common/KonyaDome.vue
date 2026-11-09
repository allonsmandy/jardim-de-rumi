<script setup lang="ts">
/**
 * Silhueta estilizada da Cúpula Verde (Yeşil Türbe), sobre o túmulo de Rumi em Konya: um tambor
 * e um cone canelado, revestidos de azulejos turquesa, com um remate no alto. Decorativo.
 */
const id = useId()
const coneFlutes = Array.from({ length: 9 }, (_, i) => 52 + i * 12)
const drumFlutes = Array.from({ length: 11 }, (_, i) => 56 + i * 8.8)
</script>

<template>
  <svg viewBox="0 0 200 300" aria-hidden="true" class="dome pointer-events-none">
    <defs>
      <linearGradient :id="`cone-${id}`" x1="0" x2="1">
        <stop offset="0" stop-color="#0d4c51" />
        <stop offset="0.45" stop-color="#49b6b0" />
        <stop offset="0.6" stop-color="#2f8f8f" />
        <stop offset="1" stop-color="#0d4c51" />
      </linearGradient>
      <linearGradient :id="`drum-${id}`" x1="0" x2="1">
        <stop offset="0" stop-color="#0b3a3e" />
        <stop offset="0.45" stop-color="#2a8a87" />
        <stop offset="1" stop-color="#0b3a3e" />
      </linearGradient>
    </defs>
    <!-- remate -->
    <path d="M100 6v40" stroke="#d9b97a" stroke-width="2" stroke-linecap="round" />
    <circle cx="100" cy="30" r="4.5" fill="#d9b97a" />
    <circle cx="100" cy="42" r="3" fill="#d9b97a" />
    <!-- cone canelado -->
    <path d="M100 46 L148 168 H52 Z" :fill="`url(#cone-${id})`" />
    <g stroke="#0b3a3e" stroke-width="1" opacity="0.55">
      <line v-for="x in coneFlutes" :key="x" x1="100" y1="46" :x2="x" y2="168" />
    </g>
    <!-- cornija -->
    <rect x="46" y="166" width="108" height="8" rx="2" fill="#d9b97a" opacity="0.85" />
    <!-- tambor canelado -->
    <rect x="52" y="174" width="96" height="96" :fill="`url(#drum-${id})`" />
    <g stroke="#082d30" stroke-width="1.6" opacity="0.6">
      <line v-for="x in drumFlutes" :key="x" :x1="x" y1="178" :x2="x" y2="266" />
    </g>
    <!-- janelas -->
    <g fill="#f1dca8" opacity="0.75">
      <path d="M78 262v-26a6 6 0 0 1 12 0v26z" />
      <path d="M110 262v-26a6 6 0 0 1 12 0v26z" />
    </g>
    <rect x="40" y="268" width="120" height="32" fill="#0b1b2a" />
  </svg>
</template>
