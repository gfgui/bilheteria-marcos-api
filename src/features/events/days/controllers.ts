import { FastifyRequest, FastifyReply } from 'fastify'
import { DayService } from './services'
import { CreateDayInput, UpdateDayInput } from './schemas'
import { z } from 'zod'

export class DayController {
  constructor(private dayService: DayService) {}

  create = async (
    req: FastifyRequest<{ Params: { eventId: string }, Body: z.infer<typeof CreateDayInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const day = await this.dayService.create(req.params.eventId, req.body)
      reply.code(201).send(day)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  update = async (
    req: FastifyRequest<{ Params: { dayId: string }, Body: z.infer<typeof UpdateDayInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const day = await this.dayService.update(req.params.dayId, req.body)
      reply.send(day)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  getById = async (
    req: FastifyRequest<{ Params: { dayId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const day = await this.dayService.getById(req.params.dayId)
      reply.send(day)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(404).send({ message })
    }
  }

  listByEvent = async (
    req: FastifyRequest<{ Params: { eventId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const days = await this.dayService.listByEvent(req.params.eventId)
      reply.send(days)
    } catch (error) {
      reply.code(500).send({ message: 'Erro desconhecido' })
    }
  }
}
