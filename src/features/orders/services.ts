// src/modules/orders/services.ts
import prisma from '../../lib/prisma'

export class OrderService {
  static async create(userId: string, ticketTypeIds: string[]) {
    return prisma.$transaction(async (tx) => {
      // 1. Busca tipos de tickets e checa disponibilidade
      const ticketTypes = await tx.ticketType.findMany({
        where: { id: { in: ticketTypeIds } },
        include: { tickets: true }
      })

      if (ticketTypes.length !== ticketTypeIds.length) {
        throw new Error('Algum tipo de ticket não encontrado')
      }

      // 2. Verifica se ainda há disponibilidade
      for (const type of ticketTypes) {
        if (type.tickets.length >= type.totalQuantity) {
          throw new Error(`Tipo de ticket "${type.name}" está esgotado`)
        }
      }

      // 3. Calcula total
      const totalAmount = ticketTypes.reduce((sum, type) => sum + Number(type.price), 0)

      // 4. Cria o pedido
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'CONFIRMED'
        }
      })

      // 5. Cria os tickets
      for (const type of ticketTypes) {
        await tx.ticket.create({
          data: {
            orderId: order.id,
            ticketTypeId: type.id,
            code: crypto.randomUUID().slice(0, 8).toUpperCase() // ou um código mais seguro
          }
        })
      }

      return order
    })
  }

  static async list(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        tickets: {
          include: {
            ticketType: {
              include: {
                section: {
                  include: {
                    event: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getById(id: string, userId: string) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: {
        tickets: {
          include: {
            ticketType: {
              include: {
                section: {
                  include: {
                    event: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  static async cancel(id: string, userId: string) {
    return prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })
  }
}
