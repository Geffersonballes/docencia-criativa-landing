// Conferência visual: Playwright em 375 px (celular) e 1280 px (desktop).
// Para cada tela: zero erros no console, scrollWidth igual à largura e prints do topo e de cada seletor pedido.
// Uso: node capturas.js <index.html ou https://…> <pasta-de-saída> [seletor ...]
// Precisa do Playwright. Dentro do repositório: NODE_PATH=node_modules node <caminho>/capturas.js …
// Sai com código 1 se houver erro no console ou conteúdo vazando na lateral.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const [alvo, saida, ...seletores] = process.argv.slice(2);
if (!alvo || !saida) {
  console.error('Uso: node capturas.js <index.html|https://…> <pasta> [seletor ...]');
  process.exit(2);
}
const url = /^https?:\/\//.test(alvo) ? alvo : 'file://' + path.resolve(alvo);
fs.mkdirSync(saida, { recursive: true });

(async () => {
  const navegador = await chromium.launch();
  const problemas = [];
  const telas = [
    ['celular', { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
    ['desktop', { viewport: { width: 1280, height: 800 } }],
  ];
  for (const [nome, opcoes] of telas) {
    const pagina = await (await navegador.newContext(opcoes)).newPage();
    pagina.on('pageerror', e => problemas.push(`${nome}: erro na página: ${e.message}`));
    pagina.on('console', m => { if (m.type() === 'error') problemas.push(`${nome}: erro no console: ${m.text()}`); });
    await pagina.goto(url);
    // a página rola de forma suave; aqui a rolagem precisa ser instantânea para a captura cair no lugar certo
    await pagina.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await pagina.waitForTimeout(1800);
    const larguras = await pagina.evaluate(() => ({ conteudo: document.documentElement.scrollWidth, tela: document.documentElement.clientWidth }));
    const ok = larguras.conteudo <= larguras.tela;
    console.log(`${nome}: scrollWidth ${larguras.conteudo} / largura ${larguras.tela} ${ok ? 'ok' : 'VAZANDO NA LATERAL'}`);
    if (!ok) problemas.push(`${nome}: conteúdo vazando na lateral (${larguras.conteudo} > ${larguras.tela})`);
    const alvos = ['(topo)'].concat(seletores);
    for (const [i, seletor] of alvos.entries()) {
      if (seletor !== '(topo)') {
        const achou = await pagina.evaluate(s => {
          const el = document.querySelector(s);
          if (!el) return false;
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16, behavior: 'instant' });
          return true;
        }, seletor);
        if (!achou) { console.log(`${nome}: não achei ${seletor}`); continue; }
        await pagina.waitForTimeout(1500); // tempo para revelar e animar
      }
      const arquivo = path.join(saida, `${nome}-${String(i + 1).padStart(2, '0')}.png`);
      await pagina.screenshot({ path: arquivo });
      console.log(`${arquivo}  ${seletor}`);
    }
  }
  await navegador.close();
  if (problemas.length) {
    console.log('PROBLEMAS:\n' + problemas.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('sem erros no console e nada vazando na lateral');
  }
})();
