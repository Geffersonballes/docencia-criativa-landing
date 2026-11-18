// Confere a posição do quadro "Para quem é" (logo abaixo do botão de compra e do preço).
// Uso: node testes/para-quem.js index.html
const { chromium } = require('playwright');
const ARQ = require('path').resolve(process.argv[2] || 'index.html');
(async () => {
  const b = await chromium.launch(); let falhas = 0;
  for (const w of [360, 414, 1280]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 800 } })).newPage();
    await p.goto('file://' + ARQ); await p.waitForTimeout(600);
    const d = await p.evaluate(w => {
      const para = document.querySelector('#para-quem'), acao = document.querySelector('.topo .acao'), ag = document.querySelector('#mapa');
      const pos = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      const rp = para.getBoundingClientRect(), ra = acao.getBoundingClientRect(), rg = ag.getBoundingClientRect();
      return { dentroDoTopo: !!para.closest('.topo'), ordem: pos(acao, para) && pos(para, ag),
        titulos: [...document.querySelectorAll('h2')].filter(h => /Para quem é/.test(h.textContent)).length,
        itens: para.querySelectorAll('.sim li').length + '+' + para.querySelectorAll('.nao li').length,
        distancia: Math.round(rp.top - ra.bottom), mapaAbaixo: w < 960 ? rg.top > rp.bottom : rg.bottom <= rp.top + 1 };
    }, w);
    const ok = d.dentroDoTopo && d.ordem && d.titulos === 1 && d.itens === '4+3' && d.distancia >= 0 && d.distancia < (w < 960 ? 80 : 140) && d.mapaAbaixo;
    if (!ok) falhas++;
    console.log(w, ok ? 'ok' : 'FALHOU', JSON.stringify(d));
  }
  await b.close(); process.exit(falhas ? 1 : 0);
})();
