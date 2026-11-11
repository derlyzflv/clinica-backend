/*
“Módulo de Recepción” — alta de pacientes, búsqueda de médicos y consulta de expedientes las hace el recepcionista — así que authorize('RECEPCIONISTA') cubre todas las rutas que construiste el lunes y el martes. MEDICO y GERENCIA los vas a usar recién el jueves y el viernes, en las rutas nuevas de esos días.
*/

import { Router } from "express";
import { getAllDoctors, createDoctor } from "../controllers/doctor.controllers";
import { validateCreateDoctor, validateGetDoctorsQuery, validateGetDoctorAppointmentsQuery } from "../middlewares/validate-doctor";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { getAppointmentsByDoctor } from "../controllers/doctor.controllers";

import type { Request, Response } from "express";
import { DoctorModel } from "../models/doctor.model";

const router: Router = Router();

router.get('/:id', verifyToken, authorize('RECEPCIONISTA'), async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Optional']
        #swagger.summary = 'Obtener médico por ID'
    */
    const doctor_id = Number(req.params.id);
    const doctor = await DoctorModel.findById(doctor_id);
    res.status(200).json({ ok: true, data: doctor });
});
// GET	/api/doctors?specialty=Cardiología
// Lista médicos, filtrando por especialidad si se recibe el query string
router.get('/', verifyToken, authorize('RECEPCIONISTA'), validateGetDoctorsQuery, getAllDoctors);
// a criterio
router.post('/', validateCreateDoctor, createDoctor);
// GET	/api/doctors/:id/appointments?from=&to=
// Agenda del médico, filtrable por rango de fechas — protegido con authorize('MEDICO')
router.get('/:id/appointments', verifyToken, authorize('RECEPCIONISTA', 'MEDICO'), validateGetDoctorAppointmentsQuery, getAppointmentsByDoctor);


export default router;

/* MARTES OK
POST /api/patients con un correo mal formateado → 400
POST /api/patients con birthDate en el futuro → 400
POST /api/patients con datos válidos → 201
GET /api/doctors sin filtro → todos los médicos con su especialidad
GET /api/doctors?specialty=Pediatría → solo los médicos de esa especialidad
*/