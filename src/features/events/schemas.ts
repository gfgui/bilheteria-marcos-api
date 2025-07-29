import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Zod Schemas

const TicketTypeInput = z.object({
  name: z.string(),
  price: z.number(),
  totalQuantity: z.number()
})

const VenueSectionInput = z.object({
  name: z.string(),
  capacity: z.number(),
  ticketTypes: z.array(TicketTypeInput)
})

const DayInput = z.object({
  description: z.string(),
  date: z.string().datetime()
})


export const CreateEventInput = z.object({
  name: z.string().min(2),
  description: z.string(),
  coverImage: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  days: z.array(DayInput),
  venueSections: z.array(VenueSectionInput)
})


export const UpdateEventInput = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  coverImage: z.string().url().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  days: z.array(DayInput).optional(),
  venueSections: z.array(VenueSectionInput).optional(),
})

const TicketType = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  totalQuantity: z.number()
})

const VenueSection = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  ticketTypes: z.array(TicketType)
})

const Day = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string()
})

const MusicalArtist = z.object({
  id: z.string(),
  musicalArtist: z.object({
    name: z.string()
  })
})

export const EventResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  coverImage: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  days: z.array(Day),
  venueSections: z.array(VenueSection),
  musicalArtists: z.array(MusicalArtist)
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
