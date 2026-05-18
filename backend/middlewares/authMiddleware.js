const jwt = require("jsonwebtoken");

function protegerRota(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não enviado"
    });
  }

  const partes = authHeader.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      erro: "Token inválido"
    });
  }

  const token = partes[1];

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Token expirado ou inválido"
    });
  }
}

module.exports = protegerRota;