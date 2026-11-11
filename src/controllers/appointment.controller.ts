// En el Controlador, lee from y to de req.query, conviértelos a Date con new Date(...) solo si ambos llegan, y pásalos al Modelo. Si no llegan, retorna la agenda completa del médico.
import type { Request, Response } from "express";
import { AppointmentModel } from "../models/appointment.model";
import { PatientModel } from "../models/patient.model";
import { DoctorModel } from "../models/doctor.model";
import { prisma, Prisma } from "../config/prisma";

export const createAppointment = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Appointments']
        #swagger.summary = "2.1. Programación de citas"
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            patient_id: { type: "number", example: 1 },
                            doctor_id: { type: "number", example: 2 },
                            appointment_date: { type: "string", example: "2026-07-20" },
                            appointment_time: { type: "string", example: "14:30" }
                        }
                    }
                }
            }
        }
    */
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body
    const created_by = req.user!.id; // <-- Obtenido del usuario autenticado (JWT)
    if (!(await PatientModel.findById(Number(patient_id)))) { return res.status(404).json({ message: "Paciente no registrado" }) }
    if (!(await DoctorModel.findById(Number(doctor_id)))) { return res.status(404).json({ message: "Doctor no registrado" }) }
    try {
        const newAppointment = await AppointmentModel.create(patient_id, doctor_id, created_by, appointment_date, appointment_time);
        res.status(201).json(newAppointment);
    } catch (error: any) {
        console.error("Error al crear la cita", error);
        res.status(500).json({ error: error.message });
    }
};

// [OK] PATCH	/api/appointments/:id/status
// [OK] Cambia el estado de una cita — protegido con authorize('MEDICO')
export const updateAppointmentStatus = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Appointments']
        #swagger.summary = "2.3. Gestión de estado"
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: { type: "string", example: "COMPLETADA || CANCELADA" },
                        }
                    }
                }
            }
        }
    */
    const id = Number(req.params.id);
    const { status } = req.body;

    try {
        const statusUpdate = await AppointmentModel.updateStatus(id, status);
        res.status(200).json(statusUpdate);
    } catch (error: any) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res.status(404).json({ message: "Registro de Cita no encontrada" });
            // return null;
        }
        // console.error("Error al actualizar el estado de la cita", error);
        // res.status(500).json({ error: "Error al actualizar el estado de la cita" });
        throw error;
    }

};
/* 
export const updateAppointmentStatus = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const status = req.body.status;
    if (AppointmentModel.findById.length === 0) { res.status(404).json({ message: "Cita no registrada" }) }
    const statusUpdate = await AppointmentModel.updateStatus(id, status)
    res.status(200).json(statusUpdate);
}
*/

export const rentabilidadPorEspecialidad = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Reports']
        #swagger.summary = "3.1. Rentabilidad por área"
        #swagger.responses[200] = {
            description: 'Lista de médicos obtenida correctamente',
            schema: {
                ok: true,
                data: [
                    {
                    "specialty": "Cardiología",
                    "total_appointments": 4
                    },
                    {
                    "specialty": "Dermatología",
                    "total_appointments": 3
                    },
                    {
                    "specialty": "Pediatría",
                    "total_appointments": 1
                    }
                ]
            }
        }
    */
    {

    }
    try {
        const result = await getAppointmentsBySpecialty();
        res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
        console.error("Error al obtener rentabilidad por especialidad", error);
        res.status(500).json({ error: error.message });
    }
}
// Corte operativo diario
export const corteOperativoDiario = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Reports']
        #swagger.summary = "3.2. Corte operativo diario"
    */
    try {
        const { date } = req.query
        const dailyCutoff = await getDailyCutoff(date as string)
        res.status(200).json({ ok: true, data: dailyCutoff });
    } catch (error: any) {
        console.error("Error al obtener el corte operativo diario", error);
        res.status(500).json({ error: error.message });
    }
}

// Rentabilidad por área
export function getAppointmentsBySpecialty() {
    return prisma.$queryRaw`
    SELECT s.name AS specialty, COUNT(a.id)::int AS total_appointments
    FROM appointments a
    INNER JOIN doctors d ON d.id = a.doctor_id
    INNER JOIN specialties s ON s.id = d.specialty_id
    GROUP BY s.name
    ORDER BY total_appointments DESC
  `
}
// Corte operativo diario
export async function getDailyCutoff(date: string) {
    const startOfDay = new Date(`${date}T00:00:00`)
    const endOfDay = new Date(`${date}T23:59:59`)

    return prisma.appointments.groupBy({
        by: ['status'],
        where: {
            appointment_date: { gte: startOfDay, lte: endOfDay },
            status: { in: ['COMPLETADA', 'CANCELADA'] }
        },
        _count: { status: true }
    })
}