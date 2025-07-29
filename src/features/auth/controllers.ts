import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './services'
import { RegisterInput, LoginInput } from './schemas'
import { z } from 'zod'

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    req: FastifyRequest<{ Body: z.infer<typeof RegisterInput> }>,
    reply: FastifyReply
  ) => {
    try {
      console.log(req.user)
      const result = await this.authService.register(req.body)
      reply.code(201).send(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      reply.code(400).send({ message })
    }
  }

  login = async (
  req: FastifyRequest<{ Body: z.infer<typeof LoginInput> }>,
  reply: FastifyReply
) => {
  try {
    const result = await this.authService.login(req.body)

    reply
      .setCookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 dia
      })
      .send({
        user: result.user,
        token: result.token, // opcional, pode remover se quiser
      })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    reply.code(401).send({ message })
  }
}
}
