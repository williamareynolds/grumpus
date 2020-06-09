import * as E from 'fp-ts/lib/Either'
import {checkEndpoint} from './check-endpoint'
import axios from 'axios'
import {make} from 'io-ts/lib/Schema'

jest.mock('axios', () => ({
  get: jest.fn()
}))

describe('checkEndpoint', () => {
  it('returns a success state', async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => {
      return {
        status: 200,
        data: 'foo'
      }
    })

    const url = 'http://abc.com/api/health'
    const schema = make(s => s.string)
    const expectations = {
      status: 200,
      schema
    }
    const actual = await checkEndpoint({ url, expectations })()
    expect(E.isRight(actual))

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(url)
  })
})
