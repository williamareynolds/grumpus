import * as T from 'fp-ts/lib/Task'
import axios, { AxiosResponse } from 'axios'

export const getTask =
  (url: string): T.Task<AxiosResponse<unknown>> =>
    async (): Promise<AxiosResponse<unknown>> => {
      return axios.get(url)
    }
