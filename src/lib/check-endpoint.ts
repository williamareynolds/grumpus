import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTask } from './request'
import { assertEndpointStatus } from './assertion'

export type Response = AxiosResponse<unknown>
export type Success = Response

export type Failure = {
  message: string
}

export type Expectations = {
  status: number
}

export type CheckEndpointDeps = {
  url: string,
  expectations: Expectations
}

export const checkEndpoint: RTE.ReaderTaskEither<CheckEndpointDeps, Failure, Success> = (deps) => {
  const res = pipe(
    getTask(deps.url),
    T.map(assertEndpointStatus(deps.expectations.status))
  )

  return res
}
