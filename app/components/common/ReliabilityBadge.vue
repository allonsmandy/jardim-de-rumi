<script setup lang="ts">
/**
 * Selo que diz ao leitor quanto podemos confiar numa afirmação:
 * - fato: documentado em fontes da época ou na própria obra;
 * - estudiosos: leitura ou hipótese de pesquisadores, sem prova definitiva;
 * - tradicao: história contada por séculos, sem confirmação histórica.
 */
type Reliability = 'fato' | 'estudiosos' | 'tradicao'

const props = defineProps<{ kind: Reliability }>()

const LABELS: Record<Reliability, string> = {
  fato: 'Fato documentado',
  estudiosos: 'Hipótese',
  tradicao: 'Tradição popular',
}
const label = computed(() => LABELS[props.kind])
</script>

<template>
  <span class="badge" :class="`badge--${kind}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1px solid currentColor;
}
.badge::before {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: currentColor;
}
.badge--fato {
  color: var(--color-lapis);
  background: rgb(23 53 80 / 0.07);
}
.badge--estudiosos {
  color: #7a5a1f;
  background: rgb(184 149 79 / 0.14);
}
.badge--tradicao {
  color: var(--color-turquoise);
  background: rgb(73 182 176 / 0.16);
}
</style>
