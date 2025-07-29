import prisma from '../../lib/prisma'

export class MusicalArtistService {
  static async create(data: { name: string }) {
    return prisma.musicalArtist.create({ data })
  }

  static async list() {
    return prisma.musicalArtist.findMany({ orderBy: { name: 'asc' } })
  }

  static async getById(id: string) {
    return prisma.musicalArtist.findUnique({ where: { id } })
  }

  static async update(id: string, data: { name?: string }) {
    return prisma.musicalArtist.update({
      where: { id },
      data,
    })
  }

  static async delete(id: string) {
    return prisma.musicalArtist.delete({ where: { id } })
  }

  static async associateToEvent(eventId: string, musicalArtistId: string) {
    return prisma.musicalArtistOnEvent.create({
      data: {
        eventId,
        musicalArtistId,
      },
    })
  }

  static async dissociateFromEvent(eventId: string, musicalArtistId: string) {
    return prisma.musicalArtistOnEvent.delete({
      where: {
        eventId_musicalArtistId: {
          eventId,
          musicalArtistId,
        },
      },
    })
  }
}