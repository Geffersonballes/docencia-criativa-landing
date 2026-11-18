// Animações e interações: céu de fitas, mapa da formação, contexto, Bloom, painel final, versão sem movimento,
// teclado e desempenho. Uso: node testes/interacoes.js index.html
const { chromium } = require('playwright');
const fs = require('fs');
const ARQ = require('path').resolve(process.argv[2] || 'index.html');
let ok = 0; const falhas = [];
const confere = (nome, cond, extra) => { if (cond) ok++; else falhas.push(nome + (extra !== undefined ? ' → ' + JSON.stringify(extra).slice(0, 500) : '')); };

async function abrir(b, { w = 390, h = 844, calmo = false, espera = 400 } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: calmo ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); const erros = [];
  p.on('console', m => { if (['error', 'warning'].includes(m.type()) && !/willReadFrequently/.test(m.text())) erros.push(m.text()); });
  p.on('pageerror', e => erros.push(e.message));
  await p.goto('file://' + ARQ);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.waitForTimeout(espera);
  return { ctx, p, erros };
}
const ir = (p, sel, m = 0) => p.evaluate(([s, m]) => { const el = document.querySelector(s); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - m, behavior: 'instant' }); }, [sel, m]);
const assinatura = (p, sel) => p.evaluate(s => { const c = document.querySelector(s), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0, n = 0; for (let i = 0; i < d.length; i += 389) { h = (h * 31 + d[i]) | 0; if (i % 4 === 3 && d[i] > 10) n++; } return { h, n }; }, sel);

(async () => {
  const b = await chromium.launch();

  /* A. Com movimento */
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const t = `[palco ${w}] `;
    const { ctx, p, erros } = await abrir(b, { w, h, espera: 150 });
    // abertura
    let d = await p.evaluate(() => {
      const btn = document.querySelector('.topo .btn-compra'), r = btn.getBoundingClientRect();
      const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { intro: document.documentElement.classList.contains('com-intro'), alvo: !!(el && el.closest('.btn-compra')) };
    });
    confere(t + 'abertura aparece na primeira visita e não bloqueia o botão', d.intro && d.alvo, d);
    await p.waitForTimeout(1300);
    confere(t + 'abertura some sozinha', !(await p.evaluate(() => document.documentElement.classList.contains('com-intro'))));
    await p.reload(); await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' }); await p.waitForTimeout(200);
    confere(t + 'abertura só uma vez por sessão', !(await p.evaluate(() => document.documentElement.classList.contains('com-intro'))));
    await p.waitForTimeout(900);
    // céu de fitas
    const c1 = await assinatura(p, '#ceu'); await p.waitForTimeout(400); const c2 = await assinatura(p, '#ceu');
    confere(t + 'céu de fitas desenhado e em movimento', c1.n > 50 && c1.h !== c2.h, [c1, c2]);
    const fixo = await p.evaluate(() => { const c = document.querySelector('#ceu'), s = getComputedStyle(c); return s.position === 'fixed' && Math.abs(c.getBoundingClientRect().height - innerHeight) < 2; });
    confere(t + 'céu fixo atrás da página inteira', fixo);
    // etiqueta decodificada e título com eco
    d = await p.evaluate(() => { const o = document.querySelector('#olho-topo'); return { sr: o.querySelector('.sr') && o.querySelector('.sr').textContent, vis: o.querySelector('[aria-hidden]') && o.querySelector('[aria-hidden]').textContent }; });
    confere(t + 'etiqueta do topo decodificada até o texto final (leitor de tela lê o texto certo)', d.sr === 'formação continuada / 69 aulas / módulo 1 + 8 temas + bônus' && d.vis === d.sr, d);
    const eco = await p.evaluate(() => getComputedStyle(document.querySelector('#aprender-t .pl')).textShadow);
    confere(t + 'títulos ainda não vistos guardam o eco (fantasma)', /\d+(\.\d+)?px/.test(eco) && eco !== 'none', eco);
    // mapa da formação no topo
    await ir(p, '#mapa', 20); await p.waitForTimeout(400);
    d = await p.evaluate(() => {
      const bs = [...document.querySelectorAll('#mc-trilha .tm')], r = bs.map(b => b.getBoundingClientRect());
      return { n: bs.length, rot: bs.map(b => b.querySelector('small').textContent), total: document.querySelector('#mc-total').textContent,
        zigue: r[0].left < r[1].left && r[2].left > r[3].left && Math.abs(r[1].left - r[2].left) < 2 && r[4].left < r[5].left && r[6].left > r[7].left && r[8].left < r[9].left,
        trilha: !!document.querySelector('#mc-linhas .base').getAttribute('d') };
    });
    const ROT = ['Módulo 1 · 7 aulas', 'Tema 1 · 4 aulas', 'Tema 2 · 2 aulas', 'Tema 3 · 6 aulas', 'Tema 4 · 4 aulas', 'Tema 5 · 9 aulas', 'Tema 6 · 11 aulas', 'Tema 7 · 18 aulas', 'Tema 8 · 6 aulas', 'Bônus · 2 aulas'];
    confere(t + 'mapa: 10 etapas na ordem do documento, com as aulas de cada uma e total 69', d.n === 10 && JSON.stringify(d.rot) === JSON.stringify(ROT) && d.total === '69', d);
    confere(t + 'mapa: trilha em zigue-zague desenhada', d.zigue && d.trilha, d);
    await p.waitForTimeout(5200);
    const ACUM = [7, 11, 13, 19, 23, 32, 43, 61, 67, 69];
    d = await p.evaluate(() => { const bs = [...document.querySelectorAll('.tm')], i = bs.findIndex(b => b.getAttribute('aria-pressed') === 'true'), luz = document.querySelector('#mc-linhas .luz');
      return { i, on: bs.filter(b => b.classList.contains('on')).length, n: document.querySelector('#mc-n').textContent, item: [...document.querySelectorAll('.mc-item')].findIndex(x => x.classList.contains('ativo')), off: parseFloat(luz.style.strokeDashoffset), L: parseFloat(luz.style.strokeDasharray) }; });
    confere(t + 'mapa: a luz avança sozinha, acende as etapas e soma as aulas', d.i >= 1 && d.on === d.i + 1 && d.item === d.i && +d.n === ACUM[d.i] && d.off < d.L, d);
    await p.click('.tm[data-i="7"]'); await p.waitForTimeout(3600);
    d = await p.evaluate(() => { const a = document.querySelector('.mc-item.ativo'); return { i: [...document.querySelectorAll('.tm')].findIndex(b => b.getAttribute('aria-pressed') === 'true'), tag: a.querySelector('.mc-tag').textContent, tit: a.querySelector('.mc-tit').textContent, n: document.querySelector('#mc-n').textContent, anuncio: document.querySelector('#mc-anuncio').textContent, vis: [...document.querySelectorAll('.mc-item')].filter(x => getComputedStyle(x).visibility === 'visible').length }; });
    confere(t + 'mapa: tocar no Tema 7 mostra o tema, soma 61 aulas e para a troca automática', d.i === 7 && d.tag === 'Módulo 2 · Tema 7 · 18 aulas' && d.tit === 'CapCut: O Caldeirão da Produção Educacional' && d.n === '61' && d.anuncio.startsWith('Módulo 2 · Tema 7, 18 aulas: CapCut') && d.vis === 1, d);
    await p.click('.mc-item.ativo .mc-link'); await p.waitForTimeout(700);
    d = await p.evaluate(() => { const m = document.querySelector('#modulo-7'), r = m.getBoundingClientRect(); return { aberto: m.querySelector('details').open, topo: Math.round(r.top), hash: location.hash }; });
    confere(t + 'mapa: "Ver as 18 aulas" leva ao Tema 7 na lista e abre as aulas', d.aberto && d.topo >= -2 && d.topo < 200 && d.hash === '#modulo-7', d);
    await p.evaluate(() => { document.querySelector('#modulo-7 details').open = false; history.replaceState(null, '', location.pathname); });
    // contexto é rei
    await ir(p, '#painel-contexto', 30); await p.waitForTimeout(6000);
    d = await p.evaluate(() => ({ v: document.querySelector('#ctx-range').value, txt: document.querySelector('#ctx-pedido').textContent, z: document.querySelector('#painel-contexto').style.getPropertyValue('--z') }));
    confere(t + 'pedido ganha contexto sozinho até o fim; painel cresce', d.v === '4' && d.txt.includes('EF05MA03') && d.txt.includes('APENAS') && +d.z === 1, d);
    await p.fill('#ctx-range', '1'); await p.dispatchEvent('#ctx-range', 'input');
    d = await p.evaluate(() => ({ txt: document.querySelector('#ctx-pedido').textContent, vt: document.querySelector('#ctx-range').getAttribute('aria-valuetext'), live: document.querySelector('#ctx-pedido').getAttribute('aria-live') }));
    confere(t + 'arrastar para 1 deixa só "para o 5º ano"', d.txt === 'Faça uma atividade sobre frações para o 5º ano.' && d.vt === '1 de 4 informações de contexto' && d.live === 'polite', d);
    // Bloom em colunas 3D (telas maiores)
    await ir(p, '.bloom', 20); await p.waitForTimeout(1800);
    if (w >= 700) {
      d = await p.evaluate(() => [...document.querySelectorAll('.col3d')].map(c => ({ h: Math.round(c.getBoundingClientRect().height), t: getComputedStyle(c).transform })));
      confere(t + 'colunas 3D de Bloom crescem do Lembrar ao Criar', d.length === 6 && d.every((c, i) => c.t === 'none' && (i === 0 || c.h > d[i - 1].h)), d);
    }
    // painel final e botões que puxam as fitas
    await ir(p, '#painel-final', 40); await p.waitForTimeout(500);
    d = await p.evaluate(() => { const b = getComputedStyle(document.querySelector('#painel-final .btn-compra')); return { z: document.querySelector('#painel-final').style.getPropertyValue('--z'), bg: b.backgroundColor, cor: b.color }; });
    confere(t + 'painel final cresce e o botão fica escuro sobre o degradê', +d.z === 1 && d.bg === 'rgb(6, 10, 51)' && d.cor === 'rgb(255, 255, 255)', d);
    if (w >= 700) {
      await ir(p, '#topo', 0); await p.waitForTimeout(200);
      await p.hover('.topo .btn-compra'); await p.waitForTimeout(80);
      confere(t + 'encostar no botão do topo faz o título "falhar"', await p.evaluate(() => document.querySelector('#titulo').classList.contains('glitch')));
      await p.mouse.move(300, 300); await p.waitForTimeout(250);
      d = await p.evaluate(() => { const a = document.querySelector('#anel'); return { on: a.classList.contains('on'), tf: a.style.transform }; });
      const xy = (d.tf.match(/translate3d\(([\d.]+)px, ([\d.]+)px/) || []).slice(1).map(Number);
      confere(t + 'anel segue o cursor', d.on && xy.length === 2 && Math.abs(xy[0] - 300) < 60 && Math.abs(xy[1] - 300) < 60, d);
    }
    // rolar a página toda em passos: tudo aparece
    await p.evaluate(async () => { for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight / 2) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(1800);
    d = await p.evaluate(() => ({ ocultos: [...document.querySelectorAll('[data-revelar]')].filter(e => getComputedStyle(e).opacity !== '1').map(e => e.className).slice(0, 5), dec: [...document.querySelectorAll('[data-decodificar]')].filter(e => e._dec === undefined ? false : e.querySelector('[aria-hidden]').textContent !== e.querySelector('.sr').textContent).length, sw: document.documentElement.scrollWidth }));
    confere(t + 'ao rolar até o fim, tudo aparece e decodifica, sem rolagem lateral', d.ocultos.length === 0 && d.dec === 0 && d.sw <= w, d);
    confere(t + 'sem erros no console', erros.length === 0, erros);
    await ctx.close();
  }

  /* B. Sem movimento */
  {
    const { ctx, p, erros } = await abrir(b, { calmo: true, espera: 300 });
    const c1 = await assinatura(p, '#ceu'); await p.waitForTimeout(700); const c2 = await assinatura(p, '#ceu');
    const d = await p.evaluate(() => ({
      anima: document.documentElement.classList.contains('js-anima'), intro: document.documentElement.classList.contains('com-intro'),
      ocultos: [...document.querySelectorAll('[data-revelar],[data-palavras] .pl')].filter(e => getComputedStyle(e).opacity !== '1').length,
      mapa: [document.querySelectorAll('.tm.on').length, document.querySelector('#mc-n').textContent, [...document.querySelectorAll('.mc-item')].findIndex(x => x.classList.contains('ativo')), parseFloat(document.querySelector('#mc-linhas .luz').style.strokeDashoffset)].join(),
      olho: document.querySelector('#olho-topo').textContent, ctx: document.querySelector('#ctx-range').value, anims: document.getAnimations().length,
    }));
    confere('[calmo] sem animação e sem abertura; tudo visível', !d.anima && !d.intro && d.ocultos === 0, d);
    confere('[calmo] etiqueta pronta e mapa com a trilha inteira acesa (69 aulas)', d.olho === 'formação continuada / 69 aulas / módulo 1 + 8 temas + bônus' && d.mapa === '10,69,0,0', d);
    confere('[calmo] céu desenhado uma vez e parado', c1.n > 50 && c1.h === c2.h, [c1, c2]);
    await ir(p, '#painel-contexto', 30); await p.waitForTimeout(4000);
    confere('[calmo] o pedido não avança sozinho', (await p.inputValue('#ctx-range')) === '0');
    await ir(p, '#mapa', 20); await p.waitForTimeout(3600);
    confere('[calmo] mapa não troca sozinho', (await p.evaluate(() => [...document.querySelectorAll('.mc-item')].findIndex(x => x.classList.contains('ativo')))) === 0);
    await p.click('.tm[data-i="4"]'); await p.waitForTimeout(200);
    confere('[calmo] tocar numa etapa mostra o tema', (await p.textContent('.mc-item.ativo .mc-tag')) === 'Módulo 2 · Tema 4 · 4 aulas');
    confere('[calmo] sem animações CSS rodando', d.anims === 0 && (await p.evaluate(() => document.getAnimations().length)) === 0);
    confere('[calmo] sem erros', erros.length === 0, erros);
    await ctx.close();
  }

  /* C. Script principal quebrado: o conteúdo aparece mesmo assim */
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    let html = fs.readFileSync(ARQ, 'utf8').replace('ligarMapa();\nmontarFluxo();', 'throw new Error("teste de falha");\nligarMapa();\nmontarFluxo();');
    await ctx.route('**/*', r => r.request().url().startsWith('https://pagina.teste/') ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: html }) : r.abort());
    await p.goto('https://pagina.teste/'); await p.waitForTimeout(2900);
    const d = await p.evaluate(() => ({ revela: document.documentElement.classList.contains('revela-tudo'), ocultos: [...document.querySelectorAll('[data-revelar]')].filter(e => getComputedStyle(e).opacity !== '1').length, intro: getComputedStyle(document.querySelector('.intro')).visibility }));
    confere('[segurança] script quebrado: conteúdo aparece em 2,5 s e a abertura some', d.revela && d.ocultos === 0 && d.intro === 'hidden', d);
    await ctx.close();
  }

  /* D. Teclado */
  {
    const { ctx, p } = await abrir(b, { w: 1280, h: 800, espera: 1500 });
    await p.focus('.tm[data-i="3"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
    const a1 = await p.textContent('.mc-item.ativo .mc-tag'), an = await p.textContent('#mc-anuncio');
    await p.focus('.mc-item.ativo .mc-link');
    const a0 = await p.evaluate(() => document.activeElement.textContent);
    await ir(p, '#painel-contexto', 30); await p.waitForTimeout(300);
    await p.focus('#ctx-range'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
    const a3 = await p.inputValue('#ctx-range');
    await p.focus('.tm[data-i="9"]');
    const foco = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle + ' ' + parseFloat(s.outlineWidth); });
    confere('[teclado] mapa, link das aulas e régua de contexto funcionam pelo teclado', a1 === 'Módulo 2 · Tema 3 · 6 aulas' && an.startsWith('Módulo 2 · Tema 3, 6 aulas') && a0.startsWith('Ver as 6 aulas') && +a3 >= 2 && foco === 'solid 3', { a1, an, a0, a3, foco });
    await ctx.close();
  }

  /* E. Desempenho */
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const { ctx, p } = await abrir(b, { w, h, espera: 1600 });
    const r = await p.evaluate(() => new Promise(res => {
      let n = 0, pior = 0, ant = performance.now(); const t0 = ant;
      (function f(t) { n++; pior = Math.max(pior, t - ant); ant = t; if (t - t0 < 3000) { window.scrollBy(0, 6); requestAnimationFrame(f); } else res({ fps: Math.round(n / 3), pior: Math.round(pior) }); })(t0);
    }));
    // este ambiente desenha sem placa de vídeo: no desktop a meta é menor que num aparelho real
    const meta = w < 700 ? 45 : 35;
    confere(`[desempenho ${w}] rolando com tudo animado: ≥ ${meta} quadros/s e nenhum quadro acima de 120 ms`, r.fps >= meta && r.pior < 120, r);
    console.log('desempenho', w, JSON.stringify(r));
    await ctx.close();
  }

  console.log(`${ok} verificações passaram, ${falhas.length} falharam`);
  falhas.forEach(f => console.log('FALHOU: ' + f));
  await b.close();
  process.exit(falhas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
