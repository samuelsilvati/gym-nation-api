import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function groupRoutes(app: FastifyInstance) {
  app.get('/groups', async () => {
    const groups = await prisma.muscleGroup.findMany()

    return groups
  })
}
