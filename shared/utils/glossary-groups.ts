/**
 * Temas do glossário, para filtrar e colorir a página /glossario.
 * Termos novos que não estiverem aqui caem em "outros" — basta acrescentá-los.
 */
export interface GlossaryGroup {
  id: string
  label: string
  /** Cor de destaque (tokens do design system). */
  color: string
  ids: string[]
}

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  {
    id: 'rumi',
    label: 'Rumi e seu círculo',
    color: 'var(--color-wine)',
    ids: ['rumi', 'shams', 'hosam', 'sultan-valad', 'mevlevi'],
  },
  {
    id: 'forma',
    label: 'Obras e formas',
    color: '#8a6a2c',
    ids: [
      'masnavi',
      'divan-shams',
      'divan',
      'gazel',
      'rubai',
      'tarji',
      'disticos',
      'hemistiquio',
      'radif',
      'takhallos',
      'khamush',
    ],
  },
  {
    id: 'simbolos',
    label: 'Imagens e símbolos',
    color: '#a2524f',
    ids: ['ney', 'vinho', 'saqi', 'amado', 'rosa-rouxinol', 'kherqe'],
  },
  {
    id: 'mistica',
    label: 'Mística e religião',
    color: 'var(--color-cypress)',
    ids: ['sufi', 'dervixe', 'xeque', 'sama', 'alcorao', 'islam', 'arabe'],
  },
  {
    id: 'historias',
    label: 'Histórias e lendas',
    color: '#5b3f7a',
    ids: ['majnun', 'jose-zuleica'],
  },
  {
    id: 'historia',
    label: 'Lugares e época',
    color: '#1f3d5a',
    ids: ['balkh', 'konya', 'mongois', 'sultao', 'nowruz'],
  },
  {
    id: 'poetas',
    label: 'Outros poetas e artistas',
    color: '#6b4f1a',
    ids: ['attar', 'nezami', 'saadi', 'hafez', 'shajarian'],
  },
]

export const OTHER_GROUP: GlossaryGroup = {
  id: 'outros',
  label: 'Outros',
  color: 'var(--color-ink-muted)',
  ids: [],
}

export function groupOf(termId: string): GlossaryGroup {
  return GLOSSARY_GROUPS.find((g) => g.ids.includes(termId)) ?? OTHER_GROUP
}
