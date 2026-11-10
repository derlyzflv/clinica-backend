import { type Request, type Response } from "express";
import { DoctorModel } from "../models/doctor.model";
import type { GetDoctorsQueryInput } from "../schemas/doctor.schema";
// http://localhost:3000/api/doctors
// http://localhost:3000/api/doctors?specialty=Cardiología
export const getAllDoctors = async (req: Request<{}, {}, {}, GetDoctorsQueryInput>, res: Response) => {
    try {
        const { specialty } = req.query
        const doctors = await DoctorModel.getAll(specialty);
        res.status(200).json({ ok: true, data: doctors });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al obtener todos los doctores",
            detalles: error.mesagge,
        });
    }
};

export const createDoctor = async (req: Request, res: Response) => {
    const { user_id, specialty_id } = req.body;
    try {
        const doctorExist = await DoctorModel.findById(user_id);
        if (doctorExist) {
            return res
                .status(400)
                .json({
                    error: "ya existe un paciente con ese correo",
                });
        }
        const newDoctor = await DoctorModel.create(user_id, specialty_id);
        res.status(201).json(
            { ok: true, data: newDoctor }
        )
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al crear el doctor",
            detalles: error.mesagge,
        });
    }

}