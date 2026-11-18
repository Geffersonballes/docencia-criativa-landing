// Grava a página em uso (celular vertical e desktop). Uso: node ferramentas/gravar-demo.js index.html testes/saida/video
// Depois converta cada .webm para .mp4, por exemplo:
//   ffmpeg -i entrada.webm -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart -an docs/demonstracao/pagina-animada-celular.mp4
const { chromium } = require('playwright');
const path = require('path');
const ARQ = path.resolve(process.argv[2] || 'index.html'), SAIDA = path.resolve(process.argv[3] || 'testes/saida/video');
(async () => {
  const b = await chromium.launch();
  for (const [nome, w, h] of (process.env.SO ? [['celular', 390, 844], ['desktop', 1280, 720]].filter(x => x[0] === process.env.SO) : [['celular', 390, 844], ['desktop', 1280, 720]])) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: w < 700, recordVideo: { dir: SAIDA + '/' + nome, size: { width: w, height: h } } });
    const p = await ctx.newPage();
    await p.goto('file://' + ARQ); await p.waitForTimeout(2200);
    const rolar = async (sel, m, espera) => { await p.evaluate(([s, m]) => { const el = document.querySelector(s); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - m, behavior: 'smooth' }); }, [sel, m]); await p.waitForTimeout(espera); };
    const centro = async sel => { const r = await p.locator(sel).first().boundingBox(); return r && [r.x + r.width / 2, r.y + r.height / 2]; };
    // cursor/dedo passeando pelas fitas, depois chegando ao botão de compra (fitas puxadas + título "falha")
    const yF = h * (w < 700 ? .55 : .7);
    for (let i = 0; i <= 18; i++) { await p.mouse.move(w * (.15 + i * .04), yF - Math.sin(i / 3) * 50); await p.waitForTimeout(45); }
    const cta = await centro('.topo .btn-compra');
    if (w >= 700 && cta) { for (let i = 1; i <= 10; i++) { await p.mouse.move(w * .85 + (cta[0] - w * .85) * i / 10, yF + (cta[1] - yF) * i / 10); await p.waitForTimeout(40); } await p.waitForTimeout(1400); }
    // mapa da formação: a luz percorre a trilha; depois a pessoa toca no Tema 7
    if (w < 700) { await rolar('#para-quem', 10, 2600); await rolar('#mapa', 10, 5200); } else await p.waitForTimeout(4200);
    await p.click('.tm[data-i="7"]'); await p.waitForTimeout(1800);
    await p.click('.tm[data-i="3"]'); await p.waitForTimeout(1800);
    await rolar('#dores', 10, 1600);
    await rolar('#demo', 10, 1000);
    await p.click('#demo-rodar'); await p.waitForTimeout(400);
    await rolar('#pedido', 20, 3200);
    await rolar('#fluxo', 10, 1400);
    if (w < 700) { for (let i = 0; i < 4; i++) { await p.evaluate(() => window.scrollBy({ top: innerHeight * .42, behavior: 'smooth' })); await p.waitForTimeout(750); } }
    else await rolar('#fluxo-etapas', h * .55, 1600);
    // "Contexto é rei": painel que cresce e o pedido que ganha contexto
    await rolar('#painel-contexto', h * .9, 300);
    await rolar('#painel-contexto', 40, 1800);
    await rolar('#ctx-range', h * .45, 3800);
    const faixa = await p.locator('#ctx-range').boundingBox();
    if (faixa) { await p.mouse.move(faixa.x + 4, faixa.y + faixa.height / 2); await p.mouse.down(); for (let i = 0; i <= 12; i++) { await p.mouse.move(faixa.x + 4 + (faixa.width - 8) * i / 12, faixa.y + faixa.height / 2); await p.waitForTimeout(110); } await p.mouse.up(); await p.waitForTimeout(1200); }
    await rolar('.bloom', 20, 1500);
    for (const n of [1, 3, 5]) { await p.click(`.nivel-btn[data-nivel="${n}"]`); await p.waitForTimeout(800); }
    await rolar('.formatos', 20, 900);
    for (const i of [1, 2]) { await p.click(`.op-formato[data-i="${i}"]`); await p.waitForTimeout(900); }
    await rolar('#modulos', 30, 1300);
    await p.click('#modulo-6 summary'); await p.waitForTimeout(1600);
    await rolar('#oferta', 20, 1800);
    await rolar('#garantia', 20, 1400);
    await rolar('#final', h * .9, 300);
    await rolar('#final', 0, 2600);
    await ctx.close();
  }
  await b.close();
})();
