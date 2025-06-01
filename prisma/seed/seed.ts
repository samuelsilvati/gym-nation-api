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

const exercisesLib = [
  {
    name: 'Supino Reto',
    description: 'Exercício para peito',
    muscleGroupId: 1,
  },
  {
    name: 'Puxada Frontal',
    description: 'Exercício para costas',
    muscleGroupId: 2,
  },
  {
    name: 'Agachamento',
    description: 'Exercício para pernas',
    muscleGroupId: 3,
  },
  {
    name: 'Desenvolvimento de Ombros',
    description: 'Exercício para ombros',
    muscleGroupId: 4,
  },
  {
    name: 'Rosca Direta',
    description: 'Exercício para biceps',
    muscleGroupId: 5,
  },
  {
    name: 'Triceps Testa',
    description: 'Exercício para triceps',
    muscleGroupId: 6,
  },
  {
    name: 'Abdominal Crunch',
    description: 'Exercício para abdominais',
    muscleGroupId: 7,
  },
  {
    name: 'Flexão de Braços',
    description: 'Exercício para peito e tríceps',
    muscleGroupId: 1,
  },
  {
    name: 'Remada Curvada',
    description: 'Exercício para costas',
    muscleGroupId: 2,
  },
  { name: 'Leg Press', description: 'Exercício para pernas', muscleGroupId: 3 },
  {
    name: 'Elevação Lateral',
    description: 'Exercício para ombros',
    muscleGroupId: 4,
  },
  {
    name: 'Rosca Martelo',
    description: 'Exercício para biceps',
    muscleGroupId: 5,
  },
  { name: 'Mergulho', description: 'Exercício para triceps', muscleGroupId: 6 },
  {
    name: 'Prancha',
    description: 'Exercício para abdominais',
    muscleGroupId: 7,
  },
  {
    name: 'Barra Fixa',
    description: 'Exercício para costas e biceps',
    muscleGroupId: 2,
  },
  {
    name: 'Stiff',
    description: 'Exercício para pernas e glúteos',
    muscleGroupId: 3,
  },
  {
    name: 'Desenvolvimento Arnold',
    description: 'Exercício para ombros',
    muscleGroupId: 4,
  },
  {
    name: 'Rosca Concentrada',
    description: 'Exercício para biceps',
    muscleGroupId: 5,
  },
  {
    name: 'Triceps Pulley',
    description: 'Exercício para triceps',
    muscleGroupId: 6,
  },
  {
    name: 'Elevação de Pernas',
    description: 'Exercício para abdominais',
    muscleGroupId: 7,
  },
  {
    name: 'Puxada na Barra',
    description: 'Exercício para costas',
    muscleGroupId: 2,
  },
  {
    name: 'Agachamento Frontal',
    description: 'Exercício para pernas',
    muscleGroupId: 3,
  },
  {
    name: 'Desenvolvimento Militar',
    description: 'Exercício para ombros',
    muscleGroupId: 4,
  },
  {
    name: 'Rosca Inversa',
    description: 'Exercício para biceps',
    muscleGroupId: 5,
  },
  {
    name: 'Triceps Francês',
    description: 'Exercício para triceps',
    muscleGroupId: 6,
  },
  {
    name: 'Abdominal Oblíquo',
    description: 'Exercício para abdominais',
    muscleGroupId: 7,
  },
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

  for (const exercise of exercisesLib) {
    await prisma.exercisesLib.create({
      data: {
        name: exercise.name,
        description: exercise.description,
        muscleGroupId: exercise.muscleGroupId,
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
