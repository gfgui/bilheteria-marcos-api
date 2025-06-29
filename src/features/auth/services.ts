import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'
import { RegisterInput, LoginInput, AuthResponse } from './schemas'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const SALT_ROUNDS = 10

export class AuthService {
  private fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async register(data: z.infer<typeof RegisterInput>): Promise<z.infer<typeof AuthResponse>> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (existingUser) {
        throw new Error('Email already exists')
    }

    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role
      }
    })

    const token = this.generateToken(user)
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  }

  async login(data: z.infer<typeof LoginInput>): Promise<z.infer<typeof AuthResponse>> {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) {
      throw new Error('Invalid password')
    }

    const token = this.generateToken(user)
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  }

  private generateToken(user: { id: string; role: string }): string {
    return this.fastify.jwt.sign({
      sub: user.id,
      role: user.role
    })
  }
}