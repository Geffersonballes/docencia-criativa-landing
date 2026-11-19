# Arquitetura da página

## Sumário
1. Arquivos do repositório
2. Seções, na ordem
3. Campos do CONFIG
4. Como o CONFIG chega à página
5. Funções e ordem de inicialização
6. Sistema de animação
7. Paleta, tipografia e legibilidade

## 1. Arquivos do repositório

| Caminho | O que é |
|---|---|
| `index.html` | A página inteira |
| `previa.jpg` | Prévia do WhatsApp e das redes (1200 × 630, cerca de 240 KB), feita a partir da capa "Introdução ao Treinamento" |
| `CNAME` | Endereço no GitHub Pages (`docenciacriativa.ballestech.com.br`) |
| `.nojekyll` | Faz o GitHub servir os arquivos como estão |
| `conteudo/aulas.json` | Módulos, temas e títulos das 69 aulas, extraídos do documento (usado pelos testes) |
| `testes/` | `conteudo.js`, `interacoes.js`, `para-quem.js`, `contraste-captura.js`, `contraste-calculo.py` |
| `ferramentas/gravar-demo.js` | Grava a página em uso (celular e desktop) |
| `docs/demonstracao/` | Vídeos de demonstração |
| `.htmlvalidate.json` | Regras do html-validate |

## 2. Seções, na ordem

A ordem de cima para baixo é a ordem em que aparecem no celular.

1. **Topo** (`section.topo#topo`)
   - Etiqueta decodificada (`#olho-topo`), montada a partir das contagens: "formação continuada / 69 aulas / módulo 1 + 8 temas + bônus".
   - H1 "Docência Criativa: **Tecnologias e IA** na *Prática*". O trecho do meio é texto em degradê; "Prática" fica em itálico, com serifa.
   - Subtítulo, o botão de compra, o link "Ver a IA trabalhar" (vai a `#demo`) e a nota de preço (`.nota-chip`: "de ~~R$ 197,00~~ por R$ 97,00 à vista / garantia de 7 dias / compra pela Hotmart").
   - **Quadro "Para quem é. E para quem não é."** (`section.para-topo#para-quem`). Fica de propósito logo abaixo do botão e do preço: o dono quer que a pessoa entenda o sentido do curso e veja o valor ao mesmo tempo. É um quadro com borda em degradê: "É para você se…" (4 itens) e "Não é para você se…" (3 itens), com texto do documento.
   - **Mapa da formação** (`#mapa`). São 10 etapas em zigue-zague de duas colunas: Módulo 1, os Temas 1 a 8 e o Bônus, cada uma com o número de aulas. Uma luz percorre a trilha, as etapas acendem e o contador soma até 69.
     - Tocar numa etapa mostra o título e a descrição do documento, e o link "Ver as N aulas" leva a `#modulo-i` com o tema aberto.
     - Tudo é gerado a partir de `CONFIG.modulos` e `CONFIG.bonus` por `ligarMapa()`.
   - **Desktop (≥ 960 px):** grade com as áreas `"texto mapa" / "para para"`. **Celular:** texto → quadro → mapa.
2. **O desafio** (`#dores`): a citação do professor sobre sair da "apresentação de conceitos" para o "aprofundamento e intencionalidade".
3. **Demonstração** (`#demo`).
   - A pessoa escolhe disciplina, ano e material; o pedido "digita" e aparece o rascunho.
   - O rascunho sempre traz o aviso "Rascunho da IA. Antes de aplicar, confira…".
   - Os dados ficam em `DEMO`, e o aviso diz que são exemplos prontos.
4. **Do roteiro ao vídeo** (`#fluxo`): as 5 etapas da atividade final do Tema 7 (`FLUXO`), que acendem conforme a rolagem.
5. **Contexto é rei** (`.contexto`, Tema 4, aula 03).
   - Painel claro que cresce (`#painel-contexto[data-zoom]`), com a citação da aula.
   - Régua (`#ctx-range`) que acrescenta contexto ao pedido (`PEDIDO_CONTEXTO`), com o medidor "genérica e robótica ↔ autoral". Ele avança sozinho uma vez e depois a pessoa arrasta.
6. **O que você vai aprender** (`#aprender`).
   - O objetivo da formação.
   - **Bloom** (`.bloom`, Tema 5): 6 níveis com o formato de item indicado (`BLOOM_FORMATOS`), em colunas 3D no desktop.
   - **Uma imagem, três proporções** (`.formatos`, Tema 6, `FORMATOS`).
   - **Módulos, temas e aulas** (`#modulos`): uma linha por tema (`li.modulo#modulo-0` a `#modulo-9`, com `<details>`). A linha mostra rótulo, título e número de aulas; ao abrir, aparecem a descrição e as aulas.
7. **Depoimentos** (`#depoimentos`): fica escondida até haver depoimentos reais no `CONFIG`.
8. **Quem ensina** (`#quem-ensina`).
   - Foto (moldura polaroid; `[PREENCHER]` enquanto não houver foto).
   - "Prof. Romário Costa, 39 anos".
   - Links do Instagram, do TikTok e do YouTube (aba nova).
   - Credenciais em lista e a história (Aulas Engajadoras, pandemia), num painel com fundo.
   - A frase dele sobre o conhecimento.
9. **Oferta** (`#oferta`): o que está incluso (gerado em `montarFixos`), o bônus e o bloco de preço com o botão e o aviso de checkout pendente.
10. **Garantia** (`#garantia`): selo "Direito do consumidor · art. 49 do CDC" e o texto num painel.
11. **FAQ** (`#faq`): 15 perguntas, nesta ordem de ids: paraquem, ferramentas, pagas, bloom, substitui, generica, celular, aulas, praticas, certificado, gratuitos, parcelar, golpe, acesso, garantia. O teste confere a ordem.
12. **Chamada final** (`#final`): painel em degradê que cresce (`#painel-final[data-zoom]`), com botão escuro. Depois vem o rodapé (privacidade, CNPJ e e-mail).
13. **Barra fixa de compra** (`#fixo`, só abaixo de 768 px).
    - Aparece quando o bloco do botão e do preço do topo (`.topo .acao`) sai da tela.
    - Some enquanto outro botão de compra estiver visível.
    - Mostra "de R$ 197,00 / R$ 97,00 à vista" e o botão.

Os botões de compra são 6, todos com o texto "Quero fazer a formação". O atributo `data-compra` diz a posição de cada um, que vai para o Pixel: `menu` (cabeçalho, só no desktop), `topo`, `demonstracao` (depois do rascunho da demonstração), `oferta`, `final` e `fixo` (barra do celular).

## 3. Campos do CONFIG

- **Curso:** `nomeCurso`, `nomeCurto`, `objetivo` (do documento).
- **Preço:**
  - `preco` (texto, sempre "à vista");
  - `precoDe` (riscado; vazio = some);
  - `precoValor` (número enviado ao Pixel);
  - `parcelamento`, `formasPagamento`, `checkoutUrl`.
- **Conteúdo:** `modulos[]` (`modulo`, `tema`, `titulo`, `descricao`, `aulas[]`) e `bonus` (`titulo`, `descricao`, `aulas[]`). Os títulos são exatamente os do documento.
- **Oferta:** `certificado`, `suporte` (só aparece na oferta quando preenchido).
- **Professor (`professor`):** `nome`, `idade`, `instagram`, `tiktok`, `youtube` (os @), `instagramUrl`, `tiktokUrl`, `youtubeUrl` (só `https://`), `credenciais[]`, `bio`, `foto`.
- **Outros:**
  - `niveisBloom`, `depoimentos` (lista `{nome, cargo, texto}`; só reais), `garantiaDias`;
  - `dataEncerramento` (data ISO futura → aviso "Oferta válida até…"; data passada some);
  - `respostaCursosGratuitos`, `cnpj`, `email`, `pixelId`;
  - `parametroPerfil` (o `?perfil=` vai para o checkout e não muda a página).

**Campos calculados**, que não se editam:
- `CONFIG._aulas` (`m1`, `m2`, `temas`, `bonus`, `total`);
- `CONFIG._precoTexto` ("de R$ 197,00 por R$ 97,00" ou só "R$ 97,00").

## 4. Como o CONFIG chega à página

- `data-c="caminho"` em qualquer elemento: `preencherConfig()` troca o conteúdo por `comMarca(cfg(caminho))`, com o texto escapado e `[PREENCHER]` destacado em `<mark class="todo">`.
- `data-href="caminho"` em links: recebe a URL do `CONFIG`, só se começar com `https://`; senão, o link perde o `href`.
- `.preco-de-txt`: fica escondido quando `precoDe` está vazio.
- Textos do FAQ usam `{chave}`, resolvida por `txt()`.
- `preenchido(v)` diz se um valor foi preenchido de verdade (não vazio e sem `[PREENCHER]`).
- **Botões de compra:** `urlCheckout()` acrescenta `utm_*`, `src`, `sck` e o parâmetro de perfil. Sem checkout, o `href` fica `#oferta`.
- **Pixel:** `carregarPixel()` só carrega com `pixelId`. Cada clique em compra dispara `InitiateCheckout` com a posição do botão.

## 5. Funções e ordem de inicialização

No fim do script, nesta ordem:

```
preencherConfig(); montarFixos(); montarFaq(); carregarPixel(); ligarEventos(); aplicarLetra();
desenharOpcoes(); atualizarLinks(); ligarFixo(); ligarMapa(); montarFluxo(); ligarBloom();
ligarFormatos(); ligarContexto(); ligarAnimacoes();
```

- `montarFixos()` monta a etiqueta do topo, o que está incluso, o bônus, a lista de módulos (com os ids `modulo-N`), os depoimentos, as credenciais e a bio do professor, a foto, a garantia, o rodapé e a urgência.
- `ligarAnimacoes()` chama `ligarRevelacao()`, depois marca `window.__paginaPronta` e liga a abertura, o céu (`Ceu`), a rolagem, os botões de compra, o anel do cursor e o brilho dos cartões.
- O teste de segurança de `testes/interacoes.js` injeta um erro antes de `ligarMapa();\nmontarFluxo();`. Se mudar essa sequência, ajuste o teste.

## 6. Sistema de animação

Ele vem do vídeo de referência (um reel do Instagram de outro produto, com outra marca). O vídeo nunca entra na página: os elementos foram recriados em código, com o conteúdo do curso.

- **Script no `<head>`:**
  - Sem "reduzir movimento", põe `js-anima` no `<html>`. Na primeira visita da sessão, também põe `com-intro`, que faz a abertura (chave `dc-intro` no sessionStorage).
  - **Rede de segurança:** se `window.__paginaPronta` não existir em 2,5 s (script quebrado), põe `revela-tudo` e mostra tudo.
- **`[data-revelar]`:** o elemento aparece ao rolar (IntersectionObserver, classe `visivel`).
- **`[data-palavras]`:** títulos entram palavra por palavra, com desfoque e "eco" que termina no halo.
- **`[data-decodificar]`:** texto em fonte de código que "decodifica". O leitor de tela lê a cópia final em `.sr`.
- **Céu (`#ceu`, função `Ceu`, faixas em `CEU_FAIXAS`):**
  - É um canvas fixo atrás da página, com fitas de luz e estrelas.
  - As fitas seguem o dedo ou o cursor, ganham energia com toque e rolagem e são puxadas na direção do botão de compra.
  - Roda a 30 quadros por segundo no celular. Com "reduzir movimento", é desenhado uma vez e fica parado.
- **Botão do topo:** encostar nele faz o H1 "falhar" (glitch). Um reflexo passa pelos botões a cada 6 s; no botão escuro do final, o reflexo é verde e suave, para não apagar o texto branco.
- **Outros efeitos:**
  - anel que segue o cursor (só com mouse);
  - barra de progresso de leitura;
  - brilho que segue o ponteiro nos cartões (`.spot`);
  - inclinação do mapa com o cursor;
  - painéis que crescem com a rolagem (`[data-zoom]`).
- **`ANIMA`:** é `false` com "reduzir movimento". Nesse caso, nada anda sozinho: o mapa já aparece com a trilha inteira acesa e o contador em 69.

## 7. Paleta, tipografia e legibilidade

- **Paleta das capas do curso:**
  - fundos `--noite #060A33`, `--noite-2 #0B1452`, `--noite-3 #02042D`;
  - painéis `--painel #111B5E`;
  - cores `--violeta #5916AF`, `--lilas #B88AFC`, `--ciano #02CBFA`, `--menta #4EF1B4`, `--verde #01F2B8`, `--rosa #FF8AD8`;
  - textos `--texto #FFF`, `--texto-2 #C9CDF5`, `--link #5FE3FA`.
- **Fontes do sistema:** `--sans` (system-ui…), `--mono` (ui-monospace…) para etiquetas e notas, e Georgia em itálico para a palavra de destaque (`.acento`).
- **Texto sobre o céu:**
  - Títulos e textos soltos sobre o fundo animado usam `text-shadow: var(--halo)`.
  - Texto pequeno sobre o céu vai para um painel com fundo `--veu`, como a bio, a garantia e a nota de preço.
  - Painéis claros (`.painel-contexto`, `.painel-final`) zeram `--halo`.
- **Texto em degradê** (`h1 mark`, `background-clip:text`): use `filter: drop-shadow`, nunca `text-shadow`, que é pintado por cima do degradê e apaga as letras.
- **Larguras estreitas:**
  - Palavras longas (@usuário, "Microaprendizagem") precisam de `overflow-wrap:anywhere`, e colunas de grade, de `minmax(0,1fr)`.
  - Grupos curtos que não podem quebrar (", 39 anos") usam `white-space:nowrap`.
  - Evite `hyphens:auto` em texto corrido e em listas: ele hifeniza sem necessidade ("Educacio-nal"). A exceção são os nomes das etapas do mapa (`.tm b`), onde a hifenização é proposital para os cartões caberem em duas colunas no celular.
