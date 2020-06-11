import * as E from 'fp-ts/lib/Either'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { make } from 'io-ts/lib/Schema'
import { checkEndpoint } from '../dist'

describe('The checkEndpoint function', () => {
  it('fetches and validates data from an api', async () => {
    const schema = make(s => s.type({
      id: s.number
    }))

    const deps = {
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      expectations: {
        schema,
        status: 200
      }
    }

    RTE.run(checkEndpoint, deps).then(r => {
      expect(E.isRight(r)).toBe(true)
    })
  })
})
