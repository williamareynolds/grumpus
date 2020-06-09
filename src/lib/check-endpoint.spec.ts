import * as E from 'fp-ts/lib/Either'
import {checkEndpoint} from './check-endpoint'
import axios from 'axios'
import {make} from 'io-ts/lib/Schema'


describe('checkEndpoint', () => {
  it('returns a success state', async () => {
    axios.get = jest.fn(async () => ({
      status: 200,
      data: 'foo'
    }) as any)

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
