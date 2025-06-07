import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const exerciseSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  muscleGroupId: z.number(),
})

export async function exerciseLibRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.post('/exercisesLib', async (request, reply) => {
    try {
      const { name, description, muscleGroupId } = exerciseSchema.parse(
        request.body,
      )
      const exercises = await prisma.exercisesLib.create({
        data: {
          name,
          description,
          muscleGroupId,
        },
      })
      reply.code(201).send(exercises)
      return exercises
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: `Erro ao criar exercício ${error}` })
    }
  })

  app.get('/exercisesLib', async (request, reply) => {
    try {
      const exercises = await prisma.exercisesLib.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      reply.code(200).send(exercises)
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao buscar exercícios' })
    }
  })

  app.get('/exercisesLib-by-group/:id', async (request, reply) => {
    try {
      const muscleGroupIdSchema = z.object({
        id: z.string(),
      })
      const { id } = muscleGroupIdSchema.parse(request.params)
      const exercise = await prisma.exercisesLib.findMany({
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

  app.put('/exerciseLib/:id', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.string(),
      })
      const { id } = idSchema.parse(request.params)
      const { name, description, muscleGroupId } = exerciseSchema.parse(
        request.body,
      )

      let exercises = await prisma.exercisesLib.findUniqueOrThrow({
        where: {
          id,
        },
      })

      exercises = await prisma.exercisesLib.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          muscleGroupId,
        },
      })

      reply.code(201).send(exercises)
      return exercises
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Erro ao editar exercício' })
    }
  })

  app.delete('/exerciseLib/:id', async (request, reply) => {
    try {
      const idSchema = z.object({
        id: z.string(),
      })
      const { id } = idSchema.parse(request.params)

      const exercise = await prisma.exercisesLib.findUniqueOrThrow({
        where: {
          id,
        },
      })
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
}
