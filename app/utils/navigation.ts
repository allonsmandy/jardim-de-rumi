export interface NavItem {
  label: string
  to: string
}

/** Navegação principal: Início | Masnavi | Divã de Shams | O Poeta | Arte Persa | Sobre */
export const MAIN_NAVIGATION: NavItem[] = [
  { label: 'Início', to: '/' },
  { label: 'Masnavi', to: '/masnavi' },
  { label: 'Divã de Shams', to: '/diva-de-shams' },
  { label: 'O Poeta', to: '/o-poeta' },
  { label: 'Arte Persa', to: '/arte-persa' },
  { label: 'Sobre', to: '/sobre' },
]
