const conexao = require("../config/db");

async function listarEspacos() {
  const resultado = await conexao.query(
    "SELECT * FROM espacos WHERE ativo = TRUE ORDER BY nome"
  );

  return resultado.rows;
}

async function criarEspaco(espaco) {
  const { nome, descricao } = espaco;

  const resultado = await conexao.query(
    `
    INSERT INTO espacos (nome, descricao)
    VALUES ($1, $2)
    RETURNING id, nome, descricao
    `,
    [nome, descricao]
  );

  return resultado.rows[0];
}

module.exports = {
  listarEspacos,
  criarEspaco
};