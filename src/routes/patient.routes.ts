/*
“Módulo de Recepción” — alta de pacientes, búsqueda de médicos y consulta de expedientes las hace el recepcionista — así que authorize('RECEPCIONISTA') cubre todas las rutas que construiste el lunes y el martes. MEDICO y GERENCIA los vas a usar recién el jueves y el viernes, en las rutas nuevas de esos días.
*/
import { Router } from "express";
import { validateCreatePatient, validateUpdatePatient } from "../middlewares/validate-patient.js";
import { createPatient, getPatientById, getAllPatients } from "../controllers/patient.controllers.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router: Router = Router();

// authorize('RECEPCIONISTA')
router.get('/', verifyToken, authorize('RECEPCIONISTA'), getAllPatients)
router.post('/', verifyToken, authorize('RECEPCIONISTA'), validateCreatePatient, createPatient)
router.get('/:id', verifyToken, authorize('RECEPCIONISTA'), getPatientById)

export default router;

/*
[
  {
    "first_name": "Carlos",
    "last_name": "Ramirez",
    "email": "carlos.ramirez@gmail.com",
    "birth_date": "1990-05-15T00:00:00.000Z"
  },
  {
    "first_name": "Maria",
    "last_name": "Fernandez",
    "email": "maria.fernandez@gmail.com",
    "birth_date": "1985-08-22T00:00:00.000Z"
  },
  {
    "first_name": "Jose",
    "last_name": "Lopez",
    "email": "jose.lopez@gmail.com",
    "birth_date": "1998-03-10T00:00:00.000Z"
  },
  {
    "first_name": "Ana",
    "last_name": "Torres",
    "email": "ana.torres@gmail.com",
    "birth_date": "1992-11-30T00:00:00.000Z"
  },
  {
    "first_name": "Luis",
    "last_name": "Gonzales",
    "email": "luis.gonzales@gmail.com",
    "birth_date": "1978-01-18T00:00:00.000Z"
  },
  {
    "first_name": "Sofia",
    "last_name": "Mendoza",
    "email": "sofia.mendoza@gmail.com",
    "birth_date": "2000-07-25T00:00:00.000Z"
  },
  {
    "first_name": "Pedro",
    "last_name": "Castillo",
    "email": "pedro.castillo@gmail.com",
    "birth_date": "1988-12-05T00:00:00.000Z"
  }
]
*/