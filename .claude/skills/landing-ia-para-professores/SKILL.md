---
name: landing-ia-para-professores
description: 'Manter e evoluir a landing (página de vendas) "IA para professores" do curso Docência Criativa — Tecnologias e IA na Prática, do Prof. Romário Costa, publicada em docenciacriativa.ballestech.com.br a partir do repositório Geffersonballes/docencia-criativa-landing. Use sempre que o pedido mexer nessa página, mesmo quando a pessoa disser só "a landing", "a página do curso", "a página do Romário" ou "a legend" (ditado por voz): trocar preço, link do checkout, parcelamento, textos, seções, FAQ, dados ou foto do professor, depoimentos, animações, prévia do WhatsApp, domínio, DNS, publicação ou testes. Traz as regras de conteúdo (só o que o documento do curso sustenta), o mapa do código, o passo a passo de teste e publicação e as armadilhas já conhecidas.'
---

# Landing "IA para professores" (Docência Criativa)

Página de vendas do curso **Docência Criativa: Tecnologias e IA na Prática** (Módulos 1 e 2, 69 aulas), com o **Prof. Romário Costa**, vendido pela Hotmart.

| O quê | Onde |
|---|---|
| Página | Um único `index.html` (HTML, CSS e JS juntos), sem frameworks nem bibliotecas externas, cerca de 170 KB (limite: 200 KB) |
| Repositório | `Geffersonballes/docencia-criativa-landing` (público). O branch `main` é o site no ar |
| Endereço | https://docenciacriativa.ballestech.com.br (GitHub Pages + arquivo `CNAME`; DNS na Hostinger) |
| Testes | `npm test` (pasta `testes/`), `npm run contraste` |
| Fonte do conteúdo | O documento do curso (conteúdo programático, `.docx` privado, **fora** do repositório). Os títulos das aulas estão em `conteudo/aulas.json` |

Se o repositório não estiver na sessão, conecte com `add_repo` (owner `Geffersonballes`, repo `docencia-criativa-landing`, acesso `push`) e clone. Sempre comece com `git pull`: o dono às vezes faz commits direto pelo GitHub (por exemplo, o GitHub Pages grava o `CNAME`).

## Regras de conteúdo (e por quê)

O dono foi explícito: *"deixe a landing exatamente como no arquivo, pois pode dar divergência e virar objeções e cancelamentos; a última coisa que queremos é fazer devoluções"*. Cada promessa que o curso não cumpre vira pedido de reembolso. Por isso:

1. **Só o que o documento do curso sustenta.** Títulos de módulos, temas e aulas ficam exatamente como no documento (`CONFIG.modulos`). Não acrescente benefícios, ferramentas, formatos ou resultados que o documento não cita.
2. **O que o dono informa diretamente vale.** Preço, link de compra e dados do professor podem vir dele e entram na página. Se contradizem o documento, aplique e avise a divergência. Exemplo: a aula "Quem Sou/ Formador" diz "estudante de Tecnologia Educacional"; o dono informou "graduado".
3. **Nada inventado.** Sem depoimentos, número de alunos, resultados, selos, parcelamento ou estatísticas que não foram fornecidos. Dado que falta fica como `"[PREENCHER]"`: a página mostra o marcador em destaque e esconde o trecho quando faz sentido.
4. **Urgência só com data real** (`CONFIG.dataEncerramento`). Nada de cronômetro que reinicia.
5. **Garantia de 7 dias como direito** (art. 49 do CDC), nunca como vantagem do curso.
6. **Preço "de/por":** `precoDe` só se o curso já foi vendido por esse valor. Ao mexer nisso, lembre o dono: preço de referência fictício é propaganda enganosa (CDC, art. 37; Procon).
7. **"A IA rascunha, o professor decide."** A validação pedagógica é sempre do educador; a página nunca vende a IA como substituta.
8. **Ferramentas:** todas têm versão gratuita limitada; o curso mostra as versões pagas como investimento. Não prometa "tudo grátis".
9. **Sem saídas além do necessário.** Sem menu. Links que saem da página: só o checkout e as redes do professor, que abrem em aba nova (`target="_blank" rel="noopener"` e o aviso "(abre em nova aba)" para leitor de tela).
10. **O documento do curso nunca vai para o repositório.** Ele é público, e o documento traz o conteúdo pago (atividades, "Prompt Mestre"). `conteudo/*.docx` está no `.gitignore`.
11. **Acessível e leve:** pensada primeiro para celular (360 px), letra base de 18 px, botões de pelo menos 48 px, contraste AA (inclusive sobre o fundo animado), teclado, "reduzir movimento", botões A−/A+, sem pedidos externos (só o Meta Pixel, quando `pixelId` estiver preenchido).

Para copy nova, combine estas regras com a skill `copy-pagina-vendas-professores`. Para direção visual, use `landing-page-premium`. Esta skill manda no que é específico desta página.

## Onde mexer

| Pedido | Onde |
|---|---|
| Preço, preço "de", parcelamento, formas de pagamento, link do checkout | `CONFIG` no começo do `<script>` principal (`preco`, `precoDe`, `precoValor`, `parcelamento`, `formasPagamento`, `checkoutUrl`). Com `checkoutUrl` vazio, os botões levam a `#oferta` e aparece um aviso |
| Módulos, temas, aulas, bônus | `CONFIG.modulos` e `CONFIG.bonus`. A contagem é automática; o mapa do topo, a lista de aulas, a etiqueta e o FAQ se atualizam sozinhos |
| Professor | `CONFIG.professor` (nome, idade, redes e URLs, credenciais, bio, foto) |
| Certificado, suporte, depoimentos, data de encerramento, CNPJ, e-mail, Pixel | Campos do `CONFIG` com o mesmo nome |
| Perguntas frequentes | `const FAQ` (aceita `{chave}` do `CONFIG`, como `{_precoTexto}` e `{_aulas.total}`) |
| Demonstração "Ver a IA trabalhar" | `const DEMO` |
| Roteiro do vídeo (Tema 7), Bloom (Tema 5), proporções (Tema 6), "Contexto é rei" (Tema 4) | `FLUXO`, `BLOOM_FORMATOS`, `FORMATOS`, `PEDIDO_CONTEXTO` |
| Prévia do WhatsApp, endereço | `<head>`: `canonical`, `og:url`, `og:image`, mais o arquivo `CNAME` e o DNS (o teste confere se batem) |
| Cores | Variáveis no `:root` (paleta das capas do curso) |

Estrutura completa, seções, funções e sistema de animação: `references/arquitetura.md`.

## Passo a passo de qualquer mudança

1. **Atualize:** `git pull --ff-only`. Na primeira vez, rode `npm ci`.
2. **Edite com precisão.** Use substituições exatas que falhem se o trecho não existir uma única vez. Comentários do código ficam em português.
3. **Teste:** `npm test` (HTML válido, conteúdo igual ao documento, acessibilidade, interações e posição do quadro "Para quem é").
   - Se mexeu em cor, tamanho, posição de texto ou animação, rode também `npm run contraste` e espere "abaixo do mínimo AA: 0".
   - **Corrija a página, não o teste.** O teste só muda quando a estrutura mudou de propósito, ou quando ele dependia de tempo (aí ele passa a esperar uma condição, em vez de um tempo fixo). Veja `references/testes.md`.
4. **Olhe:** `NODE_PATH=node_modules node .claude/skills/landing-ia-para-professores/scripts/capturas.js index.html <pasta> <seletor> …` captura no iPhone 11 e no desktop (1280). Abra as imagens antes de dar por pronto: o dono revisa no iPhone, e problemas como palavra quebrada no meio, texto apagado por um efeito ou estouro de largura só aparecem olhando.
5. **Commit** em português: o título diz o que mudou para quem visita, e o corpo traz tópicos curtos. Use as linhas de atribuição que a sessão pedir. Depois, `git push origin main`; isso publica.
6. **Confira no ar:** `bash .claude/skills/landing-ia-para-professores/scripts/conferir-publicado.sh .` compara o site com o arquivo local (leva cerca de 45 s) e testa a imagem da prévia e o certificado.
7. **Responda ao dono:** o que mudou, em linguagem simples; mande as capturas; diga o resultado dos testes e o que ele precisa fazer. Aponte divergências com o documento e cuidados legais.

Publicação, DNS e problemas comuns (GitHub Pages, Hostinger, certificado, prévia do WhatsApp): `references/publicacao.md`.

## Como trabalhar com o dono

- Escreva em português do Brasil, simples, sem jargão técnico. Ele acompanha pelo celular (iPhone) e dita por voz: "legend" é landing, "balistec" é ballestech. Interprete pelo contexto e diga como entendeu.
- Ele prefere ação. O que é reversível (editar, commitar, publicar, adicionar registro DNS anotando os valores antigos) faça direto. O que é irreversível (apagar branch, arquivo ou site, resetar o DNS, mexer em registros de e-mail, qualquer compra) só com o "sim" dele.
- Quando ele disser "me diz antes de fazer", dê a opinião com uma recomendação e não altere nada até ele confirmar.
- Se ele disser que a página "está parada", provavelmente abriu pela pré-visualização de arquivos do iPhone, que não roda JavaScript. Peça para abrir o endereço no Safari.
- Antes de cortar ou acrescentar seções, consulte `references/historico.md`. Várias ideias já foram testadas e descartadas, cada uma por um motivo.

## Pendências atuais (`"[PREENCHER]"` no CONFIG)

`checkoutUrl`, `parcelamento`, `formasPagamento`, `certificado` (carga horária), `suporte`, `professor.foto`, `depoimentos` (só reais), `dataEncerramento` (só se houver), `respostaCursosGratuitos`, `cnpj`, `email`, `pixelId`. Ao preencher um deles, confira se o trecho que dependia dele apareceu e se os testes de `CONFIG` (seção J de `testes/conteudo.js`) continuam passando.

## Referências

- `references/arquitetura.md`: seções na ordem, campos do `CONFIG`, funções, animações, paleta e tipografia.
- `references/testes.md`: o que cada suíte confere, medição de contraste, capturas, testes instáveis e como corrigi-los.
- `references/publicacao.md`: GitHub Pages, DNS na Hostinger, prévia do WhatsApp, verificação e solução de problemas.
- `references/historico.md`: decisões tomadas, o que foi removido e por quê.
