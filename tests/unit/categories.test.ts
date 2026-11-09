import { describe, expect, it } from 'vitest'
import { POEM_CATEGORY_IDS, poemId } from '../../shared/schemas/poem'
import {
  POEM_CATEGORIES,
  WORKS,
  getCategoryBySlug,
  poemFullLabel,
  poemLabel,
  poemPath,
} from '../../shared/utils/categories'

describe('categorias e obras', () => {
  it('toda categoria do schema tem configuração, e vice-versa', () => {
    expect(POEM_CATEGORIES.map((c) => c.id).sort()).toEqual([...POEM_CATEGORY_IDS].sort())
  })

  it('toda categoria pertence a uma obra conhecida, com slug único dentro dela', () => {
    for (const work of WORKS) {
      const slugs = POEM_CATEGORIES.filter((c) => c.work === work.id).map((c) => c.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
      expect(slugs.length).toBeGreaterThan(0)
    }
  })

  it('monta ids com 4 dígitos', () => {
    expect(poemId('gazal', 12)).toBe('gazal-0012')
    expect(poemId('masnavi-3', 228)).toBe('masnavi-3-0228')
  })

  it('monta rotas e rótulos', () => {
    expect(poemPath({ category: 'masnavi-1', number: 1 })).toBe('/masnavi/livro-1/1')
    expect(poemPath({ category: 'gazal', number: 12 })).toBe('/diva-de-shams/gazeis/12')
    expect(poemLabel({ category: 'masnavi-2', number: 5 })).toBe('Livro II, seção 5')
    expect(poemFullLabel({ category: 'gazal', number: 12 })).toBe('Divã de Shams, Gazel 12')
  })

  it('encontra a categoria pelo slug só dentro da obra certa', () => {
    expect(getCategoryBySlug('masnavi', 'livro-6')?.id).toBe('masnavi-6')
    expect(getCategoryBySlug('shams', 'livro-6')).toBeUndefined()
    expect(getCategoryBySlug('masnavi', 'gazeis')).toBeUndefined()
  })
})
