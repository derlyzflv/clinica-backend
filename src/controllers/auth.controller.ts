import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export async function register(req: Request, res: Response) {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Registrar un nuevo usuario'
        #swagger.description = 'Crea un nuevo usuario en el sistema con su contraseña encriptada y rol asignado.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: { type: "string", example: "Ana Recepción" },
                            email: { type: "string", example: "recepcion@clinicasalud.com" },
                            password: { type: "string", example: "password123" },
                            role: { type: "string", example: "RECEPCIONISTA" }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Usuario registrado correctamente',
            schema: {
                id: 1,
                name: "Ana Recepción",
                email: "recepcion@clinicasalud.com",
                role: "RECEPCIONISTA"
            }
        }
        #swagger.responses[500] = {
            description: 'Error al registrar el usuario'
        }
    */
    try {
        const { name, email, password, role } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword, role },
            select: { id: true, name: true, email: true, role: true }
        });

        res.status(201).json(user)
    } catch {
        res.status(500).json({ message: 'Error al registrar el usuario' })
    }
}

export async function login(req: Request, res: Response) {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Iniciar sesión y obtener token JWT'
        #swagger.description = 'Valida las credenciales del usuario y retorna un token JWT válido por 8 horas.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: { type: "string", example: "recepcion@clinicasalud.com" },
                            password: { type: "string", example: "password123" }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Inicio de sesión exitoso',
            schema: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
        #swagger.responses[401] = {
            description: 'Credenciales inválidas'
        }
        #swagger.responses[500] = {
            description: 'Error al iniciar sesión'
        }
    */
    try {
        const { email, password } = req.body
        const user = await prisma.users.findUnique({ where: { email } })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        )

        res.json({ token })
    } catch {
        res.status(500).json({ message: 'Error al iniciar sesión' })
    }
}