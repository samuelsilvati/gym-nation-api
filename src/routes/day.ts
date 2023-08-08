import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

interface DayProps {
  id: string
}

export async function dayRoutes(app: FastifyInstance) {
  app.get('/day', async () => {
    const days = await prisma.dayOfWeek.findMany({
      include: {
        exercises: true,
      },
    })

    return days
  })

  app.get('/day/:id', async (request) => {
    const { id } = request.params as DayProps
    console.log(id)
    const day = await prisma.dayOfWeek.findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
      include: {
        exercises: true,
      },
    })

    return day
  })
}
