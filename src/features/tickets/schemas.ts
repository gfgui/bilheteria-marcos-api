import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const OrderIdParam = z.object({
  orderId: z.string().uuid()
})

export const listTicketsSchema = {
  tags: ['Tickets'],
  response: {
    200: zodToJsonSchema(
      z.array(
        z.object({
          id: z.string().uuid(),
          code: z.string(),
          ticketType: z.object({
            id: z.string().uuid(),
            name: z.string(),
            price: z.number(),
            section: z.object({
              id: z.string().uuid(),
              name: z.string(),
              event: z.object({
                id: z.string().uuid(),
                name: z.string(),
                startDate: z.string().datetime()
              })
            })
          }),
          order: z.object({
            id: z.string().uuid(),
            status: z.string(),
            createdAt: z.string().datetime()
          })
        })
      ),
      { name: 'ListTicketsResponse' }
    )
  }
}

export const confirmOrderSchema = {
  tags: ['Tickets'],
  params: zodToJsonSchema(OrderIdParam)
}
