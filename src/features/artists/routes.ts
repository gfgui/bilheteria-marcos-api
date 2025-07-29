import { FastifyInstance } from 'fastify'
import {
  createArtistSchema,
  updateArtistSchema,
  getArtistSchema,
  listArtistsSchema,
  deleteArtistSchema,
  associateArtistSchema,
  dissociateArtistSchema
} from './schemas'
import { ArtistController } from './controllers'
import { MusicalArtistService } from './services'
import { roleGuard } from '../../utils/role-guard'

export async function artistRoutes(fastify: FastifyInstance) {
  const controller = new ArtistController(MusicalArtistService)

  fastify.post('/', {
    schema: createArtistSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: controller.create
  })

  fastify.get('/list', {
    schema: listArtistsSchema,
    handler: controller.list
  })

  fastify.get('/:id', {
    schema: getArtistSchema,
    handler: controller.getById
  })

  fastify.put('/:id', {
    schema: updateArtistSchema,
    handler: controller.update
  })

  fastify.delete('/:id', {
    schema: deleteArtistSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: controller.delete
  })

  fastify.post('/:eventId/associate/:artistId', {
    schema: associateArtistSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: controller.associate
  })

  fastify.delete('/:eventId/dissociate/:artistId', {
    schema: dissociateArtistSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: controller.dissociate
  })
}