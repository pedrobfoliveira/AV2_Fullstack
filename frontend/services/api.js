const API_URL = "/api";

async function buscarEspacos() {
  const resposta = await fetch(`${API_URL}/espacos`);
  return await resposta.json();
}

async function buscarAgendamentos() {
  const resposta = await fetch(`${API_URL}/agendamentos`);
  return await resposta.json();
}

async function criarAgendamento(agendamento) {
  const resposta = await fetch(`${API_URL}/agendamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(agendamento)
  });

  return await resposta.json();
}

async function atualizarStatus(id, status) {
  const resposta = await fetch(`${API_URL}/agendamentos/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  return await resposta.json();
}

async function excluirAgendamento(id) {
  const resposta = await fetch(`${API_URL}/agendamentos/${id}`, {
    method: "DELETE"
  });

  return await resposta.json();
}

async function bloquearHorario(bloqueio) {
  const resposta = await fetch(`${API_URL}/agendamentos/bloqueios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bloqueio)
  });

  return await resposta.json();
}