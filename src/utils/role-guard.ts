// src/utils/roleGuard.ts

import { FastifyRequest, FastifyReply } from 'fastify'

export function roleGuard(allowedRoles: string[]) {
  return (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    if (!request.user) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.code(403).send({ message: 'Forbidden' })
    }

    done()
  }
}
