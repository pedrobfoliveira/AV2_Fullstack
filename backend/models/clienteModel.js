const conexao = require("../config/db");

async function listarClientes() {
  const resultado = await conexao.query(
    "SELECT * FROM clientes ORDER BY nome"
  );

  return resultado.rows;
}

async function criarCliente(cliente) {
  const { nome, email, telefone } = cliente;

  const resultado = await conexao.query(
    `
    INSERT INTO clientes (nome, email, telefone)
    VALUES ($1, $2, $3)
    RETURNING id, nome, email, telefone
    `,
    [nome, email, telefone]
  );

  return resultado.rows[0];
}

module.exports = {
  listarClientes,
  criarCliente
};