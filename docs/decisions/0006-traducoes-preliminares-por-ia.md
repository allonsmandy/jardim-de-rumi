# ADR 0006 — Traduções preliminares feitas por IA, publicadas com aviso

**Status:** aceita · 2026-11-07 no Jardim de Hafez · herdada pelo Jardim de Rumi em 2026-11-08 (a confirmar pela proprietária)

## Contexto

Ainda não há equipe de tradutores. No projeto irmão (Jardim de Hafez), a proprietária pediu que a
IA traduzisse os poemas diretamente do persa, com explicações completas, para que o acervo possa ser lido desde já, e que a
comunidade contribua depois com correções.

## Decisão

- Novo nível de publicação `authorization.level: preliminary`, além de `verified`.
- Requisitos do nível preliminar: tradução presente (status `draft`/`review`), mesmo número de
  estrofes do original, texto persa e autorização registrada.
- O tradutor é registrado pelo nome do modelo — no Jardim de Rumi, "Codex (IA, OpenAI)" — com
  `machineAssisted: true`, nunca como pessoa.
- Aviso visível em todos os lugares onde a tradução aparece (página do poema, cartões, página inicial), com link
  para `/como-traduzimos`; a cópia de versos inclui "(preliminar)" no crédito.
- Cada poema traz introdução, explicação por dístico (literal, sentido, escolhas) e glossário.
- O nível `verified` continua exigindo revisão humana e aprovação.

## Consequências

- Ganho: o site tem conteúdo legível imediatamente, com transparência total sobre a origem.
- Risco: erros de interpretação publicados; mitigado pelo aviso e pelo fluxo de correção.
- Pendência: o canal para envio de correções ainda precisa ser definido.
