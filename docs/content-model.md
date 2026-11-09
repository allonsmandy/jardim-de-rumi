# Modelo de conteúdo

Schema oficial: `shared/schemas/poem.ts` (Zod). Fontes: `shared/schemas/source.ts`.

## Arquivo de poema

`content/poetry/<categoria>/<categoria>-NNNN.yml` — o nome do arquivo deve ser igual ao `id`.

No Masnavi, cada arquivo é **uma seção** de um livro (`masnavi-1` … `masnavi-6`), com o título em
prosa da seção em `sectionTitle`.

```yaml
id: masnavi-1-0001 # <categoria>-<número com 4 dígitos>
category: masnavi-1 # masnavi-1…masnavi-6 | gazal | rubai | tarji
number: 1 # numeração do Ganjoor (seção do livro, ou número do poema no Divã)
editorialTitle: # opcional; sempre exibido como "título editorial"
sectionTitle: # só no Masnavi: o título em prosa da seção
  fa: سرآغاز
  pt: ... # opcional (tradução); quando existe, vira o título da página
firstLine:
  fa: بشنو این نی چون شکایت می‌کند
  pt: ... # opcional (primeiro verso traduzido)
original:
  language: fa
  stanzas: [[hemistíquio 1, hemistíquio 2], ...] # 1 estrofe = 1 dístico (bayt)
  edition: ganjoor # id em sources.yml
  transcription:
    {
      source: ganjoor,
      locator: 'Masnavi, livro I, seção 1',
      url: https://ganjoor.net/moulavi/masnavi/daftar1/sh1,
    }
translation: # obrigatório se status ≠ pending
  language: pt-BR
  kind: translation # translation | relay-translation | adaptation
  basedOn: { source: ... } # obrigatório para relay-translation e adaptation
  stanzas: [[...], ...] # alinhadas ao original (obrigatório quando aprovada)
  translators: [Nome]
  reviewers: [Nome] # ≥ 1 quando aprovada
  reviewedAt: 2026-01-10 # obrigatório quando aprovada
  notes: [...] # notas de tradução
  machineAssisted: false # rascunho com auxílio de IA
translationStatus: pending # pending | draft | review | approved
publicationAuthorized: false
authorization:
  { level: verified, by: Nome, at: 2026-01-11, basis: Tradução original do projeto }
  # level: verified | preliminary (ver ADR 0006)
concordance: { nicholson: '1–34' } # opcional: numeração em outras edições (Nicholson, Forouzanfar)
references: [{ source: ganjoor, locator: 'Masnavi, livro I, seção 1' }]
introduction: [parágrafo, ...] # apresentação do poema para iniciantes
stanzaNotes: # explicação dístico a dístico (stanza começa em 1)
  - stanza: 1
    literal: tradução palavra por palavra
    meaning: o que significa, com contexto cultural
    choices: por que foi traduzido assim
glossary: [ney, masnavi] # ids de content/glossary.yml
culturalNotes: [{ title: A flauta, body: ..., sources: [{ source: ... }] }]
editorialNotes: [...]
updatedAt: 2026-11-07
```

## Regras de consistência (schema)

- `id` = `categoria-NNNN` (4 dígitos, ver `poemId`); arquivo = `id.yml`.
- Status diferente de `pending` exige `translation`.
- `approved` exige revisor, data de revisão e o mesmo número de estrofes do original.
- `publicationAuthorized: true` exige status `approved` e bloco `authorization`.
- Tradução indireta ou adaptação exige `basedOn`.

## Regras de acervo (`loadContent`)

- Sem duplicatas de categoria+número; alerta para primeiro verso repetido (duplicata entre edições).
- Toda fonte citada existe em `sources.yml`.
- Poema autorizado não pode se basear em fonte com `usableForPublication: false`
  (inclui a transcrição do texto persa).

## Regra de publicação (`shared/utils/publication.ts`)

Um poema é **publicado** (biblioteca, página, sitemap) em um de dois níveis:

- **verificado** (`level: verified`): status `approved`, revisão humana, autorização e texto persa;
- **preliminar** (`level: preliminary`): tradução em `draft`/`review` (ex.: feita por IA), autorização
  registrada e texto persa. Aparece sempre com o aviso “Tradução preliminar” (ADR 0006).
  Qualquer outra situação → invisível em produção (404). A prévia editorial local mostra tudo com aviso
  e `noindex`.

## Obras, categorias e rotas

Configuradas em `shared/utils/categories.ts`. A rota é `/<obra>/<categoria>/<número>`.

| obra    | id            | rota                        | rótulo de uma peça | total (Ganjoor)              |
| ------- | ------------- | --------------------------- | ------------------ | ---------------------------- |
| masnavi | masnavi-1 … 6 | `/masnavi/livro-N/S`        | Livro I, seção S   | 172, 115, 228, 139, 178, 140 |
| shams   | gazal         | `/diva-de-shams/gazeis/N`   | Gazel N            | 3.230                        |
| shams   | rubai         | `/diva-de-shams/rubaiyat/N` | Rubai N            | 1.994                        |
| shams   | tarji         | `/diva-de-shams/tarjis/N`   | Tarji‘-band N      | 44                           |

## Glossário

`content/glossary.yml`: `id`, `term`, `termFa`, `transliteration`, `definition`. Cada poema lista os
termos relevantes em `glossary`; o validador garante que existam. Página: `/glossario`.
