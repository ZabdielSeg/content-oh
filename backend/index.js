import "dotenv/config";

import express from "express";
import orderRoutes from "./routes/orders.routes.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

const ORIGIN = process.env.ORIGIN

const corsOptions = {
  origin: ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.listen(3000);

app.use("/api", orderRoutes);

console.log("Server is listening on port 3000");
