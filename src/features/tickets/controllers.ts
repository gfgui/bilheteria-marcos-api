import { FastifyRequest, FastifyReply } from 'fastify'
import { TicketService } from './services'

export class TicketController {
  // Confirma pedido e cria tickets caso ainda não existam
  confirmOrder = async (
    req: FastifyRequest<{ Params: { orderId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const order = await TicketService.confirmOrder(req.params.orderId, req.user.sub)
      if (!order) return reply.code(404).send({ message: 'Pedido não encontrado ou não autorizado' })
      reply.send(order)
    } catch (err) {
      reply.code(400).send({ message: err instanceof Error ? err.message : 'Erro desconhecido' })
    }
  }

  // Lista tickets do usuário
  list = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const tickets = await TicketService.list(req.user.sub)
      reply.send(tickets)
    } catch (err) {
      reply.code(400).send({ message: err instanceof Error ? err.message : 'Erro desconhecido' })
    }
  }
}
