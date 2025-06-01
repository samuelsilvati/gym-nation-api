import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { exerciseRoutes } from './routes/exercise'
import { groupRoutes } from './routes/group'
import { dayRoutes } from './routes/day'
import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { exerciseLibRoutes } from './routes/exerciseLib'

const app = fastify()

app.register(userRoutes)
app.register(authRoutes)
app.register(dayRoutes)
app.register(groupRoutes)
app.register(exerciseRoutes)
app.register(exerciseLibRoutes)

app.register(cors, {
  origin: [`${process.env.CLIENT_URL}`],
})

app.register(jwt, {
  secret: `${process.env.JWT_SECRET}`,
})

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
