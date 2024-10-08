const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config(); // Ensure to load environment variables

const app = express();
const port = process.env.PORT || 8080;

// Middleware setup
app.use(
  cors({
    origin: "*",
  })
);
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const User = require("./Routes/Authentication/Login");
const Party = require("./Routes/Party/Party");
const ModelInfo = require("./Routes/ModelInfo/ModelInfo");
const Request = require("./Routes/Request/Request");
const Sales = require("./Routes/Sales/Sales");
const Stocks = require("./Routes/Stock/Stock");
const Payment = require("./Routes/Payment/Payment");
const Notification = require("./Routes/Notification/Notification")
const Migration = require("./Routes/Migration/migration")
const Maintain = require("./Routes/Maintain/Maintain")
const Admin = require("./Routes/Admin/Admin")

app.use("/api/user", User);
app.use("/api/party", Party);
app.use("/api/info", ModelInfo);
app.use("/api/request", Request);
app.use("/api", Sales);
app.use("/api/stocks", Stocks);
app.use("/api/payment", Payment);
app.use("/api", Notification);
app.use("/api", Migration);
app.use("/api",Maintain)
app.use("/api",Admin)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err)); // Use console.error for logging errors

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
