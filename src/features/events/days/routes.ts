import { FastifyInstance } from 'fastify'
import { DayController } from './controllers'
import { DayService } from './services'
import { createDaySchema, updateDaySchema, getDaySchema, listDaysSchema } from './schemas'
import { roleGuard } from '../../../utils/role-guard'

export async function dayRoutes(fastify: FastifyInstance) {
  const dayService = new DayService()
  const dayController = new DayController(dayService)

  fastify.post('/:eventId/days', {
    schema: createDaySchema,
    preHandler: roleGuard(['ADMIN']),
    handler: dayController.create
  })

  fastify.put('/:eventId/days/:dayId', {
    schema: updateDaySchema,
    preHandler: roleGuard(['ADMIN']),
    handler: dayController.update
  })

  fastify.get('/:eventId/days/:dayId', {
    schema: getDaySchema,
    handler: dayController.getById
  })

  fastify.get('/:eventId/days', {
    schema: listDaysSchema,
    handler: dayController.listByEvent
  })
}
