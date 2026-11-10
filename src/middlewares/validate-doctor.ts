import { validateSchema } from "./validateSchema.js";
import { createDoctorSchema, updateDoctorSchema, getDoctorsQuerySchema } from "../schemas/doctor.schema.js";

export const validateCreateDoctor = validateSchema(createDoctorSchema);
export const validateUpdateDoctor = validateSchema(updateDoctorSchema);