import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const exerciseSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
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

  app.put('/exercises', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.number(),
      })
      const { id } = idSchema.parse(request.body)
      const { name, description, sets, reps, muscleGroupId, dayOfWeekId } =
        exerciseSchema.parse(request.body)
      const exercises = await prisma.exercise.update({
        where: {
          id,
        },
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
      console.log(error)
      reply.code(500).send({ message: 'Erro ao editar exercício' })
    }
  })

  app.get('/exercises/:id', async (request, reply) => {
    try {
      const muscleGroupIdSchema = z.object({
        id: z.string(),
      })
      const { id } = muscleGroupIdSchema.parse(request.params)
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

  app.delete('/exercise', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.number(),
      })
      const { id } = idSchema.parse(request.body)
      await prisma.exercise.delete({
        where: {
          id,
        },
      })

      reply.code(201).send({ message: 'Exercício deletado' })
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao deletar exercício' })
    }
  })
}
