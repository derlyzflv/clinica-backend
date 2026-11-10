import { z } from "zod";

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

