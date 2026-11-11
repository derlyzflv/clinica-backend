// /api/doctors?specialty=Cardiología
// authorize Citas

/*
“Módulo de Recepción” — alta de pacientes, búsqueda de médicos y consulta de expedientes las hace el recepcionista — así que authorize('RECEPCIONISTA') cubre todas las rutas que construiste el lunes y el martes. MEDICO y GERENCIA los vas a usar recién el jueves y el viernes, en las rutas nuevas de esos días.
*/

import { Router } from 'express'
import { verifyToken } from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/authorize.middleware'
import { rentabilidadPorEspecialidad, corteOperativoDiario } from '../controllers/appointment.controller'

const router: Router = Router()

// GET	/api/reports/appointments-by-specialty
// Total de citas agrupadas por especialidad — protegido con authorize('GERENCIA')
router.get('/appointments-by-specialty', verifyToken, authorize("GERENCIA"), rentabilidadPorEspecialidad)
// GET	/api/reports/daily-cutoff?date=2026-07-16
// Cuántas citas se completaron y cancelaron ese día — protegido con authorize('GERENCIA')
// ?date=2026-07-16
router.get('/daily-cutoff', verifyToken, authorize("GERENCIA"), corteOperativoDiario)

export default router