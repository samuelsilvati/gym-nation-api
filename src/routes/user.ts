import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { hash } from 'bcrypt'

interface CreateUserRequest {
  id: string
  name: string
  email: string
  password: string
  role: string
  googleId: string
}

interface UpdateUserData {
  name: string
  email?: string
  password?: string
}

export async function userRoutes(app: FastifyInstance) {
  app.post('/signup', async (request, reply) => {
    const { name, email, password, googleId, role } =
      request.body as CreateUserRequest
    if (googleId) {
      return reply.code(200).send(googleId)
    } else {
      const passwordHash = await hash(password, 8)

      const userAlreadyExists = await prisma.user.findFirst({
        where: {
          email,
        },
      })
      if (userAlreadyExists) {
        return reply.code(409).send({ message: 'Usuário já cadastrado' })
      }

      try {
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: passwordHash,
            role,
          },
        })

        reply.code(201).send(newUser)
      } catch (err) {
        reply.code(500).send({ message: 'Erro ao cadastrar usuário' })
      }
    }
  })

  app.get('/users', async (request, reply) => {
    await request.jwtVerify()
    const users = await prisma.user.findMany({
      include: {
        exercise: true,
      },
    })
    return reply.code(200).send(users)
  })

  app.get('/user', async (request, reply) => {
    await request.jwtVerify()
    const id = request.user.sub
    console.log(id)
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    reply.code(200).send(user)
    return user
  })

  app.put('/user', async (request, reply) => {
    await request.jwtVerify()
    const { name, email, password } = request.body as UpdateUserData
    if (name === undefined) {
      return reply.code(400).send({ message: 'Nenhuma informação foi enviada' })
    }
    try {
      const id = request.user.sub
      const updateData: UpdateUserData = {
        name,
      }

      if (name) {
        updateData.email = email
      }

      if (password) {
        updateData.password = await hash(password, 8)
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: updateData,
      })

      reply.code(200).send({ message: 'Editado com sucesso' })
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao editar dados' })
    }
  })

  app.delete('/user', async (request, reply) => {
    await request.jwtVerify()
    try {
      const id = request.user.sub
      await prisma.user.delete({
        where: {
          id,
        },
      })

      reply.code(200).send()
    } catch (err) {
      reply.code(500).send({ message: 'Erro ao apagar cadastro' })
    }
  })
}
