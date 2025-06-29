import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Zod schemas
export const LoginInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const RegisterInput = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole).optional().default('CUSTOMER')
})

export const AuthResponse = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.nativeEnum(UserRole)
    })
})

// Convert to JSON Schema for Swagger
export const loginSchema = {
    tags: ['Auth'],
    body: zodToJsonSchema(LoginInput),
    response: {
        200: zodToJsonSchema(AuthResponse)
    }
}

export const registerSchema = {
    tags: ['Auth'],
    body: zodToJsonSchema(RegisterInput),
    response: {
        201: zodToJsonSchema(AuthResponse)
    }
}