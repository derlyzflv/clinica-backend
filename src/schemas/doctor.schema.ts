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

export type GetDoctorsQueryInput = z.infer<typeof getDoctorsQuerySchema>;

export const updateDoctorSchema = createDoctorSchema.partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

