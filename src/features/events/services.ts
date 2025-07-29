import prisma from '../../lib/prisma'
import { z } from 'zod'
import { CreateEventInput, UpdateEventInput, EventResponse, EventListResponse } from './schemas'

export class EventService {
  async create(data: z.infer<typeof CreateEventInput>): Promise<z.infer<typeof EventResponse>> {
    const {
      name,
      description,
      coverImage,
      startDate,
      endDate,
      days,
      venueSections
    } = data

    const event = await prisma.event.create({
      data: {
        name,
        description,
        coverImage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: {
          create: days.map(day => ({
            description: day.description,
            date: new Date(day.date)
          }))
        },
        venueSections: {
          create: venueSections.map(section => ({
            name: section.name,
            capacity: section.capacity,
            ticketTypes: {
              create: section.ticketTypes.map(ticket => ({
                name: ticket.name,
                price: ticket.price,
                totalQuantity: ticket.totalQuantity
              }))
            }
          }))
        }
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

    // Inicia a transação
    const updatedEvent = await prisma.$transaction(async (prismaTx) => {
      // 1) Apaga os days e venueSections antigos do evento
      await prismaTx.day.deleteMany({ where: { eventId: id } })

      await prismaTx.ticketType.deleteMany({
        where: {
          section: {
            eventId: id
          }
        }
      })

      await prismaTx.venueSection.deleteMany({ where: { eventId: id } })

      // 2) Atualiza o evento básico
      const event = await prismaTx.event.update({
        where: { id },
        data: updateData,
      })

      // 3) Cria novos days (se vierem)
      if (data.days) {
        await prismaTx.day.createMany({
          data: data.days.map((day) => ({
            eventId: id,
            description: day.description,
            date: new Date(day.date),
          })),
        })
      }

      // 4) Cria novos venueSections + ticketTypes (se vierem)
      if (data.venueSections) {
        for (const section of data.venueSections) {
          const createdSection = await prismaTx.venueSection.create({
            data: {
              eventId: id,
              name: section.name,
              capacity: section.capacity,
              ticketTypes: {
                create: section.ticketTypes.map((ticket) => ({
                  name: ticket.name,
                  price: ticket.price,
                  totalQuantity: ticket.totalQuantity,
                })),
              },
            },
          })
        }
      }

      return event
    })

    return this.mapEvent(updatedEvent)
  }

  async getById(id: string): Promise<z.infer<typeof EventResponse>> {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id },
      include: {
        days: true,
        venueSections: {
          include: {
            ticketTypes: true
          }
        },
        musicalArtists: {
          include: {
            musicalArtist: true
          }
        }
      }
    })

    return this.mapEvent(event)
  }

  async list(): Promise<z.infer<typeof EventListResponse>> {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        days: true,
        venueSections: {
          include: {
            ticketTypes: true
          }
        },
        musicalArtists: {
          include: {
            musicalArtist: true
          }
        }
      }
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
      endDate: event.endDate.toISOString(),
      days: event.days?.map((day: any) => ({
        id: day.id,
        description: day.description,
        date: day.date.toISOString()
      })) ?? [],
      venueSections: event.venueSections?.map((section: any) => ({
        id: section.id,
        name: section.name,
        capacity: section.capacity,
        ticketTypes: section.ticketTypes.map((ticket: any) => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price.toNumber(),
          totalQuantity: ticket.totalQuantity
        }))
      })) ?? [],
      musicalArtists: event.musicalArtists?.map((ma: any) => ({
        id: ma.id,
        musicalArtist: {
          name: ma.musicalArtist.name
        }
      })) ?? []
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction(async (prismaTx) => {
      // Apaga os dias relacionados
      await prismaTx.day.deleteMany({ where: { eventId: id } })

      // Apaga ticketTypes relacionados via venueSections
      await prismaTx.ticketType.deleteMany({
        where: {
          section: {
            eventId: id
          }
        }
      })

      // Apaga as venueSections
      await prismaTx.venueSection.deleteMany({ where: { eventId: id } })

      // Apaga as relações musicais (se quiser limpar também)
      await prismaTx.musicalArtistOnEvent.deleteMany({ where: { eventId: id } })

      // Finalmente apaga o evento
      await prismaTx.event.delete({ where: { id } })
    })
  }
}
