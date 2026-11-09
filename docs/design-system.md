# Design system

## Conceito

"Cúpula de Konya": uma edição literária contemporânea com a memória do túmulo de Rumi e da
cerimônia dos dervixes giradores. Papel marfim, tinta escura, os azulejos turquesa da Cúpula
Verde, a noite azul-lápis, o feltro caramelo dos chapéus dos dervixes e o ouro dos manuscritos.

Motivos (componentes em `app/components/common/`):

- `SemaRings` — anéis do samâ‘ girando em sentidos opostos, com dervixes vistos de cima (saia e
  chapéu) rodando em torno de si e do centro; no meio, a estrela seljúcida de oito pontas.
- `KonyaDome` — silhueta da Cúpula Verde (tambor e cone canelados).
- `OrnamentDivider` — a flauta de junco (ney) deitada, com nós e furos.
- Juncos do canavial (neyestan) balançando nas laterais da abertura da página inicial.
- `NightAmbient` — estrelas e pequenos anéis subindo, girando.

## Cores (`app/assets/css/main.css`, `@theme`)

| Token            | Hex     | Uso                                          | Contraste sobre marfim |
| ---------------- | ------- | -------------------------------------------- | ---------------------- |
| `ivory`          | #F6F3EC | Fundo                                        | —                      |
| `paper`          | #ECE7DC | Superfícies, faixas                          | —                      |
| `line`           | #DCD5C6 | Bordas e divisores                           | decorativo             |
| `turquoise`      | #13656B | Marca, links, botões                         | 6,1:1 (AA)             |
| `turquoise-deep` | #0D4C51 | Hover                                        | 8,7:1 (AAA)            |
| `lapis`          | #173550 | Persa em leitura paralela, foco, rótulos     | 11,4:1 (AAA)           |
| `night`          | #0B1B2A | Fundos noturnos                              | —                      |
| `gold`           | #B8954F | **Somente** ornamentos                       | não usar em texto      |
| `tile`           | #A6E3DD | Destaques sobre fundos escuros e turquesa    | ≥ 4,7:1 sobre turquesa |
| `felt`           | #A57A4C | **Somente** ornamentos (feltro dos dervixes) | não usar em texto      |
| `ink`            | #22262A | Texto                                        | 13,7:1                 |
| `ink-muted`      | #535A60 | Texto secundário                             | 6,3:1 (AA)             |

Modo escuro: não previsto na v1 (decisão de produto pendente).

## Tipografia

| Papel                | Fonte              | Motivo                                                                            |
| -------------------- | ------------------ | --------------------------------------------------------------------------------- |
| Títulos              | Cormorant Garamond | Serifada editorial de alto contraste, elegante em tamanhos grandes                |
| Texto longo e versos | Literata           | Desenhada para leitura longa em tela; ótima cobertura de diacríticos do português |
| Persa                | Noto Naskh Arabic  | Naskh tradicional, legível, suporte completo ao persa (پ چ ژ گ ی ک) e aos harakat |

Fontes auto-hospedadas via Fontsource (sem requisição a terceiros; `unicode-range` faz o navegador
baixar só os subconjuntos usados). Licença SIL OFL.

Persa: `[lang='fa']` aplica Naskh, `line-height: 2.1` (espaço para diacríticos) e sem `letter-spacing`
(que quebraria as ligaduras). Sempre usar `<PersianText>` ou `lang="fa" dir="rtl"`; em texto misto,
`unicode-bidi: isolate` evita que números e pontuação “pulem”.

## Componentes base

- Utilitários: `container-editorial` (6xl), `container-reading` (3xl), `eyebrow`, `btn-primary`,
  `btn-secondary`, `btn-quiet`.
- `PageIntro`, `EmptyState`, `LoadingState`, `OrnamentDivider`, `PersianText`.
- `PoemReader`: modos `paralelo` (persa ao lado, empilha no celular), `portugues`, `persa`; a escolha
  fica salva no navegador.

## Movimento

Transições curtas (`--ease-garden`). Com
`prefers-reduced-motion: reduce`, todas as animações são anuladas.

## Acessibilidade

Link “Pular para o conteúdo”, foco visível (`cypress`), alvos de toque ≥ 40px, landmarks
(`header/nav/main/footer`), `aria-live` em resultados de busca e ações, `aria-pressed` em favoritos,
menu móvel com `aria-expanded` e Esc.

## Ritmo visual (revisão de 2026-11-07)

Para textos longos não cansarem, as páginas alternam **faixas**: marfim (leitura), papel (destaques),
azul-lápis (guias e curiosidades, texto marfim) e turquesa (chamadas). Elementos:

- `PersianArch`: moldura em arco ogival (portais persas) no topo da página inicial e dos poemas.
- `PoemHero`: medalhão em estrela de oito pontas com o número em algarismos persas + temas em pílulas.
- `BeginnerGuide`: "Como ler Rumi" em quatro cartões (pode ser fechado; lembrado no navegador).
- `PoemStudy` (modo **Estudar**, padrão): um cartão por dístico — versos em faixa de papel, bloco
  rosado "Em palavras simples", "Por trás das palavras" e um recolhível "Para quem quer se aprofundar".
- Modo **Só ler**: o poema inteiro numa folha contínua, sem notas.

## Glossário em todo o site

Qualquer texto passado por `<GlossaryText>` tem os termos do glossário (campo `aliases`) sublinhados
em pontilhado dourado; ao tocar, abre o modal global `GlossaryDialog` (`<dialog>` nativo: foco
preso, Esc fecha, clique fora fecha) com a explicação curta (`short`) e "Saber mais" (`definition`).
Cada termo é marcado só na primeira ocorrência de cada bloco de texto.
