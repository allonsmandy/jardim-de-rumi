<script setup lang="ts">
import { ArrowRight, ArrowDown } from '@lucide/vue'

useSeoMeta({
  title: 'O Poeta — Rumi',
  description:
    'Quem foi Rumi (Jalal al-Din Mohammad Balkhi), poeta persa do século XIII: de Balkh a Konya, o encontro com Shams de Tabriz, o Masnavi, lendas e legado — separando fatos, leituras dos estudiosos e tradições.',
})

type Reliability = 'fato' | 'estudiosos' | 'tradicao'
type Era = 'antes' | 'shams' | 'masnavi' | 'legado'

const { open: openTerm } = useGlossary()

/* Abertura: partículas (posições fixas, iguais no servidor e no navegador) e paralaxe do mouse. */
const sparks = Array.from({ length: 18 }, (_, i) => ({
  kind: i % 3 === 0 ? 'star' : 'ring',
  left: `${(i * 53) % 100}%`,
  delay: `${-((i * 7) % 19)}s`,
  duration: `${14 + ((i * 5) % 10)}s`,
  size: `${0.45 + ((i * 3) % 5) * 0.12}rem`,
}))
const heroEl = ref<HTMLElement>()
function onHeroMove(e: PointerEvent) {
  const el = heroEl.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
  el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
}

const facts = [
  { label: 'Nasceu', value: '1207', sub: 'na região de Balkh' },
  { label: 'Viveu em', value: 'Konya', sub: 'na atual Turquia' },
  { label: 'Masnavi', value: '~25 mil', sub: 'dísticos em seis livros' },
  { label: 'Divã', value: '3 mil+', sub: 'gazéis, e quase 2 mil rubaiyat' },
]

const names = [
  {
    fa: 'جلال‌الدین محمد',
    pt: 'Jalal al-Din Mohammad',
    tag: 'o nome',
    text: '“Jalal al-Din” era um título comum na época: “Majestade da Fé”.',
  },
  {
    fa: 'مولانا',
    pt: 'Mowlana',
    tag: 'o tratamento',
    text: '“Nosso mestre”. É como os discípulos o chamavam — e como o chamam até hoje no Irã, no Afeganistão e na Turquia (Mevlânâ).',
  },
  {
    fa: 'رومی',
    pt: 'Rumi',
    tag: 'o nome no Ocidente',
    text: '“De Rum”, a Anatólia, antiga terra dos romanos, onde ele viveu. É o nome mais usado fora do mundo persa.',
  },
  {
    fa: 'بلخی',
    pt: 'Balkhi',
    tag: 'a origem',
    text: '“De Balkh”, a região onde nasceu, no atual Afeganistão. No Irã e no Afeganistão, ele é Mowlana Balkhi.',
  },
]

/* Régua comparativa: 1200 → 1300. */
const AXIS = { from: 1200, to: 1300 }
const LENGTH = AXIS.to - AXIS.from
const pct = (y: number) => `${((y - AXIS.from) / LENGTH) * 100}%`
const span = (a: number, b: number) => ({ left: pct(a), width: `${((b - a) / LENGTH) * 100}%` })
const ticks = [1200, 1225, 1250, 1275, 1300]
const konyaBars = [
  { from: 1228, to: 1244, label: 'professor', era: 'antes' as Era },
  { from: 1244, to: 1248, label: 'Shams', era: 'shams' as Era },
  { from: 1258, to: 1273, label: 'o Masnavi', era: 'masnavi' as Era },
]
const worldMarks = [
  { year: 1215, label: 'Magna Carta' },
  { year: 1226, label: 'Morre Francisco de Assis' },
  { year: 1249, label: 'Portugal toma o Algarve' },
  { year: 1265, label: 'Nasce Dante' },
  { year: 1274, label: 'Morre Tomás de Aquino' },
  { year: 1290, label: 'Universidade em Lisboa' },
]

const timeline: { year: string; title: string; text: string; kind: Reliability; era: Era }[] = [
  {
    year: '1207',
    title: 'Nasce Jalal al-Din, na região de Balkh',
    text: 'A data tradicional é 1207 (604 do calendário islâmico); alguns estudiosos acham que ele pode ter nascido alguns anos antes. O pai, Baha al-Din Valad, era pregador e teólogo, com inclinação mística. O lugar exato pode ter sido Vakhsh, cidade da região onde o pai trabalhou.',
    kind: 'estudiosos',
    era: 'antes',
  },
  {
    year: 'c. 1216–1228',
    title: 'Uma família a caminho do oeste',
    text: 'Ainda criança, Jalal al-Din parte com a família. Passam por Bagdá e Meca e vivem alguns anos na Anatólia, onde ele se casa e nasce o filho, Sultan Valad (1226). Pouco depois da partida, os mongóis arrasam Balkh. O roteiro exato varia de fonte para fonte.',
    kind: 'estudiosos',
    era: 'antes',
  },
  {
    year: 'c. 1228–1231',
    title: 'Konya',
    text: 'A família se instala em Konya, capital dos sultões seljúcidas da Anatólia. Quando o pai morre, em 1231, o filho assume o seu lugar como professor e pregador.',
    kind: 'fato',
    era: 'antes',
  },
  {
    year: '1230s',
    title: 'Anos de estudo',
    text: 'Um antigo discípulo do pai, Borhan al-Din, de Termez, chega a Konya e passa anos orientando o jovem na vida espiritual. Rumi estuda também em Alepo e Damasco. Volta um mestre respeitado, com muitos alunos — ainda não um poeta.',
    kind: 'fato',
    era: 'antes',
  },
  {
    year: '1244',
    title: 'O encontro com Shams',
    text: 'Em novembro de 1244 chega a Konya um dervixe andarilho de Tabriz, Shams al-Din. Os dois passam a viver quase isolados, em longas conversas. Rumi abandona as aulas, passa a frequentar o samâ‘ — música, poesia, dança — e começa a compor.',
    kind: 'fato',
    era: 'shams',
  },
  {
    year: '1246–1248',
    title: 'Partida, volta e sumiço',
    text: 'Os discípulos de Rumi, enciumados, hostilizam Shams, que foge para Damasco. Sultan Valad vai buscá-lo, e ele volta. Por volta de 1247–1248, Shams desaparece de vez. Rumi o procura, viaja a Damasco, não o encontra. A dor dessa ausência vira poesia: nasce o Divã de Shams.',
    kind: 'fato',
    era: 'shams',
  },
  {
    year: 'c. 1258',
    title: 'Começa o Masnavi',
    text: 'Depois de Shams, Rumi encontra outros companheiros: o ourives Salah al-Din e, mais tarde, o discípulo Hosam al-Din. Foi Hosam, segundo os relatos antigos, quem pediu um livro de poesia para os discípulos. A data exata do início é discutida.',
    kind: 'estudiosos',
    era: 'masnavi',
  },
  {
    year: '1263–1264',
    title: 'O livro II, depois de uma pausa',
    text: 'Nos primeiros versos do livro II, o próprio Rumi conta que o poema ficou parado por um tempo e foi retomado no ano 662 do calendário islâmico. Ele seguiu ditando até o fim da vida: são seis livros.',
    kind: 'fato',
    era: 'masnavi',
  },
  {
    year: '1273',
    title: 'A morte em Konya',
    text: 'Rumi morre em Konya em 17 de dezembro de 1273. Os seguidores chamam esse dia de “noite de núpcias” (Shab-e ‘Arus), porque, para eles, a morte foi o encontro com o Amado. O sexto livro do Masnavi termina sem um fecho.',
    kind: 'fato',
    era: 'legado',
  },
  {
    year: 'depois',
    title: 'Os dervixes giradores',
    text: 'O filho, Sultan Valad, organiza os discípulos numa ordem, a Mevlevi, que leva a música, o giro e o Masnavi por todo o Império Otomano.',
    kind: 'fato',
    era: 'legado',
  },
]

/* Esquema de um gazel: o 1º dístico rima nas duas metades; os outros, só na segunda. */
const anatomy = [
  { a: 78, b: 72, first: true },
  { a: 70, b: 80 },
  { a: 82, b: 66 },
  { a: 64, b: 76 },
  { a: 76, b: 70 },
  { a: 72, b: 78, last: true },
]

const readings = [
  {
    term: 'amado',
    word: 'O amado',
    earthly: 'o amigo Shams, de carne e osso',
    mystic: 'Deus, que se mostra no amigo',
  },
  {
    term: 'ney',
    word: 'A flauta',
    earthly: 'o instrumento que toca no samâ‘',
    mystic: 'a alma, cortada da sua origem',
  },
  {
    term: 'vinho',
    word: 'O vinho',
    earthly: 'a embriaguez, a festa',
    mystic: 'o êxtase de se perder em Deus',
  },
  {
    term: 'sama',
    word: 'A dança',
    earthly: 'girar ao som da música',
    mystic: 'o universo girando em torno do seu centro',
  },
]

interface Legend {
  numeral: string
  title: string
  told: string
  known: string
  verdict: number
  link?: { to: string; label: string }
}
const legends: Legend[] = [
  {
    numeral: 'I',
    title: 'O menino e o velho Attar',
    told: 'Na viagem para o oeste, a família teria passado por Nishapur, onde o velho poeta Attar de Nishapur viu o menino Jalal al-Din e disse ao pai que aquele filho ainda incendiaria os corações do mundo. E lhe deu de presente um livro seu.',
    known:
      'Aparece em biografias escritas muito depois. A cronologia é difícil (Attar morreu por volta de 1221, e o roteiro da família é incerto). Rumi admirava Attar — isso se vê na obra.',
    verdict: 1,
  },
  {
    numeral: 'II',
    title: 'Os livros na água',
    told: 'Rumi lia à beira de um tanque, cercado de livros, quando um desconhecido os jogou na água. Rumi se desesperou; o estranho tirou os livros secos e disse: “Isto é coisa que tu não entendes”. Era Shams.',
    known:
      'Uma das várias versões do primeiro encontro, contadas por hagiógrafos da ordem Mevlevi décadas depois. Que os dois se encontraram em 1244 é fato; a cena é tradição.',
    verdict: 0,
  },
  {
    numeral: 'III',
    title: 'Shams foi assassinado',
    told: 'Shams não teria partido: discípulos enciumados — entre eles um dos filhos de Rumi — o teriam matado e jogado num poço, em Konya.',
    known:
      'Contado por Aflaki, hagiógrafo do século XIV. Sultan Valad, que conheceu Shams, fala só em desaparecimento. Alguns estudiosos acham o assassinato possível; não há prova.',
    verdict: 2,
  },
  {
    numeral: 'IV',
    title: 'O giro no mercado',
    told: 'Passando pelo mercado dos ourives, Rumi ouviu o ritmo dos martelos batendo o ouro, entrou em êxtase e começou a girar ali mesmo, no meio da rua. O ourives era Salah al-Din, que se tornaria seu companheiro.',
    known:
      'Tradição da ordem Mevlevi, contada para explicar a origem do giro. A amizade com Salah al-Din é fato; a cena, não se sabe.',
    verdict: 1,
  },
]
const VERDICTS = ['Lenda', 'Muito improvável', 'Talvez']

const references = [
  [
    'Franklin D. Lewis, Rumi: Past and Present, East and West (2000)',
    'biografia de referência; separa com cuidado o que se sabe do que é lenda — base das datas.',
  ],
  [
    'Sultan Valad, Ebteda-name (1291)',
    'poema do filho de Rumi sobre o pai e Shams; uma das fontes mais antigas.',
  ],
  [
    'Shams al-Din Aflaki, Manaqib al-‘Arifin (século XIV)',
    'hagiografia da ordem Mevlevi, origem de muitas lendas — citada aqui só como tradição.',
  ],
  ['Encyclopaedia Iranica', 'verbetes sobre Rumi, o Masnavi e a ordem Mevlevi.'],
  [
    'R. A. Nicholson, edição e tradução do Masnavi (1925–1940)',
    'a edição clássica do texto; em domínio público no Brasil.',
  ],
  [
    'Annemarie Schimmel, The Triumphal Sun (1978)',
    'estudo clássico sobre as imagens da poesia de Rumi.',
  ],
] as const
</script>

<template>
  <div class="poet">
    <!-- ───────────── Abertura ───────────── -->
    <section ref="heroEl" class="hero" @pointermove="onHeroMove">
      <GirihPattern class="hero__pattern" />
      <div class="hero__sparks" aria-hidden="true">
        <span
          v-for="(sp, i) in sparks"
          :key="i"
          :class="`spark spark--${sp.kind}`"
          :style="{
            left: sp.left,
            animationDelay: sp.delay,
            animationDuration: sp.duration,
            width: sp.size,
            height: sp.size,
          }"
        />
      </div>
      <div class="hero__parallax-far" aria-hidden="true">
        <p class="hero__watermark" lang="fa">مولانا</p>
      </div>
      <div
        class="container-editorial relative grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28"
      >
        <div>
          <p class="eyebrow !text-gold">De Balkh a Konya · século XIII</p>
          <h1 class="hero__title" aria-label="Rumi">
            <span
              v-for="(ch, i) in 'Rumi'"
              :key="i"
              class="hero__letter"
              :style="{ animationDelay: `${0.15 + i * 0.09}s` }"
              aria-hidden="true"
              >{{ ch }}</span
            >
          </h1>
          <p class="mt-6 max-w-xl text-lg text-ivory/80 sm:text-xl">
            Era um professor respeitado de teologia até que, aos 37 anos, conheceu um dervixe
            andarilho chamado Shams. Depois desse encontro, não parou mais de escrever poesia —
            dezenas de milhares de versos sobre amor, saudade e Deus.
          </p>
          <a href="#vida" class="hero__cta">
            Conhecer a história <ArrowDown class="size-4" aria-hidden="true" />
          </a>
        </div>
        <figure class="hero__arch-wrap" aria-label="Mowlana, Nosso Mestre">
          <SemaRings class="hero__rosette" :dancers="10" />
          <PersianArch class="hero__arch" />
          <div class="hero__arch-inner">
            <PersianText as="p" class="text-4xl text-gold sm:text-5xl">مولانا</PersianText>
            <p class="mt-3 font-display text-2xl text-ivory italic">Nosso Mestre</p>
            <p class="mt-2 text-sm text-ivory/60">como os discípulos o chamavam</p>
          </div>
        </figure>
      </div>
      <dl class="hero__facts container-editorial">
        <div v-for="f in facts" :key="f.label" class="hero__fact">
          <dt class="text-[0.7rem] tracking-[0.2em] text-gold uppercase">{{ f.label }}</dt>
          <dd class="mt-1 font-display text-4xl text-ivory [font-variant-numeric:lining-nums]">
            {{ f.value }}
          </dd>
          <dd class="text-sm text-ivory/60"><GlossaryText :text="f.sub" /></dd>
        </div>
      </dl>
    </section>

    <!-- ───────────── Selos ───────────── -->
    <section class="container-editorial py-14" aria-labelledby="como-ler">
      <div class="seals">
        <div class="max-w-md">
          <h2 id="como-ler" class="text-3xl">Fato, hipótese ou lenda?</h2>
          <p class="mt-3 text-ink-muted">
            Muito do que se conta sobre Rumi vem de biografias devotas escritas décadas depois. Cada
            informação desta página traz um selo para você saber em que acreditar.
          </p>
        </div>
        <ul class="grid gap-3 sm:grid-cols-3">
          <li v-reveal="0" class="seal">
            <ReliabilityBadge kind="fato" /><span>Está em documentos ou nos próprios poemas.</span>
          </li>
          <li v-reveal="120" class="seal">
            <ReliabilityBadge kind="estudiosos" /><span
              >Hipótese razoável, sem prova definitiva.</span
            >
          </li>
          <li v-reveal="240" class="seal">
            <ReliabilityBadge kind="tradicao" /><span>Contada há séculos, sem confirmação.</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ───────────── Nomes ───────────── -->
    <section class="names" aria-labelledby="nomes">
      <div class="container-editorial py-20">
        <h2 id="nomes" class="text-center text-4xl sm:text-5xl">Um homem, quatro nomes</h2>
        <ol
          class="mt-14 grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          <li v-for="(n, i) in names" :key="n.pt" v-reveal="i * 110" class="name">
            <span class="name__index">0{{ i + 1 }}</span>
            <PersianText as="p" block class="name__fa">{{ n.fa }}</PersianText>
            <p class="mt-4 text-[0.7rem] tracking-[0.2em] text-lapis uppercase">{{ n.tag }}</p>
            <p class="mt-1 font-display text-2xl text-turquoise">{{ n.pt }}</p>
            <p class="mt-3 text-[0.95rem] text-ink-muted"><GlossaryText :text="n.text" /></p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ───────────── Citação ───────────── -->
    <section class="quote" aria-labelledby="o-primeiro-verso">
      <GirihPattern class="quote__pattern" :size="96" />
      <div
        class="container-editorial relative grid gap-12 py-24 lg:grid-cols-[1.3fr_1fr] lg:items-center"
      >
        <figure v-reveal>
          <p id="o-primeiro-verso" class="eyebrow !text-tile">Nas palavras do próprio Rumi</p>
          <blockquote class="mt-8">
            <PersianText as="p" block class="quote__fa">
              بشنو این نی چون شکایت می‌کند<br />
              از جدایی‌ها حکایت می‌کند
            </PersianText>
            <p class="quote__pt">
              “Escuta esta flauta de junco, como ela se queixa, como conta a história das
              separações.”
            </p>
          </blockquote>
          <figcaption class="mt-6 text-sm text-ivory/60">
            Masnavi, livro I, primeiro dístico · tradução preliminar do projeto
          </figcaption>
        </figure>
        <div v-reveal="200" class="quote__note">
          <p class="font-display text-2xl text-gold">Por que este verso importa</p>
          <p class="mt-3 text-ivory/85">
            É o começo do Masnavi, e a primeira palavra é uma ordem: “escuta”. A
            <button type="button" class="glossary-term" @click="openTerm('ney')">
              flauta de junco
            </button>
            chora porque foi cortada do canavial.
          </p>
          <p class="mt-3 text-ivory/85">
            Os leitores veem nela a alma humana, separada da sua origem e querendo voltar. Os seis
            livros que vêm depois são, de certo modo, uma longa resposta a esse lamento.
          </p>
          <ReliabilityBadge kind="fato" class="mt-5 !bg-ivory/90" />
        </div>
      </div>
    </section>

    <!-- ───────────── Régua: lá e cá ───────────── -->
    <section id="vida" class="container-editorial scroll-mt-20 pt-24" aria-labelledby="regua">
      <div class="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end">
        <div>
          <p class="eyebrow">Para situar</p>
          <h2 id="regua" class="mt-2 text-4xl sm:text-5xl">Lá e cá</h2>
        </div>
        <p class="text-ink-muted lg:pb-2">
          Rumi é contemporâneo de Francisco de Assis e de Tomás de Aquino. Enquanto ele escrevia o
          Masnavi, Portugal acabava de conquistar o Algarve — e Dante era um menino em Florença.
        </p>
      </div>
      <div class="ruler-scroll mt-10">
        <div v-reveal class="ruler">
          <div class="ruler__row ruler__row--konya">
            <span class="ruler__label">Konya</span>
            <div class="ruler__track">
              <span
                v-for="b in konyaBars"
                :key="b.label"
                class="ruler__bar"
                :class="`ruler__bar--${b.era}`"
                :style="span(b.from, b.to)"
                ><em><GlossaryText :text="b.label" /></em
              ></span>
              <span class="ruler__pin" :style="{ left: pct(1243) }"
                ><GlossaryText text="mongóis"
              /></span>
            </div>
          </div>
          <div class="ruler__row">
            <span class="ruler__label !text-turquoise">Rumi</span>
            <div class="ruler__track">
              <span class="ruler__life" :style="span(1207, 1273)">vida de Rumi</span>
            </div>
          </div>
          <div class="ruler__row ruler__row--world">
            <span class="ruler__label">Europa</span>
            <div class="ruler__track">
              <span
                v-for="(m, i) in worldMarks"
                :key="m.year"
                class="ruler__mark"
                :class="{ 'ruler__mark--low': i % 2 === 1, 'ruler__mark--end': m.year >= 1285 }"
                :style="{ left: pct(m.year) }"
              >
                <b>{{ m.year }}</b> {{ m.label }}
              </span>
            </div>
          </div>
          <div class="ruler__axis">
            <span v-for="t in ticks" :key="t" :style="{ left: pct(t) }">{{ t }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── Linha do tempo ───────────── -->
    <section class="container-editorial py-20" aria-labelledby="vida-titulo">
      <h2 id="vida-titulo" class="max-w-2xl text-4xl sm:text-5xl">Uma vida partida em duas</h2>
      <p class="mt-4 max-w-2xl text-ink-muted">
        <GlossaryText
          text="Até os 37 anos, um sábio religioso, filho de pregador. Depois do encontro com Shams, um poeta que não conseguia parar de cantar. Quase toda a obra de Rumi foi escrita nos últimos trinta anos de vida."
        />
      </p>
      <ol class="chrono mt-14">
        <li
          v-for="item in timeline"
          :key="item.title"
          v-reveal
          class="chrono__item"
          :class="`chrono__item--${item.era}`"
        >
          <p class="chrono__year">{{ item.year }}</p>
          <div class="chrono__body">
            <h3 class="font-display text-2xl">{{ item.title }}</h3>
            <p class="mt-2 text-ink-muted"><GlossaryText :text="item.text" /></p>
            <ReliabilityBadge :kind="item.kind" class="mt-3" />
          </div>
        </li>
      </ol>
    </section>

    <!-- ───────────── Anatomia do gazel ───────────── -->
    <section class="anatomy" aria-labelledby="como-escrevia">
      <div class="container-editorial grid gap-14 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="eyebrow">A arte de Rumi</p>
          <h2 id="como-escrevia" class="mt-2 text-4xl sm:text-5xl">
            <GlossaryText text="Como é um gazel por dentro" />
          </h2>
          <p class="mt-5 text-ink-muted">
            <GlossaryText
              text="O Divã de Shams é feito sobretudo de gazéis: poemas de vários dísticos (pares de versos), muitos compostos para serem cantados. Três regras explicam a forma:"
            />
          </p>
          <ol class="mt-8 space-y-6">
            <li class="rule">
              <span class="rule__n">1</span>
              <p>
                <strong>A mesma rima do começo ao fim.</strong> O primeiro par rima nas duas
                metades; os outros, só no fim da segunda.
              </p>
            </li>
            <li class="rule">
              <span class="rule__n">2</span>
              <p>
                <strong>Cada par de versos é quase independente.</strong> O poema pode mudar de
                assunto de um par para o outro — mais um colar de pérolas que uma história.
              </p>
            </li>
            <li class="rule">
              <span class="rule__n">3</span>
              <p>
                <strong>A assinatura no fim.</strong> No último par, o poeta costuma se nomear (o
                <button type="button" class="glossary-term" @click="openTerm('takhallos')">
                  takhallos</button
                >). Rumi faz diferente: assina com o nome de Shams ou manda a si mesmo calar —
                <button type="button" class="glossary-term" @click="openTerm('khamush')">
                  “silêncio!”</button
                >.
              </p>
            </li>
          </ol>
        </div>
        <figure
          v-reveal
          class="diagram"
          aria-label="Esquema de um gazel: seis pares de versos, rimas marcadas em dourado e assinatura no último par."
        >
          <p class="diagram__caption">esquema de um gazel · lê-se da direita para a esquerda</p>
          <ol class="mt-6 space-y-3">
            <li
              v-for="(c, i) in anatomy"
              :key="i"
              class="couplet"
              :class="{ 'couplet--last': c.last }"
            >
              <span class="couplet__n">{{ i + 1 }}</span>
              <span class="couplet__line" :style="{ width: `${c.a}%` }">
                <i v-if="c.first" class="couplet__rhyme" />
              </span>
              <span class="couplet__line" :style="{ width: `${c.b}%` }">
                <i class="couplet__rhyme" />
                <em v-if="c.last" class="couplet__sign">شمس</em>
              </span>
            </li>
          </ol>
          <div class="diagram__legend">
            <span><i class="couplet__rhyme !static !translate-none" /> rima repetida</span>
            <span
              ><em class="couplet__sign !static !translate-none">شمس</em> assinatura (Shams)</span
            >
          </div>
        </figure>
      </div>
    </section>

    <!-- ───────────── Duas leituras ───────────── -->
    <section class="container-editorial py-24" aria-labelledby="leituras">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">O grande debate</p>
        <h2 id="leituras" class="mt-2 text-4xl sm:text-5xl">Um amigo ou Deus?</h2>
        <p class="mt-5 text-ink-muted">
          <GlossaryText
            text="Rumi foi um mestre sufi e um sábio do Islã: a leitura mística está no centro da obra, e ele mesmo a explica no Masnavi. Mas a saudade de Shams, a embriaguez e a dança são concretas demais para virarem só símbolo. Para Rumi, amar uma pessoa e amar Deus não são coisas separadas — o amor humano é a ponte."
          />
        </p>
        <ReliabilityBadge kind="estudiosos" class="mt-4" />
      </div>
      <div class="readings mt-14">
        <div class="readings__head">
          <span class="readings__col" />
          <span class="readings__col readings__col--earth">Leitura terrena</span>
          <span class="readings__col readings__col--sky">Leitura mística</span>
        </div>
        <div v-for="(r, i) in readings" :key="r.term" v-reveal="i * 90" class="readings__row">
          <button type="button" class="readings__word" @click="openTerm(r.term)">
            {{ r.word }} <ArrowRight class="size-4 opacity-50" aria-hidden="true" />
          </button>
          <p class="readings__cell readings__cell--earth">
            <span class="readings__mobile">Terrena</span>{{ r.earthly }}
          </p>
          <p class="readings__cell readings__cell--sky">
            <span class="readings__mobile">Mística</span>{{ r.mystic }}
          </p>
        </div>
      </div>
      <p class="mt-6 text-center text-sm text-ink-muted">
        Nas explicações dos poemas, mostramos as duas camadas sempre que o verso permite.
      </p>
    </section>

    <!-- ───────────── Lendas ───────────── -->
    <section class="legends" aria-labelledby="lendas">
      <GirihPattern class="legends__pattern" :size="88" />
      <div class="container-editorial relative py-24">
        <div class="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <h2 id="lendas" class="text-4xl !text-ivory sm:text-5xl">Quatro lendas sobre Rumi</h2>
          <p class="text-ivory/75 lg:pb-2">E o que os historiadores dizem sobre cada uma.</p>
        </div>
        <ul class="mt-14 grid gap-6 md:grid-cols-2">
          <li v-for="(l, i) in legends" :key="l.title" v-reveal="i * 140" class="legend">
            <div class="flex items-start justify-between gap-4">
              <span class="legend__numeral">{{ l.numeral }}</span>
              <ReliabilityBadge kind="tradicao" />
            </div>
            <h3 class="mt-4 font-display text-3xl">{{ l.title }}</h3>
            <p class="mt-3 text-[0.95rem] leading-relaxed"><GlossaryText :text="l.told" /></p>
            <div class="legend__known">
              <div class="flex items-center justify-between gap-3">
                <p class="text-[0.7rem] tracking-[0.2em] text-lapis uppercase">Veredito</p>
                <span class="verdict" :aria-label="`Veredito: ${VERDICTS[l.verdict]}`">
                  <i v-for="k in 3" :key="k" :class="{ on: k <= l.verdict + 1 }" />
                  <b>{{ VERDICTS[l.verdict] }}</b>
                </span>
              </div>
              <p class="mt-3 text-[0.92rem] text-ink-muted"><GlossaryText :text="l.known" /></p>
              <NuxtLink
                v-if="l.link"
                :to="l.link.to"
                class="mt-3 inline-flex items-center gap-1 text-sm"
              >
                {{ l.link.label }} <ArrowRight class="size-3.5" aria-hidden="true" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ───────────── Legado ───────────── -->
    <section class="container-editorial py-24" aria-labelledby="legado">
      <p class="eyebrow">Oito séculos depois</p>
      <h2 id="legado" class="mt-2 text-4xl sm:text-5xl">Rumi hoje</h2>
      <div class="bento mt-12">
        <article v-reveal class="tile tile--big">
          <span class="tile__number">3</span>
          <h3 class="mt-2 font-display text-3xl">países o chamam de seu</h3>
          <p class="mt-3 max-w-lg text-ink-muted">
            <GlossaryText
              text="Nasceu no atual Afeganistão, escreveu em persa — a língua do Irã — e viveu e morreu na atual Turquia. Os três países o tratam como poeta nacional, e o persa do Masnavi é lido nas escolas do Irã e do Afeganistão."
            />
          </p>
        </article>
        <article v-reveal="100" class="tile tile--turquoise">
          <PersianText as="span" class="text-4xl text-tile">شب عروس</PersianText>
          <h3 class="mt-3 font-display text-2xl !text-ivory">A noite de núpcias</h3>
          <p class="mt-2 text-ivory/85">
            <GlossaryText
              text="Todo 17 de dezembro, aniversário da morte de Rumi, Konya recebe milhares de visitantes para cerimônias dos dervixes giradores."
            />
          </p>
        </article>
        <article v-reveal="200" class="tile tile--lapis">
          <h3 class="font-display text-2xl !text-ivory">A cúpula verde</h3>
          <p class="mt-2 text-ivory/85">
            <GlossaryText
              text="O túmulo de Rumi, em Konya, fica sob uma cúpula de azulejos verdes. Hoje é um museu e um dos lugares mais visitados da Turquia."
            />
          </p>
        </article>
        <article v-reveal="100" class="tile">
          <span class="tile__number text-lapis">2007</span>
          <h3 class="mt-2 font-display text-2xl">Ano de Rumi</h3>
          <p class="mt-2 text-ink-muted">
            <GlossaryText
              text="Nos 800 anos do nascimento dele, a UNESCO declarou 2007 o Ano Internacional de Rumi."
            />
          </p>
        </article>
        <article v-reveal="200" class="tile tile--gold">
          <span class="tile__number">anos 1990</span>
          <p class="mt-2 text-ink">
            versões livres em inglês fizeram de Rumi um dos poetas mais vendidos dos Estados Unidos.
          </p>
        </article>
        <article v-reveal="100" class="tile tile--music">
          <span class="tile__number">♪</span>
          <h3 class="mt-2 font-display text-2xl">Na música</h3>
          <p class="mt-2 text-ink-muted">
            <GlossaryText
              text="O som do ney abre as cerimônias dos dervixes giradores. No Irã, grandes vozes da música tradicional, como Shajarian, gravaram gazéis do Divã de Shams."
            />
          </p>
        </article>
        <article v-reveal="200" class="tile tile--lisbon">
          <span class="tile__number">?</span>
          <h3 class="mt-2 font-display text-2xl">Isso é mesmo Rumi?</h3>
          <p class="mt-2 text-ink-muted">
            <GlossaryText
              text="Muitas “frases de Rumi” que circulam na internet são reescritas livres de versões em inglês — e algumas não estão em lugar nenhum da obra. Por isso este site traduz direto do persa e mostra o original ao lado."
            />
          </p>
        </article>
      </div>
    </section>

    <!-- ───────────── Convite ───────────── -->
    <section class="invite" aria-labelledby="leia">
      <GirihPattern class="hero__pattern" />
      <div class="container-reading relative py-24 text-center">
        <h2 id="leia" class="text-4xl !text-ivory sm:text-5xl">O melhor jeito de conhecer Rumi</h2>
        <p class="mx-auto mt-4 max-w-lg text-lg text-ivory/80">
          é ler o que ele escreveu, com calma, entendendo cada imagem.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink to="/masnavi" class="btn bg-gold text-ink hover:bg-ivory hover:text-ink">
            Começar pelo Masnavi
          </NuxtLink>
          <NuxtLink
            to="/diva-de-shams"
            class="btn border border-ivory/40 text-ivory hover:bg-ivory/10 hover:text-ivory"
          >
            Abrir o Divã de Shams
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ───────────── Fontes ───────────── -->
    <section class="container-editorial py-16" aria-labelledby="fontes">
      <div class="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="fontes" class="text-2xl">De onde vêm estas informações</h2>
          <p class="mt-3 text-sm text-ink-muted">
            Texto do projeto, em versão preliminar. Encontrou um erro?
            <NuxtLink to="/como-traduzimos">Veja como contribuir</NuxtLink>.
          </p>
        </div>
        <ol class="refs">
          <li v-for="([title, detail], i) in references" :key="title">
            <span class="refs__n">{{ i + 1 }}</span>
            <p>
              <span class="font-semibold">{{ title }}</span>
              <span class="text-ink-muted"> — {{ detail }}</span>
            </p>
          </li>
        </ol>
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
    radial-gradient(ellipse at 80% 30%, rgb(19 101 107 / 0.55), transparent 55%),
    radial-gradient(ellipse at 10% 100%, rgb(184 149 79 / 0.18), transparent 50%), #10233a;
}
.hero__pattern {
  position: absolute;
  inset: 0;
  color: rgb(184 149 79 / 0.09);
}
.hero__watermark {
  position: absolute;
  right: -4vw;
  bottom: -14vw;
  font-size: clamp(14rem, 38vw, 34rem);
  line-height: 1;
  color: rgb(184 149 79 / 0.07);
  user-select: none;
  pointer-events: none;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(5rem, 15vw, 10rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--color-ivory);
}
.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding-bottom: 0.25rem;
  color: var(--color-gold);
  text-decoration: none;
  border-bottom: 1px solid rgb(184 149 79 / 0.5);
}
.hero__cta:hover {
  color: var(--color-ivory);
  border-color: var(--color-ivory);
}
.hero__arch-wrap {
  position: relative;
  justify-self: center;
  width: min(22rem, 80vw);
  aspect-ratio: 4 / 5;
}
.hero__arch {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--color-gold);
}
.hero__arch-inner {
  position: absolute;
  inset: 22% 12% 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 999px 999px 0 0;
  background: radial-gradient(ellipse at 50% 40%, rgb(19 101 107 / 0.55), transparent 70%);
}
.hero__facts {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding-bottom: 3rem;
}
@media (min-width: 768px) {
  .hero__facts {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.hero__fact {
  padding: 1.25rem 1.25rem 0 0;
  border-top: 1px solid rgb(184 149 79 / 0.35);
}

/* ── Selos ── */
.seals {
  display: grid;
  gap: 2rem;
  align-items: center;
}
@media (min-width: 1024px) {
  .seals {
    grid-template-columns: 1fr 2fr;
  }
}
.seal {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 0.9rem;
  border-radius: 1rem;
  background: #fffefb;
  border: 1px solid var(--color-line);
  font-size: 0.92rem;
  color: var(--color-ink-muted);
}
.seal > :first-child {
  align-self: flex-start;
}

/* ── Nomes ── */
.names {
  background: var(--color-paper);
  border-block: 1px solid var(--color-line);
}
.name {
  position: relative;
  padding: 2.25rem 1.75rem 2rem;
  background: var(--color-ivory);
  transition: background 0.3s var(--ease-garden);
}
.name:hover {
  background: #fffefb;
}
.name__index {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.name__fa {
  margin-top: 1rem;
  white-space: nowrap;
  font-size: clamp(1.4rem, 1.9vw, 2rem);
  line-height: 1.6;
  color: var(--color-lapis);
}

/* ── Citação ── */
.quote {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 0% 0%, rgb(73 182 176 / 0.25), transparent 50%),
    var(--color-turquoise-deep);
}
.quote__pattern {
  position: absolute;
  inset: 0;
  color: rgb(246 243 236 / 0.05);
}
.quote__fa {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  line-height: 2;
  color: var(--color-tile);
}
.quote__pt {
  margin-top: 1.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  line-height: 1.3;
  font-style: italic;
  color: var(--color-ivory);
}
.quote__note {
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgb(16 35 58 / 0.4);
  border: 1px solid rgb(184 149 79 / 0.3);
}

/* ── Régua ── */
.ruler-scroll {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.ruler {
  min-width: 720px;
  padding: 2rem 2.5rem 1rem 2rem;
  border-radius: 1.5rem;
  background: #fffefb;
  border: 1px solid var(--color-line);
}
.ruler__row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  align-items: stretch;
  min-height: 3.25rem;
}
.ruler__row--world {
  min-height: 7rem;
}
.ruler__label {
  align-self: center;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-lapis);
}
.ruler__track {
  position: relative;
  background: linear-gradient(var(--color-line), var(--color-line)) center / 100% 1px no-repeat;
}
.ruler__bar {
  position: absolute;
  bottom: 1.6rem;
  height: 0.8rem;
  border-radius: 999px;
}
.ruler__bar em {
  position: absolute;
  bottom: calc(100% + 0.3rem);
  left: 0;
  font-style: normal;
  font-size: 0.78rem;
  white-space: nowrap;
}
.ruler__life {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1.9rem;
  display: flex;
  align-items: center;
  padding-inline: 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
}
.ruler__bar--antes {
  background: var(--color-felt);
  color: #6e4a2c;
}
.ruler__bar--shams {
  background: var(--color-gold);
  color: #6b4f1a;
}
.ruler__bar--masnavi {
  background: var(--color-lapis);
  color: var(--color-lapis);
}
.ruler__row--konya {
  min-height: 5.25rem;
}
.ruler__row--konya .ruler__track {
  background-position: 0 calc(100% - 2rem);
}
.ruler__bar--shams em {
  bottom: auto;
  top: calc(100% + 0.3rem);
}
.ruler__life {
  background: linear-gradient(90deg, rgb(19 101 107 / 0.12), var(--color-turquoise) 18%);
  color: var(--color-ivory);
  justify-content: flex-end;
  font-family: var(--font-display);
  font-size: 1rem;
}
.ruler__pin {
  position: absolute;
  top: 0.2rem;
  bottom: 0.4rem;
  padding-left: 0.35rem;
  font-size: 0.78rem;
  color: var(--color-turquoise);
  border-left: 2px solid var(--color-turquoise);
}
.ruler__mark {
  position: absolute;
  bottom: 50%;
  padding: 0 0 0.45rem 0.45rem;
  font-size: 0.75rem;
  line-height: 1.25;
  white-space: nowrap;
  color: var(--color-ink-muted);
  border-left: 1px solid var(--color-gold);
}
.ruler__mark--low {
  bottom: auto;
  top: 50%;
  padding: 0.45rem 0 0 0.45rem;
}
.ruler__mark--end {
  border-left: 0;
  border-right: 1px solid var(--color-gold);
  padding-left: 0;
  padding-right: 0.45rem;
  translate: -100% 0;
  text-align: right;
}
.ruler__mark b {
  display: block;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-ink);
  font-variant-numeric: lining-nums;
}
.ruler__mark::before {
  content: '';
  position: absolute;
  left: -4px;
  bottom: -4px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--color-gold);
}
.ruler__mark--low::before {
  bottom: auto;
  top: -4px;
}
.ruler__mark--end::before {
  left: auto;
  right: -4px;
}
.ruler__axis {
  position: relative;
  margin-left: 5.5rem;
  margin-top: 0.75rem;
  height: 1.75rem;
  border-top: 1px solid var(--color-ink-muted);
}
.ruler__axis span {
  position: absolute;
  top: 0.35rem;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--color-ink-muted);
  font-variant-numeric: lining-nums;
}
.ruler__axis span:first-child {
  transform: none;
}
.ruler__axis span:last-child {
  transform: translateX(-100%);
}

/* ── Linha do tempo ── */
.chrono__item {
  --era: var(--color-ink-muted);
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem 2.5rem;
  padding: 2rem 0;
  border-top: 1px solid var(--color-line);
}
@media (min-width: 768px) {
  .chrono__item {
    grid-template-columns: 12rem 1fr;
  }
}
.chrono__item--antes {
  --era: #6e4a2c;
}
.chrono__item--shams {
  --era: #8a6a2c;
}
.chrono__item--masnavi {
  --era: var(--color-lapis);
}
.chrono__item--legado {
  --era: var(--color-turquoise);
}
.chrono__year {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1;
  color: var(--era);
  font-variant-numeric: lining-nums;
}
.chrono__body {
  max-width: 40rem;
  padding-left: 1.25rem;
  border-left: 3px solid var(--era);
}

/* ── Anatomia ── */
.anatomy {
  background: var(--color-paper);
  border-block: 1px solid var(--color-line);
}
.rule {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  color: var(--color-ink-muted);
}
.rule strong {
  color: var(--color-ink);
  font-weight: 600;
}
.rule__n {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-ivory);
  background: var(--color-turquoise);
  font-variant-numeric: lining-nums;
}
.diagram {
  padding: 2rem;
  border-radius: 1.5rem;
  background: #fffefb;
  border: 1px solid var(--color-line);
  box-shadow: 0 30px 60px -40px rgb(34 38 42 / 0.45);
}
.diagram__caption {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.couplet {
  display: grid;
  grid-template-columns: 1.5rem 1fr 1fr;
  gap: 0.9rem;
  align-items: center;
  direction: rtl;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
}
.couplet--last {
  background: rgb(73 182 176 / 0.16);
}
.couplet__n {
  direction: ltr;
  font-family: var(--font-display);
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.couplet__line {
  position: relative;
  justify-self: start;
  height: 0.5rem;
  border-radius: 999px;
  background: rgb(34 38 42 / 0.14);
}
.couplet__rhyme {
  position: absolute;
  left: 0;
  top: 50%;
  translate: 0 -50%;
  display: inline-block;
  width: 1.4rem;
  height: 0.85rem;
  border-radius: 999px;
  background: var(--color-gold);
}
.couplet__sign {
  position: absolute;
  right: 18%;
  top: 50%;
  translate: 0 -50%;
  padding: 0 0.45rem;
  font-family: var(--font-persian);
  font-style: normal;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-ivory);
  background: var(--color-turquoise);
  border-radius: 0.4rem;
}
.diagram__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-line);
  font-size: 0.85rem;
  color: var(--color-ink-muted);
}
.diagram__legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* ── Duas leituras ── */
.readings {
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid var(--color-line);
}
.readings__head,
.readings__row {
  display: grid;
  grid-template-columns: 1fr;
}
.readings__head {
  display: none;
}
@media (min-width: 768px) {
  .readings__head,
  .readings__row {
    display: grid;
    grid-template-columns: 13rem 1fr 1fr;
  }
}
.readings__col {
  padding: 1.25rem 1.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: var(--color-paper);
}
.readings__col--earth,
.readings__cell--earth {
  background: #fffefb;
  color: var(--color-turquoise);
}
.readings__col--sky,
.readings__cell--sky {
  background: var(--color-lapis);
  color: var(--color-ivory);
}
.readings__col--sky {
  color: var(--color-gold);
}
.readings__row {
  border-top: 1px solid var(--color-line);
}
.readings__word {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  text-align: left;
  color: var(--color-ink);
  background: var(--color-paper);
  transition: color 0.2s;
}
.readings__word:hover {
  color: var(--color-turquoise);
}
.readings__cell {
  padding: 1.25rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  line-height: 1.35;
  font-style: italic;
}
.readings__cell--earth {
  color: var(--color-ink);
}
.readings__mobile {
  display: block;
  margin-bottom: 0.25rem;
  font-family: var(--font-serif);
  font-style: normal;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
}
@media (min-width: 768px) {
  .readings__mobile {
    display: none;
  }
}

/* ── Lendas ── */
.legends {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 100% 0%, rgb(73 182 176 / 0.3), transparent 50%),
    var(--color-turquoise);
}
.legends__pattern {
  position: absolute;
  inset: 0;
  color: rgb(246 243 236 / 0.06);
}
.legend {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 1.5rem;
  color: var(--color-ink);
  background: var(--color-ivory);
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.45);
}
.legend__numeral {
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 0.8;
  color: var(--color-tile);
}
.legend__known {
  margin-top: auto;
  padding-top: 1.5rem;
}
.legend__known > :first-child {
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-line);
}
.verdict {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.verdict i {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--color-turquoise);
}
.verdict i.on {
  background: var(--color-turquoise);
}
.verdict b {
  margin-left: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-turquoise);
}

/* ── Legado ── */
.bento {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .bento {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .tile--big {
    grid-column: span 2;
    grid-row: span 2;
  }
  .tile--gold,
  .tile--lisbon {
    grid-column: span 2;
  }
}
.tile {
  padding: 2rem;
  border-radius: 1.5rem;
  background: #fffefb;
  border: 1px solid var(--color-line);
}
.tile--big {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 20rem;
  background:
    radial-gradient(circle at 85% 15%, rgb(184 149 79 / 0.25), transparent 45%), var(--color-paper);
}
.tile__number {
  display: block;
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 0.9;
  color: var(--color-turquoise);
  font-variant-numeric: lining-nums;
}
.tile--big .tile__number {
  font-size: clamp(6rem, 14vw, 11rem);
}
.tile--turquoise {
  background: var(--color-turquoise);
  border-color: transparent;
}
.tile--lapis {
  background: var(--color-lapis);
  border-color: transparent;
}
.tile--gold {
  background: rgb(184 149 79 / 0.28);
  border-color: transparent;
}
.tile--gold .tile__number {
  font-size: 2.25rem;
  color: var(--color-ink);
}

/* ── Convite ── */
.invite {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background: radial-gradient(ellipse at 50% 120%, rgb(184 149 79 / 0.3), transparent 60%), #10233a;
}

/* ── Fontes ── */
.refs {
  display: grid;
  gap: 1rem;
  font-size: 0.95rem;
}
.refs li {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.75rem;
}
.refs__n {
  font-family: var(--font-display);
  font-size: 1.4rem;
  line-height: 1.2;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}

/* ── Animações ── */
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 24px;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }
}
@keyframes drift {
  to {
    translate: calc(-1 * var(--tile)) calc(-1 * var(--tile));
  }
}
@keyframes float {
  50% {
    translate: 0 -14px;
  }
}
@keyframes glow {
  50% {
    opacity: 0.55;
    scale: 1.08;
  }
}
@keyframes pop {
  from {
    scale: 0;
  }
  70% {
    scale: 1.25;
  }
}
@keyframes grow-x {
  from {
    scale: 0 1;
  }
}
@keyframes grow-y {
  from {
    scale: 1 0;
  }
}

/* Abertura: entrada em cascata, arco se desenhando, padrão e marca d'água vivos */
.hero .eyebrow {
  animation: fade 1s var(--ease-garden) both;
}
.hero__title {
  animation: rise 1.1s 0.1s var(--ease-garden) both;
}
.hero__title + p {
  animation: rise 1.1s 0.3s var(--ease-garden) both;
}
.hero__cta {
  animation: rise 1.1s 0.5s var(--ease-garden) both;
}
.hero__cta svg {
  animation: float 2.4s 1.6s ease-in-out infinite;
}
.hero__arch :deep(path) {
  stroke-dasharray: 1;
  animation: draw 2.4s 0.2s var(--ease-garden) both;
}
.hero__arch :deep(circle) {
  animation: pop 0.6s 2.2s var(--ease-garden) both;
  transform-box: fill-box;
  transform-origin: center;
}
.hero__arch-inner {
  isolation: isolate;
  animation: fade 1.6s 1.2s var(--ease-garden) both;
}
.hero__arch-inner::before {
  content: '';
  position: absolute;
  inset: 10% 15% 30%;
  z-index: -1;
  border-radius: 999px;
  background: radial-gradient(circle, rgb(184 149 79 / 0.35), transparent 70%);
  animation: glow 6s ease-in-out infinite;
}
.hero__fact {
  animation: rise 0.9s var(--ease-garden) both;
}
.hero__fact:nth-child(1) {
  animation-delay: 0.7s;
}
.hero__fact:nth-child(2) {
  animation-delay: 0.8s;
}
.hero__fact:nth-child(3) {
  animation-delay: 0.9s;
}
.hero__fact:nth-child(4) {
  animation-delay: 1s;
}
.hero__pattern {
  --tile: 72px;
}
.quote__pattern {
  --tile: 96px;
}
.legends__pattern {
  --tile: 88px;
}
.hero__pattern,
.quote__pattern,
.legends__pattern {
  inset: 0 -96px -96px 0;
  width: calc(100% + 96px);
  height: calc(100% + 96px);
  animation: drift 60s linear infinite;
}
.hero__watermark {
  animation: float 12s ease-in-out infinite;
}

/* Nomes: o persa ganha cor ao passar o mouse */
.name__fa {
  transition:
    color 0.4s,
    translate 0.4s var(--ease-garden);
}
.name:hover .name__fa {
  color: var(--color-turquoise);
  translate: 0 -3px;
}

/* Régua: as barras crescem quando a régua aparece */
.ruler.reveal-done .ruler__bar,
.ruler.reveal-done .ruler__life {
  transform-origin: left center;
  animation: grow-x 1.2s 0.2s var(--ease-garden) both;
}
.ruler.reveal-done .ruler__bar--masnavi {
  animation-delay: 0.5s;
}
.ruler.reveal-done .ruler__life {
  animation-delay: 0.35s;
  animation-duration: 1.6s;
}
.ruler.reveal-done .ruler__pin {
  transform-origin: bottom;
  animation: grow-y 0.6s 1.2s var(--ease-garden) both;
}
.ruler.reveal-done .ruler__mark {
  animation: fade 0.6s var(--ease-garden) both;
}
.ruler.reveal-done .ruler__mark:nth-child(1) {
  animation-delay: 0.5s;
}
.ruler.reveal-done .ruler__mark:nth-child(2) {
  animation-delay: 0.7s;
}
.ruler.reveal-done .ruler__mark:nth-child(3) {
  animation-delay: 0.9s;
}
.ruler.reveal-done .ruler__mark:nth-child(4) {
  animation-delay: 1.1s;
}
.ruler.reveal-done .ruler__mark:nth-child(5) {
  animation-delay: 1.3s;
}
.ruler.reveal-done .ruler__mark:nth-child(6) {
  animation-delay: 1.5s;
}

/* Linha do tempo: o fio colorido desce quando o item aparece */
.chrono__body {
  position: relative;
  border-left-color: transparent;
}
.chrono__body::before {
  content: '';
  position: absolute;
  left: -3px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--era);
  transform-origin: top;
}
.chrono__item.reveal-done .chrono__body::before {
  animation: grow-y 0.9s 0.25s var(--ease-garden) both;
}

/* Esquema do gazel: os versos se escrevem e as rimas acendem uma a uma */
.diagram.reveal-done .couplet__line {
  transform-origin: right center;
  animation: grow-x 0.7s var(--ease-garden) both;
}
.diagram.reveal-done .couplet__line .couplet__rhyme {
  animation: pop 0.45s var(--ease-garden) both;
}
.diagram.reveal-done .couplet__sign {
  animation: pop 0.5s 1.9s var(--ease-garden) both;
}
.diagram.reveal-done .couplet:nth-child(1) > * {
  animation-delay: 0.1s;
}
.diagram.reveal-done .couplet:nth-child(2) > * {
  animation-delay: 0.3s;
}
.diagram.reveal-done .couplet:nth-child(3) > * {
  animation-delay: 0.5s;
}
.diagram.reveal-done .couplet:nth-child(4) > * {
  animation-delay: 0.7s;
}
.diagram.reveal-done .couplet:nth-child(5) > * {
  animation-delay: 0.9s;
}
.diagram.reveal-done .couplet:nth-child(6) > * {
  animation-delay: 1.1s;
}
.diagram.reveal-done .couplet:nth-child(1) .couplet__rhyme {
  animation-delay: 0.7s;
}
.diagram.reveal-done .couplet:nth-child(2) .couplet__rhyme {
  animation-delay: 0.9s;
}
.diagram.reveal-done .couplet:nth-child(3) .couplet__rhyme {
  animation-delay: 1.1s;
}
.diagram.reveal-done .couplet:nth-child(4) .couplet__rhyme {
  animation-delay: 1.3s;
}
.diagram.reveal-done .couplet:nth-child(5) .couplet__rhyme {
  animation-delay: 1.5s;
}
.diagram.reveal-done .couplet:nth-child(6) .couplet__rhyme {
  animation-delay: 1.7s;
}

/* Duas leituras: a linha inteira reage ao passar o mouse */
.readings__row > * {
  transition:
    background 0.3s,
    padding 0.3s var(--ease-garden);
}
.readings__row:hover .readings__word {
  padding-left: 2rem;
  color: var(--color-turquoise);
}
.readings__row:hover .readings__cell--earth {
  background: #fff;
}
.readings__row:hover .readings__cell--sky {
  background: #1a3550;
}

/* Lendas e blocos: leve elevação */
.legend,
.tile {
  transition:
    opacity 0.9s var(--ease-garden),
    translate 0.9s var(--ease-garden),
    transform 0.35s var(--ease-garden),
    box-shadow 0.35s var(--ease-garden);
  transition-delay: var(--reveal-delay, 0ms), var(--reveal-delay, 0ms), 0s, 0s;
}
.legend:hover,
.tile:hover {
  transform: translateY(-6px);
}
.tile:hover {
  box-shadow: 0 24px 50px -30px rgb(34 38 42 / 0.5);
}
.legend.reveal-done .verdict i.on {
  animation: pop 0.4s var(--ease-garden) both;
}
.legend.reveal-done .verdict i:nth-child(1) {
  animation-delay: 0.6s;
}
.legend.reveal-done .verdict i:nth-child(2) {
  animation-delay: 0.75s;
}
.legend.reveal-done .verdict i:nth-child(3) {
  animation-delay: 0.9s;
}
.tile--big .tile__number {
  transition: scale 0.6s var(--ease-garden);
  transform-origin: left bottom;
}
.tile--big:hover .tile__number {
  scale: 1.06;
}

/* ── Abertura mais viva ── */
.hero {
  --mx: 0;
  --my: 0;
}
.hero__title {
  animation: none;
}
.hero__letter {
  display: inline-block;
  background: linear-gradient(100deg, var(--color-ivory) 40%, #e9cf94 50%, var(--color-ivory) 60%);
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    letter-in 1s var(--ease-garden) both,
    shimmer 7s 2s ease-in-out infinite;
}
@keyframes letter-in {
  from {
    opacity: 0;
    translate: 0 0.4em;
    filter: blur(8px);
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
.hero__sparks {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.spark {
  position: absolute;
  bottom: -2rem;
  opacity: 0;
  animation-name: spark-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.spark--ring {
  border-radius: 999px;
  border: 1.5px dashed rgb(73 182 176 / 0.75);
}
.spark--star {
  background: #e9cf94;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
@keyframes spark-rise {
  10% {
    opacity: 0.8;
  }
  50% {
    translate: 2rem -45vh;
    rotate: 180deg;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 0;
    translate: -1rem -90vh;
    rotate: 360deg;
  }
}
.hero__parallax-far {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translate(calc(var(--mx) * -22px), calc(var(--my) * -14px));
  transition: transform 0.6s var(--ease-garden);
}
.hero__arch-wrap {
  transform: translate(calc(var(--mx) * 14px), calc(var(--my) * 10px));
  transition: transform 0.6s var(--ease-garden);
}
.hero__rosette {
  position: absolute;
  inset: 8% -18% auto;
  width: 136%;
  color: rgb(73 182 176 / 0.3);
  animation: fade 2s 0.8s both;
}
@keyframes spin {
  to {
    rotate: 360deg;
  }
}

.tile--music {
  background: radial-gradient(circle at 90% 10%, rgb(73 182 176 / 0.25), transparent 50%), #fffefb;
}
.tile--lisbon {
  background: radial-gradient(circle at 10% 90%, rgb(23 53 80 / 0.12), transparent 50%), #fffefb;
}
</style>
