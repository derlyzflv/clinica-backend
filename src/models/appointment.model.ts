import { prisma } from "../lib/prisma"

export const AppointmentModel = {
    /* 
    async getAll(specialtyName?: string) {
        return await prisma.appointments.findMany({
            where: specialtyName
                ? { tuRelacionEspecialidad: { name: { equals: specialtyName, mode: 'insensitive' } } }
                : undefined,
            include: { tuRelacionEspecialidad: true }
        })
    },
    */
    // createAppointment(data) - JUEVES
    async create(patient_id: number, doctor_id: number, created_by: number, appointment_date: string, appointment_time: string) {
        return await prisma.appointments.create({
            data: {
                patient_id,
                doctor_id,
                created_by,
                appointment_date: new Date(`${appointment_date}T12:00:00.000Z`),
                appointment_time: new Date(`1970-01-01T${appointment_time}:00.000Z`),
            }
        });
    },

    // PATCH	/api/appointments/:id/status	Cambia el estado de una cita — protegido con authorize('MEDICO')
    async updateStatus(id: number, status: 'COMPLETADA' | 'CANCELADA') {
        return await prisma.appointments.update({
            where: { id },
            data: { status }
        })
    },

    async findById(id: number) {
        return await (prisma.appointments.findFirst({
            where: { id }
        }))
    }

    // Rentabilidad por especialidad
    // GET      /api/reports/appointments-by-specialty
    // Total de citas agrupadas por especialidad — protegido con authorize('GERENCIA')
    /* 
    async getAppointmentsBySpecialty() {
        return prisma.$queryRaw`
            SELECT s.name AS specialty, COUNT(a.id)::int AS total_appointments
            FROM appointments a
            INNER JOIN doctors d ON d.id = a.doctor_id
            INNER JOIN specialties s ON s.id = d.specialty_id
            GROUP BY s.name
            ORDER BY total_appointments DESC
        `
        // si más adelante agregas un filtro (por ejemplo, un rango de fechas), interpólalo directamente en el template — Prisma lo parametriza automáticamente, nunca concatenes el string a mano:
        // prisma.$queryRaw`... WHERE a.scheduled_at >= ${from} ...`

    },
    */
    // Corte operativo diario (≈ 1 hora)
    // GET	/api/reports/daily-cutoff?date=2026-07-16
    // Cuántas citas se completaron y cancelaron ese día — protegido con authorize('GERENCIA')
    /* 
        async getDailyCutoff(date: string) {
            const startOfDay = new Date(`${date}T00:00:00`)
            const endOfDay = new Date(`${date}T23:59:59`)
    
            return prisma.appointment.groupBy({
                by: ['status'],
                where: {
                    scheduledAt: { gte: startOfDay, lte: endOfDay },
                    status: { in: ['COMPLETADA', 'CANCELADA'] }
                },
                _count: { status: true }
            })
        }
     */
}