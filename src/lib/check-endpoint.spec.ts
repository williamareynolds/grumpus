import * as fc from 'fast-check'
import * as E from 'fp-ts/lib/Either'
import { checkEndpoint, checkEndpointStatus } from './check-endpoint'
import axios from 'axios'


describe('check-endpoint', () => {
  describe('checkEndpointStatus', () => {
    it('returns success when args match', () => {
      fc.assert(fc.property(
        fc.integer(),
        (num) => {
          const expected = {
            status: num
          }
          const actual = checkEndpointStatus(num)(expected)
          expect(E.isRight(actual)).toBe(true)
          E.either.map(actual, r => {
            expect(r).toStrictEqual(expected)
          })
        }
      ))
    })

    it('returns failure when args differ', () => {
      fc.assert(fc.property(
        fc.integer(100, 299),
        fc.record({ status: fc.integer(300, 599) }),
        (a, b) => {
          const actual = checkEndpointStatus(a)(b)
          expect(E.isLeft(actual)).toBe(true)
          E.either.mapLeft(actual, err => {
            expect(err.message).toContain(a.toString(10))
            expect(err.message).toContain(b.status.toString(10))
          })
        }
      ))
    })
  })

  describe('checkEndpoint', () => {
    it('returns a success state', async () => {
      axios.get = jest.fn(async () => ({ status: 200 }) as any)

      const url = 'http://abc.com/api/health'
      const expectations = {
        status: 200
      }
      const actual = await checkEndpoint({ url, expectations })()
      expect(E.isRight(actual))

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(url)
    })
  })
})
