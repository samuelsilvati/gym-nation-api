import fastify from 'fastify'
import cors from '@fastify/cors'
import { exerciseRoutes } from './routes/exercise'
import { groupRoutes } from './routes/group'
import { dayRoutes } from './routes/day'
import { userRoutes } from './routes/user'

const app = fastify()

app.register(exerciseRoutes)
app.register(groupRoutes)
app.register(dayRoutes)
app.register(userRoutes)

app.register(cors, {
  origin: ['http://localhost:3000'],
})

app
  .listen({
    port: 3333,
    host: '192.168.3.3',
  })
  .then(() => {
    console.log('HTTP server running on http://192.168.3.3:3333')
  })
