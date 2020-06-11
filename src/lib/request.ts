import * as T from 'fp-ts/lib/Task'
import axios, { AxiosResponse } from 'axios'

/** Return a Task wrapping an axios GET request */
export const getTask =
  <A>(url: string): T.Task<AxiosResponse<A>> =>
    async (): Promise<AxiosResponse<A>> => {
      return axios.get<A>(url)
    }