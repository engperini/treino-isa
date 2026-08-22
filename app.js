/* ══════════════════════════════════════════════════════════
   TREINO DA ISA — app offline
   ══════════════════════════════════════════════════════════ */

/* ── armazenamento (com reserva em memória) ─────────────── */
const mem = {};
const DB = {
  ler(k, def) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : (k in mem ? mem[k] : def); }
    catch (e) { return (k in mem) ? mem[k] : def; }
  },
  gravar(k, v) {
    mem[k] = v;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo memória */ }
  },
  limpar() { mem.sets = mem.pesos = mem.hist = undefined; try { localStorage.clear(); } catch (e) {} }
};

const S = {
  plano: DB.ler("plano", "ACADEMIA"),
  aba: "treinos",
  treino: null,
  sessao: null,
  sets: DB.ler("sets", {}),
  pesos: DB.ler("pesos", {}),
  hist: DB.ler("hist", []),
  corridas: DB.ler("corridas", []),
  medidas: DB.ler("medidas", [])
};
const salvar = () => { DB.gravar("sets", S.sets); DB.gravar("pesos", S.pesos); DB.gravar("hist", S.hist); DB.gravar("corridas", S.corridas); DB.gravar("medidas", S.medidas); DB.gravar("plano", S.plano); };
if (typeof migrarMedidas === "function") migrarMedidas();

/* ── utilidades ─────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const dia = d => new Date(d).toISOString().slice(0, 10);
const hoje = () => dia(Date.now());
const treinosDoPlano = () => PLANO[S.plano].treinos;
const achaTreino = id => [...PLANO.ACADEMIA.treinos, ...PLANO.CASA.treinos].find(t => t.id === id);
const chave = (tid, i) => tid + "|" + i;
const feitos = t => t.ex.reduce((n, ex, i) => n + (S.sets[chave(t.id, i)] || []).filter(Boolean).length, 0);
const totalSets = t => t.ex.reduce((n, ex) => n + ex.s, 0);
const vibrar = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

function aviso(txt) {
  const t = el("div", "toast", txt); document.body.appendChild(t);
  setTimeout(() => t.remove(), 1900);
}

/* ══════════════════════════════════════════════════════════
   BONECO ANIMADO
   ══════════════════════════════════════════════════════════ */
const SVGNS = "http://www.w3.org/2000/svg";
const PTS = ["h", "n", "p", "e1", "w1", "e2", "w2", "k1", "a1", "k2", "a2"];

function lerpPose(a, b, t) {
  const o = {};
  for (const k of PTS) o[k] = [a[k][0] + (b[k][0] - a[k][0]) * t, a[k][1] + (b[k][1] - a[k][1]) * t];
  return o;
}
const linha = (p, q, cls, w) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" class="${cls}" stroke-width="${w}" stroke-linecap="round"/>`;

function halter(x, y, vert) {
  return vert
    ? `<g class="load"><rect x="${x - 2.6}" y="${y - 11}" width="5.2" height="22" rx="2.4"/><rect x="${x - 6}" y="${y - 12}" width="12" height="5" rx="2"/><rect x="${x - 6}" y="${y + 7}" width="12" height="5" rx="2"/></g>`
    : `<g class="load"><rect x="${x - 11}" y="${y - 2.6}" width="22" height="5.2" rx="2.4"/><rect x="${x - 12}" y="${y - 6}" width="5" height="12" rx="2"/><rect x="${x + 7}" y="${y - 6}" width="5" height="12" rx="2"/></g>`;
}
function barra(x, y, meia) {
  return `<g class="load"><rect x="${x - meia}" y="${y - 2}" width="${meia * 2}" height="4" rx="2"/>` +
    `<rect x="${x - meia - 3}" y="${y - 10}" width="6" height="20" rx="2.5"/>` +
    `<rect x="${x + meia - 3}" y="${y - 10}" width="6" height="20" rx="2.5"/></g>`;
}

function equipar(tipo, P) {
  const [wx, wy] = P.w1, [w2x, w2y] = P.w2, [nx, ny] = P.n;
  switch (tipo) {
    case "db": return halter(wx, wy) + halter(w2x, w2y);
    case "db1": return halter(wx, wy);
    case "dbV": case "dbH": return halter((wx + w2x) / 2, (wy + w2y) / 2, tipo === "dbV");
    case "dbPeito": return halter((wx + w2x) / 2, (wy + w2y) / 2, true);
    case "bar": return barra(wx, wy, 30);
    case "barCostas": return barra(nx, ny + 2, 34);
    case "barLat": return barra(wx, wy, 36) + `<line x1="100" y1="12" x2="${wx}" y2="${wy}" class="gear"/>`;
    case "corda": return `<line x1="150" y1="22" x2="${wx}" y2="${wy - 4}" class="gear"/>` +
      `<path d="M${wx - 5} ${wy} l-3 9 M${wx + 5} ${wy} l3 9" class="gear"/>`;
    case "cabo": return `<line x1="186" y1="104" x2="${wx}" y2="${wy}" class="gear"/><circle cx="${wx}" cy="${wy}" r="4" class="load"/>`;
    case "pad": return `<circle cx="${P.a1[0]}" cy="${P.a1[1]}" r="7" class="load"/>`;
    case "padLat": return `<circle cx="${P.k1[0] - 9}" cy="${P.k1[1]}" r="6.5" class="load"/><circle cx="${P.k2[0] + 9}" cy="${P.k2[1]}" r="6.5" class="load"/>`;
    case "placa": return `<rect x="${P.k1[0] - 14}" y="${P.k1[1] - 12}" width="28" height="8" rx="4" class="load"/>`;
    default: return "";
  }
}

function corpo(P, art) {
  const g = [];
  // membros de trás
  g.push(linha(P.n, P.e2, "far", 6.5), linha(P.e2, P.w2, "far", 6));
  g.push(linha(P.p, P.k2, "far", 8), linha(P.k2, P.a2, "far", 7));
  // tronco
  g.push(linha(P.n, P.p, "near", 17));
  g.push(linha(P.h, P.n, "near", 7));
  // membros da frente
  g.push(linha(P.p, P.k1, "near", 9.5), linha(P.k1, P.a1, "near", 8));
  g.push(linha(P.n, P.e1, "near", 7.5), linha(P.e1, P.w1, "near", 7));
  g.push(`<circle cx="${P.h[0]}" cy="${P.h[1]}" r="11" class="head"/>`);
  g.push(equipar(art.equip, P));
  return g.join("");
}

const anims = [];
function pararAnims() { anims.forEach(id => cancelAnimationFrame(id)); anims.length = 0; }

function fazSvg(artId, animar) {
  const art = ARTES[artId] || ARTES.plank;
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.classList.add("fig");
  const cena = art.cena.map(s => s[0] === "rect"
    ? `<rect x="${s[1]}" y="${s[2]}" width="${s[3]}" height="${s[4]}" rx="${s[5] || 2}" class="gear"/>`
    : s[0] === "circle"
      ? `<circle cx="${s[1]}" cy="${s[2]}" r="${s[3]}" class="gear"/>`
      : `<line x1="${s[1]}" y1="${s[2]}" x2="${s[3]}" y2="${s[4]}" class="gear"/>`).join("");
  const gCena = document.createElementNS(SVGNS, "g"); gCena.innerHTML = cena;
  const gCorpo = document.createElementNS(SVGNS, "g");
  svg.append(gCena, gCorpo);

  const reduz = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!animar || reduz || typeof requestAnimationFrame !== "function") {
    gCorpo.innerHTML = corpo(art.b, art); return svg;
  }

  const dur = art.ritmo || 2400, t0 = performance.now();
  const slot = anims.push(0) - 1;
  (function quadro(now) {
    const u = ((now - t0) % dur) / dur;
    const ida = u < .5 ? u * 2 : (1 - u) * 2;
    const t = (1 - Math.cos(Math.PI * ida)) / 2;
    gCorpo.innerHTML = corpo(lerpPose(art.a, art.b, t), art);
    anims[slot] = requestAnimationFrame(quadro);
  })(t0);
  return svg;
}

/* ══════════════════════════════════════════════════════════
   DESCANSO
   ══════════════════════════════════════════════════════════ */
let tmr = null;
function descanso(seg) {
  pararDescanso();
  let resta = seg;
  const box = el("div", "timer", `<div class="t"></div><div class="rail"><i style="width:100%"></i></div>
    <button data-mais>+15s</button><button data-fecha>Pular</button>`);
  document.body.appendChild(box);
  const mostra = () => {
    box.querySelector(".t").textContent = `${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, "0")}`;
    box.querySelector(".rail i").style.width = (resta / seg * 100) + "%";
  };
  mostra();
  box.querySelector("[data-mais]").onclick = () => { resta += 15; seg = Math.max(seg, resta); mostra(); };
  box.querySelector("[data-fecha]").onclick = pararDescanso;
  tmr = { box, id: setInterval(() => {
    resta--;
    if (resta <= 0) { vibrar([180, 90, 180]); aviso("Descanso terminado. Bora!"); pararDescanso(); return; }
    mostra();
  }, 1000) };
}
function pararDescanso() { if (tmr) { clearInterval(tmr.id); tmr.box.remove(); tmr = null; } }

/* ══════════════════════════════════════════════════════════
   TELAS
   ══════════════════════════════════════════════════════════ */
const app = $("#app");

function render() {
  pararAnims();
  app.innerHTML = "";
  if (S.aba === "treinos") S.treino ? telaTreino() : telaInicio();
  if (S.aba === "corrida") telaCorrida();
  if (S.aba === "medidas") telaMedidas();
  if (S.aba === "progresso") telaProgresso();
  if (S.aba === "ajustes") telaAjustes();
  nav();
  window.scrollTo(0, 0);
}

/* ── início ─────────────────────────────────────────────── */
function telaInicio() {
  const h = new Date().getHours();
  const saudacao = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const top = el("header", "top", `
    <div class="hello"><div class="eyebrow">${saudacao}</div><h1>Treino da <span>Isa</span></h1></div>
    <div class="streak">🔥 ${sequencia()}<small>dias</small></div>`);
  app.append(top);

  const seg = el("div", "seg");
  for (const k of ["ACADEMIA", "CASA"]) {
    const b = el("button", "", PLANO[k].label);
    b.setAttribute("aria-selected", S.plano === k);
    b.onclick = () => { S.plano = k; salvar(); render(); };
    seg.append(b);
  }
  app.append(seg);

  const grid = el("div", "grid");
  for (const t of treinosDoPlano()) {
    const f = feitos(t), tot = totalSets(t), pct = Math.round(f / tot * 100);
    const ultima = S.hist.filter(x => x.id === t.id).pop();
    const c = el("button", "card c-" + t.cor, `
      <div class="letra">${t.letra}</div>
      <div style="flex:1;min-width:0">
        <h3>${t.nome}</h3>
        <p>${t.foco}</p>
        <div class="meta">
          <div class="bar"><i style="width:${pct}%"></i></div>
          <div class="pct">${f}/${tot} séries</div>
        </div>
      </div>
      ${ultima ? `<div class="tick">${quandoFoi(ultima.ts)}</div>` : ""}`);
    c.onclick = () => { S.treino = t.id; render(); };
    grid.append(c);
  }
  app.append(grid);
  app.append(el("p", "vazio", "Toque em um treino para começar. As séries ficam salvas mesmo sem internet."));
}

function quandoFoi(ts) {
  const d = Math.round((Date.now() - ts) / 864e5);
  return d <= 0 ? "hoje" : d === 1 ? "ontem" : `há ${d}d`;
}

/* ── treino ─────────────────────────────────────────────── */
function telaTreino() {
  const t = achaTreino(S.treino);
  const sub = el("div", "subhead");
  const back = el("button", "back", "←"); back.onclick = () => { S.treino = null; pararDescanso(); render(); };
  sub.append(back, el("div", "", `<div class="eyebrow">Treino ${t.letra} · ${PLANO[S.plano].label}</div><h2>${t.nome}</h2>`));
  app.append(sub);

  const f = feitos(t), tot = totalSets(t);
  const painel = el("div", "progresso", `
    <div class="row">
      <div class="n">${f}<small> / ${tot} séries</small></div>
      <div class="pct">${Math.round(f / tot * 100)}%</div>
    </div>
    <div class="bar" style="margin-top:11px"><i style="width:${f / tot * 100}%"></i></div>`);
  app.append(painel);

  t.ex.forEach((ex, i) => app.append(cardExercicio(t, ex, i)));

  const fim = el("button", "fim", f ? "Concluir treino" : "Marque uma série para começar");
  fim.disabled = !f;
  fim.onclick = () => concluir(t);
  app.append(fim);
}

function cardExercicio(t, ex, i) {
  const k = chave(t.id, i);
  const marc = S.sets[k] || (S.sets[k] = new Array(ex.s).fill(false));
  const done = marc.every(Boolean);
  const c = el("div", "ex" + (done ? " done" : ""));

  const head = el("div", "head");
  const thumb = el("button", "thumb");
  thumb.append(fazSvg(ex.art, false));
  thumb.onclick = () => modal(ex);
  const info = el("div", "", `
    <h4>${ex.n}</h4>
    ${ex.eq ? `<p class="eq">${ex.eq}</p>` : ""}
    <div class="chips">
      <span class="chip reps">${ex.s} × ${ex.r}</span>
      <span class="chip alvo">${ex.alvo}</span>
    </div>`);
  info.style.flex = "1"; info.style.minWidth = "0";
  head.append(thumb, info);
  c.append(head, el("p", "dica", ex.d));

  const sets = el("div", "sets", `<span class="lbl">Séries</span>`);
  for (let s = 0; s < ex.s; s++) {
    const b = el("button", "dot", String(s + 1));
    b.dataset.on = marc[s] ? "1" : "0";
    b.onclick = () => {
      marc[s] = !marc[s]; salvar(); vibrar(18);
      if (marc[s] && s < ex.s - 1) descanso(ex.tempo && ex.tempo > 120 ? 90 : 60);
      render();
      requestAnimationFrame(() => document.querySelectorAll(".ex")[i]?.scrollIntoView({ block: "center", behavior: "smooth" }));
    };
    sets.append(b);
  }
  const peso = el("div", "peso", `<input inputmode="decimal" placeholder="—" value="${S.pesos[k] ?? ""}"><span>kg</span>`);
  const inp = peso.querySelector("input");
  inp.onchange = () => { S.pesos[k] = inp.value.trim(); salvar(); };
  sets.append(peso);
  c.append(sets);
  return c;
}

function concluir(t) {
  const f = feitos(t);
  S.hist.push({ ts: Date.now(), id: t.id, plano: S.plano, nome: `Treino ${t.letra} · ${t.nome}`, sets: f, tot: totalSets(t) });
  t.ex.forEach((ex, i) => S.sets[chave(t.id, i)] = new Array(ex.s).fill(false));
  salvar(); pararDescanso(); vibrar([120, 60, 120]);
  S.treino = null; render();
  aviso(`Treino ${t.letra} concluído. ${f} séries 💪`);
}

/* ── modal ──────────────────────────────────────────────── */
function modal(ex) {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <div class="eyebrow">${ex.alvo}</div>
    <h2 style="margin:4px 0 14px;font-size:21px;letter-spacing:-.03em">${ex.n}</h2>`);
  const palco = el("div", "palco");
  const svg = fazSvg(ex.art, true);
  palco.append(svg);
  box.append(palco);

  const ctrl = el("div", "ctrl");
  const bLento = el("button", "", "Câmera lenta");
  const bPausa = el("button", "", "Pausar");
  let lento = false, pausado = false;
  bLento.onclick = () => { lento = !lento; bLento.classList.toggle("on", lento); refaz(); };
  bPausa.onclick = () => { pausado = !pausado; bPausa.textContent = pausado ? "Animar" : "Pausar"; bPausa.classList.toggle("on", pausado); refaz(); };
  function refaz() {
    pararAnims();
    const orig = ARTES[ex.art].ritmo || 2400;
    if (lento) ARTES[ex.art].ritmo = orig * 2.2;
    palco.innerHTML = "";
    palco.append(fazSvg(ex.art, !pausado));
    ARTES[ex.art].ritmo = orig;
  }
  ctrl.append(bLento, bPausa);
  box.append(ctrl);

  box.append(el("div", "log", `
    <div class="row"><small>Séries e repetições</small><b>${ex.s} × ${ex.r}</b></div>
    ${ex.eq ? `<div class="row"><small>Equipamento</small><b>${ex.eq}</b></div>` : ""}
    <div class="row"><small>Foco</small><b>${ex.alvo}</b></div>`));
  box.append(el("p", "dica", ex.d));

  if (ex.tempo) {
    const b = el("button", "linha", `Cronometrar ${ex.tempo >= 60 ? Math.round(ex.tempo / 60) + " min" : ex.tempo + " seg"}`);
    b.style.marginTop = "14px";
    b.onclick = () => { descanso(ex.tempo); fechar(); };
    box.append(b);
  }
  const fecharBtn = el("button", "linha", "Fechar");
  fecharBtn.style.marginTop = "8px";
  fecharBtn.onclick = () => fechar();
  box.append(fecharBtn);

  function fechar() { pararAnims(); sh.remove(); }
  sh.onclick = e => { if (e.target === sh) fechar(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── progresso ──────────────────────────────────────────── */
function sequencia() {
  const dias = new Set(S.hist.map(h => dia(h.ts)));
  if (!dias.size) return 0;
  let n = 0, d = new Date();
  if (!dias.has(dia(d))) d.setDate(d.getDate() - 1);
  while (dias.has(dia(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function telaProgresso() {
  app.append(el("header", "top", `<div class="hello"><div class="eyebrow">Seu histórico</div><h1>Progresso</h1></div>`));

  const semana = S.hist.filter(h => Date.now() - h.ts < 7 * 864e5).length;
  const sets = S.hist.reduce((n, h) => n + h.sets, 0);
  app.append(el("div", "stats", `
    <div class="stat"><b>${sequencia()}</b><span>sequência</span></div>
    <div class="stat"><b>${semana}</b><span>na semana</span></div>
    <div class="stat"><b>${S.hist.length}</b><span>treinos</span></div>`));

  const dias = new Set(S.hist.map(h => dia(h.ts)));
  const heat = el("div", "heat");
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const c = el("i"); if (dias.has(dia(d))) c.classList.add("on");
    c.title = dia(d); heat.append(c);
  }
  app.append(el("div", "eyebrow", "Últimos 14 dias"), heat);

  if (!S.hist.length) app.append(el("p", "vazio", "Nenhum treino de força registrado ainda."));

  const log = el("div", "log");
  log.style.marginTop = "18px";
  S.hist.slice(-8).reverse().forEach(h => {
    const d = new Date(h.ts);
    log.append(el("div", "row", `<div><b>${h.nome}</b><br><small>${PLANO[h.plano].label} · ${h.sets}/${h.tot} séries</small></div>
      <small>${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}</small>`));
  });
  if (S.hist.length) app.append(log);
  painelCorrida(app);
}

/* ── ajustes ────────────────────────────────────────────── */
function telaAjustes() {
  app.append(el("header", "top", `<div class="hello"><div class="eyebrow">App da Isa</div><h1>Ajustes</h1></div>`));

  const exp = el("button", "linha", "Salvar backup dos dados");
  exp.onclick = () => {
    const blob = new Blob([JSON.stringify({ sets: S.sets, pesos: S.pesos, hist: S.hist, corridas: S.corridas, medidas: S.medidas }, null, 1)], { type: "application/json" });
    const a = el("a"); a.href = URL.createObjectURL(blob); a.download = "treino-isa-backup.json"; a.click();
  };
  const imp = el("button", "linha", "Restaurar backup");
  imp.onclick = () => {
    const i = el("input"); i.type = "file"; i.accept = ".json";
    i.onchange = () => {
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const o = JSON.parse(fr.result);
          Object.assign(S, { sets: o.sets || {}, pesos: o.pesos || {}, hist: o.hist || [], corridas: o.corridas || [], medidas: o.medidas || [] });
          salvar(); render(); aviso("Backup restaurado");
        } catch (e) { aviso("Arquivo inválido"); }
      };
      fr.readAsText(i.files[0]);
    };
    i.click();
  };
  const zerar = el("button", "linha", "Zerar séries marcadas");
  zerar.onclick = () => { S.sets = {}; salvar(); render(); aviso("Séries zeradas"); };
  const apagar = el("button", "linha perigo", "Apagar todo o histórico");
  apagar.onclick = () => {
    if (confirm("Apagar histórico de força, corridas, medidas, pesos e marcações? Não dá para desfazer.")) {
      DB.limpar(); Object.assign(S, { sets: {}, pesos: {}, hist: [], corridas: [], medidas: [] }); salvar(); render(); aviso("Tudo apagado");
    }
  };
  app.append(exp, imp, zerar, apagar);
  app.append(el("p", "vazio", "Tudo fica salvo no próprio celular. Funciona sem internet.<br>Faça um backup de vez em quando."));
}

/* ── navegação ──────────────────────────────────────────── */
function nav() {
  const n = el("nav"), inner = el("div", "in");
  [["treinos", "Força"], ["corrida", "Corrida"], ["medidas", "Medidas"], ["progresso", "Progresso"], ["ajustes", "Ajustes"]].forEach(([k, r]) => {
    const b = el("button", "", r);
    b.setAttribute("aria-selected", S.aba === k);
    b.onclick = () => { S.aba = k; S.treino = null; if (k !== "corrida") S.sessao = null; pararDescanso(); render(); };
    inner.append(b);
  });
  n.append(inner);
  app.append(n);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
else render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
