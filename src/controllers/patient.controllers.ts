/*
getAllPatients() → prisma.tuModelo.findMany()
createPatient(data) → prisma.tuModelo.create({ data }) — Prisma devuelve el registro creado automáticamente, no necesitas una consulta adicional
getPatientById(id) → prisma.tuModelo.findUnique({ where: { id } }) — retorna null si no existe
*/

import { type Request, type Response } from "express";
import { PatientModel } from "../models/patient.model";

export const getAllPatients = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Patients']
        #swagger.summary = 'Listar todos los pacientes'
        #swagger.description = 'Obtiene la lista completa de pacientes registrados en la clínica.'
        #swagger.responses[200] = {
            description: 'Lista de pacientes',
            schema: {
                ok: true,
                data: [{
                    id: 1,
                    first_name: "Juan",
                    last_name: "Pérez",
                    email: "juan.perez@email.com",
                    birth_date: "1990-05-15T00:00:00.000Z"
                }]
            }
        }
        #swagger.responses[500] = {
            description: 'Error al obtener todos los pacientes'
        }
    */
    try {
        const patients = await PatientModel.getAll();
        res.status(200).json({ ok: true, data: patients });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al obtener todos los pacientes",
            detalles: error.mesagge,
        });
    }
};
export const createPatient = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Patients']
        #swagger.summary = 'Registrar un nuevo paciente'
        #swagger.description = 'Da de alta un paciente nuevo validando formato de correo y que la fecha de nacimiento no sea futura.'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            first_name: { type: "string", example: "Juan" },
                            last_name: { type: "string", example: "Pérez" },
                            email: { type: "string", example: "juan.perez@email.com" },
                            birth_date: { type: "string", example: "1990-05-15" }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Paciente creado correctamente',
            schema: {
                ok: true,
                data: {
                    id: 1,
                    first_name: "Juan",
                    last_name: "Pérez",
                    email: "juan.perez@email.com",
                    birth_date: "1990-05-15T00:00:00.000Z"
                }
            }
        }
        #swagger.responses[400] = {
            description: 'Error de validación en los datos enviados o correo duplicado'
        }
        #swagger.responses[500] = {
            description: 'Error al crear paciente'
        }
    */
    const { first_name, last_name, email, birth_date } = req.body;
    try {
        const userExist = await PatientModel.findByEmail(email);
        if (userExist) {
            return res
                .status(400)
                .json({ error: "ya existe un paciente con ese correo" });
        }
        const newPatient = await PatientModel.create(first_name, last_name, email, birth_date);
        res.status(201).json({ ok: true, data: newPatient });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al crear paciente",
            detalles: error.mesagge
        })
    }
};
export const getPatientById = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Patients']
        #swagger.summary = 'Obtener expediente de paciente por ID'
        #swagger.description = 'Busca y retorna los datos personales de un paciente y el historial completo de sus citas.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico del paciente',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Paciente encontrado',
            schema: {
                ok: true,
                data: {
                    id: 1,
                    first_name: "Juan",
                    last_name: "Pérez",
                    email: "juan.perez@email.com",
                    birth_date: "1990-05-15T00:00:00.000Z",
                    appointments: []
                }
            }
        }
        #swagger.responses[400] = {
            description: 'El ID es obligatorio o inválido'
        }
        #swagger.responses[404] = {
            description: 'Paciente no encontrado'
        }
        #swagger.responses[500] = {
            description: 'Error al obtener el paciente'
        }
    */
    const idBuscado = Number(req.params.id);
    if (!idBuscado) {
        return res.status(400).json({
            mensaje: "el id es obligatorio para este endpoint",
        });
    }
    try {
        const patient = await PatientModel.findById(idBuscado);
        if (!patient) {
            return res.status(404).json({
                mensaje: "el usuario con ese id no existe o no fue encontrado",
            });
        }
        res.status(200).json({ ok: true, data: patient });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al obtener todos los pacientes",
            detalles: error.mesagge,
        });
    }
};