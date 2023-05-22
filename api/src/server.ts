import 'dotenv/config'
import fastify from 'fastify'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(multipart)

app.register(cors, {
  origin: true, // TODO: specify what addresses can access this api (dev, production, etc)
})

app.register(jwt, {
  secret: 'spacetime',
})

app.register(uploadRoutes)
app.register(authRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🔥 HTTP server running on http://localhost:3333')
  })
