import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const CreateUserInput = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).optional().default('CUSTOMER')
})

export const UpdateUserInput = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional()
})

export const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole)
})

export const UserListResponse = z.array(UserResponse)

// JSON Schemas for Swagger
export const createUserSchema = {
  tags: ['Users'],
  body: zodToJsonSchema(CreateUserInput),
  response: {
    201: zodToJsonSchema(UserResponse)
  }
}

export const updateUserSchema = {
  tags: ['Users'],
  body: zodToJsonSchema(UpdateUserInput),
  response: {
    200: zodToJsonSchema(UserResponse)
  }
}

export const getUserSchema = {
  tags: ['Users'],
  response: {
    200: zodToJsonSchema(UserResponse)
  }
}

export const listUsersSchema = {
  tags: ['Users'],
  response: {
    200: zodToJsonSchema(UserListResponse)
  }
}
