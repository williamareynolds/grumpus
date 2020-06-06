import * as fc from 'fast-check'
import * as i from './index'

describe('add', () => {
  it('is plain addition', () => {
    expect(i.add (1) (2)).toBe(3)
  })

  it('obeys the commutative property', () => {
    fc.assert(fc.property(
      fc.oneof(fc.integer(), fc.float()),
      fc.oneof(fc.integer(), fc.float()),
      (a, b) => {
        return i.add (a) (b) === i.add (b) (a)
      }
    ))
  })
})
