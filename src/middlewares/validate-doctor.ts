import { validateSchema } from "./validateSchema.js";
import { createDoctorSchema, updateDoctorSchema, getDoctorsQuerySchema, getDoctorAppointmentsQuerySchema } from "../schemas/doctor.schema.js";

export const validateCreateDoctor = validateSchema(createDoctorSchema);
export const validateUpdateDoctor = validateSchema(updateDoctorSchema);
export const validateGetDoctorsQuery = validateSchema(getDoctorsQuerySchema, "query");

export const validateGetDoctorAppointmentsQuery = validateSchema(getDoctorAppointmentsQuerySchema, "query");