import { type Request, type Response } from "express";
import { DoctorModel } from "../models/doctor.model";
import type { GetDoctorsQueryInput } from "../schemas/doctor.schema";

export const getAllDoctors = async (req: Request<unknown, unknown, unknown, GetDoctorsQueryInput>, res: Response) => {
    /*
        #swagger.tags = ['Doctors']
        #swagger.summary = 'Listar todos los médicos o filtrar por especialidad'
        #swagger.description = 'Obtiene el directorio de médicos de la clínica incluyendo sus datos de usuario y especialidad.'
        #swagger.parameters['specialty'] = {
            in: 'query',
            description: 'Nombre de la especialidad médica para filtrar (ej. Cardiología, Pediatría)',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Lista de médicos obtenida correctamente',
            schema: {
                ok: true,
                data: [{
                    id: 1,
                    user_id: 2,
                    specialty_id: 1,
                    specialties: {
                        id: 1,
                        name: "Cardiología"
                    },
                    users: {
                        id: 2,
                        name: "Dr. Carlos Mendoza",
                        email: "carlos.mendoza@clinicasalud.com",
                        role: "MEDICO"
                    }
                }]
            }
        }
        #swagger.responses[500] = {
            description: 'Error al obtener todos los doctores'
        }
    */
    try {
        const specialty = req.query.specialty;
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
    /*
        #swagger.tags = ['Doctors']
        #swagger.summary = 'Registrar un nuevo médico'
        #swagger.description = 'Asocia un usuario existente con una especialidad médica en el directorio de doctores.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            user_id: { type: "number", example: 2 },
                            specialty_id: { type: "number", example: 1 }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Médico creado correctamente',
            schema: {
                ok: true,
                data: {
                    id: 1,
                    user_id: 2,
                    specialty_id: 1
                }
            }
        }
        #swagger.responses[400] = {
            description: 'Error de validación o el doctor ya existe'
        }
        #swagger.responses[500] = {
            description: 'Error al crear el doctor'
        }
    */
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