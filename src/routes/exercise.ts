import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

interface DayProps {
  id: string
}

interface ExerciseRequestProps {
  name: string
  description: string
  sets: string
  reps: string
  muscleGroupId: number
  dayOfWeekId: number
}

export async function exerciseRoutes(app: FastifyInstance) {
  app.get('/exercises', async () => {
    const exercises = await prisma.exercise.findMany()

    return exercises
  })

  app.post('/exercises', async (request) => {
    const { name, description, sets, reps, muscleGroupId, dayOfWeekId } =
      request.body as ExerciseRequestProps
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
    const { id } = request.params as DayProps
    const newId = parseInt(id)
    const exercise = await prisma.exercise.findMany({
      where: {
        muscleGroupId: newId,
      },
    })

    return exercise
  })
}
