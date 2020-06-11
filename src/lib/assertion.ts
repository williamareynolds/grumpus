import { interpreter, Schema } from 'io-ts/lib/Schema'
import { schemableDecoder } from 'io-ts/lib/Decoder'
import * as E from 'fp-ts/lib/Either'
import {Failure} from './check-endpoint'
import {draw} from 'io-ts/lib/Tree'

interface HasStatus {
  status: number
}

interface HasData<T = unknown> {
  data: T
}

/** Assert that the status code returned from an endpoint matches a certain value. */
export const assertEndpointStatus = (expected: number) =>
  <R extends HasStatus>(actual: R): E.Either<Failure, R> => {
    return expected === actual.status
      ? E.right(actual)
      : E.left({
        message: `Expected status ${expected} but received status ${actual.status}`
      })
  }

/** Assert that data returned from an endpoint matches an io-ts schema. */
export const assertEndpointSchema =
  <S>(s: Schema<S>, d = schemableDecoder, i = interpreter) =>
    <R extends HasData>(actual: R): E.Either<Failure, R> => {
      const res = i(d)(s).decode(actual.data)
      return E.isRight(res)
        ? E.right(actual)
        : E.left({ message: `Schema validation failed: \n\n${draw(res.left)}`})
    }
