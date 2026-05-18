const jwt = require("jsonwebtoken");

function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erro: "Email e senha são obrigatórios"
    });
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    senha !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      erro: "Credenciais inválidas"
    });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    mensagem: "Login realizado com sucesso",
    token
  });
}

module.exports = {
  login
};