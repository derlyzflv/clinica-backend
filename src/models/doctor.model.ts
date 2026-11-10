import { email } from "zod";
import { prisma, Prisma } from "../lib/prisma.js";

export const DoctorModel = {
    async getAll(specialtyName?: string) {
        // const where: Prisma.doctorsWhereInput = {};
        return prisma.doctors.findMany({
            where: specialtyName
                ? { specialties: { name: { equals: specialtyName, mode: 'insensitive' } } }
                : undefined,
            include: {
                specialties: true,
                users: {
                    select: {
                        name: true,
                        email: true,
                        role: true
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

    async findById(user_id: number) {
        return (await prisma.doctors.findUnique({
            where: { user_id }
        }))
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