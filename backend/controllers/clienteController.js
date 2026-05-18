const clienteModel = require("../models/clienteModel");

async function listarClientes(req, res) {
  try {
    const clientes = await clienteModel.listarClientes();
    res.json(clientes);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao listar clientes" });
  }
}

async function criarCliente(req, res) {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: "Nome e email são obrigatórios" });
    }

    const cliente = await clienteModel.criarCliente({
      nome,
      email,
      telefone
    });

    res.status(201).json(cliente);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao criar cliente" });
  }
}

module.exports = {
  listarClientes,
  criarCliente
};