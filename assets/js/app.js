"use strict";

const views = document.querySelectorAll("[data-view]");

function showView(id) {
  views.forEach((view) => {
    view.hidden = view.id !== id;
  });
}

document.getElementById("btn-start").addEventListener("click", () => {
  showView("view-trainings");
});

document.getElementById("btn-results").addEventListener("click", () => {
  renderResultados();
  showView("view-results");
});

document.getElementById("btn-back-trainings").addEventListener("click", () => {
  showView("view-home");
});

document.getElementById("btn-back-results").addEventListener("click", () => {
  showView("view-home");
});

/* ===== Meus Resultados ===== */

const RESULTADOS_KEY = "railsafe_resultados";
const MAX_RESULTADOS_POR_TREINAMENTO = 6;

function lerResultados() {
  try {
    const raw = localStorage.getItem(RESULTADOS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const normalizados = {};
    Object.keys(parsed).forEach((nome) => {
      const valor = parsed[nome];
      if (Array.isArray(valor)) {
        normalizados[nome] = valor;
      } else if (valor && typeof valor === "object") {
        normalizados[nome] = [valor];
      }
    });
    return normalizados;
  } catch (e) {
    return {};
  }
}

function salvarResultadoTreinamento(dados) {
  if (!dados || typeof dados.treinamento !== "string" || !dados.treinamento.trim()) return;
  const resultados = lerResultados();
  const registro = {
    treinamento: dados.treinamento,
    data: new Date().toISOString(),
    nota: dados.nota,
    acertos: dados.acertos,
    erros: dados.erros,
    percentual: dados.percentual,
    status: "Concluído",
  };
  const historico = resultados[dados.treinamento] || [];
  historico.push(registro);
  historico.sort((a, b) => tempoRegistro(a.data) - tempoRegistro(b.data));
  if (historico.length > MAX_RESULTADOS_POR_TREINAMENTO) {
    historico.splice(0, historico.length - MAX_RESULTADOS_POR_TREINAMENTO);
  }
  resultados[dados.treinamento] = historico;
  try {
    localStorage.setItem(RESULTADOS_KEY, JSON.stringify(resultados));
  } catch (e) {}
}

function formatarDataResultado(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return (
      pad(d.getDate()) +
      "/" +
      pad(d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " " +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes())
    );
  } catch (e) {
    return "";
  }
}

function tempoRegistro(data) {
  const t = new Date(data).getTime();
  return isNaN(t) ? 0 : t;
}

function renderResultados() {
  const listEl = document.getElementById("results-list");
  const emptyEl = document.getElementById("results-empty-state");
  const clearBtn = document.getElementById("btn-clear-results");
  if (!listEl || !emptyEl) return;

  const porTreinamento = lerResultados();
  const nomes = Object.keys(porTreinamento);
  const vazio = nomes.length === 0;

  emptyEl.hidden = !vazio;
  listEl.hidden = vazio;
  if (clearBtn) clearBtn.hidden = vazio;
  listEl.innerHTML = "";
  if (vazio) return;

  nomes.forEach((nome) => {
    const registros = porTreinamento[nome]
      .filter((r) => r && typeof r.treinamento === "string")
      .slice()
      .sort((a, b) => tempoRegistro(b.data) - tempoRegistro(a.data))
      .slice(0, MAX_RESULTADOS_POR_TREINAMENTO);

    const card = document.createElement("div");
    card.className = "card results-card";

    const icone = document.createElement("span");
    icone.className = "card__icon";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = "📋";

    const corpo = document.createElement("div");
    corpo.className = "results-card__body";

    const titulo = document.createElement("span");
    titulo.className = "card__title";
    titulo.textContent = nome;

    corpo.appendChild(titulo);

    registros.forEach((r) => {
      const nota =
        typeof r.nota === "number"
          ? r.nota.toFixed(1).replace(".", ",")
          : String(r.nota);
      const meta = document.createElement("p");
      meta.className = "results-card__meta";
      meta.textContent =
        "Concluído em " +
        formatarDataResultado(r.data) +
        " · Nota: " +
        nota +
        " · Acertos: " +
        r.acertos +
        "/" +
        (Number(r.acertos) + Number(r.erros)) +
        " · Erros: " +
        r.erros +
        " · Aproveitamento: " +
        r.percentual +
        "% · Status: " +
        (r.status || "Concluído");
      corpo.appendChild(meta);
    });

    card.appendChild(icone);
    card.appendChild(corpo);
    listEl.appendChild(card);
  });
}

document.getElementById("btn-clear-results").addEventListener("click", () => {
  const confirmado = window.confirm(
    "Limpar histórico de avaliações?\n\nTodos os seus resultados serão apagados. Essa ação não poderá ser desfeita."
  );
  if (!confirmado) return;
  try {
    localStorage.removeItem(RESULTADOS_KEY);
  } catch (e) {}
  renderResultados();
});

/* ===== Treinamento de Sinalização ===== */

/** RAILSAFE_QUESTIONS_BLOCK */
const questions = [
  {
    id: 1,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A sinalização ferroviária pode ser compreendida como:",
    alternativas: [
      "Um conjunto de placas utilizadas exclusivamente para indicar a velocidade dos trens.",
      "Um sistema destinado apenas à comunicação entre o condutor e o CCO.",
      "Um conjunto de elementos, dispositivos e sistemas utilizados para estabelecer condições para a circulação e orientar movimentos ferroviários.",
      "Um sistema destinado exclusivamente à proteção física da via.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A sinalização estabelece condições para a circulação e orienta movimentos ferroviários, atuando de forma integrada com outros elementos do sistema.",
    explicacaoErrada:
      "A sinalização estabelece condições para a circulação e orienta movimentos ferroviários, atuando de forma integrada com outros elementos do sistema.",
  },
  {
    id: 2,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Durante uma operação ferroviária, um sinal deve ser interpretado:",
    alternativas: [
      "Somente de acordo com sua cor predominante.",
      "Considerando seu tipo, aspecto, função e as condições estabelecidas pelo sistema.",
      "Apenas conforme a velocidade do trem.",
      "Somente após confirmação verbal do CCO.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A indicação de um sinal depende de seu tipo, aspecto e função dentro do sistema de sinalização.",
    explicacaoErrada:
      "A indicação de um sinal depende de seu tipo, aspecto e função dentro do sistema de sinalização.",
  },
  {
    id: 3,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual é a principal característica de um sinal principal?",
    alternativas: [
      "Controlar exclusivamente movimentos de manobra.",
      "Indicar somente a velocidade máxima da via.",
      "Controlar movimentos na linha principal e estabelecer condições para a circulação de trens.",
      "Ser utilizado apenas em pátios.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O sinal principal está relacionado ao controle dos movimentos realizados na linha principal.",
    explicacaoErrada:
      "O sinal principal está relacionado ao controle dos movimentos realizados na linha principal.",
  },
  {
    id: 4,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O sinal de manobra está relacionado principalmente:",
    alternativas: [
      "À circulação regular de trens na linha principal.",
      "Ao controle de movimentos de manobra.",
      "À indicação da velocidade máxima autorizada.",
      "À identificação dos circuitos de via.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O sinal de manobra estabelece condições para movimentos de manobra.",
    explicacaoErrada:
      "O sinal de manobra estabelece condições para movimentos de manobra.",
  },
  {
    id: 5,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Um sinal de ponto caracteriza-se por estabelecer:",
    alternativas: [
      "Uma condição de velocidade reduzida.",
      "Uma condição de prosseguimento obrigatório.",
      "Uma condição de parada obrigatória.",
      "Uma condição de circulação automática.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O sinal de ponto estabelece uma condição de parada obrigatória para o movimento.",
    explicacaoErrada:
      "O sinal de ponto estabelece uma condição de parada obrigatória para o movimento.",
  },
  {
    id: 6,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Considerando as condições apresentadas pelo sistema, o aspecto vermelho de um sinal está relacionado a:",
    alternativas: [
      "Prosseguimento livre.",
      "Parada.",
      "Operação automática.",
      "Mudança de via.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O aspecto vermelho estabelece condição de parada conforme as regras do sistema de sinalização.",
    explicacaoErrada:
      "O aspecto vermelho estabelece condição de parada conforme as regras do sistema de sinalização.",
  },
  {
    id: 7,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Um sinal apagado deve ser tratado operacionalmente como:",
    alternativas: [
      "Sinal de via livre.",
      "Sinal de velocidade reduzida.",
      "Condição de parada.",
      "Sinal de manobra.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Um sinal apagado não apresenta uma indicação luminosa válida e deve ser tratado como condição de parada.",
    explicacaoErrada:
      "Um sinal apagado não apresenta uma indicação luminosa válida e deve ser tratado como condição de parada.",
  },
  {
    id: 8,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A VMA — Velocidade Máxima Autorizada — pode ser estabelecida por:",
    alternativas: [
      "Placa de sinalização.",
      "Apenas pelo rádio.",
      "Somente pelo condutor.",
      "Exclusivamente pelo circuito de via.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A VMA pode ser estabelecida por meio de placa, indicando a velocidade máxima autorizada para determinado trecho ou condição.",
    explicacaoErrada:
      "A VMA pode ser estabelecida por meio de placa, indicando a velocidade máxima autorizada para determinado trecho ou condição.",
  },
  {
    id: 9,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O circuito de via é utilizado para:",
    alternativas: [
      "Alterar fisicamente a geometria do AMV.",
      "Detectar a ocupação de determinado trecho de via.",
      "Definir a velocidade do trem diretamente.",
      "Realizar exclusivamente comunicação por rádio.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O circuito de via é um dos elementos utilizados para detectar a ocupação de trechos ferroviários.",
    explicacaoErrada:
      "O circuito de via é um dos elementos utilizados para detectar a ocupação de trechos ferroviários.",
  },
  {
    id: 10,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A informação de ocupação de um trecho pode influenciar:",
    alternativas: [
      "Apenas a manutenção da via.",
      "Somente a velocidade do trem.",
      "As condições estabelecidas pelo sistema de sinalização e controle da circulação.",
      "Apenas a comunicação entre funcionários.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A ocupação do trecho é uma informação utilizada pelo sistema para estabelecer condições de circulação.",
    explicacaoErrada:
      "A ocupação do trecho é uma informação utilizada pelo sistema para estabelecer condições de circulação.",
  },
  {
    id: 11,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O bloqueio ferroviário está relacionado:",
    alternativas: [
      "À organização da circulação entre determinados pontos da via.",
      "Exclusivamente ao controle das portas do trem.",
      "Somente à manutenção dos trilhos.",
      "Apenas à comunicação entre estações.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O bloqueio organiza a circulação entre determinados pontos e estabelece condições para os movimentos.",
    explicacaoErrada:
      "O bloqueio organiza a circulação entre determinados pontos e estabelece condições para os movimentos.",
  },
  {
    id: 12,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Headway corresponde:",
    alternativas: [
      "À distância entre dois AMV.",
      "Ao intervalo entre movimentos sucessivos de trens em determinada condição de circulação.",
      "Ao comprimento de um trem.",
      "Ao tempo de manutenção da via.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Headway é o intervalo entre movimentos sucessivos de trens em uma mesma direção ou condição de circulação.",
    explicacaoErrada:
      "Headway é o intervalo entre movimentos sucessivos de trens em uma mesma direção ou condição de circulação.",
  },
  {
    id: 13,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Uma rota ferroviária corresponde:",
    alternativas: [
      "À velocidade máxima permitida no trecho.",
      "Ao caminho definido para determinado movimento.",
      "Ao conjunto de sinais existentes em uma estação.",
      "Ao circuito elétrico do trem.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A rota corresponde ao caminho estabelecido para a realização de determinado movimento ferroviário.",
    explicacaoErrada:
      "A rota corresponde ao caminho estabelecido para a realização de determinado movimento ferroviário.",
  },
  {
    id: 14,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O intertravamento tem como uma de suas funções:",
    alternativas: [
      "Aumentar a velocidade dos trens.",
      "Impedir que determinadas condições incompatíveis sejam estabelecidas simultaneamente.",
      "Controlar somente a iluminação da estação.",
      "Substituir todos os procedimentos operacionais.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O intertravamento estabelece relações entre elementos do sistema para impedir combinações incompatíveis.",
    explicacaoErrada:
      "O intertravamento estabelece relações entre elementos do sistema para impedir combinações incompatíveis.",
  },
  {
    id: 15,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Historicamente, os primeiros sistemas de intertravamento estavam associados principalmente:",
    alternativas: [
      "À inteligência artificial.",
      "A mecanismos mecânicos.",
      "À comunicação digital.",
      "Aos sistemas CBTC.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "No século XIX, sistemas mecânicos foram utilizados para impedir fisicamente combinações incompatíveis de posições de aparelhos e sinais.",
    explicacaoErrada:
      "No século XIX, sistemas mecânicos foram utilizados para impedir fisicamente combinações incompatíveis de posições de aparelhos e sinais.",
  },
  {
    id: 16,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O AMV permite:",
    alternativas: [
      "Aumentar automaticamente a velocidade do trem.",
      "A passagem de um trem ou veículo ferroviário de uma via para outra.",
      "Detectar a ocupação de uma via.",
      "Controlar a comunicação por rádio.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A função do AMV é possibilitar a passagem do veículo de uma via para outra.",
    explicacaoErrada:
      "A função do AMV é possibilitar a passagem do veículo de uma via para outra.",
  },
  {
    id: 17,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Para que uma rota seja estabelecida, é necessário considerar:",
    alternativas: [
      "Apenas a posição do trem.",
      "As condições da via, dos AMV e dos demais elementos relacionados ao movimento.",
      "Somente a velocidade do trem.",
      "Apenas a comunicação entre os operadores.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O estabelecimento de uma rota depende da combinação das condições dos diferentes elementos envolvidos no movimento.",
    explicacaoErrada:
      "O estabelecimento de uma rota depende da combinação das condições dos diferentes elementos envolvidos no movimento.",
  },
  {
    id: 18,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A relação entre AMV, rota e intertravamento pode ser descrita como:",
    alternativas: [
      "Elementos independentes sem relação operacional.",
      "Elementos integrados utilizados para estabelecer condições para determinados movimentos.",
      "Sistemas utilizados apenas para manutenção.",
      "Equipamentos destinados exclusivamente à comunicação.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "AMV, rotas e intertravamento participam conjuntamente das condições necessárias para determinados movimentos ferroviários.",
    explicacaoErrada:
      "AMV, rotas e intertravamento participam conjuntamente das condições necessárias para determinados movimentos ferroviários.",
  },
  {
    id: 19,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Uma manobra ferroviária é:",
    alternativas: [
      "Qualquer circulação realizada em velocidade máxima.",
      "Um movimento ferroviário realizado de acordo com uma condição operacional específica.",
      "Uma falha do sistema de sinalização.",
      "Um movimento realizado sem necessidade de sinalização.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A manobra possui características próprias e deve obedecer às condições operacionais estabelecidas.",
    explicacaoErrada:
      "A manobra possui características próprias e deve obedecer às condições operacionais estabelecidas.",
  },
  {
    id: 20,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Durante uma manobra, o movimento deve:",
    alternativas: [
      "Ignorar os limites estabelecidos pela sinalização.",
      "Respeitar os sinais e procedimentos aplicáveis.",
      "Ser realizado sempre em velocidade máxima.",
      "Ser conduzido sem comunicação.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "As manobras devem respeitar as condições estabelecidas pela sinalização e pelos procedimentos operacionais.",
    explicacaoErrada:
      "As manobras devem respeitar as condições estabelecidas pela sinalização e pelos procedimentos operacionais.",
  },
  {
    id: 21,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Uma situação em que o sinal está apagado deve ser tratada:",
    alternativas: [
      "Como indicação de via livre.",
      "Como indicação de prosseguimento.",
      "Como condição de parada.",
      "Como autorização automática de manobra.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O sinal apagado não apresenta indicação luminosa válida e deve ser tratado como condição de parada.",
    explicacaoErrada:
      "O sinal apagado não apresenta indicação luminosa válida e deve ser tratado como condição de parada.",
  },
  {
    id: 22,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "ATP é um sistema relacionado:",
    alternativas: [
      "À proteção automática do movimento do trem.",
      "Apenas ao entretenimento dos passageiros.",
      "Exclusivamente à manutenção dos trilhos.",
      "À comunicação administrativa.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O ATP — Automatic Train Protection — está relacionado à proteção automática e à supervisão das condições de movimento.",
    explicacaoErrada:
      "O ATP — Automatic Train Protection — está relacionado à proteção automática e à supervisão das condições de movimento.",
  },
  {
    id: 23,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "ATO está relacionado principalmente:",
    alternativas: [
      "À operação automática do trem.",
      "Ao controle manual de AMV.",
      "À manutenção da via.",
      "À comunicação entre estações.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O ATO — Automatic Train Operation — está relacionado à operação automática do trem.",
    explicacaoErrada:
      "O ATO — Automatic Train Operation — está relacionado à operação automática do trem.",
  },
  {
    id: 24,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O CBTC utiliza:",
    alternativas: [
      "Comunicação entre o trem e os equipamentos de controle.",
      "Somente placas físicas.",
      "Exclusivamente mecanismos mecânicos.",
      "Apenas comunicação verbal.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O CBTC utiliza comunicação entre o trem e os equipamentos de controle para funções relacionadas à proteção e ao controle da circulação.",
    explicacaoErrada:
      "O CBTC utiliza comunicação entre o trem e os equipamentos de controle para funções relacionadas à proteção e ao controle da circulação.",
  },
  {
    id: 25,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A principal diferença entre ATP e ATO está relacionada ao fato de que:",
    alternativas: [
      "ATP está associado à proteção, enquanto ATO está associado à operação automática.",
      "ATP é exclusivamente mecânico e ATO exclusivamente hidráulico.",
      "ATP controla somente passageiros e ATO controla somente a via.",
      "Não existe diferença funcional entre os dois.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "ATP está relacionado à proteção automática, enquanto ATO está relacionado à operação automática do trem.",
    explicacaoErrada:
      "ATP está relacionado à proteção automática, enquanto ATO está relacionado à operação automática do trem.",
  },
  {
    id: 26,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A segurança da circulação ferroviária depende:",
    alternativas: [
      "Somente dos sinais.",
      "Somente do condutor.",
      "Da integração entre equipamentos, sistemas, infraestrutura, procedimentos e atuação humana.",
      "Exclusivamente do CCO.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A circulação ferroviária depende da atuação integrada de diferentes elementos técnicos e humanos.",
    explicacaoErrada:
      "A circulação ferroviária depende da atuação integrada de diferentes elementos técnicos e humanos.",
  },
  {
    id: 27,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A indicação apresentada por um sinal representa:",
    alternativas: [
      "Apenas uma informação visual sem relação com a operação.",
      "Uma condição operacional estabelecida pelo sistema de sinalização.",
      "Somente uma recomendação ao condutor.",
      "Uma informação exclusivamente administrativa.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A indicação representa uma condição operacional que deve ser interpretada de acordo com as regras aplicáveis.",
    explicacaoErrada:
      "A indicação representa uma condição operacional que deve ser interpretada de acordo com as regras aplicáveis.",
  },
  {
    id: 28,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual situação demonstra melhor a integração entre os elementos de sinalização?",
    alternativas: [
      "Um sinal funcionando sem considerar a ocupação da via.",
      "Um circuito de via atuando isoladamente.",
      "Ocupação da via, bloqueio, rota, intertravamento e indicação do sinal atuando de forma relacionada.",
      "Um condutor escolhendo a indicação do sinal.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Os diferentes elementos participam de um sistema integrado que estabelece condições para os movimentos.",
    explicacaoErrada:
      "Os diferentes elementos participam de um sistema integrado que estabelece condições para os movimentos.",
  },
  {
    id: 29,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O objetivo do intertravamento é melhor representado por:",
    alternativas: [
      "Permitir todas as combinações possíveis entre sinais e AMV.",
      "Evitar que condições incompatíveis sejam estabelecidas simultaneamente.",
      "Substituir a sinalização visual.",
      "Controlar exclusivamente a velocidade do trem.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O intertravamento estabelece relações de segurança entre os elementos do sistema.",
    explicacaoErrada:
      "O intertravamento estabelece relações de segurança entre os elementos do sistema.",
  },
  {
    id: 30,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Considere uma situação em que um trecho esteja ocupado. Qual afirmação melhor representa a relação dessa condição com a sinalização?",
    alternativas: [
      "A ocupação nunca interfere na indicação dos sinais.",
      "A ocupação pode ser utilizada pelo sistema para estabelecer condições para a circulação.",
      "A ocupação altera automaticamente a velocidade física do trem.",
      "A ocupação determina diretamente a rota escolhida pelo condutor.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A informação de ocupação é utilizada pelo sistema de sinalização e controle para estabelecer condições para os movimentos.",
    explicacaoErrada:
      "A informação de ocupação é utilizada pelo sistema de sinalização e controle para estabelecer condições para os movimentos.",
  },
  {
    id: 31,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Um sinal de manobra e um sinal principal diferenciam-se principalmente:",
    alternativas: [
      "Pela cor obrigatoriamente utilizada.",
      "Pela função exercida dentro da operação ferroviária.",
      "Pela altura física do poste.",
      "Pela localização do CCO.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Os sinais possuem funções diferentes dentro do sistema, podendo controlar diferentes tipos de movimentos.",
    explicacaoErrada:
      "Os sinais possuem funções diferentes dentro do sistema, podendo controlar diferentes tipos de movimentos.",
  },
  {
    id: 32,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Em relação ao aspecto de um sinal, é correto afirmar que:",
    alternativas: [
      "O aspecto deve ser interpretado independentemente do tipo de sinal.",
      "O significado do aspecto deve ser compreendido considerando a função do sinal e as condições do sistema.",
      "Todos os sinais possuem exatamente o mesmo significado para todos os aspectos.",
      "O aspecto é apenas uma informação estética.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A interpretação do aspecto depende do tipo e da função do sinal dentro do sistema.",
    explicacaoErrada:
      "A interpretação do aspecto depende do tipo e da função do sinal dentro do sistema.",
  },
  {
    id: 33,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Por que a ocupação da via é uma informação importante para o controle da circulação?",
    alternativas: [
      "Porque permite estabelecer condições relacionadas à disponibilidade do trecho.",
      "Porque determina a composição do trem.",
      "Porque altera fisicamente o trilho.",
      "Porque substitui o sistema de sinalização.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A informação de ocupação permite ao sistema considerar a condição do trecho para estabelecer condições de circulação.",
    explicacaoErrada:
      "A informação de ocupação permite ao sistema considerar a condição do trecho para estabelecer condições de circulação.",
  },
  {
    id: 34,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual alternativa apresenta somente elementos relacionados ao controle da circulação ferroviária?",
    alternativas: [
      "Bloqueio, rota, intertravamento e sinalização.",
      "Pintura, limpeza, iluminação e bilhetagem.",
      "Passageiros, bilhetes, catracas e plataformas.",
      "Comunicação administrativa, uniformes, documentos e bilhetes.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Bloqueio, rota, intertravamento e sinalização participam diretamente do controle da circulação.",
    explicacaoErrada:
      "Bloqueio, rota, intertravamento e sinalização participam diretamente do controle da circulação.",
  },
  {
    id: 35,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "A existência de um sistema de proteção automática significa que:",
    alternativas: [
      "Os procedimentos operacionais deixam de ser necessários.",
      "A atuação humana deixa de ter importância.",
      "O sistema pode contribuir para a proteção do movimento, mas permanece integrado aos demais elementos da operação.",
      "O condutor pode ignorar os sinais.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Sistemas automáticos complementam o controle da circulação e fazem parte de uma operação integrada.",
    explicacaoErrada:
      "Sistemas automáticos complementam o controle da circulação e fazem parte de uma operação integrada.",
  },
  {
    id: 36,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual alternativa melhor representa o conceito de headway?",
    alternativas: [
      "Distância física entre dois trilhos.",
      "Intervalo entre movimentos sucessivos de trens.",
      "Comprimento de um AMV.",
      "Tempo necessário para trocar um sinal.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Headway representa o intervalo entre movimentos sucessivos de trens em determinada condição de circulação.",
    explicacaoErrada:
      "Headway representa o intervalo entre movimentos sucessivos de trens em determinada condição de circulação.",
  },
  {
    id: 37,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Em relação às manobras ferroviárias, é correto afirmar que:",
    alternativas: [
      "São movimentos sem regras específicas.",
      "Possuem condições operacionais próprias e devem respeitar a sinalização e os procedimentos aplicáveis.",
      "Não dependem de autorização ou condições estabelecidas.",
      "Podem ignorar os limites estabelecidos para a movimentação.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "As manobras possuem condições próprias e devem ser realizadas de acordo com as regras estabelecidas.",
    explicacaoErrada:
      "As manobras possuem condições próprias e devem ser realizadas de acordo com as regras estabelecidas.",
  },
  {
    id: 38,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual alternativa melhor descreve a função dos sistemas ATP, ATO e CBTC?",
    alternativas: [
      "São sistemas exclusivamente destinados à manutenção da via.",
      "São sistemas relacionados à proteção, controle e/ou automação da circulação ferroviária.",
      "São sistemas utilizados somente para comunicação administrativa.",
      "São sistemas destinados exclusivamente aos passageiros.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "ATP, ATO e CBTC possuem funções relacionadas à proteção, controle e automação da circulação ferroviária.",
    explicacaoErrada:
      "ATP, ATO e CBTC possuem funções relacionadas à proteção, controle e automação da circulação ferroviária.",
  },
  {
    id: 39,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Considere a seguinte sequência: ocupação da via, bloqueio, rota, intertravamento e indicação do sinal. Qual alternativa melhor representa a relação entre esses elementos?",
    alternativas: [
      "Cada elemento atua de forma independente e sua condição não interfere nos demais.",
      "O circuito de via determina sozinho a indicação apresentada pelo sinal, sem participação de outros elementos.",
      "Os diferentes elementos participam de um sistema integrado que estabelece condições para os movimentos e influencia as indicações apresentadas pela sinalização.",
      "A indicação do sinal é definida exclusivamente pelo condutor.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Os diferentes elementos participam de um sistema integrado que estabelece condições para os movimentos ferroviários.",
    explicacaoErrada:
      "Os diferentes elementos participam de um sistema integrado que estabelece condições para os movimentos ferroviários.",
  },
  {
    id: 40,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual afirmação melhor resume o funcionamento da sinalização ferroviária?",
    alternativas: [
      "A sinalização é formada apenas por sinais luminosos.",
      "A sinalização funciona de maneira independente dos demais elementos da operação.",
      "A sinalização integra diferentes elementos e sistemas para estabelecer condições de circulação e proteção dos movimentos ferroviários.",
      "A sinalização tem como única finalidade informar a velocidade do trem.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A sinalização ferroviária integra sinais, ocupação da via, bloqueio, rotas, intertravamento e sistemas de proteção e controle para estabelecer condições de circulação.",
    explicacaoErrada:
      "A sinalização ferroviária integra sinais, ocupação da via, bloqueio, rotas, intertravamento e sistemas de proteção e controle para estabelecer condições de circulação.",
  },
];

const MAX_QUESTIONS_PER_TRAINING = 10;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

const objetivo = Math.min(questions.length, MAX_QUESTIONS_PER_TRAINING);

const totalPorTreinamento = objetivo;

let shuffledOrder = [];
let currentPos = 0;
let selected = -1;
let answered = false;
let acertos = 0;
let erros = 0;

const cardSinalizacao = document.querySelector('[data-training="sinalizacao"]');
const optionsContainer = document.getElementById("options-sinalizacao");
const questionText = document.getElementById("question-text");
const questionIndicator = document.getElementById("question-indicator");
const feedback = document.getElementById("feedback-sinalizacao");
const btnAnswer = document.getElementById("btn-answer");

function currentQuestion() {
  return questions[shuffledOrder[currentPos]];
}

function renderQuestion(pos) {
  const q = currentQuestion();
  questionText.textContent = q.pergunta;
  questionIndicator.textContent = "Questão " + (pos + 1) + " de " + totalPorTreinamento;

  selected = -1;
  answered = false;

  optionsContainer.innerHTML = "";
  q.alternativas.forEach((texto, i) => {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.className = "option__input";
    input.type = "radio";
    input.name = "sin-question-" + pos;
    input.value = String(i);

    const span = document.createElement("span");
    span.className = "option__label";
    span.textContent = texto;

    label.appendChild(input);
    label.appendChild(span);
    label.dataset.index = String(i);
    label.addEventListener("click", () => {
      if (answered) return;
      selectOption(input);
    });

    optionsContainer.appendChild(label);
  });

  feedback.hidden = true;
  feedback.className = "feedback";
  feedback.innerHTML = "";

  btnAnswer.textContent = "Responder";
  btnAnswer.hidden = false;
}

function selectOption(input) {
  optionsContainer.querySelectorAll(".option__input").forEach((el) => {
    el.checked = false;
  });
  input.checked = true;
  selected = Number(input.value);
}

function confirmAnswer() {
  const q = currentQuestion();
  const correct = selected === q.correta;

  if (correct) acertos += 1;
  else erros += 1;

  optionsContainer.querySelectorAll(".option__input").forEach((input) => {
    input.disabled = true;
  });

  optionsContainer
    .querySelectorAll(".option")
    .forEach((label) => {
      label.removeEventListener("click", selectOption);
      label.style.pointerEvents = "none";
    });

  const chosen = optionsContainer.querySelector(
    '.option__input[value="' + selected + '"]'
  ).closest(".option");
  const correctLabel = optionsContainer.querySelector(
    '.option__input[value="' + q.correta + '"]'
  ).closest(".option");

  correctLabel.classList.add("is-correct");
  if (!correct) chosen.classList.add("is-wrong");

  feedback.classList.add(correct ? "feedback--correct" : "feedback--wrong");
  feedback.innerHTML =
    '<div class="feedback__status">' +
    (correct ? "Correta!" : "Incorreta") +
    "</div>" +
    '<div class="feedback__text">' +
    (correct ? q.explicacaoCorrecta : q.explicacaoErrada) +
    "</div>";
  feedback.hidden = false;

  if (currentPos === totalPorTreinamento - 1) {
    btnAnswer.textContent = "Finalizar";
  } else {
    btnAnswer.textContent = "Próxima questão";
  }
}

function startTraining() {
  shuffledOrder = shuffle(questions.map((_, i) => i));
  currentPos = 0;
  selected = -1;
  answered = false;
  acertos = 0;
  erros = 0;
  renderQuestion(0);
}

cardSinalizacao.addEventListener("click", () => {
  iniciarConteudoSinalizacao();
});

document.getElementById("btn-back-sinalizacao").addEventListener("click", () => {
  showView("view-trainings");
});

btnAnswer.addEventListener("click", () => {
  if (!answered && selected === -1) return;

  if (!answered) {
    answered = true;
    confirmAnswer();
    return;
  }

  if (currentPos < totalPorTreinamento - 1) {
    currentPos += 1;
    renderQuestion(currentPos);
} else {
    const total = totalPorTreinamento;
    const percent = total > 0 ? Math.round((acertos / total) * 100) : 0;

    salvarResultadoTreinamento({
      treinamento: "Sinalização",
      nota: total > 0 ? Math.round((acertos / total) * 10 * 10) / 10 : 0,
      acertos: acertos,
      erros: erros,
      percentual: percent,
    });

    document.getElementById("result-acertos").textContent = acertos;
    document.getElementById("result-erros").textContent = erros;
    document.getElementById("result-percent").textContent = percent + "%";

    showView("view-result-sinalizacao");
  }
});

document.getElementById("btn-back-to-trainings").addEventListener("click", () => {
  startTraining();
  showView("view-trainings");
});

/* ===== Conteúdo didático de Sinalização (curso linear) ===== */

const SEQUENCIA_AULAS = [];
for (let n = 1; n <= 7; n++) SEQUENCIA_AULAS.push("conteudo-aula-" + n);
SEQUENCIA_AULAS.push("conteudo-revisao", "conteudo-referencia");

const TOTAL_ETAPAS = SEQUENCIA_AULAS.length;

/* ===== Progresso das aulas concluídas (módulo de Sinalização) ===== */

const AULAS_CONCLUIDAS_KEY = "railsafe_sinalizacao_aulas_concluidas";

let aulasConcluidas = (function () {
  try {
    const raw = localStorage.getItem(AULAS_CONCLUIDAS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
})();

function salvarAulaConcluida(id) {
  if (!id.startsWith("conteudo-aula-")) return;
  aulasConcluidas = new Set(aulasConcluidas);
  aulasConcluidas.add(id);
  localStorage.setItem(AULAS_CONCLUIDAS_KEY, JSON.stringify(Array.from(aulasConcluidas)));
}

function atualizarProgressoCurso() {
  if (!cursoProgressoInfo) return;
  let count = 0;
  for (let n = 1; n <= 7; n++) {
    if (aulasConcluidas.has("conteudo-aula-" + n)) count++;
  }
  if (count === 0 || count === 7) {
    cursoProgressoInfo.hidden = true;
    return;
  }
  cursoProgressoInfo.textContent = count + " de 7 aulas concluídas";
  cursoProgressoInfo.hidden = false;
}

const aulaBody = document.getElementById("aula-body");
const btnAulaPrev = document.getElementById("btn-aula-prev");
const btnAulaNext = document.getElementById("btn-aula-next");
const progressoBloco = document.getElementById("curso-progresso");
const progressoLabel = document.getElementById("aula-progresso-label");
const progressoFill = document.getElementById("aula-progresso-fill");
const progressoBar = document.getElementById("aula-progresso-bar");
const cursoProgressoInfo = document.getElementById("curso-progresso-info");
const conteudoTemplates = document.querySelector(".conteudo__templates");

const atividadesContainer = document.getElementById("opcoes-atividade-sinal");
const btnAtividadeResponder = document.getElementById("btn-atividade-responder");
const feedbackAtividade = document.getElementById("feedback-atividade-sinal");
const respostaAtividadeTexto = document.getElementById("atividade-resposta-correta");

/**
 * Configuracao da atividade "Encontre o sinal apagado".
 * A alternativa correta (0 a 3, correspondente a "Sinal 1" a "Sinal 4")
 * deve ser definida quando a imagem for inserida.
 * Enquanto estiver como null, o app exibe o texto de reserva.
 */
const RESPOSTA_SINAL_APAGADO = null;

let aulaPos = 0;
let atividadeRespondida = false;
let atividadeSelecionada = -1;

function reiniciarAtividadeVisual() {
  atividadeRespondida = false;
  atividadeSelecionada = -1;
  feedbackAtividade.hidden = true;
  btnAtividadeResponder.hidden = false;
  atividadesContainer.querySelectorAll(".option__input").forEach((input) => {
    input.disabled = false;
    input.checked = false;
  });
  atividadesContainer.querySelectorAll(".option").forEach((label) => {
    label.style.pointerEvents = "";
    label.classList.remove("is-correct", "is-wrong");
  });
}

function nomeEtapa(id) {
  if (id.indexOf("conteudo-aula-") === 0) {
    const n = parseInt(id.replace("conteudo-aula-", ""), 10);
    return "Aula " + n + " de 7";
  }
  if (id === "conteudo-revisao") return "Revisão";
  if (id === "conteudo-referencia") return "Referência técnica";
  return "";
}

function proximoRotulo(id) {
  if (id === "conteudo-referencia") return "Iniciar quiz";
  if (id === "conteudo-revisao") return "Continuar para referências →";
  if (id === "conteudo-aula-7") return "Continuar para revisão →";
  return "Próxima aula →";
}

function abrirAula(id) {
  aulaPos = SEQUENCIA_AULAS.indexOf(id);
  const naSequencia = aulaPos !== -1;
  const conteudo = document.getElementById(id);
  while (aulaBody.firstChild) conteudoTemplates.appendChild(aulaBody.firstChild);
  if (conteudo) aulaBody.appendChild(conteudo);

  if (naSequencia) {
    const pct = Math.round(((aulaPos + 1) / TOTAL_ETAPAS) * 100);
    progressoBloco.hidden = false;
    progressoLabel.textContent = nomeEtapa(id);
    progressoFill.style.width = pct + "%";
    if (progressoBar) progressoBar.setAttribute("aria-valuenow", String(pct));

    btnAulaPrev.hidden = aulaPos === 0;
    btnAulaPrev.textContent = "← Aula anterior";
    btnAulaNext.hidden = false;
    btnAulaNext.textContent = proximoRotulo(id);
  } else {
    progressoBloco.hidden = true;
    btnAulaPrev.hidden = true;
    btnAulaNext.hidden = true;
  }

  if (id === "conteudo-atividade") reiniciarAtividadeVisual();
  if (typeof window !== "undefined") window.scrollTo(0, 0);
  showView("view-aula-sinalizacao");
}

function iniciarConteudoSinalizacao() {
  atualizarProgressoCurso();
  showView("view-conteudo-sinalizacao");
}

document.getElementById("btn-iniciar-treinamento-sinalizacao").addEventListener("click", () => {
  abrirAula("conteudo-aula-1");
});

document.getElementById("btn-avaliacao-sinalizacao").addEventListener("click", () => {
  showView("view-sinalizacao");
  startTraining();
});

document.getElementById("btn-back-conteudo-sinalizacao").addEventListener("click", () => {
  showView("view-trainings");
});

document.getElementById("btn-back-aula-sinalizacao").addEventListener("click", () => {
  atualizarProgressoCurso();
  showView("view-conteudo-sinalizacao");
});

btnAulaPrev.addEventListener("click", () => {
  if (aulaPos > 0) abrirAula(SEQUENCIA_AULAS[aulaPos - 1]);
});

btnAulaNext.addEventListener("click", () => {
  salvarAulaConcluida(SEQUENCIA_AULAS[aulaPos]);
  if (aulaPos === SEQUENCIA_AULAS.length - 1) {
    showView("view-sinalizacao");
    startTraining();
    return;
  }
  abrirAula(SEQUENCIA_AULAS[aulaPos + 1]);
});

atividadesContainer.querySelectorAll(".option__input").forEach((input) => {
  input.addEventListener("change", () => {
    atividadeSelecionada = Number(input.value);
  });
});

btnAtividadeResponder.addEventListener("click", () => {
  if (atividadeSelecionada === -1) return;

  respostaAtividadeTexto.textContent = RESPOSTA_SINAL_APAGADO === null
    ? "[Sinal correspondente a imagem]"
    : "Sinal " + (RESPOSTA_SINAL_APAGADO + 1);

  feedbackAtividade.hidden = false;

  if (RESPOSTA_SINAL_APAGADO !== null) {
    const chosen = atividadesContainer.querySelector(
      '.option__input[value="' + atividadeSelecionada + '"]'
    ).closest(".option");
    const correctLabel = atividadesContainer.querySelector(
      '.option__input[value="' + RESPOSTA_SINAL_APAGADO + '"]'
    ).closest(".option");
    correctLabel.classList.add("is-correct");
    if (atividadeSelecionada !== RESPOSTA_SINAL_APAGADO) {
      chosen.classList.add("is-wrong");
    }
  }

  atividadesContainer.querySelectorAll(".option__input").forEach((input) => {
    input.disabled = true;
  });
  atividadesContainer.querySelectorAll(".option").forEach((label) => {
    label.style.pointerEvents = "none";
  });

  btnAtividadeResponder.hidden = true;
  atividadeRespondida = true;
});

/* ===== Conteúdo didático de AMV (curso linear) ===== */

const AMV_SEQUENCIA_AULAS = [];
for (let n = 1; n <= 7; n++) AMV_SEQUENCIA_AULAS.push("conteudo-amv-aula-" + n);
AMV_SEQUENCIA_AULAS.push("conteudo-amv-revisao", "conteudo-amv-referencia");

const AMV_TOTAL_ETAPAS = AMV_SEQUENCIA_AULAS.length;

/* ===== Progresso das aulas concluídas (módulo de AMV) ===== */

const AMV_AULAS_CONCLUIDAS_KEY = "railsafe_amv_aulas_concluidas";

let amvAulasConcluidas = (function () {
  try {
    const raw = localStorage.getItem(AMV_AULAS_CONCLUIDAS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
})();

function salvarAulaConcluidaAmv(id) {
  if (id.indexOf("conteudo-amv-aula-") !== 0) return;
  amvAulasConcluidas = new Set(amvAulasConcluidas);
  amvAulasConcluidas.add(id);
  localStorage.setItem(AMV_AULAS_CONCLUIDAS_KEY, JSON.stringify(Array.from(amvAulasConcluidas)));
}

function atualizarProgressoCursoAmv() {
  const info = document.getElementById("curso-progresso-info-amv");
  if (!info) return;
  let count = 0;
  for (let n = 1; n <= 7; n++) {
    if (amvAulasConcluidas.has("conteudo-amv-aula-" + n)) count++;
  }
  if (count === 0 || count === 7) {
    info.hidden = true;
    return;
  }
  info.textContent = count + " de 7 aulas concluídas";
  info.hidden = false;
}

let aulaPosAmv = 0;

const aulaBodyAmv = document.getElementById("aula-body-amv");
const btnAulaPrevAmv = document.getElementById("btn-aula-prev-amv");
const btnAulaNextAmv = document.getElementById("btn-aula-next-amv");
const progressoBlocoAmv = document.getElementById("curso-progresso-amv");
const progressoLabelAmv = document.getElementById("aula-progresso-label-amv");
const progressoFillAmv = document.getElementById("aula-progresso-fill-amv");
const progressoBarAmv = document.getElementById("aula-progresso-bar-amv");
const conteudoTemplatesAmv = document.querySelector("#view-aula-amv .conteudo__templates");

function nomeEtapaAmv(id) {
  if (id.indexOf("conteudo-amv-aula-") === 0) {
    const n = parseInt(id.replace("conteudo-amv-aula-", ""), 10);
    return "Aula " + n + " de 7";
  }
  if (id === "conteudo-amv-revisao") return "Revisão";
  if (id === "conteudo-amv-referencia") return "Referência técnica";
  return "";
}

function proximoRotuloAmv(id) {
  if (id === "conteudo-amv-referencia") return "Iniciar quiz";
  if (id === "conteudo-amv-revisao") return "Continuar para referências →";
  if (id === "conteudo-amv-aula-7") return "Continuar para revisão →";
  return "Próxima aula →";
}

function abrirAulaAmv(id) {
  aulaPosAmv = AMV_SEQUENCIA_AULAS.indexOf(id);
  const naSequencia = aulaPosAmv !== -1;
  const conteudo = document.getElementById(id);
  while (aulaBodyAmv.firstChild) conteudoTemplatesAmv.appendChild(aulaBodyAmv.firstChild);
  if (conteudo) aulaBodyAmv.appendChild(conteudo);

  if (naSequencia) {
    const pct = Math.round(((aulaPosAmv + 1) / AMV_TOTAL_ETAPAS) * 100);
    progressoBlocoAmv.hidden = false;
    progressoLabelAmv.textContent = nomeEtapaAmv(id);
    progressoFillAmv.style.width = pct + "%";
    if (progressoBarAmv) progressoBarAmv.setAttribute("aria-valuenow", String(pct));

    btnAulaPrevAmv.hidden = aulaPosAmv === 0;
    btnAulaPrevAmv.textContent = "← Aula anterior";
    btnAulaNextAmv.hidden = false;
    btnAulaNextAmv.textContent = proximoRotuloAmv(id);
  } else {
    progressoBlocoAmv.hidden = true;
    btnAulaPrevAmv.hidden = true;
    btnAulaNextAmv.hidden = true;
  }

  if (typeof window !== "undefined") window.scrollTo(0, 0);
  showView("view-aula-amv");
}

function iniciarConteudoAmv() {
  atualizarProgressoCursoAmv();
  showView("view-conteudo-amv");
}

document.getElementById("btn-iniciar-treinamento-amv").addEventListener("click", () => {
  abrirAulaAmv("conteudo-amv-aula-1");
});

document.getElementById("btn-avaliacao-amv").addEventListener("click", () => {
  showView("view-amv");
  startAmvTraining();
});

document.getElementById("btn-back-conteudo-amv").addEventListener("click", () => {
  showView("view-trainings");
});

document.getElementById("btn-back-aula-amv").addEventListener("click", () => {
  atualizarProgressoCursoAmv();
  showView("view-conteudo-amv");
});

btnAulaPrevAmv.addEventListener("click", () => {
  if (aulaPosAmv > 0) abrirAulaAmv(AMV_SEQUENCIA_AULAS[aulaPosAmv - 1]);
});

btnAulaNextAmv.addEventListener("click", () => {
  salvarAulaConcluidaAmv(AMV_SEQUENCIA_AULAS[aulaPosAmv]);
  if (aulaPosAmv === AMV_SEQUENCIA_AULAS.length - 1) {
    showView("view-amv");
    startAmvTraining();
    return;
  }
  abrirAulaAmv(AMV_SEQUENCIA_AULAS[aulaPosAmv + 1]);
});

/* ===== Treinamento de AMV ===== */

const amvQuestions = [
  {
    id: 1,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Em uma via ferroviária, qual é a principal finalidade de um Aparelho de Mudança de Via (AMV)?",
    alternativas: [
      "Controlar a velocidade do veículo durante toda a circulação.",
      "Estabelecer a conexão entre vias e direcionar o veículo para a trajetória correspondente à posição definida no aparelho.",
      "Realizar a frenagem do veículo antes da passagem pelo aparelho.",
      "Determinar o sentido de circulação de toda a linha.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O AMV estabelece a conexão entre vias e direciona o veículo para a trajetória correspondente à posição definida no aparelho.",
    explicacaoErrada:
      "O AMV não controla a velocidade nem realiza a frenagem do veículo. Sua finalidade é estabelecer a conexão entre vias e direcionar o veículo para a trajetória correspondente à posição definida no aparelho, e não determinar o sentido de circulação de toda a linha.",
  },
  {
    id: 2,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Por que o AMV é constituído por diferentes componentes que atuam de forma conjunta?",
    alternativas: [
      "Porque cada componente determina uma velocidade diferente para o veículo.",
      "Porque a mudança de via depende somente da combinação entre componentes fixos.",
      "Porque os diferentes elementos participam da orientação e da condução do veículo durante sua passagem.",
      "Porque cada componente funciona independentemente dos demais.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O funcionamento do AMV depende da atuação conjunta dos diferentes elementos que formam o aparelho.",
    explicacaoErrada:
      "Os componentes não atuam de forma independente nem determinam velocidades diferentes. A mudança de via depende da atuação conjunta dos elementos, que participam da orientação e da condução do veículo durante sua passagem, e não somente da combinação entre componentes fixos.",
  },
  {
    id: 3,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um veículo se aproxima de um AMV que está configurado para determinada trajetória. O que a posição estabelecida no aparelho representa nesse contexto?",
    alternativas: [
      "A trajetória correspondente à configuração definida para a passagem do veículo.",
      "O comprimento total do AMV.",
      "A posição do centro do jacaré.",
      "A distância entre o CMV e o FMV.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A posição estabelecida no AMV determina a trajetória correspondente para a passagem do veículo.",
    explicacaoErrada:
      "A posição do aparelho representa a trajetória correspondente à configuração definida para a passagem do veículo, e não o comprimento do AMV, a posição do centro do jacaré ou a distância entre o CMV e o FMV.",
  },
  {
    id: 4,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Por que conhecer os componentes do AMV é importante para compreender seu funcionamento?",
    alternativas: [
      "Porque todos os componentes possuem a mesma função.",
      "Porque é necessário compreender a função desempenhada pelos diferentes elementos que formam o conjunto.",
      "Porque somente os componentes móveis participam do funcionamento.",
      "Porque os componentes definem exclusivamente a geometria da via.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O estudo do AMV envolve compreender seus principais componentes, suas denominações e a função desempenhada por cada um.",
    explicacaoErrada:
      "Os componentes não possuem todos a mesma função e nem somente os componentes móveis participam do funcionamento. Compreender o AMV envolve conhecer seus principais componentes, suas denominações e a função desempenhada por cada um.",
  },
  {
    id: 5,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual situação representa melhor a função geral de um AMV?",
    alternativas: [
      "Um veículo permanece obrigatoriamente na mesma via durante toda a passagem.",
      "Um veículo utiliza o aparelho para estabelecer uma trajetória entre vias conforme a configuração definida.",
      "Um veículo altera sua velocidade sem modificar sua trajetória.",
      "Um veículo utiliza o aparelho exclusivamente para realizar uma parada.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O AMV possibilita a conexão entre vias e direciona o veículo para a trajetória correspondente à configuração estabelecida.",
    explicacaoErrada:
      "O AMV possibilita a conexão entre vias e direciona o veículo para a trajetória correspondente à configuração definida. Ele não mantém o veículo obrigatoriamente na mesma via nem é utilizado para alterar a velocidade ou realizar uma parada.",
  },
  {
    id: 6,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual conjunto está relacionado à movimentação e ao posicionamento das agulhas?",
    alternativas: [
      "Agulhagem.",
      "Contratrilho.",
      "Coração.",
      "Trilhos de ligação.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A agulhagem é formada pelas agulhas, contra-agulhas e elementos associados à movimentação das agulhas.",
    explicacaoErrada:
      "A agulhagem reúne as agulhas, as contra-agulhas e os elementos associados à movimentação das agulhas. O contratrilho, o coração e os trilhos de ligação possuem outras funções no conjunto.",
  },
  {
    id: 7,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a função do aparelho de manobra, também denominado máquina de chave?",
    alternativas: [
      "Conduzir o rodeiro na região do jacaré.",
      "Movimentar as agulhas e colocá-las na posição necessária.",
      "Definir o comprimento do AMV.",
      "Formar o núcleo do coração.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O aparelho de manobra movimenta as agulhas e as coloca na posição correspondente à configuração desejada.",
    explicacaoErrada:
      "O aparelho de manobra, também denominado máquina de chave, movimenta as agulhas e as posiciona conforme a configuração desejada. Ele não conduz o rodeiro na região do jacaré, não define o comprimento do AMV nem forma o núcleo do coração.",
  },
  {
    id: 8,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a função dos trilhos de ligação no conjunto do AMV?",
    alternativas: [
      "Estabelecer a ligação entre a região da agulhagem e as demais partes do aparelho.",
      "Movimentar as agulhas.",
      "Definir a posição do VMV.",
      "Estabelecer o espaçamento para o flange na região do coração.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Os trilhos de ligação fazem parte do conjunto e estabelecem a ligação entre a região da agulhagem e as demais partes do aparelho.",
    explicacaoErrada:
      "Os trilhos de ligação estabelecem a ligação entre a região da agulhagem e as demais partes do aparelho. Eles não movimentam as agulhas, não definem a posição do VMV nem estabelecem o espaçamento para o flange na região do coração.",
  },
  {
    id: 9,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual componente está localizado na região em que ocorre o cruzamento das vias?",
    alternativas: [
      "CMV.",
      "Aparelho de manobra.",
      "Coração ou jacaré.",
      "Trilho de ligação.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O coração, também denominado jacaré, está localizado na região de cruzamento das vias.",
    explicacaoErrada:
      "O coração, também denominado jacaré, está localizado na região em que ocorre o cruzamento das vias. Os demais elementos citados possuem outras localizações e funções no conjunto.",
  },
  {
    id: 10,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual alternativa apresenta somente elementos mencionados no treinamento como componentes do AMV?",
    alternativas: [
      "Agulhagem, aparelho de manobra, coração e contratrilhos.",
      "Sinal principal, coração, contratrilho e agulhagem.",
      "Pantógrafo, aparelho de manobra, coração e trilho de ligação.",
      "Rodeiro, sinalização, contratrilho e coração.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Todos os elementos da alternativa A são apresentados no material como componentes do conjunto do AMV.",
    explicacaoErrada:
      "A alternativa A reúne apenas componentes apresentados no material como elementos do conjunto do AMV. Sinal principal, pantógrafo, rodeiro e sinalização pertencem a outros sistemas.",
  },
  {
    id: 11,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Na forma básica do AMV apresentada no treinamento, como são caracterizadas a via principal e a via de desvio?",
    alternativas: [
      "A via principal é curva e a via de desvio é reta.",
      "Ambas são retas e diferem apenas pelo sentido de circulação.",
      "A via principal é reta e a via de desvio é curva.",
      "Ambas são curvas e possuem raios diferentes.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Na forma básica apresentada, a via principal corresponde à via reta e a via de desvio à via desviada, curva.",
    explicacaoErrada:
      "Na forma básica apresentada, a via principal é reta e a via de desvio é curva, desviada. As demais combinações não correspondem à caracterização apresentada no treinamento.",
  },
  {
    id: 12,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "O que caracteriza o CMV?",
    alternativas: [
      "É a interseção das tangentes da via principal e da via de desvio.",
      "Corresponde ao início do trilho de encosto da agulha.",
      "Corresponde ao fim da mudança de via.",
      "Corresponde ao centro do jacaré.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "CMV significa Começo da Mudança de Via e corresponde ao início do trilho de encosto da agulha.",
    explicacaoErrada:
      "CMV significa Começo da Mudança de Via e corresponde ao início do trilho de encosto da agulha. A interseção das tangentes corresponde ao VMV, e o fim da mudança de via corresponde ao FMV.",
  },
  {
    id: 13,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Como é definido o comprimento do AMV?",
    alternativas: [
      "Pela distância entre o centro do jacaré e o VMV.",
      "Pela distância entre o início da agulhagem e o centro do contratrilho.",
      "Pela distância em linha reta entre o CMV e o FMV.",
      "Pela distância entre o CMV e o VMV.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O material define o comprimento do AMV pela distância em linha reta entre o CMV e o FMV.",
    explicacaoErrada:
      "O comprimento do AMV é definido pela distância em linha reta entre o CMV e o FMV, e não pelas demais medidas apresentadas.",
  },
  {
    id: 14,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual referência corresponde ao fim da mudança de via?",
    alternativas: [
      "CMV.",
      "FMV.",
      "VMV.",
      "Coração.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "FMV significa Fim da Mudança de Via.",
    explicacaoErrada:
      "FMV significa Fim da Mudança de Via. CMV corresponde ao começo, VMV ao vértice da mudança de via, e o coração está localizado na região de cruzamento das vias.",
  },
  {
    id: 15,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Como o VMV é definido no treinamento?",
    alternativas: [
      "Como o início do trilho de encosto da agulha.",
      "Como o fim da mudança de via.",
      "Como a interseção das tangentes da via principal com a via de desvio.",
      "Como o centro geométrico do coração.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "VMV significa Vértice da Mudança de Via e corresponde à interseção das tangentes da via principal com a via de desvio.",
    explicacaoErrada:
      "VMV significa Vértice da Mudança de Via e corresponde à interseção das tangentes da via principal com a via de desvio, e não às demais referências apresentadas.",
  },
  {
    id: 16,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um profissional precisa identificar as principais referências utilizadas para compreender a geometria e a localização de um AMV. Qual conjunto deve consultar?",
    alternativas: [
      "CMV, FMV e VMV.",
      "CMV, coração e contratrilho.",
      "FMV, agulhagem e aparelho de manobra.",
      "VMV, núcleo e pernas do jacaré.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "CMV, FMV e VMV são as referências apresentadas no treinamento para a identificação da posição e das características geométricas do AMV.",
    explicacaoErrada:
      "As referências geométricas do AMV são CMV, FMV e VMV. Os demais conjuntos reúnem componentes do aparelho, e não referências geométricas.",
  },
  {
    id: 17,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual relação entre a posição das agulhas e a configuração do AMV está correto afirmar?",
    alternativas: [
      "A posição das agulhas determina o comprimento do aparelho.",
      "A posição das agulhas estabelece a direção correspondente à passagem do veículo.",
      "A posição das agulhas define a geometria do jacaré.",
      "A posição das agulhas determina o espaçamento do contratrilho.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "As agulhas são elementos móveis da agulhagem, e seu posicionamento estabelece a direção que será seguida pelo veículo.",
    explicacaoErrada:
      "As agulhas são elementos móveis da agulhagem, e seu posicionamento estabelece a direção que será seguida pelo veículo. Elas não determinam o comprimento do aparelho, a geometria do jacaré nem o espaçamento do contratrilho.",
  },
  {
    id: 18,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual componente realiza a movimentação das agulhas para estabelecer a configuração desejada do AMV?",
    alternativas: [
      "Coração ou jacaré.",
      "Contratrilho.",
      "Aparelho de manobra.",
      "Trilho de ligação.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O aparelho de manobra, também denominado máquina de chave, movimenta as agulhas.",
    explicacaoErrada:
      "O aparelho de manobra, também denominado máquina de chave, é o componente que movimenta as agulhas. O coração, o contratrilho e os trilhos de ligação possuem outras funções.",
  },
  {
    id: 19,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "O que ocorre com a condição estabelecida para a passagem do veículo quando a posição das agulhas é alterada?",
    alternativas: [
      "A condição de passagem é modificada de acordo com a nova configuração.",
      "O comprimento do AMV é alterado.",
      "A posição do VMV é alterada.",
      "A geometria do jacaré é modificada.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A alteração da posição das agulhas modifica a condição estabelecida para a passagem do veículo e sua trajetória.",
    explicacaoErrada:
      "Ao alterar a posição das agulhas, a condição de passagem e a trajetória do veículo são modificadas de acordo com a nova configuração. O comprimento do AMV, a posição do VMV e a geometria do jacaré não são alterados.",
  },
  {
    id: 20,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual alternativa apresenta corretamente a composição da agulhagem conforme o material?",
    alternativas: [
      "Agulhas, contra-agulhas e elementos associados à movimentação das agulhas.",
      "Núcleo, pernas e contratrilho.",
      "CMV, FMV e VMV.",
      "Trilhos de ligação, coração e calços.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O material define a agulhagem como o conjunto formado pelas agulhas, contra-agulhas e elementos associados à movimentação das agulhas.",
    explicacaoErrada:
      "A agulhagem é o conjunto formado pelas agulhas, contra-agulhas e elementos associados à movimentação das agulhas. As demais alternativas reúnem outros elementos ou referências do AMV.",
  },
  {
    id: 21,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Por que a movimentação das agulhas é fundamental para o funcionamento do AMV?",
    alternativas: [
      "Porque determina o comprimento do aparelho.",
      "Porque estabelece a configuração correspondente à trajetória que será seguida pelo veículo.",
      "Porque modifica a geometria do coração.",
      "Porque determina a posição do contratrilho.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A movimentação das agulhas determina a configuração estabelecida para a passagem do veículo.",
    explicacaoErrada:
      "A movimentação das agulhas estabelece a configuração correspondente à trajetória que será seguida pelo veículo. Ela não determina o comprimento do aparelho, a geometria do coração nem a posição do contratrilho.",
  },
  {
    id: 22,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Em qual região do AMV está localizado o coração ou jacaré?",
    alternativas: [
      "Na região inicial da agulhagem.",
      "Na região em que ocorre o cruzamento das vias.",
      "Na região do aparelho de manobra.",
      "Na extremidade da via principal.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O coração ou jacaré está localizado na região de cruzamento das vias.",
    explicacaoErrada:
      "O coração ou jacaré está localizado na região em que ocorre o cruzamento das vias, e não na agulhagem, no aparelho de manobra ou na extremidade da via principal.",
  },
  {
    id: 23,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Quais elementos formam a estrutura do jacaré?",
    alternativas: [
      "Agulhas e contra-agulhas.",
      "Núcleo e pernas.",
      "Gola e centro do contratrilho.",
      "CMV e FMV.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O jacaré possui um núcleo e pernas, que formam sua estrutura.",
    explicacaoErrada:
      "O jacaré é formado por núcleo e pernas. Agulhas e contra-agulhas compõem a agulhagem, e gola e centro são elementos associados ao contratrilho.",
  },
  {
    id: 24,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual conjunto apresenta exclusivamente configurações de jacaré mencionadas no treinamento?",
    alternativas: [
      "Fixo, móvel e com núcleo removível.",
      "Reto, curvo e móvel.",
      "Simples, duplo e triplo.",
      "Principal, desviado e móvel.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O material apresenta três configurações: jacaré fixo, jacaré móvel e jacaré com núcleo removível.",
    explicacaoErrada:
      "As configurações de jacaré apresentadas no material são fixo, móvel e com núcleo removível. As demais não correspondem às classificações apresentadas.",
  },
  {
    id: 25,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "No jacaré fixo, como o núcleo se relaciona com as pernas?",
    alternativas: [
      "O núcleo é rigidamente fixado às pernas.",
      "O núcleo se movimenta em relação às pernas.",
      "O núcleo é independente das pernas durante a circulação.",
      "O núcleo é substituído pelos contratrilhos.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "No jacaré fixo, o núcleo é rigidamente fixado às pernas.",
    explicacaoErrada:
      "No jacaré fixo, o núcleo permanece rigidamente fixado às pernas. As demais relações não correspondem ao funcionamento do jacaré fixo.",
  },
  {
    id: 26,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Quanto à geometria, quais configurações de jacaré são apresentadas no material?",
    alternativas: [
      "Reto ou curvo.",
      "Fixo ou móvel.",
      "Principal ou de desvio.",
      "Simples ou duplo.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O material apresenta o jacaré como reto ou curvo quanto à sua geometria.",
    explicacaoErrada:
      "Quanto à geometria, o jacaré é apresentado como reto ou curvo. Fixo e móvel dizem respeito à configuração construtiva, e não à geometria.",
  },
  {
    id: 27,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual característica corresponde ao jacaré com núcleo removível?",
    alternativas: [
      "O núcleo é movimentado pelo aparelho de manobra.",
      "O núcleo é fixado às pernas e pode ser removido.",
      "As pernas são removidas durante a passagem do veículo.",
      "O núcleo substitui as agulhas durante a mudança de via.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "No jacaré com núcleo removível, o núcleo é fixado às pernas e pode ser removido.",
    explicacaoErrada:
      "No jacaré com núcleo removível, o núcleo é fixado às pernas e pode ser removido. Ele não é movimentado pelo aparelho de manobra nem substitui as agulhas durante a mudança de via.",
  },
  {
    id: 28,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a principal relação do contratrilho com a circulação do veículo na região do jacaré?",
    alternativas: [
      "Movimentar as agulhas.",
      "Participar da condução do rodeiro.",
      "Definir o comprimento do AMV.",
      "Estabelecer a posição do VMV.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O contratrilho é relacionado à condução do rodeiro na região do jacaré.",
    explicacaoErrada:
      "O contratrilho participa da condução do rodeiro na região do jacaré. Ele não movimenta as agulhas, não define o comprimento do AMV nem estabelece a posição do VMV.",
  },
  {
    id: 29,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Por que a disposição do contratrilho em relação aos demais elementos da via é importante?",
    alternativas: [
      "Porque estabelece o espaço necessário para a passagem do flange da roda.",
      "Porque define a posição do VMV.",
      "Porque determina o comprimento do AMV.",
      "Porque movimenta as agulhas.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A disposição do contratrilho estabelece o espaço necessário para a passagem do flange da roda na região do coração.",
    explicacaoErrada:
      "A disposição do contratrilho é importante porque estabelece o espaço necessário para a passagem do flange da roda. Ela não define a posição do VMV, não determina o comprimento do AMV nem movimenta as agulhas.",
  },
  {
    id: 30,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual elemento é citado no treinamento como parte associada ao contratrilho?",
    alternativas: [
      "Gola do contratrilho.",
      "Agulha móvel.",
      "Núcleo do jacaré.",
      "VMV.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A gola do contratrilho é um dos elementos associados ao contratrilho.",
    explicacaoErrada:
      "A gola do contratrilho é citada como elemento associado ao contratrilho. Agulha móvel e núcleo do jacaré pertencem a outros conjuntos, e o VMV é uma referência geométrica.",
  },
  {
    id: 31,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual alternativa reúne exclusivamente elementos associados ao contratrilho citados no treinamento?",
    alternativas: [
      "Gola, centro, trilho de encosto e placa de apoio do contratrilho.",
      "CMV, FMV, VMV e núcleo.",
      "Agulha, contra-agulha, coração e máquina de chave.",
      "Núcleo, pernas, agulha e trilho de ligação.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O treinamento cita a gola, o centro, o trilho de encosto e a placa de apoio do contratrilho como elementos associados a ele.",
    explicacaoErrada:
      "Gola, centro, trilho de encosto e placa de apoio do contratrilho são os elementos associados citados no treinamento. As demais alternativas reúnem outros elementos ou referências do AMV.",
  },
  {
    id: 32,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a função do calço do contratrilho fixo?",
    alternativas: [
      "Movimentar o contratrilho durante a passagem do veículo.",
      "Assegurar o espaçamento necessário à passagem do flange da roda.",
      "Alterar a posição das agulhas.",
      "Definir a geometria do jacaré.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O calço do contratrilho fixo é utilizado entre o trilho de encosto e o contratrilho para assegurar o espaçamento necessário à passagem do flange.",
    explicacaoErrada:
      "O calço do contratrilho fixo assegura o espaçamento necessário à passagem do flange da roda. Ele não movimenta o contratrilho, não altera a posição das agulhas nem define a geometria do jacaré.",
  },
  {
    id: 33,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um profissional está analisando a função do contratrilho na região do coração. Qual afirmação está de acordo com o treinamento?",
    alternativas: [
      "O contratrilho participa da condução do rodeiro e está relacionado ao espaço para passagem do flange.",
      "O contratrilho movimenta as agulhas para selecionar a trajetória.",
      "O contratrilho define o comprimento entre CMV e FMV.",
      "O contratrilho estabelece a geometria do jacaré.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O contratrilho participa da condução do rodeiro e sua disposição está relacionada ao espaço necessário para a passagem do flange.",
    explicacaoErrada:
      "O contratrilho participa da condução do rodeiro e está relacionado ao espaço necessário para a passagem do flange. As demais funções apresentadas não correspondem ao contratrilho.",
  },
  {
    id: 34,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual definição corresponde ao travessão?",
    alternativas: [
      "Conjunto formado por dois AMV interligados, assentados em vias diferentes e em sentidos opostos.",
      "Conjunto formado por quatro AMV e dois cruzamentos.",
      "Um único AMV com duas posições de agulhagem.",
      "Conjunto formado por dois corações instalados na mesma via.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O travessão é formado por dois aparelhos de mudança de via interligados, assentados em vias diferentes e em sentidos opostos.",
    explicacaoErrada:
      "O travessão é formado por dois aparelhos de mudança de via interligados, assentados em vias diferentes e em sentidos opostos. As demais definições não correspondem ao travessão.",
  },
  {
    id: 35,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual possibilidade está associada à configuração de um travessão?",
    alternativas: [
      "A transposição direta de um trem ou veículo de uma via para outra.",
      "A alteração do comprimento de um AMV.",
      "A substituição da agulhagem por um coração.",
      "A eliminação da necessidade de aparelhos de manobra.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A disposição dos dois AMV interligados permite a transposição direta de um trem ou veículo de uma via para outra.",
    explicacaoErrada:
      "A configuração do travessão permite a transposição direta de um trem ou veículo de uma via para outra. As demais possibilidades não correspondem ao funcionamento do travessão.",
  },
  {
    id: 36,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a composição do travessão duplo?",
    alternativas: [
      "Dois AMV's.",
      "Três AMV's.",
      "Quatro AMV's.",
      "Seis AMV's.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O travessão duplo é formado por quatro aparelhos de mudança de via.",
    explicacaoErrada:
      "O travessão duplo é formado por quatro aparelhos de mudança de via, e não por dois, três ou seis.",
  },
  {
    id: 37,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual característica diferencia o travessão duplo do travessão simples?",
    alternativas: [
      "O travessão duplo utiliza quatro AMV's, enquanto o travessão simples utiliza dois.",
      "O travessão duplo utiliza dois AMV's, enquanto o travessão simples utiliza um.",
      "O travessão duplo não possui aparelhos de mudança de via.",
      "O travessão simples possui um cruzamento e o duplo não possui.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Essa é a diferença de composição apresentada no treinamento entre as duas configurações.",
    explicacaoErrada:
      "A diferença apresentada é que o travessão duplo utiliza quatro AMV's, enquanto o travessão simples utiliza dois.",
  },
  {
    id: 38,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um AMV precisa ser configurado para uma determinada trajetória antes da passagem de um veículo. Qual sequência representa corretamente a relação entre os elementos estudados?",
    alternativas: [
      "O contratrilho movimenta as agulhas e o coração define a posição do aparelho.",
      "O aparelho de manobra movimenta as agulhas, cuja posição estabelece a configuração correspondente à trajetória do veículo.",
      "O coração movimenta o aparelho de manobra e as agulhas definem o comprimento do AMV.",
      "O VMV movimenta as agulhas e o contratrilho estabelece a via principal.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O aparelho de manobra movimenta as agulhas, e o posicionamento delas estabelece a configuração correspondente à trajetória do veículo.",
    explicacaoErrada:
      "A relação correta é: o aparelho de manobra movimenta as agulhas e a posição delas estabelece a configuração correspondente à trajetória do veículo. As demais sequências não correspondem ao funcionamento do AMV.",
  },
  {
    id: 39,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um profissional precisa identificar corretamente três referências geométricas do AMV. Qual associação está correta?",
    alternativas: [
      "CMV — início do trilho de encosto da agulha; FMV — fim da mudança de via; VMV — interseção das tangentes da via principal com a via de desvio.",
      "CMV — fim da mudança de via; FMV — início do trilho de encosto; VMV — centro do jacaré.",
      "CMV — centro do contratrilho; FMV — início da agulhagem; VMV — fim da via de desvio.",
      "CMV — interseção das tangentes; FMV — centro do jacaré; VMV — fim da mudança de via.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A alternativa A reúne corretamente as definições de CMV, FMV e VMV apresentadas no treinamento.",
    explicacaoErrada:
      "A alternativa A apresenta corretamente as definições: CMV é o início do trilho de encosto da agulha, FMV o fim da mudança de via e VMV a interseção das tangentes da via principal com a via de desvio.",
  },
  {
    id: 40,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um profissional precisa explicar, de forma integrada, como os principais elementos estudados participam do funcionamento do AMV. Qual alternativa está correta?",
    alternativas: [
      "O aparelho de manobra movimenta as agulhas; a posição das agulhas estabelece a trajetória; o coração está na região de cruzamento; e o contratrilho participa da condução do rodeiro nessa região.",
      "O contratrilho movimenta as agulhas; o coração define o comprimento do AMV; e o aparelho de manobra conduz o rodeiro.",
      "O coração movimenta as agulhas; o VMV estabelece a posição do AMV; e o contratrilho determina o comprimento do aparelho.",
      "As agulhas definem a geometria do jacaré; o FMV movimenta o aparelho de manobra; e o coração estabelece a via principal.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A alternativa A apresenta a relação funcional entre os elementos: o aparelho de manobra atua sobre as agulhas, o posicionamento das agulhas estabelece a trajetória do veículo, o coração está situado na região de cruzamento e o contratrilho contribui para a condução do rodeiro nessa região, mantendo as condições necessárias para sua passagem.",
    explicacaoErrada:
      "A alternativa A apresenta corretamente a atuação integrada dos elementos: aparelho de manobra atuando sobre as agulhas, posicionamento das agulhas estabelecendo a trajetória, coração na região de cruzamento e contratrilho contribuindo para a condução do rodeiro. As demais alternativas invertem ou atribuem funções incorretas aos elementos.",
  },
];

const QUESTIONS_PER_TRAINING = 10;

const amvObjetivo = Math.min(amvQuestions.length, QUESTIONS_PER_TRAINING);

const amvMax = amvObjetivo;

let amvShuffledOrder = [];
let amvCurrentPos = 0;
let amvSelected = -1;
let amvAnswered = false;
let amvAcertos = 0;
let amvErros = 0;

const cardAmv = document.querySelector('[data-training="amv"]');
const amvOptionsContainer = document.getElementById("options-amv");
const amvQuestionText = document.getElementById("question-text-amv");
const amvQuestionIndicator = document.getElementById("question-indicator-amv");
const amvFeedback = document.getElementById("feedback-amv");
const amvBtnAnswer = document.getElementById("btn-answer-amv");

function amvCurrentQuestion() {
  return amvQuestions[amvShuffledOrder[amvCurrentPos]];
}

function renderAmvQuestion(pos) {
  const q = amvCurrentQuestion();
  amvQuestionText.textContent = q.pergunta;
  amvQuestionIndicator.textContent = "Questão " + (pos + 1) + " de " + amvMax;

  amvSelected = -1;
  amvAnswered = false;

  amvOptionsContainer.innerHTML = "";
  q.alternativas.forEach((texto, i) => {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.className = "option__input";
    input.type = "radio";
    input.name = "amv-question-" + pos;
    input.value = String(i);

    const span = document.createElement("span");
    span.className = "option__label";
    span.textContent = texto;

    label.appendChild(input);
    label.appendChild(span);
    label.dataset.index = String(i);
    label.addEventListener("click", () => {
      if (amvAnswered) return;
      selectAmvOption(input);
    });

    amvOptionsContainer.appendChild(label);
  });

  amvFeedback.hidden = true;
  amvFeedback.className = "feedback";
  amvFeedback.innerHTML = "";

  amvBtnAnswer.textContent = "Responder";
  amvBtnAnswer.hidden = false;
}

function selectAmvOption(input) {
  amvOptionsContainer.querySelectorAll(".option__input").forEach((el) => {
    el.checked = false;
  });
  input.checked = true;
  amvSelected = Number(input.value);
}

function confirmAmvAnswer() {
  const q = amvCurrentQuestion();
  const correct = amvSelected === q.correta;

  if (correct) amvAcertos += 1;
  else amvErros += 1;

  amvOptionsContainer.querySelectorAll(".option__input").forEach((input) => {
    input.disabled = true;
  });

  amvOptionsContainer.querySelectorAll(".option").forEach((label) => {
    label.style.pointerEvents = "none";
  });

  const chosen = amvOptionsContainer.querySelector(
    '.option__input[value="' + amvSelected + '"]'
  ).closest(".option");
  const correctLabel = amvOptionsContainer.querySelector(
    '.option__input[value="' + q.correta + '"]'
  ).closest(".option");

  correctLabel.classList.add("is-correct");
  if (!correct) chosen.classList.add("is-wrong");

  amvFeedback.classList.add(correct ? "feedback--correct" : "feedback--wrong");
  amvFeedback.innerHTML =
    '<div class="feedback__status">' +
    (correct ? "Correta!" : "Incorreta") +
    "</div>" +
    '<div class="feedback__text">' +
    (correct ? q.explicacaoCorrecta : q.explicacaoErrada) +
    "</div>";
  amvFeedback.hidden = false;

  if (amvCurrentPos === amvMax - 1) {
    amvBtnAnswer.textContent = "Finalizar";
  } else {
    amvBtnAnswer.textContent = "Próxima questão";
  }
}

function startAmvTraining() {
  amvShuffledOrder = shuffle(amvQuestions.map((_, i) => i));
  amvCurrentPos = 0;
  amvSelected = -1;
  amvAnswered = false;
  amvAcertos = 0;
  amvErros = 0;
  renderAmvQuestion(0);
}

cardAmv.addEventListener("click", () => {
  iniciarConteudoAmv();
});

document.getElementById("btn-back-amv").addEventListener("click", () => {
  showView("view-trainings");
});

amvBtnAnswer.addEventListener("click", () => {
  if (!amvAnswered && amvSelected === -1) return;

  if (!amvAnswered) {
    amvAnswered = true;
    confirmAmvAnswer();
    return;
  }

  if (amvCurrentPos < amvMax - 1) {
    amvCurrentPos += 1;
    renderAmvQuestion(amvCurrentPos);
} else {
    const total = amvMax;
    const percent = total > 0 ? Math.round((amvAcertos / total) * 100) : 0;

    salvarResultadoTreinamento({
      treinamento: "AMV",
      nota: total > 0 ? Math.round((amvAcertos / total) * 10 * 10) / 10 : 0,
      acertos: amvAcertos,
      erros: amvErros,
      percentual: percent,
    });

    document.getElementById("result-acertos-amv").textContent = amvAcertos;
    document.getElementById("result-erros-amv").textContent = amvErros;
    document.getElementById("result-percent-amv").textContent = percent + "%";

    showView("view-result-amv");
  }
});

document.getElementById("btn-back-amv-to-trainings").addEventListener("click", () => {
  startAmvTraining();
  showView("view-trainings");
});

/* ===== Conteúdo didático de Segurança Ferroviária (curso linear) ===== */

const SEGURANCA_SEQUENCIA_AULAS = [];
for (let n = 1; n <= 9; n++) SEGURANCA_SEQUENCIA_AULAS.push("conteudo-seguranca-aula-" + n);
SEGURANCA_SEQUENCIA_AULAS.push("conteudo-seguranca-revisao", "conteudo-seguranca-referencia");

const SEGURANCA_TOTAL_ETAPAS = SEGURANCA_SEQUENCIA_AULAS.length;

/* ===== Progresso das aulas concluídas (módulo de Segurança Ferroviária) ===== */

const SEGURANCA_AULAS_CONCLUIDAS_KEY = "railsafe_seguranca_aulas_concluidas";

let segurancaAulasConcluidas = (function () {
  try {
    const raw = localStorage.getItem(SEGURANCA_AULAS_CONCLUIDAS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
})();

function salvarAulaConcluidaSeguranca(id) {
  if (id.indexOf("conteudo-seguranca-aula-") !== 0) return;
  segurancaAulasConcluidas = new Set(segurancaAulasConcluidas);
  segurancaAulasConcluidas.add(id);
  localStorage.setItem(SEGURANCA_AULAS_CONCLUIDAS_KEY, JSON.stringify(Array.from(segurancaAulasConcluidas)));
}

function atualizarProgressoCursoSeguranca() {
  const info = document.getElementById("curso-progresso-info-seguranca");
  if (!info) return;
  let count = 0;
  for (let n = 1; n <= 9; n++) {
    if (segurancaAulasConcluidas.has("conteudo-seguranca-aula-" + n)) count++;
  }
  if (count === 0 || count === 9) {
    info.hidden = true;
    return;
  }
  info.textContent = count + " de 9 aulas concluídas";
  info.hidden = false;
}

let aulaPosSeguranca = 0;

const aulaBodySeguranca = document.getElementById("aula-body-seguranca");
const btnAulaPrevSeguranca = document.getElementById("btn-aula-prev-seguranca");
const btnAulaNextSeguranca = document.getElementById("btn-aula-next-seguranca");
const progressoBlocoSeguranca = document.getElementById("curso-progresso-seguranca");
const progressoLabelSeguranca = document.getElementById("aula-progresso-label-seguranca");
const progressoFillSeguranca = document.getElementById("aula-progresso-fill-seguranca");
const progressoBarSeguranca = document.getElementById("aula-progresso-bar-seguranca");
const conteudoTemplatesSeguranca = document.querySelector("#view-aula-seguranca .conteudo__templates");

function nomeEtapaSeguranca(id) {
  if (id.indexOf("conteudo-seguranca-aula-") === 0) {
    const n = parseInt(id.replace("conteudo-seguranca-aula-", ""), 10);
    return "Aula " + n + " de 9";
  }
  if (id === "conteudo-seguranca-revisao") return "Revisão";
  if (id === "conteudo-seguranca-referencia") return "Referência técnica";
  return "";
}

function proximoRotuloSeguranca(id) {
  if (id === "conteudo-seguranca-referencia") return "Iniciar quiz";
  if (id === "conteudo-seguranca-revisao") return "Continuar para referências →";
  if (id === "conteudo-seguranca-aula-9") return "Continuar para revisão →";
  return "Próxima aula →";
}

function abrirAulaSeguranca(id) {
  aulaPosSeguranca = SEGURANCA_SEQUENCIA_AULAS.indexOf(id);
  const naSequencia = aulaPosSeguranca !== -1;
  const conteudo = document.getElementById(id);
  while (aulaBodySeguranca.firstChild) conteudoTemplatesSeguranca.appendChild(aulaBodySeguranca.firstChild);
  if (conteudo) aulaBodySeguranca.appendChild(conteudo);

  if (naSequencia) {
    const pct = Math.round(((aulaPosSeguranca + 1) / SEGURANCA_TOTAL_ETAPAS) * 100);
    progressoBlocoSeguranca.hidden = false;
    progressoLabelSeguranca.textContent = nomeEtapaSeguranca(id);
    progressoFillSeguranca.style.width = pct + "%";
    if (progressoBarSeguranca) progressoBarSeguranca.setAttribute("aria-valuenow", String(pct));

    btnAulaPrevSeguranca.hidden = aulaPosSeguranca === 0;
    btnAulaPrevSeguranca.textContent = "← Aula anterior";
    btnAulaNextSeguranca.hidden = false;
    btnAulaNextSeguranca.textContent = proximoRotuloSeguranca(id);
  } else {
    progressoBlocoSeguranca.hidden = true;
    btnAulaPrevSeguranca.hidden = true;
    btnAulaNextSeguranca.hidden = true;
  }

  if (typeof window !== "undefined") window.scrollTo(0, 0);
  showView("view-aula-seguranca");
}

function iniciarConteudoSeguranca() {
  atualizarProgressoCursoSeguranca();
  showView("view-conteudo-seguranca");
}

document.getElementById("btn-iniciar-treinamento-seguranca").addEventListener("click", () => {
  abrirAulaSeguranca("conteudo-seguranca-aula-1");
});

document.getElementById("btn-avaliacao-seguranca").addEventListener("click", () => {
  showView("view-seguranca");
  startSegTraining();
});

document.getElementById("btn-back-conteudo-seguranca").addEventListener("click", () => {
  showView("view-trainings");
});

document.getElementById("btn-back-aula-seguranca").addEventListener("click", () => {
  atualizarProgressoCursoSeguranca();
  showView("view-conteudo-seguranca");
});

btnAulaPrevSeguranca.addEventListener("click", () => {
  if (aulaPosSeguranca > 0) abrirAulaSeguranca(SEGURANCA_SEQUENCIA_AULAS[aulaPosSeguranca - 1]);
});

btnAulaNextSeguranca.addEventListener("click", () => {
  salvarAulaConcluidaSeguranca(SEGURANCA_SEQUENCIA_AULAS[aulaPosSeguranca]);
  if (aulaPosSeguranca === SEGURANCA_SEQUENCIA_AULAS.length - 1) {
    showView("view-seguranca");
    startSegTraining();
    return;
  }
  abrirAulaSeguranca(SEGURANCA_SEQUENCIA_AULAS[aulaPosSeguranca + 1]);
});

/* ===== Treinamento de Segurança Ferroviária ===== */

const segurancaQuestions = [
  {
    id: 1,
    tema: "Aula 1 — Introdução à Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual é a relação entre segurança ferroviária e os elementos que participam da operação?",
    alternativas: [
      "A segurança depende principalmente dos equipamentos utilizados na circulação.",
      "A segurança depende da atuação isolada dos profissionais responsáveis pela operação.",
      "A segurança depende da integração entre pessoas, procedimentos, equipamentos, infraestrutura e condições de circulação.",
      "A segurança depende exclusivamente do cumprimento dos procedimentos estabelecidos.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A operação ferroviária envolve diferentes elementos que precisam atuar de forma coordenada. Pessoas, procedimentos, equipamentos, infraestrutura e condições de circulação estão relacionados entre si e devem ser considerados de maneira integrada para que a operação permaneça dentro das condições de segurança estabelecidas.",
    explicacaoErrada:
      "A segurança não depende de um único elemento isolado ou da atuação independente dos profissionais. Pessoas, procedimentos, equipamentos, infraestrutura e condições de circulação precisam atuar de forma integrada para que a operação permaneça dentro das condições de segurança.",
  },
  {
    id: 2,
    tema: "Aula 1 — Introdução à Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual é o principal objetivo da segurança ferroviária?",
    alternativas: [
      "Eliminar completamente todos os riscos existentes na operação.",
      "Reduzir a possibilidade de ocorrências que possam causar danos ou comprometer a operação.",
      "Impedir a realização de atividades que apresentem qualquer possibilidade de risco.",
      "Concentrar o controle dos riscos em uma única área responsável pela segurança.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Os riscos fazem parte do sistema ferroviário e não podem ser simplesmente considerados inexistentes. A segurança ferroviária busca reconhecer esses riscos e estabelecer controles capazes de reduzir a possibilidade de ocorrências que possam afetar pessoas, veículos, infraestrutura, meio ambiente ou a continuidade da operação.",
    explicacaoErrada:
      "Eliminar todos os riscos ou impedir qualquer atividade com possibilidade de risco não é possível na prática ferroviária. O objetivo da segurança é reconhecer os riscos e estabelecer controles que reduzam a possibilidade de ocorrências indesejadas.",
  },
  {
    id: 3,
    tema: "Aula 1 — Introdução à Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual situação pode contribuir para a ocorrência de um evento indesejado?",
    alternativas: [
      "Apenas uma falha na infraestrutura ferroviária.",
      "Apenas uma falha nos sistemas de sinalização.",
      "Uma condição inadequada da via, uma falha de equipamento, uma informação incorreta ou uma ação inadequada.",
      "Somente uma ação inadequada realizada por um profissional.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Uma ocorrência pode resultar da presença de diferentes condições ou da combinação entre elas. Por isso, a análise da segurança não deve considerar apenas um equipamento ou uma pessoa isoladamente, mas também as condições da via, as informações disponíveis e a forma como as atividades estão sendo realizadas.",
    explicacaoErrada:
      "Um evento indesejado não depende de um único fator isolado. Condições inadequadas da via, falhas de equipamento, informações incorretas ou ações inadequadas podem contribuir para uma ocorrência, muitas vezes de forma combinada.",
  },
  {
    id: 4,
    tema: "Aula 1 — Introdução à Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual é uma das etapas fundamentais da prevenção?",
    alternativas: [
      "Aguardar a ocorrência de uma situação perigosa para então definir uma medida de controle.",
      "Identificar as condições que podem comprometer a operação e estabelecer medidas de controle.",
      "Concentrar a análise somente nas consequências de ocorrências anteriores.",
      "Considerar apenas os riscos relacionados aos equipamentos utilizados.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A prevenção começa antes da ocorrência de um evento indesejado. Identificar os perigos, compreender como eles podem contribuir para uma ocorrência e estabelecer medidas de controle permite atuar antecipadamente sobre as condições que podem comprometer a segurança da operação.",
    explicacaoErrada:
      "A prevenção age antes que uma situação perigosa produza consequências. Identificar os perigos e estabelecer medidas de controle antecipadamente é o caminho para atuar sobre as condições que podem comprometer a operação, e não aguardar o evento acontecer.",
  },
  {
    id: 5,
    tema: "Aula 1 — Introdução à Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Um sistema ferroviário pode ser considerado seguro quando:",
    alternativas: [
      "Todos os riscos existentes foram eliminados.",
      "Nenhuma condição de risco é identificada durante a operação.",
      "Os riscos existentes são reconhecidos e controlados de forma adequada.",
      "Apenas os equipamentos de segurança estão funcionando corretamente.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A segurança não depende da eliminação de todos os riscos existentes. Um sistema seguro é aquele em que os riscos são reconhecidos e existem medidas adequadas para mantê-los sob controle, considerando as condições reais da operação.",
    explicacaoErrada:
      "Todo sistema ferroviário apresenta riscos que não podem ser simplesmente eliminados. Um sistema seguro é aquele em que os riscos são reconhecidos e medidas adequadas os mantêm sob controle, considerando as condições reais da operação.",
  },
  {
    id: 6,
    tema: "Aula 1 — Introdução à Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Durante uma atividade operacional, quais condições devem ser consideradas em conjunto para manter a atividade dentro das condições de segurança?",
    alternativas: [
      "Somente a informação disponível e o cumprimento dos procedimentos.",
      "O estado dos equipamentos e as condições da via, independentemente das demais condições.",
      "A informação disponível, o estado dos equipamentos, as condições da via e o cumprimento dos procedimentos.",
      "Apenas as condições observadas no início da atividade.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "As condições de uma atividade não dependem de um único fator. A informação disponível, o estado dos equipamentos, as condições da via e o cumprimento dos procedimentos precisam ser considerados em conjunto, tanto antes quanto durante a realização da atividade.",
    explicacaoErrada:
      "As condições de uma atividade não dependem de um único fator. A informação disponível, o estado dos equipamentos, as condições da via e o cumprimento dos procedimentos devem ser considerados em conjunto durante toda a atividade, não apenas no início.",
  },
  {
    id: 7,
    tema: "Aula 2 — Riscos na Operação Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Os riscos presentes em uma operação ferroviária podem variar principalmente em função:",
    alternativas: [
      "Apenas do tipo de trem utilizado na operação.",
      "Da atividade realizada, do local, das condições da via, dos equipamentos e das características da operação.",
      "Somente das condições da infraestrutura ferroviária.",
      "Apenas dos procedimentos utilizados pelos profissionais.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O risco não é necessariamente o mesmo em todas as situações. Ele pode variar conforme a atividade realizada, o local, as condições da via, os equipamentos utilizados e as características da operação. Por isso, a avaliação deve considerar o contexto em que a atividade ocorre.",
    explicacaoErrada:
      "O risco varia conforme o contexto da atividade e não depende de um único fator, como o tipo de trem ou a infraestrutura. A avaliação deve considerar a atividade, o local, as condições da via, os equipamentos e as características da operação.",
  },
  {
    id: 8,
    tema: "Aula 2 — Riscos na Operação Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Durante a realização de uma atividade, uma condição inicialmente controlada se modifica. Qual deve ser a atitude diante dessa situação?",
    alternativas: [
      "Manter a atividade sem alterações, pois os riscos já foram avaliados inicialmente.",
      "Prosseguir normalmente e avaliar a nova condição somente após o término da atividade.",
      "Observar a alteração e reavaliar as condições de segurança antes de continuar a atividade.",
      "Encerrar automaticamente qualquer atividade sempre que houver uma alteração.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Uma condição que era segura no início pode deixar de ser segura após uma mudança. Por isso, as condições devem continuar sendo observadas durante a atividade. Quando uma alteração puder interferir na segurança, ela deve ser considerada antes da continuidade do trabalho.",
    explicacaoErrada:
      "As condições de segurança devem continuar sendo observadas durante toda a atividade. Quando uma condição inicialmente controlada se modifica, é necessário reavaliar as condições antes de continuar, em vez de manter o trabalho sem considerar a alteração.",
  },
  {
    id: 9,
    tema: "Aula 2 — Riscos na Operação Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual situação pode modificar as condições de segurança de uma operação que já está em andamento?",
    alternativas: [
      "Apenas uma alteração previamente prevista no procedimento.",
      "Uma falha de equipamento, uma mudança na circulação ou uma informação que não corresponda à situação real.",
      "Somente uma alteração nas condições climáticas.",
      "Apenas uma mudança na equipe responsável pela atividade.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Uma operação pode sofrer alterações enquanto está sendo realizada. Falhas de equipamentos, mudanças na circulação ou informações que não correspondam à situação real podem modificar as condições existentes e, consequentemente, os riscos associados à atividade.",
    explicacaoErrada:
      "As condições de uma operação podem se modificar durante a sua realização por diferentes motivos. Falhas de equipamentos, mudanças na circulação ou informações que não correspondam à situação real podem alterar os riscos associados à atividade.",
  },
  {
    id: 10,
    tema: "Aula 2 — Riscos na Operação Ferroviária",
    dificuldade: "Fácil",
    pergunta: "A análise de um risco deve considerar:",
    alternativas: [
      "Apenas a possibilidade de ocorrer um evento.",
      "Somente as consequências depois que o evento acontecer.",
      "O que pode acontecer, as condições que podem contribuir para isso e as medidas que podem ser adotadas.",
      "Apenas os procedimentos existentes para a atividade.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Analisar um risco significa compreender não apenas o evento que pode ocorrer, mas também as condições que podem contribuir para sua ocorrência e as medidas disponíveis para evitá-lo ou reduzir suas consequências. Essa análise permite atuar preventivamente.",
    explicacaoErrada:
      "A análise de um risco vai além da possibilidade do evento ou das consequências após ocorrer. É necessário compreender também as condições que podem contribuir para a ocorrência e as medidas que podem ser adotadas para preveni-la.",
  },
  {
    id: 11,
    tema: "Aula 2 — Riscos na Operação Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Um procedimento estabelece uma forma segura de realizar determinada atividade. Durante sua execução, porém, surge uma condição anormal que não estava presente inicialmente. Qual situação representa melhor esse princípio de segurança?",
    alternativas: [
      "O procedimento deve ser seguido sem considerar a nova condição, pois já foi definido previamente.",
      "A condição anormal deve ser considerada, pois seguir um procedimento sem perceber uma alteração pode não ser suficiente para controlar o risco.",
      "O procedimento deve ser abandonado imediatamente, independentemente da situação encontrada.",
      "A condição deve ser ignorada caso ainda não tenha causado uma ocorrência.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Os procedimentos estabelecem formas seguras de realizar atividades, mas sua aplicação deve considerar as condições reais encontradas. Se uma condição anormal surgir, simplesmente continuar seguindo o procedimento sem reconhecer a mudança pode não ser suficiente para controlar o novo risco.",
    explicacaoErrada:
      "Os procedimentos estabelecem formas seguras de realizar atividades, mas não devem ser aplicados sem considerar as condições reais. Quando uma condição anormal surge, ela precisa ser reconhecida, pois continuar sem perceber a mudança pode não ser suficiente para controlar o risco.",
  },
  {
    id: 12,
    tema: "Aula 2 — Riscos na Operação Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Por que a identificação antecipada de uma condição de risco é importante para a prevenção?",
    alternativas: [
      "Porque permite eliminar qualquer possibilidade de ocorrência.",
      "Porque permite reconhecer o perigo, avaliar suas possíveis consequências e estabelecer um controle antes que a situação resulte em um evento indesejado.",
      "Porque permite substituir os procedimentos existentes por decisões tomadas no momento da atividade.",
      "Porque torna desnecessária a observação das condições durante a execução do trabalho.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A identificação antecipada permite agir antes que uma condição de risco produza uma consequência. Ao reconhecer o perigo, avaliar o que pode acontecer e estabelecer medidas de controle, aumenta-se a possibilidade de evitar ou reduzir os efeitos de um evento indesejado.",
    explicacaoErrada:
      "A identificação antecipada permite agir antes que a condição de risco produza consequências. Reconhecer o perigo, avaliar o que pode acontecer e estabelecer medidas de controle não elimina toda possibilidade de ocorrência, mas aumenta a chance de evitá-la ou reduzir seus efeitos.",
  },
  {
    id: 13,
    tema: "Aula 3 — Circulação e Movimentação de Trens",
    dificuldade: "Fácil",
    pergunta: "Para que um movimento ferroviário seja realizado com segurança, é necessário conhecer:",
    alternativas: [
      "Apenas a velocidade prevista para o deslocamento.",
      "As condições da via, a situação da circulação e as condições estabelecidas para o movimento.",
      "Somente a posição dos aparelhos de mudança de via.",
      "Apenas as condições do veículo que realizará o movimento.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Um movimento ferroviário precisa estar relacionado às condições reais da operação. Conhecer a situação da via, da circulação e as condições estabelecidas para o deslocamento permite que o movimento seja realizado de forma compatível com o que foi definido para aquela operação.",
    explicacaoErrada:
      "Um movimento seguro não depende apenas da velocidade prevista ou do veículo. É necessário conhecer as condições da via, a situação da circulação e as condições estabelecidas para que o deslocamento seja compatível com o que foi definido para a operação.",
  },
  {
    id: 14,
    tema: "Aula 3 — Circulação e Movimentação de Trens",
    dificuldade: "Fácil",
    pergunta: "Antes de realizar um movimento ferroviário, quais informações podem ser necessárias para determinar por onde e em quais condições o veículo poderá circular?",
    alternativas: [
      "Apenas a condição do veículo e a velocidade máxima permitida.",
      "A condição da via, a posição dos aparelhos de mudança de via, a sinalização e outras condições estabelecidas para o movimento.",
      "Somente a posição dos aparelhos de mudança de via e a condição dos equipamentos.",
      "Apenas as informações relacionadas ao destino do veículo.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A circulação depende de diferentes condições que precisam ser conhecidas antes do movimento. A situação da via, a posição dos aparelhos de mudança de via, a sinalização e outras condições estabelecidas ajudam a determinar por onde e em quais condições o veículo poderá se deslocar.",
    explicacaoErrada:
      "Antes do movimento é necessário conhecer mais do que o veículo e a velocidade. A condição da via, a posição dos aparelhos de mudança de via, a sinalização e outras condições estabelecidas ajudam a definir por onde e em quais condições o veículo poderá circular.",
  },
  {
    id: 15,
    tema: "Aula 3 — Circulação e Movimentação de Trens",
    dificuldade: "Fácil",
    pergunta: "Uma autorização ou condição estabelecida para um movimento deve:",
    alternativas: [
      "Ser mantida mesmo quando a situação real da operação se modificar.",
      "Corresponder à situação real da operação.",
      "Considerar somente a intenção do profissional que realizará o movimento.",
      "Ser definida apenas depois que o movimento tiver sido iniciado.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Uma autorização ou condição de movimento precisa representar a situação real da operação. Informações incorretas ou desatualizadas podem levar a um deslocamento incompatível com as condições da via ou da circulação e, consequentemente, comprometer a segurança.",
    explicacaoErrada:
      "Uma autorização ou condição de movimento não pode se basear apenas na intenção do profissional nem permanecer inalterada diante de mudanças. Ela precisa representar a situação real da operação para evitar um deslocamento incompatível com a via ou a circulação.",
  },
  {
    id: 16,
    tema: "Aula 3 — Circulação e Movimentação de Trens",
    dificuldade: "Fácil",
    pergunta: "Durante a circulação, qual deve ser a conduta diante de uma condição determinada pela sinalização que não permita a continuidade do movimento?",
    alternativas: [
      "Continuar o movimento até que outra informação seja recebida.",
      "Prosseguir se a via aparentar estar livre.",
      "Respeitar a condição indicada pela sinalização.",
      "Considerar somente a velocidade permitida para o trecho.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A sinalização constitui um elemento fundamental para o controle dos movimentos ferroviários. Quando sua indicação estabelece uma condição que não permite a continuidade do movimento, essa condição deve ser respeitada, independentemente de a via aparentar estar livre.",
    explicacaoErrada:
      "A sinalização é um elemento fundamental para o controle dos movimentos ferroviários. Quando ela não permite a continuidade do movimento, essa condição deve ser respeitada, ainda que a via aparente estar livre.",
  },
  {
    id: 17,
    tema: "Aula 3 — Circulação e Movimentação de Trens",
    dificuldade: "Fácil",
    pergunta: "Os limites de velocidade durante a circulação podem estar relacionados:",
    alternativas: [
      "Apenas às características do veículo ferroviário.",
      "Às características da via, às condições operacionais, à sinalização ou a outras restrições estabelecidas.",
      "Somente às condições da sinalização.",
      "Exclusivamente à decisão do profissional responsável pelo movimento.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A velocidade segura não depende exclusivamente do veículo. Ela também pode estar relacionada às características da via, às condições operacionais, à sinalização e a outras restrições estabelecidas para determinado trecho ou situação.",
    explicacaoErrada:
      "A velocidade segura não depende apenas do veículo. Ela pode estar relacionada às características da via, às condições operacionais, à sinalização e a outras restrições estabelecidas para o trecho ou situação.",
  },
  {
    id: 18,
    tema: "Aula 3 — Circulação e Movimentação de Trens",
    dificuldade: "Fácil",
    pergunta: "Durante uma movimentação ferroviária, ocorre uma alteração relevante nas condições inicialmente estabelecidas. O que deve ser considerado antes da continuidade do movimento?",
    alternativas: [
      "A alteração pode ser ignorada se o movimento já tiver sido iniciado.",
      "Somente a velocidade do veículo precisa ser ajustada.",
      "A nova condição deve ser considerada, podendo ser necessária a interrupção ou adequação do movimento conforme os procedimentos aplicáveis.",
      "A continuidade deve ocorrer normalmente, desde que a via esteja aparentemente livre.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O início de um movimento não significa que suas condições permanecerão inalteradas. Uma mudança na via, na sinalização ou em outras condições operacionais pode tornar o movimento incompatível com a situação atual. Nesses casos, a nova condição precisa ser considerada antes da continuidade.",
    explicacaoErrada:
      "As condições de um movimento podem se alterar depois do seu início. Uma mudança na via, na sinalização ou em outras condições operacionais deve ser considerada antes da continuidade, podendo ser necessária a interrupção ou adequação do movimento conforme os procedimentos.",
  },
  {
    id: 19,
    tema: "Aula 4 — Segurança nas Áreas Operacionais",
    dificuldade: "Fácil",
    pergunta: "Antes de acessar ou permanecer em uma área operacional ferroviária, é necessário:",
    alternativas: [
      "Estar autorizado para acessar o local, conhecer os riscos existentes e observar as condições estabelecidas para a atividade.",
      "Verificar somente se há algum trem parado nas proximidades.",
      "Confirmar apenas se os equipamentos utilizados na atividade estão disponíveis.",
      "Aguardar o início da atividade para identificar os riscos existentes.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O acesso a uma área operacional deve estar relacionado à atividade que será realizada e às condições estabelecidas para sua execução. Por isso, além de estar autorizado a acessar o local, é necessário conhecer os riscos existentes e identificar as condições que precisam ser observadas durante a atividade. A segurança não depende apenas da autorização de acesso, mas também da compreensão dos riscos e das condições do ambiente.",
    explicacaoErrada:
      "A segurança no acesso a uma área operacional não depende apenas de verificar a presença de trens ou a disponibilidade de equipamentos. É necessário estar autorizado, conhecer os riscos existentes e observar as condições estabelecidas para a atividade.",
  },
  {
    id: 20,
    tema: "Aula 4 — Segurança nas Áreas Operacionais",
    dificuldade: "Fácil",
    pergunta: "Por que a via permanente deve ser tratada como uma área de risco?",
    alternativas: [
      "Porque qualquer atividade realizada próxima à via é proibida.",
      "Porque a aproximação de um trem pode ocorrer em diferentes condições de velocidade e nem sempre será percebida com antecedência suficiente para permitir uma reação segura.",
      "Porque os trens circulam sempre em alta velocidade.",
      "Porque somente profissionais autorizados podem observar a circulação ferroviária.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A via permanente é destinada à circulação ferroviária e, por isso, a presença de pessoas nesse ambiente exige atenção permanente às condições de circulação. Um trem pode se aproximar em diferentes condições de velocidade e sua aproximação nem sempre será percebida com antecedência suficiente para permitir uma reação segura. Dessa forma, a percepção do risco deve ser mantida durante toda a atividade.",
    explicacaoErrada:
      "O risco da via permanente não decorre de os trens circularem sempre em alta velocidade ou de qualquer atividade próxima ser proibida. Um trem pode se aproximar em diferentes condições de velocidade, e sua aproximação nem sempre será percebida a tempo de permitir uma reação segura.",
  },
  {
    id: 21,
    tema: "Aula 4 — Segurança nas Áreas Operacionais",
    dificuldade: "Fácil",
    pergunta: "Em plataformas e áreas de embarque e desembarque, qual condição é importante para a segurança?",
    alternativas: [
      "A separação adequada entre a circulação dos passageiros e a movimentação ferroviária.",
      "A permanência dos passageiros próximos à via durante a aproximação do trem.",
      "A realização do embarque antes da chegada do trem à plataforma.",
      "A circulação de passageiros independentemente das condições da operação.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Plataformas são locais onde ocorre a interação entre passageiros e a movimentação ferroviária. A segurança depende da adequada separação entre esses fluxos e do respeito às condições estabelecidas para a aproximação do trem, abertura e fechamento das portas e embarque ou desembarque.",
    explicacaoErrada:
      "Em plataformas ocorre a interação entre passageiros e a movimentação ferroviária. A segurança depende da adequada separação entre esses fluxos e do respeito às condições estabelecidas para aproximação do trem, abertura e fechamento das portas e embarque ou desembarque.",
  },
  {
    id: 22,
    tema: "Aula 4 — Segurança nas Áreas Operacionais",
    dificuldade: "Fácil",
    pergunta: "Durante o embarque ou desembarque de passageiros, qual situação deve ser considerada para manter a segurança?",
    alternativas: [
      "Apenas a presença do trem na plataforma.",
      "A aproximação do trem, a abertura e o fechamento das portas e as condições estabelecidas para o embarque ou desembarque.",
      "Somente o tempo disponível para o embarque.",
      "Apenas a quantidade de passageiros presentes na plataforma.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O embarque e o desembarque envolvem passageiros e movimentação ferroviária. Por isso, a segurança não depende apenas da presença do trem na plataforma. É necessário considerar as condições de sua aproximação, a abertura e o fechamento das portas e as condições estabelecidas para a realização dessas atividades.",
    explicacaoErrada:
      "A segurança no embarque e desembarque não depende apenas da presença do trem ou do tempo disponível. É necessário considerar a aproximação do trem, a abertura e o fechamento das portas e as condições estabelecidas para essas atividades.",
  },
  {
    id: 23,
    tema: "Aula 4 — Segurança nas Áreas Operacionais",
    dificuldade: "Fácil",
    pergunta: "Em oficinas e áreas destinadas à manutenção, antes de iniciar uma intervenção em um equipamento, devem ser consideradas:",
    alternativas: [
      "Somente as condições atuais do equipamento.",
      "As condições do equipamento, os possíveis movimentos e as medidas necessárias para impedir que uma movimentação inesperada coloque pessoas em risco.",
      "Apenas as ferramentas necessárias para realizar o serviço.",
      "Somente a duração prevista para a intervenção.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Uma intervenção de manutenção pode envolver riscos relacionados ao próprio equipamento e a possíveis movimentos durante a atividade. Por isso, antes de iniciar o trabalho, é necessário considerar essas condições e adotar as medidas necessárias para impedir que uma movimentação inesperada coloque pessoas em risco.",
    explicacaoErrada:
      "Uma intervenção de manutenção pode envolver riscos além das condições atuais do equipamento ou das ferramentas. É necessário considerar os possíveis movimentos e adotar medidas para impedir que uma movimentação inesperada coloque pessoas em risco.",
  },
  {
    id: 24,
    tema: "Aula 4 — Segurança nas Áreas Operacionais",
    dificuldade: "Fácil",
    pergunta: "Uma atividade em uma área operacional envolve duas equipes diferentes. Para que a atividade seja realizada com segurança, é importante que:",
    alternativas: [
      "Cada equipe tenha conhecimento somente da parte da atividade sob sua responsabilidade.",
      "Apenas o responsável pela atividade conheça as condições do local.",
      "Todos os envolvidos tenham entendimento compatível sobre o que será realizado e sobre as condições necessárias para a execução.",
      "A comunicação entre as equipes ocorra somente depois que a atividade for concluída.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Quando uma atividade envolve mais de uma pessoa ou equipe, informações diferentes ou incompletas podem gerar interpretações incompatíveis. Por isso, todos os envolvidos precisam possuir entendimento compatível sobre o que será realizado e sobre as condições necessárias para executar suas responsabilidades com segurança.",
    explicacaoErrada:
      "Quando uma atividade envolve mais de uma equipe, o conhecimento parcial ou a comunicação apenas após a conclusão podem gerar interpretações incompatíveis. Todos os envolvidos precisam ter entendimento compatível sobre o que será realizado e sobre as condições para a execução.",
  },
  {
    id: 25,
    tema: "Aula 5 — Passagens em Nível",
    dificuldade: "Fácil",
    pergunta: "O que caracteriza uma passagem em nível?",
    alternativas: [
      "O local onde duas linhas ferroviárias se cruzam em níveis diferentes.",
      "O local onde a via ferroviária e uma rota rodoviária ou de pedestres se cruzam no mesmo nível.",
      "O local destinado exclusivamente à circulação de veículos ferroviários.",
      "O local onde ocorre a mudança de uma via ferroviária para outra.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A passagem em nível é o ponto de cruzamento, no mesmo nível, entre a via ferroviária e uma rota utilizada por veículos ou pedestres. Essa característica faz com que diferentes formas de circulação compartilhem uma mesma área de conflito.",
    explicacaoErrada:
      "A passagem em nível não é um cruzamento entre linhas ferroviárias nem um local exclusivo para trens. Ela é o ponto onde a via ferroviária e uma rota rodoviária ou de pedestres se cruzam no mesmo nível, formando uma área de conflito.",
  },
  {
    id: 26,
    tema: "Aula 5 — Passagens em Nível",
    dificuldade: "Fácil",
    pergunta: "Quais fatores podem influenciar a segurança em uma passagem em nível?",
    alternativas: [
      "Apenas a presença de sinalização ferroviária.",
      "Somente o comportamento dos usuários da passagem.",
      "As características do local, a visibilidade, a sinalização, os equipamentos de proteção e o comportamento dos usuários.",
      "Exclusivamente as condições da via ferroviária.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A segurança em uma passagem em nível resulta da combinação de diferentes fatores. As características do local, a visibilidade, a sinalização, os sistemas de proteção e o comportamento dos usuários podem interferir na possibilidade de identificar e evitar uma situação de conflito.",
    explicacaoErrada:
      "A segurança em uma passagem em nível não depende de um único fator, como apenas a sinalização ou o comportamento dos usuários. Ela resulta da combinação das características do local, da visibilidade, da sinalização, dos equipamentos de proteção e do comportamento dos usuários.",
  },
  {
    id: 27,
    tema: "Aula 5 — Passagens em Nível",
    dificuldade: "Fácil",
    pergunta: "Qual é a diferença entre sinalização passiva e sinalização ativa em uma passagem em nível?",
    alternativas: [
      "A sinalização passiva depende da aproximação de um trem, enquanto a ativa permanece sempre igual.",
      "A sinalização passiva fornece informações permanentes, enquanto a ativa pode variar conforme a situação da circulação.",
      "A sinalização passiva é utilizada somente para veículos ferroviários, enquanto a ativa é exclusiva para pedestres.",
      "Não existe diferença entre os dois tipos de sinalização.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A sinalização passiva fornece uma informação permanente aos usuários. Já a sinalização ativa pode apresentar mudanças conforme a situação, podendo indicar a aproximação de um trem por meio de recursos como luzes, sons e barreiras, conforme o sistema existente.",
    explicacaoErrada:
      "A sinalização passiva fornece uma informação permanente aos usuários, enquanto a ativa pode variar conforme a circulação, indicando a aproximação de um trem por meio de luzes, sons ou barreiras. Não se trata de sinalização para públicos distintos, e a diferença entre os dois tipos existe.",
  },
  {
    id: 28,
    tema: "Aula 5 — Passagens em Nível",
    dificuldade: "Fácil",
    pergunta: "Por que a visibilidade é um fator importante em uma passagem em nível?",
    alternativas: [
      "Porque permite que o usuário identifique a aproximação de um trem com tempo suficiente para tomar uma decisão segura.",
      "Porque elimina a necessidade de sinalização no local.",
      "Porque impede que os trens circulem enquanto houver usuários na passagem.",
      "Porque substitui os equipamentos de proteção existentes.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A visibilidade contribui para que o usuário perceba a aproximação de um trem e tenha tempo suficiente para avaliar a situação. Por isso, obstáculos e características do entorno são fatores importantes quando se considera a segurança de uma passagem em nível.",
    explicacaoErrada:
      "A visibilidade contribui para que o usuário perceba a aproximação do trem e avalie a situação com antecedência. Ela não elimina a necessidade de sinalização nem substitui os equipamentos de proteção existentes na passagem.",
  },
  {
    id: 29,
    tema: "Aula 5 — Passagens em Nível",
    dificuldade: "Fácil",
    pergunta: "Qual conduta é recomendada antes de atravessar uma passagem em nível?",
    alternativas: [
      "Atravessar rapidamente para reduzir o tempo de permanência no local.",
      "Pare, olhe e escute, respeitando a sinalização e verificando se existe aproximação de trem.",
      "Atravessar sempre que não houver uma barreira fechada.",
      "Observar somente a direção de onde normalmente circulam os trens.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Antes de atravessar, o usuário deve parar, observar e escutar, além de respeitar a sinalização existente e verificar a presença de trem. Se houver uma situação que torne a travessia insegura, deve-se aguardar.",
    explicacaoErrada:
      "Atravessar rapidamente ou apenas com base na ausência de barreira fechada não garante segurança. Antes de atravessar, o usuário deve parar, olhar e escutar, respeitando a sinalização e verificando se existe aproximação de trem.",
  },
  {
    id: 30,
    tema: "Aula 5 — Passagens em Nível",
    dificuldade: "Fácil",
    pergunta: "Por que um trem exige atenção especial ao se aproximar de uma passagem em nível?",
    alternativas: [
      "Porque o trem possui características de massa e distância de frenagem que diferem das de um veículo rodoviário.",
      "Porque o trem pode interromper sua circulação imediatamente diante de qualquer obstáculo.",
      "Porque o trem possui prioridade apenas quando a passagem está sem sinalização.",
      "Porque a velocidade do trem é sempre superior à dos veículos rodoviários.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O trem possui características próprias de massa e frenagem. Por isso, uma decisão de atravessar a passagem em nível deve ser tomada antes de entrar na zona de conflito, considerando a aproximação do trem e as condições de segurança existentes.",
    explicacaoErrada:
      "O trem não consegue interromper a circulação imediatamente nem tem sua prioridade condicionada à sinalização. Suas características de massa e de distância de frenagem diferem das de um veículo rodoviário, e por isso a decisão de atravessar deve ocorrer antes de entrar na zona de conflito.",
  },
  {
    id: 31,
    tema: "Aula 6 — Comunicação e Segurança Operacional",
    dificuldade: "Fácil",
    pergunta: "Por que a comunicação é considerada um elemento importante para a segurança operacional?",
    alternativas: [
      "Porque substitui a necessidade de procedimentos durante as atividades.",
      "Porque as decisões e ações podem depender das informações que são transmitidas entre os profissionais.",
      "Porque permite que apenas uma pessoa concentre todas as informações da operação.",
      "Porque elimina a necessidade de verificar as condições reais da operação.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "As atividades ferroviárias dependem da troca de informações entre diferentes profissionais. Quando uma informação é transmitida corretamente, ela pode orientar decisões e ações de forma compatível com as condições existentes.",
    explicacaoErrada:
      "A comunicação não substitui os procedimentos nem elimina a necessidade de verificar as condições reais. As atividades dependem da troca de informações, e as decisões e ações podem ser orientadas corretamente quando essas informações são transmitidas de forma adequada.",
  },
  {
    id: 32,
    tema: "Aula 6 — Comunicação e Segurança Operacional",
    dificuldade: "Fácil",
    pergunta: "O que pode acontecer quando uma informação operacional é transmitida de forma incorreta, incompleta ou interpretada de maneira diferente?",
    alternativas: [
      "A atividade permanece necessariamente dentro das mesmas condições de segurança.",
      "A informação deixa de ter qualquer relação com a atividade realizada.",
      "As condições da atividade podem ser alteradas e contribuir para uma ocorrência.",
      "Apenas a comunicação entre os profissionais é afetada, sem consequência para a atividade.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Uma informação incorreta, incompleta ou mal interpretada pode fazer com que uma pessoa tome uma decisão diferente daquela esperada. Isso pode alterar a forma como a atividade é realizada e contribuir para uma ocorrência.",
    explicacaoErrada:
      "Uma informação incorreta, incompleta ou mal interpretada pode levar a uma decisão diferente da esperada e alterar a forma como a atividade é realizada. Isso pode contribuir para uma ocorrência, em vez de manter as condições de segurança.",
  },
  {
    id: 33,
    tema: "Aula 6 — Comunicação e Segurança Operacional",
    dificuldade: "Fácil",
    pergunta: "Ao transmitir uma informação relacionada à segurança operacional, o profissional deve considerar:",
    alternativas: [
      "Somente a quantidade de informações que possui.",
      "O que precisa ser informado, para quem a informação deve ser transmitida e qual entendimento ou ação deve resultar dela.",
      "Apenas a pessoa que iniciou a atividade.",
      "Somente a forma mais rápida de transmitir a informação.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Uma comunicação segura não depende apenas de transmitir uma mensagem. É necessário considerar o conteúdo da informação, quem precisa recebê-la e qual entendimento ou ação deve resultar dessa comunicação.",
    explicacaoErrada:
      "Uma comunicação segura não depende apenas da quantidade de informações ou da velocidade da transmissão. É necessário considerar o conteúdo, quem precisa receber a informação e qual entendimento ou ação deve resultar dela.",
  },
  {
    id: 34,
    tema: "Aula 6 — Comunicação e Segurança Operacional",
    dificuldade: "Fácil",
    pergunta: "Qual é a finalidade da repetição ou confirmação de uma informação relacionada à segurança?",
    alternativas: [
      "Aumentar a quantidade de comunicações realizadas durante a atividade.",
      "Confirmar que a informação foi compreendida e reduzir a possibilidade de interpretações diferentes.",
      "Substituir os registros necessários da atividade.",
      "Permitir que somente o emissor determine como a informação deve ser interpretada.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A confirmação permite verificar se a informação transmitida foi compreendida corretamente. Isso reduz a possibilidade de que emissor e receptor tenham entendimentos diferentes sobre uma condição ou ação relacionada à atividade.",
    explicacaoErrada:
      "A confirmação não tem por finalidade aumentar comunicações, substituir registros ou favorecer o emissor. Ela verifica se a informação foi compreendida corretamente e reduz a possibilidade de interpretações diferentes.",
  },
  {
    id: 35,
    tema: "Aula 6 — Comunicação e Segurança Operacional",
    dificuldade: "Fácil",
    pergunta: "Por que a identificação correta de pessoas, locais, trens, veículos, equipamentos e condições é importante na comunicação operacional?",
    alternativas: [
      "Porque torna as mensagens mais longas e detalhadas.",
      "Porque permite relacionar corretamente a informação à situação ou ao elemento a que ela se refere.",
      "Porque elimina a necessidade de confirmar informações recebidas.",
      "Porque permite que informações diferentes sejam transmitidas ao mesmo tempo.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A identificação correta evita que uma informação seja associada ao elemento ou situação errada. Em atividades operacionais, essa correspondência é importante para que as pessoas envolvidas compreendam exatamente a que situação a comunicação se refere.",
    explicacaoErrada:
      "A identificação correta não torna as mensagens mais longas, não elimina a confirmação das informações nem se destina à transmissão simultânea. Ela evita que a informação seja associada ao elemento ou situação errada.",
  },
  {
    id: 36,
    tema: "Aula 6 — Comunicação e Segurança Operacional",
    dificuldade: "Fácil",
    pergunta: "Uma condição operacional se modifica durante uma atividade. O que deve ocorrer com a comunicação?",
    alternativas: [
      "A nova condição deve ser comunicada antes que uma ação seja tomada com base na informação anterior.",
      "A comunicação deve ocorrer somente depois que a atividade terminar.",
      "A informação anterior deve continuar sendo utilizada até que ocorra uma consequência.",
      "A mudança só precisa ser comunicada se houver interrupção da atividade.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Quando uma condição muda, a informação anterior pode deixar de representar a situação real. Por isso, a nova condição deve ser comunicada antes que alguém tome uma ação baseada em uma informação que já não corresponde à realidade.",
    explicacaoErrada:
      "Quando uma condição muda, a informação anterior pode deixar de representar a situação real. A nova condição deve ser comunicada antes que alguém aja com base em informação que já não corresponde à realidade, e não apenas após o término da atividade.",
  },
  {
    id: 37,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "O que caracteriza uma ocorrência no contexto da segurança operacional?",
    alternativas: [
      "Somente eventos que resultam em danos materiais.",
      "Qualquer situação relacionada exclusivamente à circulação de trens.",
      "Um evento operacional que interrompe, altera ou compromete uma atividade e que requer registro, avaliação ou tratamento conforme sua natureza.",
      "Apenas eventos classificados formalmente como acidentes.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O termo ocorrência possui um sentido amplo e pode envolver diferentes tipos de eventos operacionais. Esses eventos podem afetar a circulação ou o trabalho e precisam ser registrados, avaliados e tratados de acordo com suas características.",
    explicacaoErrada:
      "O termo ocorrência possui sentido amplo e não se limita a danos materiais, à circulação de trens ou a acidentes formalmente classificados. Ela envolve eventos que interrompem, alteram ou comprometem uma atividade e requerem registro, avaliação ou tratamento.",
  },
  {
    id: 38,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Qual é uma característica que diferencia um acidente de um incidente?",
    alternativas: [
      "O acidente é sempre causado por falha de equipamento, enquanto o incidente é causado por falha humana.",
      "O acidente possui consequências que caracterizam essa classificação segundo os critérios aplicáveis, enquanto um incidente pode ocorrer sem produzir essas consequências.",
      "O incidente sempre provoca danos, enquanto o acidente pode não provocar consequências.",
      "Não existe diferença entre acidente e incidente.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A classificação não deve ser feita apenas pela percepção sobre o evento. O acidente é caracterizado pelas consequências e pelos critérios aplicáveis. Já um incidente pode estar relacionado à segurança operacional sem necessariamente produzir as consequências que caracterizam um acidente.",
    explicacaoErrada:
      "A diferença entre acidente e incidente não está na causa (equipamento ou humano) nem no fato de o incidente sempre provocar danos. O acidente é caracterizado pelas consequências e pelos critérios aplicáveis, enquanto um incidente pode ocorrer sem produzir essas consequências.",
  },
  {
    id: 39,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Uma situação ocorreu sem produzir consequências de acidente, mas revelou uma condição inadequada de segurança. Por que essa situação deve ser analisada?",
    alternativas: [
      "Porque a ausência de consequências significa que o evento não possui importância operacional.",
      "Porque situações sem consequências podem revelar falhas, condições inadequadas ou falhas de barreiras que precisam ser compreendidas.",
      "Porque todo evento sem consequências deve obrigatoriamente ser classificado como acidente.",
      "Porque somente eventos sem consequências permitem identificar responsáveis.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A ausência de uma consequência não significa ausência de risco. Uma situação que quase resultou em um evento mais grave pode revelar uma falha ou uma condição inadequada e, por isso, fornecer informações importantes para a prevenção.",
    explicacaoErrada:
      "A ausência de consequências não significa que o evento não tenha importância. Situações sem consequências podem revelar falhas, condições inadequadas ou falhas de barreiras que precisam ser compreendidas para a prevenção.",
  },
  {
    id: 40,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Após uma ocorrência, uma análise adequada deve buscar:",
    alternativas: [
      "Identificar somente a ação que ocorreu imediatamente antes do evento.",
      "Encontrar necessariamente uma única pessoa responsável pela ocorrência.",
      "Compreender o que aconteceu e identificar as condições que contribuíram para o evento.",
      "Encerrar a análise assim que a situação operacional voltar ao normal.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A análise deve buscar compreender o evento de forma ampla, considerando a operação, os procedimentos, os equipamentos, as informações disponíveis e outros fatores que possam ter contribuído. A finalidade é compreender o ocorrido e identificar oportunidades de prevenção.",
    explicacaoErrada:
      "A análise de uma ocorrência não se limita à ação imediatamente anterior ao evento nem à busca de uma única pessoa responsável. Ela deve compreender o que aconteceu e identificar as condições que contribuíram para o evento, visando à prevenção.",
  },
  {
    id: 41,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Qual é a diferença entre analisar as causas de uma ocorrência e simplesmente procurar um responsável?",
    alternativas: [
      "Não existe diferença, pois toda análise deve identificar uma pessoa responsável.",
      "A análise busca compreender os fatores que contribuíram para o evento, que podem envolver uma combinação de condições, e não apenas apontar uma pessoa.",
      "A análise deve considerar somente as ações realizadas pelos profissionais.",
      "A busca por responsáveis substitui a necessidade de avaliar procedimentos e equipamentos.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Uma ocorrência pode resultar da combinação de diferentes fatores. Por isso, compreender suas causas exige analisar as condições da operação, os procedimentos, os equipamentos, as informações e outros elementos envolvidos, em vez de limitar a análise à identificação de uma pessoa.",
    explicacaoErrada:
      "A análise de causas não se limita a apontar uma pessoa. Uma ocorrência pode resultar de uma combinação de fatores, e compreendê-la exige avaliar procedimentos, equipamentos, informações e condições da operação, em vez de apenas procurar um responsável.",
  },
  {
    id: 42,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Por que os registros de ocorrências são importantes para a segurança operacional?",
    alternativas: [
      "Porque servem apenas para documentar que uma ocorrência aconteceu.",
      "Porque permitem identificar situações repetidas, tendências e avaliar a eficácia das medidas adotadas.",
      "Porque substituem a necessidade de analisar cada ocorrência.",
      "Porque são utilizados somente quando existem consequências materiais.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Os registros permitem reunir informações sobre diferentes ocorrências ao longo do tempo. A análise desses dados pode revelar situações que se repetem, tendências e informações úteis para verificar se as medidas adotadas estão contribuindo para o controle dos riscos.",
    explicacaoErrada:
      "Os registros não servem apenas para documentar eventos nem substituem a análise de cada ocorrência. Eles permitem identificar situações repetidas, tendências e avaliar se as medidas adotadas estão contribuindo para o controle dos riscos.",
  },
  {
    id: 43,
    tema: "Aula 7 — Acidentes, Incidentes e Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Qual é uma finalidade da análise de uma ocorrência para a segurança operacional?",
    alternativas: [
      "Encerrar definitivamente qualquer possibilidade de ocorrência semelhante.",
      "Transformar as informações obtidas com o evento em oportunidades de prevenção e melhoria dos controles.",
      "Determinar que toda ocorrência resulta de uma única causa.",
      "Substituir os procedimentos existentes por decisões tomadas após cada ocorrência.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A análise de uma ocorrência deve produzir conhecimento que possa ser utilizado para prevenir novos eventos. As informações obtidas podem contribuir para melhorar procedimentos, controles, equipamentos e outras condições relacionadas à segurança.",
    explicacaoErrada:
      "A análise não encerra qualquer possibilidade de ocorrência semelhante nem determina uma causa única. Ela transforma as informações do evento em oportunidades de prevenção e melhoria dos controles existentes.",
  },
  {
    id: 44,
    tema: "Aula 8 — Emergências e Resposta a Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Em uma situação de emergência, qual deve ser a primeira preocupação?",
    alternativas: [
      "Restabelecer imediatamente a circulação ferroviária.",
      "Preservar informações para o registro da ocorrência.",
      "Proteger a vida e a integridade das pessoas, reconhecendo os riscos existentes e evitando novas situações de perigo.",
      "Retirar todos os equipamentos envolvidos antes de avaliar a situação.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Em uma emergência, a proteção das pessoas é a prioridade inicial. Para isso, é necessário reconhecer os perigos presentes e evitar que as ações de resposta criem novos riscos ou agravem a situação existente.",
    explicacaoErrada:
      "Em uma emergência, a prioridade inicial é a proteção da vida e da integridade das pessoas, e não restabelecer a circulação, preservar informações ou retirar equipamentos. É necessário reconhecer os riscos e evitar que as ações de resposta criem novos perigos.",
  },
  {
    id: 45,
    tema: "Aula 8 — Emergências e Resposta a Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Na avaliação inicial de uma emergência, quais informações são fundamentais para orientar a resposta?",
    alternativas: [
      "Apenas o tipo de equipamento envolvido.",
      "O que aconteceu, onde aconteceu, quais são os riscos e quais medidas imediatas são necessárias.",
      "Somente a quantidade de pessoas presentes no local.",
      "Apenas as condições da circulação ferroviária.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A identificação do que aconteceu, do local, dos riscos presentes e das medidas imediatas necessárias permite compreender a situação e orientar a resposta. Essas informações também ajudam a definir os recursos necessários para o atendimento.",
    explicacaoErrada:
      "A avaliação inicial não se limita ao tipo de equipamento, à quantidade de pessoas ou às condições da circulação. É fundamental identificar o que aconteceu, onde aconteceu, os riscos presentes e as medidas imediatas necessárias para orientar a resposta.",
  },
  {
    id: 46,
    tema: "Aula 8 — Emergências e Resposta a Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Ao estabelecer uma área segura durante uma emergência, qual situação deve ser considerada?",
    alternativas: [
      "Somente a possibilidade de movimentação de trens.",
      "Apenas a existência de pessoas próximas ao local.",
      "Os diferentes riscos presentes, como movimentação ferroviária, energia elétrica, materiais perigosos, incêndio ou estruturas danificadas.",
      "Exclusivamente os danos já observados no equipamento envolvido.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Uma emergência pode apresentar diferentes fontes de perigo ao mesmo tempo. Por isso, a definição de uma área segura deve considerar os riscos existentes e controlar o acesso ao local para evitar que outras pessoas sejam expostas a essas condições.",
    explicacaoErrada:
      "Uma emergência pode apresentar diferentes fontes de perigo ao mesmo tempo, e a definição da área segura não se limita à movimentação de trens, à presença de pessoas ou aos danos já observados. Todos os riscos presentes devem ser considerados e o acesso ao local, controlado.",
  },
  {
    id: 47,
    tema: "Aula 8 — Emergências e Resposta a Ocorrências",
    dificuldade: "Fácil",
    pergunta: "Durante uma emergência ferroviária, o fato de não haver um trem visível no local significa que a via está segura para circulação de pessoas?",
    alternativas: [
      "Sim, porque a ausência de um trem garante que não existe risco ferroviário.",
      "Sim, desde que a área esteja visualmente livre.",
      "Não. A segurança da via deve ser estabelecida conforme os procedimentos aplicáveis, não apenas pela ausência momentânea de um trem visível.",
      "Não, porque nenhuma pessoa pode permanecer próxima a uma via ferroviária em qualquer situação.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A ausência momentânea de um trem visível não é suficiente para considerar uma via segura. Em uma emergência, a circulação e as condições da via devem ser tratadas conforme os procedimentos aplicáveis e os riscos existentes.",
    explicacaoErrada:
      "A ausência momentânea de um trem visível não garante que a via esteja segura. A segurança da via deve ser estabelecida conforme os procedimentos aplicáveis e os riscos existentes, embora não seja correto afirmar que nenhuma pessoa possa permanecer próxima à via em qualquer situação.",
  },
  {
    id: 48,
    tema: "Aula 9 — Prevenção e Cultura de Segurança",
    dificuldade: "Fácil",
    pergunta: "O que caracteriza uma ação preventiva na segurança ferroviária?",
    alternativas: [
      "Atuar somente depois que uma ocorrência produzir consequências.",
      "Atuar sobre condições que podem contribuir para uma ocorrência antes que suas consequências aconteçam.",
      "Concentrar as ações apenas na correção de equipamentos danificados.",
      "Evitar qualquer atividade que apresente algum risco.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A prevenção procura agir antes que uma condição de risco produza uma ocorrência ou suas consequências. Isso envolve reconhecer perigos, compreender os riscos e utilizar medidas de controle adequadas.",
    explicacaoErrada:
      "A ação preventiva ocorre antes que uma condição de risco produza consequências, e não somente depois da ocorrência ou apenas na correção de equipamentos. Ela envolve reconhecer perigos, compreender os riscos e utilizar medidas de controle adequadas.",
  },
  {
    id: 49,
    tema: "Aula 9 — Prevenção e Cultura de Segurança",
    dificuldade: "Fácil",
    pergunta: "Uma pessoa identifica uma condição que não compreende completamente e tem dúvida sobre a segurança para continuar uma atividade. Qual conduta está mais alinhada à prevenção?",
    alternativas: [
      "Continuar a atividade e avaliar a situação somente depois.",
      "Ignorar a dúvida enquanto nenhuma ocorrência tiver acontecido.",
      "Esclarecer a dúvida antes de realizar a ação, evitando continuar diante de uma condição que não está compreendida.",
      "Transferir automaticamente a responsabilidade para outro profissional.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Reconhecer os próprios limites faz parte da prevenção. Quando existe dúvida ou quando as condições reais são diferentes do que era esperado, esclarecer a situação antes de agir ajuda a evitar que uma decisão seja tomada sem compreensão adequada do risco.",
    explicacaoErrada:
      "Continuar a atividade com dúvida, ignorar a situação ou transferir a responsabilidade não está alinhado à prevenção. Diante de uma condição não compreendida, o correto é esclarecer a dúvida antes de agir.",
  },
  {
    id: 50,
    tema: "Aula 9 — Prevenção e Cultura de Segurança",
    dificuldade: "Fácil",
    pergunta: "Qual situação contribui para o fortalecimento de uma cultura de segurança?",
    alternativas: [
      "Considerar a segurança apenas quando ocorre um acidente.",
      "Tratar as informações de segurança como parte das decisões diárias e utilizar as ocorrências como fonte de aprendizado e melhoria.",
      "Concentrar todas as responsabilidades de segurança em uma única área.",
      "Evitar comunicar condições que ainda não tenham causado uma ocorrência.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A cultura de segurança se fortalece quando a prevenção faz parte das decisões e atividades do dia a dia. Informações de segurança são consideradas, condições de risco são comunicadas e as ocorrências são utilizadas para gerar aprendizado e melhorar procedimentos, equipamentos, treinamentos e controles.",
    explicacaoErrada:
      "A cultura de segurança não se fortalece considerando a segurança apenas após acidentes, concentrando responsabilidades em uma única área ou ocultando condições de risco. Ela se fortalece quando a prevenção faz parte das decisões diárias e as ocorrências geram aprendizado e melhoria.",
  },
];

const segObjetivo = Math.min(segurancaQuestions.length, QUESTIONS_PER_TRAINING);

const segMax = segObjetivo;

let segShuffledOrder = [];
let segCurrentPos = 0;
let segSelected = -1;
let segAnswered = false;
let segAcertos = 0;
let segErros = 0;

const cardSeguranca = document.querySelector('[data-training="seguranca-via"]');
const segOptionsContainer = document.getElementById("options-seguranca");
const segQuestionText = document.getElementById("question-text-seguranca");
const segQuestionIndicator = document.getElementById("question-indicator-seguranca");
const segFeedback = document.getElementById("feedback-seguranca");
const segBtnAnswer = document.getElementById("btn-answer-seguranca");

function segCurrentQuestion() {
  return segurancaQuestions[segShuffledOrder[segCurrentPos]];
}

function renderSegQuestion(pos) {
  const q = segCurrentQuestion();
  segQuestionText.textContent = q.pergunta;
  segQuestionIndicator.textContent = "Questão " + (pos + 1) + " de " + segMax;

  segSelected = -1;
  segAnswered = false;

  segOptionsContainer.innerHTML = "";
  q.alternativas.forEach((texto, i) => {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.className = "option__input";
    input.type = "radio";
    input.name = "seg-question-" + pos;
    input.value = String(i);

    const span = document.createElement("span");
    span.className = "option__label";
    span.textContent = texto;

    label.appendChild(input);
    label.appendChild(span);
    label.dataset.index = String(i);
    label.addEventListener("click", () => {
      if (segAnswered) return;
      selectSegOption(input);
    });

    segOptionsContainer.appendChild(label);
  });

  segFeedback.hidden = true;
  segFeedback.className = "feedback";
  segFeedback.innerHTML = "";

  segBtnAnswer.textContent = "Responder";
  segBtnAnswer.hidden = false;
}

function selectSegOption(input) {
  segOptionsContainer.querySelectorAll(".option__input").forEach((el) => {
    el.checked = false;
  });
  input.checked = true;
  segSelected = Number(input.value);
}

function confirmSegAnswer() {
  const q = segCurrentQuestion();
  const correct = segSelected === q.correta;

  if (correct) segAcertos += 1;
  else segErros += 1;

  segOptionsContainer.querySelectorAll(".option__input").forEach((input) => {
    input.disabled = true;
  });

  segOptionsContainer.querySelectorAll(".option").forEach((label) => {
    label.style.pointerEvents = "none";
  });

  const chosen = segOptionsContainer.querySelector(
    '.option__input[value="' + segSelected + '"]'
  ).closest(".option");
  const correctLabel = segOptionsContainer.querySelector(
    '.option__input[value="' + q.correta + '"]'
  ).closest(".option");

  correctLabel.classList.add("is-correct");
  if (!correct) chosen.classList.add("is-wrong");

  segFeedback.classList.add(correct ? "feedback--correct" : "feedback--wrong");
  segFeedback.innerHTML =
    '<div class="feedback__status">' +
    (correct ? "Correta!" : "Incorreta") +
    "</div>" +
    '<div class="feedback__text">' +
    (correct ? q.explicacaoCorrecta : q.explicacaoErrada) +
    "</div>";
  segFeedback.hidden = false;

  if (segCurrentPos === segMax - 1) {
    segBtnAnswer.textContent = "Finalizar";
  } else {
    segBtnAnswer.textContent = "Próxima questão";
  }
}

function startSegTraining() {
  segShuffledOrder = shuffle(segurancaQuestions.map((_, i) => i));
  segCurrentPos = 0;
  segSelected = -1;
  segAnswered = false;
  segAcertos = 0;
  segErros = 0;
  renderSegQuestion(0);
}

cardSeguranca.addEventListener("click", () => {
  iniciarConteudoSeguranca();
});

document.getElementById("btn-back-seguranca").addEventListener("click", () => {
  showView("view-trainings");
});

segBtnAnswer.addEventListener("click", () => {
  if (!segAnswered && segSelected === -1) return;

  if (!segAnswered) {
    segAnswered = true;
    confirmSegAnswer();
    return;
  }

  if (segCurrentPos < segMax - 1) {
    segCurrentPos += 1;
    renderSegQuestion(segCurrentPos);
} else {
    const total = segMax;
    const percent = total > 0 ? Math.round((segAcertos / total) * 100) : 0;

    salvarResultadoTreinamento({
      treinamento: "Segurança Ferroviária",
      nota: total > 0 ? Math.round((segAcertos / total) * 10 * 10) / 10 : 0,
      acertos: segAcertos,
      erros: segErros,
      percentual: percent,
    });

    document.getElementById("result-acertos-seguranca").textContent = segAcertos;
    document.getElementById("result-erros-seguranca").textContent = segErros;
    document.getElementById("result-percent-seguranca").textContent = percent + "%";

    showView("view-result-seguranca");
  }
});

document.getElementById("btn-back-seguranca-to-trainings").addEventListener("click", () => {
  startSegTraining();
  showView("view-trainings");
});

/* ===== Categorias da tela Treinamentos ===== */

document.querySelectorAll(".category").forEach((category) => {
  const header = category.querySelector(".category__header");
  const body = category.querySelector(".category__body");

  header.addEventListener("click", () => {
    const isOpen = !body.hidden;
    body.hidden = isOpen;
    header.setAttribute("aria-expanded", String(!isOpen));
    category.classList.toggle("category--open", !isOpen);
  });
});
