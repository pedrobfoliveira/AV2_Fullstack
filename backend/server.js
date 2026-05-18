const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clienteRoutes = require("./routes/clienteRoutes");
const espacoRoutes = require("./routes/espacoRoutes");
const agendamentoRoutes = require("./routes/agendamentoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clienteRoutes);
app.use("/api/espacos", espacoRoutes);
app.use("/api/agendamentos", agendamentoRoutes);

app.get("/", (req, res) => {
  res.send("API do AgendaFlow funcionando");
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;