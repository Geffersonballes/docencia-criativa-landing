// Capturas para revisão visual: iPhone 11 e desktop (1280 x 800), no topo e em cada seletor pedido.
// Uso: node capturas.js <index.html ou https://…> <pasta-de-saída> [seletor ...]
// Precisa do Playwright. Dentro do repositório: NODE_PATH=node_modules node <caminho>/capturas.js …
// Sai com código 1 se houver erro no console da página.
const { chromium, devices } = require('playwright');
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
  const erros = [];
  const telas = [['iphone', devices['iPhone 11']], ['desktop', { viewport: { width: 1280, height: 800 } }]];
  for (const [nome, opcoes] of telas) {
    const pagina = await (await navegador.newContext(opcoes)).newPage();
    pagina.on('pageerror', e => erros.push(nome + ': ' + e.message));
    pagina.on('console', m => { if (m.type() === 'error') erros.push(nome + ': ' + m.text()); });
    await pagina.goto(url);
    // a página rola de forma suave; aqui a rolagem precisa ser instantânea para a captura cair no lugar certo
    await pagina.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await pagina.waitForTimeout(1800);
    const alvos = seletores.length ? ['(topo)'].concat(seletores) : ['(topo)'];
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
  if (erros.length) {
    console.log('Erros no console:\n' + erros.join('\n'));
    process.exitCode = 1;
  }
})();
