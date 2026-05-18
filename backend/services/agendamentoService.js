const agendamentoModel = require("../models/agendamentoModel");
const clienteModel = require("../models/clienteModel");
const espacoModel = require("../models/espacoModel");

const statusPermitidos = [
  "agendado",
  "confirmado",
  "pendente",
  "cancelado",
  "concluido",
  "bloqueado"
];

function validarAgendamento(dados) {
  if (!dados.cliente_nome) {
    return "Nome do cliente é obrigatório";
  }

  if (!dados.cliente_email) {
    return "Email do cliente é obrigatório";
  }

  if (!dados.espaco_id) {
    return "Espaço é obrigatório";
  }

  if (!dados.data_agendamento) {
    return "Data do agendamento é obrigatória";
  }

  if (!dados.hora_inicio) {
    return "Hora de início é obrigatória";
  }

  if (!dados.hora_fim) {
    return "Hora de fim é obrigatória";
  }

  if (dados.hora_inicio >= dados.hora_fim) {
    return "Hora de início deve ser menor que hora de fim";
  }

  if (dados.status && !statusPermitidos.includes(dados.status)) {
    return "Status inválido";
  }

  return null;
}

async function listarAgendamentos() {
  return await agendamentoModel.listarAgendamentos();
}

async function criarAgendamento(dados) {
  const erro = validarAgendamento(dados);

  if (erro) {
    throw new Error(erro);
  }

  const conflitos = await agendamentoModel.buscarConflitoHorario(
    dados.espaco_id,
    dados.data_agendamento,
    dados.hora_inicio,
    dados.hora_fim
  );

  if (conflitos.length > 0) {
    throw new Error("Já existe um agendamento ou bloqueio nesse horário.");
  }

  const cliente = await clienteModel.criarCliente({
    nome: dados.cliente_nome,
    email: dados.cliente_email,
    telefone: dados.cliente_telefone
  });

  const agendamento = await agendamentoModel.criarAgendamento({
    cliente_id: cliente.id,
    espaco_id: dados.espaco_id,
    data_agendamento: dados.data_agendamento,
    hora_inicio: dados.hora_inicio,
    hora_fim: dados.hora_fim,
    status: dados.status || "agendado",
    observacao: dados.observacao
  });

  const espacos = await espacoModel.listarEspacos();

  const espacoEncontrado = espacos.find((espaco) => {
    return Number(espaco.id) === Number(dados.espaco_id);
  });

  if (process.env.GOOGLE_CALENDAR_ENABLED === "true") {
    try {
      const googleCalendarService = require("./googleCalendarService");

      const eventoGoogle = await googleCalendarService.criarEventoGoogleAgenda({
        cliente_nome: dados.cliente_nome,
        cliente_email: dados.cliente_email,
        cliente_telefone: dados.cliente_telefone,
        espaco_nome: espacoEncontrado ? espacoEncontrado.nome : "",
        data_agendamento: dados.data_agendamento,
        hora_inicio: dados.hora_inicio,
        hora_fim: dados.hora_fim,
        observacao: dados.observacao
      });

      await agendamentoModel.atualizarEventoGoogle(
        agendamento.id,
        eventoGoogle.id,
        eventoGoogle.htmlLink
      );

      agendamento.google_event_id = eventoGoogle.id;
      agendamento.google_event_link = eventoGoogle.htmlLink;
    } catch (erroGoogle) {
      console.log("Erro ao criar evento no Google Agenda:", erroGoogle.message);

      agendamento.aviso_google =
        "Agendamento salvo no sistema, mas não foi enviado ao Google Agenda.";
    }
  }

  return agendamento;
}

async function bloquearHorario(dados) {
  if (!dados.espaco_id) {
    throw new Error("Espaço é obrigatório");
  }

  if (!dados.data_agendamento) {
    throw new Error("Data é obrigatória");
  }

  if (!dados.hora_inicio) {
    throw new Error("Hora de início é obrigatória");
  }

  if (!dados.hora_fim) {
    throw new Error("Hora de fim é obrigatória");
  }

  if (dados.hora_inicio >= dados.hora_fim) {
    throw new Error("Hora de início deve ser menor que hora de fim");
  }

  const conflitos = await agendamentoModel.buscarConflitoHorario(
    dados.espaco_id,
    dados.data_agendamento,
    dados.hora_inicio,
    dados.hora_fim
  );

  if (conflitos.length > 0) {
    throw new Error("Já existe um agendamento ou bloqueio nesse horário.");
  }

  return await agendamentoModel.criarBloqueioHorario(dados);
}

async function atualizarStatusAgendamento(id, status) {
  if (!statusPermitidos.includes(status)) {
    throw new Error("Status inválido");
  }

  return await agendamentoModel.atualizarStatusAgendamento(id, status);
}

async function excluirAgendamento(id) {
  return await agendamentoModel.excluirAgendamento(id);
}

module.exports = {
  listarAgendamentos,
  criarAgendamento,
  bloquearHorario,
  atualizarStatusAgendamento,
  excluirAgendamento
};