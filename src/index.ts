import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import patientRoutes from "./routes/patient.routes";
import doctorRoutes from "./routes/doctor.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Clinica Salud");
});

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
