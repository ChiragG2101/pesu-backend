import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import connectDB from "./config/database";
import errorHandler from "./middleware/errorHandler";
import peopleRoutes from "./routes/people-routes";
import authRoutes from "./routes/auth-route";
import cors from "cors";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(errorHandler);

app.use("/api/people", peopleRoutes);
app.use("/api/auth/", authRoutes);

const swaggerDocument = YAML.load("./swagger.yaml");
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

app.get("/health", (req, res) => {
  res.send("API is UP & Running");
});

export default app;
