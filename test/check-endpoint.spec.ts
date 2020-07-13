import * as E from 'fp-ts/lib/Either'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import {make, TypeOf} from 'io-ts/lib/Schema'
import { checkEndpoint } from '../dist/index'
import {CheckEndpointDeps, Failure} from '../src'

describe('The checkEndpoint function', () => {
  it('fetches and validates data from an api', async () => {
    const postSchema = make(s => s.type({
      id: s.number
    }))

    const deps = {
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      expectations: {
        schema: postSchema,
        status: 200
      }
    }

    await RTE.run(checkEndpoint, deps).then(r => {
      expect(E.isRight(r)).toBe(true)
    })
  })

  it('does not throw an exception for 404', async () => {
    const noneSchema = make(s => s.string)
    type None = TypeOf<typeof noneSchema>

    const deps: CheckEndpointDeps<None> = {
      url: 'https://jsonplaceholder.typicode.com/grumpus/1',
      expectations: {
        schema: noneSchema,
        status: 200
      }
    }

    await RTE.run(checkEndpoint, deps).then(r => {
      expect(E.isLeft(r)).toBe(true)
      expect((r as E.Left<Failure>).left.message).toContain('404')
    })
  })
})
