import * as T from 'fp-ts/lib/Task'
import axios, { AxiosResponse } from 'axios'

export const getTask = (url: string): T.Task<AxiosResponse<unknown>> => async () => {
  return axios.get(url)
}
