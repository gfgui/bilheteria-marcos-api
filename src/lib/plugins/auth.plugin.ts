import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    cookies: Record<string, string>;
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
    const publicPaths = ['/api/auth/login', '/api/auth/register', '/docs', '/api/users', '/api/events']
    const url = request.raw.url || ''

    const isPublic = publicPaths.some(path => url === path || url.startsWith(path + '/'))
    if (isPublic) return

    const token = request.cookies.token;

    if (!token) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    try {
      await request.jwtVerify()

    } catch (err) {
      reply.code(401).send({ message: 'Unauthorized' })
    }
  })
})

export default authPlugin
