import * as E from 'fp-ts/lib/Either'
import { checkEndpoint} from './check-endpoint'
import axios from 'axios'


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
