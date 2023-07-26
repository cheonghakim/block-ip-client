import axios from 'axios'
export default class NewsLetterAPI {
  static v1: string = '/api/ips/v1'

  static getNewsList() {
    return axios.get(`${this.v1}/news`)
  }
}
