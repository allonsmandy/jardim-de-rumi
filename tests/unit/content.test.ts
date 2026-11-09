import { describe, expect, it } from 'vitest'
import { stringify } from 'yaml'
import { loadContent } from '../../shared/utils/content'
import { makePoemInput, sourcesYaml } from '../fixtures/poems'

const file = (input: object) => stringify(input)

describe('carregamento do acervo', () => {
  it('carrega poemas válidos', () => {
    const r = loadContent({
      sources: sourcesYaml,
      poems: { 'content/poetry/gazal/gazal-0001.yml': file(makePoemInput()) },
    })
    expect(r.issues).toEqual([])
    expect(r.poems).toHaveLength(1)
  })

  it('aponta YAML inválido', () => {
    const r = loadContent({
      sources: sourcesYaml,
      poems: { 'content/poetry/gazal/gazal-0001.yml': 'id: [' },
    })
    expect(r.issues[0]?.path).toBe('(yaml)')
  })

  it('exige nome de arquivo igual ao id', () => {
    const r = loadContent({
      sources: sourcesYaml,
      poems: { 'content/poetry/gazal/outro.yml': file(makePoemInput()) },
    })
    expect(r.issues.map((i) => i.message)).toContainEqual(expect.stringContaining('gazal-0001.yml'))
  })

  it('detecta duplicatas de numeração e de texto persa', () => {
    const r = loadContent({
      sources: sourcesYaml,
      poems: {
        'content/poetry/gazal/gazal-0001.yml': file(makePoemInput()),
        'content/poetry/a/gazal-0001.yml': file(makePoemInput()),
        'content/poetry/gazal/gazal-0002.yml': file(
          makePoemInput({ number: 2, original: makePoemInput().original }),
        ),
      },
    })
    const messages = r.issues.map((i) => i.message).join('\n')
    expect(messages).toMatch(/Duplicata/)
    expect(messages).toMatch(/Mesmo texto persa/)
  })

  it('aceita poemas diferentes com o mesmo primeiro verso (comum no Divã de Shams)', () => {
    const base = makePoemInput()
    const r = loadContent({
      sources: sourcesYaml,
      poems: {
        'content/poetry/gazal/gazal-0001.yml': file(base),
        'content/poetry/gazal/gazal-0002.yml': file(
          makePoemInput({
            number: 2,
            firstLine: base.firstLine,
            original: {
              ...base.original!,
              stanzas: [base.original!.stanzas[0]!, ['مصرع دیگر', 'مصرع آخر']],
            },
          }),
        ),
      },
    })
    expect(r.issues).toEqual([])
  })

  it('exige fontes registradas', () => {
    const r = loadContent({
      sources: sourcesYaml,
      poems: {
        'content/poetry/gazal/gazal-0001.yml': file(
          makePoemInput({ references: [{ source: 'desconhecida' }] }),
        ),
      },
    })
    expect(r.issues.map((i) => i.message)).toContainEqual(expect.stringContaining('desconhecida'))
  })

  it('bloqueia publicação baseada em fonte restrita', () => {
    const input = makePoemInput()
    input.translation!.kind = 'relay-translation'
    input.translation!.basedOn = { source: 'restrita' }
    const r = loadContent({
      sources: sourcesYaml,
      poems: { 'content/poetry/gazal/gazal-0001.yml': file(input) },
    })
    expect(r.issues.map((i) => i.path)).toContain('translation.basedOn')
  })
})
