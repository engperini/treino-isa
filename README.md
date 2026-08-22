# Treino da Isa 🏋️‍♀️🏃‍♀️

App de treino pessoal, feito para uso **100% offline** no celular. Reúne
musculação (academia e casa, foco em glúteos), corrida (plano de 4 semanas) e
acompanhamento opcional de peso e medidas — sem servidor, sem conta, sem
anúncio. Os dados ficam só no aparelho de quem usa.

## 📲 Instalar (para qualquer usuário)

Não precisa clonar nada para usar — o app já está publicado e pronto:

**👉 https://engperini.github.io/treino-isa/**

### Android (Chrome, Edge, Brave, Samsung Internet)
1. Abra o link acima.
2. Toque no menu **⋮** no canto superior direito.
3. Toque em **"Instalar app"** (ou aguarde o banner que aparece sozinho).
4. Pronto — o ícone aparece na gaveta de aplicativos, igual a um app baixado
   de loja. Abre em tela cheia, sem barra de navegador, e funciona sem
   internet depois da primeira abertura.

### iPhone (Safari)
1. Abra o link acima **no Safari** (obrigatório — outros navegadores no iOS
   não oferecem essa opção, mesmo o Chrome).
2. Toque no ícone de **compartilhar** (o quadrado com a seta para cima), na
   barra inferior.
3. Role as opções e toque em **"Adicionar à Tela de Início"**.
4. Confirme o nome e toque em **"Adicionar"**.

No iPhone o resultado final é o mesmo (ícone próprio, tela cheia, offline),
só o caminho para instalar é diferente — a Apple não oferece o botão
"Instalar" automático que o Android tem. Duas pequenas limitações do Safari:
vibração e "manter tela acesa" durante o treino guiado não funcionam (o app
continua funcionando normalmente, só sem essas duas notificações). Por isso,
para quem usa iPhone vale mais o hábito de usar o backup em **Ajustes**.

## Recursos

**Força**
- Planos de Academia e Casa, treinos A a D, com séries, repetições e dicas.
- Cada exercício tem uma **animação em SVG** (boneco em movimento), com
  câmera lenta e pausa — sem depender de imagens externas.
- Marcação de série por série, com **descanso automático** entre elas
  (cronômetro com vibração no final, no Android).
- Campo de carga (kg) por exercício, salvo para a próxima sessão.

**Corrida**
- Plano de 4 semanas com fartlek, tiros, tempo run, pirâmide, longões e
  regenerativo.
- **Treino guiado em tela cheia**: cronômetro por bloco, intensidade (Z2–Z5),
  prévia do próximo bloco, vibração na virada.
- Registro de distância, tempo e percepção de esforço (PSE 1–10), com
  **pace calculado automaticamente**.

**Medidas** *(opcional)*
- Cadastro livre de peso e medidas corporais (cintura, quadril, busto, braço,
  coxa) — preenche só o que quiser em cada registro.
- **Comparação automática** entre a primeira e a última medição.
- Gráfico simples da evolução do peso ao longo do tempo.
- Histórico completo, com opção de excluir registros individuais.

**Geral**
- Aba de Progresso: sequência de dias, treinos da semana, histórico,
  km totais e pace médio.
- Backup e restauração em arquivo `.json` (inclui força, corrida e medidas).
- Instalável como **PWA** — funciona sem internet depois da primeira abertura.

## Para desenvolvedores

### Clonar e rodar localmente

```bash
git clone https://github.com/engperini/treino-isa.git
cd treino-isa
npx serve .
```

Qualquer servidor estático funciona (`npx serve .`, `python3 -m http.server`,
Netlify Drop, Vercel, Cloudflare Pages…). O importante é servir via HTTPS (ou
`localhost`) para o Service Worker funcionar — arquivo aberto direto do disco
(`file://`) não ativa o cache offline nem o botão "Instalar app".

Este próprio repositório já está publicado via **GitHub Pages**
(Settings → Pages → branch `main`, pasta `/`), então qualquer alteração
enviada para `main` atualiza o link de instalação automaticamente.

### Arquivo único (opcional)

Para gerar uma versão com tudo embutido em um só `.html` — útil para mandar
por WhatsApp/e-mail sem precisar de link:

```bash
python3 build.py
```

Isso cria `treino-isa.html` na raiz (ignorado pelo git). Essa versão não tem
suporte a Service Worker (por rodar como `file://`), então não conta com
cache offline automático nem instala como app de verdade — é só um atalho
prático para testar ou compartilhar rapidamente.

## Estrutura do projeto

```
├── index.html      # marcação da página
├── app.css         # todo o estilo visual
├── data.js         # plano de força (exercícios, séries, dicas)
├── poses.js        # motor de animação: poses SVG de cada exercício
├── corrida.js      # plano de corrida (semanas, blocos, PSE)
├── medidas.js      # peso e medidas corporais (cadastro, gráfico, histórico)
├── app.js          # lógica do app, telas, navegação e armazenamento local
├── manifest.json   # metadados do PWA
├── sw.js           # service worker (cache offline)
├── icone.svg       # ícone do app
└── build.py        # gera a versão em arquivo único (opcional)
```

Nenhuma dependência externa, nenhum build step obrigatório. É HTML/CSS/JS
puro — o `build.py` é só um utilitário opcional.

## Personalizar

- **Mudar exercícios de força**: edite o objeto `PLANO` em `data.js`.
- **Mudar plano de corrida**: edite o objeto `CORRIDA` em `corrida.js`. Cada
  treino é uma lista de blocos, por tempo ou distância:
  ```js
  { i: "forte", s: 120, t: "Tiro forte" }   // 120 segundos
  { i: "leve",  m: 400, t: "Trote" }        // 400 metros
  ```
- **Mudar campos de medidas**: edite `CAMPOS_MEDIDA` em `medidas.js` — cada
  item vira automaticamente um campo no formulário e uma linha na comparação.
- **Nova animação de exercício**: adicione uma entrada em `ARTES` (`poses.js`)
  com duas poses (`a` e `b`) — o app interpola entre elas.
- **Cores e tipografia**: variáveis no topo de `app.css` (`:root`).

Depois de editar, dê commit e push na branch `main` — o GitHub Pages atualiza
o link de instalação sozinho em 1–2 minutos.

## Privacidade

Todo o progresso (séries marcadas, pesos, corridas, medidas, histórico) fica
salvo no `localStorage` do navegador — nada é enviado para nenhum servidor.
Backup e restauração são feitos manualmente, por arquivo, na aba Ajustes.

## Licença

Uso pessoal e livre. Adapte à vontade para o seu próprio treino.
