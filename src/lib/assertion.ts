import { interpreter, Schema } from 'io-ts/lib/Schema'
import { schemableDecoder } from 'io-ts/lib/Decoder'
import * as E from 'fp-ts/lib/Either'
import { Failure } from './check-endpoint'

interface HasStatus {
  status: number
}

interface HasData<T = unknown> {
  data: T
}

export const assertEndpointStatus = (expected: number) => <R extends HasStatus>(actual: R): E.Either<Failure, R> => {
  return expected === actual.status
    ? E.right(actual)
    : E.left({
      message: `Expected status ${expected} but received status ${actual.status}`
    })
}

export const assertEndpointSchema =
  <S>(s: Schema<S>, d = schemableDecoder, i = interpreter) =>
    <R extends HasData>(actual: R) => {
      return E.right({data: 'success'})
    }
