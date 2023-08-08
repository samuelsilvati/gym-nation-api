@startuml

class DayOfWeek {
  +id: Int
  +name: String
  +muscleGroups: MuscleGroup[]
}

class MuscleGroup {
  +id: Int
  +name: String
  +exercises: Exercise[]
  +dayOfWeeks: DayOfWeek[]
}

class Exercise {
  +id: Int
  +name: String
  +sets: String
  +reps: String
  +description: String
  -muscleGroupId: Int
  -dayOfWeekId: Int
}

DayOfWeek "1" -- "*" MuscleGroup : contains
MuscleGroup "*" -- "1" DayOfWeek : contained in
MuscleGroup "1" -- "*" Exercise : contains

@enduml


<!-- ![Diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/diagram.md)
 -->
