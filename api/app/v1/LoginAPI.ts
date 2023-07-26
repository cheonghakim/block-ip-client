import axios from 'axios'
import { LoginType } from '../types/LoginAPI'

export default class LoginAPI {
  static v1 = '/api/ips/v1'

  static login({ userId, password }: LoginType) {
    const data = {
      id: userId,
      password,
    }

    return axios.post(`${this.v1}/login`, data)
  }
}
