import TEntityBase from 'src/structures/entityBase'
import TUser from 'src/structures/user'

type TAssignee = {
  id: number
  userId: string
  user: TUser
} & TEntityBase

export default TAssignee
