import request from 'request-promise-native'
import { buildLogger } from '../../logging/build-logger'

const ENDPOINT = (isin: string) => {
  return `https://lt.morningstar.com/api/rest.svc/9vehuxllxs/security_details/${isin}?viewId=investmentTypeLookup&idtype=isinmic&languageId=en-GB&currencyId=GBP&responseViewFormat=json`
}

const logger = buildLogger('SecidListCrawler')

class SecidListCrawler {
  public async getSecid(isin: string): Promise<string> {
    if (!isin) {
      logger.error('Not ISIN provided')
      return ''
    }

    let response
    try {
      response = await request.get(ENDPOINT(isin), { json: true })
    } catch (e) {
      logger.error(`Error getting secid for ISIN: ${isin}. ${e}`)

      return ''
    }

    if (!response.length) {
      logger.error(`Cannot get secid for ISIN: ${isin}`)
      return ''
    }

    const secid = response[0].Id

    logger.info(`Retrieved secid: ${secid} for ISIN: ${isin}`)

    return secid
  }
}

export { SecidListCrawler }
