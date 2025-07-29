import { FastifyInstance } from 'fastify'
import { EventController } from './controllers'
import { EventService } from './services'
import { createEventSchema, updateEventSchema, getEventSchema, listEventsSchema } from './schemas'
import { roleGuard } from '../../utils/role-guard'

export async function eventRoutes(fastify: FastifyInstance) {
  const eventService = new EventService()
  const eventController = new EventController(eventService)

  fastify.post('/', {
    schema: createEventSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: eventController.create
  })

  fastify.put('/:id', {
    schema: updateEventSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: eventController.update
  })

  fastify.get('/:id', {
    schema: getEventSchema,
    handler: eventController.getById
  })

  fastify.get('/get/:id', {
    schema: getEventSchema,
    handler: eventController.getById
  })

  fastify.get('/list', {
    schema: listEventsSchema,
    handler: eventController.list
  })

  fastify.delete('/:id', {
    preHandler: roleGuard(['ADMIN']),
    handler: eventController.delete
  })
}
