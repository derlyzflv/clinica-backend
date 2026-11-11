import { z } from "zod";

export const createAppointmentSchema = z.object({
  patient_id: z
    .number("el id debe ser un numero")
    .int("el id debe ser un número entero")
    .positive("el id debe ser positivo")
    .min(1, "El ID del cliente debe ser mayor a 0"),
  doctor_id: z
    .number("el id debe ser un numero")
    .int("el id debe ser un número entero")
    .positive("el id debe ser positivo")
    .min(1, "El ID del cliente debe ser mayor a 0"),
  appointment_date: z
    .coerce.date().min(new Date(), 'No puedes agendar una cita en una fecha que ya pasó'),
  appointment_time: z
    .string("La hora de la cita es obligatoria")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (use HH:MM, ej. 09:30)"),
  reason: z
    .string().optional()
})

export const appointmentStatusSchema = z.object({
  status: z.enum(['COMPLETADA', 'CANCELADA'])
})

export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;

export const updateAppointmentSchema = createAppointmentSchema.partial();

// Extraer el tipo de dato para TypeScript desde el schema que creamos
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

/* import { z } from "zod";

export const createAppointmentSchema = z.object({
  patient_id: z
    .number({ message: "El ID del paciente debe ser un número" })
    .int("El ID del paciente debe ser un número entero")
    .positive("El ID del paciente debe ser positivo"),
  doctor_id: z
    .number({ message: "El ID del médico debe ser un número" })
    .int("El ID del médico debe ser un número entero")
    .positive("El ID del médico debe ser positivo"),
  created_by: z
    .number({ message: "El ID del usuario creador debe ser un número" })
    .int()
    .positive()
    .optional(),
  appointment_date: z
    .string({ message: "La fecha de la cita es obligatoria" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha inválido (use YYYY-MM-DD)",
    })
    .refine(
      (val) => {
        const appointmentDay = new Date(val);
        appointmentDay.setUTCHours(0, 0, 0, 0);

        const now = new Date();
        const todayUTC = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );

        return appointmentDay >= todayUTC;
      },
      {
        message: "No se puede agendar una cita en una fecha que ya pasó",
      }
    ),
  appointment_time: z
    .string({ message: "La hora de la cita es obligatoria (HH:MM o HH:MM:SS)" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Formato de hora inválido (use HH:MM) ")
    .optional()
    .default("09:00:00"),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["COMPLETADA", "CANCELADA"], {
    message: "El estado solo puede actualizarse a COMPLETADA o CANCELADA",
  }),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;

 */