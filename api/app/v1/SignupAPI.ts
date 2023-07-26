import axios from 'axios'
import { SignupType } from '../types/LoginAPI'

export default class SignupAPI {
  static v1 = '/api/ips/v1'

  static signup({ userId, password, email }: SignupType) {
    const data = {
      id: userId,
      password,
      email,
    }

    return axios.post(`${this.v1}/signup`, data)
  }
}
