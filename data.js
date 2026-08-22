/* Plano de treino da Isa — extraído da planilha original.
   art  = id da animação (poses.js)
   alvo = músculo destacado no boneco                                  */
const PLANO = {
  ACADEMIA: {
    label: "Academia",
    treinos: [
      { id: "AC-A", letra: "A", nome: "Superior", foco: "Peito, costas e ombros", cor: "rosa", ex: [
        { n: "Supino Reto", eq: "barra ou halteres", s: 4, r: "8 a 10", d: "Foco em força e controle na descida.", art: "benchPress", alvo: "Peitoral" },
        { n: "Puxada Alta na Polia", eq: "", s: 4, r: "8 a 12", d: "Puxe em direção ao peito concentrando nas costas.", art: "latPulldown", alvo: "Dorsal" },
        { n: "Desenvolvimento de Ombros", eq: "halteres", s: 3, r: "10", d: "Mantenha o abdômen bem contraído.", art: "shoulderPress", alvo: "Ombros" },
        { n: "Remada Sentada na Polia", eq: "polia ou máquina", s: 3, r: "10 a 12", d: "Alongue bem as costas e esmague na puxada.", art: "seatedRow", alvo: "Costas" },
        { n: "Elevação Lateral", eq: "", s: 4, r: "12 a 15", d: "Suba os halteres controlando o movimento.", art: "lateralRaise", alvo: "Ombro lateral" },
        { n: "Tríceps Corda", eq: "polia", s: 3, r: "12", d: "Estenda completamente os braços embaixo.", art: "tricepsPushdown", alvo: "Tríceps" },
        { n: "Rosca Direta", eq: "halteres ou barra W", s: 3, r: "12", d: "Mantenha os cotovelos fixados ao lado do corpo.", art: "curl", alvo: "Bíceps" }
      ]},
      { id: "AC-B", letra: "B", nome: "Inferior", foco: "Quadríceps e abdômen", cor: "ambar", ex: [
        { n: "Agachamento Livre", eq: "ou Smith / Hack", s: 4, r: "8 a 10", d: "Mantenha boa profundidade e postura firme.", art: "squatBar", alvo: "Quadríceps" },
        { n: "Leg Press 45°", eq: "", s: 4, r: "10 a 12", d: "Não apoie as mãos nos joelhos; amplitude máxima segura.", art: "legPress", alvo: "Quadríceps" },
        { n: "Cadeira Extensora", eq: "", s: 3, r: "12 a 15", d: "Segure por 2 segundos no topo de cada repetição.", art: "legExtension", alvo: "Quadríceps" },
        { n: "Cadeira Flexora", eq: "", s: 4, r: "10 a 12", d: "Foco em controlar o retorno do peso.", art: "legCurlSeated", alvo: "Posterior" },
        { n: "Panturrilha em Pé", eq: "", s: 4, r: "15 a 20", d: "Alongue bem na descida e suba até o máximo.", art: "calfStanding", alvo: "Panturrilha" },
        { n: "Abdominal Infra", eq: "elevação de pernas", s: 3, r: "15 a 20", d: "Movimento controlado sem dar impulso com o quadril.", art: "legRaise", alvo: "Abdômen" }
      ]},
      { id: "AC-C", letra: "C", nome: "Superior", foco: "Peito alto, dorsais e braços", cor: "rosa", ex: [
        { n: "Supino Inclinado", eq: "halteres", s: 4, r: "10", d: "Foco na parte superior do peitoral.", art: "inclinePress", alvo: "Peito alto" },
        { n: "Remada Curvada", eq: "barra ou halteres", s: 4, r: "10", d: "Mantenha a coluna reta e o tronco inclinado.", art: "bentRow", alvo: "Costas" },
        { n: "Crucifixo Inverso", eq: "halteres ou peck deck", s: 3, r: "12", d: "Trabalha a parte de trás dos ombros e a postura.", art: "reverseFly", alvo: "Ombro posterior" },
        { n: "Elevação Lateral", eq: "", s: 4, r: "12", d: "Estímulo com foco em cadência e técnica.", art: "lateralRaise", alvo: "Ombro lateral" },
        { n: "Tríceps Francês", eq: "halter", s: 3, r: "12", d: "Ótima variação confortável para os braços.", art: "frenchPress", alvo: "Tríceps" },
        { n: "Rosca Martelo", eq: "halteres", s: 3, r: "12", d: "Pegada neutra trabalhando antebraço e bíceps.", art: "hammerCurl", alvo: "Bíceps" },
        { n: "Abdominal Supra", eq: "tradicional", s: 3, r: "20", d: "Suba soltando o ar e contraindo o abdômen.", art: "crunch", alvo: "Abdômen" }
      ]},
      { id: "AC-D", letra: "D", nome: "Bumbum", foco: "Glúteos e posterior", cor: "roxo", ex: [
        { n: "Agachamento Búlgaro", eq: "halteres", s: 4, r: "10 a 12 por perna", d: "Tronco levemente inclinado para frente para focar no bumbum.", art: "bulgarian", alvo: "Glúteo" },
        { n: "Stiff", eq: "barra ou halteres", s: 4, r: "8 a 10", d: "Mantenha a coluna reta e jogue o quadril para trás.", art: "stiff", alvo: "Glúteo e posterior" },
        { n: "Mesa ou Cadeira Flexora", eq: "", s: 4, r: "10 a 12", d: "Foco na musculatura posterior da coxa.", art: "legCurlSeated", alvo: "Posterior" },
        { n: "Cadeira Abdutora", eq: "", s: 4, r: "12 a 15", d: "Tronco inclinado para a frente para arredondar o glúteo.", art: "abductor", alvo: "Glúteo médio" },
        { n: "Panturrilha Sentada", eq: "cavalinho", s: 4, r: "15", d: "Faça o movimento completo e cadenciado.", art: "calfSeated", alvo: "Panturrilha" },
        { n: "Prancha Abdominal", eq: "", s: 3, r: "45 a 60 seg", d: "Mantenha o corpo alinhado e o abdômen ativo.", art: "plank", alvo: "Core", tempo: 50 }
      ]}
    ]
  },
  CASA: {
    label: "Casa",
    treinos: [
      { id: "CA-A", letra: "A", nome: "Superior", foco: "Peito, costas e braços", cor: "rosa", ex: [
        { n: "Flexão de Braço", eq: "no chão", s: 4, r: "até a falha", d: "Pode apoiar os joelhos. Foco no peitoral e braços.", art: "pushup", alvo: "Peitoral" },
        { n: "Remada Curvada Unilateral", eq: "halter 5 kg", s: 4, r: "12 a 15 por lado", d: "Apoie em uma cadeira ou sofá.", art: "oneArmRow", alvo: "Costas" },
        { n: "Desenvolvimento de Ombros", eq: "halteres 2 ou 5 kg", s: 3, r: "12", d: "Abdômen bem firme.", art: "shoulderPress", alvo: "Ombros" },
        { n: "Elevação Lateral", eq: "halteres 2 kg", s: 4, r: "15", d: "Descida lenta, conte 2 segundos.", art: "lateralRaise", alvo: "Ombro lateral" },
        { n: "Tríceps Francês", eq: "halter 5 kg", s: 3, r: "12 a 15", d: "Segure o halter com as duas mãos.", art: "frenchPress", alvo: "Tríceps" },
        { n: "Rosca Martelo ou Direta", eq: "halteres 5 kg", s: 3, r: "12", d: "Cotovelos fixos ao lado do corpo.", art: "hammerCurl", alvo: "Bíceps" }
      ]},
      { id: "CA-B", letra: "B", nome: "Inferior", foco: "Quadríceps e cardio", cor: "ambar", ex: [
        { n: "Agachamento Goblet", eq: "halter 5 kg", s: 4, r: "15 a 20", d: "Segure o halter junto ao peito. Descida lenta.", art: "goblet", alvo: "Quadríceps" },
        { n: "Afundo Estático", eq: "halteres 2 ou 5 kg", s: 4, r: "12 por perna", d: "Joelho de trás desce em direção ao chão.", art: "lunge", alvo: "Pernas" },
        { n: "Agachamento Isométrico na Parede", eq: "", s: 3, r: "máximo de tempo", d: "Mantenha as costas na parede a 90 graus.", art: "wallSit", alvo: "Quadríceps", tempo: 45 },
        { n: "Panturrilha em Pé", eq: "no degrau", s: 4, r: "20", d: "Segure um halter para equilíbrio se necessário.", art: "calfStanding", alvo: "Panturrilha" },
        { n: "Abdominal Infra", eq: "no chão", s: 3, r: "15 a 20", d: "Deitada no chão, elevação de pernas controlada.", art: "legRaise", alvo: "Abdômen" },
        { n: "Cardio Final na Bike", eq: "", s: 1, r: "15 a 20 min", d: "Intercale 1 min rápido por 1 min moderado.", art: "bike", alvo: "Cardio", tempo: 900 }
      ]},
      { id: "CA-C", letra: "C", nome: "Superior", foco: "Peito, ombro posterior e braços", cor: "rosa", ex: [
        { n: "Crucifixo Reto Deitado", eq: "halteres 5 kg, no chão", s: 4, r: "12 a 15", d: "Movimento bem controlado.", art: "flyFloor", alvo: "Peitoral" },
        { n: "Remada Curvada", eq: "dois halteres 5 kg", s: 4, r: "12", d: "Mantenha a coluna bem reta.", art: "bentRow", alvo: "Costas" },
        { n: "Crucifixo Inverso", eq: "halteres 2 kg, tronco inclinado", s: 3, r: "15", d: "Foco na postura e no ombro posterior.", art: "reverseFly", alvo: "Ombro posterior" },
        { n: "Elevação Lateral", eq: "halteres 2 kg", s: 4, r: "15", d: "Foco em cadência e técnica.", art: "lateralRaise", alvo: "Ombro lateral" },
        { n: "Tríceps no Sofá", eq: "mergulho no banco", s: 3, r: "12 a 15", d: "Mantenha as costas próximas ao apoio do sofá.", art: "benchDip", alvo: "Tríceps" },
        { n: "Rosca Concentrada Sentada", eq: "halter 5 kg", s: 3, r: "12 por braço", d: "Apoie o cotovelo na coxa.", art: "concCurl", alvo: "Bíceps" },
        { n: "Abdominal Supra", eq: "no chão", s: 3, r: "20 a 25", d: "Movimento tradicional no chão.", art: "crunch", alvo: "Abdômen" }
      ]},
      { id: "CA-D", letra: "D", nome: "Bumbum", foco: "Glúteos em casa", cor: "roxo", ex: [
        { n: "Agachamento Búlgaro", eq: "no sofá, halteres 5 kg", s: 4, r: "12 por perna", d: "Tronco levemente à frente para focar no bumbum.", art: "bulgarian", alvo: "Glúteo" },
        { n: "Stiff Bilateral ou Unilateral", eq: "halteres 5 kg", s: 4, r: "12 a 15", d: "Empurre o quadril bem para trás.", art: "stiff", alvo: "Glúteo e posterior" },
        { n: "Elevação Pélvica Unilateral", eq: "no chão, peso do corpo ou halter", s: 4, r: "12 a 15 por perna", d: "Suba o quadril e aperte o glúteo lá em cima.", art: "hipThrust", alvo: "Glúteo" },
        { n: "Abdução de Quadril", eq: "4 apoios, por lado", s: 4, r: "15 a 20 por perna", d: "Excelente estímulo isolado para arredondar o glúteo.", art: "fireHydrant", alvo: "Glúteo médio" },
        { n: "Panturrilha Sentada", eq: "halteres 5 kg sobre os joelhos", s: 4, r: "20", d: "Movimento completo e cadenciado.", art: "calfSeated", alvo: "Panturrilha" },
        { n: "Prancha Abdominal", eq: "", s: 3, r: "45 a 60 seg", d: "Corpo alinhado e abdômen bem ativo.", art: "plank", alvo: "Core", tempo: 50 }
      ]}
    ]
  }
};
