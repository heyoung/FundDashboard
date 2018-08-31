import request from 'request-promise-native'
import { FundNotFoundError, InvalidSecIdError } from './exceptions'

interface FundDetails {
  name: string
}

class Client {
  public async getDetails(secId: string): Promise<FundDetails> {
    if (!secId) {
      throw new InvalidSecIdError()
    }

    // idType defines ids as being morning star IDs i.e Sec IDs
    const uri = `https://lt.morningstar.com/api/rest.svc/9vehuxllxs/securities_details?ids=${secId}&idType=msid&viewIds=CompareAdditional&currencyId=GBP&languageId=en-GB&responseViewFormat=json`

    try {
      const response = await request.get(uri, { json: true })

      if (!response.length) {
        throw new FundNotFoundError()
      }

      const details = response[0]

      return { name: details.name }
    } catch (e) {
      throw e
    }
  }
}

export { Client }
