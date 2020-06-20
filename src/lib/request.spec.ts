import * as fc from 'fast-check'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import axios from 'axios'
import {getTask} from './request'

jest.mock('axios', () => ({
  get: jest.fn()
}))

describe('request functions', () => {
  describe('getTask', () => {
    it('safely handles exceptions and provides their message', () => {
      fc.assert(fc.property(
        fc.fullUnicodeString(),
        fc.webUrl(),
        (msg, url) => {
          (axios.get as jest.Mock).mockImplementationOnce((_: string) => {
            throw Error(msg)
          })

          const res = getTask(url)
          const runAssertions = T.task.map(res, e => {
            expect(E.isLeft(e)).toBe(true)
            E.either.mapLeft(e, m => {
              expect(m.message).toBe(msg)
            })
          })
          runAssertions()
        }
      ), { numRuns: 20 })
    })
  })
})
