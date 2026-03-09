const express = require("express");
const {
  reportComment,
  reportReply,
  getAllReports,
  resolveReport,
} = require("../controllers/report.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/comments/:id/report", authenticateJWT, reportComment);
router.post("/replies/:id/report", authenticateJWT, reportReply);

router.get("/", authenticateJWT, getAllReports);
router.patch("/:id", authenticateJWT, resolveReport);

module.exports = router;
