const express = require("express");
const agendamentoController = require("../controllers/agendamentoController");
const protegerRota = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", agendamentoController.listarAgendamentos);

router.post("/", protegerRota, agendamentoController.criarAgendamento);
router.post("/bloqueios", protegerRota, agendamentoController.bloquearHorario);
router.patch("/:id/status", protegerRota, agendamentoController.atualizarStatusAgendamento);
router.delete("/:id", protegerRota, agendamentoController.excluirAgendamento);

module.exports = router;