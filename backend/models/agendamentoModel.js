const conexao = require("../config/db");

async function listarAgendamentos() {
  const resultado = await conexao.query(`
    SELECT 
      agendamentos.id,
      agendamentos.data_agendamento,
      agendamentos.hora_inicio,
      agendamentos.hora_fim,
      agendamentos.status,
      agendamentos.observacao,
      agendamentos.google_event_id,
      agendamentos.google_event_link,
      clientes.nome AS cliente_nome,
      clientes.email AS cliente_email,
      espacos.nome AS espaco_nome
    FROM agendamentos
    LEFT JOIN clientes ON agendamentos.cliente_id = clientes.id
    INNER JOIN espacos ON agendamentos.espaco_id = espacos.id
    ORDER BY agendamentos.data_agendamento, agendamentos.hora_inicio
  `);

  return resultado.rows;
}

async function criarAgendamento(agendamento) {
  const {
    cliente_id,
    espaco_id,
    data_agendamento,
    hora_inicio,
    hora_fim,
    status,
    observacao
  } = agendamento;

  const resultado = await conexao.query(
    `
    INSERT INTO agendamentos 
    (cliente_id, espaco_id, data_agendamento, hora_inicio, hora_fim, status, observacao)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      cliente_id,
      espaco_id,
      data_agendamento,
      hora_inicio,
      hora_fim,
      status || "agendado",
      observacao
    ]
  );

  return resultado.rows[0];
}

async function criarBloqueioHorario(bloqueio) {
  const {
    espaco_id,
    data_agendamento,
    hora_inicio,
    hora_fim,
    observacao
  } = bloqueio;

  const resultado = await conexao.query(
    `
    INSERT INTO agendamentos
    (cliente_id, espaco_id, data_agendamento, hora_inicio, hora_fim, status, observacao)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      null,
      espaco_id,
      data_agendamento,
      hora_inicio,
      hora_fim,
      "bloqueado",
      observacao || "Horário bloqueado"
    ]
  );

  return resultado.rows[0];
}

async function buscarConflitoHorario(
  espaco_id,
  data_agendamento,
  hora_inicio,
  hora_fim
) {
  const resultado = await conexao.query(
    `
    SELECT *
    FROM agendamentos
    WHERE espaco_id = $1
      AND data_agendamento = $2
      AND status NOT IN ('cancelado', 'concluido')
      AND hora_inicio < $3
      AND hora_fim > $4
    `,
    [espaco_id, data_agendamento, hora_fim, hora_inicio]
  );

  return resultado.rows;
}

async function atualizarStatusAgendamento(id, status) {
  const resultado = await conexao.query(
    `
    UPDATE agendamentos
    SET status = $1
    WHERE id = $2
    RETURNING id, status
    `,
    [status, id]
  );

  return resultado.rows[0];
}

async function atualizarEventoGoogle(id, googleEventId, googleEventLink) {
  const resultado = await conexao.query(
    `
    UPDATE agendamentos
    SET google_event_id = $1, google_event_link = $2
    WHERE id = $3
    RETURNING id, google_event_id, google_event_link
    `,
    [googleEventId, googleEventLink, id]
  );

  return resultado.rows[0];
}

async function excluirAgendamento(id) {
  await conexao.query(
    "DELETE FROM agendamentos WHERE id = $1",
    [id]
  );

  return {
    mensagem: "Agendamento excluído com sucesso"
  };
}

module.exports = {
  listarAgendamentos,
  criarAgendamento,
  criarBloqueioHorario,
  buscarConflitoHorario,
  atualizarStatusAgendamento,
  atualizarEventoGoogle,
  excluirAgendamento
};