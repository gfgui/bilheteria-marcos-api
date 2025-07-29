import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    railander: {
      userId: string
      role: string
    }
  }
}

const authPlugin = fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret',
    sign: { expiresIn: '1d' },
  })

  fastify.addHook('onRequest', async (request, reply) => {
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/docs',
      '/api/events/list',
      '/api/events/get'
    ]

    const url = request.raw.url || ''
    const isPublic = publicPaths.some(
      path => url === path || url.startsWith(path + '/'),
    )
    if (isPublic) return

    const token =
      request.cookies.token ||
      request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return reply.code(401).send({ message: 'Token não encontrado' })
    }

    try {
      const decoded = fastify.jwt.verify<{ sub: string; role: string }>(token)
      request.user = decoded
    } catch (err) {
      return reply.code(401).send({ message: 'Token inválido' })
    }
  })
})

export default authPlugin