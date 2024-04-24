const http = require("http");
const mongoose = require("mongoose");

require("dotenv").config();

const app = require("./app");

const { loadPlanetsData } = require("./model/planets.model");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchData } = require("./model/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // MongoDB Connection
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Server Listening at port ${PORT}`);
  });
}

startServer();
