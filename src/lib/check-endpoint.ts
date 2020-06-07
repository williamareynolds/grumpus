import * as E from 'fp-ts/lib/Either'

const SUCCESS = 'success'
type Success = typeof SUCCESS

type Failure = {
  message: string
}

const checkEndpoint = (): E.Either<Failure, Success> => {
  return E.right(SUCCESS)
}

export {
  checkEndpoint,
  Failure,
  Success
}
