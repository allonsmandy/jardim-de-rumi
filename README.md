# Jardim de Rumi · باغ مولانا

Plataforma brasileira para ler Rumi (Mowlana Jalal al-Din Mohammad Balkhi, 1207–1273) em persa e
em português: o **Masnavi** e o **Divã de Shams**, traduzidos direto do persa e explicados verso a
verso para quem nunca leu poesia persa. Projeto irmão do Jardim de Hafez.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # lint, formatação, tipos, testes e validação do acervo
pnpm generate     # site estático em .output/public
```

Requisitos: Node ≥ 22.12 e pnpm 11.

- Conteúdo (traduções, glossário, fontes): veja [`AGENTS.md`](AGENTS.md).
- Documentação em [`docs/`](docs/): visão geral, arquitetura, design system, modelo de conteúdo,
  fluxo de tradução, direitos e fontes, plano de implementação e decisões (ADRs).
