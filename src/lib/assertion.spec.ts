import * as fc from 'fast-check'
import { assertEndpointSchema, assertEndpointStatus } from './assertion'
import * as E from 'fp-ts/lib/Either'
import { make } from 'io-ts/lib/Schema'
import exp from 'constants'

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
  it('returns the response when it successfully decodes a string', () => {
    const s = make(s => s.string)
    const d = {
      data: 'test'
    }
    const actual = assertEndpointSchema(s)(d)
    expect(E.isRight(actual)).toBe(true)
    E.either.map(actual, r => {
      expect(r.data).toBe('test')
    })
  })

  it('returns a Failure with the decode printout if decoding fails', () => {
    const s = make(s => s.string)
    const d = {
      data: 5
    }
    const actual = assertEndpointSchema(s)(d)
    expect(E.isLeft(actual)).toBe(true)
    E.either.mapLeft(actual, r => {
      expect(r.message).toContain('string')
      expect(r.message).toContain('5')
    })
  })

  it('contains all failures when a deeply nested object fails decoding', () => {
    const s = make(s => s.type({
      foo: s.string,
      bar: s.type({
        baz: s.number
      })
    }))
    const d = {
      data: {
        foo: 5,
        bar: {
          baz: 'fizz'
        }
      }
    }
    const actual = assertEndpointSchema(s)(d)
    expect(E.isLeft(actual)).toBe(true)
    E.either.mapLeft(actual, r => {
      expect(r.message).toContain('5')
      expect(r.message).toContain('string')
      expect(r.message).toContain('fizz')
      expect(r.message).toContain('number')
    })
  })
})

