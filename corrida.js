/* ══════════════════════════════════════════════════════════
   CORRIDA — plano de 4 semanas, 2 dias por semana
   Extraído da planilha de treinamento e acompanhamento.
   Blocos: {i:intensidade, s:segundos} ou {i, m:metros}
   ══════════════════════════════════════════════════════════ */

const INT = {
  leve:     { rot: "Leve",     zona: "Z2", cor: "#3FE0AE" },
  moderado: { rot: "Moderado", zona: "Z3", cor: "#FFB43D" },
  forte:    { rot: "Forte",    zona: "Z4", cor: "#FF4D8D" },
  maximo:   { rot: "Máximo",   zona: "Z5", cor: "#A86BFF" }
};

const rep = (n, arr) => Array.from({ length: n }, () => arr.map(b => ({ ...b }))).flat();

const CORRIDA = {
  rotina: "2 dias por semana · quarta e domingo",
  foco: "Evolução, ritmo e volume",
  semanas: [
    { n: 1, sessoes: [
      { id: "C1Q", dia: "Quarta", tipo: "Fartlek", nome: "Fartlek 6 × 2 minutos",
        desc: "10 min leve + 6×(2' forte / 2' leve) + 5 min leve", km: 5, tempo: "30:00", pse: 6,
        blocos: [{ i: "leve", s: 600, t: "Aquecimento" }, ...rep(6, [{ i: "forte", s: 120, t: "Tiro forte" }, { i: "leve", s: 120, t: "Recuperação" }]), { i: "leve", s: 300, t: "Desaquecimento" }] },
      { id: "C1D", dia: "Domingo", tipo: "Longão", nome: "Longão base",
        desc: "Ritmo leve e confortável o tempo todo (Z2)", km: 6.5, tempo: "42:15", pse: 4,
        blocos: [{ i: "leve", m: 6500, t: "Rodagem contínua" }] }
    ]},
    { n: 2, sessoes: [
      { id: "C2Q", dia: "Quarta", tipo: "Tiros", nome: "Tiros 8 × 400 m",
        desc: "10 min leve + 8×(400 m forte / 200 m trote) + 5 min leve", km: 5.5, tempo: "32:00", pse: 8,
        blocos: [{ i: "leve", s: 600, t: "Aquecimento" }, ...rep(8, [{ i: "forte", m: 400, t: "Tiro de 400 m" }, { i: "leve", m: 200, t: "Trote" }]), { i: "leve", s: 300, t: "Desaquecimento" }] },
      { id: "C2D", dia: "Domingo", tipo: "Longão", nome: "Longão progressivo",
        desc: "5 km leve seguidos de 2,5 km moderado", km: 7.5, tempo: "47:00", pse: 6,
        blocos: [{ i: "leve", m: 5000, t: "Primeira parte" }, { i: "moderado", m: 2500, t: "Progressão" }] }
    ]},
    { n: 3, sessoes: [
      { id: "C3Q", dia: "Quarta", tipo: "Tempo run", nome: "Tempo run de 18 minutos",
        desc: "10 min leve + 18 min moderado a forte + 7 min leve", km: 5.8, tempo: "33:00", pse: 7,
        blocos: [{ i: "leve", s: 600, t: "Aquecimento" }, { i: "moderado", s: 1080, t: "Bloco sustentado" }, { i: "leve", s: 420, t: "Desaquecimento" }] },
      { id: "C3D", dia: "Domingo", tipo: "Longão", nome: "Longão de volume",
        desc: "Ritmo constante, leve a moderado", km: 8.5, tempo: "53:00", pse: 7,
        blocos: [{ i: "moderado", m: 8500, t: "Rodagem contínua" }] }
    ]},
    { n: 4, sessoes: [
      { id: "C4Q", dia: "Quarta", tipo: "Pirâmide", nome: "Pirâmide 1-2-3-2-1",
        desc: "Blocos fortes crescentes e decrescentes com descanso leve", km: 5, tempo: "29:30", pse: 6,
        blocos: [{ i: "leve", s: 600, t: "Aquecimento" },
          { i: "forte", s: 60, t: "Subida 1'" }, { i: "leve", s: 60, t: "Descanso" },
          { i: "forte", s: 120, t: "Subida 2'" }, { i: "leve", s: 120, t: "Descanso" },
          { i: "forte", s: 180, t: "Topo 3'" }, { i: "leve", s: 120, t: "Descanso" },
          { i: "forte", s: 120, t: "Descida 2'" }, { i: "leve", s: 120, t: "Descanso" },
          { i: "forte", s: 60, t: "Descida 1'" },
          { i: "leve", s: 300, t: "Desaquecimento" }] },
      { id: "C4D", dia: "Domingo", tipo: "Regenerativo", nome: "Regenerativo",
        desc: "Rodagem leve só para assimilar a carga da semana", km: 6, tempo: "39:00", pse: 3,
        blocos: [{ i: "leve", m: 6000, t: "Rodagem leve" }] }
    ]}
  ],
  pse: [
    ["1 – 3", "Leve · Z2", "Respiração fácil, dá para conversar sem esforço."],
    ["4 – 6", "Moderado · Z3", "Respiração mais funda, fala em frases completas."],
    ["7 – 8", "Forte · Z4", "Esforço intenso, só poucas palavras."],
    ["9 – 10", "Máximo · Z5", "Sustenta por pouquíssimo tempo."]
  ]
};

const todasSessoes = () => CORRIDA.semanas.flatMap(s => s.sessoes);
const achaSessao = id => todasSessoes().find(s => s.id === id);
const mmss = seg => `${Math.floor(seg / 60)}:${String(Math.round(seg % 60)).padStart(2, "0")}`;
const paraSeg = txt => {
  const p = String(txt).split(":").map(Number);
  return p.length === 2 && p.every(n => !isNaN(n)) ? p[0] * 60 + p[1] : null;
};
const pace = (km, seg) => (km > 0 && seg > 0) ? mmss(seg / km) : "—";
const corridasDe = id => S.corridas.filter(c => c.id === id);

/* ── lista de sessões ───────────────────────────────────── */
function telaCorrida() {
  if (S.sessao) return telaSessao();

  const feitas = S.corridas.length, km = S.corridas.reduce((n, c) => n + c.km, 0);
  app.append(el("header", "top", `
    <div class="hello"><div class="eyebrow">${CORRIDA.rotina}</div><h1>Corrida</h1></div>
    <div class="streak">👟 ${km.toFixed(1)}<small>km</small></div>`));

  const totalSes = todasSessoes().length;
  app.append(el("div", "progresso", `
    <div class="row">
      <div class="n">${feitas}<small> / ${totalSes} treinos do plano</small></div>
      <div class="pct">${Math.round(feitas / totalSes * 100)}%</div>
    </div>
    <div class="bar" style="margin-top:11px"><i style="width:${Math.min(100, feitas / totalSes * 100)}%"></i></div>`));

  for (const sem of CORRIDA.semanas) {
    app.append(el("div", "eyebrow semtit", `Semana ${sem.n}`));
    for (const s of sem.sessoes) {
      const regs = corridasDe(s.id), ok = regs.length > 0;
      const c = el("button", "card corr i-" + s.blocos[0].i, `
        <div class="letra">${s.dia === "Quarta" ? "QUA" : "DOM"}</div>
        <div style="flex:1;min-width:0">
          <h3>${s.nome}</h3>
          <p>${s.desc}</p>
          <div class="chips">
            <span class="chip reps">${s.km} km</span>
            <span class="chip">${s.tempo} previsto</span>
            <span class="chip alvo">PSE ${s.pse}</span>
          </div>
        </div>
        ${ok ? `<div class="tick">✓ ${pace(regs.at(-1).km, regs.at(-1).seg)}/km</div>` : ""}`);
      c.onclick = () => { S.sessao = s.id; render(); };
      app.append(c);
    }
  }

  const g = el("div", "log guia");
  g.append(el("div", "eyebrow", "Percepção de esforço"));
  CORRIDA.pse.forEach(([e, z, d]) => g.append(el("div", "row pse", `<div><b>${z}</b><br><small>${d}</small></div><span class="chip reps">${e}</span>`)));
  app.append(g);
}

/* ── detalhe da sessão ──────────────────────────────────── */
function telaSessao() {
  const s = achaSessao(S.sessao);
  const sub = el("div", "subhead");
  const back = el("button", "back", "←"); back.onclick = () => { S.sessao = null; render(); };
  sub.append(back, el("div", "", `<div class="eyebrow">${s.dia} · ${s.tipo}</div><h2>${s.nome}</h2>`));
  app.append(sub);

  app.append(el("div", "log", `
    <div class="row"><small>Distância prevista</small><b>${s.km} km</b></div>
    <div class="row"><small>Tempo de referência</small><b>${s.tempo}</b></div>
    <div class="row"><small>Esforço alvo</small><b>PSE ${s.pse}</b></div>
    <div class="row"><small>Pace de referência</small><b>${pace(s.km, paraSeg(s.tempo))} /km</b></div>`));

  app.append(el("div", "eyebrow semtit", "Estrutura do treino"));
  const lista = el("div", "blocos");
  s.blocos.forEach(b => {
    const info = INT[b.i];
    lista.append(el("div", "bloco", `
      <i style="background:${info.cor}"></i>
      <div style="flex:1"><b>${b.t}</b><br><small>${info.rot} · ${info.zona}</small></div>
      <span>${b.s ? mmss(b.s) : (b.m >= 1000 ? (b.m / 1000).toFixed(b.m % 1000 ? 1 : 0) + " km" : b.m + " m")}</span>`));
  });
  app.append(lista);

  const go = el("button", "fim", "Iniciar treino guiado");
  go.onclick = () => guiado(s);
  app.append(go);

  const reg = el("button", "linha", "Registrar sem cronômetro");
  reg.onclick = () => formRegistro(s);
  app.append(reg);

  const regs = corridasDe(s.id);
  if (regs.length) {
    app.append(el("div", "eyebrow semtit", "Já realizado"));
    const log = el("div", "log");
    regs.slice().reverse().forEach(r => {
      const d = new Date(r.ts);
      log.append(el("div", "row", `<div><b>${r.km} km em ${mmss(r.seg)}</b><br><small>pace ${pace(r.km, r.seg)}/km · PSE ${r.pse}${r.obs ? " · " + r.obs : ""}</small></div>
        <small>${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}</small>`));
    });
    app.append(log);
  }
}

/* ── treino guiado ──────────────────────────────────────── */
let corridaAtiva = null;
function guiado(s) {
  pararDescanso();
  let i = 0, decorrido = 0, noBloco = 0, pausado = false, wake = null;
  try { navigator.wakeLock && navigator.wakeLock.request("screen").then(w => wake = w).catch(() => {}); } catch (e) {}

  const tela = el("div", "run");
  tela.innerHTML = `
    <div class="run-top">
      <div class="eyebrow">${s.nome}</div>
      <div class="run-tot"><span class="tt">0:00</span> total</div>
    </div>
    <div class="run-mid">
      <div class="run-int"></div>
      <div class="run-t">0:00</div>
      <div class="run-b"></div>
      <div class="run-next"></div>
    </div>
    <div class="run-pass"></div>
    <div class="run-ctrl">
      <button data-pausa>Pausar</button>
      <button data-pula>Próximo</button>
      <button data-sai class="perigo">Encerrar</button>
    </div>`;
  document.body.append(tela);

  const passos = el("div", "trilha");
  s.blocos.forEach(b => { const x = el("i", "passo"); x.style.background = INT[b.i].cor; passos.append(x); });
  tela.querySelector(".run-pass").append(passos);

  function pinta() {
    const b = s.blocos[i], info = INT[b.i];
    tela.style.setProperty("--int", info.cor);
    tela.querySelector(".run-int").textContent = `${info.rot} · ${info.zona}`;
    tela.querySelector(".run-b").textContent = b.t;
    const prox = s.blocos[i + 1];
    tela.querySelector(".run-next").textContent = prox ? `Depois: ${prox.t} · ${INT[prox.i].rot}` : "Último bloco";
    tela.querySelector(".run-t").textContent = b.s ? mmss(Math.max(0, b.s - noBloco))
      : (b.m >= 1000 ? (b.m / 1000).toFixed(b.m % 1000 ? 1 : 0) + " km" : b.m + " m");
    tela.querySelector(".run-t").classList.toggle("dist", !b.s);
    tela.querySelector(".tt").textContent = mmss(decorrido);
    [...passos.children].forEach((p, n) => p.classList.toggle("ok", n < i));
  }
  function avanca() {
    vibrar([160, 80, 160]);
    i++; noBloco = 0;
    if (i >= s.blocos.length) return encerra(true);
    pinta();
  }
  function encerra(completo) {
    clearInterval(corridaAtiva); corridaAtiva = null;
    try { wake && wake.release(); } catch (e) {}
    tela.remove();
    if (completo) { vibrar([200, 100, 200, 100, 200]); aviso("Treino concluído!"); }
    formRegistro(s, completo ? decorrido : null);
  }

  pinta();
  corridaAtiva = setInterval(() => {
    if (pausado) return;
    decorrido++; noBloco++;
    const b = s.blocos[i];
    if (b.s) {
      const resta = b.s - noBloco;
      if (resta === 3 || resta === 2 || resta === 1) vibrar(60);
      if (resta <= 0) return avanca();
    }
    pinta();
  }, 1000);

  tela.querySelector("[data-pausa]").onclick = e => {
    pausado = !pausado; e.target.textContent = pausado ? "Continuar" : "Pausar";
    tela.classList.toggle("pausado", pausado);
  };
  tela.querySelector("[data-pula]").onclick = avanca;
  tela.querySelector("[data-sai]").onclick = () => { if (confirm("Encerrar o treino guiado?")) encerra(false); };
}

/* ── registro ───────────────────────────────────────────── */
function formRegistro(s, segundos) {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <div class="eyebrow">${s.dia} · semana ${CORRIDA.semanas.find(w => w.sessoes.includes(s)).n}</div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">Como foi o treino?</h2>`);

  const campos = el("div", "campos", `
    <label>Distância <span>km</span><input id="f-km" inputmode="decimal" value="${s.km}"></label>
    <label>Tempo <span>mm:ss</span><input id="f-t" inputmode="numeric" value="${segundos != null ? mmss(segundos) : s.tempo}"></label>`);
  box.append(campos);

  const paceBox = el("div", "log", `<div class="row"><small>Pace calculado</small><b class="p">—</b></div>`);
  box.append(paceBox);
  const atualiza = () => {
    const km = parseFloat(String(box.querySelector("#f-km").value).replace(",", "."));
    const sg = paraSeg(box.querySelector("#f-t").value);
    paceBox.querySelector(".p").textContent = (km > 0 && sg) ? pace(km, sg) + " /km" : "—";
  };
  box.querySelectorAll("input").forEach(i => { i.oninput = atualiza; });
  atualiza();

  box.append(el("div", "eyebrow", "Percepção de esforço"));
  let pseSel = s.pse;
  const escala = el("div", "escala");
  for (let n = 1; n <= 10; n++) {
    const b = el("button", "pnum" + (n === pseSel ? " on" : ""), String(n));
    b.onclick = () => { pseSel = n; [...escala.children].forEach(x => x.classList.remove("on")); b.classList.add("on"); };
    escala.append(b);
  }
  box.append(escala);

  const obs = el("textarea", "obs"); obs.placeholder = "Sensações, clima, dores…"; obs.rows = 2;
  box.append(obs);

  const salvarBtn = el("button", "fim", "Salvar treino");
  salvarBtn.onclick = () => {
    const km = parseFloat(String(box.querySelector("#f-km").value).replace(",", "."));
    const sg = paraSeg(box.querySelector("#f-t").value);
    if (!(km > 0) || !sg) { aviso("Confira distância e tempo"); return; }
    S.corridas.push({ ts: Date.now(), id: s.id, km, seg: sg, pse: pseSel, obs: obs.value.trim() });
    salvar(); sh.remove(); S.sessao = null; render();
    aviso(`${km} km registrados · ${pace(km, sg)}/km`);
  };
  box.append(salvarBtn);
  const cancela = el("button", "linha", "Agora não");
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── bloco de métricas para a aba Progresso ─────────────── */
function painelCorrida(destino) {
  destino.append(el("div", "eyebrow semtit", "Corrida"));
  if (!S.corridas.length) { destino.append(el("p", "vazio", "Nenhuma corrida registrada ainda.")); return; }

  const km = S.corridas.reduce((n, c) => n + c.km, 0);
  const seg = S.corridas.reduce((n, c) => n + c.seg, 0);
  const melhor = S.corridas.reduce((a, c) => (c.seg / c.km < a.seg / a.km ? c : a));
  destino.append(el("div", "stats", `
    <div class="stat"><b>${km.toFixed(1)}</b><span>km totais</span></div>
    <div class="stat"><b>${pace(km, seg)}</b><span>pace médio</span></div>
    <div class="stat"><b>${pace(melhor.km, melhor.seg)}</b><span>melhor pace</span></div>`));

  const max = Math.max(...CORRIDA.semanas.map(w => w.sessoes.reduce((n, s) => n + corridasDe(s.id).reduce((k, c) => k + c.km, 0), 0)), 1);
  const barras = el("div", "barras");
  CORRIDA.semanas.forEach(w => {
    const k = w.sessoes.reduce((n, s) => n + corridasDe(s.id).reduce((x, c) => x + c.km, 0), 0);
    barras.append(el("div", "col", `<i style="height:${Math.max(4, k / max * 100)}%"></i><span>S${w.n}</span><small>${k ? k.toFixed(1) : "—"}</small>`));
  });
  destino.append(el("div", "eyebrow", "Volume por semana do plano"), barras);

  const log = el("div", "log");
  S.corridas.slice(-6).reverse().forEach(c => {
    const s = achaSessao(c.id), d = new Date(c.ts);
    log.append(el("div", "row", `<div><b>${s ? s.nome : "Corrida"}</b><br><small>${c.km} km · ${mmss(c.seg)} · ${pace(c.km, c.seg)}/km · PSE ${c.pse}</small></div>
      <small>${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}</small>`));
  });
  destino.append(log);
}
