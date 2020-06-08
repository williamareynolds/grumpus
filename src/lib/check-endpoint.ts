import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTask } from './request'
import { interpreter, Schema } from 'io-ts/lib/Schema'
import { schemableDecoder } from 'io-ts/lib/Decoder'

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

interface HasData<T = unknown> {
  data: T
}

export const checkEndpointStatus = (expected: number) => <R extends HasStatus>(actual: R): E.Either<Failure, R> => {
  return expected === actual.status
    ? E.right(actual)
    : E.left({
      message: `Expected status ${expected} but received status ${actual.status}`
    })
}

/**
 * @param s
 * @param d
 * @param i
 */
export const checkEndpointSchema =
  <S>(s: Schema<S>, d = schemableDecoder, i = interpreter) =>
    <R extends HasData>(actual: R) => {
      return E.right({ data: 'success' })
    }

export const checkEndpoint: RTE.ReaderTaskEither<CheckEndpointDeps, Failure, Success> = (deps) => {
  const res = pipe(
    getTask(deps.url),
    T.map(checkEndpointStatus(deps.expectations.status))
  )

  return res
}
