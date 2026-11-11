import { prisma, Prisma } from "../config/prisma.js";

export const DoctorModel = {
    async getAll(specialtyName?: string) {
        // const where: Prisma.doctorsWhereInput = {};
        return prisma.doctors.findMany({
            where: specialtyName
                ? { specialties: { name: { equals: specialtyName, mode: 'insensitive' } } }
                : undefined,
            select: {
                id: true,
                specialties: { select: { name: true } },
                users: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    },
    async create(user_id: number, specialty_id: number) {
        return (await prisma.doctors.create({
            data: {
                user_id,
                specialty_id
            },
            include: {
                specialties: true,
                users: true
            }
        }))
    },

    async findById(id: number) {
        return (await prisma.doctors.findUnique({
            where: { id }
        }))
    },

    // findMany() JUEVES
    // GET	/api/doctors/:id/appointments?from=&to=
    // Agenda del médico, filtrable por rango de fechas — protegido con authorize('MEDICO')
    async getDoctorAgenda(doctor_id: number, from?: Date, to?: Date) {
        const appointments = await prisma.appointments.findMany({
            where: {
                doctor_id,
                ...(from && to ? { appointment_date: { gte: from, lte: to } } : {})
            },
            select: {
                doctors: { select: { users: { select: { name: true } } } },

                id: true,

                patients: { select: { first_name: true, last_name: true } },

                appointment_date: true,
                appointment_time: true,
                status: true,

            },
            orderBy: [
                { appointment_date: 'asc' },
                { appointment_time: 'asc' }
            ]
        });
        return {
            doctors: appointments[0]?.doctors ?? null,
            appointments: appointments.map(({ doctors, ...appointment }) => appointment)
        };
        /* return await prisma.appointments.groupBy({
            by: ['doctor_id'],
            _count: {
                id: true
            }
        }) */
    }
}
/* 
return prisma.tuModeloMedico.findMany({
    where: specialtyName
      ? { tuRelacionEspecialidad: { name: { equals: specialtyName, mode: 'insensitive' } } }
      : undefined,
    include: { tuRelacionEspecialidad: true }
  })
*/
/* export const DoctorModel = {
    async getAll(specialtyName?: string) {
        const where: Prisma.doctorsWhereInput = specialtyName
            ? {
                specialties: {
                    name: {
                        equals: specialtyName,
                        mode: "insensitive",
                    },
                },
            }
            : {};

        return await prisma.doctors.findMany({
            where,
            include: {
                specialties: true,
                users: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    },
}; */