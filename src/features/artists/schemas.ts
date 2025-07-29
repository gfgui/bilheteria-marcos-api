import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// ======================
// Zod Schemas
// ======================

export const CreateArtistInput = z.object({
  name: z.string().min(2)
})

export const UpdateArtistInput = z.object({
  name: z.string().min(2).optional()
})

export const ArtistResponse = z.object({
  id: z.string(),
  name: z.string()
})

export const ArtistListResponse = z.array(ArtistResponse)

export const EventArtistParams = z.object({
  eventId: z.string(),
  artistId: z.string()
})

export const ArtistIdParam = z.object({
  id: z.string()
})

// ======================
// Fastify Route Schemas
// ======================

export const createArtistSchema = {
  tags: ['Artists'],
  body: zodToJsonSchema(CreateArtistInput),
  response: {
    201: zodToJsonSchema(ArtistResponse)
  }
}

export const updateArtistSchema = {
  tags: ['Artists'],
  body: zodToJsonSchema(UpdateArtistInput),
  params: zodToJsonSchema(ArtistIdParam),
  response: {
    200: zodToJsonSchema(ArtistResponse)
  }
}

export const getArtistSchema = {
  tags: ['Artists'],
  params: zodToJsonSchema(ArtistIdParam),
  response: {
    200: zodToJsonSchema(ArtistResponse)
  }
}

export const listArtistsSchema = {
  tags: ['Artists'],
  response: {
    200: zodToJsonSchema(ArtistListResponse)
  }
}

export const deleteArtistSchema = {
  tags: ['Artists'],
  params: zodToJsonSchema(ArtistIdParam),
  response: {
    204: {
      description: 'Artista deletado com sucesso'
    }
  }
}

export const associateArtistSchema = {
  tags: ['Artists'],
  params: zodToJsonSchema(EventArtistParams),
  response: {
    200: {
      description: 'Artista vinculado com sucesso'
    }
  }
}

export const dissociateArtistSchema = {
  tags: ['Artists'],
  params: zodToJsonSchema(EventArtistParams),
  response: {
    200: {
      description: 'Artista desvinculado com sucesso'
    }
  }
}
