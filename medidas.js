/* ══════════════════════════════════════════════════════════
   MEDIDAS — peso e medidas corporais, opcional
   Cada registro guarda só os campos que a pessoa preencher.
   ══════════════════════════════════════════════════════════ */

const CAMPOS_MEDIDA = [
  { k: "peso", nome: "Peso", un: "kg" },
  { k: "cintura", nome: "Cintura", un: "cm" },
  { k: "quadril", nome: "Quadril", un: "cm" },
  { k: "busto", nome: "Busto", un: "cm" },
  { k: "braco_dir", nome: "Braço direito", un: "cm" },
  { k: "braco_esq", nome: "Braço esquerdo", un: "cm" },
  { k: "coxa_dir", nome: "Coxa direita", un: "cm" },
  { k: "coxa_esq", nome: "Coxa esquerda", un: "cm" }
];

/* Registros antigos guardavam "braco" e "coxa" como medida única.
   Aqui eles viram o valor inicial de ambos os lados, para não sumir
   do histórico nem da comparação. Roda uma vez, na carga do app. */
function migrarMedidas() {
  let mudou = false;
  S.medidas.forEach(r => {
    if (r.braco != null && r.braco_dir == null && r.braco_esq == null) { r.braco_dir = r.braco; r.braco_esq = r.braco; delete r.braco; mudou = true; }
    if (r.coxa != null && r.coxa_dir == null && r.coxa_esq == null) { r.coxa_dir = r.coxa; r.coxa_esq = r.coxa; delete r.coxa; mudou = true; }
  });
  if (mudou) salvar();
}

const fmtNum = n => (Math.round(n * 10) / 10).toLocaleString("pt-BR");
const fmtData = ts => { const d = new Date(ts); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`; };
const medidasOrdenadas = () => [...S.medidas].sort((a, b) => a.ts - b.ts);

/* ── tela principal ─────────────────────────────────────── */
function telaMedidas() {
  app.append(el("header", "top", `
    <div class="hello"><div class="eyebrow">Acompanhamento pessoal</div><h1>Medidas</h1></div>`));

  const registrar = el("button", "fim", "Nova medição");
  registrar.onclick = () => formMedida();

  const regs = medidasOrdenadas();
  if (!regs.length) {
    app.append(el("p", "vazio", "Nenhuma medição registrada ainda.<br>É totalmente opcional — cadastre só se quiser acompanhar sua evolução ao longo do tempo."));
    app.append(registrar);
    return;
  }
  app.append(registrar);

  const primeira = regs[0], ultima = regs[regs.length - 1];
  if (regs.length > 1) {
    app.append(el("div", "eyebrow semtit", `Desde ${fmtData(primeira.ts)}`));
    const comp = el("div", "log");
    CAMPOS_MEDIDA.forEach(c => {
      if (primeira[c.k] == null || ultima[c.k] == null) return;
      const dif = ultima[c.k] - primeira[c.k];
      const sinal = dif > 0 ? "+" : "";
      comp.append(el("div", "row", `
        <div><b>${c.nome}</b><br><small>${fmtNum(primeira[c.k])} → ${fmtNum(ultima[c.k])} ${c.un}</small></div>
        <span class="chip ${dif === 0 ? "" : "reps"}">${dif === 0 ? "sem mudança" : sinal + fmtNum(dif) + " " + c.un}</span>`));
    });
    app.append(comp);
  }

  const pesos = regs.filter(r => r.peso != null);
  if (pesos.length > 1) {
    app.append(el("div", "eyebrow semtit", "Peso ao longo do tempo"));
    app.append(grafico(pesos.map(r => r.peso), pesos.map(r => fmtData(r.ts))));
  }

  app.append(el("div", "eyebrow semtit", "Histórico"));
  const log = el("div", "log");
  regs.slice().reverse().forEach(r => {
    const chips = CAMPOS_MEDIDA.filter(c => r[c.k] != null).map(c => `<span class="chip">${c.nome} ${fmtNum(r[c.k])}${c.un}</span>`).join("");
    const linha = el("div", "row medida-row", `
      <div style="flex:1"><b>${fmtData(r.ts)}</b><div class="chips" style="margin-top:6px">${chips}</div>${r.obs ? `<p class="dica" style="margin-top:8px">${r.obs}</p>` : ""}</div>
      <button class="x" title="Excluir">✕</button>`);
    linha.querySelector(".x").onclick = () => {
      if (confirm("Excluir esta medição?")) { S.medidas = S.medidas.filter(x => x !== r); salvar(); render(); }
    };
    log.append(linha);
  });
  app.append(log);
}

/* ── gráfico simples em SVG ─────────────────────────────── */
function grafico(valores, rotulos) {
  const w = 100, h = 46, pad = 4;
  const min = Math.min(...valores), max = Math.max(...valores);
  const amp = (max - min) || 1;
  const pts = valores.map((v, i) => {
    const x = pad + (i / (valores.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / amp) * (h - pad * 2);
    return [x, y];
  });
  const linha = pts.map(p => p.join(",")).join(" ");
  const box = el("div", "grafico");
  box.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline points="${linha}" fill="none" stroke="url(#gg)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>
      <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#FF4D8D"/><stop offset="1" stop-color="#A86BFF"/>
      </linearGradient></defs>
      ${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.6" fill="#F6EFF8"/>`).join("")}
    </svg>
    <div class="grafico-eixo"><span>${rotulos[0]}</span><span>${rotulos[rotulos.length - 1]}</span></div>
    <div class="grafico-minmax"><span>${fmtNum(min)}</span><span>${fmtNum(max)}</span></div>`;
  return box;
}

/* ── formulário de nova medição ─────────────────────────── */
function formMedida() {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <div class="eyebrow">${fmtData(Date.now())}</div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">Nova medição</h2>
    <p class="vazio" style="padding:0 0 14px;text-align:left">Preencha só o que quiser medir hoje. Os campos em branco não entram no registro.</p>`);

  const grid = el("div", "campos grid2");
  CAMPOS_MEDIDA.forEach(c => {
    grid.append(el("label", "", `${c.nome} <span>${c.un}</span><input data-k="${c.k}" inputmode="decimal" placeholder="—">`));
  });
  box.append(grid);
  const nota = el("p", "vazio", "Braço e coxa são medidos separadamente de cada lado, já que é comum ter uma pequena diferença entre eles.");
  nota.style.cssText = "padding:10px 0 4px;text-align:left";
  box.append(nota);

  const obs = el("textarea", "obs"); obs.placeholder = "Observações (opcional)"; obs.rows = 2;
  box.append(obs);

  const salvarBtn = el("button", "fim", "Salvar medição");
  salvarBtn.onclick = () => {
    const reg = { ts: Date.now() };
    let algum = false;
    grid.querySelectorAll("input").forEach(i => {
      const v = parseFloat(String(i.value).replace(",", "."));
      if (!isNaN(v) && v > 0) { reg[i.dataset.k] = v; algum = true; }
    });
    if (!algum) { aviso("Preencha ao menos um campo"); return; }
    if (obs.value.trim()) reg.obs = obs.value.trim();
    S.medidas.push(reg); salvar(); sh.remove(); render();
    aviso("Medição registrada");
  };
  box.append(salvarBtn);
  const cancela = el("button", "linha", "Agora não");
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}
