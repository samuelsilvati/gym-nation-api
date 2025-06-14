import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const exerciseSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  sets: z.string(),
  reps: z.string(),
  exercisesLibId: z.string().nullable().default(null),
  muscleGroupId: z.number(),
  dayOfWeekId: z.number(),
})

export async function exerciseRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.post('/exercises', async (request, reply) => {
    try {
      const { traineeId } = request.query as { traineeId?: string }
      const {
        name,
        description,
        sets,
        reps,
        muscleGroupId,
        dayOfWeekId,
        exercisesLibId,
      } = exerciseSchema.parse(request.body)
      const exercises = await prisma.exercise.create({
        data: {
          name,
          description,
          sets,
          reps,
          muscleGroupId,
          dayOfWeekId,
          exercisesLibId,
          userId: traineeId || request.user.sub,
        },
      })
      reply.code(201).send(exercises)
      return exercises
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: `Erro ao criar exercício ${error}` })
    }
  })

  app.get('/exercises-by-day-of-week/:id', async (request, reply) => {
    try {
      const dayOfWeekIdSchema = z.object({
        id: z.string(),
      })
      const { id } = dayOfWeekIdSchema.parse(request.params)
      const { traineeId } = request.query as { traineeId?: string }

      const exercises = await prisma.exercise.findMany({
        where: {
          userId: traineeId || request.user.sub,
          dayOfWeekId: parseInt(id),
        },
        include: {
          dayOfWeek: true,
          ExerciseOrder: true,
          exercisesLib: true,
        },
      })

      const orderedExercises = exercises.sort((a, b) => {
        const orderA = a.ExerciseOrder?.find(
          (order) => order.userId === request.user.sub,
        )?.order
        const orderB = b.ExerciseOrder?.find(
          (order) => order.userId === request.user.sub,
        )?.order

        return (orderA || 0) - (orderB || 0)
      })

      reply.code(200).send(orderedExercises)
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao buscar exercícios' })
    }
  })

  app.put('/exercise/:id', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.string(),
      })
      const { id } = idSchema.parse(request.params)
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
    const muscleGroupIdSchema = z.object({
      id: z.string(),
    })
    const { id } = muscleGroupIdSchema.parse(request.params)
    const { traineeId } = request.query as { traineeId?: string }

    try {
      const exercise = await prisma.exercise.findMany({
        where: {
          muscleGroupId: parseInt(id),
          userId: traineeId || request.user.sub,
        },
        include: {
          exercisesLib: true,
        },
      })

      reply.code(201).send(exercise)
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao buscar exercícios' })
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
      await prisma.exerciseOrder.deleteMany({
        where: {
          exerciseId: id,
        },
      })
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
