<script setup lang="ts">
import { BookOpenText, Columns2, Hand, Sparkle, X } from '@lucide/vue'

const dismissed = useLocalState<boolean>(
  'jardim:guia-iniciante-fechado',
  () => false,
  (v): v is boolean => typeof v === 'boolean',
)
const { open } = useGlossary()

const tips = [
  {
    icon: Columns2,
    title: 'Leia de dois em dois versos',
    text: 'O poema é feito de pares de versos. Cada par é uma ideia quase completa, como contas de um colar.',
    term: 'disticos',
    termLabel: 'O que é um dístico?',
  },
  {
    icon: Sparkle,
    title: 'O amor é humano e divino',
    text: 'O amado pode ser o amigo Shams, uma pessoa qualquer ou Deus. O vinho pode ser vinho ou êxtase. Rumi deixa os sentidos se misturarem.',
    term: 'shams',
    termLabel: 'Quem foi Shams?',
  },
  {
    icon: BookOpenText,
    title: 'Uma história puxa a outra',
    text: 'No Masnavi, Rumi começa uma história, para no meio para ensinar alguma coisa, conta outra e depois volta. Não se perca: é de propósito.',
    term: 'masnavi',
    termLabel: 'O que é o Masnavi?',
  },
  {
    icon: Hand,
    title: 'Toque nas palavras sublinhadas',
    text: 'Palavras com sublinhado pontilhado abrem uma explicação simples. Funciona em todo o site.',
    term: 'gazel',
    termLabel: 'Experimente: gazel',
  },
]
</script>

<template>
  <section v-if="!dismissed" class="beginner" aria-labelledby="guia-iniciante">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="eyebrow !text-tile">Primeira vez?</p>
        <h2 id="guia-iniciante" class="mt-1 text-2xl !text-ivory sm:text-3xl">Como ler Rumi</h2>
      </div>
      <button
        type="button"
        class="grid size-10 shrink-0 place-items-center rounded-full text-ivory/80 hover:bg-white/10"
        aria-label="Fechar o guia"
        @click="dismissed = true"
      >
        <X class="size-5" aria-hidden="true" />
      </button>
    </div>
    <ul class="mt-6 grid gap-3 sm:grid-cols-2">
      <li v-for="tip in tips" :key="tip.title" class="beginner__tip">
        <component :is="tip.icon" class="size-5 text-tile" aria-hidden="true" />
        <h3 class="mt-3 font-serif text-base font-semibold !text-ivory">{{ tip.title }}</h3>
        <p class="mt-1 text-sm leading-relaxed text-ivory/80">{{ tip.text }}</p>
        <button
          type="button"
          class="mt-3 text-sm text-tile underline decoration-dotted underline-offset-4 hover:text-ivory"
          @click="open(tip.term)"
        >
          {{ tip.termLabel }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.beginner {
  padding: 1.5rem;
  border-radius: 1rem;
  color: var(--color-ivory);
  background:
    radial-gradient(circle at 100% 0%, rgb(184 149 79 / 0.25), transparent 50%), var(--color-lapis);
}
@media (min-width: 640px) {
  .beginner {
    padding: 2rem;
  }
}
.beginner__tip {
  padding: 1.1rem 1.2rem;
  border-radius: 0.75rem;
  background: rgb(246 243 236 / 0.07);
  border: 1px solid rgb(246 243 236 / 0.12);
}
</style>
