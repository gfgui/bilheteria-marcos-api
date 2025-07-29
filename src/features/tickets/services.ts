import prisma from '../../lib/prisma'
import crypto from 'crypto'

export class TicketService {
  static async confirmOrder(orderId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      // Busca pedido com tickets
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        include: {
          tickets: {
            include: {
              ticketType: true
            }
          }
        }
      })
      if (!order) return null

      if (order.status === 'COMPLETED') {
        // Pedido já finalizado, retorna direto
        return order
      }

      if (order.tickets.length === 0) {
        throw new Error('Pedido sem tickets para confirmar')
      }

      // Atualiza status para COMPLETED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' },
        include: {
          tickets: {
            include: {
              ticketType: {
                include: {
                  section: {
                    include: { event: true }
                  }
                }
              }
            }
          }
        }
      })

      return updatedOrder
    })
  }

  static async list(userId: string) {
    return prisma.ticket.findMany({
      where: { order: { userId } },
      include: {
        ticketType: {
          include: {
            section: {
              include: {
                event: true
              }
            }
          }
        },
        order: true
      },
      orderBy: {
        order: { createdAt: 'desc' }
      }
    })
  }
}
