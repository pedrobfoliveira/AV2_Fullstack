const express = require("express");
const agendamentoController = require("../controllers/agendamentoController");

const router = express.Router();

router.get("/", agendamentoController.listarAgendamentos);
router.post("/", agendamentoController.criarAgendamento);
router.patch("/:id/status", agendamentoController.atualizarStatusAgendamento);
router.delete("/:id", agendamentoController.excluirAgendamento);
router.post("/bloqueios", agendamentoController.bloquearHorario);

module.exports = router;