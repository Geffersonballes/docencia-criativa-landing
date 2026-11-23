---
name: landing-ia-para-professores
description: 'Guia de identidade visual, estrutura, copy e publicação da landing (página de vendas) "IA para professores" do curso Docência Criativa — Tecnologias e IA na Prática, do Prof. Romário Costa, publicada em docenciacriativa.ballestech.com.br a partir do repositório Geffersonballes/docencia-criativa-landing. Use em QUALQUER pedido que mude o visual, o texto, a estrutura, o preço, as seções ou a publicação desta página (index.html deste repositório), mesmo quando a pessoa disser só "a landing", "a página do curso", "a página do Romário" ou "a legend" (ditado por voz): preço, checkout, textos, FAQ, professor, depoimentos, animações, prévia do WhatsApp, domínio, DNS, testes. Use também ao criar outra peça que deva seguir esta identidade.'
---

# Landing — Docência Criativa (IA para professores)

Página de vendas do curso **Docência Criativa: Tecnologias e IA na Prática** (Módulos 1 e 2), do **Prof. Romário Costa**. É uma formação continuada para profissionais da educação: inteligência artificial e ferramentas audiovisuais para produzir material pedagógico autoral (textos, avaliações com a Taxonomia de Bloom, imagens, vídeos e músicas).

- **Arquivo:** `index.html` (arquivo único: HTML + CSS + JS, sem build), cerca de 170 KB (limite: 200 KB)
- **No ar:** https://docenciacriativa.ballestech.com.br (GitHub Pages, branch `main`)
- **Repositório:** https://github.com/Geffersonballes/docencia-criativa-landing (público)
- **Venda:** Hotmart. **De R$ 197,00 por R$ 97,00 à vista**, garantia de 7 dias
- **Fonte do conteúdo:** documento do curso (conteúdo programático, `.docx` privado, **fora do repositório**: na Library do projeto ou no Drive do dono). Os títulos das aulas estão em `conteudo/aulas.json`

## REGRA DE OURO: esta skill aprende

**Toda instrução do usuário que mude visual, forma, texto, estrutura, preço ou regra da página é registrada aqui**, na mesma alteração que a aplica:

1. Aplique a mudança no `index.html`. Quase todo dado (preço, aulas, professor, FAQ) fica no `CONFIG` e nas constantes do começo do `<script>`.
2. Atualize a seção correspondente desta skill (tokens, seções, copy, dados, pendências) para descrever o estado novo.
3. Acrescente uma linha no **Registro de decisões** (fim do arquivo), com a data, o pedido e o porquê, se o usuário disse.
4. Faça o commit da página e da skill juntas.

Se uma instrução nova contradiz uma regra antiga, a nova vale: troque a regra e registre a troca. A skill nunca descreve algo que a página já não faz.

## Identidade visual

**Direção:** escura e tecnológica, nas cores das capas do curso (azul-noite com lilás, ciano e verde-menta e brilho violeta). A inspiração é o vídeo de referência (landing de SaaS com fitas de luz, fluxos que acendem, rótulos em fonte de código e títulos que surgem), com o conteúdo do curso. Dois painéis claros, em degradê, dão respiro: "Contexto é rei" e a chamada final.

### Tokens (`:root`)

| Token | Cor | Uso |
|---|---|---|
| `--noite` | `#060A33` | fundo da página |
| `--noite-2` / `--noite-3` | `#0B1452` / `#02042D` | fundos de seção e da chamada final |
| `--veu` / `--veu-2` | `rgba(6,10,51,.8)` / `rgba(11,20,82,.78)` | véu sobre o céu: painéis de texto pequeno e seções com fundo |
| `--painel` / `--painel-2` | `#111B5E` / `#18237A` | cartões |
| `--borda` | `rgba(130,150,255,.38)` | bordas de cartões, chips e linhas |
| `--violeta` | `#5916AF` | brilho e sombras dos cartões |
| `--lilas` | `#B88AFC` | palavra de destaque (`.acento`), "Aula 01", níveis de Bloom |
| `--ciano` / `--ciano-2` | `#02CBFA` / `#02E1FC` | botões, linhas, degradê do título |
| `--menta` / `--verde` | `#4EF1B4` / `#01F2B8` | ativo, aceso, "É para você se…", fim do degradê do botão |
| `--rosa` | `#FF8AD8` | "Não é para você se…" |
| `--texto` / `--texto-2` | `#FFFFFF` / `#C9CDF5` | texto principal e secundário |
| `--link` | `#5FE3FA` | links e redes do professor |
| `--folha` / `--tinta` / `--tinta-2` / `--linha` | `#FFFDF6` / `#060A33` / `#3A4378` / `#C5D3EA` | folha do rascunho da demonstração e texto sobre fundo claro |
| `--vermelho` | `#B93A2B` | aviso "Rascunho da IA… revise" e marcador `[PREENCHER]` |
| `--degrade-titulo` | lilás → ciano | trecho "Tecnologias e IA" do H1 |
| `--degrade-botao` / `--degrade-faixa` | ciano → verde | botões de compra e sublinhado dos títulos |
| `--halo` | sombra azul-noite em 3 camadas | legibilidade de títulos e textos soltos sobre o céu animado |

Painéis claros (`.painel-contexto`, `.painel-final`) zeram o `--halo`.

### Tipografia (fontes do sistema, sem Google Fonts)

- **Texto e títulos:** `--sans` (system-ui, -apple-system, Segoe UI, Roboto…). Base de 18 px (`html{font-size:112.5%}`), entrelinha 1,6. H1 com `clamp(1.95rem…3.35rem)` e H2 com `clamp(1.55rem…2.35rem)`, ambos em negrito. Os H2 têm sublinhado em degradê.
- **Palavra de destaque:** Georgia itálico negrito em lilás (`<em class="acento">`), uma por título.
- **Trecho em degradê** só no H1 (`<mark>`). Para dar halo, use `filter: drop-shadow`, nunca `text-shadow`, que apaga o degradê.
- **Rótulos técnicos** (etiquetas, status, notas, contadores, rótulos das etapas): `--mono` (ui-monospace…), em geral em minúsculas ou em caixa alta pequena.
- **Botões A− e A+:** a letra vai até 150% (`data-letra` 0 a 3) e nada pode vazar na lateral.

### Marca

- Barra do topo: ícone de lápis em ciano + **"Docência Criativa"** e, embaixo, "com o Prof. Romário Costa". No desktop: pílula "formação continuada", botão de compra e A−/A+.
- Favicon: lápis em azul-noite.
- Prévia do WhatsApp: `previa.jpg`, feita da capa "Introdução ao Treinamento".

### Componentes

- `.btn-compra`: degradê ciano → verde, texto azul-noite, altura mínima de 3,25rem (cerca de 58 px), com reflexo de luz que passa. No painel final, o botão é escuro com reflexo verde suave.
- `.link-demo`: botão secundário de contorno ("Ver a IA trabalhar").
- `.olho`: pílula mono com ponto que pisca.
- `.nota-chip`: nota mono com preço e garantia.
- `.spot`: cartões com brilho que segue o ponteiro.
- Quadro com borda em degradê: "Para quem é" e a prancheta da oferta.
- `.mapa-card`: mapa da formação, com etapas `.tm`.
- `.modulo`: linhas de tema com `<details>`.
- `.faq-item`: perguntas em sanfona.
- `.polaroid`: foto do professor.
- Selo SVG da garantia.
- `#fixo`: barra fixa de compra no celular.
- `.todo`: marcador amarelo tracejado para dado pendente (`[PREENCHER]`, `[CONFIRMAR: …]`).

### Interações (manter todas)

1. Abertura com flash uma vez por sessão; barra de progresso de leitura no topo.
2. Céu de fitas de luz em canvas fixo atrás da página. Segue o dedo ou o cursor, ganha energia com toque e rolagem e é puxado na direção do botão de compra. Roda a 30 quadros por segundo no celular e para quando a aba fica oculta.
3. Etiqueta do topo que "decodifica"; títulos que entram palavra por palavra com eco; blocos que aparecem ao rolar.
4. Mapa da formação: a luz percorre a trilha, as etapas acendem e o contador soma até 69. Tocar numa etapa mostra o tema, e "Ver as N aulas" abre o tema na lista. A troca automática para fora da tela e depois de um toque. O cartão inclina com o cursor.
5. Demonstração "Ver a IA trabalhar": a pessoa escolhe disciplina, ano e material; o pedido é digitado e aparece o rascunho com o aviso de revisão.
6. Roteiro em 5 etapas (Tema 7), que acendem com a rolagem.
7. Painéis claros que crescem com a rolagem ("Contexto é rei" e a chamada final).
8. Régua "Contexto é rei": avança sozinha uma vez, depois a pessoa arrasta; tem o medidor "genérica e robótica ↔ autoral".
9. Bloom: 6 níveis tocáveis com o formato de item indicado; colunas 3D no desktop.
10. "Uma imagem, três proporções" (16:9, 9:16, 1:1).
11. Glitch no H1 ao encostar no botão do topo; anel que segue o cursor (só com mouse).
12. Sanfonas dos módulos e do FAQ; A−/A+; barra fixa de compra no celular.

Sempre respeitar `prefers-reduced-motion`: nada anda sozinho e o mapa já vem aceso. Animações em laço pausam fora da tela. Há uma rede de segurança: se o script quebrar, o conteúdo aparece em 2,5 s.

## Ordem das seções

1. **Barra** (marca, pílula "formação continuada", botão de compra, A−/A+).
2. **Topo:**
   - etiqueta "formação continuada / 69 aulas / módulo 1 + 8 temas + bônus";
   - H1 "Docência Criativa: **Tecnologias e IA** na *Prática*" e subtítulo;
   - botão de compra + "Ver a IA trabalhar" + nota "de R$ 197,00 por R$ 97,00 à vista / garantia de 7 dias / compra pela Hotmart";
   - **quadro "Para quem é. E para quem não é."**, logo abaixo do botão e do preço;
   - **Mapa da formação**, à direita do título no desktop e depois do quadro no celular.
3. **O desafio:** citação do professor sobre "aprofundamento e intencionalidade".
4. **Demonstração:** "Veja um exemplo do que você aprende a fazer".
5. **Do roteiro ao vídeo, em cinco etapas** (atividade final do Tema 7).
6. **Contexto é rei** (Tema 4, aula 03): painel claro + régua.
7. **O que você vai aprender:** objetivo da formação, Bloom (Tema 5), "Uma imagem, três proporções" (Tema 6) e "Módulos, temas e aulas" (uma linha por tema).
8. **Depoimentos:** escondida até haver depoimentos reais.
9. **Quem ensina:** foto, nome com idade, redes, credenciais, história e citação.
10. **O que você recebe:** o que está incluso, o bônus e o bloco de preço.
11. **Garantia:** "7 dias para desistir. É um direito seu." (art. 49 do CDC).
12. **FAQ:** 15 perguntas.
13. **Chamada final** + rodapé (privacidade, CNPJ e contato).
14. **Barra fixa de compra** (celular, depois que o botão do topo some).

## Conteúdo e regras de copy

- **Promessa central:** "Domine inteligências artificiais e ferramentas audiovisuais e produza material pedagógico autoral: textos, avaliações, imagens, vídeos e músicas." Fechamento: "Deixe de ser apenas transmissor e torne-se criador de experiências."
- **Só o que o documento do curso sustenta.** O dono disse: "deixe a landing exatamente como no arquivo, pois pode dar divergência e virar objeções e cancelamentos". Títulos de módulos, temas e aulas ficam exatamente como no documento (`CONFIG.modulos`). Dado informado diretamente pelo dono vale; se contradiz o documento, aplique e avise a divergência.
- **Nunca prometer:**
  - resultado, renda ou aprovação;
  - acesso, ritmo, certificado ou suporte que não estejam confirmados;
  - "tudo grátis" (as ferramentas têm versão gratuita limitada, e o curso mostra as pagas como investimento);
  - IA que trabalha sozinha ("a IA rascunha, o professor decide").
- **Nunca inventar** depoimentos, número de alunos, resultados, selos, estatísticas ou parcelamento. Dado faltando vira `"[PREENCHER]"` no `CONFIG`, que a página destaca. Texto que precisa de confirmação usa `<mark class="todo">[CONFIRMAR: …]</mark>`.
- **Urgência** só com data real (`dataEncerramento`). **Garantia** sempre como direito do consumidor (art. 49 do CDC), nunca como vantagem.
- **Preço "de"** só com valor já praticado (CDC, art. 37); ao mexer nisso, lembre o dono.
- **Links de saída:** só o checkout e as redes do professor, em aba nova. Sem menu.
- **Títulos:** frases curtas, concretas, de professor para professor. No máximo uma palavra em `<em class="acento">` por título.

### Dados do produto

- **Preço:** `preco` "R$ 97,00" (à vista), `precoDe` "R$ 197,00" (riscado), `precoValor` 97 (Pixel). Venda pela Hotmart. Parcelamento e formas de pagamento ainda pendentes. Garantia de 7 dias.
- **Aulas (69):**
  - **Módulo 1:** Fundamentando o Treinamento (7).
  - **Módulo 2, "Fábrica de Conteúdos"**, em 8 temas (60):
    1. Metodologias Ativas e Microaprendizagem (4)
    2. Gmail: Ecossistema Google (2)
    3. Adobe Express: Personagens Falantes (6)
    4. Gemini: IA na Prática (4)
    5. Agente Avaliativo com a Taxonomia de Bloom (9)
    6. Geração de Imagens Nano Banana (11)
    7. CapCut: O Caldeirão da Produção Educacional (18)
    8. Musicalizando a Infância (6)
  - **Bônus:** O Desafio da Multiplicação, jogo em Scratch (2).
- **Ferramentas:** Gemini (com Nano Banana 2), Adobe Express, CapCut, Suno AI, Flow Music, Gmail e Google Sala de Aula.
- **Professor:**
  - Prof. Romário Costa, 39 anos.
  - Credenciais: professor pedagogo; pós-graduado em Ensino Híbrido; graduado em Tecnologia Educacional pela UFMT; formador de professores; especialista no uso de IA na personalização do ensino e da aprendizagem; músico, compositor, guitarrista e produtor audiovisual e musical.
  - Criador do treinamento "Aulas Engajadoras".
  - Citação: "O conhecimento é um lugar, e nós, professores, somos os guias que mostram o caminho para se chegar até ele."
- **Redes:** Instagram e TikTok @prof.romariocosta; YouTube @engajadamente. Só na seção do professor (e citadas no FAQ "Como sei que não é golpe?").

## Pendências

- [ ] `checkoutUrl`: link do checkout da Hotmart. Enquanto não houver, os botões levam à oferta.
- [ ] `parcelamento` e `formasPagamento`.
- [ ] `certificado`: carga horária e emissão.
- [ ] `suporte`: canal e horário.
- [ ] `professor.foto`.
- [ ] `depoimentos` (só reais).
- [ ] `dataEncerramento`, se houver.
- [ ] `respostaCursosGratuitos` (FAQ "Por que pagar por este?").
- [ ] `cnpj` e `email`.
- [ ] `pixelId` (Meta Pixel).
- [ ] Confirmar: a aula "Quem Sou/ Formador" diz "estudante de Tecnologia Educacional" e a página diz "graduado". Alinhar a aula?
- [ ] Confirmar: o curso já foi vendido por R$ 197 (preço "de")?
- [x] Domínio, HTTPS e prévia do WhatsApp ativos.

## Fluxo de trabalho técnico

1. **Atualizar:** `git pull --ff-only`. O dono às vezes faz commits pelo GitHub. Na primeira vez, rode `npm ci`.
2. **Editar** `index.html` com substituições exatas. Os dados ficam no `CONFIG` e nas constantes `FAQ`, `DEMO`, `FLUXO`, `BLOOM_FORMATOS`, `FORMATOS` e `PEDIDO_CONTEXTO`; os comentários do código ficam em português. Mapa completo do código: `references/arquitetura.md`.
3. **Testar:**
   - `npm test`: HTML válido; conteúdo igual ao documento; acessibilidade (axe); teclado; 9 larguras de tela; interações; posição do quadro "Para quem é".
   - `node .claude/skills/landing-ia-para-professores/scripts/capturas.js index.html <pasta> <seletor> …` (com `NODE_PATH=node_modules`): Playwright em **375 px** e **1280 px**. Confere zero erros no console e `scrollWidth` igual à largura, e tira prints do topo e das seções pedidas. Olhe os prints. Arquivos temporários vão no scratchpad, nunca no repositório.
   - Se mexeu em cor, texto sobre o céu ou animação, rode `npm run contraste` e espere 0 abaixo do mínimo AA.
   - Corrija a página, não o teste. O teste só muda junto com uma mudança de estrutura proposital. Detalhes em `references/testes.md`.
4. **Atualizar esta skill** (regra de ouro).
5. **Commit** em português, com a página e a skill juntas e as linhas de atribuição da sessão; depois, `git -c push.negotiate=true push origin main`.
6. **Conferir no ar:** `bash .claude/skills/landing-ia-para-professores/scripts/conferir-publicado.sh .` compara o site com o `index.html` local a cada 15 s (até 3 min) e testa a prévia e o certificado. Também serve `curl -s https://docenciacriativa.ballestech.com.br | grep -q '<trecho novo>'`.
7. **Se não publicar em 3 min:**
   - confira se o arquivo `CNAME` continua lá com `docenciacriativa.ballestech.com.br`;
   - o GitHub às vezes não dispara o build: envie um commit vazio (`git commit --allow-empty -m "Republica o site no GitHub Pages"`) e confira de novo;
   - se ainda assim não entrar, relate. Em github.com/Geffersonballes/docencia-criativa-landing/actions dá para ver o build "pages build and deployment".
   - Problemas de DNS e certificado: `references/publicacao.md`.

### Domínio

- `CNAME` no repositório: `docenciacriativa.ballestech.com.br`. GitHub Pages: branch `main`, pasta raiz, "Enforce HTTPS" marcado.
- DNS na Hostinger (zona `ballestech.com.br`): `CNAME docenciacriativa → geffersonballes.github.io`. **Nunca alterar** os registros de e-mail (MX, SPF, DKIM `hostingermail-*`, DMARC, autodiscover/autoconfig), os de verificação do Google, o `A @` (site principal) nem `naoerremais`. Mudança de DNS só com pedido explícito, guardando antes uma cópia da zona.
- O documento do curso nunca vai para o repositório: ele é público e o documento traz o conteúdo pago. `conteudo/*.docx` está no `.gitignore`.

## Equipe de subagentes

Definidos em `.claude/agents/` e orquestrados pela sessão principal (regras no `CLAUDE.md`). Todos seguem esta skill; o copywriter e o designer a atualizam ao terminar.

- `copywriter-docencia-criativa`: textos.
- `designer-interacoes`: visual e interações.
- `conteudo-docencia-criativa`: leitura de materiais.
- `qa-publicacao`: testes e publicação.

## Como trabalhar com o dono

- Escreva em português do Brasil, simples, sem jargão técnico. Ele acompanha pelo iPhone e dita por voz: "legend" é landing, "balistec" é ballestech.
- O que é reversível, faça direto. O que é irreversível (apagar branch, arquivo ou site, mexer no DNS de e-mail, compras) só com o "sim" dele.
- Quando ele disser "me diz antes de mexer", não altere nada até ele confirmar.
- "Página parada" no iPhone quer dizer pré-visualização de arquivos, que não roda JavaScript. Peça para abrir o endereço no Safari.

## Referências

- `references/arquitetura.md`: seções em detalhe, campos do `CONFIG`, funções, sistema de animação, legibilidade.
- `references/testes.md`: o que cada suíte confere, medição de contraste, testes instáveis.
- `references/publicacao.md`: GitHub Pages, DNS na Hostinger, prévia do WhatsApp, problemas comuns.
- `scripts/capturas.js` e `scripts/conferir-publicado.sh`.

## Registro de decisões

| Data | Decisão |
|---|---|
| 2026-11-11 | O curso da página é o "Docência Criativa: Tecnologias e IA na Prática", Módulos 1 e 2. A página é reposicionada com base nesses dois módulos |
| 2026-11-11 | Taxonomia de Bloom em destaque: o professor usa Bloom para corrigir e criar atividades (Tema 5) |
| 2026-11-11 | Ferramentas: todas têm versão gratuita limitada; o curso mostra as pagas como investimento. Documento do curso limpo (sem conversas com IA coladas, numeração dos temas corrigida) |
| 2026-11-18 | "Deixe a landing exatamente como no arquivo": sai o que era só briefing (seletor de perfil, calculadora, textos genéricos), porque divergência vira objeção, cancelamento e reembolso |
| 2026-11-18 | Paleta tirada das capas do curso (Drive). Prévia do WhatsApp feita da capa "Introdução ao Treinamento" |
| 2026-11-18 | Página animada e interativa como o vídeo de referência: os elementos são recriados em código, sem embutir o vídeo, que é de outra marca. O simulador de ritmo do vídeo fica de fora (o documento não confirma ritmo nem acesso) |
| 2026-11-18 | Legibilidade AA sobre o céu animado: halo nos títulos e painel com véu para texto pequeno |
| 2026-11-18 | Quadro "Para quem é" vai para logo abaixo do botão e do preço, para a pessoa entender o sentido e ver o valor ao mesmo tempo |
| 2026-11-18 | Cartão do Agente Avaliativo sai do topo e entra o Mapa da formação. Saem "A formação, em números" e o círculo de ferramentas, que eram repetidos. A lista de módulos fica compacta (página de cerca de 30 para cerca de 25 telas no iPhone) |
| 2026-11-18 | Repositório próprio e público. O documento do curso fica fora dele, por ser conteúdo pago |
| 2026-11-18 | Publicação no GitHub Pages em docenciacriativa.ballestech.com.br, com registro CNAME na Hostinger (sem mexer no e-mail) |
| 2026-11-18 | "Quem ensina" atualizado pelo dono: 39 anos, credenciais e redes; "estudante" passa a "graduado" (divergência com a aula apontada) |
| 2026-11-18 | Preço: de R$ 197,00 por R$ 97,00 à vista, em todos os lugares do preço. Redes do professor clicáveis, em aba nova |
| 2026-11-19 | Criada a skill de manutenção da landing |
| 2026-11-23 | Trabalho organizado com 4 subagentes especialistas (copywriter, designer, conteúdo e QA/publicação) e `CLAUDE.md`, como na landing do Método Não Erre Mais. A skill ganha a regra de ouro e este registro |
