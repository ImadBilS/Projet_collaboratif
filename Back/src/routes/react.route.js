const express = require("express");
const { reactToResource } = require("../controllers/react.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:id/react", authenticateJWT, reactToResource);

module.exports = router;
