import { z } from "zod";

export const createDoctorSchema = z.object({
  user_id: z
    .number("el id debe ser un numero")
    .int("el id debe ser un número entero")
    .positive("el id debe ser positivo")
    .min(1, "El ID del cliente debe ser mayor a 0"),
  specialty: z
    .number("el id debe ser un numero")
    .int("el id debe ser un número entero")
    .positive("el id debe ser positivo")
    .min(1, "El ID del cliente debe ser mayor a 0"),
});

export const getDoctorsQuerySchema = z.object({
  specialty: z.string().optional(),
});

export const getDoctorAppointmentsQuerySchema = z.object({
  from: z.coerce
    .date({ message: "La fecha 'from' no tiene un formato válido (use YYYY-MM-DD)" })
    .optional(),
  to: z.coerce
    .date({ message: "La fecha 'to' no tiene un formato válido (use YYYY-MM-DD)" })
    .optional(),
}).refine((datos) => datos.to! >= datos.from!, { message: "La fecha 'to' debe ser posterior o igual a la fecha 'from'", path: ["to"] });

export type GetDoctorsQueryInput = z.infer<typeof getDoctorsQuerySchema>;

export type GetDoctorAppointmentsQueryInput = z.infer<typeof getDoctorAppointmentsQuerySchema>;

export const updateDoctorSchema = createDoctorSchema.partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

