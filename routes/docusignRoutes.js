const express = require("express");
const router = express.Router();
const {
  getTemplates,
  getTemplateById,
  createEnvelope,
} = require("../controllers/docusignController");

router.get("/templates", getTemplates);
router.get("/templates/:templateId", getTemplateById);
router.post("/envelopes", createEnvelope);

module.exports = router;
