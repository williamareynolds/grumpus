import * as fc from 'fast-check'
import { assertEndpointSchema, assertEndpointStatus } from './assertion'
import * as E from 'fp-ts/lib/Either'
import { make } from 'io-ts/lib/Schema'

describe('assertEndpointStatus', () => {
  it('returns success when args match', () => {
    fc.assert(fc.property(
      fc.integer(),
      (num) => {
        const expected = {
          status: num
        }
        const actual = assertEndpointStatus(num)(expected)
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
        const actual = assertEndpointStatus(a)(b)
        expect(E.isLeft(actual)).toBe(true)
        E.either.mapLeft(actual, err => {
          expect(err.message).toContain(a.toString(10))
          expect(err.message).toContain(b.status.toString(10))
        })
      }
    ))
  })
})

describe('assertEndpointSchema', () => {
  it('returns success', () => {
    const s = make(s => s.string)
    const d = {
      data: 'test'
    }
    const actual = assertEndpointSchema(s)(d)
    expect(E.isRight(actual)).toBe(true)
  })
})

