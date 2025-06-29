import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { CreateDayInput, UpdateDayInput, DayResponse, DayListResponse } from './schemas'

export class DayService {
  async create(eventId: string, data: z.infer<typeof CreateDayInput>): Promise<z.infer<typeof DayResponse>> {
    const day = await prisma.day.create({
      data: { ...data, eventId }
    })

    return this.mapDay(day)
  }

  async update(dayId: string, data: z.infer<typeof UpdateDayInput>): Promise<z.infer<typeof DayResponse>> {
    const day = await prisma.day.update({
      where: { id: dayId },
      data
    })

    return this.mapDay(day)
  }

  async getById(dayId: string): Promise<z.infer<typeof DayResponse>> {
    const day = await prisma.day.findUniqueOrThrow({
      where: { id: dayId }
    })

    return this.mapDay(day)
  }

  async listByEvent(eventId: string): Promise<z.infer<typeof DayListResponse>> {
    const days = await prisma.day.findMany({
      where: { eventId },
      orderBy: { date: 'asc' }
    })

    return days.map(this.mapDay)
  }

  private mapDay(day: any): z.infer<typeof DayResponse> {
    return {
      id: day.id,
      eventId: day.eventId,
      description: day.description,
      date: day.date.toISOString()
    }
  }
}
