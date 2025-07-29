import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import {
  CreateArtistInput,
  UpdateArtistInput
} from './schemas'
import { MusicalArtistService } from './services'

export class ArtistController {
  constructor(private service: typeof MusicalArtistService) {}

  create = async (
    req: FastifyRequest<{ Body: z.infer<typeof CreateArtistInput> }>,
    reply: FastifyReply
  ) => {
    try {
      const artist = await this.service.create(req.body)
      reply.code(201).send(artist)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  update = async (
    req: FastifyRequest<{
      Params: { id: string }
      Body: z.infer<typeof UpdateArtistInput>
    }>,
    reply: FastifyReply
  ) => {
    try {
      const updatedArtist = await this.service.update(req.params.id, req.body)
      reply.send(updatedArtist)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  list = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const artists = await this.service.list()
      reply.send(artists)
    } catch (error) {
      reply.code(500).send({ message: 'Erro desconhecido' })
    }
  }

  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const artist = await this.service.getById(req.params.id)
      if (!artist) {
        return reply.code(404).send({ message: 'Artista não encontrado' })
      }
      reply.send(artist)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(404).send({ message })
    }
  }

  delete = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      await this.service.delete(req.params.id)
      reply.code(204).send()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  associate = async (
    req: FastifyRequest<{ Params: { eventId: string; artistId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      await this.service.associateToEvent(req.params.eventId, req.params.artistId)
      reply.send({ message: 'Artista vinculado com sucesso' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  dissociate = async (
    req: FastifyRequest<{ Params: { eventId: string; artistId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      await this.service.dissociateFromEvent(req.params.eventId, req.params.artistId)
      reply.send({ message: 'Artista desvinculado com sucesso' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }
}