import { PrismaClient } from '@prisma/client'

const muscleGroup = [
  { name: 'Peito', id: 1 },
  { name: 'Costas', id: 2 },
  { name: 'Pernas', id: 3 },
  { name: 'Ombros', id: 4 },
  { name: 'Biceps', id: 5 },
  { name: 'Triceps', id: 6 },
  { name: 'Abdominais', id: 7 },
  { name: 'Outros', id: 8 },
]

const daysOfWeek = [
  { name: 'Segunda', id: 1 },
  { name: 'Terca', id: 2 },
  { name: 'Quarta', id: 3 },
  { name: 'Quinta', id: 4 },
  { name: 'Sexta', id: 5 },
  { name: 'Sábado', id: 6 },
  { name: 'Domingo', id: 7 },
]

const prisma = new PrismaClient()

async function main() {
  for (const group of muscleGroup) {
    await prisma.muscleGroup.create({
      data: {
        name: group.name,
        id: group.id,
      },
    })
  }

  for (const day of daysOfWeek) {
    await prisma.dayOfWeek.create({
      data: {
        name: day.name,
        id: day.id,
      },
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
