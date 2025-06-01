import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { compare } from 'bcrypt'

interface AuthUserRequest {
  email: string
  password: string
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/signin', async (request, reply) => {
    const { email, password } = request.body as AuthUserRequest

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!userAlreadyExists) {
      reply.code(409).send({ message: 'Usuário ou senha incorretos' })
      return
    }

    const passwordMatch = await compare(password, userAlreadyExists?.password)

    if (!passwordMatch) {
      reply.code(401).send({ message: 'Usuário ou senha incorretos' })
    }

    const token = app.jwt.sign(
      {
        name: userAlreadyExists.name,
        role: userAlreadyExists.role,
      },
      {
        sub: userAlreadyExists.id,
        expiresIn: '7 days',
      },
    )

    return {
      name: userAlreadyExists.name,
      sub: userAlreadyExists.id,
      token,
    }
  })
}
