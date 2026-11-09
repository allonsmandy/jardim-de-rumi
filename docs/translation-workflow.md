# Fluxo editorial de tradução

> **Situação atual (2026-11-08):** o texto persa do Masnavi (livro I inteiro) e do Divã de Shams
> (gazéis e rubaiyat 1–100) está importado como `pending`. As traduções são feitas pelo Codex
> (OpenAI), creditado como `Codex (IA, OpenAI)`, e publicadas como **preliminares** com aviso
> (ADR 0006). O guia operacional está em `AGENTS.md`. Para torná-las verificadas: um(a)
> revisor(a) corrige, registra `reviewers`/`reviewedAt`, muda o status para `approved` e a
> autorização para `level: verified`.

```text
pending ──▶ draft ──▶ review ──▶ approved ──▶ (autorização) ──▶ publicado
  texto      tradução   revisão    revisão       registro de        visível no site
  persa      de trabalho literária  concluída     quem/quando/base   e no sitemap
```

| Etapa             | Quem                                                     | O que registrar no YAML                                                                    |
| ----------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1. Texto original | Editor(a)                                                | `original` com edição e transcrição; conferir com a edição impressa                        |
| 2. Rascunho       | Tradutor(a)                                              | `translation.stanzas`, `translators`, `kind`, `notes`; `machineAssisted: true` se houve IA |
| 3. Revisão        | Revisor(a) com domínio do persa e do português literário | correções, `notes` sobre ambiguidades preservadas                                          |
| 4. Aprovação      | Revisor(a)                                               | `reviewers`, `reviewedAt`, status `approved`                                               |
| 5. Autorização    | Responsável editorial (proprietária)                     | `publicationAuthorized: true` + `authorization {by, at, basis}`                            |

## Diretrizes de tradução

- Fidelidade ao sentido, às imagens e ao registro; preservar ambiguidades (amado humano/divino,
  vinho literal/místico) em vez de explicá-las no verso — a explicação vai para `culturalNotes`.
- Manter a estrutura de dísticos (um par de versos por bayt) para a leitura paralela.
- Não transformar versos em mensagens de autoajuda nem acrescentar o que não está no original.
- Versões e traduções modernas protegidas (Barks, Arberry, Mojaddedi…) **não** podem ser base de
  tradução. Traduções em domínio público (Nicholson, Whinfield) podem ser consultadas; se uma
  versão for feita a partir delas, usar `kind: relay-translation` e `basedOn`.
- Não apagar o contexto islâmico: alusões ao Alcorão e aos hadiths são traduzidas e explicadas.
- Traduções feitas por IA são registradas com o nome do modelo (`Claude (IA, Anthropic)`,
  `Codex (IA, OpenAI)`) e `machineAssisted: true`, publicadas só como `preliminary` (ADR 0006).
  Nunca passam a `approved` sem revisão humana.

## Convenções de grafia (pt-BR)

Rumi · Mowlana · Konya · Balkh · Shams de Tabriz · Hosam al-Din · Sultan Valad · Masnavi · Divã de
Shams · gazel / gazéis · rubai / rubaiyat · tarji‘-band · ney (flauta de junco) · samâ‘ · khâmush
(silêncio) · sufismo, sufi · dervixe · Mevlevi. Termos persas em itálico na primeira ocorrência,
com explicação.

## Lotes

Importe mais texto persa conforme a necessidade (`pnpm import:ganjoor --category <cat> --from N --to M`).
Trabalhar em lotes de 5 a 10 poemas: `pnpm content:next` mostra os próximos pendentes;
`pnpm content:validate` mostra o painel por status. Modelo: `docs/templates/poema-traduzido.yml`.

## Formato das explicações

Cada poema traduzido deve ter:

1. `introduction` — 2 a 3 parágrafos: tema, forma, contexto, fama do poema.
2. `stanzaNotes` — para cada dístico: `literal` (palavra por palavra), `meaning` (sentido e contexto
   cultural, para quem não conhece nada da cultura persa) e `choices` (por que foi traduzido assim).
3. `glossary` — termos recorrentes, ligados a `content/glossary.yml`.
4. `culturalNotes` — temas do poema inteiro (lendas, recepção), com fontes; lendas sempre
   identificadas como lendas.
