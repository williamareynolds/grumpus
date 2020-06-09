import * as T from 'fp-ts/lib/Task'
import axios, { AxiosResponse } from 'axios'

export const getTask =
  <A>(url: string): T.Task<AxiosResponse<A>> =>
    async (): Promise<AxiosResponse<A>> => {
      return axios.get<A>(url)
    }
