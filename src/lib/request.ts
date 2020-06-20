import * as TE from 'fp-ts/lib/TaskEither'
import axios, { AxiosResponse } from 'axios'
import {Failure} from './check-endpoint'

type HasMessage = { message: unknown }
type HasStringMessage = { message: string }

/** Return a Task wrapping an axios GET request */
export const getTask =
  <A>(url: string): TE.TaskEither<Failure, AxiosResponse<A>> =>
    TE.tryCatch(
      async () => axios.get<A>(url),
      e =>
        typeof e === 'object'
        && e !== null
        && 'message' in e
        && typeof (e as HasMessage).message === 'string'
          ? { message: (e as HasStringMessage).message }
          : { message: `Could not GET ${url}`}
    )
