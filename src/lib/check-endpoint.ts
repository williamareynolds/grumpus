import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTask } from './request'
import {assertEndpointSchema, assertEndpointStatus} from './assertion'
import {Schema, TypeOf} from 'io-ts/lib/Schema'

/** Represents a successfully verified response. */
export type Success<R> = AxiosResponse<R>

/** The type returned when a response fails validation. */
export type Failure = {
  message: string
}

/** The expected features of the response from a tested endpoint. */
export type Expectations<T> = {
  status: number,
  schema: Schema<T>
}

/** The necessary data to provide to test an endpoint. */
export type CheckEndpointDeps<T> = {
  url: string,
  expectations: Expectations<T>
}

/** Assert that the response of an endpoint meets a set of predefined conditions. */
export const checkEndpoint = <R>(deps: CheckEndpointDeps<R>): TE.TaskEither<Failure, Success<R>> => {
  return pipe(
    getTask<TypeOf<typeof deps.expectations.schema>>(deps.url),
    TE.chain(r => TE.fromEither(pipe(
      r,
      assertEndpointStatus(deps.expectations.status),
      E.chain(assertEndpointSchema(deps.expectations.schema))
    ))),
  )
}
