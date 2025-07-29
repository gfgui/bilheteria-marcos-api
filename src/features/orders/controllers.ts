import { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from './services'
import { z } from 'zod'

export class OrderController {
  create = async (
    req: FastifyRequest<{ Body: { ticketTypeIds: string[] } }>,
    reply: FastifyReply
  ) => {
    try {
      const { ticketTypeIds } = req.body
      console.log(ticketTypeIds)
      const order = await OrderService.create(req.user.sub, ticketTypeIds)
      reply.code(201).send(order)
    } catch (err) {
      reply.code(400).send({ message: err instanceof Error ? err.message : 'Erro desconhecido' })
    }
  }

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const orders = await OrderService.list(req.user.sub)
    reply.send(orders)
  }

  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const order = await OrderService.getById(req.params.id, req.user.sub)
    if (!order) return reply.code(404).send({ message: 'Pedido não encontrado' })
    reply.send(order)
  }

  cancel = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const order = await OrderService.cancel(req.params.id, req.user.sub)
    reply.send(order)
  }
}