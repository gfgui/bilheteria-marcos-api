import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const OrderIdParam = z.object({
  id: z.string()
})

export const CreateOrderInput = z.object({
  ticketTypeIds: z.array(z.string()).min(1)
})

const TicketTypeSchema = z.object({
  name: z.string(),
  section: z.object({
    name: z.string(),
    event: z.object({
      name: z.string(),
      startDate: z.string().datetime()
    })
  })
})

const TicketSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  ticketType: TicketTypeSchema
})

const OrderSchema = z.object({
  id: z.string().uuid(),
  totalAmount: z.number(),
  status: z.string(),
  createdAt: z.string().datetime(),
  tickets: z.array(TicketSchema)
})

export const listOrdersSchema = {
  tags: ['Orders'],
  response: {
    200: zodToJsonSchema(z.array(OrderSchema), {
      name: 'ListOrdersResponse'
    })
  }
}

export const createOrderSchema = {
  tags: ['Orders'],
  body: zodToJsonSchema(CreateOrderInput),
  response: {
    201: {
      description: 'Pedido criado com sucesso'
    }
  }
}

export const getOrderSchema = {
  tags: ['Orders'],
  params: zodToJsonSchema(OrderIdParam)
}

export const cancelOrderSchema = {
  tags: ['Orders'],
  params: zodToJsonSchema(OrderIdParam)
}
