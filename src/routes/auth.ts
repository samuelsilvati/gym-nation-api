import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { compare, hash } from 'bcrypt'

interface AuthUserRequest {
  email: string
  password: string
}

interface AuthGoogleRequest {
  email: string
  name: string
  googleId: string
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

  app.post('/auth/google', async (request, reply) => {
    try {
      // Valida os dados recebidos do Google via Next-auth
      const { email, name, googleId } = request.body as AuthGoogleRequest
      console.log('Dados recebidos do Google:', { email, name, googleId })

      const existingUser = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      let user = existingUser

      if (!existingUser) {
        const passwordHash = await hash(googleId, 8)
        user = await prisma.user.create({
          data: {
            email,
            name,
            role: 'USER',
            password: passwordHash,
          },
        })
      } else if (!existingUser.password) {
        const passwordHash = await hash(googleId, 8)

        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: passwordHash },
        })
      } else if (existingUser) {
        const passwordMatch = await compare(googleId, existingUser?.password)
        if (!passwordMatch) {
          reply.code(401).send({ message: 'Usuário ou senha incorretos' })
          return
        }
      }

      const token = app.jwt.sign(
        {
          name: user?.name,
          role: user?.role,
        },
        {
          sub: user?.id,
          expiresIn: '7 days',
        },
      )

      return {
        name: user?.name,
        sub: user?.id,
        token,
      }
    } catch (error) {
      reply.code(400).send({ message: 'Erro ao autenticar com Google' })
    }
  })
}
