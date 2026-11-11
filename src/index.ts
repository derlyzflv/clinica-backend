import express, { type Request, type Response, type NextFunction } from "express";

import path from "path";
import fs from "fs";

import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";
import doctorRoutes from "./routes/doctor.routes";
import appointmentRoutes from "./routes/appointment.routes";

import swaggerUi from 'swagger-ui-express';

import { verifyToken } from "./middlewares/auth.middleware.js";

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../src/swagger_output.json"), "utf8"),
);

const app = express();

app.use(cors());
app.use(express.json());

/*
app.get("/", (req: Request, res: Response) => {
    res.send("Clinica Salud");
});
*/
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);

app.use("/api/patients", patientRoutes
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
);
app.use("/api/doctors", doctorRoutes
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
);
app.use("/api/appointments", appointmentRoutes
    /* #swagger.security = [{
        "bearerAuth": []
    }] */
)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
