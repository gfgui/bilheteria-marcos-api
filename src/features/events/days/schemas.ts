import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Zod Schemas
export const CreateDayInput = z.object({
  description: z.string().min(2),
  date: z.string().datetime()
})

export const UpdateDayInput = z.object({
  description: z.string().min(2).optional(),
  date: z.string().datetime().optional()
})

export const DayResponse = z.object({
  id: z.string(),
  eventId: z.string(),
  description: z.string(),
  date: z.string()
})

export const DayListResponse = z.array(DayResponse)

// JSON Schemas for Swagger
export const createDaySchema = {
  tags: ['Days'],
  body: zodToJsonSchema(CreateDayInput),
  response: {
    201: zodToJsonSchema(DayResponse)
  }
}

export const updateDaySchema = {
  tags: ['Days'],
  body: zodToJsonSchema(UpdateDayInput),
  response: {
    200: zodToJsonSchema(DayResponse)
  }
}

export const getDaySchema = {
  tags: ['Days'],
  response: {
    200: zodToJsonSchema(DayResponse)
  }
}

export const listDaysSchema = {
  tags: ['Days'],
  response: {
    200: zodToJsonSchema(DayListResponse)
  }
}
