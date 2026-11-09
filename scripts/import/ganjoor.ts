/**
 * Importa o TEXTO PERSA de Rumi a partir da API pública do Ganjoor e cria
 * arquivos de poema com status `pending` (nunca publicados automaticamente).
 *
 * - Não sobrescreve arquivos existentes (para não apagar trabalho de tradução),
 *   exceto com --force, e mesmo assim só substitui o bloco `original`.
 * - Não importa comentários, resumos ou leituras do Ganjoor.
 * - No Masnavi, guarda também o título em prosa da seção (`sectionTitle.fa`).
 * - Intervalo de 1 s entre requisições.
 *
 * Uso:
 *   pnpm import:ganjoor --category masnavi-1 --from 1 --to 10   (Masnavi, livro I)
 *   pnpm import:ganjoor --from 1 --to 10                        (gazéis do Divã de Shams)
 *   pnpm import:ganjoor --category rubai --from 1 --to 42
 *   Categorias: masnavi-1 … masnavi-6, gazal, rubai, tarji
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse, stringify } from 'yaml'
import { Poem, poemId, type PoemCategoryId, type PoemInput } from '../../shared/schemas/poem'

const ROOT = join(import.meta.dirname, '..', '..')
const API = 'https://api.ganjoor.net/api/ganjoor/poem'
const USER_AGENT = 'JardimDeRumiImport/0.1 (projeto editorial nao comercial)'

/** Onde cada categoria do site fica no Ganjoor. */
const GANJOOR: Record<PoemCategoryId, { path: string; locator: string }> = {
  gazal: { path: '/moulavi/shams/ghazalsh', locator: 'Divã de Shams, gazel' },
  rubai: { path: '/moulavi/shams/robaeesh', locator: 'Divã de Shams, rubai' },
  tarji: { path: '/moulavi/shams/tarjeeat', locator: 'Divã de Shams, tarji‘-band' },
  'masnavi-1': { path: '/moulavi/masnavi/daftar1', locator: 'Masnavi, livro I, seção' },
  'masnavi-2': { path: '/moulavi/masnavi/daftar2', locator: 'Masnavi, livro II, seção' },
  'masnavi-3': { path: '/moulavi/masnavi/daftar3', locator: 'Masnavi, livro III, seção' },
  'masnavi-4': { path: '/moulavi/masnavi/daftar4', locator: 'Masnavi, livro IV, seção' },
  'masnavi-5': { path: '/moulavi/masnavi/daftar5', locator: 'Masnavi, livro V, seção' },
  'masnavi-6': { path: '/moulavi/masnavi/daftar6', locator: 'Masnavi, livro VI, seção' },
}

interface GanjoorVerse {
  vOrder: number
  coupletIndex: number
  versePosition: number
  text: string
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function fetchPoem(category: PoemCategoryId, n: number) {
  const map = GANJOOR[category]
  const params = new URLSearchParams({
    url: `${map.path}/sh${n}`,
    verseDetails: 'true',
    catInfo: 'false',
    catPoems: 'false',
    rhymes: 'false',
    recitations: 'false',
    images: 'false',
    songs: 'false',
    comments: 'false',
    navigation: 'false',
    relatedpoems: 'false',
  })
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Ganjoor respondeu ${res.status} para ${category} ${n}`)
  const data = (await res.json()) as { fullUrl: string; title: string; verses: GanjoorVerse[] }
  const couplets = new Map<number, string[]>()
  for (const v of [...data.verses].sort((a, b) => a.vOrder - b.vOrder)) {
    // versePosition 0/1 = hemistíquios de um bayt; 2/3 = o bayt-refrão de um tarji‘-band
    if (v.versePosition < 0 || v.versePosition > 3) continue
    const list = couplets.get(v.coupletIndex) ?? []
    list.push(v.text.trim())
    couplets.set(v.coupletIndex, list)
  }
  // Masnavi: "بخش ۱ - سرآغاز" → "سرآغاز"
  const sectionTitle = category.startsWith('masnavi-')
    ? data.title.replace(/^بخش\s*[0-9۰-۹]+\s*-\s*/, '').trim() || undefined
    : undefined
  return {
    url: `https://ganjoor.net${data.fullUrl}`,
    stanzas: [...couplets.values()],
    sectionTitle,
  }
}

async function main() {
  const category = (arg('category') ?? 'gazal') as PoemCategoryId
  const map = GANJOOR[category]
  if (!map) throw new Error(`Categoria desconhecida: ${category}`)
  const from = Number(arg('from') ?? 1)
  const to = Number(arg('to') ?? from)
  const force = process.argv.includes('--force')
  const today = new Date().toISOString().slice(0, 10)
  const dir = join(ROOT, 'content', 'poetry', category)
  await mkdir(dir, { recursive: true })

  for (let n = from; n <= to; n++) {
    const id = poemId(category, n)
    const locator = `${map.locator} ${n}`
    const file = join(dir, `${id}.yml`)
    if (existsSync(file) && !force) {
      console.log(`= ${id} já existe (use --force para atualizar apenas o original)`)
      continue
    }
    const { url, stanzas, sectionTitle } = await fetchPoem(category, n)
    const original = {
      language: 'fa' as const,
      stanzas,
      edition: 'ganjoor',
      transcription: { source: 'ganjoor', locator, url },
    }
    const existing = existsSync(file)
      ? (parse(await readFile(file, 'utf8')) as PoemInput)
      : undefined
    const poem: PoemInput = existing
      ? {
          ...existing,
          original,
          ...(sectionTitle ? { sectionTitle: { ...existing.sectionTitle, fa: sectionTitle } } : {}),
          updatedAt: today,
        }
      : {
          id,
          category,
          number: n,
          ...(sectionTitle ? { sectionTitle: { fa: sectionTitle } } : {}),
          firstLine: { fa: stanzas[0]![0]! },
          originalLanguage: 'fa',
          original,
          translationStatus: 'pending',
          publicationAuthorized: false,
          references: [{ source: 'ganjoor', locator, url }],
          editorialNotes: [
            `Texto persa importado automaticamente do Ganjoor em ${today}; conferir com a edição impressa.`,
          ],
          updatedAt: today,
        }
    Poem.parse(poem)
    await writeFile(file, stringify(poem, { lineWidth: 0 }))
    console.log(`+ ${id} (${stanzas.length} dísticos)`)
    await new Promise((r) => setTimeout(r, 1000))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
