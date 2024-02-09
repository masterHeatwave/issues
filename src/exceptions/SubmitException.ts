export default class SubmitException<T, U = string> {
  data: T | null

  id: U | null

  message: string

  name: string

  constructor(message: string, id: U | null = null, data: T | null = null) {
    this.data = data
    this.id = id
    this.message = message
    this.name = 'SubmitException'
  }
}
