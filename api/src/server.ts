import 'dotenv/config'

import fastify from 'fastify'

import { resolve } from 'node:path'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(require('@fastify/multipart'))

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(require('@fastify/cors'), {
  origin: true, // TODO: specify what addresses can access this api (dev, production, etc)
})

app.register(require('@fastify/jwt'), {
  secret: 'spacetime',
})

app.register(uploadRoutes)
app.register(authRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🔥 HTTP server running on http://localhost:3333')
  })
