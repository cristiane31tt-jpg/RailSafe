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
  showView("view-results");
});

document.getElementById("btn-back-trainings").addEventListener("click", () => {
  showView("view-home");
});

document.getElementById("btn-back-results").addEventListener("click", () => {
  showView("view-home");
});

/* ===== Treinamento de Sinalização ===== */

/** RAILSAFE_QUESTIONS_BLOCK */
const questions = [
  {
    id: 1,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual é a função do sinal Principal?",
    alternativas: [
      "Licenciar o trem para cruzamento.",
      "Licenciar o trem em manobra.",
      "Licenciar o trem em linha corrida normalmente.",
      "Indicar uma parada obrigatória para o trem.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O sinal Principal licencia o trem para circulação em linha corrida normalmente.",
    explicacaoErrada:
      "O sinal Principal está relacionado à circulação em linha corrida normalmente. As demais alternativas descrevem funções diferentes de sinalização.",
  },
  {
    id: 2,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Para qual finalidade o sinal Secundário ou Unidade B licencia o trem?",
    alternativas: [
      "Para cruzamento.",
      "Para circulação em linha corrida normalmente.",
      "Para manobra.",
      "Para parada obrigatória.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O sinal Secundário ou Unidade B licencia o trem para cruzamento.",
    explicacaoErrada:
      "O sinal Secundário ou Unidade B tem a função de licenciar para cruzamento. As demais alternativas não correspondem à sua função.",
  },
  {
    id: 3,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Até onde o sinal de Manobra licencia o movimento?",
    alternativas: [
      "Até a próxima plataforma.",
      "Até o próximo terminal.",
      "Até o limite de manobra.",
      "Até o fim da linha.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O sinal de Manobra licencia o movimento em manobra até o limite de manobra.",
    explicacaoErrada:
      "A licença de manobra se estende até o limite de manobra. As demais alternativas não correspondem ao limite indicado para esse movimento.",
  },
  {
    id: 4,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O que indica o Ponto?",
    alternativas: [
      "Um sinal de parada obrigatória para veículos ferroviários.",
      "Uma autorização para cruzamento.",
      "Uma autorização para circulação em linha corrida.",
      "Uma autorização para iniciar uma manobra.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O Ponto é um destaque de parada obrigatória para um veículo ferroviário.",
    explicacaoErrada:
      "O Ponto indica uma parada obrigatória para um veículo ferroviário.",
  },
  {
    id: 5,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O que indica o aspecto vermelho piscante apresentado pelos sinais ferroviários?",
    alternativas: [
      "Aumento da velocidade autorizada.",
      "Entrada do trem em uma linha ocupada por outra composição.",
      "Fim obrigatório da linha.",
      "Ausência de sinalização.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O aspecto vermelho piscante pode indicar que o trem vai entrar em uma linha ocupada por outra composição.",
    explicacaoErrada:
      "O aspecto vermelho piscante pode indicar a entrada do trem em uma linha ocupada por outra composição.",
  },
  {
    id: 6,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual é a principal finalidade do intertravamento entre sinais?",
    alternativas: [
      "Permitir a liberação simultânea de rotas conflitantes.",
      "Aumentar a velocidade dos trens.",
      "Impedir a autorização de uma rota conflitante com outra já protegida.",
      "Substituir os sinais ferroviários.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "O intertravamento impede a autorização de uma rota e a liberação de seu sinal de proteção quando já existe outra rota conflitante com seu sinal de proteção liberado.",
    explicacaoErrada:
      "O intertravamento tem como finalidade impedir a autorização de rotas conflitantes. Ele não tem como função aumentar a velocidade ou substituir a sinalização.",
  },
  {
    id: 7,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O que é Headway?",
    alternativas: [
      "A distância entre os terminais.",
      "O intervalo de tempo entre trens consecutivos.",
      "O tempo de permanência do trem na oficina.",
      "O tempo de realização de uma manobra.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Headway é o intervalo de tempo entre trens consecutivos.",
    explicacaoErrada:
      "Headway corresponde ao intervalo de tempo entre trens consecutivos. Não corresponde à distância entre os terminais nem ao tempo de realização de uma manobra.",
  },
  {
    id: 8,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual é a finalidade do sinal ferroviário?",
    alternativas: [
      "Autorizar e controlar a circulação de trens.",
      "Aumentar a velocidade dos trens.",
      "Controlar somente os AMVs.",
      "Substituir a comunicação entre os profissionais.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O sinal ferroviário transmite informações aos maquinistas com a finalidade de autorizar e controlar a circulação de trens.",
    explicacaoErrada:
      "A finalidade do sinal ferroviário é autorizar e controlar a circulação de trens. Ele não tem como finalidade aumentar a velocidade ou substituir a comunicação entre os profissionais.",
  },
  {
    id: 9,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "De quais elementos depende o funcionamento do sinal ferroviário?",
    alternativas: [
      "Controle de intertravamento, seção de bloqueio, estado de AMV, limites de velocidade de circulação e licença de circulação.",
      "Somente velocidade e estado de AMV.",
      "Apenas licença de circulação.",
      "Somente seção de bloqueio.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O funcionamento do sinal ferroviário depende do controle de intertravamento, seção de bloqueio, estado de AMV, limites de velocidade de circulação e licença de circulação.",
    explicacaoErrada:
      "O funcionamento do sinal ferroviário considera diferentes elementos, incluindo intertravamento, seção de bloqueio, estado de AMV, limites de velocidade e licença de circulação.",
  },
  {
    id: 10,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "No contexto do sinal ferroviário, o termo 'autorizar' corresponde a qual termo?",
    alternativas: [
      "Parar.",
      "Licenciar.",
      "Manobrar.",
      "Bloquear.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "No contexto do sinal ferroviário, autorizar significa licenciar.",
    explicacaoErrada:
      "No contexto do sinal ferroviário, o termo autorizar corresponde a licenciar.",
  },
  {
    id: 11,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Uma linha que possui sinalização fixa de circulação nos dois sentidos permite o quê?",
    alternativas: [
      "Circulação somente em um sentido.",
      "Circulação de trens em ambos os sentidos.",
      "Somente movimentos de manobra.",
      "Circulação somente em horários específicos.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Uma linha com sinalização fixa de circulação nos dois sentidos permite a circulação de trens em ambos os sentidos.",
    explicacaoErrada:
      "A característica dessa linha é permitir a circulação de trens em ambos os sentidos.",
  },
  {
    id: 12,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O que é uma Seção de Bloqueio?",
    alternativas: [
      "Um trecho onde podem estar vários trens simultaneamente.",
      "Um trecho da via, sinalizado ou não, no qual só pode estar presente um trem por vez.",
      "Uma área destinada exclusivamente à manutenção.",
      "Uma plataforma destinada ao embarque.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Seção de Bloqueio é o trecho da via, sinalizado ou não, no qual só pode estar presente um trem por vez.",
    explicacaoErrada:
      "Uma Seção de Bloqueio é um trecho da via, sinalizado ou não, no qual só pode estar presente um trem por vez.",
  },
  {
    id: 13,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Como devem ser considerados pelos maquinistas e condutores os sinais fixos que não estiverem em serviço?",
    alternativas: [
      "Como sinais de parada obrigatória.",
      "Como sinais de velocidade reduzida.",
      "Como inexistentes.",
      "Como sinais de manobra.",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Os maquinistas e condutores considerarão inexistentes os sinais fixos que não estiverem em serviço.",
    explicacaoErrada:
      "Os sinais fixos que não estiverem em serviço devem ser considerados inexistentes pelos maquinistas e condutores.",
  },
  {
    id: 14,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Como devem ser identificados os sinais fixos que não estiverem em serviço?",
    alternativas: [
      "Com uma faixa vermelha.",
      "Com uma Cruz de Santo André pintada de branco.",
      "Com uma placa amarela.",
      "Com uma luz piscante.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Os sinais fixos que não estiverem em serviço deverão ser cobertos por uma Cruz de Santo André, pintada de branco.",
    explicacaoErrada:
      "A Cruz de Santo André pintada de branco é utilizada para cobrir os sinais fixos que não estiverem em serviço.",
  },
  {
    id: 15,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "O que é Aspecto de Sinal?",
    alternativas: [
      "A indicação de um sinal luminoso, sendo que cada aspecto possui seu significado próprio.",
      "A distância entre dois sinais.",
      "A velocidade máxima da composição.",
      "O estado de uma seção de bloqueio.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Aspecto de Sinal é a indicação de um sinal luminoso, sendo que cada aspecto possui seu significado próprio.",
    explicacaoErrada:
      "Aspecto de Sinal é a indicação de um sinal luminoso. Cada aspecto possui seu significado próprio.",
  },
  {
    id: 16,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Qual é a finalidade do ATP no sistema de controle e sinalização ferroviária?",
    alternativas: [
      "Garantir a segurança do tráfego por meio de uma funcionalidade de proteção.",
      "Realizar exclusivamente o embarque de passageiros.",
      "Controlar somente as portas do trem.",
      "Substituir completamente a sinalização da via.",
    ],
    correta: 0,
    explicacaoCorrecta:
      "O ATP é uma funcionalidade de proteção do sistema de controle e sinalização ferroviária que tem como objetivo garantir a segurança do tráfego.",
    explicacaoErrada:
      "O ATP está relacionado à proteção do sistema de controle e sinalização ferroviária e à segurança do tráfego.",
  },
  {
    id: 17,
    tema: "Sinalização",
    dificuldade: "Fácil",
    pergunta: "Entre quais equipamentos ocorre a comunicação utilizada pelo ATP?",
    alternativas: [
      "Entre duas estações ferroviárias.",
      "Entre o equipamento do trem e o equipamento na via.",
      "Entre o maquinista e os passageiros.",
      "Entre o terminal e a oficina.",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O ATP utiliza comunicação entre o equipamento do trem e o equipamento na via com o objetivo de contribuir para a segurança do tráfego.",
    explicacaoErrada:
      "A comunicação utilizada pelo ATP ocorre entre o equipamento do trem e o equipamento na via.",
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

/* ===== Treinamento de AMV ===== */

const amvQuestions = [
  {
    id: 1,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "O que significa AMV?",
    alternativas: [
      "Aparelho de Mudança de Via",
      "Área de Manutenção de Via",
      "Aviso de Movimento de Via",
      "Acesso Manual de Via",
    ],
    correta: 0,
    explicacaoCorrecta:
      "AMV significa Aparelho de Mudança de Via, o dispositivo responsável por transferir o veículo ferroviário de uma via para outra.",
    explicacaoErrada:
      "AMV é a sigla de Aparelho de Mudança de Via. As demais alternativas não correspondem ao significado correto da sigla.",
  },
  {
    id: 2,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a principal função de um AMV?",
    alternativas: [
      "Controlar a velocidade do trem",
      "Permitir que o veículo ferroviário passe de uma via para outra",
      "Acionar os sinais luminosos",
      "Parar automaticamente o trem",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A principal função do AMV é permitir que o veículo ferroviário passe de uma via para outra.",
    explicacaoErrada:
      "O AMV tem como função permitir a passagem do veículo ferroviário de uma via para outra. Ele não controla a velocidade nem aciona os sinais.",
  },
  {
    id: 3,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Quais são os principais elementos móveis responsáveis pela mudança de direção do trem em um AMV?",
    alternativas: [
      "Trilhos de encosto",
      "Agulhas",
      "Dormentes",
      "Contratrilhos",
    ],
    correta: 1,
    explicacaoCorrecta:
      "As agulhas são os elementos móveis que, ao se moverem, conduzem o veículo para a via desejada.",
    explicacaoErrada:
      "Os elementos móveis responsáveis pela mudança de direção do trem são as agulhas. Trilhos de encosto e contratrilhos possuem outras funções na via.",
  },
  {
    id: 4,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Antes de um trem circular por um AMV, o que é fundamental verificar?",
    alternativas: [
      "Apenas a velocidade do trem",
      "Se o AMV está corretamente posicionado e assegurado",
      "Apenas a iluminação da via",
      "Somente a condição dos dormentes",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Antes da circulação é fundamental verificar se o AMV está corretamente posicionado e assegurado para a rota prevista.",
    explicacaoErrada:
      "O essencial é confirmar o correto posicionamento e asseguramento do AMV. Velocidade, iluminação e dormentes, por si sós, não garantem a rota correta.",
  },
  {
    id: 5,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "O que pode acontecer se um AMV não estiver corretamente posicionado?",
    alternativas: [
      "Nada, pois o trem corrige automaticamente sua trajetória",
      "O trem pode tomar uma rota diferente da pretendida",
      "Apenas o sinal ficará apagado",
      "O trem necessariamente irá parar",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Com o AMV mal posicionado, o trem pode tomar uma rota diferente da pretendida, gerando situação de risco.",
    explicacaoErrada:
      "Um AMV mal posicionado pode fazer o trem tomar uma rota diferente da pretendida. O trem não corrige sua trajetória e nem necessariamente para.",
  },
  {
    id: 6,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual situação exige atenção especial antes da passagem de um trem pelo AMV?",
    alternativas: [
      "Existência de objetos ou materiais que possam impedir o correto fechamento das agulhas",
      "Temperatura ambiente baixa",
      "Trem com poucos passageiros",
      "Iluminação da estação",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Objetos ou materiais que impeçam o correto fechamento das agulhas exigem atenção especial antes da passagem do trem.",
    explicacaoErrada:
      "A presença de objetos ou materiais que impeçam o fechamento das agulhas exige atenção especial. Os demais fatores não comprometem o funcionamento do AMV.",
  },
  {
    id: 7,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Em uma situação de irregularidade no AMV, qual deve ser a conduta?",
    alternativas: [
      "Passar rapidamente para evitar atrasos",
      "Ignorar se aparentemente estiver próximo da posição correta",
      "Comunicar a irregularidade e seguir os procedimentos operacionais aplicáveis",
      "Empurrar manualmente a agulha sem autorização",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Em caso de irregularidade, a conduta correta é comunicar a irregularidade e seguir os procedimentos operacionais aplicáveis.",
    explicacaoErrada:
      "Diante de uma irregularidade, deve-se comunicar e seguir os procedimentos operacionais. Passar rapidamente, ignorar ou manusear a agulha sem autorização é inseguro.",
  },
  {
    id: 8,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Por que é importante confirmar a posição do AMV antes da circulação?",
    alternativas: [
      "Para reduzir o consumo de energia",
      "Para garantir que o movimento ferroviário ocorra pela rota prevista e com segurança",
      "Para aumentar a velocidade do trem",
      "Para evitar somente atrasos",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Confirmar a posição do AMV garante que o movimento ferroviário ocorra pela rota prevista e com segurança.",
    explicacaoErrada:
      "A confirmação da posição do AMV visa garantir a rota prevista e a segurança do movimento, e não consumo de energia ou aumento de velocidade.",
  },
  {
    id: 9,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual é a importância do correto encosto das agulhas em um AMV?",
    alternativas: [
      "Apenas melhorar a aparência da via",
      "Garantir que o veículo ferroviário seja direcionado corretamente e com segurança",
      "Aumentar a velocidade permitida",
      "Reduzir o ruído durante a passagem",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O correto encosto das agulhas garante que o veículo ferroviário seja direcionado corretamente e com segurança.",
    explicacaoErrada:
      "O correto encosto das agulhas assegura o direcionamento correto e seguro do veículo. Não se trata de estética, velocidade ou ruído.",
  },
  {
    id: 10,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Ao identificar uma obstrução entre a agulha e o trilho de encosto de um AMV, o que deve ser feito?",
    alternativas: [
      "Retirar o objeto imediatamente, independentemente da situação operacional",
      "Solicitar que o trem passe em baixa velocidade",
      "Comunicar a irregularidade e seguir o procedimento operacional estabelecido",
      "Ignorar se o objeto for pequeno",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Diante de uma obstrução entre agulha e trilho de encosto, deve-se comunicar a irregularidade e seguir o procedimento operacional estabelecido.",
    explicacaoErrada:
      "A conduta correta é comunicar a irregularidade e seguir o procedimento operacional. Retirar o objeto por conta própria ou ignorá-lo é inseguro.",
  },
  {
    id: 11,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Por que a inspeção visual de um AMV é importante?",
    alternativas: [
      "Para verificar apenas a limpeza da via",
      "Para identificar condições que possam comprometer seu funcionamento ou a circulação segura",
      "Para determinar o horário de passagem do próximo trem",
      "Para verificar somente a pintura dos componentes",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A inspeção visual do AMV permite identificar condições que possam comprometer seu funcionamento ou a circulação segura.",
    explicacaoErrada:
      "A inspeção visual tem por finalidade identificar condições que comprometam o funcionamento do AMV ou a circulação segura, e não limpeza ou pintura.",
  },
  {
    id: 12,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Um AMV apresenta indicação de posição diferente daquela necessária para a rota do trem. Qual é a atitude mais segura?",
    alternativas: [
      "Autorizar a passagem porque o trem pode corrigir a trajetória",
      "Prosseguir e corrigir o AMV depois da passagem",
      "Não prosseguir até que a situação seja verificada e tratada conforme os procedimentos aplicáveis",
      "Aumentar a velocidade para passar rapidamente",
    ],
    correta: 2,
    explicacaoCorrecta:
      "A atitude mais segura é não prosseguir até que a situação seja verificada e tratada conforme os procedimentos aplicáveis.",
    explicacaoErrada:
      "Diante de posição divergente do AMV, a atitude mais segura é não prosseguir até verificação e tratamento conforme os procedimentos. O trem não corrige a trajetória.",
  },
  {
    id: 13,
    tema: "AMV",
    dificuldade: "Fácil",
    pergunta: "Qual dos seguintes fatores pode comprometer o funcionamento de um AMV?",
    alternativas: [
      "Materiais ou objetos interferindo no movimento das agulhas",
      "A quantidade de passageiros no trem",
      "A iluminação interna do trem",
      "A temperatura dentro da cabine",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Materiais ou objetos que interfiram no movimento das agulhas podem comprometer o funcionamento do AMV.",
    explicacaoErrada:
      "O funcionamento do AMV pode ser comprometido por materiais ou objetos que interfiram no movimento das agulhas. Passageiros e iluminação do trem não o afetam.",
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
  startAmvTraining();
  showView("view-amv");
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

/* ===== Treinamento de Segurança Ferroviária ===== */

const segurancaQuestions = [
  {
    id: 1,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual é o principal objetivo da segurança ferroviária?",
    alternativas: [
      "Aumentar a velocidade dos trens",
      "Evitar acidentes e proteger pessoas, equipamentos e infraestrutura",
      "Reduzir o tempo de parada nas estações",
      "Aumentar a capacidade de passageiros",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O principal objetivo da segurança ferroviária é evitar acidentes e proteger pessoas, equipamentos e infraestrutura.",
    explicacaoErrada:
      "A segurança ferroviária existe para evitar acidentes e proteger pessoas, equipamentos e a infraestrutura. Aumentar velocidade ou capacidade não é o seu objetivo principal.",
  },
  {
    id: 2,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "O que deve ser priorizado diante de uma situação de risco na operação ferroviária?",
    alternativas: [
      "Manter a circulação normal",
      "Evitar atrasos",
      "Preservar a segurança das pessoas e da operação",
      "Cumprir o horário previsto",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Diante de uma situação de risco, deve-se priorizar a preservação da segurança das pessoas e da operação.",
    explicacaoErrada:
      "Em situação de risco, a segurança das pessoas e da operação vem antes da circulação normal, dos horários e dos atrasos.",
  },
  {
    id: 3,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Ao identificar uma condição insegura na via, o profissional deve:",
    alternativas: [
      "Ignorá-la se não houver acidente",
      "Comunicar a situação e seguir os procedimentos aplicáveis",
      "Aguardar outra pessoa perceber",
      "Continuar a atividade normalmente",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Ao identificar uma condição insegura, o profissional deve comunicar a situação e seguir os procedimentos aplicáveis.",
    explicacaoErrada:
      "Identificando uma condição insegura, o correto é comunicar a situação e seguir os procedimentos aplicáveis, nunca ignorá-la ou aguardar que outra pessoa perceba.",
  },
  {
    id: 4,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Por que é importante respeitar os procedimentos operacionais?",
    alternativas: [
      "Porque eles estabelecem condições seguras para a realização das atividades",
      "Apenas para evitar punições",
      "Para reduzir o trabalho da equipe",
      "Somente durante inspeções",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Os procedimentos operacionais são importantes porque estabelecem condições seguras para a realização das atividades.",
    explicacaoErrada:
      "Os procedimentos definem condições seguras para a realização das atividades. Não devem ser seguidos apenas para evitar punições ou somente durante inspeções.",
  },
  {
    id: 5,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "O que caracteriza uma condição insegura?",
    alternativas: [
      "Uma situação que pode contribuir para um acidente ou incidente",
      "Uma atividade realizada dentro do procedimento",
      "Uma operação dentro dos limites estabelecidos",
      "Uma situação previamente autorizada e controlada",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Condição insegura é uma situação que pode contribuir para a ocorrência de um acidente ou incidente.",
    explicacaoErrada:
      "Condição insegura é aquela que pode contribuir para um acidente ou incidente. Atividades dentro do procedimento não são condições inseguras.",
  },
  {
    id: 6,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "O que é um comportamento inseguro?",
    alternativas: [
      "Uma ação que desrespeita uma condição ou procedimento de segurança",
      "Uma inspeção preventiva",
      "Uma comunicação operacional",
      "Uma atividade planejada",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Comportamento inseguro é uma ação que desrespeita uma condição ou procedimento de segurança.",
    explicacaoErrada:
      "Comportamento inseguro é uma ação que desrespeita uma condição ou procedimento de segurança. Inspeção preventiva e comunicação operacional não são comportamentos inseguros.",
  },
  {
    id: 7,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Ao perceber que uma atividade não pode ser realizada com segurança, a atitude mais adequada é:",
    alternativas: [
      "Continuar para não atrasar a operação",
      "Improvisar uma solução",
      "Interromper ou não iniciar a atividade e comunicar a situação conforme o procedimento",
      "Esperar que o problema desapareça",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Sem condições seguras, a atitude adequada é interromper ou não iniciar a atividade e comunicar a situação conforme o procedimento.",
    explicacaoErrada:
      "Quando a atividade não pode ser realizada com segurança, deve-se interrompê-la ou não iniciá-la e comunicar a situação conforme o procedimento, evitando continuar ou improvisar.",
  },
  {
    id: 8,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Por que a comunicação entre os profissionais é fundamental na operação ferroviária?",
    alternativas: [
      "Apenas para registrar ocorrências",
      "Para garantir que informações importantes para a segurança sejam transmitidas corretamente",
      "Para reduzir o tempo de trabalho",
      "Somente para atividades administrativas",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A comunicação é fundamental para garantir que informações importantes para a segurança sejam transmitidas corretamente.",
    explicacaoErrada:
      "A comunicação entre os profissionais garante que informações importantes para a segurança sejam transmitidas corretamente. Não serve apenas para registros ou atividades administrativas.",
  },
  {
    id: 9,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Uma informação operacional recebida de forma incompleta deve ser:",
    alternativas: [
      "Interpretada conforme a experiência pessoal",
      "Ignorada",
      "Confirmada antes de uma ação que possa afetar a segurança",
      "Repassada imediatamente sem confirmação",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Informação incompleta deve ser confirmada antes de qualquer ação que possa afetar a segurança.",
    explicacaoErrada:
      "Uma informação incompleta deve ser confirmada antes de uma ação que possa afetar a segurança, e não interpretada ou repassada sem confirmação.",
  },
  {
    id: 10,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Durante uma atividade próxima à via férrea, por que o profissional deve manter atenção constante ao ambiente e à movimentação dos trens?",
    alternativas: [
      "Porque a movimentação ferroviária pode ocorrer a qualquer momento e exige que o profissional reconheça os riscos e mantenha-se em condição segura",
      "Porque a atenção é necessária apenas quando há grande quantidade de trens circulando",
      "Porque a movimentação dos trens pode causar somente desconforto e ruído",
      "Porque a atenção serve principalmente para evitar atrasos na atividade",
    ],
    correta: 0,
    explicacaoCorrecta:
      "A movimentação ferroviária pode ocorrer a qualquer momento, por isso o profissional deve reconhecer os riscos e manter-se em condição segura.",
    explicacaoErrada:
      "A atenção constante é necessária porque a movimentação ferroviária pode ocorrer a qualquer momento, exigindo o reconhecimento dos riscos e a manutenção de condição segura.",
  },
  {
    id: 11,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Antes de acessar uma área operacional, é importante:",
    alternativas: [
      "Verificar as condições de segurança e as autorizações necessárias",
      "Entrar rapidamente para reduzir o tempo de exposição",
      "Entrar somente se não houver passageiros",
      "Seguir apenas a própria experiência",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Antes de acessar uma área operacional, é importante verificar as condições de segurança e as autorizações necessárias.",
    explicacaoErrada:
      "Antes de acessar uma área operacional deve-se verificar as condições de segurança e as autorizações necessárias, e não confiar apenas na experiência ou entrar de forma apressada.",
  },
  {
    id: 12,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual situação representa um risco grave durante uma atividade na via?",
    alternativas: [
      "Permanecer em local seguro e autorizado",
      "Realizar uma atividade sem considerar a possibilidade de circulação ferroviária",
      "Utilizar os equipamentos previstos",
      "Manter comunicação com a equipe",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Realizar uma atividade sem considerar a possibilidade de circulação ferroviária representa um risco grave.",
    explicacaoErrada:
      "O risco grave é realizar atividade sem considerar a possibilidade de circulação ferroviária. Permanecer em local seguro, usar equipamentos e manter comunicação não representam esse risco.",
  },
  {
    id: 13,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Por que a identificação dos riscos deve ocorrer antes da execução de uma atividade?",
    alternativas: [
      "Para permitir que medidas preventivas sejam adotadas",
      "Para aumentar a velocidade da atividade",
      "Para evitar registros",
      "Para substituir os procedimentos operacionais",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Identificar os riscos antes da atividade permite que medidas preventivas sejam adotadas.",
    explicacaoErrada:
      "A identificação prévia dos riscos permite a adoção de medidas preventivas. Ela não visa aumentar a velocidade nem substituir os procedimentos operacionais.",
  },
  {
    id: 14,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Um profissional percebe que seu colega está prestes a realizar uma ação que pode gerar risco. O que deve fazer?",
    alternativas: [
      "Não interferir",
      "Avisá-lo e agir conforme os procedimentos de segurança aplicáveis",
      "Esperar acontecer um problema",
      "Registrar a situação somente depois",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Ao perceber uma ação que pode gerar risco, deve-se avisar o colega e agir conforme os procedimentos de segurança aplicáveis.",
    explicacaoErrada:
      "Deve-se avisar o colega e agir conforme os procedimentos de segurança aplicáveis, e não apenas esperar ou registrar a situação depois.",
  },
  {
    id: 15,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual é a finalidade de uma inspeção de segurança?",
    alternativas: [
      "Procurar apenas defeitos já conhecidos",
      "Identificar perigos, condições inseguras e possíveis falhas antes que provoquem acidentes",
      "Aumentar a velocidade da operação",
      "Substituir a manutenção",
    ],
    correta: 1,
    explicacaoCorrecta:
      "A inspeção de segurança serve para identificar perigos, condições inseguras e possíveis falhas antes que provoquem acidentes.",
    explicacaoErrada:
      "A finalidade da inspeção de segurança é identificar perigos, condições inseguras e falhas antes que provoquem acidentes, e não procurar apenas defeitos conhecidos.",
  },
  {
    id: 16,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Em caso de emergência ferroviária, a primeira preocupação deve ser:",
    alternativas: [
      "Evitar atrasos",
      "Preservar vidas e controlar o risco",
      "Retomar imediatamente a circulação",
      "Evitar comunicação externa",
    ],
    correta: 1,
    explicacaoCorrecta:
      "Em uma emergência, a primeira preocupação deve ser preservar vidas e controlar o risco.",
    explicacaoErrada:
      "Em emergência, a prioridade é preservar vidas e controlar o risco. Atrasos, retomada da circulação e comunicação vêm depois da segurança.",
  },
  {
    id: 17,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Por que improvisações podem ser perigosas na operação ferroviária?",
    alternativas: [
      "Porque podem introduzir riscos não previstos nos procedimentos",
      "Porque sempre aumentam o custo",
      "Porque tornam a atividade mais rápida",
      "Porque dificultam somente os registros",
    ],
    correta: 0,
    explicacaoCorrecta:
      "Improvisações podem introduzir riscos não previstos nos procedimentos, por isso são perigosas.",
    explicacaoErrada:
      "Improvisar pode introduzir riscos não previstos nos procedimentos. A segurança depende de seguir as condições estabelecidas.",
  },
  {
    id: 18,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "O uso correto dos equipamentos de proteção individual (EPI) tem como finalidade:",
    alternativas: [
      "Substituir todos os procedimentos de segurança",
      "Reduzir a exposição do trabalhador aos riscos existentes na atividade",
      "Permitir que qualquer atividade seja realizada",
      "Eliminar completamente os riscos da operação",
    ],
    correta: 1,
    explicacaoCorrecta:
      "O EPI tem como finalidade reduzir a exposição do trabalhador aos riscos existentes na atividade.",
    explicacaoErrada:
      "O EPI reduz a exposição do trabalhador aos riscos existentes. Ele não substitui os procedimentos de segurança nem elimina completamente os riscos.",
  },
  {
    id: 19,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Durante uma atividade operacional, ocorre uma situação diferente da prevista no procedimento. Qual deve ser a conduta mais segura?",
    alternativas: [
      "Continuar a atividade e adaptar a execução conforme a experiência do profissional",
      "Resolver a situação rapidamente para evitar impacto na circulação",
      "Avaliar a condição, comunicar imediatamente ao CCO e seguir os procedimentos e orientações operacionais aplicáveis",
      "Aguardar a ocorrência de um problema antes de comunicar ao CCO",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Diante de uma situação não prevista no procedimento, a conduta mais segura é avaliar a condição, comunicar imediatamente ao CCO e seguir os procedimentos e orientações operacionais aplicáveis.",
    explicacaoErrada:
      "Situações não previstas exigem avaliação e comunicação imediata ao CCO, seguindo procedimentos e orientações aplicáveis, em vez de improvisar ou aguardar um problema acontecer.",
  },
  {
    id: 20,
    tema: "Segurança Ferroviária",
    dificuldade: "Fácil",
    pergunta: "Qual atitude melhor representa uma cultura de segurança?",
    alternativas: [
      "Priorizar a produtividade mesmo diante de riscos",
      "Corrigir somente situações que já causaram acidentes",
      "Identificar riscos, comunicar desvios e agir preventivamente",
      "Evitar comunicar problemas para não interromper a operação",
    ],
    correta: 2,
    explicacaoCorrecta:
      "Uma cultura de segurança é representada por identificar riscos, comunicar desvios e agir preventivamente.",
    explicacaoErrada:
      "Cultura de segurança significa identificar riscos, comunicar desvios e agir preventivamente, e não priorizar produtividade diante de riscos ou ocultar problemas.",
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
  startSegTraining();
  showView("view-seguranca");
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
