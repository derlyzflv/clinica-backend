import { validateSchema } from "./validateSchema.js";
import { createAppointmentSchema, updateAppointmentSchema, appointmentStatusSchema } from "../schemas/appointment.schema.js";

export const validateCreateAppointment = validateSchema(createAppointmentSchema);
export const validateUpdateAppointment = validateSchema(updateAppointmentSchema);
export const validateAppointmentStatus = validateSchema(appointmentStatusSchema);