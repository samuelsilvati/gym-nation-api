import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const exerciseSchema = z.object({
  name: z.string(),
  description: z.string(),
  sets: z.string(),
  reps: z.string(),
  muscleGroupId: z.number(),
  dayOfWeekId: z.number(),
})

export async function exerciseRoutes(app: FastifyInstance) {
  app.get('/exercises', async (request, reply) => {
    try {
      const exercises = await prisma.exercise.findMany()
      reply.code(201).send(exercises)
    } catch (error) {
      reply.code(500).send({ message: 'Erro ao buscar exercícios' })
    }
  })

  app.post('/exercises', async (request, reply) => {
    try {
      const { name, description, sets, reps, muscleGroupId, dayOfWeekId } =
        exerciseSchema.parse(request.body)
      const exercises = await prisma.exercise.create({
        data: {
          name,
          description,
          sets,
          reps,
          muscleGroupId,
          dayOfWeekId,
        },
      })
      reply.code(201).send(exercises)
      return exercises
    } catch (error) {
      reply.code(500).send({ message: 'Erro ao criar exercício' })
    }
  })

  app.get('/exercises/:id', async (request, reply) => {
    try {
      const daySchema = z.object({
        id: z.string(),
      })
      const { id } = daySchema.parse(request.params)
      const exercise = await prisma.exercise.findMany({
        where: {
          muscleGroupId: parseInt(id),
        },
      })

      reply.code(201).send(exercise)
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao buscar exercícios por id' })
    }
  })
}
