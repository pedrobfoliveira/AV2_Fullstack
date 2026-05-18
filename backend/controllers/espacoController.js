const espacoModel = require("../models/espacoModel");

async function listarEspacos(req, res) {
  try {
    const espacos = await espacoModel.listarEspacos();
    res.json(espacos);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao listar espaços" });
  }
}

async function criarEspaco(req, res) {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Nome do espaço é obrigatório" });
    }

    const espaco = await espacoModel.criarEspaco({
      nome,
      descricao
    });

    res.status(201).json(espaco);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao criar espaço" });
  }
}

module.exports = {
  listarEspacos,
  criarEspaco
};