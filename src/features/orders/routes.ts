import { FastifyInstance } from 'fastify'
import { OrderController } from './controllers'
import { roleGuard } from '../../utils/role-guard'
import {
  createOrderSchema,
  getOrderSchema,
  cancelOrderSchema,
  listOrdersSchema
} from './schemas'

const controller = new OrderController()

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    schema: createOrderSchema, // ✅ para Swagger e validação
    preHandler: roleGuard(['CUSTOMER']),
    handler: controller.create
  })

  fastify.get('/', {
    schema: listOrdersSchema,
    preHandler: roleGuard(['CUSTOMER']),
    handler: controller.list
  })

  fastify.get('/:id', {
    schema: getOrderSchema, // ✅ para Swagger e validação de params
    preHandler: roleGuard(['CUSTOMER']),
    handler: controller.getById
  })

  fastify.patch('/:id/cancel', {
    schema: cancelOrderSchema, // ✅ para Swagger e validação de params
    preHandler: roleGuard(['CUSTOMER']),
    handler: controller.cancel
  })
}
