// /api/doctors?specialty=Cardiología
// authorize Citas

/*
“Módulo de Recepción” — alta de pacientes, búsqueda de médicos y consulta de expedientes las hace el recepcionista — así que authorize('RECEPCIONISTA') cubre todas las rutas que construiste el lunes y el martes. MEDICO y GERENCIA los vas a usar recién el jueves y el viernes, en las rutas nuevas de esos días.
*/

import { Router } from 'express'
import { verifyToken } from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { createAppointment, updateAppointmentStatus } from '../controllers/appointment.controller'
import { validateCreateAppointment, validateAppointmentStatus } from '../middlewares/validate-appointment'

const router: Router = Router()

// router.get('/', verifyToken, authorize("MEDICO"), getAppointments)

// POST	/api/appointments	Agenda una cita
// confirma en el Controlador que el paciente y el médico existen (usa los modelos de martes); si alguno no existe, responde 404 en vez de dejar que Prisma lance un error de llave foránea.
// authorize deacuerdo a criterio
router.post('/', verifyToken, authorize("RECEPCIONISTA"), validateCreateAppointment, createAppointment)

// PATCH	/api/appointments/:id/status
// Cambia el estado de una cita — protegido con authorize('MEDICO')
router.patch('/:id/status', verifyToken, authorize("MEDICO"), validateAppointmentStatus, updateAppointmentStatus)

export default router