const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const cors = require("cors");

//configure env
dotenv.config();

//database config
connectDB();

// rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
