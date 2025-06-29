import { FastifyInstance } from 'fastify'
import { AuthController } from './controllers'
import { loginSchema, registerSchema } from './schemas'
import { AuthService } from './services'
import { roleGuard } from '../../utils/role-guard'

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify)
  const authController = new AuthController(authService)

  fastify.post('/register', {
    schema: registerSchema,
    //preHandler: roleGuard(['ADMIN']),
    handler: authController.register,
  })

  fastify.post('/login', {
    schema: loginSchema,
    handler: authController.login,
  })
}
