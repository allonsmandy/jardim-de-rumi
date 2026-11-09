# Plano de implementação

Legenda: ✅ concluído e verificado · 🟡 parcial · ⬜ não iniciado

## Fase 00 — Fundação (herdada do Jardim de Hafez) ✅

- ✅ Nuxt 4, TypeScript strict, Tailwind 4, ESLint, Prettier, Vitest, schemas Zod, API JSON
  pré-renderizada, validação do acervo, design system, glossário clicável, modo estudo.

## Fase 01 — Adaptação para Rumi ✅

- ✅ Modelo de obras: Masnavi (6 livros, uma categoria por livro, uma página por seção, com
  `sectionTitle`) e Divã de Shams (gazéis, rubaiyat, tarji‘-bands). Ids com 4 dígitos.
- ✅ Rotas `/masnavi/livro-N/S` e `/diva-de-shams/<categoria>/N`; biblioteca por obra, com mapa
  de progresso (livros do Masnavi; gazéis do Divã).
- ✅ Importador do Ganjoor para as duas obras (inclui o título da seção do Masnavi e o refrão
  dos tarji‘-bands).
- ✅ Páginas: início, O Poeta (biografia com selos), Sobre, Como traduzimos, Créditos, Glossário
  (41 termos), Arte Persa (8 obras do Met Open Access). Sem Fal (tradição exclusiva de Hafez).
- ✅ AGENTS.md para o Codex.

## Fase 02 — Primeiras traduções ⬜

- ⬜ Masnavi, livro I, seção 1 (“Canção da flauta”) — padrão de qualidade do projeto.
- ⬜ Restante do livro I, em ordem; primeiros gazéis do Divã.
- ⬜ Conferir a concordância de numeração (Nicholson para o Masnavi, Forouzanfar para o Divã).

## Fase 03 — Acervo ⬜

- ⬜ Importar livros II–VI do Masnavi, o restante do Divã e os tarji‘-bands.
- ⬜ Página “Isso é mesmo Rumi?”: frases populares atribuídas a Rumi × o que o persa diz.

## Fase 04 — Finalização ⬜

- Revisão visual com a proprietária (identidade própria do Rumi: cores, ornamentos, ícone),
  imagem Open Graph, auditoria de acessibilidade, domínio e deploy, CI com `pnpm check`.

## Perguntas abertas para a proprietária

1. **Revisores e correções:** quem revisa as traduções preliminares e qual o canal de correções?
2. **Identidade visual:** manter a paleta do Jardim de Hafez ou criar uma própria (ex.: o
   turquesa da cúpula de Konya)?
3. **Domínio** definitivo e **hospedagem**.
4. **Ordem do acervo:** traduzir o Masnavi em ordem ou escolher histórias famosas primeiro?
