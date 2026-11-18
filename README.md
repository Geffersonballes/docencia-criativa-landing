# Docência Criativa · página de vendas

Página de vendas do curso **Docência Criativa: Tecnologias e IA na Prática** (Módulos 1 e 2), com o Prof. Romário Costa, vendido pela Hotmart.

É um único arquivo, `index.html`, com HTML, CSS e JavaScript juntos. Não usa frameworks nem bibliotecas externas e pesa cerca de 170 KB. Funciona em qualquer hospedagem de site estático.

Veja a página em uso: [no celular](docs/demonstracao/pagina-animada-celular.mp4) · [no computador](docs/demonstracao/pagina-animada-desktop.mp4).

## O que tem aqui

| Caminho | O que é |
|---|---|
| `index.html` | A página inteira |
| `previa.jpg` | Imagem da prévia no WhatsApp e nas redes (1200 × 630), feita a partir da capa do curso |
| `conteudo/aulas.json` | Módulos, temas e os títulos das 69 aulas, extraídos do documento do curso (usado pelos testes) |
| `testes/` | Testes automáticos: conteúdo, acessibilidade, interações, contraste e posição do quadro "Para quem é" |
| `ferramentas/gravar-demo.js` | Grava os vídeos da página em uso |
| `docs/demonstracao/` | Vídeos da página no celular e no computador |

## Regra de conteúdo

A página só afirma o que está no documento do curso (o conteúdo programático). É isso que evita objeções, cancelamentos e pedidos de reembolso.

O documento em si não fica neste repositório, porque ele é público e o documento traz o conteúdo das aulas. Guarde-o num lugar privado (por exemplo, o Drive) e, se quiser deixá-lo ao lado da página, coloque em `conteudo/`: arquivos `.docx` dessa pasta já são ignorados pelo Git.

- Nada de depoimentos, números de alunos, resultados, selos ou parcelamentos inventados.
- Urgência só aparece com uma data real (`dataEncerramento`).
- A garantia de 7 dias é apresentada como o direito do art. 49 do Código de Defesa do Consumidor, não como vantagem do curso.
- A IA faz o rascunho e o professor decide: a página sempre deixa a validação pedagógica com o educador.

Se o curso mudar, mude o documento e o `CONFIG` juntos.

## Como editar

Os dados ficam no objeto `CONFIG`, no começo do `<script>` principal do `index.html`: preço, link de compra, módulos, temas e aulas, professor, garantia, rodapé e Pixel. A contagem de aulas é automática.

Onde o valor ainda é `"[PREENCHER]"`, a página mostra o marcador em destaque e, quando faz sentido, esconde o trecho (depoimentos, suporte, urgência).

### Ainda falta preencher

| Campo no `CONFIG` | O que é |
|---|---|
| `checkoutUrl` | Link do checkout da Hotmart. Enquanto estiver vazio, os botões levam para a oferta |
| `parcelamento` e `formasPagamento` | Ex.: "ou 10x de R$ 11,64 no cartão" e "Pix, cartão de crédito e boleto" |
| `certificado` | Carga horária e como o certificado é emitido |
| `suporte` | Canal e horário de atendimento |
| `professor.foto` | Endereço da foto do professor |
| `depoimentos` | Só depoimentos reais. Enquanto estiver vazio, a seção não aparece |
| `dataEncerramento` | Data real de encerramento das vendas, se houver |
| `respostaCursosGratuitos` | Resposta de uma pergunta do FAQ |
| `cnpj` e `email` | Rodapé |
| `pixelId` | ID do Meta Pixel. Vazio = o Pixel não carrega |

Depois de publicar, ative a prévia do WhatsApp: no `<head>` há um bloco comentado com `og:url` e `og:image` e as instruções. O WhatsApp só lê endereços completos (com `https://`).

### Links de compra

Todos os botões de compra usam `CONFIG.checkoutUrl`. Eles repassam ao checkout os parâmetros `utm_*`, `src` e `sck` do anúncio e o parâmetro de perfil (`?perfil=…`), sem mudar o conteúdo da página.

## Publicar

Envie `index.html` e `previa.jpg` para a mesma pasta de qualquer hospedagem de site estático. Depois ative as tags de prévia (veja acima).

As animações dependem do JavaScript. A pré-visualização de arquivos do iPhone, por exemplo, não roda JavaScript e mostra a página parada. Para ver a página como o visitante vai ver, abra o endereço publicado num navegador.

## Testes

Precisa de Node.js 18 ou mais novo.

```bash
npm install
npx playwright install chromium   # só na primeira vez, se o Chromium ainda não estiver instalado
npm test                          # HTML válido, conteúdo igual ao documento, acessibilidade, interações e posição
```

Outros comandos:

```bash
npm run validar     # só a validação do HTML
npm run contraste   # contraste do texto sobre o fundo animado (precisa de Python 3 com Pillow: pip install pillow)
npm run video       # grava a página em uso em testes/saida/video (converta para .mp4 com ffmpeg)
```

O que os testes conferem:

- Títulos dos módulos, temas e as 69 aulas iguais ao documento.
- Nenhum erro no console e nenhum pedido externo (o Pixel só carrega com `pixelId` preenchido).
- Botões de compra com os parâmetros do anúncio.
- Acessibilidade com o axe, ordem de foco pelo teclado e foco visível.
- Nenhuma rolagem lateral em 9 larguras de tela, com a letra normal e no tamanho máximo.
- As animações e interações: o mapa da formação, "Contexto é rei", Bloom e o painel final.
- Versão sem movimento (quem ativa "reduzir movimento" vê tudo pronto e parado).
- Desempenho ao rolar.

## Acessibilidade e desempenho

- Contraste AA, inclusive sobre o fundo animado.
- Botões com pelo menos 48 px de altura e navegação completa pelo teclado.
- Botões A− e A+ para aumentar a letra.
- Respeita "reduzir movimento" do aparelho.
- Pensada primeiro para celular (a partir de 320 px de largura).
- No celular, a animação do fundo roda a 30 quadros por segundo para poupar bateria.
