<script setup lang="ts">
/**
 * Os círculos do samâ‘: anéis que giram em sentidos opostos e, no anel do meio, dervixes vistos
 * de cima (a saia aberta e o chapéu de feltro) girando em torno de si e do centro — como no salão
 * dos dervixes giradores. No centro, a estrela de oito pontas dos azulejos seljúcidas de Konya.
 * Decorativo; herda a cor de `currentColor`. Parado com prefers-reduced-motion (CSS global).
 */
const props = withDefaults(defineProps<{ dancers?: number }>(), { dancers: 12 })
const angles = computed(() =>
  Array.from({ length: props.dancers }, (_, i) => (360 / props.dancers) * i),
)

function star(r: number) {
  const inner = r * 0.62
  return Array.from({ length: 16 }, (_, k) => {
    const radius = k % 2 === 0 ? r : inner
    const a = (Math.PI / 8) * k - Math.PI / 2
    return `${(radius * Math.cos(a)).toFixed(2)},${(radius * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}
</script>

<template>
  <svg
    viewBox="-200 -200 400 400"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    class="sema pointer-events-none"
  >
    <g class="sema__spin sema__spin--slow">
      <circle r="192" stroke-width="0.7" stroke-dasharray="1.5 7" stroke-linecap="round" />
    </g>
    <circle r="176" stroke-width="0.5" opacity="0.5" />

    <!-- os dervixes, em roda -->
    <g class="sema__spin sema__spin--dancers">
      <circle r="150" stroke-width="0.4" opacity="0.35" />
      <g v-for="a in angles" :key="a" :transform="`rotate(${a}) translate(0 -150)`">
        <g class="sema__dancer">
          <circle r="13" stroke-width="0.8" />
          <circle r="13" stroke-width="2.2" stroke-dasharray="1 3.1" opacity="0.6" />
          <circle r="3.6" fill="currentColor" stroke="none" />
          <path d="M-13 0h-7M13 0h7" stroke-width="0.8" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <g class="sema__spin sema__spin--reverse">
      <circle r="118" stroke-width="0.6" stroke-dasharray="6 5" />
    </g>
    <circle r="100" stroke-width="0.5" opacity="0.5" />

    <!-- estrela seljúcida -->
    <g class="sema__spin sema__spin--star">
      <polygon :points="star(78)" stroke-width="0.9" />
      <polygon :points="star(48)" stroke-width="0.6" opacity="0.7" />
      <circle r="10" stroke-width="0.6" />
    </g>
  </svg>
</template>

<style scoped>
.sema__spin,
.sema__dancer {
  transform-box: fill-box;
  transform-origin: center;
  animation: sema-turn linear infinite;
}
.sema__spin--slow {
  animation-duration: 140s;
}
.sema__spin--dancers {
  animation-duration: 90s;
}
.sema__spin--reverse {
  animation-duration: 70s;
  animation-direction: reverse;
}
.sema__spin--star {
  animation-duration: 200s;
  animation-direction: reverse;
}
/* Cada dervixe gira em torno de si, no sentido anti-horário, como na cerimônia. */
.sema__dancer {
  animation-duration: 6s;
  animation-direction: reverse;
}
@keyframes sema-turn {
  to {
    rotate: 360deg;
  }
}
</style>
