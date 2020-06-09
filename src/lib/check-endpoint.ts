import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTask } from './request'
import {assertEndpointSchema, assertEndpointStatus} from './assertion'
import {Schema, TypeOf} from 'io-ts/lib/Schema'

export type Response<R> = AxiosResponse<R>
export type Success<R> = Response<R>

export type Failure = {
  message: string
}

export type Expectations<T> = {
  status: number,
  schema: Schema<T>
}

export type CheckEndpointDeps<T> = {
  url: string,
  expectations: Expectations<T>
}

export const checkEndpoint = <R>(deps: CheckEndpointDeps<R>): TE.TaskEither<Failure, Success<R>> => {
  const res = pipe(
    getTask<TypeOf<typeof deps.expectations.schema>>(deps.url),
    T.map(r => pipe(
      r,
      assertEndpointStatus(deps.expectations.status),
      E.chain(assertEndpointSchema(deps.expectations.schema))
    )),
  )

  return res
}
