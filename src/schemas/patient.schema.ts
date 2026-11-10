import { z } from "zod";

export const createPatientSchema = z.object({
  first_name: z
    .string({ message: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  last_name: z
    .string({ message: "El apellido es obligatorio" })
    .trim()
    .min(1, "El apellido no puede estar vacío")
    .max(100, "El apellido no puede exceder 100 caracteres"),
  email: z
    .email("Formato de correo electrónico inválido")
    .trim()
    .toLowerCase()
    .max(255, "El correo no puede exceder 255 caracteres"),
  birth_date: z
    .string({ message: "La fecha de nacimiento es obligatoria" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha inválido (use YYYY-MM-DD)",
    })
    .refine(
      (val) => {
        const inputDate = new Date(val);
        const today = new Date();
        today.setUTCHours(23, 59, 59, 999);
        return inputDate <= today;
      },
      {
        message: "La fecha de nacimiento no puede estar en el futuro",
      }
    ),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;

