const selectEspaco = document.getElementById("espaco_id");
const formAgendamento = document.getElementById("form-agendamento");
const listaAgendamentos = document.getElementById("lista-agendamentos");
const formBloqueio = document.getElementById("form-bloqueio");
const selectBloqueioEspaco = document.getElementById("bloqueio_espaco_id");
const tipoVisualizacao = document.getElementById("tipo_visualizacao");
const dataReferencia = document.getElementById("data_referencia");
const botaoAplicarFiltro = document.getElementById("botao-aplicar-filtro");
const formLogin = document.getElementById("form-login");
const statusLogin = document.getElementById("status-login");

let agendamentosCarregados = [];

const formLogin = document.getElementById("form-login");
const statusLogin = document.getElementById("status-login");

function atualizarStatusLogin() {
  const token = localStorage.getItem("tokenAgendaFlow");

  if (token) {
    statusLogin.textContent = "Você está logado como administrador.";
  } else {
    statusLogin.textContent = "Você ainda não está logado.";
  }
}

formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("login_email").value;
  const senha = document.getElementById("login_senha").value;

  const resposta = await fazerLogin(email, senha);

  if (resposta.erro) {
    alert(resposta.erro);
    return;
  }

  localStorage.setItem("tokenAgendaFlow", resposta.token);
  atualizarStatusLogin();

  alert("Login realizado com sucesso.");
  formLogin.reset();
});

async function carregarEspacos() {
  const espacos = await buscarEspacos();

  const opcoes = espacos
    .map((espaco) => {
      return `<option value="${espaco.id}">${espaco.nome}</option>`;
    })
    .join("");

  selectEspaco.innerHTML = opcoes;
  selectBloqueioEspaco.innerHTML = opcoes;
}

function renderizarAgendamentos(agendamentos) {
  if (agendamentos.length === 0) {
    listaAgendamentos.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
    return;
  }

  listaAgendamentos.innerHTML = agendamentos
    .map((agendamento) => criarCardAgendamento(agendamento))
    .join("");
}

async function carregarAgendamentos() {
  agendamentosCarregados = await buscarAgendamentos();
  renderizarAgendamentos(agendamentosCarregados);
}

formAgendamento.addEventListener("submit", async function (event) {
  event.preventDefault();

  const novoAgendamento = {
    cliente_nome: document.getElementById("cliente_nome").value,
    cliente_email: document.getElementById("cliente_email").value,
    cliente_telefone: document.getElementById("cliente_telefone").value,
    espaco_id: selectEspaco.value,
    data_agendamento: document.getElementById("data_agendamento").value,
    hora_inicio: document.getElementById("hora_inicio").value,
    hora_fim: document.getElementById("hora_fim").value,
    status: document.getElementById("status").value,
    observacao: document.getElementById("observacao").value
  };

  const resposta = await criarAgendamento(novoAgendamento);

  if (resposta.erro) {
    alert(resposta.erro);
    return;
  }

  formAgendamento.reset();
  await carregarAgendamentos();
});

async function alterarStatus(id, status) {
  const resposta = await atualizarStatus(id, status);

  if (resposta.erro) {
    alert(resposta.erro);
    return;
  }

  await carregarAgendamentos();
}

async function removerAgendamento(id) {
  const confirmou = confirm("Deseja excluir este agendamento?");

  if (!confirmou) {
    return;
  }

  await excluirAgendamento(id);
  await carregarAgendamentos();
}

async function iniciarPagina() {
  atualizarStatusLogin();
  await carregarEspacos();
  await carregarAgendamentos();
}

function aplicarVisualizacao() {
  const tipo = tipoVisualizacao.value;
  const data = dataReferencia.value;

  if (tipo === "todos") {
    renderizarAgendamentos(agendamentosCarregados);
    return;
  }

  if (!data) {
    alert("Selecione uma data de referência.");
    return;
  }

  let filtrados = [];

  if (tipo === "diaria") {
    filtrados = agendamentosCarregados.filter((agendamento) => {
      return agendamento.data_agendamento.slice(0, 10) === data;
    });
  }

  if (tipo === "semanal") {
    const dataBase = new Date(`${data}T00:00:00`);
    const diaSemana = dataBase.getDay();

    const inicioSemana = new Date(dataBase);
    inicioSemana.setDate(dataBase.getDate() - diaSemana);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    filtrados = agendamentosCarregados.filter((agendamento) => {
      const dataAgendamento = new Date(
        `${agendamento.data_agendamento.slice(0, 10)}T00:00:00`
      );

      return dataAgendamento >= inicioSemana && dataAgendamento <= fimSemana;
    });
  }

  renderizarAgendamentos(filtrados);
}

formBloqueio.addEventListener("submit", async function (event) {
  event.preventDefault();

  const novoBloqueio = {
    espaco_id: selectBloqueioEspaco.value,
    data_agendamento: document.getElementById("bloqueio_data").value,
    hora_inicio: document.getElementById("bloqueio_hora_inicio").value,
    hora_fim: document.getElementById("bloqueio_hora_fim").value,
    observacao: document.getElementById("bloqueio_observacao").value
  };

  const resposta = await bloquearHorario(novoBloqueio);

  if (resposta.erro) {
    alert(resposta.erro);
    return;
  }

  alert("Horário bloqueado com sucesso.");

  formBloqueio.reset();
  await carregarAgendamentos();
});

botaoAplicarFiltro.addEventListener("click", aplicarVisualizacao);

iniciarPagina();