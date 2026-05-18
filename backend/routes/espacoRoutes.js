const express = require("express");
const espacoController = require("../controllers/espacoController");

const router = express.Router();

router.get("/", espacoController.listarEspacos);
router.post("/", espacoController.criarEspaco);

module.exports = router;