/*
getAllPatients() → prisma.tuModelo.findMany()
createPatient(data) → prisma.tuModelo.create({ data }) — Prisma devuelve el registro creado automáticamente, no necesitas una consulta adicional
getPatientById(id) → prisma.tuModelo.findUnique({ where: { id } }) — retorna null si no existe
*/

import { type Request, type Response } from "express";
import { PatientModel } from "../models/patient.model";

export const getAllPatients = async (req: Request, res: Response) => {
    try {
        const patients = await PatientModel.getAll();
        res.status(200).json({ ok: true, data: patients });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al obtener todos los pacientes",
            detalles: error.mesagge,
        });
    }
};
export const createPatient = async (req: Request, res: Response) => {
    const { first_name, last_name, email, birth_date } = req.body;
    try {
        const userExist = await PatientModel.findByEmail(email);
        if (userExist) {
            return res
                .status(400)
                .json({ error: "ya existe un paciente con ese correo" });
        }
        const newPatient = await PatientModel.create(first_name, last_name, email, birth_date);
        res.status(201).json({ ok: true, data: newPatient });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al crear paciente",
            detalles: error.mesagge
        })
    }
};
export const getPatientById = async (req: Request, res: Response) => {
    const idBuscado = Number(req.params.id);
    if (!idBuscado) {
        return res.status(400).json({
            mensaje: "el id es obligatorio para este endpoint",
        });
    }
    try {
        const patient = await PatientModel.findById(idBuscado);
        if (!patient) {
            return res.status(404).json({
                mensaje: "el usuario con ese id no existe o no fue encontrado",
            });
        }
        res.status(200).json({ ok: true, data: patient });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "error al obtener todos los pacientes",
            detalles: error.mesagge,
        });
    }
};