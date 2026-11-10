import { validateSchema } from "./validateSchema.js";
import { createPatientSchema, updatePatientSchema } from "../schemas/patient.schema.js";

export const validateCreatePatient = validateSchema(createPatientSchema);
export const validateUpdatePatient = validateSchema(updatePatientSchema);