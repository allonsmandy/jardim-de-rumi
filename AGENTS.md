# Jardim de Rumi — guia para agentes de conteúdo (Codex)

Site brasileiro para ler Rumi (Mowlana Jalal al-Din Mohammad Balkhi, poeta persa, 1207–1273) em
persa e português, com explicações para **quem nunca leu poesia persa**. Nuxt 4 + YAML validado
por Zod. Projeto irmão do Jardim de Hafez, com o mesmo método.

> **Seu trabalho é só o TEXTO.** O design, os componentes, as páginas e as rotas estão prontos.
> Um texto novo aparece sozinho no site assim que o YAML dele estiver completo e válido.

---

## 1. O que você pode e o que não pode editar

| Pode editar                           | Para quê                                                  |
| ------------------------------------- | --------------------------------------------------------- |
| `content/poetry/<categoria>/<id>.yml` | Traduzir e explicar (o grosso do trabalho)                |
| `content/glossary.yml`                | **Acrescentar** termos novos (não apagar nem renomear id) |
| `content/sources.yml`                 | **Acrescentar** fontes consultadas, com direitos          |

**Não edite** `app/`, `server/`, `shared/`, `scripts/`, `public/`, `nuxt.config.ts`, CSS, nem os
arquivos de configuração. Se achar que o site precisa de uma mudança de código para exibir algo,
**pare e descreva o problema** em vez de mexer — a proprietária faz isso com outra ferramenta.

Nunca altere o bloco `original` (texto persa) nem `sectionTitle.fa` para "corrigir" o persa. Se
suspeitar de erro na transcrição, registre em `editorialNotes`.

---

## 2. As duas obras e onde estão os arquivos

O persa vem do Ganjoor (transcrição Wikidorj). Cada texto ainda não traduzido é um arquivo com
`translationStatus: pending` — ele não aparece no site até ser traduzido. Ids e nomes de arquivo
usam **4 dígitos**: `gazal-0012`, `masnavi-1-0001`.

### Masnavi (`/masnavi`) — o grande poema narrativo, em 6 livros

Cada livro (daftar) é uma categoria; cada arquivo é **uma seção** do livro, aberta por um título
em prosa (`sectionTitle.fa`, já importado).

| Categoria   | Pasta                       | Seções | Rota no site         |
| ----------- | --------------------------- | ------ | -------------------- |
| `masnavi-1` | `content/poetry/masnavi-1/` | 172    | `/masnavi/livro-1/N` |
| `masnavi-2` | `content/poetry/masnavi-2/` | 115    | `/masnavi/livro-2/N` |
| `masnavi-3` | `content/poetry/masnavi-3/` | 228    | `/masnavi/livro-3/N` |
| `masnavi-4` | `content/poetry/masnavi-4/` | 139    | `/masnavi/livro-4/N` |
| `masnavi-5` | `content/poetry/masnavi-5/` | 178    | `/masnavi/livro-5/N` |
| `masnavi-6` | `content/poetry/masnavi-6/` | 140    | `/masnavi/livro-6/N` |

### Divã de Shams (`/diva-de-shams`) — a poesia lírica

| Categoria | Pasta                   | Qtd.  | Rota no site                | O que é                       |
| --------- | ----------------------- | ----- | --------------------------- | ----------------------------- |
| `gazal`   | `content/poetry/gazal/` | 3.230 | `/diva-de-shams/gazeis/N`   | Poema lírico de rima única    |
| `rubai`   | `content/poetry/rubai/` | 1.994 | `/diva-de-shams/rubaiyat/N` | Quadra: 4 versos = 2 dísticos |
| `tarji`   | `content/poetry/tarji/` | 44    | `/diva-de-shams/tarjis/N`   | Poema em estrofes com refrão  |

Já importados: Masnavi livro I inteiro, gazéis 1–100 e rubaiyat 1–100. Para importar mais:

```bash
pnpm import:ganjoor --category masnavi-2 --from 1 --to 20
pnpm import:ganjoor --category gazal --from 101 --to 150
```

**Ordem de trabalho:** comece pelo **Masnavi, livro I, seção 1** (a "Canção da flauta"). Ela é a
porta de entrada do site e vira o **padrão de qualidade** de todo o resto. Depois siga o livro I em
ordem e, em paralelo, os primeiros gazéis.

Para ter uma ideia do tom, da profundidade e do formato esperados, leia um poema pronto do projeto
irmão: `../jardim-de-hafez/content/poetry/gazal/gazal-001.yml`.

---

## 3. Passo a passo para traduzir

Partindo de um arquivo `pending`, **acrescente** os blocos abaixo (o modelo completo está em
`docs/templates/poema-traduzido.yml`). Não apague o que já existe.

1. **`firstLine.pt`** — o primeiro verso traduzido (sem pontuação final).
2. **Masnavi: `sectionTitle.pt`** — a tradução do título em prosa da seção (ele vira o título da
   página). Mantenha `sectionTitle.fa` como está.
3. **`translation`** — a tradução, verso a verso:
   ```yaml
   translation:
     language: pt-BR
     kind: translation
     stanzas: # MESMO número de estrofes e de versos que original.stanzas
       - - primeiro hemistíquio,
         - segundo hemistíquio.
     translators:
       - Codex (IA, OpenAI)
     reviewers: []
     notes:
       - Tradução preliminar feita por IA a partir do texto persa, sem rima, priorizando sentido,
         imagens e ambiguidades. Ver /como-traduzimos.
     machineAssisted: true
   ```
4. **Status e publicação** (é o que faz o texto aparecer no site, com o aviso de "preliminar"):
   ```yaml
   translationStatus: draft
   publicationAuthorized: true
   authorization:
     level: preliminary
     by: Proprietária do projeto
     at: AAAA-MM-DD # data de hoje
     basis: Publicação como tradução preliminar por IA, aberta a correções, autorizada pela proprietária.
   ```
5. **`themes`** — 2 a 4 temas curtos, em linguagem de gente ("A saudade de casa").
6. **`introduction`** — 2 a 3 parágrafos para leigos: do que o trecho fala, por que importa, uma
   curiosidade. No Masnavi, situe a seção na história maior ("continua a história do rei e da
   criada, começada na seção 2").
7. **`stanzaNotes`** — **um item para cada estrofe** (`stanza` começa em 1), com:
   - `plain` (obrigatório) — **"Em palavras simples"**: a ideia do dístico como se explicasse a um
     amigo de 15 anos. Uma ou duas frases. Sem metáfora nova, sem termos técnicos.
   - `meaning` (obrigatório) — **"Por trás das palavras"**: imagens, costumes, lendas, alusões ao
     Alcorão, leitura amorosa e leitura mística. É aqui que entra o contexto.
   - `literal` (recomendado) — tradução palavra a palavra, com `/` separando os hemistíquios e
     colchetes para o que é acréscimo ou mudança de língua.
   - `choices` (recomendado) — por que traduziu assim: palavras persas difíceis (transliteradas
     entre aspas), alternativas descartadas, ambiguidades que você preservou.
8. **`glossary`** — ids de `content/glossary.yml` dos termos que aparecem no texto.
9. **`culturalNotes`** — 1 a 3 notas sobre o texto inteiro (lenda, recepção, forma), cada uma com
   `title`, `body` e, se for afirmação histórica, `sources`.
10. **`updatedAt`** — data de hoje.
11. Rode `pnpm content:validate` e `pnpm format`. Abra `pnpm dev` e confira a página.

---

## 4. Como traduzir

- **Direto do persa**, verso a verso, **sem rima**. Fidelidade ao sentido, às imagens e ao tom.
- **Preserve as ambiguidades** em vez de resolvê-las: o amado pode ser Shams, uma pessoa ou Deus;
  o vinho pode ser vinho ou êxtase. No verso fica a ambiguidade; a explicação vai para `meaning`.
- **Não apague o Islã.** Rumi foi um sábio muçulmano e mestre sufi; o Masnavi cita e comenta o
  Alcorão e os hadiths o tempo todo. Traduza "kofr" e "eslām", "namâz", "Mostafâ" etc. como estão
  e explique. Muitas versões ocidentais famosas tiraram esse contexto — aqui não.
- Português do Brasil, registro literário mas claro. Tratamento "tu" para o amado, para Deus e
  para o interlocutor, como no Jardim de Hafez. Evite arcaísmos gratuitos.
- Não acrescente o que não está no original. Não transforme o poema em frase de autoajuda.
- Versos ou expressões em **árabe** (frequentes no Masnavi): traduza e registre em `choices` que
  mudou de língua; se for citação do Alcorão, indique a sura e o versículo em `meaning`.
- **Assinatura:** Rumi quase nunca usa o próprio nome. No fim dos gazéis, aparece **Shams de
  Tabriz** (às vezes só "Shams" ou "Shams al-Haqq") ou a palavra **"khâmush"** ("silêncio!").
  Mantenha "Shams" e traduza "khâmush" por "silêncio"/"cala-te", explicando o recurso.
- No **Masnavi**, Rumi fala com **Hosam al-Din** (o discípulo a quem o livro é dedicado) e às vezes
  interrompe a história para comentar. Indique isso em `meaning` para o leitor não se perder.
- Hemistíquio que comece com aspas, dois-pontos ou caractere especial precisa estar entre aspas
  simples no YAML.

### Particularidades por categoria

- **masnavi-N**: uma seção pode ter de 5 a 100+ dísticos. Seções longas: trabalhe em partes e
  valide no meio. A introdução deve dizer em que história a seção está e o que aconteceu antes.
  Nunca invente numeração de versos de outras edições; se citar Nicholson, confira.
- **gazal**: muitos gazéis do Divã de Shams são longos e repetitivos de propósito (eram cantados).
  Mantenha as repetições e o refrão (radif).
- **rubai**: 2 estrofes de 2 versos. Na introdução, explique que o rubai é uma quadra e que muitos
  rubaiyat atribuídos a Rumi circularam soltos, então a autoria de cada um é menos segura.
- **tarji**: o dístico-refrão volta entre as estrofes; traduza-o sempre do mesmo jeito.

---

## 5. Como explicar (o mais importante)

O leitor nunca ouviu falar de Rumi a sério, de sufismo ou do mundo persa medieval — mas talvez já
tenha visto "frases de Rumi" na internet.

- **Comece simples, aprofunde depois**: `plain` → `meaning` → `literal`/`choices`.
- Toda palavra estranha (dervixe, samâ‘, Alcorão, gazel, Shams…) precisa estar no glossário. No
  site, os termos com `aliases` viram links que abrem um balão explicativo — então **não** escreva
  definições longas dentro das notas; use o termo e garanta que ele esteja no glossário.
- **Fato ≠ lenda.** Quase todas as histórias famosas sobre Rumi e Shams (os livros jogados na
  água, o assassinato de Shams, o encontro com Attar, o giro no mercado dos ourives) vêm de
  hagiografias posteriores, sobretudo Aflaki. Sempre: "conta a tradição", "segundo a lenda".
  Nunca invente datas, nomes ou citações.
- **Frases falsas:** se um verso for a origem de uma "citação de Rumi" famosa em inglês ou
  português, você pode dizer isso numa `culturalNote` — mostrando o que o persa realmente diz.
  Nunca reproduza a versão protegida (Barks etc.); descreva-a.
- Frases curtas. Parágrafos de no máximo ~5 linhas.

### Glossário (`content/glossary.yml`)

Antes de criar um termo, procure se já existe (há ~41). Para criar:

```yaml
- id: kebab-case-sem-acento
  term: Nome em português
  termFa: نام فارسی
  transliteration: transliteração
  short: Uma ou duas frases, sem jargão — aparece no balão.
  definition: >-
    Explicação completa, 3 a 6 frases, para a página /glossario.
  aliases: [formas exatas, plural, Maiúscula]
```

`aliases` são destacados **automaticamente em todo o site**: use só formas inconfundíveis (nunca
palavras comuns como "amor", "taça", "noite").

---

## 6. Direitos e fontes — regras que não se quebram

- O texto persa vem do Ganjoor (dados abertos). **Nunca** copie comentários, resumos ou
  explicações do Ganjoor.
- **Proibido** usar como base, parafrasear ou copiar traduções e versões modernas protegidas:
  **Coleman Barks** (não é tradução — são reescritas em inglês), A. J. Arberry, Jawid Mojaddedi,
  Kabir Helminski, Shahram Shiva, Daniel Ladinsky, e quaisquer traduções brasileiras ou
  portuguesas modernas.
- Em domínio público e consultáveis: **R. A. Nicholson** (Masnavi 1925–40; Divani Shamsi Tabriz 1898) e **E. H. Whinfield** (1887/1898).
- A edição de **Forouzanfar** do Divã é protegida: use só para conferir numeração.
- Toda fonte citada em `sources:` deve existir em `content/sources.yml`. Para incluir uma nova,
  registre a situação de direitos com honestidade (`restricted` se for obra moderna).
- O tradutor é sempre registrado como `Codex (IA, OpenAI)` — nunca como pessoa, nunca omitido.

---

## 7. Comandos

```bash
pnpm content:next              # próximos textos pendentes (use --category masnavi-1, --count 20)
pnpm content:validate          # valida tudo; mostra o painel por categoria e status
pnpm format                    # formata os YAML (Prettier)
pnpm dev                       # site local em http://localhost:3000
pnpm check                     # lint + formato + tipos + testes + validação (rode antes de commitar)
pnpm import:ganjoor --category <categoria> --from N --to N   # importa mais texto persa
```

Trabalhe em **lotes de 5 a 10 textos**. Um commit por lote, mensagem em português, por exemplo:
`conteúdo: traduz Masnavi I, seções 1–5 (preliminar, Codex)`.

---

## 8. Checklist antes de dar um texto por pronto

- [ ] `translation.stanzas` tem o mesmo número de estrofes **e de versos** que `original.stanzas`
- [ ] `translators: [Codex (IA, OpenAI)]`, `machineAssisted: true`
- [ ] `translationStatus: draft`, `publicationAuthorized: true`, `authorization.level: preliminary`
- [ ] `firstLine.pt`, `themes`, `introduction` preenchidos (e `sectionTitle.pt`, no Masnavi)
- [ ] uma `stanzaNote` com `plain` e `meaning` para **cada** estrofe
- [ ] termos difíceis no `glossary` do texto e em `content/glossary.yml`
- [ ] lendas marcadas como lendas; nenhuma fonte protegida usada; contexto islâmico preservado
- [ ] `updatedAt` com a data de hoje
- [ ] `pnpm content:validate` sem erros e página conferida no `pnpm dev`

Documentação de apoio: `docs/translation-workflow.md`, `docs/content-model.md`,
`docs/copyright-and-sources.md`, `docs/decisions/0006-traducoes-preliminares-por-ia.md`.
