import * as i from './index'

describe('add', () => {
  it('is plain addition', () => {
    expect(i.add (1) (2)).toBe(3)
  })
})
