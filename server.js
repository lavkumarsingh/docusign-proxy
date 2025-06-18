const express = require("express");
const cors = require("cors");
require("dotenv").config();

const docusignRoutes = require("./routes/docusignRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", docusignRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
