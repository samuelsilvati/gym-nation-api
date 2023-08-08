import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function groupRoutes(app: FastifyInstance) {
  app.get('/groups', async (request, reply) => {
    try {
      const groups = await prisma.muscleGroup.findMany()
      reply.code(201).send(groups)
    } catch (error) {
      reply.code(500).send({ message: 'Erro ao buscar exercícios por id' })
    }
  })
}
