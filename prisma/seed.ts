// pnpm tsx prisma/seed.ts
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

async function main() {
  console.log("🌱 Iniciando seed de Clínica Salud Integral...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Limpieza previa respetando el orden de las llaves foráneas (ON DELETE RESTRICT)
  await prisma.appointments.deleteMany();
  await prisma.doctors.deleteMany();
  await prisma.specialties.deleteMany();
  await prisma.users.deleteMany();

  // 1. Crear 3 especialidades en la tabla `specialties` (id, name)
  const cardiologia = await prisma.specialties.create({
    data: { name: "Cardiología" },
  });

  const pediatria = await prisma.specialties.create({
    data: { name: "Pediatría" },
  });

  const dermatologia = await prisma.specialties.create({
    data: { name: "Dermatología" },
  });

  // 2. Crear los 6 usuarios con rol MEDICO en `users` y luego sus 6 registros en `doctors` (user_id, specialty_id)
  const doctorsData = [
    // Cardiología (2 médicos)
    {
      name: "Dr. Carlos Mendoza",
      email: "carlos.mendoza@clinicasalud.com",
      specialty_id: cardiologia.id,
    },
    {
      name: "Dra. Elena Ríos",
      email: "elena.rios@clinicasalud.com",
      specialty_id: cardiologia.id,
    },
    // Pediatría (2 médicos)
    {
      name: "Dr. Roberto Gómez",
      email: "roberto.gomez@clinicasalud.com",
      specialty_id: pediatria.id,
    },
    {
      name: "Dra. Lucía Fernández",
      email: "lucia.fernandez@clinicasalud.com",
      specialty_id: pediatria.id,
    },
    // Dermatología (2 médicos)
    {
      name: "Dr. Andrés Silva",
      email: "andres.silva@clinicasalud.com",
      specialty_id: dermatologia.id,
    },
    {
      name: "Dra. Sofía Vargas",
      email: "sofia.vargas@clinicasalud.com",
      specialty_id: dermatologia.id,
    },
  ];

  for (const doc of doctorsData) {
    // Primero creamos el usuario en `users`
    const user = await prisma.users.create({
      data: {
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        role: "MEDICO",
      },
    });

    // Luego creamos el médico en `doctors` con `user_id` y `specialty_id`
    await prisma.doctors.create({
      data: {
        user_id: user.id,
        specialty_id: doc.specialty_id,
      },
    });
  }

  // Opcional: 1 usuario RECEPCIONISTA y 1 GERENCIA para pruebas
  await prisma.users.createMany({
    data: [
      {
        name: "Ana Recepción",
        email: "recepcion@clinicasalud.com",
        password: hashedPassword,
        role: "RECEPCIONISTA",
      },
      {
        name: "Director General",
        email: "gerencia@clinicasalud.com",
        password: hashedPassword,
        role: "GERENCIA",
      },
    ],
  });

  console.log("✅ Seed completado: 3 especialidades y 6 médicos (2 por especialidad) creados.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error ejecutando seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
