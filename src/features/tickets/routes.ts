import { FastifyInstance } from 'fastify'
import { TicketController } from './controllers'
import { roleGuard } from '../../utils/role-guard'
import { confirmOrderSchema } from './schemas'

const controller = new TicketController()

export async function ticketRoutes(fastify: FastifyInstance) {
  fastify.patch(
    '/:orderId/confirm',
    {
      schema: confirmOrderSchema,
      preHandler: roleGuard(['CUSTOMER']),
      handler: controller.confirmOrder
    }
  )

  fastify.get(
    '/',
    {
      preHandler: roleGuard(['CUSTOMER']),
      handler: controller.list
    }
  )
}
