/* ══════════════════════════════════════════════════════════
   EXTRAS — funcionalidades opcionais que não afetam quem só
   quer abrir o app e seguir o plano original:
   - Treinos e exercícios personalizados (Força)
   - Editar séries/repetições de qualquer exercício (Força)
   - Histórico de carga com gráfico (Força)
   - Sessões de corrida personalizadas + editar previsão (Corrida)
   - Altura, IMC e mais campos de medida (Medidas)
   - Metas pessoais (Progresso)
   ══════════════════════════════════════════════════════════ */

/* ── FORÇA: overrides de séries/repetições ──────────────── */
const setsDe = (t, i, ex) => {
  const o = S.overrides[chave(t.id, i)];
  return (o && o.s > 0) ? o.s : ex.s;
};
const repsDe = (t, i, ex) => {
  const o = S.overrides[chave(t.id, i)];
  return (o && o.r) ? o.r : ex.r;
};

function salvarOverride(t, i, ex, novoS, novoR) {
  const k = chave(t.id, i);
  const s = parseInt(novoS, 10);
  const r = String(novoR || "").trim();
  const eDefault = (!s || s === ex.s) && (!r || r === ex.r);
  if (eDefault) { delete S.overrides[k]; }
  else { S.overrides[k] = { s: s > 0 ? s : ex.s, r: r || ex.r }; }
  // ajusta o array de séries marcadas ao novo tamanho, preservando o que já foi feito
  const novoTam = setsDe(t, i, ex);
  const marc = S.sets[k] || [];
  if (marc.length !== novoTam) {
    const novoMarc = new Array(novoTam).fill(false);
    for (let x = 0; x < Math.min(novoTam, marc.length); x++) novoMarc[x] = marc[x];
    S.sets[k] = novoMarc;
  }
  salvar();
}

/* ── FORÇA: treinos e exercícios personalizados ─────────── */
const catalogoExercicios = () => Object.keys(ARTES).map(id => ({ id, nome: ARTES[id].nome || id }));

function criarTreinoPersonalizado(plano, nome, foco, cor) {
  const t = { id: plano + "-CUSTOM-" + Date.now(), letra: (nome[0] || "+").toUpperCase(), nome, foco: foco || "", cor: cor || "roxo", ex: [], custom: true };
  S.custom[plano].push(t);
  salvar();
  return t;
}
function excluirTreinoPersonalizado(plano, id) {
  S.custom[plano] = S.custom[plano].filter(t => t.id !== id);
  salvar();
}
function adicionarExercicioPersonalizado(t, artId, s, r, dica, eq, alvo) {
  t.ex.push({ n: (ARTES[artId] && ARTES[artId].nome) || artId, eq: eq || "", s: s > 0 ? s : 3, r: r || "12", d: dica || "", art: artId, alvo: alvo || "", custom: true });
  salvar();
}
function removerExercicioPersonalizado(t, i) {
  t.ex.splice(i, 1);
  // renumera chaves de sets/pesos/overrides que vinham depois do removido, para não desalinhar
  for (let x = i; x < t.ex.length; x++) {
    const de = chave(t.id, x + 1), para = chave(t.id, x);
    if (S.sets[de] != null) { S.sets[para] = S.sets[de]; delete S.sets[de]; }
    if (S.pesos[de] != null) { S.pesos[para] = S.pesos[de]; delete S.pesos[de]; }
    if (S.overrides[de] != null) { S.overrides[para] = S.overrides[de]; delete S.overrides[de]; }
  }
  const ultima = chave(t.id, t.ex.length);
  delete S.sets[ultima]; delete S.pesos[ultima]; delete S.overrides[ultima];
  salvar();
}

/* ── tela: editar séries/repetições e gerenciar exercícios de um treino ── */
function formEditarTreino(t) {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">${tt("editar_treino")}</h2>`);

  const lista = el("div", "log");
  t.ex.forEach((ex, i) => {
    const linha = el("div", "row edita-ex");
    linha.innerHTML = `
      <div style="flex:1;min-width:0">
        <b>${tx(ex.n)}</b>
        <div class="campos" style="margin-top:8px">
          <label>${tt("series_label")}<input type="number" min="1" max="12" data-s value="${setsDe(t, i, ex)}"></label>
          <label>${tt("reps_lbl")}<input data-r value="${repsDe(t, i, ex)}"></label>
        </div>
      </div>`;
    if (ex.custom) {
      const rm = el("button", "x", "✕"); rm.title = tt("remover");
      rm.onclick = () => {
        if (confirm(tt("excluir_exercicio_conf"))) { removerExercicioPersonalizado(t, i); sh.remove(); render(); formEditarTreino(achaTreino(t.id)); }
      };
      linha.append(rm);
    }
    lista.append(linha);
  });
  box.append(lista);

  const salvarBtn = el("button", "fim", tt("salvar_alteracoes"));
  salvarBtn.onclick = () => {
    lista.querySelectorAll(".edita-ex").forEach((linha, i) => {
      const s = linha.querySelector("[data-s]").value;
      const r = linha.querySelector("[data-r]").value;
      salvarOverride(t, i, t.ex[i], s, r);
    });
    sh.remove(); render();
    aviso(tt("alteracoes_salvas"));
  };
  box.append(salvarBtn);

  if (t.custom) {
    const addEx = el("button", "linha", tt("add_exercicio"));
    addEx.onclick = () => { sh.remove(); formEscolherExercicio(t); };
    box.append(addEx);

    const delTreino = el("button", "linha perigo", tt("excluir_treino"));
    delTreino.onclick = () => {
      if (confirm(tt("excluir_treino_conf"))) {
        excluirTreinoPersonalizado(S.plano, t.id);
        sh.remove(); S.treino = null; render();
        aviso(tt("treino_excluido"));
      }
    };
    box.append(delTreino);
  }

  const cancela = el("button", "linha", tt("agora_nao"));
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── tela: escolher exercício do catálogo (para treino personalizado) ── */
function formEscolherExercicio(t) {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <h2 style="margin:4px 0 14px;font-size:21px;letter-spacing:-.03em">${tt("escolher_exercicio")}</h2>`);

  const grid = el("div", "grid-catalogo");
  catalogoExercicios().forEach(({ id, nome }) => {
    const btn = el("button", "thumb-cat");
    btn.append(fazSvg(id, false));
    btn.append(el("span", "", nome));
    btn.onclick = () => { sh.remove(); formNovoExercicio(t, id, nome); };
    grid.append(btn);
  });
  box.append(grid);

  const cancela = el("button", "linha", tt("agora_nao"));
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── tela: detalhes do novo exercício (séries, repetições, dica) ── */
function formNovoExercicio(t, artId, nome) {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <div class="eyebrow">${nome}</div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">${tt("add_exercicio")}</h2>
    <div class="campos grid2">
      <label>${tt("series_label")}<input type="number" min="1" max="12" id="ne-s" value="3"></label>
      <label>${tt("reps_lbl")}<input id="ne-r" value="12"></label>
      <label>${tt("equipamento")}<input id="ne-eq" placeholder="—"></label>
      <label>${tt("foco")}<input id="ne-alvo" placeholder="—"></label>
    </div>`);
  const dica = el("textarea", "obs"); dica.placeholder = tt("dica_ph"); dica.rows = 2;
  box.append(dica);

  const salvarBtn = el("button", "fim", tt("adicionar"));
  salvarBtn.onclick = () => {
    adicionarExercicioPersonalizado(t,
      artId,
      parseInt(box.querySelector("#ne-s").value, 10),
      box.querySelector("#ne-r").value,
      dica.value.trim(),
      box.querySelector("#ne-eq").value.trim(),
      box.querySelector("#ne-alvo").value.trim());
    sh.remove(); render();
    aviso(tt("exercicio_adicionado"));
  };
  box.append(salvarBtn);
  const cancela = el("button", "linha", tt("agora_nao"));
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── tela: criar treino personalizado ────────────────────── */
function formNovoTreino() {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">${tt("add_treino")}</h2>
    <label class="campo-full">${tt("nome_treino_lbl")}<input id="nt-nome" placeholder="${tt("nome_treino_ph")}"></label>
    <label class="campo-full" style="margin-top:10px">${tt("foco_treino_lbl")}<input id="nt-foco" placeholder="${tt("foco_treino_ph")}"></label>`);

  const cores = el("div", "seg", "");
  ["rosa", "roxo", "ambar"].forEach((c, i) => {
    const b = el("button", "", ""); b.style.cssText = `background:var(--${c})`;
    b.setAttribute("aria-selected", i === 0);
    b.onclick = () => { [...cores.children].forEach(x => x.setAttribute("aria-selected", "false")); b.setAttribute("aria-selected", "true"); b.dataset.pick = "1"; };
    if (i === 0) b.dataset.pick = "1";
    cores.append(b);
  });
  box.append(el("div", "eyebrow", tt("cor_lbl")));
  box.append(cores);

  const criarBtn = el("button", "fim", tt("criar"));
  criarBtn.onclick = () => {
    const nome = box.querySelector("#nt-nome").value.trim();
    if (!nome) { aviso(tt("preencha_nome")); return; }
    const foco = box.querySelector("#nt-foco").value.trim();
    const corSel = ["rosa", "roxo", "ambar"][[...cores.children].findIndex(b => b.dataset.pick === "1")] || "roxo";
    const t = criarTreinoPersonalizado(S.plano, nome, foco, corSel);
    sh.remove();
    S.treino = t.id; render();
  };
  box.append(criarBtn);
  const cancela = el("button", "linha", tt("agora_nao"));
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── FORÇA: histórico de carga por exercício ─────────────── */
function registrarCargaConcluida(t) {
  t.ex.forEach((ex, i) => {
    const k = chave(t.id, i);
    const v = parseFloat(String(S.pesos[k] ?? "").replace(",", "."));
    if (!isNaN(v) && v > 0) S.cargaHist.push({ ts: Date.now(), chave: k, peso: v });
  });
}
function historicoDe(k) {
  return S.cargaHist.filter(h => h.chave === k).sort((a, b) => a.ts - b.ts);
}

/* ── CORRIDA: sessões personalizadas e edição de previsão ── */
function criarSessaoCorrida(dados) {
  const km = parseFloat(String(dados.km).replace(",", ".")) || 0;
  const s = {
    id: "CORR-CUSTOM-" + Date.now(), dia: dados.dia, tipo: dados.tipo, nome: dados.nome,
    desc: dados.desc, km, tempo: dados.tempo, pse: dados.pse, custom: true,
    blocos: [{ i: "leve", m: Math.max(1, Math.round(km * 1000)), t: dados.nome }]
  };
  S.corridaCustom.push(s);
  salvar();
  return s;
}
function excluirSessaoCorrida(id) {
  S.corridaCustom = S.corridaCustom.filter(s => s.id !== id);
  salvar();
}
function salvarPrevisaoSessao(s, dados) {
  const km = parseFloat(String(dados.km).replace(",", ".")) || s.km;
  if (s.custom) {
    const alvo = S.corridaCustom.find(x => x.id === s.id);
    if (alvo) {
      Object.assign(alvo, { dia: dados.dia, tipo: dados.tipo, nome: dados.nome, desc: dados.desc, km, tempo: dados.tempo, pse: dados.pse });
      alvo.blocos = [{ i: "leve", m: Math.max(1, Math.round(km * 1000)), t: dados.nome }];
    }
  } else {
    S.corridaOverrides[s.id] = { km, tempo: dados.tempo, pse: dados.pse };
  }
  salvar();
}

function formSessaoCorrida(sessaoExistente) {
  const editando = !!sessaoExistente;
  const s = sessaoExistente || { dia: "", tipo: "", nome: "", desc: "", km: 5, tempo: "30:00", pse: 5 };
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">${editando ? tt("editar_sessao") : tt("corrida_nova_sessao")}</h2>`);

  const podeEditarTudo = !editando || s.custom;
  if (podeEditarTudo) {
    box.append(el("label", "campo-full", `${tt("dia_lbl")}<input id="cs-dia" value="${s.dia}" placeholder="${tt("dia_ph")}">`));
    box.append(el("label", "campo-full", `${tt("tipo_lbl")}<input id="cs-tipo" value="${s.tipo}" placeholder="${tt("tipo_ph")}"></input>`));
    box.append(el("label", "campo-full", `${tt("nome_sessao_lbl")}<input id="cs-nome" value="${s.nome}" placeholder="${tt("nome_sessao_ph")}"></input>`));
    box.append(el("label", "campo-full", `${tt("desc_lbl")}<input id="cs-desc" value="${s.desc}" placeholder="${tt("desc_ph")}"></input>`));
  }
  const campos = el("div", "campos");
  campos.innerHTML = `
    <label>${tt("distancia_km")} <span>km</span><input id="cs-km" inputmode="decimal" value="${s.km}"></label>
    <label>${tt("tempo_mmss")} <span>mm:ss</span><input id="cs-tempo" inputmode="numeric" value="${s.tempo}"></label>`;
  box.append(campos);

  box.append(el("div", "eyebrow", tt("pse_esc")));
  let pseSel = s.pse || 5;
  const escala = el("div", "escala");
  for (let n = 1; n <= 10; n++) {
    const b = el("button", "pnum" + (n === pseSel ? " on" : ""), String(n));
    b.onclick = () => { pseSel = n; [...escala.children].forEach(x => x.classList.remove("on")); b.classList.add("on"); };
    escala.append(b);
  }
  box.append(escala);

  const salvarBtn = el("button", "fim", tt("salvar"));
  salvarBtn.onclick = () => {
    const dados = {
      dia: podeEditarTudo ? box.querySelector("#cs-dia").value.trim() : s.dia,
      tipo: podeEditarTudo ? box.querySelector("#cs-tipo").value.trim() : s.tipo,
      nome: podeEditarTudo ? box.querySelector("#cs-nome").value.trim() : s.nome,
      desc: podeEditarTudo ? box.querySelector("#cs-desc").value.trim() : s.desc,
      km: box.querySelector("#cs-km").value,
      tempo: box.querySelector("#cs-tempo").value,
      pse: pseSel
    };
    if (podeEditarTudo && !dados.nome) { aviso(tt("preencha_nome")); return; }
    if (editando) { salvarPrevisaoSessao(s, dados); }
    else { const nova = criarSessaoCorrida(dados); S.sessao = nova.id; }
    sh.remove(); render();
  };
  box.append(salvarBtn);

  if (editando && s.custom) {
    const delBtn = el("button", "linha perigo", tt("excluir_sessao"));
    delBtn.onclick = () => {
      if (confirm(tt("corrida_excluir_sessao_conf"))) {
        excluirSessaoCorrida(s.id); S.sessao = null; sh.remove(); render();
      }
    };
    box.append(delBtn);
  }
  const cancela = el("button", "linha", tt("agora_nao"));
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}

/* ── MEDIDAS: IMC ─────────────────────────────────────────── */
function calculaImc(peso, alturaCm) {
  const a = alturaCm / 100;
  if (!(peso > 0) || !(a > 0)) return null;
  const imc = peso / (a * a);
  let cat;
  if (imc < 18.5) cat = tt("imc_abaixo");
  else if (imc < 25) cat = tt("imc_normal");
  else if (imc < 30) cat = tt("imc_sobrepeso");
  else cat = tt("imc_obesidade");
  return { valor: imc, categoria: cat };
}

/* ── PROGRESSO: metas pessoais ────────────────────────────── */
function formMetas() {
  const sh = el("div", "sheet");
  const box = el("div", "box", `<div class="grab"></div>
    <h2 style="margin:4px 0 16px;font-size:21px;letter-spacing:-.03em">${tt("definir_metas")}</h2>
    <label class="campo-full">${tt("meta_treinos_lbl")}<input id="mt-treinos" type="number" min="1" max="14" value="${S.metas.treinos || ""}" placeholder="—"></label>
    <label class="campo-full" style="margin-top:10px">${tt("meta_km_lbl")}<input id="mt-km" inputmode="decimal" value="${S.metas.km || ""}" placeholder="—"></label>`);

  const salvarBtn = el("button", "fim", tt("salvar"));
  salvarBtn.onclick = () => {
    const treinos = parseInt(box.querySelector("#mt-treinos").value, 10);
    const km = parseFloat(String(box.querySelector("#mt-km").value).replace(",", "."));
    S.metas = { treinos: treinos > 0 ? treinos : undefined, km: km > 0 ? km : undefined };
    salvar(); sh.remove(); render();
  };
  box.append(salvarBtn);
  const cancela = el("button", "linha", tt("agora_nao"));
  cancela.onclick = () => sh.remove();
  box.append(cancela);

  sh.onclick = e => { if (e.target === sh) sh.remove(); };
  sh.append(box);
  document.body.append(sh);
}
