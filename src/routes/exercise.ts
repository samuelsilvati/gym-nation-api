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
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
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
          userId: request.user.sub,
        },
      })
      reply.code(201).send(exercises)
      return exercises
    } catch (error) {
      reply.code(500).send({ message: 'Erro ao criar exercício' })
    }
  })

  app.get('/exercises-by-day-of-week/:id', async (request, reply) => {
    try {
      const muscleGroupIdSchema = z.object({
        id: z.string(),
      })
      const { id } = muscleGroupIdSchema.parse(request.params)

      const exercises = await prisma.exercise.findMany({
        where: {
          userId: request.user.sub,
          dayOfWeekId: parseInt(id),
        },
        include: {
          dayOfWeek: true,
        },
      })

      reply.code(201).send(exercises)
    } catch (error) {
      reply.code(500).send({ message: 'Erro ao buscar exercícios' })
    }
  })

  app.put('/exercise/:id', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.string(),
      })
      const { id } = idSchema.parse(request.params)
      console.log(id)
      const { name, description, sets, reps, muscleGroupId, dayOfWeekId } =
        exerciseSchema.parse(request.body)

      let exercises = await prisma.exercise.findUniqueOrThrow({
        where: {
          id,
        },
      })

      if (exercises.userId !== request.user.sub) {
        return reply.code(401).send({ message: 'Unauthorized operation' })
      }

      exercises = await prisma.exercise.update({
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

  app.get('/exercises-by-group/:id', async (request, reply) => {
    try {
      const muscleGroupIdSchema = z.object({
        id: z.string(),
      })
      const { id } = muscleGroupIdSchema.parse(request.params)
      const exercise = await prisma.exercise.findMany({
        where: {
          muscleGroupId: parseInt(id),
          userId: request.user.sub,
        },
      })

      reply.code(201).send(exercise)
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao buscar exercícios por id' })
    }
  })

  app.delete('/exercise/:id', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.string(),
      })
      const { id } = idSchema.parse(request.params)

      const exercise = await prisma.exercise.findUniqueOrThrow({
        where: {
          id,
        },
      })

      if (exercise.userId !== request.user.sub) {
        return reply.code(401).send({ message: 'Unauthorized operation' })
      }
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

  app.post('/exercise-order', async (request, reply) => {
    try {
      const idSchema = z.object({
        exerciseOrder: z.array(z.string()),
      })
      const { exerciseOrder } = idSchema.parse(request.body)
      console.log(exerciseOrder)

      const existingOrders = await prisma.exerciseOrder.findMany({
        where: {
          userId: request.user.sub,
        },
      })

      const updates = exerciseOrder.map((exerciseId, index) => {
        const existingOrder = existingOrders.find(
          (order) => order.exerciseId === exerciseId,
        )

        if (existingOrder) {
          return prisma.exerciseOrder.update({
            where: {
              id: existingOrder.id,
            },
            data: {
              order: index + 1,
            },
          })
        }

        return prisma.exerciseOrder.create({
          data: {
            userId: request.user.sub,
            exerciseId,
            order: index + 1,
          },
        })
      })

      await prisma.$transaction(updates)

      reply.code(201).send({ message: 'Exercício ordenado' })
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao ordenar exercícios' })
    }
  })
}
