# Treino da Isa 🏋️‍♀️🏃‍♀️

App de treino pessoal, feito para uso **100% offline** no celular. Reúne dois
planos vindos de planilhas reais: musculação (academia e casa, foco em
glúteos) e corrida (plano de 4 semanas, 2 dias por semana). Sem servidor, sem
conta, sem anúncio — os dados ficam só no aparelho de quem usa.

## Recursos

**Força**
- Planos de Academia e Casa, treinos A a D, com séries, repetições e dicas.
- Cada exercício tem uma **animação em SVG** (boneco em movimento) desenhada
  do zero, com câmera lenta e pausa — sem depender de imagens externas.
- Marcação de série por série, com **descanso automático** entre elas
  (cronômetro com vibração no final).
- Campo de carga (kg) por exercício, salvo para a próxima sessão.

**Corrida**
- Plano de 4 semanas com fartlek, tiros, tempo run, pirâmide, longões e
  regenerativo.
- **Treino guiado em tela cheia**: cronômetro por bloco, intensidade (Z2–Z5),
  prévia do próximo bloco, vibração na virada.
- Registro de distância, tempo e percepção de esforço (PSE 1–10), com
  **pace calculado automaticamente**.
- Guia de percepção de esforço direto na tela.

**Geral**
- Aba de Progresso: sequência de dias, treinos da semana, histórico,
  km totais e pace médio.
- Backup e restauração em arquivo `.json`.
- Instalável como **PWA** (ícone na tela inicial, tela cheia, funciona sem
  internet depois da primeira abertura).

## Como usar

### Opção 1 — clonar e instalar como app (recomendado)

```bash
git clone https://github.com/SEU-USUARIO/treino-isa.git
cd treino-isa
```

Depois é só publicar a pasta em qualquer hospedagem estática:

- [Netlify Drop](https://app.netlify.com/drop) — arraste a pasta, pronto.
- GitHub Pages — `Settings → Pages → Deploy from branch`.
- Vercel, Cloudflare Pages, ou qualquer servidor HTTP simples (`npx serve .`).

Abra o link gerado no Chrome do Android → menu **⋮** → **Instalar app** (ou
**Adicionar à tela inicial**). A partir daí funciona offline.

### Opção 2 — arquivo único

Se preferir não hospedar nada, existe uma versão com tudo embutido em um só
`.html` (HTML + CSS + JS inline). Basta mandar o arquivo por WhatsApp ou
e-mail, abrir no Chrome do celular e usar **Adicionar à tela inicial**.
(Não está neste repositório por padrão — gere com `build.py`, veja abaixo.)

## Estrutura do projeto

```
├── index.html      # marcação da página
├── app.css         # todo o estilo visual
├── data.js         # plano de força (exercícios, séries, dicas)
├── poses.js        # motor de animação: poses SVG de cada exercício
├── corrida.js       # plano de corrida (semanas, blocos, PSE)
├── app.js          # lógica do app, telas e armazenamento local
├── manifest.json   # metadados do PWA
├── sw.js           # service worker (cache offline)
└── icone.svg       # ícone do app
```

Nenhuma dependência externa, nenhum build step. É só HTML/CSS/JS puro.

## Personalizar

- **Mudar exercícios de força**: edite o objeto `PLANO` em `data.js`.
- **Mudar plano de corrida**: edite o objeto `CORRIDA` em `corrida.js`. Cada
  treino é uma lista de blocos, por tempo ou distância:
  ```js
  { i: "forte", s: 120, t: "Tiro forte" }   // 120 segundos
  { i: "leve",  m: 400, t: "Trote" }        // 400 metros
  ```
- **Nova animação de exercício**: adicione uma entrada em `ARTES` (`poses.js`)
  com duas poses (`a` e `b`) — o app interpola entre elas.
- **Cores e tipografia**: variáveis no topo de `app.css` (`:root`).

## Privacidade

Todo o progresso (séries marcadas, pesos, corridas, histórico) fica salvo no
`localStorage` do navegador — nada é enviado para nenhum servidor. Backup e
restauração são feitos manualmente, por arquivo.

## Licença

Uso pessoal e livre. Adapte à vontade para o seu próprio treino.
