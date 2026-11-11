import { type Request, type Response } from "express";
import { DoctorModel } from "../models/doctor.model";
import { getDoctorsQuerySchema, type GetDoctorsQueryInput, type GetDoctorAppointmentsQueryInput } from "../schemas/doctor.schema";
import { AppointmentModel } from "../models/appointment.model";

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
        const result = getDoctorsQuerySchema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({ error: "Parámetros de consulta inválidos", detalles: result.error.issues });
        }
        const { specialty } = result.data;
        const doctors = await DoctorModel.getAll(specialty);
        res.status(200).json({ ok: true, data: doctors });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener todos los doctores",
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
// [OK] En el Controlador, lee from y to de req.query, conviértelos a Date con new Date(...) solo si ambos llegan, y pásalos al Modelo. Si no llegan, retorna la agenda completa del médico.
// [OK] GET	/api/doctors/:id/appointments?from=&to=
export type DoctorIdParam = { id: string };

export const getAppointmentsByDoctor = async (req: Request<DoctorIdParam, unknown, unknown, GetDoctorAppointmentsQueryInput>, res: Response) => {
    /*
        #swagger.tags = ['Doctors']
        #swagger.summary = 'Obtener la agenda de citas de un médico por rango de fechas'
        #swagger.description = 'Lista las citas programadas para un médico específico, permitiendo filtrar opcionalmente entre dos fechas (from y to).'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico del médico',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['from'] = {
            in: 'query',
            description: 'Fecha de inicio del filtro (YYYY-MM-DD)',
            required: false,
            type: 'string'
        }
        #swagger.parameters['to'] = {
            in: 'query',
            description: 'Fecha de fin del filtro (YYYY-MM-DD)',
            required: false,
            type: 'string'
        }
    */
    try {
        // const result = getDoctorAppointmentsQuerySchema.safeParse(req.query);
        // if (!result.success) {
        //     return res.status(400).json({
        //         error: "Parámetros de consulta inválidos",
        //         detalles: result.error.format(),
        //     });
        // }

        const doctor_id = Number(req.params.id);
        const { from, to } = req.query;

        const doctor = await DoctorModel.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor no registrado" });
        }

        const fromDate = from && to ? new Date(from) : undefined;
        // const fromDate = from
        // ? new Date(`${from.toISOString().slice(0, 10)}T00:00:00.000Z`)
        // : undefined;
        const toDate = from && to ? new Date(to) : undefined;

        const appointmentsByDoctor = await DoctorModel.getDoctorAgenda(doctor_id, fromDate, toDate);
        res.status(200).json(appointmentsByDoctor);
    } catch (error: any) {
        console.error("Error al obtener la agenda del médico", error);
        res.status(500).json({ error: "Error al obtener la agenda del médico" });
    }
};
// 2. Cómo manejar las fechas; Mi recomendación es que el frontend envíe:
/* const date = new Date(`${appointment_date}T00:00:00.000Z`);
const time = new Date(`1970-01-01T${appointment_time}:00.000Z`); */
// 3. Cómo recuperar los valores; Cuando consultes Prisma:
/* const formattedDate = appointment.appointment_date
    .toISOString()
    .slice(0, 10);

const formattedTime = appointment.appointment_time
    .toISOString()
    .slice(11, 16); */

/* AEA
export const getAppointmentsByDoctor = async (req: Request, res: Response) => {
    // GET	/api/doctors/:id/appointments?from=&to=
    // validate from y to en ZOD
    // si no llegan from y to, retorna la agenda completa del médico 
    const id = Number(req.params.id);
    const { from, to } = req.body;
    if (DoctorModel.findById.length === 0) { res.status(404).json({ message: "Doctor no registrado" }) }
    const appointmentsByDoctor = await AppointmentModel.getDoctorAgenda(id, from, to);
    res.status(200).json(appointmentsByDoctor);
}; */


