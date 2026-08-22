/* ══════════════════════════════════════════════════════════
   CONTADOR — visitas únicas via GoatCounter (opcional)
   Serviço externo, gratuito, sem cookies, sem dado pessoal:
   https://www.goatcounter.com

   Desligado por padrão: enquanto GOATCOUNTER_SITE estiver
   vazio, nenhuma linha de código aqui faz qualquer chamada de
   rede e nada aparece na tela. Zero impacto no app.

   Para ativar: crie uma conta grátis em goatcounter.com,
   escolha um "código de site" (ex.: treino-isa vira
   treino-isa.goatcounter.com) e preencha abaixo.
   ══════════════════════════════════════════════════════════ */

const GOATCOUNTER_SITE = ""; // ex: "treino-isa"

const contadorAtivo = () => !!GOATCOUNTER_SITE;

/* dispara a contagem da visita atual (uma vez por carregamento) */
function iniciaContadorBeacon() {
  if (!contadorAtivo()) return;
  try {
    if (document.querySelector("script[data-goatcounter]")) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", `https://${GOATCOUNTER_SITE}.goatcounter.com/count`);
    document.head.appendChild(s);
  } catch (e) { /* sem internet ou bloqueado: apenas ignora */ }
}

/* monta o rodapé com o total de visitas; some sozinho se algo falhar */
function montaContadorRodape() {
  if (!contadorAtivo() || typeof fetch !== "function") return null;
  const box = el("p", "vazio contador-rodape", "");
  (async () => {
    try {
      const path = encodeURIComponent(location.pathname || "/");
      const resp = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/${path}.json`);
      if (!resp.ok) throw new Error("sem contagem disponível");
      const data = await resp.json();
      const n = String(data.count_unique || data.count || "").replace(/[^\d]/g, "");
      if (n) box.textContent = tt("contador_usuarios", { n });
      else box.remove();
    } catch (e) { box.remove(); }
  })();
  return box;
}
