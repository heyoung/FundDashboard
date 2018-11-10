import request from 'request-promise-native'
import { buildLogger } from '../../logging/build-logger'

const ENDPOINT =
  'https://www.fidelity.co.uk/product/securities/service/funds/fund-filters-for-search'

const logger = buildLogger('FundProviderCrawler')

class FundProviderCrawler {
  public async getFundProviders(): Promise<string[]> {
    const response = await request.post(ENDPOINT, { json: true })

    if (!response.FundFilters || !response.FundFilters.filters) {
      logger.error('Cannot get fund providers')
      return []
    }

    const filters = response.FundFilters.filters
    const nameFilter = filters.find((filter: any) => filter.id === 'NAME')

    if (!nameFilter) {
      logger.error('Cannot get fund providers')
      return []
    }

    logger.info(`Getting fund providers`)

    const providers = nameFilter.categories.map(
      (category: any) => category.name
    )

    logger.info(`Retrieved ${providers.length} providers`)

    return providers
  }
}

export { FundProviderCrawler }
