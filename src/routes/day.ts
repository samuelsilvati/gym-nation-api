import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const daySchema = z.object({
  id: z.string(),
})

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
    const { id } = daySchema.parse(request.params)
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
