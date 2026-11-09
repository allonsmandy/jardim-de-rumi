import type { Poem, PoemCategoryId, PoemNeighbors, PoemSummary } from '../schemas/poem'
import { POEM_CATEGORIES, getCategory, type WorkId } from './categories'
import { checkPublication } from './publication'
import { normalizeForSearch, toLatinDigits } from './text'

const categoryOrder = (id: PoemCategoryId) => POEM_CATEGORIES.findIndex((c) => c.id === id)

export function comparePoems(
  a: Pick<Poem, 'category' | 'number'>,
  b: Pick<Poem, 'category' | 'number'>,
) {
  return categoryOrder(a.category) - categoryOrder(b.category) || a.number - b.number
}

export function toSummary(poem: Poem): PoemSummary {
  const searchable = [
    poem.editorialTitle,
    poem.sectionTitle?.pt,
    poem.sectionTitle?.fa,
    poem.firstLine.pt,
    poem.firstLine.fa,
    ...(poem.translation?.stanzas.flat() ?? []),
    ...(poem.original?.stanzas.flat() ?? []),
  ]
    .filter(Boolean)
    .join(' ')
  return {
    id: poem.id,
    category: poem.category,
    number: poem.number,
    editorialTitle: poem.editorialTitle,
    sectionTitle: poem.sectionTitle,
    firstLine: poem.firstLine,
    translators: poem.translation?.translators ?? [],
    translationKind: poem.translation?.kind,
    machineAssisted: poem.translation?.machineAssisted ?? false,
    publicationLevel: checkPublication(poem).level,
    searchText: normalizeForSearch(searchable),
  }
}

export interface LibraryQuery {
  q?: string
  work?: WorkId
  category?: PoemCategoryId
}

/**
 * Busca e filtro da biblioteca.
 * - Uma consulta só com dígitos (latinos ou persas) busca pelo NÚMERO exato.
 * - Caso contrário, todas as palavras precisam aparecer no texto normalizado.
 */
export function searchPoems<T extends PoemSummary>(poems: readonly T[], query: LibraryQuery): T[] {
  const byCategory = poems.filter(
    (p) =>
      (!query.work || getCategory(p.category).work === query.work) &&
      (!query.category || p.category === query.category),
  )
  const raw = query.q?.trim() ?? ''
  if (!raw) return byCategory.sort(comparePoems)

  const digits = toLatinDigits(raw).replace(/^(n[º°o]?\.?|#)\s*/i, '')
  if (/^\d+$/.test(digits)) {
    const n = Number(digits)
    return byCategory.filter((p) => p.number === n).sort(comparePoems)
  }

  const terms = normalizeForSearch(raw).split(' ').filter(Boolean)
  return byCategory.filter((p) => terms.every((t) => p.searchText.includes(t))).sort(comparePoems)
}

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/** Pagina uma lista; páginas fora do intervalo são ajustadas para o limite válido. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  if (!Number.isInteger(pageSize) || pageSize < 1)
    throw new RangeError('pageSize deve ser um inteiro positivo')
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1), totalPages)
  const start = (current - 1) * pageSize
  return { items: items.slice(start, start + pageSize), page: current, pageSize, total, totalPages }
}

/** Poemas anterior e seguinte DENTRO da mesma categoria, entre os publicados. */
export function getNeighbors(
  poems: readonly Pick<
    PoemSummary,
    'category' | 'number' | 'firstLine' | 'editorialTitle' | 'sectionTitle'
  >[],
  current: Pick<Poem, 'category' | 'number'>,
): PoemNeighbors {
  const sameCategory = poems
    .filter((p) => p.category === current.category)
    .sort((a, b) => a.number - b.number)
  const index = sameCategory.findIndex((p) => p.number === current.number)
  if (index === -1) return {}
  const pick = (p?: (typeof sameCategory)[number]) =>
    p && {
      category: p.category,
      number: p.number,
      firstLine: p.firstLine,
      editorialTitle: p.editorialTitle,
      sectionTitle: p.sectionTitle,
    }
  return { previous: pick(sameCategory[index - 1]), next: pick(sameCategory[index + 1]) }
}
