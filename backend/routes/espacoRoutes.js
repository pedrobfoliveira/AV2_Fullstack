const express = require("express");
const espacoController = require("../controllers/espacoController");
const protegerRota = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", espacoController.listarEspacos);
router.post("/", protegerRota, espacoController.criarEspaco);

module.exports = router;