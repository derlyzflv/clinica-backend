import { validateSchema } from "./validateSchema.js";
import { createPatientSchema } from "../schemas/patient.schema.js";

export const validateCreatePatient = validateSchema(createPatientSchema);