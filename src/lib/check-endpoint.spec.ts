import * as E from 'fp-ts/lib/Either'
import { checkEndpoint } from './check-endpoint'

describe('check-endpoint', () => {
  describe('checkEndpoint', () => {
    it('returns a success state', () => {
      expect(E.isRight(checkEndpoint())).toBe(true)
    })
  })
})
