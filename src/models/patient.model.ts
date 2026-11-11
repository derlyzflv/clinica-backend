/*
createPatient(data) → prisma.tuModelo.create({ data }) — Prisma devuelve el registro creado automáticamente, no necesitas una consulta adicional
getAllPatients() → prisma.tuModelo.findMany()
getPatientById(id) → prisma.tuModelo.findUnique({ where: { id } }) — retorna null si no existe
*/
import { prisma, Prisma } from "../lib/prisma";
// Modelo para la tabla de "products"
export const PatientModel = {

    async getAll() {
        try {
            return (await prisma.patients.findMany({
                orderBy: { id: "asc" },
            }));
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") { /* campo único duplicado */ }
                if (error.code === "P2003") { /* instructorId no existe en instructores */ }
            }
            throw error;
        }
    },
    async create(first_name: string, last_name: string, email: string, birth_date: string) {
        const newPatient = await prisma.patients.create({
            data: {
                first_name,
                last_name,
                email,
                birth_date
            }
        });
        return (newPatient);
    },
    async findById(id: number) {
        return (
            await prisma.patients.findUnique({
                where: { id },
                select: {
                    first_name: true,
                    last_name: true,
                    appointments: {
                        select: {
                            id: true, appointment_date: true, appointment_time: true, status: true,
                            doctors: { select: { users: { select: { name: true } } } }
                        }
                    },
                },
            })
        );
    },

    // GET /api/patients/:id
    /*
    async getPatientById(id: number) {
        return prisma.patient.findUnique({
            where: { id },
            include: {
                appointments: {
                    include: { doctor: { include: { specialty: true } } },
                    orderBy: { scheduledAt: 'desc' }
                }
            }
        })
    }
    */
    async findByEmail(email: string) {
        return await prisma.patients.findUnique({
            where: { email }
        })
    }
}