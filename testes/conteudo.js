// Conteúdo igual ao documento do curso, acessibilidade (axe), teclado, links de compra e larguras de tela.
// Uso: node testes/conteudo.js index.html conteudo/aulas.json
const { chromium } = require('playwright');
const fs = require('fs');
const ARQ = require('path').resolve(process.argv[2] || 'index.html');
const DOC = JSON.parse(fs.readFileSync(process.argv[3] || 'conteudo/aulas.json', 'utf8'));
const HTML = fs.readFileSync(ARQ, 'utf8');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = 'https://pagina.teste/';

let ok = 0; const falhas = [];
const confere = (nome, cond, extra) => { if (cond) ok++; else falhas.push(nome + (extra !== undefined ? ' → ' + JSON.stringify(extra).slice(0, 600) : '')); };
const variante = trocas => { let s = HTML; for (const [de, para] of trocas) { if (!s.includes(de)) throw new Error('não achei: ' + de); s = s.replace(de, para); } return s; };

async function abrir(browser, { html = HTML, query = '', w = 360, h = 640, calmo = false, pixelStub = false, letra = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: calmo ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const log = { erros: [], pedidos: [] };
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) log.erros.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => log.erros.push('pageerror: ' + e.message));
  if (letra !== null) await page.addInitScript(l => { try { localStorage.setItem('iapp-letra', String(l)); } catch (e) {} }, letra);
  await ctx.route('**/*', route => {
    const u = route.request().url();
    log.pedidos.push(u);
    if (u.startsWith(BASE)) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
    if (u.includes('connect.facebook.net') && pixelStub) return route.fulfill({ contentType: 'text/javascript', body: 'window.__pixelCarregou = true;' });
    if (u.startsWith('https://pay.hotmart.com')) return route.fulfill({ contentType: 'text/html', body: '<title>checkout</title>ok' });
    return route.abort();
  });
  await page.goto(BASE + query);
  await page.waitForTimeout(150);
  return { ctx, page, log };
}
const abrirTudo = async page => {
  for (const f of await page.$$('.faq-p')) await f.click();
  for (const s of await page.$$('.modulo summary')) await s.click();
  await page.click('#priv-btn');
};

// Restos do briefing que não estão no documento
const PROIBIDO = /10 a 15 minutos|tela gravada|suporte humano|licenciatura|est[aá]gio|\bTCC\b|curso online|assistente pessoal|corrigir|na correção|plano de aula|semana|noites|domingo|calculadora|horas por mês|Qual é o seu momento|leveza|sem termos técnicos|prova com gabarito|atividade adaptada|Sei ensinar|falta tempo|Dou aula/i;
const H1 = 'Docência Criativa: Tecnologias e IA na Prática';
const PREFIXO = /^(Adobe Express|Gemini|Agente Avaliativo|Geração de Imagens|CapCut|Musicalizando a Infância|O Desafio da Multiplicação) - /;
const REDES = ['https://www.instagram.com/prof.romariocosta/', 'https://www.tiktok.com/@prof.romariocosta', 'https://www.youtube.com/@engajadamente'];
const ORDEM_BLOOM = ['Lembrar', 'Entender', 'Aplicar', 'Analisar', 'Avaliar', 'Criar'];

(async () => {
  const browser = await chromium.launch();

  /* 0. Prévia no WhatsApp: og:url, og:image e canonical com o endereço do arquivo CNAME */
  {
    const path = require('path'), cname = path.join(path.dirname(ARQ), 'CNAME');
    const dominio = fs.existsSync(cname) ? fs.readFileSync(cname, 'utf8').trim() : null;
    const meta = p => (HTML.match(new RegExp('<meta property="' + p + '" content="([^"]+)"')) || [])[1];
    const canon = (HTML.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    const url = 'https://' + dominio + '/';
    confere('[prévia] og:url, og:image e canonical com o endereço publicado (CNAME)', !!dominio && meta('og:url') === url && canon === url && meta('og:image') === url + 'previa.jpg' && fs.existsSync(path.join(path.dirname(ARQ), 'previa.jpg')) && !HTML.includes('SEU-DOMINIO'), { dominio, url: meta('og:url'), canon, img: meta('og:image') });
  }

  /* A. Uma única versão: parâmetros de anúncio não mudam o conteúdo */
  for (const w of [360, 1280]) {
    let base = null;
    for (const query of ['', '?perfil=graduando', '?perfil=experiente&utm_source=ig']) {
      const t = `[versão ${w} ${query || 'sem parâmetro'}] `;
      const { ctx, page, log } = await abrir(browser, { query, w, h: w === 360 ? 640 : 800 });
      const d = await page.evaluate(() => ({
        h1: document.querySelector('h1').textContent,
        ctas: [...document.querySelectorAll('a.btn-compra')].map(a => a.textContent.replace('→', '').trim()),
        hrefs: [...document.querySelectorAll('a.btn-compra')].map(a => a.getAttribute('href')),
        perfis: document.querySelectorAll('.perfil-btn,[data-perfil],[data-t]').length,
        calc: !!document.querySelector('#calculadora,input[type=range]:not(.ctx-range)'),
        fatos: (document.querySelector('#olho-topo .sr') || document.querySelector('#olho-topo')).textContent,
        sw: document.documentElement.scrollWidth, iw: window.innerWidth,
        letra: document.documentElement.dataset.letra,
        marcadores: document.querySelectorAll('mark.todo').length,
        escondidos: ['#depoimentos'].every(s => document.querySelector(s).hidden) && [...document.querySelectorAll('.urgencia')].every(x => x.hidden),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => !h.startsWith('#')),
        fbq: typeof window.fbq,
        vazios: [...document.querySelectorAll('[data-c]')].filter(x => !x.textContent.trim()).map(x => x.getAttribute('data-c')),
        ctaFundo: Math.round(document.querySelector('.topo .btn-compra').getBoundingClientRect().bottom),
        pendente: !document.querySelector('.pendente').hidden,
        main: (() => { const c = document.querySelector('main').cloneNode(true); c.querySelectorAll('[aria-hidden="true"],#mapa,#ctx-pedido').forEach(x => x.remove()); document.body.appendChild(c); const t = c.innerText; c.remove(); return t; })(),
      }));
      confere(t + 'sem erros no console', log.erros.length === 0, log.erros);
      confere(t + 'sem pedidos externos', log.pedidos.filter(u => !u.startsWith(BASE)).length === 0, log.pedidos);
      confere(t + 'título com o nome do documento', d.h1 === H1, d.h1);
      confere(t + 'sem seletor de perfil e sem calculadora', d.perfis === 0 && !d.calc, d.perfis);
      confere(t + '6 botões de compra "Quero fazer a formação"', d.ctas.length === 6 && d.ctas.every(c => c === 'Quero fazer a formação'), d.ctas);
      confere(t + 'sem checkout, botões levam à oferta e o aviso aparece', d.hrefs.every(h => h === '#oferta') && d.pendente, d.hrefs);
      confere(t + 'etiqueta do topo com a estrutura da formação', d.fatos === 'formação continuada / 69 aulas / módulo 1 + 8 temas + bônus', d.fatos);
      confere(t + 'sem rolagem horizontal', d.sw <= d.iw, [d.sw, d.iw]);
      confere(t + 'letra normal', d.letra === '0', d.letra);
      confere(t + 'marcadores [PREENCHER] visíveis', d.marcadores >= 8, d.marcadores);
      confere(t + 'depoimentos e urgência escondidos', d.escondidos);
      confere(t + 'links de saída só para as 3 redes do professor', d.links.length === 3 && d.links.every(h => REDES.includes(h)), d.links);
      confere(t + 'pixel não carregado', d.fbq === 'undefined');
      confere(t + 'nenhum dado vazio', d.vazios.length === 0, d.vazios);
      if (w === 360) confere(t + 'botão de compra na primeira dobra (640 px)', d.ctaFundo <= 640, d.ctaFundo);
      if (base === null) base = d.main; else confere(t + 'conteúdo igual ao da versão sem parâmetro', d.main === base);
      await abrirTudo(page);
      const texto = await page.evaluate(() => [document.querySelector('header').innerText, document.querySelector('main').innerText, document.querySelector('#final').innerText, document.querySelector('#fixo').innerText].join('\n'));
      confere(t + 'sem o nome antigo "IA para Professores"', !/IA para Professores/.test(texto + await page.title()));
      confere(t + 'nenhum resto do briefing', !PROIBIDO.test(texto), (texto.match(new RegExp('.{0,40}(' + PROIBIDO.source + ').{0,40}', 'i')) || [])[0]);
      confere(t + 'sem "undefined", "null", "NaN" ou {chave}', !/undefined|\bnull\b|NaN|\{[\w.]+\}/.test(texto), (texto.match(/.{20}(undefined|\bnull\b|NaN|\{[\w.]+\}).{20}/) || [])[0]);
      const pequenos = await page.evaluate(() => [...document.querySelectorAll('button, a.btn-compra, summary')].filter(b => b.offsetParent !== null).map(b => ({ t: (b.textContent || b.id).trim().slice(0, 30), h: Math.round(b.getBoundingClientRect().height) })).filter(x => x.h < 48));
      confere(t + 'alvos de toque com 48 px ou mais', pequenos.length === 0, pequenos);
      await ctx.close();
    }
  }

  /* B. Módulos, temas e aulas iguais ao documento */
  {
    const { ctx, page, log } = await abrir(browser, { w: 1280, h: 900 });
    const cards = await page.evaluate(() => [...document.querySelectorAll('.modulo')].map(c => ({
      rotulo: c.querySelector('.modulo-n').textContent, titulo: c.querySelector('.modulo-tit').textContent,
      resumo: c.querySelector('.modulo-qtd').textContent, aberto: c.querySelector('details').open,
      aulas: [...c.querySelectorAll('.aulas li')].map(li => [li.querySelector('b').textContent, li.querySelector('span').textContent]),
    })));
    confere('[aulas] 10 cartões (Módulo 1, 8 temas, Bônus), fechados', cards.length === 10 && cards.every(c => !c.aberto), cards.length);
    const rotulos = ['Módulo 1'].concat([1, 2, 3, 4, 5, 6, 7, 8].map(n => 'Módulo 2 · Tema ' + n), ['Módulo Bônus']);
    confere('[aulas] rótulos na ordem do documento', JSON.stringify(cards.map(c => c.rotulo)) === JSON.stringify(rotulos), cards.map(c => c.rotulo));
    DOC.forEach((m, i) => {
      const c = cards[i] || { titulo: '', aulas: [], resumo: '' };
      const titulo = m.titulo.replace(/^FÁBRICA DE CONTEÚDOS/, 'Fábrica de Conteúdos');
      confere(`[aulas] título de "${titulo}" igual ao documento`, c.titulo === titulo, c.titulo);
      const esperado = m.aulas.map(a => ['Aula ' + String(a.n).padStart(2, '0'), a.titulo.replace(PREFIXO, '')]);
      confere(`[aulas] ${m.aulas.length} aulas de "${titulo}" iguais ao documento`, JSON.stringify(c.aulas) === JSON.stringify(esperado), c.aulas.filter((a, j) => JSON.stringify(a) !== JSON.stringify(esperado[j])));
      confere(`[aulas] "${m.aulas.length} aulas" na linha do tema`, c.resumo === m.aulas.length + ' aulas', c.resumo);
    });
    confere('[aulas] total de 69', cards.reduce((s, c) => s + c.aulas.length, 0) === 69);
    await page.focus('.modulo summary'); await page.keyboard.press('Enter');
    confere('[aulas] cartão abre pelo teclado', await page.evaluate(() => document.querySelector('.modulo details').open));
    const inc = await page.evaluate(() => [...document.querySelectorAll('#incluso li')].map(x => x.innerText));
    confere('[oferta] lista do que está incluso', inc.length === 7 && inc[0] === 'Módulo 1 · Fundamentando o Treinamento (7 aulas)' && inc[1] === 'Módulo 2 · Fábrica de Conteúdos: 8 temas e 60 aulas' && inc[5].includes('[PREENCHER]') && !inc.some(x => /Suporte/.test(x)) && /7 dias para desistir/.test(inc[6]), inc);
    confere('[oferta] bônus do documento', (await page.textContent('#bonus')).startsWith('Módulo Bônus · O Desafio da Multiplicação: Ferramentas Pedagógicas (2 aulas).'));
    const prof = await page.textContent('#quem-ensina');
    confere('[quem ensina] bio do documento, sem "Como trabalha"', prof.includes('idealizador da formação Docência Criativa') && prof.includes('Aulas Engajadoras') && prof.includes('O conhecimento é um lugar') && !prof.includes('Como trabalha'));
    const pq = await page.evaluate(() => ({ cred: [...document.querySelectorAll('#prof-cred li')].map(l => l.textContent), redes: document.querySelector('.prof-redes').textContent, nome: document.querySelector('.prof-nome').textContent, links: document.querySelectorAll('#quem-ensina a').length, golpe: document.querySelector('#faq-r-golpe').textContent }));
    confere('[quem ensina] nome com idade, 6 credenciais, graduado pela UFMT (não "estudante")', pq.nome === 'Prof. Romário Costa, 39 anos' && pq.cred.length === 6 && pq.cred.includes('Graduado em Tecnologia Educacional pela UFMT') && !prof.includes('estudante'), pq);
    const rd = await page.evaluate(() => [...document.querySelectorAll('#quem-ensina a.rede')].map(a => ({ href: a.getAttribute('href'), alvo: a.target, rel: a.rel, nome: a.textContent })));
    confere('[quem ensina] Instagram, TikTok e YouTube clicáveis, em aba nova, com aviso para leitor de tela; FAQ cita as três redes', /Instagram @prof\.romariocosta/.test(pq.redes) && /TikTok @prof\.romariocosta/.test(pq.redes) && /YouTube @engajadamente/.test(pq.redes) && rd.length === 3 && JSON.stringify(rd.map(r => r.href)) === JSON.stringify(REDES) && rd.every(r => r.alvo === '_blank' && /noopener/.test(r.rel) && r.nome.includes('(abre em nova aba)')) && pq.golpe.includes('TikTok como @prof.romariocosta') && pq.golpe.includes('YouTube como @engajadamente'), { pq, rd });
    const pr = await page.evaluate(() => ({ chip: document.querySelector('.topo .nota-chip').textContent.replace(/\s+/g, ' ').trim(), oferta: document.querySelector('.preco-de').textContent + ' ' + document.querySelector('.preco').textContent, final: document.querySelector('#final .acao-nota').textContent.replace(/\s+/g, ' ').trim(), fixo: document.querySelector('.fixo-preco').textContent, faq: document.querySelector('#faq-r-parcelar').textContent, riscado: [...document.querySelectorAll('s[data-c="precoDe"]')].filter(x => x.offsetParent !== null || x.closest('.fixo')).length }));
    confere('[preço] "de R$ 197,00 por R$ 97,00 à vista" no topo, na oferta, no final, na barra fixa e no FAQ', pr.chip.startsWith('de R$ 197,00 por R$ 97,00 à vista') && pr.oferta.startsWith('de R$ 197,00 por R$ 97,00') && pr.final.startsWith('de R$ 197,00 por R$ 97,00 à vista') && pr.fixo === 'de R$ 197,00R$ 97,00à vista' && pr.faq.startsWith('Preço: de R$ 197,00 por R$ 97,00 à vista.'), pr);
    const bloom = await page.textContent('.bloom');
    confere('[bloom] seis níveis e menção ao Tema 5, sem correção', ORDEM_BLOOM.every(n => bloom.includes(n)) && bloom.includes('No Tema 5') && !/corrig|correção/.test(bloom));
    confere('[B] sem erros', log.erros.length === 0, log.erros);
    await ctx.close();
  }

  /* C. Demonstração */
  {
    const { ctx, page, log } = await abrir(browser, { w: 360, h: 700 });
    const pressed = await page.evaluate(() => [...document.querySelectorAll('.op[aria-pressed="true"]')].map(o => o.dataset.valor).join(','));
    confere('[demo] começa em Matemática, 5º ano, itens', pressed === 'mat,5,itens', pressed);
    confere('[demo] três materiais, sem plano de aula', (await page.evaluate(() => [...document.querySelectorAll('#ops-tarefa .op')].map(o => o.textContent).join('|'))) === 'Itens avaliativos (Bloom)|Roteiro de vídeo curto|Letra de música');
    await page.click('#demo-rodar');
    await page.waitForTimeout(250);
    const p1 = (await page.textContent('#pedido-txt')).length;
    await page.waitForTimeout(350);
    const p2 = (await page.textContent('#pedido-txt')).length;
    confere('[demo] o pedido é "digitado" aos poucos', p1 > 0 && p2 > p1 && !(await page.isVisible('#folha')), [p1, p2]);
    await page.waitForSelector('#folha:not([hidden])', { timeout: 9000 });
    let d = await page.evaluate(() => ({ t: document.querySelector('.r-titulo').textContent, pedido: document.querySelector('#pedido-txt').textContent, sr: document.querySelector('#pedido-sr').textContent, status: document.querySelector('#demo-status').textContent, sug: document.querySelector('#demo-sugestao').textContent, revise: document.querySelector('#revise-txt').textContent, topo: document.querySelector('#pedido').getBoundingClientRect().top }));
    confere('[demo] resultado padrão', d.t === 'Itens avaliativos · Frações na reta numérica' && /EF05MA03/.test(d.pedido) && /Taxonomia de Bloom/.test(d.pedido) && /justificativa pedagógica/.test(d.pedido) && d.pedido === d.sr, d);
    confere('[demo] avisos e sugestão', d.status.startsWith('Rascunho pronto') && d.sug === 'Ver também: roteiro de vídeo curto' && /reflete o nível de Bloom pretendido/.test(d.revise), d);
    confere('[demo] rola até o pedido no celular', d.topo > -40 && d.topo < 360, d.topo);
    await page.click('#demo-sugestao');
    await page.waitForSelector('#folha:not([hidden])', { timeout: 9000 });
    d = await page.evaluate(() => ({ t: document.querySelector('.r-titulo').textContent, p: document.querySelector('.op[data-valor="roteiro"]').getAttribute('aria-pressed'), sug: document.querySelector('#demo-sugestao').textContent }));
    confere('[demo] sugestão leva ao roteiro e depois à música', d.t.startsWith('Roteiro de vídeo curto') && d.p === 'true' && d.sug === 'Ver também: letra de música', d);
    await page.click('.op[data-valor="his"]');
    await page.waitForSelector('#folha:not([hidden])', { timeout: 9000 });
    confere('[demo] trocar de opção refaz o pedido', (await page.textContent('.r-titulo')).includes('Criança também é cidadã'));
    confere('[demo] sem erros', log.erros.length === 0, log.erros);
    await ctx.close();
  }
  {
    const { ctx, page, log } = await abrir(browser, { w: 1280, h: 800, calmo: true });
    await page.click('#demo-rodar');
    confere('[demo] menos movimento: resultado imediato', await page.evaluate(() => !document.querySelector('#folha').hidden && document.querySelector('#pedido-txt').textContent.length > 100));
    const combos = [];
    for (const disc of ['lp', 'mat', 'cie', 'his']) for (const ano of ['5', '7', '9']) for (const tarefa of ['itens', 'roteiro', 'musica']) {
      await page.click(`.op[data-valor="${disc}"]`); await page.click(`.op[data-chave="ano"][data-valor="${ano}"]`); await page.click(`.op[data-valor="${tarefa}"]`);
      await page.waitForTimeout(10);
      combos.push(await page.evaluate(([disc, ano, tarefa]) => {
        const c = document.querySelector('#folha-corpo'), t = c.textContent, p = document.querySelector('#pedido-txt').textContent;
        const bncc = (p.match(/E[FM]\d\d[A-Z]{2}\d\d/) || [''])[0];
        const r = { id: disc + ano + tarefa, ok: !document.querySelector('#folha').hidden && t.length > 200, bncc, anoOk: p.includes(ano + 'º ano') && t.includes(ano + 'º ano'), bnccOk: !!bncc && t.includes(bncc), cru: /\*\*|^#|\n#|~ |"|\[B\d\]/.test(t + p) };
        if (tarefa === 'itens') {
          r.niveis = [...c.querySelectorAll('.nivel')].map(n => n.textContent);
          r.formatos = /Complete com as palavras do quadro/.test(t) && /Marque V para verdadeiro ou F para falso/.test(t) && /Relacione/.test(t) && c.querySelectorAll('.alts').length === 4 && c.querySelectorAll('.r-lista li').length === 4 && t.startsWith('Itens avaliativos · ');
        }
        if (tarefa === 'roteiro') r.partes = [...c.querySelectorAll('p > strong')].map(s => s.textContent).join('|') === 'Saudação:|Gancho:|Conteúdo:|Fechamento:' && /no máximo 5 linhas/.test(p);
        if (tarefa === 'musica') r.partes = /\[Verso\]/.test(t) && /\[Refrão\]/.test(t) && c.querySelectorAll('.r-verso').length >= 8 && /Suno AI/.test(p);
        return r;
      }, [disc, ano, tarefa]));
    }
    confere('[demo] 36 combinações com resultado', combos.length === 36 && combos.every(c => c.ok), combos.filter(c => !c.ok));
    confere('[demo] ano e BNCC batem', combos.every(c => c.anoOk && c.bnccOk), combos.filter(c => !(c.anoOk && c.bnccOk)));
    confere('[demo] sem marcação crua nem aspas retas', combos.every(c => !c.cru), combos.filter(c => c.cru));
    confere('[demo] itens: 4 níveis de Bloom crescentes', combos.filter(c => c.niveis).every(c => { const pos = c.niveis.map(n => ORDEM_BLOOM.indexOf(n)); return pos.length === 4 && pos.every(x => x >= 0) && pos.every((x, i) => i === 0 || x > pos[i - 1]); }), combos.filter(c => c.niveis).map(c => c.niveis));
    confere('[demo] itens nos 4 formatos do curso, com gabarito', combos.filter(c => c.niveis).every(c => c.formatos), combos.filter(c => c.niveis && !c.formatos).map(c => c.id));
    confere('[demo] roteiro e música na estrutura do curso', combos.filter(c => c.partes !== undefined).every(c => c.partes), combos.filter(c => c.partes === false).map(c => c.id));
    confere('[demo] 12 códigos BNCC distintos', new Set(combos.map(c => c.bncc)).size === 12);
    confere('[demo 36] sem erros', log.erros.length === 0, log.erros);
    await ctx.close();
  }

  /* D. FAQ */
  {
    const { ctx, page } = await abrir(browser, {});
    const ids = await page.evaluate(() => [...document.querySelectorAll('.faq-p')].map(b => b.id.replace('faq-p-', '')).join(','));
    confere('[faq] 15 perguntas, na ordem', ids === 'paraquem,ferramentas,pagas,bloom,substitui,generica,celular,aulas,praticas,certificado,gratuitos,parcelar,golpe,acesso,garantia', ids);
    const r = id => page.evaluate(id => ({ exp: document.querySelector('#faq-p-' + id).getAttribute('aria-expanded'), hid: document.querySelector('#faq-r-' + id).hidden, txt: document.querySelector('#faq-r-' + id).innerText }), id);
    await page.click('#faq-p-aulas');
    let d = await r('aulas');
    confere('[faq] abre com clique; contagem de aulas', d.exp === 'true' && !d.hid && d.txt.startsWith('São 69 aulas: 7 no Módulo 1, 60 nos 8 temas do Módulo 2 e 2 no Módulo Bônus.'), d);
    await page.focus('#faq-p-aulas'); await page.keyboard.press('Enter');
    d = await r('aulas');
    confere('[faq] fecha com Enter', d.exp === 'false' && d.hid);
    await page.focus('#faq-p-pagas'); await page.keyboard.press('Space');
    d = await r('pagas');
    confere('[faq] abre com Espaço; ferramentas pagas explicadas', d.exp === 'true' && /versão gratuita, com limites/.test(d.txt) && /não estão incluídas no valor do curso/.test(d.txt) && /2 TB/.test(d.txt), d.txt);
    const todos = await page.evaluate(() => [...document.querySelectorAll('.faq-r')].map(x => x.textContent).join(' '));
    confere('[faq] gratuitos e certificado continuam [PREENCHER]', (await r('gratuitos')).txt.trim() === '[PREENCHER]' && (await r('certificado')).txt.includes('[PREENCHER]'));
    confere('[faq] garantia cita o art. 49 do CDC', /art\. 49/.test(todos));
    await ctx.close();
  }

  /* E. Botão fixo */
  {
    const { ctx, page } = await abrir(browser, { w: 360, h: 640 });
    const fixo = () => page.evaluate(() => { const f = document.querySelector('#fixo'); return { on: f.classList.contains('on'), vis: getComputedStyle(f).visibility, inert: f.inert, hid: f.getAttribute('aria-hidden') }; });
    let d = await fixo();
    confere('[fixo] escondido na primeira dobra', !d.on && d.vis === 'hidden' && d.inert && d.hid === 'true', d);
    await page.evaluate(() => document.querySelector('#aprender').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(500);
    d = await fixo();
    confere('[fixo] aparece depois da primeira dobra', d.on && d.vis === 'visible' && !d.inert && d.hid === 'false', d);
    await page.evaluate(() => document.querySelector('#oferta .btn-compra').scrollIntoView({ behavior: 'instant', block: 'center' })); await page.waitForTimeout(500);
    confere('[fixo] some com o botão da oferta à vista', !(await fixo()).on);
    await ctx.close();
    const b = await abrir(browser, { w: 1280, h: 800 });
    await b.page.evaluate(() => document.querySelector('#aprender').scrollIntoView({ behavior: 'instant' })); await b.page.waitForTimeout(400);
    confere('[fixo] não existe no desktop', await b.page.evaluate(() => getComputedStyle(document.querySelector('#fixo')).display === 'none'));
    await b.ctx.close();
  }

  /* F. Checkout */
  {
    const v = variante([['checkoutUrl: "[PREENCHER]"', 'checkoutUrl: "https://pay.hotmart.com/TESTE123?off=abc"']]);
    const { ctx, page } = await abrir(browser, { html: v, query: '?perfil=anuncio-7&utm_source=instagram&utm_campaign=docencia%20criativa&UTM_Medium=cpc&src=a7&sck=stories&fbclid=XYZ&outro=1' });
    const hrefs = await page.evaluate(() => [...document.querySelectorAll('a.btn-compra')].map(a => a.href));
    const u = new URL(hrefs[0]);
    confere('[checkout] 6 botões com o mesmo link', hrefs.length === 6 && hrefs.every(x => x === hrefs[0]), hrefs);
    confere('[checkout] repassa utm_*, src, sck e perfil do anúncio', u.origin + u.pathname === 'https://pay.hotmart.com/TESTE123' && u.searchParams.get('off') === 'abc' && u.searchParams.get('utm_source') === 'instagram' && u.searchParams.get('utm_campaign') === 'docencia criativa' && u.searchParams.get('UTM_Medium') === 'cpc' && u.searchParams.get('src') === 'a7' && u.searchParams.get('sck') === 'stories' && u.searchParams.get('perfil') === 'anuncio-7', hrefs[0]);
    confere('[checkout] não repassa outros parâmetros', !u.searchParams.has('fbclid') && !u.searchParams.has('outro'));
    confere('[checkout] aviso de link pendente some', await page.evaluate(() => document.querySelector('.pendente').hidden));
    await Promise.all([page.waitForURL(/pay\.hotmart\.com/), page.click('.topo .btn-compra')]);
    confere('[checkout] o clique leva ao checkout', page.url().startsWith('https://pay.hotmart.com/TESTE123'));
    await ctx.close();
    for (const [q, esp] of [['', 'geral'], ['?perfil=%3Cscript%3E', 'geral'], ['?perfil=sobrecarregado', 'sobrecarregado']]) {
      const g = await abrir(browser, { html: v, query: q });
      confere('[checkout] perfil ' + (q || 'ausente') + ' → ' + esp, new URL(await g.page.getAttribute('.topo .btn-compra', 'href')).searchParams.get('perfil') === esp);
      await g.ctx.close();
    }
  }

  /* G. Meta Pixel */
  {
    const v = variante([['pixelId: "[PREENCHER]"', 'pixelId: "1234567890"']]);
    const { ctx, page, log } = await abrir(browser, { html: v, pixelStub: true, query: '?perfil=anuncio-7' });
    const fila = () => page.evaluate(() => (window.fbq && window.fbq.queue || []).map(a => Array.from(a)));
    confere('[pixel] carrega só com ID', log.pedidos.includes('https://connect.facebook.net/en_US/fbevents.js') && await page.evaluate(() => window.__pixelCarregou === true));
    confere('[pixel] init + PageView', JSON.stringify(await fila()) === JSON.stringify([['init', '1234567890'], ['track', 'PageView']]));
    await page.click('.topo .btn-compra');
    await page.click('#oferta .btn-compra');
    const q = await fila();
    confere('[pixel] um InitiateCheckout por clique, com perfil e posição', q.length === 4 && q[2][1] === 'InitiateCheckout' && q[2][2].perfil === 'anuncio-7' && q[2][2].posicao === 'topo' && q[2][2].value === 97 && q[2][2].currency === 'BRL' && q[2][2].content_name === 'Docência Criativa: Tecnologias e IA na Prática' && q[3][2].posicao === 'oferta', q);
    confere('[pixel] sem eventos de perfil', !q.some(e => e[0] === 'trackCustom'));
    confere('[pixel] política de privacidade atualizada', /Pixel da Meta/.test(await page.textContent('#priv-pixel')) && !/perfil/.test(await page.textContent('#priv-pixel')));
    confere('[pixel] sem erros', log.erros.length === 0, log.erros);
    await ctx.close();
  }

  /* H. Letra (A− / A+) */
  {
    const { ctx, page } = await abrir(browser, { w: 360, h: 640 });
    const tam = () => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    confere('[letra] texto base de 18 px', (await tam()) === 18 && await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.sub')).fontSize) >= 18));
    for (let i = 0; i < 3; i++) await page.click('#letra-mais');
    let d = await page.evaluate(() => ({ dis: document.querySelector('#letra-mais').getAttribute('aria-disabled'), salvo: localStorage.getItem('iapp-letra'), sw: document.documentElement.scrollWidth }));
    confere('[letra] máximo de 24 px, salvo, sem rolagem horizontal', (await tam()) === 24 && d.dis === 'true' && d.salvo === '3' && d.sw <= 360, d);
    await page.click('#demo-rodar'); await page.waitForSelector('#folha:not([hidden])', { timeout: 9000 }); await abrirTudo(page);
    confere('[letra] no máximo, com tudo aberto, sem rolagem horizontal', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
    await page.reload(); await page.waitForTimeout(150);
    confere('[letra] lembrado ao recarregar', (await tam()) === 24);
    await page.click('#letra-menos');
    confere('[letra] A− diminui', (await tam()) === 22);
    await ctx.close();
  }

  /* I. Teclado */
  {
    const { ctx, page } = await abrir(browser, { w: 1280, h: 800 });
    await page.keyboard.press('Tab');
    confere('[teclado] primeiro Tab: pular para o conteúdo', await page.evaluate(() => document.activeElement.className === 'pular' && document.activeElement.getBoundingClientRect().top >= 0));
    const ordem = [];
    for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); ordem.push(await page.evaluate(() => { const a = document.activeElement, s = getComputedStyle(a); return (a.id || a.className || a.tagName).split(' ')[0] + '|' + s.outlineStyle + '|' + parseFloat(s.outlineWidth); })); }
    confere('[teclado] ordem de foco', ordem.map(o => o.split('|')[0]).join(' ') === 'btn-compra letra-menos letra-mais btn-compra link-demo tm tm tm tm', ordem);
    confere('[teclado] foco visível (3 px)', ordem.every(o => o.endsWith('|solid|3')), ordem);
    await ctx.close();
  }

  /* J. Variações do CONFIG */
  {
    const futuro = new Date(Date.now() + 3.5 * 864e5).toISOString();
    const v = variante([
      ['depoimentos: "[PREENCHER]"', 'depoimentos: [{ nome: "Maria <b>Teste</b>", cargo: "Professora de teste", texto: "Texto de teste." }, { nome: "", texto: "sem nome" }]'],
      ['foto: "[PREENCHER]"', 'foto: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'],
      ['dataEncerramento: "[PREENCHER]"', `dataEncerramento: "${futuro}"`],
      ['parcelamento: "[PREENCHER]"', 'parcelamento: "ou 10x de teste"'],
      ['suporte: "[PREENCHER]"', 'suporte: "WhatsApp, de segunda a sexta"'],
    ]);
    const { ctx, page, log } = await abrir(browser, { html: v });
    const d = await page.evaluate(() => ({
      depo: !document.querySelector('#depoimentos').hidden, n: document.querySelectorAll('.depo').length, txt: document.querySelector('.depo').textContent, inj: !!document.querySelector('.depo b'),
      foto: document.querySelector('#prof-foto img') && document.querySelector('#prof-foto img').alt,
      urg: [...document.querySelectorAll('.urgencia')].map(x => !x.hidden + ' ' + x.textContent),
      parc: document.querySelector('[data-c="parcelamento"]').textContent,
      sup: [...document.querySelectorAll('#incluso li')].map(x => x.textContent).filter(x => x.startsWith('Suporte')),
    }));
    confere('[config] depoimentos só com nome e texto, sem HTML injetado', d.depo && d.n === 1 && d.txt.includes('Maria <b>Teste</b>') && !d.inj, d);
    confere('[config] foto com texto alternativo', d.foto === 'Foto do Prof. Romário Costa', d.foto);
    confere('[config] urgência com data real futura', d.urg.length === 2 && d.urg.every(u => u.startsWith('true') && u.includes('Faltam 4 dias')), d.urg);
    confere('[config] parcelamento e suporte preenchidos aparecem', d.parc === 'ou 10x de teste' && d.sup.length === 1 && d.sup[0] === 'Suporte: WhatsApp, de segunda a sexta', d);
    confere('[config] sem erros', log.erros.length === 0, log.erros);
    await ctx.close();
    const sd = await abrir(browser, { html: variante([['precoDe: "R$ 197,00",', 'precoDe: "",']]) });
    const sdd = await sd.page.evaluate(() => ({ vis: [...document.querySelectorAll('.preco-de-txt')].filter(x => !x.hidden).length, chip: document.querySelector('.topo .nota-chip').innerText.replace(/\s+/g, ' ').trim(), faq: document.querySelector('#faq-r-parcelar').textContent }));
    confere('[config] sem preço "de", a página mostra só o preço à vista', sdd.vis === 0 && sdd.chip.startsWith('R$ 97,00 à vista') && sdd.faq.startsWith('Preço: R$ 97,00 à vista.'), sdd);
    await sd.ctx.close();
    const p = await abrir(browser, { html: variante([['dataEncerramento: "[PREENCHER]"', 'dataEncerramento: "2020-01-01T00:00:00-03:00"']]) });
    confere('[config] data passada não mostra urgência', await p.page.evaluate(() => [...document.querySelectorAll('.urgencia')].every(x => x.hidden)));
    await p.ctx.close();
  }

  /* K. Acessibilidade automática (axe-core) */
  for (const w of [360, 1280]) {
    const { ctx, page } = await abrir(browser, { w, h: 800, calmo: true });
    await page.click('#demo-rodar'); await abrirTudo(page);
    await page.evaluate(() => document.querySelector('#aprender').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(350);
    await page.addScriptTag({ content: AXE });
    const r = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map(v => ({ id: v.id, n: v.nodes.length, ex: v.nodes.slice(0, 2).map(n => n.target.join(' ')) })));
    confere(`[axe ${w}] sem violações`, r.length === 0, r);
    await ctx.close();
  }

  /* L. Larguras: 9 telas × letra normal e máxima, com tudo aberto */
  const estouros = [];
  for (const w of [320, 360, 390, 412, 600, 768, 1024, 1280, 1920]) for (const letra of [0, 3]) {
    const { ctx, page, log } = await abrir(browser, { w, h: 800, calmo: true, letra });
    await page.click('#demo-rodar'); await page.click('.op[data-valor="lp"]'); await page.click('.op[data-valor="itens"]'); await abrirTudo(page);
    const d = await page.evaluate(() => { const iw = document.documentElement.clientWidth; return { sw: document.documentElement.scrollWidth, iw, fora: [...document.querySelectorAll('body *')].filter(e => { if (e.closest('.sr,.pular,#fixo,svg,.anel')) return false; const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > iw + 1 || r.left < -1); }).map(e => String(e.id || e.className || e.tagName)).slice(0, 4) }; });
    if (d.sw > d.iw || d.fora.length || log.erros.length) estouros.push({ w, letra, ...d, erros: log.erros });
    await ctx.close();
  }
  confere('[larguras] nenhum estouro em 18 combinações', estouros.length === 0, estouros);

  console.log(`${ok} verificações passaram, ${falhas.length} falharam`);
  falhas.forEach(f => console.log('FALHOU: ' + f));
  await browser.close();
  process.exit(falhas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
