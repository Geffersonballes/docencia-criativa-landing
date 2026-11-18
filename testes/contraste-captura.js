// Mede o fundo por trás de cada texto (com o céu de fitas animado) em várias posições da página.
// Para cada posição: 1) guarda a cor e as caixas do texto; 2) esconde o texto (cor transparente,
// sem sombra); 3) tira a captura do fundo. O cálculo do contraste é feito em contraste-calculo.py.
// Uso: node testes/contraste-captura.js index.html testes/saida/contraste  (HALO=1 conta o halo dos textos)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ARQ = path.resolve(process.argv[2] || 'index.html'), SAIDA = path.resolve(process.argv[3] || 'testes/saida/contraste');
fs.mkdirSync(SAIDA, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const resumo = [];
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto('file://' + ARQ);
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await p.waitForTimeout(1500);
    const altura = await p.evaluate(() => document.documentElement.scrollHeight);
    // percorre a página uma vez para revelar tudo
    for (let y = 0; y <= altura; y += h / 2) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(70); }
    await p.waitForTimeout(1600);
    let k = 0;
    for (let y = 0; y < altura - h / 3; y += h * .5, k++) {
      for (const momento of [0, 1]) {
        await p.evaluate(y => window.scrollTo(0, y), y);
        await p.waitForTimeout(momento ? 900 : 350);
        const coletar = () => p.evaluate(() => {
          const out = [], vw = innerWidth, vh = innerHeight;
          const andar = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let n;
          while ((n = andar.nextNode())) {
            const el = n.parentElement;
            if (!n.textContent.trim() || !el || el.closest('.sr,[aria-hidden="true"],script,style,noscript,.fixo,.intro,svg,.todo')) continue;
            const s = getComputedStyle(el);
            if (s.visibility === 'hidden' || +s.opacity < .99) continue;
            if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) continue;
            const r = document.createRange(); r.selectNodeContents(n);
            for (const q of r.getClientRects()) {
              if (q.width < 4 || q.height < 4 || q.bottom < 0 || q.top > vh || q.right < 0 || q.left > vw) continue;
              out.push({ x: Math.max(0, q.left), y: Math.max(0, q.top), w: Math.min(vw, q.right) - Math.max(0, q.left), h: Math.min(vh, q.bottom) - Math.max(0, q.top),
                cor: s.color, fs: parseFloat(s.fontSize), peso: +s.fontWeight || 400, sombra: s.textShadow !== 'none', txt: n.textContent.trim().slice(0, 40), sel: (el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')) });
            }
          }
          return out;
        });
        const antes = await coletar();
        const estilo = await p.addStyleTag({ content: 'body *{color:transparent!important;-webkit-text-fill-color:transparent!important;' + (process.env.HALO ? '' : 'text-shadow:none!important;') + 'caret-color:transparent!important;text-decoration-color:transparent!important}.todo,.chips li,.fatos li{border-color:transparent!important}.progresso,.fixo,.anel{visibility:hidden!important}' });
        await p.waitForTimeout(40);
        const nome = `w${w}_y${k}_${momento}`;
        await p.screenshot({ path: `${SAIDA}/${nome}.png` });
        await estilo.evaluate(e => e.remove());
        // descarta caixas que mudaram (cor ou posição) durante a captura: estado animado, não fundo
        const depois = new Set((await coletar()).map(c => [c.txt, Math.round(c.x), Math.round(c.y), c.cor].join('|')));
        const caixas = antes.filter(c => depois.has([c.txt, Math.round(c.x), Math.round(c.y), c.cor].join('|')));
        fs.writeFileSync(`${SAIDA}/${nome}.json`, JSON.stringify(caixas));
        resumo.push(nome);
      }
    }
    await ctx.close();
  }
  fs.writeFileSync(`${SAIDA}/indice.json`, JSON.stringify(resumo));
  console.log('capturas:', resumo.length);
  await b.close();
})();
