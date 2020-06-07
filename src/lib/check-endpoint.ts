import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTask } from './request'

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

interface HasStatus {
  status: number
}

export const checkEndpointStatus = (expected: number) => <R extends HasStatus>(actual: R): E.Either<Failure, R> => {
  return expected === actual.status
    ? E.right(actual)
    : E.left({
      message: `Expected status ${expected} but received status ${actual.status}`
    })
}

export const checkEndpoint: RTE.ReaderTaskEither<CheckEndpointDeps, Failure, Success> = (deps) => {
  const res = pipe(
    getTask(deps.url),
    T.map(checkEndpointStatus(deps.expectations.status))
  )

  return res
}
