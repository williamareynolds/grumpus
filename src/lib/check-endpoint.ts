import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import axios, { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'

type Response = AxiosResponse<unknown>
type Success = Response

type Failure = {
  message: string
}

type Expectations = {
  status: number
}

type CheckEndpointDeps = {
  url: string,
  expectations: Expectations
}

const getTask = (url: string): T.Task<AxiosResponse<unknown>> => async () => {
  return axios.get(url)
}

interface HasStatus {
  status: number
}

const checkEndpointStatus = (expected: number) => <R extends HasStatus>(actual: R): E.Either<Failure, R> => {
  return expected === actual.status
    ? E.right(actual)
    : E.left({
      message: `Expected status ${expected} but received status ${actual.status}`
    })
}

const checkEndpoint: RTE.ReaderTaskEither<CheckEndpointDeps, Failure, Success> = (deps) => {
  const res = pipe(
    getTask(deps.url),
    T.map(checkEndpointStatus(deps.expectations.status))
  )

  return res
}

export {
  checkEndpoint,
  checkEndpointStatus,
  Failure,
  Success
}
