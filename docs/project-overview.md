# Visão geral do projeto

**Jardim de Rumi** (باغ مولانا) é uma plataforma brasileira dedicada à obra de Rumi (Mowlana Jalal
al-Din Mohammad Balkhi, 1207–1273): o **Masnavi** e o **Divã de Shams**, em persa e em português.
O público são leitores de língua portuguesa — inclusive quem nunca teve contato com literatura
persa ou sufismo, e quem só conhece Rumi por frases soltas na internet.

É um projeto irmão do Jardim de Hafez: mesma base de código, mesmo método editorial.

## O que o site oferece

| Seção                                                                     | Rota                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| Início                                                                    | `/`                                                     |
| Masnavi (biblioteca do Masnavi: busca, filtro por livro, mapa das seções) | `/masnavi`                                              |
| Divã de Shams (gazéis, rubaiyat, tarji‘-bands)                            | `/diva-de-shams`                                        |
| Página de um texto (persa, português, modo estudo, notas, créditos)       | `/<obra>/<categoria>/<número>`                          |
| O Poeta (biografia com selos fato / hipótese / tradição)                  | `/o-poeta`                                              |
| Arte Persa (galeria Met Open Access)                                      | `/arte-persa`                                           |
| Glossário, Como traduzimos, Sobre, Créditos                               | `/glossario`, `/como-traduzimos`, `/sobre`, `/creditos` |

## Princípios

1. **A poesia é o centro.** Nada de frases motivacionais nem “Rumi de autoajuda”.
2. **Rumi de verdade.** Só entra o que está no texto persa; o contexto islâmico e sufi não é apagado.
3. **Rigor editorial.** Traduções preliminares (IA) sempre com aviso; publicação verificada só com
   revisão humana (ADR 0006).
4. **Fontes verificáveis** e **respeito a direitos autorais** (ver `copyright-and-sources.md`).
5. **Acessibilidade e legibilidade** acima de efeitos visuais.

## Como rodar

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm check               # lint + formatação + tipos + testes + validação do acervo
pnpm generate            # site estático em .output/public
```

Para ver rascunhos localmente (nunca em produção):

```bash
NUXT_EDITORIAL_PREVIEW=true NUXT_PUBLIC_EDITORIAL_PREVIEW=true pnpm dev
```

Ferramentas de acervo:

```bash
pnpm import:ganjoor --category masnavi-2 --from 1 --to 20   # importa texto persa como "pending"
pnpm content:next             # próximos pendentes
pnpm content:validate         # valida content/ e mostra o painel editorial
```
