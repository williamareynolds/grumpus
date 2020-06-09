import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as E from 'fp-ts/lib/Either'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTask } from './request'
import {assertEndpointSchema, assertEndpointStatus} from './assertion'
import {Schema, TypeOf} from 'io-ts/lib/Schema'

export type Response = AxiosResponse<unknown>
export type Success = Response

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

export const checkEndpoint = <T>(deps: CheckEndpointDeps<T>) => {
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
