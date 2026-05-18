const agendamentoService = require("../services/agendamentoService");

async function listarAgendamentos(req, res) {
  try {
    const agendamentos = await agendamentoService.listarAgendamentos();
    res.json(agendamentos);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao listar agendamentos" });
  }
}

async function criarAgendamento(req, res) {
  try {
    const agendamento = await agendamentoService.criarAgendamento(req.body);
    res.status(201).json(agendamento);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

async function atualizarStatusAgendamento(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const resultado = await agendamentoService.atualizarStatusAgendamento(
      id,
      status
    );

    res.json(resultado);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

async function excluirAgendamento(req, res) {
  try {
    const { id } = req.params;

    const resultado = await agendamentoService.excluirAgendamento(id);

    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir agendamento" });
  }
}

async function bloquearHorario(req, res) {
  try {
    const bloqueio = await agendamentoService.bloquearHorario(req.body);
    res.status(201).json(bloqueio);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

module.exports = {
  listarAgendamentos,
  criarAgendamento,
  atualizarStatusAgendamento,
  excluirAgendamento,
  bloquearHorario
};