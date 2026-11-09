<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { PoemCategoryId, type PoemSummary } from '#shared/schemas/poem'
import {
  categoriesOf,
  getCategory,
  getWorkBySlug,
  poemLabel,
  poemPath,
} from '#shared/utils/categories'
import { paginate, searchPoems } from '#shared/utils/library'
import { toPersianDigits } from '#shared/utils/text'

const route = useRoute()
const router = useRouter()
const found = getWorkBySlug(String(route.params.obra))
if (!found) throw createError({ statusCode: 404, message: 'Página não encontrada', fatal: true })
const work = found
const categories = categoriesOf(work.id)

const INTRO: Record<typeof work.id, string> = {
  masnavi:
    'O Masnavi tem seis livros e cerca de 25 mil dísticos. Cada livro está dividido em seções, cada uma aberta por um título em prosa. A numeração das seções segue o Ganjoor.',
  shams:
    'O Divã de Shams reúne os poemas líricos de Rumi: gazéis, rubaiyat e tarji‘-bands. A numeração segue o Ganjoor.',
}

useSeoMeta({
  title: `${work.title} de Rumi`,
  description: `${work.description} Em persa e em português, com busca por número ou verso.`,
})

const PAGE_SIZE = 24
const { data: allPoems } = await usePoemIndex()
const poems = computed(() => allPoems.value.filter((p) => getCategory(p.category).work === work.id))

const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const parsedCategory = PoemCategoryId.safeParse(route.query.categoria)
const category = ref<PoemCategoryId | ''>(
  parsedCategory.success && categories.some((c) => c.id === parsedCategory.data)
    ? parsedCategory.data
    : '',
)
const page = ref(Number(route.query.pagina) || 1)

const results = computed(() =>
  searchPoems(poems.value, { q: query.value, category: category.value || undefined }),
)
const current = computed(() => paginate(results.value, page.value, PAGE_SIZE))
const countIn = (id: string) => poems.value.filter((p) => p.category === id).length

watch([query, category], () => (page.value = 1))
watch([query, category, page], () => {
  router.replace({
    query: {
      ...(query.value ? { q: query.value } : {}),
      ...(category.value ? { categoria: category.value } : {}),
      ...(current.value.page > 1 ? { pagina: String(current.value.page) } : {}),
    },
  })
})

/* A obra inteira: cada ponto é uma peça; as já traduzidas brilham.
   No Divã de Shams, o céu mostra só os gazéis (são 3.230). */
const sky = computed(() =>
  (work.id === 'masnavi' ? categories : categories.filter((c) => c.id === 'gazal')).map((c) => ({
    category: c,
    total: c.expectedCount ?? 0,
    published: new Map<number, PoemSummary>(
      poems.value.filter((p) => p.category === c.id).map((p) => [p.number, p]),
    ),
  })),
)
const TOTAL = computed(() => sky.value.reduce((n, s) => n + s.total, 0))
const PUBLISHED = computed(() => sky.value.reduce((n, s) => n + s.published.size, 0))
const percent = computed(() =>
  ((PUBLISHED.value / Math.max(TOTAL.value, 1)) * 100).toFixed(1).replace('.', ','),
)
const skyUnit = work.id === 'masnavi' ? 'seções' : 'gazéis'
const starTitle = (p: PoemSummary) =>
  `${poemLabel(p)} — ${p.sectionTitle?.pt ?? p.firstLine.pt ?? p.firstLine.fa}`
</script>

<template>
  <div>
    <!-- Abertura -->
    <section class="hero">
      <NightAmbient :count="12" />
      <div class="container-reading relative py-20 text-center sm:py-24">
        <p class="eyebrow !text-gold">A biblioteca</p>
        <h1 class="hero__title">{{ work.title }}</h1>
        <PersianText as="p" class="hero__fa">{{ work.titleFa }}</PersianText>
        <p class="hero__lead">
          <GlossaryText :text="`${work.description} ${INTRO[work.id]}`" />
        </p>
        <form role="search" class="search" @submit.prevent>
          <Search class="size-5 shrink-0 text-gold" aria-hidden="true" />
          <label class="sr-only" for="busca-diva">
            Buscar por número, palavra ou verso (português ou persa)
          </label>
          <input
            id="busca-diva"
            v-model="query"
            type="search"
            placeholder="Número, palavra ou verso — em português ou persa"
            autocomplete="off"
          />
          <button
            v-if="query"
            type="button"
            class="search__clear"
            aria-label="Limpar busca"
            @click="query = ''"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </form>
        <div class="tabs" role="group" aria-label="Categorias">
          <button
            type="button"
            class="tab"
            :class="{ 'tab--on': !category }"
            :aria-pressed="!category"
            @click="category = ''"
          >
            Todos <span>{{ poems.length }}</span>
          </button>
          <button
            v-for="c in categories"
            :key="c.id"
            type="button"
            class="tab"
            :class="{ 'tab--on': category === c.id, 'tab--empty': !countIn(c.id) }"
            :aria-pressed="category === c.id"
            @click="category = c.id"
          >
            {{ c.labelPlural }} <span>{{ countIn(c.id) || 'em breve' }}</span>
          </button>
        </div>
      </div>
      <svg class="arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Resultados -->
    <section class="container-editorial pt-14" aria-label="Poemas">
      <p class="status" role="status" aria-live="polite">
        <span>{{ results.length }}</span>
        {{ results.length === 1 ? work.item : work.itemPlural }}
        <template v-if="query"> para “{{ query }}”</template>
        <template v-if="category">
          em {{ categories.find((c) => c.id === category)?.labelPlural }}
        </template>
      </p>

      <div v-if="!results.length" class="empty">
        <p class="font-display text-2xl">
          {{
            category && !countIn(category)
              ? 'Esta parte ainda não foi traduzida'
              : 'Nada encontrado'
          }}
        </p>
        <p class="mt-2 text-ink-muted">
          Tente outro número, outra palavra ou
          <button
            type="button"
            class="underline"
            @click="
              () => {
                query = ''
                category = ''
              }
            "
          >
            veja tudo</button
          >.
        </p>
      </div>
      <ul v-else class="grid">
        <li v-for="(poem, i) in current.items" :key="poem.id" v-reveal="(i % 4) * 80">
          <PoemCard :poem="poem" />
        </li>
      </ul>
      <PoemPagination
        class="mt-12"
        :page="current.page"
        :total-pages="current.totalPages"
        @change="page = $event"
      />
    </section>

    <!-- A obra inteira -->
    <section class="sky" aria-labelledby="obra-inteira">
      <GirihPattern class="sky__pattern" :size="88" />
      <div class="container-editorial relative py-24">
        <div class="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p class="eyebrow !text-tile">O tamanho do jardim</p>
            <h2 id="obra-inteira" class="mt-2 text-4xl !text-ivory sm:text-5xl">
              {{ work.id === 'masnavi' ? 'O Masnavi inteiro' : 'Todos os gazéis' }}
            </h2>
          </div>
          <p class="text-ivory/75 lg:pb-2">
            Cada ponto é uma das {{ TOTAL.toLocaleString('pt-BR') }} {{ skyUnit }}. Os que brilham
            já estão traduzidos e explicados — toque num deles para ler. Os outros ainda esperam a
            sua vez.
          </p>
        </div>

        <div class="sky__meter" aria-hidden="true">
          <span :style="{ width: `${(PUBLISHED / Math.max(TOTAL, 1)) * 100}%` }" />
        </div>
        <p class="sky__count">
          <strong>{{ PUBLISHED }}</strong> de {{ TOTAL.toLocaleString('pt-BR') }} {{ skyUnit }} ·
          {{ percent }}%
        </p>

        <div v-for="part in sky" :key="part.category.id" class="sky__part">
          <h3 v-if="sky.length > 1" class="sky__part-title">
            {{ part.category.labelPlural }}
            <span lang="fa">{{ part.category.labelFa }}</span>
            <small>{{ part.published.size }} / {{ part.total }}</small>
          </h3>
          <ol
            class="stars"
            :class="{ 'stars--dense': part.total > 600 }"
            :aria-label="`${part.category.labelPlural}: ${part.published.size} de ${part.total} traduzidos`"
          >
            <li v-for="n in part.total" :key="n">
              <NuxtLink
                v-if="part.published.get(n)"
                :to="poemPath(part.published.get(n)!)"
                class="star star--on"
                :title="starTitle(part.published.get(n)!)"
                :aria-label="starTitle(part.published.get(n)!)"
              >
                <span lang="fa" aria-hidden="true">{{ toPersianDigits(n) }}</span>
              </NuxtLink>
              <span v-else class="star" aria-hidden="true" />
            </li>
          </ol>
        </div>
        <p class="sky__legend">
          <span><i class="star star--on star--legend" /> traduzido</span>
          <span><i class="star star--legend" /> ainda não</span>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Abertura ── */
.hero {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 30%, rgb(19 101 107 / 0.55), transparent 60%),
    radial-gradient(ellipse at 0% 100%, rgb(23 53 80 / 0.8), transparent 50%), #0b1b2a;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(3.4rem, 10vw, 6rem);
  line-height: 1;
  color: var(--color-ivory);
  animation: rise 1.1s var(--ease-garden) both;
}
.hero__fa {
  margin-top: 0.4rem;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: #d9b97a;
  animation: rise 1.1s 0.1s var(--ease-garden) both;
}
.hero__lead {
  max-width: 34rem;
  margin: 1.25rem auto 0;
  color: rgb(246 243 236 / 0.78);
  animation: rise 1.1s 0.2s var(--ease-garden) both;
}
.hero__lead :deep(.glossary-term) {
  text-decoration-color: var(--color-tile);
}
.hero__lead :deep(.glossary-term:hover) {
  color: var(--color-ivory);
}
.search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 36rem;
  margin: 2.25rem auto 0;
  padding: 0.9rem 1.25rem;
  border-radius: 999px;
  background: rgb(246 243 236 / 0.08);
  border: 1px solid rgb(217 185 122 / 0.45);
  backdrop-filter: blur(6px);
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
  animation: rise 1.1s 0.3s var(--ease-garden) both;
}
.search:focus-within {
  background: rgb(246 243 236 / 0.14);
  border-color: #f1dca8;
  box-shadow: 0 0 0 6px rgb(217 185 122 / 0.15);
}
.search input {
  flex: 1;
  min-width: 0;
  font-size: 1.05rem;
  color: var(--color-ivory);
  background: transparent;
  outline: none;
}
.search input::placeholder {
  color: rgb(246 243 236 / 0.45);
}
.search input::-webkit-search-cancel-button {
  display: none;
}
.search__clear {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  color: var(--color-ivory);
  background: rgb(246 243 236 / 0.12);
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  animation: rise 1.1s 0.4s var(--ease-garden) both;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: 0.88rem;
  color: rgb(246 243 236 / 0.8);
  border: 1px solid rgb(246 243 236 / 0.2);
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}
.tab span {
  font-size: 0.72rem;
  color: rgb(246 243 236 / 0.5);
  font-variant-numeric: lining-nums;
}
.tab:hover {
  border-color: rgb(241 220 168 / 0.6);
}
.tab--on {
  color: var(--color-ink);
  background: #f1dca8;
  border-color: #f1dca8;
}
.tab--on span {
  color: rgb(34 38 42 / 0.6);
}
.tab--empty:not(.tab--on) {
  color: rgb(246 243 236 / 0.5);
}
.arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

/* ── Resultados ── */
.status {
  font-size: 0.95rem;
  color: var(--color-ink-muted);
}
.status > span {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-turquoise);
  font-variant-numeric: lining-nums;
}
.grid {
  display: grid;
  gap: 1.75rem 1.25rem;
  margin-top: 1.75rem;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
}
.empty {
  margin-top: 1.5rem;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  background: #fffefb;
  border: 1px dashed var(--color-line);
}

/* ── O Divã inteiro ── */
.sky {
  position: relative;
  overflow: hidden;
  margin-top: 6rem;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 20% 0%, rgb(19 101 107 / 0.45), transparent 50%),
    radial-gradient(ellipse at 90% 100%, rgb(23 53 80 / 0.7), transparent 50%), #0b1b2a;
}
.sky__pattern {
  position: absolute;
  inset: 0;
  color: rgb(184 149 79 / 0.05);
}
.sky__meter {
  height: 4px;
  margin-top: 2.5rem;
  border-radius: 999px;
  background: rgb(246 243 236 / 0.12);
  overflow: hidden;
}
.sky__meter span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold), #f1dca8);
  box-shadow: 0 0 12px rgb(241 220 168 / 0.6);
}
.sky__count {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: rgb(246 243 236 / 0.65);
}
.sky__count strong {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: #f1dca8;
}
.stars {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(1.15rem, 1fr));
  gap: 0.45rem;
  margin-top: 2rem;
}
.stars--dense {
  grid-template-columns: repeat(auto-fill, minmax(0.7rem, 1fr));
  gap: 0.2rem;
}
.stars--dense .star {
  width: 0.28rem;
  height: 0.28rem;
}
.stars--dense .star--on {
  width: 0.7rem;
  height: 0.7rem;
}
.sky__part + .sky__part {
  margin-top: 2.5rem;
}
.sky__part-title {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-top: 2.5rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-ivory);
}
.sky__part-title [lang='fa'] {
  font-family: var(--font-persian);
  font-size: 1.1rem;
  color: #d9b97a;
}
.sky__part-title small {
  margin-left: auto;
  font-family: var(--font-serif);
  font-size: 0.8rem;
  color: rgb(246 243 236 / 0.55);
}
.stars > li {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
}
.star {
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: rgb(246 243 236 / 0.18);
}
.star--on {
  position: relative;
  display: grid;
  place-items: center;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 0;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
  background: #f1dca8;
  text-decoration: none;
  filter: drop-shadow(0 0 6px rgb(241 220 168 / 0.8));
  animation: twinkle 3s ease-in-out infinite;
  transition: scale 0.2s var(--ease-garden);
}
.stars > li:nth-child(3n) .star--on {
  animation-delay: -1s;
}
.stars > li:nth-child(5n) .star--on {
  animation-delay: -2s;
}
.star--on span {
  display: none;
}
.star--on:hover,
.star--on:focus-visible {
  scale: 1.8;
}
.star--legend {
  display: inline-block;
  vertical-align: middle;
  animation: none;
}
.sky__legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: rgb(246 243 236 / 0.6);
}
.sky__legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
@keyframes twinkle {
  50% {
    opacity: 0.65;
  }
}
</style>
