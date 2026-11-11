// pnpm tsx prisma/seed-appointments.ts
import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("🌱 Iniciando seed de Pacientes y Citas (appointments)...");

  // 1. Limpiar citas previas
  await prisma.appointments.deleteMany();

  // 2. Buscar el usuario recepcionista (para el campo `created_by`) y los médicos existentes
  const recepcionista = await prisma.users.findFirst({
    where: { role: "RECEPCIONISTA" },
  });

  const doctors = await prisma.doctors.findMany({
    orderBy: { id: "asc" },
  });

  if (!recepcionista || doctors.length === 0) {
    throw new Error(
      "⚠️ Primero debes ejecutar el seed base (`pnpm tsx prisma/seed.ts`) para tener médicos y recepcionista."
    );
  }

  // 3. Asegurar que existan pacientes de prueba (usamos upsert por email para no duplicar si ya creaste algunos)
  const patientsData = [
    {
      first_name: "Carlos",
      last_name: "Ramirez",
      email: "carlos.ramirez@gmail.com",
      birth_date: new Date("1990-05-15"),
    },
    {
      first_name: "Maria",
      last_name: "Fernandez",
      email: "maria.fernandez@gmail.com",
      birth_date: new Date("1985-08-22"),
    },
    {
      first_name: "Jose",
      last_name: "Lopez",
      email: "jose.lopez@gmail.com",
      birth_date: new Date("1998-03-10"),
    },
    {
      first_name: "Ana",
      last_name: "Torres",
      email: "ana.torres@gmail.com",
      birth_date: new Date("1992-11-30"),
    },
  ];

  const patients = [];
  for (const p of patientsData) {
    const patient = await prisma.patients.upsert({
      where: { email: p.email },
      update: {},
      create: p,
    });
    patients.push(patient);
  }

  // 4. Fechas futuras a partir de hoy (para cumplir el CHECK `appointment_date >= CURRENT_DATE`)
  const today = new Date();
  const addDays = (days: number) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() + days);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  // Helper para crear un objeto Date para columnas @db.Time(6)
  const time = (hhmmss: string) => new Date(`1970-01-01T${hhmmss}Z`);

  // 5. Crear citas variadas (distintos médicos, fechas y estados para probar agenda y reportes)
  const appointmentsData = [
    {
      patient_id: patients[0]!.id,
      doctor_id: doctors[0]!.id,
      created_by: recepcionista.id,
      appointment_date: addDays(1),
      appointment_time: time("09:00:00"),
      status: "PROGRAMADA" as const,
    },
    {
      patient_id: patients[1]!.id,
      doctor_id: doctors[0]!.id,
      created_by: recepcionista.id,
      appointment_date: addDays(1),
      appointment_time: time("10:30:00"),
      status: "COMPLETADA" as const,
    },
    {
      patient_id: patients[2]!.id,
      doctor_id: doctors[0]!.id,
      created_by: recepcionista.id,
      appointment_date: addDays(2),
      appointment_time: time("11:00:00"),
      status: "CANCELADA" as const,
    },
    {
      patient_id: patients[3]!.id,
      doctor_id: doctors[1]!.id,
      created_by: recepcionista.id,
      appointment_date: addDays(1),
      appointment_time: time("14:00:00"),
      status: "PROGRAMADA" as const,
    },
    {
      patient_id: patients[0]!.id,
      doctor_id: doctors[2]!.id,
      created_by: recepcionista.id,
      appointment_date: addDays(3),
      appointment_time: time("08:30:00"),
      status: "COMPLETADA" as const,
    },
    {
      patient_id: patients[1]!.id,
      doctor_id: doctors[4]!.id,
      created_by: recepcionista.id,
      appointment_date: addDays(4),
      appointment_time: time("16:00:00"),
      status: "PROGRAMADA" as const,
    },
  ];

  await prisma.appointments.createMany({
    data: appointmentsData,
  });

  console.log(
    `✅ Seed de citas completado: ${patients.length} pacientes asegurados y ${appointmentsData.length} citas creadas.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error ejecutando seed de citas:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

