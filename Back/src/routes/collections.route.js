const express = require("express");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  getMyCollections,
  upsertCollectionState,
} = require("../controllers/collections.controller");

const router = express.Router();

router.get("/me", authenticateJWT, getMyCollections);
router.patch("/:resourceId", authenticateJWT, upsertCollectionState);

module.exports = router;
