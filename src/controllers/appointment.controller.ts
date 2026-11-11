// En el Controlador, lee from y to de req.query, conviértelos a Date con new Date(...) solo si ambos llegan, y pásalos al Modelo. Si no llegan, retorna la agenda completa del médico.
import type { Request, Response } from "express";
import { AppointmentModel } from "../models/appointment.model";
import { PatientModel } from "../models/patient.model";
import { DoctorModel } from "../models/doctor.model";
import { Prisma } from "../lib/prisma";

export const createAppointment = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Appointments']
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