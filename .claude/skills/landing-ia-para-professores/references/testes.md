# Testes e verificação

## Sumário
1. Comandos
2. O que cada suíte confere
3. Quando mudar um teste (e quando não)
4. Testes instáveis: causas e correções
5. Medição de contraste sobre o fundo animado
6. Conferência visual
7. Vídeos de demonstração

## 1. Comandos

Tudo roda da raiz do repositório:

```bash
npm ci                 # primeira vez (Playwright 1.63, axe-core 4.14, html-validate 8.29)
npm test               # validar + conteudo + interacoes + para-quem
npm run validar        # só o HTML
npm run contraste      # contraste com o halo (precisa de Python 3 com Pillow)
npm run video          # grava a página em uso em testes/saida/video
```

As saídas ficam em `testes/saida/` (fora do Git). O Chromium do Playwright já vem instalado no ambiente de nuvem; não rode `playwright install`.

## 2. O que cada suíte confere

**`testes/conteudo.js`** (cerca de 218 verificações):
- **Versões e parâmetros:** os parâmetros de anúncio (`?perfil=`, `utm_*`) não mudam a página; há 6 botões "Quero fazer a formação"; sem checkout, os botões vão para a oferta; a etiqueta do topo está certa.
- **Console e pedidos:** nenhum erro no console e nenhum pedido externo.
- **Links de saída:** só os 3 links das redes do professor.
- **Aulas:** 10 linhas na lista de módulos, todas fechadas; rótulos, títulos e aulas iguais ao documento (`conteudo/aulas.json`); total de 69.
- **Oferta:** o que está incluso e o bônus.
- **Quem ensina:** nome com idade, 6 credenciais, "graduado" (não "estudante") e as redes clicáveis em aba nova.
- **Preço:** "de R$ 197,00 por R$ 97,00 à vista" no topo, na oferta, no final, na barra fixa e no FAQ.
- **FAQ:** 15 perguntas, na ordem.
- **Prévia:** `og:url`, `og:image` e `canonical` batem com o `CNAME`.
- **Acessibilidade:** axe sem violações (WCAG 2.2 AA + boas práticas) e ordem de foco pelo teclado. As 9 primeiras paradas do Tab são `btn-compra letra-menos letra-mais btn-compra link-demo tm tm tm tm`.
- **Larguras:** nenhuma rolagem lateral em 9 larguras (320 a 1920), com a letra normal e no tamanho máximo.
- **Checkout e Pixel:** os parâmetros vão para o checkout; o Pixel dispara um `InitiateCheckout` por clique.
- **Variações do CONFIG (seção J):** depoimentos, foto, urgência com data futura e passada, parcelamento, suporte e preço "de" vazio.

**`testes/interacoes.js`** (49 verificações, celular e desktop):
- **Abertura e céu:** a abertura aparece uma vez e não bloqueia o botão; o céu está desenhado e em movimento.
- **Etiqueta e títulos:** a etiqueta é decodificada até o texto final; títulos ainda não vistos guardam o eco.
- **Mapa da formação:** ordem e aulas corretas; o zigue-zague é desenhado; a luz avança sozinha; tocar no Tema 7 soma 61; o link leva ao tema aberto.
- **Contexto, Bloom e final:** "Contexto é rei" avança e responde ao arrastar; colunas de Bloom em 3D; o painel final cresce.
- **Desktop:** glitch no botão do topo e anel do cursor.
- **Fim da página:** rolando até o fim, tudo aparece.
- **Outras situações:** versão sem movimento (nada anda sozinho e o mapa vem inteiro aceso); script quebrado (o conteúdo aparece em 2,5 s); teclado.
- **Desempenho:** pelo menos 45 quadros/s no celular e 35 no desktop, rolando com tudo animado. O ambiente desenha sem placa de vídeo, por isso a meta do desktop é menor.

**`testes/para-quem.js`:** o quadro fica dentro do topo, entre o bloco do botão e do preço e o mapa. A distância até o preço é menor que 80 px no celular e menor que 140 px no desktop.

## 3. Quando mudar um teste (e quando não)

- **Falhou por algo na página:** corrija a página. Não afrouxe o teste para passar.
- **A estrutura mudou de propósito:** atualize o teste na mesma mudança. Exemplos: seção nova, ordem de foco diferente, lista de módulos com outro formato, novo link de saída pedido pelo dono.
- **O teste dependia de tempo e falhou por uma fração de segundo:** troque o tempo fixo por uma condição, com `page.waitForFunction(…, null, { timeout: 4000 })`. Já aconteceu com a etiqueta decodificada ("bônuP") e com a posição do anel do cursor.

## 4. Testes instáveis: causas e correções

| Sintoma | Causa | Correção |
|---|---|---|
| Rolagem para no lugar errado | `scroll-behavior: smooth` da página. Um `scrollBy` logo depois interrompe a rolagem suave | No script, injete `html{scroll-behavior:auto!important}` e use `behavior: 'instant'` |
| Texto escondido aparece na leitura | `textContent` inclui o que tem `hidden` | Use `innerText` |
| Elemento a poucos px do topo depois de um link interno | A animação de entrada (`translate` de 22 px) ainda corre quando o navegador rola | Desligar a transição e aplicar `visivel` antes de rolar (já feito no link do mapa) |
| Valor no meio de uma animação | Leitura num instante fixo | Esperar uma condição |

## 5. Medição de contraste sobre o fundo animado

O fundo muda o tempo todo (fitas de luz), então o contraste é medido em capturas reais, em várias posições da página, no celular (390) e no desktop (1280).

Como funciona `testes/contraste-captura.js`:
1. Guarda a cor e as caixas de cada texto visível. Ignora `.sr`, `aria-hidden`, `.fixo`, `.intro`, `svg` e `.todo`, e texto não renderizado (`checkVisibility`, por exemplo dentro de `<details>` fechado).
2. Deixa o texto transparente e esconde o que é fixo e passa por cima (`.progresso`, `.fixo`, `.anel`). Com `HALO=1`, mantém o halo, que é o fundo efetivo em volta das letras.
3. Tira a captura e coleta de novo, descartando as caixas que mudaram no meio (cor ou posição), porque eram estados animados.

`testes/contraste-calculo.py` pega o percentil 95 de luminância do fundo dentro de cada caixa (o pior caso para texto claro). O mínimo é 4,5:1 para texto normal e 3:1 para texto grande (24 px, ou 18,66 px em negrito).

**Correções que funcionaram:**
- halo (`--halo`) em títulos e textos soltos;
- painel `--veu` para texto pequeno;
- reflexo verde a 30% no botão escuro;
- `drop-shadow` no texto em degradê.

## 6. Conferência visual

```bash
NODE_PATH=node_modules node .claude/skills/landing-ia-para-professores/scripts/capturas.js index.html testes/saida/capturas '#mapa' '#quem-ensina' '#oferta'
```

O script gera `iphone-01.png`, `desktop-01.png`… e lista os erros de console. Ele também aceita uma URL (`https://docenciacriativa.ballestech.com.br/`) para conferir o site publicado. Abra as imagens: o dono olha no iPhone, e os problemas visuais mais comuns até aqui foram:
- palavra quebrando no meio;
- grupo curto partido em duas linhas;
- texto em degradê apagado;
- marcador `[PREENCHER]` fora do lugar.

Para juntar várias capturas numa imagem só antes de mandar ao dono, use PIL (lado a lado, com metade do tamanho).

## 7. Vídeos de demonstração

```bash
NODE_PATH=node_modules node ferramentas/gravar-demo.js index.html testes/saida/video
ffmpeg -i testes/saida/video/celular/*.webm -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart -an docs/demonstracao/pagina-animada-celular.mp4
```

O celular é gravado com `isMobile` e `hasTouch`; sem isso, o anel do cursor aparece no vídeo do celular. Se a página mudar de estrutura, atualize os seletores do roteiro (`ferramentas/gravar-demo.js`).
