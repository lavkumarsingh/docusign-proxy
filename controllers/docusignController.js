const axios = require("axios");
const logger = require("../utils/logger");

exports.getTemplates = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    const { account_id, baseURI } = req.query;

    if (!token || !account_id || !baseURI) {
      const error = new Error("Missing token, account_id, or baseURI");
      error.statusCode = 400;
      logger.warn("Missing parameters in getTemplates", {
        tokenPresent: !!token,
        account_id,
        baseURI
      });
      throw error;
    }

    logger.info("Fetching templates from DocuSign", { account_id });
    const response = await axios.get(`${baseURI}/restapi/v2.1/accounts/${account_id}/templates`, {
      headers: { Authorization: token },
    });

    logger.info("Templates retrieved successfully", { count: response.data.envelopeTemplates?.length || 0 });
    res.json(response.data);
  } catch (err) {
    logger.error("Error in getTemplates", { message: err.message, stack: err.stack });
    next(err);
  }
};

exports.getTemplateById = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    const { account_id, baseURI } = req.query;
    const templateId = req.params.templateId;

    if (!token || !account_id || !baseURI || !templateId) {
      const error = new Error("Missing required parameters");
      error.statusCode = 400;
      logger.warn("Missing parameters in getTemplateById", {
        tokenPresent: !!token,
        account_id,
        baseURI,
        templateId
      });
      throw error;
    }

    logger.info("Fetching template details", { templateId, account_id });
    const response = await axios.get(
      `${baseURI}/restapi/v2.1/accounts/${account_id}/templates/${templateId}/documents/1/tabs`,
      {
        headers: { Authorization: token },
      }
    );

    logger.info("Template retrieved successfully", { templateName: response.data.name });
    res.json(response.data);
  } catch (err) {
    logger.error("Error in getTemplateById", { message: err.message, stack: err.stack });
    next(err);
  }
};

exports.createEnvelope = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    const { account_id, baseURI } = req.query;
    const payload = req.body;

    if (!token || !account_id || !baseURI) {
      const error = new Error("Missing token, account ID, or base URI");
      error.statusCode = 400;
      logger.warn("Missing parameters in createEnvelope", {
        tokenPresent: !!token,
        account_id,
        baseURI
      });
      throw error;
    }

    logger.info("Creating envelope", {
      account_id,
      templateId: payload.templateId || "N/A",
    });

    console.log("payload", JSON.stringify(payload), `${baseURI}/restapi/v2.1/accounts/${account_id}/envelopes`)
    const response = await axios.post(
      `${baseURI}/restapi/v2.1/accounts/${account_id}/envelopes`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info("Envelope created successfully", {
      envelopeId: response.data.envelopeId,
      status: response.data.status,
    });

    res.status(200).json(response.data);
  } catch (error) {
    logger.error("Error in createEnvelope", {
      message: error?.message,
      code: error?.response?.data?.errorCode,
      status: error?.response?.status,
      stack: error.stack,
    });

    error.statusCode = error?.response?.status || 500;
    error.message = error?.response?.data?.message || error.message;
    error.code = error?.response?.data?.errorCode || "DOCUSIGN_ERROR";
    next(error);
  }
};
