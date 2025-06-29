import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Zod Schemas
export const CreateEventInput = z.object({
  name: z.string().min(2),
  description: z.string(),
  coverImage: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
})

export const UpdateEventInput = z.object({
  name: z.string().min(2),
  description: z.string(),
  coverImage: z.string().url().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
})

export const EventResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  coverImage: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string()
})

export const EventListResponse = z.array(EventResponse)

// JSON Schemas for Swagger
export const createEventSchema = {
  tags: ['Events'],
  body: zodToJsonSchema(CreateEventInput),
  response: {
    201: zodToJsonSchema(EventResponse)
  }
}

export const updateEventSchema = {
  tags: ['Events'],
  body: zodToJsonSchema(UpdateEventInput),
  response: {
    200: zodToJsonSchema(EventResponse)
  }
}

export const getEventSchema = {
  tags: ['Events'],
  response: {
    200: zodToJsonSchema(EventResponse)
  }
}

export const listEventsSchema = {
  tags: ['Events'],
  response: {
    200: zodToJsonSchema(EventListResponse)
  }
}
