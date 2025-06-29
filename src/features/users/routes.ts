import { FastifyInstance } from 'fastify'
import { UserController } from './controllers'
import { UserService } from './services'
import { createUserSchema, updateUserSchema, getUserSchema, listUsersSchema } from './schemas'
import { roleGuard } from '../../utils/role-guard'

export async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService()
  const userController = new UserController(userService)

  fastify.post('/', {
    schema: createUserSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: userController.create
  })

  fastify.put('/:id', {
    schema: updateUserSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: userController.update
  })

  fastify.get('/:id', {
    schema: getUserSchema,
    preHandler: roleGuard(['ADMIN']),
    handler: userController.getById
  })

  fastify.get('/', {
    schema: listUsersSchema,
    //preHandler: roleGuard(['ADMIN']),
    handler: userController.list
  })
}
