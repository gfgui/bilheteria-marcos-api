import prisma from '../../lib/prisma'
import { z } from 'zod'
import { CreateUserInput, UpdateUserInput, UserListResponse, UserResponse } from './schemas'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export class UserService {
    
  async create(data: z.infer<typeof CreateUserInput>): Promise<z.infer<typeof UserResponse>> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role
      }
    })

    return this.mapUser(user)
  }

  async update(id: string, data: z.infer<typeof UpdateUserInput>): Promise<z.infer<typeof UserResponse>> {
    const user = await prisma.user.update({
      where: { id },
      data
    })

    return this.mapUser(user)
  }

  async getById(id: string): Promise<z.infer<typeof UserResponse>> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id }
    })

    return this.mapUser(user)
  }

  async list(): Promise<z.infer<typeof UserListResponse>> {
    const users = await prisma.user.findMany()
    return users.map(this.mapUser)
  }

  private mapUser(user: { id: string; name: string; email: string; role: string }): z.infer<typeof UserResponse> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any
    }
  }
}
