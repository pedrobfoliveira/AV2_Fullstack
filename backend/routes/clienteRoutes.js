const express = require("express");
const clienteController = require("../controllers/clienteController");
const protegerRota = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", clienteController.listarClientes);
router.post("/", protegerRota, clienteController.criarCliente);

module.exports = router;