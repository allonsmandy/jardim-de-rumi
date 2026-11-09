import type { PoemCategoryId } from '../schemas/poem'

export type WorkId = 'shams' | 'masnavi'

export interface Work {
  id: WorkId
  /** Primeiro segmento da URL: /<slug>/<categoria>/<numero> */
  slug: string
  title: string
  titleFa: string
  /** Uma frase para leigos: o que é esta obra. */
  description: string
  /** Como chamar uma peça desta obra no singular e no plural ("poema", "seção"). */
  item: string
  itemPlural: string
}

export const WORKS: readonly Work[] = [
  {
    id: 'masnavi',
    slug: 'masnavi',
    title: 'Masnavi',
    titleFa: 'مثنوی معنوی',
    description:
      'O grande poema de Rumi: seis livros de histórias, parábolas e ensinamentos em dísticos rimados, que começam com o lamento de uma flauta de junco.',
    item: 'seção',
    itemPlural: 'seções',
  },
  {
    id: 'shams',
    slug: 'diva-de-shams',
    title: 'Divã de Shams',
    titleFa: 'دیوان شمس',
    description:
      'Os poemas líricos de Rumi — gazéis, quadras e poemas com refrão —, muitos assinados com o nome de Shams de Tabriz, o amigo que mudou a sua vida.',
    item: 'poema',
    itemPlural: 'poemas',
  },
] as const

export interface PoemCategory {
  id: PoemCategoryId
  work: WorkId
  /** Segundo segmento da URL: /<obra>/<slug>/<numero> */
  slug: string
  /** Nome de UMA peça, usado antes do número: "Gazel 12", "Livro I, seção 3". */
  label: string
  labelPlural: string
  labelFa: string
  /** Forma poética, para a ficha do poema. */
  form: string
  description: string
  /** Total de peças nesta categoria no Ganjoor, quando conhecido. */
  expectedCount?: number
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const
const ORDINAL = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto'] as const
const BOOK_FA = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم'] as const
/** Seções por livro no Ganjoor (conferido em 2026-11-08). */
const BOOK_SECTIONS = [172, 115, 228, 139, 178, 140] as const

const MASNAVI_BOOKS: PoemCategory[] = ROMAN.map((roman, i) => ({
  id: `masnavi-${i + 1}` as PoemCategoryId,
  work: 'masnavi',
  slug: `livro-${i + 1}`,
  label: `Livro ${roman}, seção`,
  labelPlural: `Livro ${roman}`,
  labelFa: `دفتر ${BOOK_FA[i]}`,
  form: 'Masnavi (dísticos rimados)',
  description: `O ${ORDINAL[i]} dos seis livros do Masnavi.`,
  expectedCount: BOOK_SECTIONS[i],
}))

/**
 * Categorias do acervo, na ordem de leitura do site.
 * A grafia em português segue docs/translation-workflow.md.
 */
export const POEM_CATEGORIES: readonly PoemCategory[] = [
  ...MASNAVI_BOOKS,
  {
    id: 'gazal',
    work: 'shams',
    slug: 'gazeis',
    label: 'Gazel',
    labelPlural: 'Gazéis',
    labelFa: 'غزلیات',
    form: 'Gazel',
    description:
      'Poemas líricos de rima única, muitos feitos para serem cantados. Em vez do próprio nome, Rumi costuma assinar com o de Shams ou com a palavra “Silêncio”.',
    expectedCount: 3230,
  },
  {
    id: 'rubai',
    work: 'shams',
    slug: 'rubaiyat',
    label: 'Rubai',
    labelPlural: 'Rubaiyat',
    labelFa: 'رباعیات',
    form: 'Rubai (quadra)',
    description: 'Quadras de quatro versos, breves como um suspiro.',
    expectedCount: 1994,
  },
  {
    id: 'tarji',
    work: 'shams',
    slug: 'tarjis',
    label: 'Tarji‘-band',
    labelPlural: 'Tarji‘-bands',
    labelFa: 'ترجیعات',
    form: 'Tarji‘-band (poema com refrão)',
    description: 'Poemas em estrofes que voltam sempre a um mesmo verso, como um refrão.',
    expectedCount: 44,
  },
]

export function getWork(id: WorkId): Work {
  const work = WORKS.find((w) => w.id === id)
  if (!work) throw new Error(`Obra desconhecida: ${id}`)
  return work
}

export function getWorkBySlug(slug: string): Work | undefined {
  return WORKS.find((w) => w.slug === slug)
}

export function getCategory(id: PoemCategoryId): PoemCategory {
  const category = POEM_CATEGORIES.find((c) => c.id === id)
  if (!category) throw new Error(`Categoria desconhecida: ${id}`)
  return category
}

export function getCategoryBySlug(work: WorkId, slug: string): PoemCategory | undefined {
  return POEM_CATEGORIES.find((c) => c.work === work && c.slug === slug)
}

export const categoriesOf = (work: WorkId) => POEM_CATEGORIES.filter((c) => c.work === work)

/** "Gazel 12" · "Livro I, seção 3" */
export function poemLabel(poem: { category: PoemCategoryId; number: number }): string {
  return `${getCategory(poem.category).label} ${poem.number}`
}

/** "Divã de Shams, Gazel 12" · "Masnavi, Livro I, seção 3" */
export function poemFullLabel(poem: { category: PoemCategoryId; number: number }): string {
  return `${getWork(getCategory(poem.category).work).title}, ${poemLabel(poem)}`
}

export function workPath(work: WorkId): string {
  return `/${getWork(work).slug}`
}

export function poemPath(poem: { category: PoemCategoryId; number: number }): string {
  const category = getCategory(poem.category)
  return `/${getWork(category.work).slug}/${category.slug}/${poem.number}`
}
