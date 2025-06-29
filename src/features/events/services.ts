import prisma from '../../lib/prisma'
import { z } from 'zod'
import { CreateEventInput, UpdateEventInput, EventResponse, EventListResponse } from './schemas'

export class EventService {
  async create(data: z.infer<typeof CreateEventInput>): Promise<z.infer<typeof EventResponse>> {
    const { name, description, coverImage, startDate, endDate } = data

    const event = await prisma.event.create({
      data: {
        name,
        description,
        coverImage,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    })

    return this.mapEvent(event)
  }

  async update(id: string, data: z.infer<typeof UpdateEventInput>): Promise<z.infer<typeof EventResponse>> {
    const updateData: Record<string, any> = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate)

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    })

    return this.mapEvent(event)
  }

  async getById(id: string): Promise<z.infer<typeof EventResponse>> {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id }
    })

    return this.mapEvent(event)
  }

  async list(): Promise<z.infer<typeof EventListResponse>> {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' }
    })

    return events.map(this.mapEvent)
  }

  private mapEvent(event: any): z.infer<typeof EventResponse> {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? null,
      coverImage: event.coverImage ?? null,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString()
    }
  }
}
