import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import prisma from './lib/prisma'
import cors from '@fastify/cors'
import authPlugin from './lib/plugins/auth.plugin'
import swaggerPlugin from './lib/plugins/swagger.plugin'
import { authRoutes } from './features/auth/routes'
import { userRoutes } from './features/users/routes'
import { eventRoutes } from './features/events/routes'
import { dayRoutes } from './features/events/days/routes'
import { artistRoutes } from './features/artists/routes'
import { orderRoutes } from './features/orders/routes'
import { ticketRoutes } from './features/tickets/routes'

const app = fastify({ logger: true })

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'some-secret-string', // para cookies assinados (opcional)
  parseOptions: {} // opções padrão para parsing dos cookies
})

// Health check
app.get('/health', async () => {
  return { status: 'ok' }
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  await app.close()
  process.exit(0)
})

// ✅ Tudo que usa `await` vai dentro do `start()`
const start = async () => {
  try {
    await app.register(cors, {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
    })

    // Register plugins
    await app.register(swaggerPlugin)
    await app.register(authPlugin)

    // Register routes
    await app.register(authRoutes, { prefix: '/api/auth' })
    await app.register(artistRoutes, { prefix: '/api/artists' })
    await app.register(userRoutes, { prefix: '/api/users' })
    await app.register(eventRoutes, { prefix: '/api/events' })
    await app.register(dayRoutes, { prefix: '/api/events' })
    await app.register(orderRoutes, { prefix: '/api/orders' })
    await app.register(ticketRoutes, { prefix: '/api/tickets' })

    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('Server listening on port 3333')
    console.log(`Docs available at http://localhost:3333/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
