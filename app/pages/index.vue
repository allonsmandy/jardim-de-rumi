<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import type { Artwork } from '#shared/schemas/artwork'
import type { Poem } from '#shared/schemas/poem'
import { poemFullLabel, poemLabel, poemPath } from '#shared/utils/categories'
import { toPersianDigits } from '#shared/utils/text'

useSeoMeta({
  title: 'Rumi em português',
  description:
    'Jardim de Rumi: o Masnavi e o Divã de Shams em persa e em português, com explicações simples verso a verso, uma galeria de arte persa e um glossário para iniciantes.',
  ogTitle: 'Jardim de Rumi — Rumi em persa e em português',
})

const { data: poems } = await usePoemIndex()
const { data: art } = await useFetch<Artwork[]>('/api/art.json', { default: () => [] })
const { open: openTerm, entries: glossaryEntries } = useGlossary()

/* Poema de hoje: muda uma vez por dia, igual para todos. O dia da geração vai no
   payload (sem divergência na hidratação) e é atualizado no navegador. */
const DAY_MS = 86_400_000
const day = useState('home-day', () => Math.floor(Date.now() / DAY_MS))
onMounted(() => (day.value = Math.floor(Date.now() / DAY_MS)))
const featured = computed(() => {
  const list = poems.value
  if (!list.length) return undefined
  return list[day.value % list.length]
})
const todayLabel = computed(() =>
  new Date(day.value * DAY_MS + DAY_MS / 2).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }),
)

/* Verso que respira: alterna os primeiros versos dos poemas publicados */
const verseIndex = ref(0)
const verse = computed(() => poems.value[verseIndex.value % Math.max(poems.value.length, 1)])
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => verseIndex.value++, 6000)
})
onBeforeUnmount(() => clearInterval(timer))

/* Juncos do canavial nas laterais da abertura (posições fixas: iguais no servidor e no navegador). */
const reeds = [
  { side: 'left', offset: '3%', height: '64%', delay: '0s', opacity: 0.9 },
  { side: 'left', offset: '6.5%', height: '48%', delay: '-2s', opacity: 0.6 },
  { side: 'left', offset: '9%', height: '56%', delay: '-4s', opacity: 0.45 },
  { side: 'right', offset: '4%', height: '70%', delay: '-1s', opacity: 0.9 },
  { side: 'right', offset: '7.5%', height: '52%', delay: '-3s', opacity: 0.6 },
  { side: 'right', offset: '10.5%', height: '44%', delay: '-5s', opacity: 0.45 },
].map((r, i) => ({ ...r, id: i }))

const doorArt = computed(() => art.value.find((a) => a.id === 'dervixes-dancando'))

/* A Canção da flauta (Masnavi I, 1), quando estiver publicada */
const reedSong = computed(() =>
  poems.value.find((p) => p.category === 'masnavi-1' && p.number === 1),
)

const steps = [
  {
    title: 'Escolha um trecho',
    text: 'Uma seção do Masnavi ou um gazel do Divã: cada um se lê em poucos minutos.',
  },
  {
    title: 'Leia no modo Estudar',
    text: 'Cada par de versos vem com uma explicação em palavras simples.',
  },
  {
    title: 'Toque nas palavras sublinhadas',
    text: 'Shams, samâ‘, sufismo: um toque e a explicação aparece.',
  },
]

const starterTerms = [
  { id: 'ney', label: 'flauta de junco' },
  { id: 'shams', label: 'Shams' },
  { id: 'masnavi', label: 'Masnavi' },
  { id: 'sama', label: 'samâ‘' },
  { id: 'sufi', label: 'sufismo' },
  { id: 'amado', label: 'o amado' },
  { id: 'gazel', label: 'gazel' },
  { id: 'khamush', label: 'silêncio' },
]
const lexicon = computed(() =>
  starterTerms.map((t) => {
    const e = glossaryEntries.value.find((x) => x.id === t.id)
    return {
      ...t,
      fa: e?.termFa ?? '',
      term: e?.term ?? t.label,
      translit: e?.transliteration ?? '',
      short: e?.short ?? '',
    }
  }),
)
const wordIndex = ref(0)
const word = computed(() => lexicon.value[wordIndex.value])

/* Comece por aqui: demonstração com conteúdo real da primeira seção do Masnavi */
const { data: demo } = await useFetch<{ poem: Poem }>('/api/poems/masnavi-1/1')
const demoStanza = computed(() => {
  const p = demo.value?.poem
  if (!p?.original || !p.translation) return undefined
  return {
    fa: p.original.stanzas[0],
    pt: p.translation.stanzas[0],
    plain: p.stanzaNotes.find((n) => n.stanza === 1)?.plain ?? '',
  }
})
const neyShort = computed(() => glossaryEntries.value.find((e) => e.id === 'ney')?.short ?? '')
const tourStep = ref(0)
const tourTick = ref(0)
const tourPaused = ref(false)
const TOUR_MS = 6000
let tourTimer: ReturnType<typeof setInterval> | undefined
let tourElapsed = 0
function goStep(i: number) {
  tourStep.value = i
  tourTick.value++
  tourElapsed = 0
}
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  tourTimer = setInterval(() => {
    if (tourPaused.value) return
    tourElapsed += 200
    if (tourElapsed >= TOUR_MS) goStep((tourStep.value + 1) % steps.length)
  }, 200)
})
onBeforeUnmount(() => clearInterval(tourTimer))

/* Estante de poemas: setas e barra de progresso */
const shelfEl = ref<HTMLElement>()
const shelfProgress = ref(0)
function onShelfScroll() {
  const el = shelfEl.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  shelfProgress.value = max > 0 ? el.scrollLeft / max : 1
}
function slide(dir: number) {
  const el = shelfEl.value
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' })
}
onMounted(onShelfScroll)
</script>

<template>
  <div>
    <!-- ───────── Abertura: o jardim à noite ───────── -->
    <section class="hero">
      <NightAmbient :count="22" />
      <!-- O canavial (neyestan): de onde a flauta foi cortada -->
      <span
        v-for="r in reeds"
        :key="r.id"
        class="reed"
        :class="`reed--${r.side}`"
        :style="{
          [r.side]: r.offset,
          height: r.height,
          animationDelay: r.delay,
          opacity: r.opacity,
        }"
        aria-hidden="true"
      />
      <KonyaDome class="hero__dome" />

      <div class="hero__stage">
        <SemaRings class="hero__sema" />
        <PersianArch class="hero__arch" />
        <div class="hero__content">
          <p class="hero__fa" lang="fa">باغ مولانا</p>
          <h1 class="hero__title">Jardim de Rumi</h1>
          <p class="hero__lead">
            <GlossaryText
              text="O Masnavi e o Divã de Shams, de Rumi, em persa e em português — traduzidos direto do persa e explicados verso a verso para quem nunca leu poesia persa."
            />
          </p>
          <div class="hero__ctas">
            <NuxtLink to="/masnavi" class="cta cta--gold">
              Ler o Masnavi <ArrowRight class="size-4" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink to="/diva-de-shams" class="cta cta--ghost">Abrir o Divã de Shams</NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="verse" class="breathing" aria-live="off">
        <p class="breathing__label">Um verso do jardim</p>
        <Transition name="verse" mode="out-in">
          <NuxtLink :key="verse.id" :to="poemPath(verse)" class="breathing__verse">
            <span lang="fa" dir="rtl" class="breathing__fa">{{ verse.firstLine.fa }}</span>
            <span class="breathing__pt">{{ verse.firstLine.pt }}</span>
          </NuxtLink>
        </Transition>
      </div>

      <svg class="arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- ───────── Comece por aqui: demonstração ao vivo ───────── -->
    <section class="tour" aria-labelledby="comece">
      <div class="container-editorial grid gap-12 py-24 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <p class="eyebrow">Nunca leu Rumi?</p>
          <h2 id="comece" class="mt-2 text-4xl sm:text-5xl">Comece por aqui</h2>
          <p class="mt-4 max-w-md text-ink-muted">
            Três passos, e você já está lendo poesia persa do século XIII. Veja como funciona:
          </p>
          <ol class="tour__steps mt-10">
            <li v-for="(step, i) in steps" :key="step.title">
              <button
                type="button"
                class="tour__step"
                :class="{ 'tour__step--on': tourStep === i }"
                :aria-pressed="tourStep === i"
                @click="goStep(i)"
              >
                <span class="tour__n" aria-hidden="true">
                  <span lang="fa">{{ toPersianDigits(i + 1) }}</span>
                </span>
                <span class="grid gap-1 text-left">
                  <span class="font-display text-2xl">{{ step.title }}</span>
                  <span class="tour__text">{{ step.text }}</span>
                </span>
                <span
                  v-if="tourStep === i"
                  :key="tourTick"
                  class="tour__bar"
                  :class="{ 'tour__bar--paused': tourPaused }"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ol>
        </div>

        <!-- A "tela" mostrando cada passo -->
        <div class="screen" @mouseenter="tourPaused = true" @mouseleave="tourPaused = false">
          <div class="screen__bar" aria-hidden="true">
            <i /><i /><i />
            <span
              >jardimderumi · {{ ['o Masnavi', 'livro I · estudar', 'livro I'][tourStep] }}</span
            >
          </div>
          <Transition name="screen" mode="out-in">
            <!-- 1. Escolher -->
            <div v-if="tourStep === 0" key="0" class="screen__body">
              <p class="screen__label">O Masnavi</p>
              <ul class="grid gap-2.5">
                <li
                  v-for="(p, i) in poems.slice(0, 4)"
                  :key="p.id"
                  class="mini-card"
                  :class="{ 'mini-card--pick': i === 0 }"
                  :style="{ animationDelay: `${i * 0.12}s` }"
                >
                  <span class="mini-card__n" lang="fa">{{ toPersianDigits(p.number) }}</span>
                  <span class="grid">
                    <span class="truncate font-display text-lg">{{
                      p.sectionTitle?.pt ?? p.firstLine.pt
                    }}</span>
                    <span lang="fa" dir="rtl" class="truncate text-sm text-lapis">{{
                      p.firstLine.fa
                    }}</span>
                  </span>
                  <span v-if="i === 0" class="mini-card__cursor" aria-hidden="true">↖</span>
                </li>
              </ul>
            </div>
            <!-- 2. Estudar -->
            <div v-else-if="tourStep === 1 && demoStanza" key="1" class="screen__body">
              <p class="screen__label">Livro I, seção 1 · dístico 1</p>
              <div class="demo-verse">
                <p lang="fa" dir="rtl" class="demo-verse__fa">
                  <span v-for="(l, i) in demoStanza.fa" :key="i" class="block">{{ l }}</span>
                </p>
                <p class="demo-verse__pt">
                  <span v-for="(l, i) in demoStanza.pt" :key="i" class="block">{{ l }}</span>
                </p>
              </div>
              <div class="demo-plain">
                <span class="demo-plain__label">Em palavras simples</span>
                <p>{{ demoStanza.plain }}</p>
              </div>
            </div>
            <!-- 3. Tocar na palavra -->
            <div v-else key="2" class="screen__body">
              <p class="screen__label">Livro I, seção 1 · por trás das palavras</p>
              <p class="demo-sentence">
                A
                <span class="demo-term">
                  flauta de junco
                  <span class="demo-pop" role="note">
                    <span class="demo-pop__fa" lang="fa">نی</span>
                    <strong>Flauta de junco (ney)</strong>
                    {{ neyShort }}
                  </span>
                </span>
                chora porque foi cortada do canavial — como a alma, longe da sua origem.
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ───────── Poema de hoje ───────── -->
    <section class="today" aria-labelledby="poema-de-hoje">
      <GirihPattern class="today__pattern" :size="96" />
      <div class="container-editorial relative py-24">
        <figure v-if="featured" v-reveal class="leaf">
          <span class="leaf__corner leaf__corner--tl" aria-hidden="true" />
          <span class="leaf__corner leaf__corner--tr" aria-hidden="true" />
          <span class="leaf__corner leaf__corner--bl" aria-hidden="true" />
          <span class="leaf__corner leaf__corner--br" aria-hidden="true" />
          <p class="leaf__date">Poema de hoje · {{ todayLabel }}</p>
          <h2 id="poema-de-hoje" class="sr-only">Poema de hoje</h2>
          <blockquote class="mt-8">
            <p lang="fa" dir="rtl" class="leaf__fa">{{ featured.firstLine.fa }}</p>
            <span class="leaf__divider" aria-hidden="true"><i /></span>
            <p v-if="featured.firstLine.pt" class="leaf__pt">“{{ featured.firstLine.pt }}”</p>
          </blockquote>
          <figcaption class="mt-6 text-sm text-ink-muted">
            Rumi · {{ poemFullLabel(featured) }}
            <PreliminaryNotice v-if="featured.machineAssisted" compact class="ml-2" />
          </figcaption>
          <NuxtLink :to="poemPath(featured)" class="cta cta--turquoise mt-8">
            Ler e entender o poema <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </figure>
      </div>
    </section>

    <!-- ───────── As quatro portas ───────── -->
    <section class="container-editorial py-24" aria-labelledby="portas">
      <div class="grid gap-4 lg:grid-cols-[1fr_1.3fr] lg:items-end">
        <div>
          <p class="eyebrow">O jardim</p>
          <h2 id="portas" class="mt-2 text-4xl sm:text-5xl">Quatro portas para entrar</h2>
        </div>
        <p class="text-ink-muted lg:pb-2">
          As duas grandes obras, o poeta e a arte que nasceu delas. Escolha por onde começar.
        </p>
      </div>
      <ul class="doors mt-14">
        <li v-reveal="0">
          <NuxtLink to="/masnavi" class="door door--diva">
            <span class="door__fa" lang="fa">مثنوی</span>
            <span class="door__body">
              <span class="door__title">Masnavi</span>
              <span class="door__text">
                Seis livros de histórias e ensinamentos, que começam com o lamento de uma flauta.
              </span>
            </span>
          </NuxtLink>
        </li>
        <li v-reveal="120">
          <NuxtLink to="/o-poeta" class="door door--poeta">
            <span class="door__fa" lang="fa">مولانا</span>
            <span class="door__body">
              <span class="door__title">O Poeta</span>
              <span class="door__text">De Balkh a Konya, o encontro com Shams, fato e lenda.</span>
            </span>
          </NuxtLink>
        </li>
        <li v-reveal="240">
          <NuxtLink to="/diva-de-shams" class="door door--fal">
            <span class="door__fa" lang="fa">شمس</span>
            <span class="door__body">
              <span class="door__title">Divã de Shams</span>
              <span class="door__text">Gazéis e quadras de amor e êxtase, feitos para cantar.</span>
            </span>
          </NuxtLink>
        </li>
        <li v-reveal="360">
          <NuxtLink to="/arte-persa" class="door door--arte">
            <img
              v-if="doorArt"
              :src="doorArt.image.src"
              :alt="''"
              class="door__img"
              loading="lazy"
            />
            <span class="door__fa" lang="fa">هنر</span>
            <span class="door__body">
              <span class="door__title">Arte Persa</span>
              <span class="door__text">Manuscritos, dervixes e a cidade de Konya.</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- ───────── Palavras: um dicionário aberto ───────── -->
    <section class="lexicon" aria-labelledby="palavras">
      <div class="container-editorial py-24">
        <div class="mx-auto max-w-2xl text-center">
          <p class="eyebrow">Glossário</p>
          <h2 id="palavras" class="mt-2 text-4xl sm:text-5xl">Oito palavras para começar</h2>
          <p class="mt-4 text-ink-muted">
            Elas aparecem em quase todos os poemas. Escolha uma no índice.
          </p>
        </div>

        <div class="book mt-14">
          <ol class="book__index" aria-label="Índice das palavras">
            <li v-for="(t, i) in lexicon" :key="t.id">
              <button
                type="button"
                class="book__entry"
                :class="{ 'book__entry--on': wordIndex === i }"
                :aria-pressed="wordIndex === i"
                @click="wordIndex = i"
                @mouseenter="wordIndex = i"
                @focus="wordIndex = i"
              >
                <span class="book__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="book__pt">{{ t.label }}</span>
                <span class="book__dots" aria-hidden="true" />
                <span class="book__fa" lang="fa">{{ t.fa }}</span>
              </button>
            </li>
          </ol>

          <div class="book__page" aria-live="polite">
            <Transition name="word" mode="out-in">
              <article v-if="word" :key="word.id" class="entry">
                <p class="entry__fa" lang="fa">{{ word.fa }}</p>
                <p class="entry__translit">{{ word.translit }}</p>
                <h3 class="entry__term">{{ word.term }}</h3>
                <p class="entry__short">{{ word.short }}</p>
                <button type="button" class="entry__more" @click="openTerm(word.id)">
                  Ler a explicação completa <ArrowRight class="size-4" aria-hidden="true" />
                </button>
              </article>
            </Transition>
            <span class="book__folio" aria-hidden="true"
              >{{ wordIndex + 1 }} / {{ lexicon.length }}</span
            >
          </div>
        </div>

        <p class="mt-10 text-center">
          <NuxtLink to="/glossario" class="inline-flex items-center gap-1">
            Ver as {{ glossaryEntries.length }} palavras do glossário
            <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </p>
      </div>
    </section>

    <!-- ───────── Os primeiros gazéis: galeria de páginas em arco ───────── -->
    <section class="ghazals" aria-labelledby="no-jardim">
      <GirihPattern class="ghazals__pattern" :size="88" />
      <div class="container-editorial relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="eyebrow !text-tile">Já no jardim</p>
          <h2 id="no-jardim" class="mt-2 text-4xl !text-ivory sm:text-5xl">Já traduzidos</h2>
          <p class="mt-3 max-w-md text-ivory/70">
            <template v-if="poems.length">
              {{ poems.length }} {{ poems.length === 1 ? 'texto traduzido' : 'textos traduzidos' }}
              e explicados verso a verso — e o jardim continua crescendo.
            </template>
            <template v-else>
              As primeiras traduções estão sendo preparadas. Enquanto isso, conheça o poeta e as
              palavras-chave.
            </template>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="shelf-btn" aria-label="Poemas anteriores" @click="slide(-1)">
            <ArrowLeft class="size-5" aria-hidden="true" />
          </button>
          <button type="button" class="shelf-btn" aria-label="Próximos poemas" @click="slide(1)">
            <ArrowRight class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul ref="shelfEl" class="shelf" @scroll.passive="onShelfScroll">
        <li v-for="p in poems" :key="p.id">
          <NuxtLink :to="poemPath(p)" class="page">
            <span class="page__medal" aria-hidden="true">
              <span lang="fa">{{ toPersianDigits(p.number) }}</span>
            </span>
            <span lang="fa" dir="rtl" class="page__fa">{{ p.firstLine.fa }}</span>
            <span class="page__divider" aria-hidden="true"><i /></span>
            <span class="page__pt">{{ p.sectionTitle?.pt ?? p.firstLine.pt }}</span>
            <span class="page__go">
              {{ poemLabel(p) }} <ArrowRight class="size-3.5" aria-hidden="true" />
            </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/masnavi" class="page page--all">
            <span class="page__fa" lang="fa">مثنوی</span>
            <span class="page__pt">Ver o Masnavi inteiro</span>
            <ArrowRight class="mx-auto mt-3 size-6" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
      <div class="container-editorial relative">
        <div class="shelf-progress" aria-hidden="true">
          <span :style="{ scale: `${shelfProgress} 1` }" />
        </div>
      </div>
    </section>

    <!-- ───────── Convite final ───────── -->
    <section class="container-editorial pt-24">
      <div v-reveal class="finale">
        <NightAmbient :count="10" />
        <div class="relative px-6 py-20 text-center">
          <p lang="fa" class="finale__fa">بشنو این نی چون شکایت می‌کند</p>
          <h2 class="mt-2 text-4xl !text-ivory sm:text-5xl">Escute a flauta</h2>
          <p class="mx-auto mt-4 max-w-md text-ivory/75">
            O Masnavi começa com uma ordem: “escuta”. É a porta de entrada mais famosa da poesia de
            Rumi — e a nossa também.
          </p>
          <NuxtLink :to="reedSong ? poemPath(reedSong) : '/masnavi'" class="cta cta--gold mt-10">
            {{ reedSong ? 'Ler a Canção da flauta' : 'Abrir o Masnavi' }}
            <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Abertura ── */
.hero {
  position: relative;
  overflow: hidden;
  min-height: calc(100dvh - 5rem);
  display: grid;
  align-content: center;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 40%, rgb(19 101 107 / 0.45), transparent 55%),
    radial-gradient(ellipse at 0% 100%, rgb(23 53 80 / 0.85), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgb(23 53 80 / 0.7), transparent 50%), #0b1b2a;
}
/* Juncos: hastes finas com nós, balançando com o vento */
.reed {
  position: absolute;
  bottom: 1.5rem;
  width: 0.45rem;
  border-radius: 999px 999px 2px 2px;
  background:
    repeating-linear-gradient(180deg, transparent 0 3.2rem, rgb(217 185 122 / 0.55) 3.2rem 3.35rem),
    linear-gradient(90deg, #0d3a3e, #2f8f8f 55%, #0d3a3e);
  transform-origin: bottom center;
  animation: sway 9s ease-in-out infinite;
}
.reed::before {
  content: '';
  position: absolute;
  top: 38%;
  left: 50%;
  width: 2.6rem;
  height: 0.5rem;
  border-radius: 0 100% 0 100%;
  background: #1f6f70;
  rotate: -28deg;
  transform-origin: left center;
}
.reed--right::before {
  left: auto;
  right: 50%;
  rotate: 28deg;
  transform-origin: right center;
  border-radius: 100% 0 100% 0;
}
@media (max-width: 767px) {
  .reed:nth-of-type(3n),
  .reed:nth-of-type(3n + 2) {
    display: none;
  }
}
.hero__dome {
  position: absolute;
  right: 15%;
  bottom: 1.6rem;
  width: clamp(4.5rem, 7vw, 6.5rem);
  opacity: 0.85;
  filter: drop-shadow(0 0 30px rgb(73 182 176 / 0.35));
  animation: fade 2s 0.6s both;
}
@media (max-width: 1023px) {
  .hero__dome {
    display: none;
  }
}
.hero__stage {
  position: relative;
  width: min(44rem, 100%);
  margin-inline: auto;
  padding: 5rem 1.5rem 3rem;
}
.hero__sema {
  position: absolute;
  left: 50%;
  top: 46%;
  width: min(42rem, 125vw);
  translate: -50% -50%;
  color: rgb(73 182 176 / 0.32);
  animation: fade 2.5s 0.2s both;
}
.hero__arch {
  position: absolute;
  inset: 0 6% 0;
  width: 88%;
  height: 100%;
  color: rgb(184 149 79 / 0.5);
}
.hero__arch :deep(path) {
  stroke-dasharray: 1;
  animation: draw 2.8s var(--ease-garden) both;
}
.hero__content {
  position: relative;
  text-align: center;
  padding-top: 3rem;
}
.hero__fa {
  font-family: var(--font-persian);
  font-size: clamp(2.6rem, 8vw, 4.6rem);
  line-height: 1.6;
  background: linear-gradient(100deg, #d9b97a 40%, #fff3d1 50%, #d9b97a 60%);
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    write 2.2s 0.3s cubic-bezier(0.6, 0.1, 0.3, 1) both,
    shimmer 8s 3s ease-in-out infinite;
}
.hero__title {
  font-size: clamp(3rem, 9vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.01em;
  color: var(--color-ivory);
  animation: rise 1.2s 1.3s var(--ease-garden) both;
}
.hero__lead {
  max-width: 32rem;
  margin: 1.5rem auto 0;
  font-size: 1.15rem;
  color: rgb(246 243 236 / 0.8);
  animation: rise 1.2s 1.5s var(--ease-garden) both;
}
.hero__lead :deep(.glossary-term) {
  text-decoration-color: var(--color-tile);
}
.hero__lead :deep(.glossary-term:hover) {
  color: var(--color-ivory);
}
.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
  animation: rise 1.2s 1.7s var(--ease-garden) both;
}

/* Verso que respira */
.breathing {
  position: relative;
  margin: 0 auto 4.5rem;
  max-width: 40rem;
  padding: 0 1.5rem;
  text-align: center;
  animation: fade 1.5s 2.2s both;
}
.breathing__label {
  font-size: 0.65rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgb(73 182 176 / 0.85);
}
.breathing__verse {
  display: grid;
  gap: 0.25rem;
  margin-top: 0.6rem;
  text-decoration: none;
}
.breathing__fa {
  font-family: var(--font-persian);
  font-size: 1.25rem;
  color: #e9cf94;
}
.breathing__pt {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.2rem;
  color: rgb(246 243 236 / 0.75);
}
.breathing__verse:hover .breathing__pt {
  color: var(--color-ivory);
}
.verse-enter-active,
.verse-leave-active {
  transition:
    opacity 0.8s,
    filter 0.8s,
    translate 0.8s var(--ease-garden);
}
.verse-enter-from {
  opacity: 0;
  filter: blur(6px);
  translate: 0 8px;
}
.verse-leave-to {
  opacity: 0;
  filter: blur(6px);
  translate: 0 -8px;
}
.arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

/* Botões */
.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  font-size: 1rem;
  text-decoration: none;
  transition:
    transform 0.3s var(--ease-garden),
    box-shadow 0.3s,
    background 0.3s;
}
.cta:hover {
  transform: translateY(-2px);
}
.cta--gold {
  color: var(--color-ink);
  background: linear-gradient(135deg, #f1dca8, #c9a35f);
  box-shadow: 0 0 0 6px rgb(217 185 122 / 0.12);
}
.cta--gold:hover {
  color: var(--color-ink);
  box-shadow: 0 0 0 10px rgb(217 185 122 / 0.12);
}
.cta--ghost {
  color: var(--color-ivory);
  border: 1px solid rgb(246 243 236 / 0.35);
}
.cta--ghost:hover {
  color: var(--color-ivory);
  background: rgb(246 243 236 / 0.08);
}
.cta--turquoise {
  color: var(--color-ivory);
  background: var(--color-turquoise);
}
.cta--turquoise:hover {
  color: var(--color-ivory);
  background: var(--color-turquoise-deep);
}

/* ── Comece por aqui: demonstração ── */
.tour {
  background:
    radial-gradient(ellipse at 100% 50%, rgb(184 149 79 / 0.14), transparent 50%),
    var(--color-ivory);
}
.tour__steps {
  display: grid;
  gap: 0.75rem;
}
.tour__step {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.1rem;
  align-items: start;
  width: 100%;
  padding: 1.25rem 1.4rem;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid transparent;
  color: var(--color-ink-muted);
  transition:
    background 0.35s,
    border-color 0.35s,
    color 0.35s;
}
.tour__step:hover {
  background: rgb(184 149 79 / 0.08);
}
.tour__step--on {
  color: var(--color-ink);
  background: #fffefb;
  border-color: var(--color-line);
  box-shadow: 0 24px 50px -35px rgb(19 101 107 / 0.45);
}
.tour__n {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  clip-path: polygon(
    50% 0,
    64% 15%,
    85% 15%,
    85% 36%,
    100% 50%,
    85% 64%,
    85% 85%,
    64% 85%,
    50% 100%,
    36% 85%,
    15% 85%,
    15% 64%,
    0 50%,
    15% 36%,
    15% 15%,
    36% 15%
  );
  background: var(--color-line);
  font-family: var(--font-persian);
  font-size: 1.15rem;
  color: var(--color-ink-muted);
  transition:
    background 0.35s,
    color 0.35s,
    rotate 0.8s var(--ease-garden);
}
.tour__step--on .tour__n {
  background: var(--color-turquoise);
  color: #f1dca8;
  rotate: 45deg;
}
.tour__step--on .tour__n span {
  rotate: -45deg;
}
.tour__text {
  font-size: 0.95rem;
  line-height: 1.5;
}
.tour__bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--color-gold), var(--color-turquoise));
  transform-origin: left;
  animation: tour-bar 6s linear both;
}
.tour__bar--paused {
  animation-play-state: paused;
}

/* A tela */
.screen {
  position: relative;
  min-height: 27rem;
  border-radius: 1.5rem;
  overflow: hidden;
  background: #fbfaf6;
  border: 1px solid var(--color-line);
  box-shadow:
    0 0 0 10px rgb(184 149 79 / 0.1),
    0 50px 90px -45px rgb(34 38 42 / 0.55);
  rotate: 1deg;
  transition: rotate 0.6s var(--ease-garden);
}
.screen:hover {
  rotate: 0deg;
}
.screen__bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 1.1rem;
  background: var(--color-paper);
  border-bottom: 1px solid var(--color-line);
}
.screen__bar i {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  background: var(--color-line);
}
.screen__bar span {
  margin-left: 0.75rem;
  padding: 0.15rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--color-ink-muted);
  background: #fbfaf6;
}
.screen__body {
  padding: 1.75rem;
}
.screen__label {
  margin-bottom: 1rem;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-lapis);
}
.screen-enter-active,
.screen-leave-active {
  transition:
    opacity 0.35s,
    translate 0.35s var(--ease-garden),
    filter 0.35s;
}
.screen-enter-from {
  opacity: 0;
  translate: 16px 0;
  filter: blur(4px);
}
.screen-leave-to {
  opacity: 0;
  translate: -16px 0;
  filter: blur(4px);
}
.mini-card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.9rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.9rem;
  background: #fffefb;
  border: 1px solid var(--color-line);
  animation: mini-in 0.5s var(--ease-garden) both;
}
.mini-card__n {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  font-family: var(--font-persian);
  color: var(--color-turquoise);
  background: rgb(184 149 79 / 0.15);
}
.mini-card--pick {
  border-color: var(--color-turquoise);
  animation:
    mini-in 0.5s var(--ease-garden) both,
    pick 1.4s 1.2s ease-in-out both;
}
.mini-card__cursor {
  position: absolute;
  right: 1.25rem;
  bottom: -0.6rem;
  font-size: 1.6rem;
  color: var(--color-ink);
  animation: cursor 1.4s 0.6s var(--ease-garden) both;
}
.demo-verse {
  padding: 1.25rem;
  border-radius: 1rem;
  text-align: center;
  background:
    radial-gradient(ellipse at 100% 0%, rgb(184 149 79 / 0.18), transparent 55%), var(--color-paper);
}
.demo-verse__fa {
  font-family: var(--font-persian);
  font-size: 1.2rem;
  line-height: 2;
  color: var(--color-lapis);
}
.demo-verse__pt {
  margin-top: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  line-height: 1.4;
}
.demo-plain {
  margin-top: 1rem;
  padding: 1rem 1.15rem;
  border-radius: 1rem;
  background: rgb(73 182 176 / 0.18);
  animation: mini-in 0.6s 0.5s var(--ease-garden) both;
}
.demo-plain__label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-lapis);
}
.demo-plain p {
  margin-top: 0.35rem;
  font-size: 1.05rem;
}
.demo-sentence {
  margin-top: 8.5rem;
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--color-ink-muted);
}
.demo-term {
  position: relative;
  color: var(--color-turquoise);
  text-decoration: underline dotted var(--color-gold) 2px;
  text-underline-offset: 4px;
  background: rgb(73 182 176 / 0.2);
  border-radius: 3px;
}
.demo-pop {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.75rem);
  z-index: 2;
  width: min(17rem, 70vw);
  padding: 0.9rem 1rem;
  translate: -50% 0;
  border-radius: 0.9rem;
  font-size: 0.85rem;
  line-height: 1.45;
  text-align: left;
  color: var(--color-ivory);
  background: var(--color-lapis);
  box-shadow: 0 20px 40px -15px rgb(0 0 0 / 0.45);
  animation: pop-in 0.5s 0.7s var(--ease-garden) both;
}
.demo-pop::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  translate: -50% 0;
  border: 8px solid transparent;
  border-top-color: var(--color-lapis);
}
.demo-pop strong {
  display: block;
  margin-bottom: 0.2rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: #f1dca8;
}
.demo-pop__fa {
  float: right;
  font-family: var(--font-persian);
  font-size: 1.3rem;
  color: #f1dca8;
}

/* ── Poema de hoje ── */
.today {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 20%, rgb(73 182 176 / 0.2), transparent 40%),
    radial-gradient(circle at 85% 80%, rgb(184 149 79 / 0.22), transparent 40%), var(--color-lapis);
}
.today__pattern {
  position: absolute;
  inset: 0;
  color: rgb(246 243 236 / 0.05);
}
.leaf {
  position: relative;
  max-width: 46rem;
  margin-inline: auto;
  padding: 3.5rem 1.5rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgb(184 149 79 / 0.15), transparent 50%), #fbfaf6;
  border: 1px solid rgb(184 149 79 / 0.6);
  box-shadow:
    inset 0 0 0 6px #fbfaf6,
    inset 0 0 0 7px rgb(184 149 79 / 0.45),
    0 50px 90px -40px rgb(0 0 0 / 0.6);
}
@media (min-width: 640px) {
  .leaf {
    padding: 4rem 4rem 3.5rem;
  }
}
.leaf__corner {
  position: absolute;
  width: 2.2rem;
  height: 2.2rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.leaf__corner--tl {
  top: -1.1rem;
  left: -1.1rem;
}
.leaf__corner--tr {
  top: -1.1rem;
  right: -1.1rem;
}
.leaf__corner--bl {
  bottom: -1.1rem;
  left: -1.1rem;
}
.leaf__corner--br {
  bottom: -1.1rem;
  right: -1.1rem;
}
.leaf__date {
  font-size: 0.7rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-turquoise);
}
.leaf__fa {
  font-family: var(--font-persian);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  line-height: 1.9;
  color: var(--color-lapis);
}
.leaf__divider {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin: 1.1rem 0;
}
.leaf__divider::before,
.leaf__divider::after {
  content: '';
  width: 3.5rem;
  height: 1px;
  background: rgb(184 149 79 / 0.6);
}
.leaf__divider i {
  width: 0.65rem;
  height: 0.65rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.leaf__pt {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1.6rem, 3.6vw, 2.3rem);
  line-height: 1.3;
  color: var(--color-ink);
}

/* ── As quatro portas: portais em arco ── */
.doors {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .doors {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .doors {
    grid-template-columns: repeat(4, 1fr);
  }
}
.door {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 24rem;
  padding: 2rem 1.5rem 1.75rem;
  overflow: hidden;
  border-radius: 999px 999px 1.25rem 1.25rem;
  text-decoration: none;
  color: var(--color-ivory);
  isolation: isolate;
  transition:
    transform 0.5s var(--ease-garden),
    box-shadow 0.5s var(--ease-garden);
}
.door::before {
  content: '';
  position: absolute;
  inset: 0.6rem;
  z-index: -1;
  border-radius: 999px 999px 0.9rem 0.9rem;
  border: 1px solid rgb(241 220 168 / 0.45);
  transition: inset 0.5s var(--ease-garden);
}
.door:hover {
  color: var(--color-ivory);
  transform: translateY(-6px);
  box-shadow: 0 40px 70px -35px rgb(0 0 0 / 0.55);
}
.door:hover::before {
  inset: 0.35rem;
}
.door--diva {
  background:
    radial-gradient(circle at 50% 25%, rgb(241 220 168 / 0.25), transparent 45%),
    linear-gradient(180deg, #21476a, var(--color-lapis));
}
.door--poeta {
  background:
    radial-gradient(circle at 50% 25%, rgb(241 220 168 / 0.22), transparent 45%),
    linear-gradient(180deg, #b0844f, #5a3e22);
}
.door--fal {
  background:
    radial-gradient(circle at 50% 30%, rgb(241 200 120 / 0.35), transparent 40%),
    linear-gradient(180deg, #1f7a80, #0b3a3e);
}
.door--arte {
  background: #0b1b2a;
}
.door__img {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  opacity: 0.55;
  transition:
    opacity 0.5s,
    scale 0.8s var(--ease-garden);
}
.door--arte::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, transparent 30%, rgb(11 27 42 / 0.92) 75%);
}
.door:hover .door__img {
  opacity: 0.75;
  scale: 1.05;
}
.door__fa {
  position: absolute;
  top: 28%;
  left: 50%;
  translate: -50% 0;
  font-family: var(--font-persian);
  font-size: 3rem;
  color: #f1dca8;
  opacity: 0.9;
  transition: translate 0.5s var(--ease-garden);
}
.door:hover .door__fa {
  translate: -50% -6px;
}
.door__body {
  display: grid;
  gap: 0.35rem;
  text-align: center;
}
.door__title {
  font-family: var(--font-display);
  font-size: 1.9rem;
}
.door__text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgb(246 243 236 / 0.8);
}

/* ── Dicionário aberto ── */
.lexicon {
  background:
    radial-gradient(ellipse at 50% 100%, rgb(73 182 176 / 0.16), transparent 55%),
    var(--color-paper);
  border-top: 1px solid var(--color-line);
}
.book {
  display: grid;
  max-width: 64rem;
  margin-inline: auto;
  border-radius: 0.75rem;
  background: #fbfaf6;
  box-shadow:
    0 0 0 1px rgb(184 149 79 / 0.45),
    0 50px 90px -50px rgb(34 38 42 / 0.6);
}
@media (min-width: 900px) {
  .book {
    grid-template-columns: 1fr 1.3fr;
  }
}
.book__index {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--color-line);
  background: linear-gradient(270deg, rgb(184 149 79 / 0.14), transparent 22%);
}
@media (min-width: 900px) {
  .book__index {
    padding: 2.5rem 2rem;
    border-bottom: 0;
    border-right: 1px solid rgb(184 149 79 / 0.35);
  }
}
.book__entry {
  display: grid;
  grid-template-columns: 2rem auto 1fr auto;
  align-items: baseline;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.5rem;
  border-radius: 0.5rem;
  text-align: left;
  color: var(--color-ink-muted);
  transition:
    color 0.25s,
    background 0.25s;
}
.book__entry--on {
  color: var(--color-turquoise);
  background: rgb(73 182 176 / 0.14);
}
.book__num {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.book__pt {
  font-family: var(--font-display);
  font-size: 1.35rem;
}
.book__dots {
  border-bottom: 1px dotted rgb(184 149 79 / 0.6);
  translate: 0 -0.3rem;
}
.book__fa {
  font-family: var(--font-persian);
  font-size: 1.15rem;
  color: var(--color-lapis);
}
.book__page {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 24rem;
  padding: 3rem 2rem 3.5rem;
  text-align: center;
  background: radial-gradient(ellipse at 50% 30%, rgb(184 149 79 / 0.14), transparent 60%);
}
@media (min-width: 900px) {
  .book__page {
    background:
      linear-gradient(90deg, rgb(184 149 79 / 0.14), transparent 18%),
      radial-gradient(ellipse at 50% 30%, rgb(184 149 79 / 0.14), transparent 60%);
  }
}
.book__folio {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  translate: -50% 0;
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.entry__fa {
  font-family: var(--font-persian);
  font-size: clamp(3.4rem, 9vw, 5.5rem);
  line-height: 1.5;
  background: linear-gradient(135deg, var(--color-turquoise), #49b6b0 50%, var(--color-gold));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.entry__translit {
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-ink-muted);
}
.entry__term {
  margin-top: 0.75rem;
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
}
.entry__short {
  max-width: 28rem;
  margin: 0.9rem auto 0;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--color-ink-muted);
}
.entry__more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  color: var(--color-turquoise);
  border: 1px solid rgb(19 101 107 / 0.35);
  transition:
    background 0.2s,
    color 0.2s;
}
.entry__more:hover {
  color: var(--color-ivory);
  background: var(--color-turquoise);
}
.word-enter-active,
.word-leave-active {
  transition:
    opacity 0.3s,
    translate 0.35s var(--ease-garden),
    filter 0.3s;
}
.word-enter-from {
  opacity: 0;
  translate: 0 10px;
  filter: blur(6px);
}
.word-leave-to {
  opacity: 0;
  translate: 0 -10px;
  filter: blur(6px);
}

/* ── Os primeiros gazéis ── */
.ghazals {
  position: relative;
  overflow: hidden;
  padding: 6rem 0 4rem;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 0% 0%, rgb(73 182 176 / 0.25), transparent 45%),
    radial-gradient(ellipse at 100% 100%, rgb(184 149 79 / 0.18), transparent 45%),
    var(--color-turquoise-deep);
}
.ghazals__pattern {
  position: absolute;
  inset: 0;
  color: rgb(246 243 236 / 0.05);
}
.shelf-btn {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  color: var(--color-ivory);
  border: 1px solid rgb(246 243 236 / 0.35);
  transition:
    background 0.2s,
    color 0.2s;
}
.shelf-btn:hover {
  color: var(--color-ink);
  background: #f1dca8;
}
.shelf {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(15rem, 17rem);
  gap: 1.25rem;
  margin-top: 3rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: max(1.25rem, calc((100vw - 72rem) / 2 + 2rem));
  padding: 1rem max(1.25rem, calc((100vw - 72rem) / 2 + 2rem)) 2rem;
  scrollbar-width: none;
  mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
}
.shelf::-webkit-scrollbar {
  display: none;
}
.shelf > li {
  scroll-snap-align: start;
}
/* Página em arco, como um nicho de manuscrito */
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 22rem;
  padding: 3.25rem 1.5rem 1.5rem;
  border-radius: 999px 999px 1.25rem 1.25rem;
  text-align: center;
  text-decoration: none;
  color: var(--color-ink);
  background: radial-gradient(ellipse at 50% 0%, rgb(184 149 79 / 0.2), transparent 55%), #fbfaf6;
  box-shadow:
    inset 0 0 0 6px #fbfaf6,
    inset 0 0 0 7px rgb(184 149 79 / 0.5),
    0 30px 50px -30px rgb(0 0 0 / 0.55);
  transition:
    transform 0.45s var(--ease-garden),
    box-shadow 0.45s var(--ease-garden);
}
.page:hover {
  color: var(--color-ink);
  transform: translateY(-8px);
  box-shadow:
    inset 0 0 0 6px #fbfaf6,
    inset 0 0 0 7px rgb(184 149 79 / 0.8),
    0 40px 60px -30px rgb(0 0 0 / 0.65);
}
.page__medal {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  clip-path: polygon(
    50% 0,
    64% 15%,
    85% 15%,
    85% 36%,
    100% 50%,
    85% 64%,
    85% 85%,
    64% 85%,
    50% 100%,
    36% 85%,
    15% 85%,
    15% 64%,
    0 50%,
    15% 36%,
    15% 15%,
    36% 15%
  );
  background: var(--color-turquoise);
  font-family: var(--font-persian);
  font-size: 1.2rem;
  color: #f1dca8;
  transition: rotate 0.8s var(--ease-garden);
}
.page:hover .page__medal {
  rotate: 45deg;
}
.page__fa {
  margin-top: 1.25rem;
  font-family: var(--font-persian);
  font-size: 1.25rem;
  line-height: 1.95;
  color: var(--color-lapis);
}
.page__divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}
.page__divider::before,
.page__divider::after {
  content: '';
  width: 2rem;
  height: 1px;
  background: rgb(184 149 79 / 0.6);
}
.page__divider i {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.page__pt {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.3;
}
.page__go {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-turquoise);
}
.page--all {
  justify-content: center;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 20%, rgb(241 220 168 / 0.25), transparent 55%),
    var(--color-lapis);
  box-shadow:
    inset 0 0 0 6px var(--color-lapis),
    inset 0 0 0 7px rgb(241 220 168 / 0.4),
    0 30px 50px -30px rgb(0 0 0 / 0.55);
}
.page--all:hover {
  color: var(--color-ivory);
}
.page--all .page__fa {
  font-size: 2.4rem;
  color: #f1dca8;
}
.shelf-progress {
  height: 2px;
  margin-top: 0.5rem;
  border-radius: 999px;
  background: rgb(246 243 236 / 0.15);
  overflow: hidden;
}
.shelf-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold), #f1dca8);
  transform-origin: left;
  transition: scale 0.2s linear;
}

/* ── Convite final ── */
.finale {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 120%, rgb(184 149 79 / 0.3), transparent 60%),
    radial-gradient(ellipse at 50% 0%, rgb(19 101 107 / 0.4), transparent 60%), #0b1b2a;
}
.finale__fa {
  font-family: var(--font-persian);
  font-size: 2rem;
  color: #d9b97a;
}

@keyframes tour-bar {
  from {
    scale: 0 1;
  }
}
@keyframes mini-in {
  from {
    opacity: 0;
    translate: 0 10px;
  }
}
@keyframes pick {
  50% {
    background: rgb(73 182 176 / 0.25);
    scale: 1.02;
  }
}
@keyframes cursor {
  from {
    opacity: 0;
    translate: 30px 30px;
  }
}
@keyframes pop-in {
  from {
    opacity: 0;
    translate: -50% 8px;
    scale: 0.95;
  }
}
@keyframes write {
  from {
    clip-path: inset(0 0 0 100%);
    opacity: 0.2;
  }
  to {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
@keyframes shimmer {
  0%,
  60%,
  100% {
    background-position: 100% 0;
  }
  30% {
    background-position: 0 0;
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }
}
@keyframes spin {
  to {
    rotate: 360deg;
  }
}
@keyframes sway {
  0%,
  100% {
    rotate: -1deg;
  }
  50% {
    rotate: 1.2deg;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 20px;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
</style>
