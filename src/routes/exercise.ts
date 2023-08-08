import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  sets: z.string(),
  reps: z.string(),
  muscleGroupId: z.number(),
  dayOfWeekId: z.number(),
})

export async function exerciseRoutes(app: FastifyInstance) {
  app.get('/exercises', async () => {
    const exercises = await prisma.exercise.findMany()

    return exercises
  })

  app.post('/exercises', async (request) => {
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

    return exercises
  })

  app.get('/exercise/:id', async (request) => {
    const { id } = exerciseSchema.parse(request.body)
    const newId = parseInt(id)
    const exercise = await prisma.exercise.findMany({
      where: {
        muscleGroupId: newId,
      },
    })

    return exercise
  })
}
