/*
“Módulo de Recepción” — alta de pacientes, búsqueda de médicos y consulta de expedientes las hace el recepcionista — así que authorize('RECEPCIONISTA') cubre todas las rutas que construiste el lunes y el martes. MEDICO y GERENCIA los vas a usar recién el jueves y el viernes, en las rutas nuevas de esos días.
*/

import { Router } from "express";
import { getAllDoctors, createDoctor } from "../controllers/doctor.controllers";
import { getDoctorsQuerySchema } from "../schemas/doctor.schema";
import { validateSchema } from "../middlewares/validateSchema";
import { validateCreateDoctor } from "../middlewares/validate-doctor";

const router: Router = Router();

// MARTES: getAllDoctors
// /api/doctors?specialty=Cardiología
/*
POST /api/patients con un correo mal formateado → 400
POST /api/patients con birthDate en el futuro → 400
POST /api/patients con datos válidos → 201
GET /api/doctors sin filtro → todos los médicos con su especialidad
GET /api/doctors?specialty=Pediatría → solo los médicos de esa especialidad
*/

router.get('/', validateSchema(getDoctorsQuerySchema, "query"), getAllDoctors);

router.post('/', validateCreateDoctor, createDoctor)

// router.get('/api/doctors/:id', (req: Request, res: Response) => {
// const doctor = await prisma.curso.findUnique({ where: { id: 1 } });

/* const barato = await prisma.curso.findFirst({
where: { disponible: true, precio: { lt: 400 } },
orderBy: { precio: "asc" },
}); */


export default router;

/* 
POST /api/patients con un correo mal formateado → 400
POST /api/patients con birthDate en el futuro → 400
POST /api/patients con datos válidos → 201
GET /api/doctors sin filtro → todos los médicos con su especialidad
GET /api/doctors?specialty=Pediatría → solo los médicos de esa especialidad
*/