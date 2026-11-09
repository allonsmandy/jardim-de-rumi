# Direitos autorais e fontes

> Este documento registra a análise técnica-editorial feita para o projeto. **Não é parecer jurídico.**
> Decisões que dependam de interpretação legal devem ser confirmadas por profissional habilitado.

## Texto persa

A obra de Rumi (século XIII) está em domínio público. A transcrição digital vem do **Ganjoor**
(`ganjoor.net/moulavi`), cujo texto do Masnavi e do Divã de Shams foi digitado pelo projeto
Wikidorj (ویکی‌درج). O Ganjoor é não comercial e publica o acervo como banco de dados livre para
trabalhos semelhantes. Importamos só o texto dos versos, a numeração e os títulos das seções do
Masnavi, com crédito e link — nunca comentários, resumos ou leituras do site.

### Numeração

- **Masnavi:** seguimos as seções do Ganjoor (livro + número da seção). A numeração de versos
  mais citada no meio acadêmico é a de Nicholson; correspondências podem ir em `concordance`,
  sempre conferidas.
- **Divã de Shams:** seguimos a numeração do Ganjoor. A edição crítica de referência é a de
  Forouzanfar (protegida): pode ser usada só para conferir a correspondência, nunca reproduzida.

## Traduções

| Fonte                                                      | Situação                      | Uso permitido                                  |
| ---------------------------------------------------------- | ----------------------------- | ---------------------------------------------- |
| Traduções do projeto (IA, preliminares)                    | Autorizadas pela proprietária | Publicação com aviso de preliminar (ADR 0006)  |
| R. A. Nicholson, Masnavi (1925–1940)                       | Domínio público no Brasil¹    | Consulta, notas, conferência                   |
| R. A. Nicholson, Divani Shamsi Tabriz (1898)               | Domínio público               | Consulta, notas, conferência                   |
| E. H. Whinfield (1887/1898)                                | Domínio público               | Consulta, comparação                           |
| Coleman Barks                                              | Protegida; não é tradução     | Só como objeto de explicação (“frases falsas”) |
| A. J. Arberry, J. Mojaddedi, K. Helminski, outras modernas | Protegidas                    | Somente referência bibliográfica               |

¹ Nicholson morreu em 1945; pela regra brasileira (vida + 70 anos), domínio público desde 2016.
Em outros países a situação pode variar.

## Imagens (`content/art.yml`)

- Todas as obras vêm do **Metropolitan Museum of Art — Open Access** (CC0), fonte `met-open-access`.
- Dados conferidos na API oficial do museu em 2026-11-08: domínio público, título original, data,
  lugar, técnica, número de inventário e linha de crédito.
- Títulos em português, descrições e “por que está aqui” são textos do projeto.
- Obra nova só entra com acervo, número de inventário, data, licença aberta verificada e link oficial.

## Regras aplicadas pelo sistema

1. Toda referência deve existir em `content/sources.yml`, com situação de direitos.
2. Fontes com `usableForPublication: false` não podem fundamentar texto publicado (validador).
3. Nada é publicado sem tradução, texto persa e autorização registrada.
4. Adaptações livres são rotuladas na página como “Adaptação livre — não é uma tradução literal”.
