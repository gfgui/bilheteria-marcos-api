import { FastifyRequest, FastifyReply } from 'fastify'
import { EventService } from './services'
import { CreateEventInput, UpdateEventInput } from './schemas'
import { z } from 'zod'

export class EventController {
  constructor(private eventService: EventService) { }

  create = async (
    req: FastifyRequest<{ Body: z.infer<typeof CreateEventInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const event = await this.eventService.create(req.body)

      reply.code(201).send(event)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }


  update = async (
    req: FastifyRequest<{ Params: { id: string }, Body: z.infer<typeof UpdateEventInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const event = await this.eventService.update(req.params.id, req.body)
      reply.send(event)
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
      const event = await this.eventService.getById(req.params.id)
      reply.send(event)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(404).send({ message })
    }
  }

  list = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const events = await this.eventService.list()
      reply.send(events)
    } catch (error) {
      reply.code(500).send({ message: 'Erro desconhecido' })
    }
  }
}
