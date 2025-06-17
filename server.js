const axios = require("axios");
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json());

app.get('/api/templates', (req, res) => {
    const token = req.headers?.authorization;
    const account_id = req.query.account_id;
    const baseURI = req.query.baseURI;

    if(token) {
        axios.get(`${baseURI}/restapi/v2.1/accounts/${account_id}/templates`, { 
            headers: {
                Authorization: `${token}` 
            } 
        }).then(response => {
            res.json(response.data)
        }).catch(err => {
            console.log("Error: ", err);
        });
    }
});

app.get('/api/templates/:templateId', (req, res) => {
    const token = req.headers?.authorization;
    const account_id = req.query.account_id;
    const baseURI = req.query.baseURI;
    const templateId = req.params.templateId;

    if(token) {
        axios.get(`${baseURI}/restapi/v2.1/accounts/${account_id}/templates/${templateId}`, { 
            headers: {
                Authorization: `${token}` 
            } 
        }).then(response => {
            console.log(response.data);
            res.json(response.data)
        }).catch(err => {
            console.log("Error: ", err);
        });
    }
});

app.post('/api/envelopes', async (req, res) => {
  const token = req.headers?.authorization;
  const { account_id, baseURI } = req.query;
  const payload = req.body;

  if (!token || !account_id || !baseURI) {
    return res.status(400).json({
      error: 'Missing token, account ID, or base URI',
      details: {
        token: !!token,
        account_id,
        baseURI,
      },
    });
  }

  try {
    const docusignResponse = await axios.post(
      `${baseURI}/restapi/v2.1/accounts/${account_id}/envelopes`,
      payload,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return res.status(200).json(docusignResponse.data);

  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message || 'Internal Server Error';
    const errorCode = error?.response?.data?.errorCode || 'UNKNOWN_ERROR';

    console.error("DocuSign Error:", {
      status,
      errorCode,
      message,
      payload,
      token,
      account_id,
      baseURI,
    });

    return res.status(status).json({
      errorCode,
      message
    });
  }
});



const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})