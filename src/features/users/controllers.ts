import { FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from './services'
import { CreateUserInput, UpdateUserInput } from './schemas'
import { z } from 'zod'

export class UserController {
  constructor(private userService: UserService) {}

  create = async (
    req: FastifyRequest<{ Body: z.infer<typeof CreateUserInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userService.create(req.body)
      reply.code(201).send(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  update = async (
    req: FastifyRequest<{ Params: { id: string }, Body: z.infer<typeof UpdateUserInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userService.update(req.params.id, req.body)
      reply.send(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userService.getById(req.params.id)
      reply.send(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(404).send({ message })
    }
  }

  list = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.userService.list()
      reply.send(result)
    } catch (error) {
      reply.code(500).send({ message: 'Erro desconhecido' })
    }
  }
}
