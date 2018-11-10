import { FundDataManager } from '../data/data-manager'
import { FundDataCrawler } from './crawlers/fund-data'
import { FundProviderCrawler } from './crawlers/fund-provider'
import { IsinListCrawler } from './crawlers/isin-list'
import { SecidListCrawler } from './crawlers/secid-list'

class Scraper {
  private fundDataCrawler: FundDataCrawler
  private fundProviderCrawler: FundProviderCrawler
  private isinListCrawler: IsinListCrawler
  private secidListCrawler: SecidListCrawler

  private fundDataManager: FundDataManager

  constructor(fundDataManager: FundDataManager) {
    this.fundDataCrawler = new FundDataCrawler()
    this.fundProviderCrawler = new FundProviderCrawler()
    this.isinListCrawler = new IsinListCrawler()
    this.secidListCrawler = new SecidListCrawler()

    this.fundDataManager = fundDataManager
  }

  public async scrape() {
    const fundProviders = await this.fundProviderCrawler.getFundProviders()

    const pendingPromises: Promise<any>[] = []

    for (const provider of fundProviders) {
      await this.sleep(2000)
      pendingPromises.push(
        this.isinListCrawler
          .getFunds(provider)
          .then(async (isins: string[]) => {
            for (const isin of isins) {
              await this.sleep(1000)
              this.secidListCrawler
                .getSecid(isin)
                .then(async (secid: string) => {
                  await this.sleep(1000)
                  this.fundDataCrawler.getFundData(secid).then(fundata => {
                    if (
                      fundata.secId &&
                      fundata.returns.length &&
                      fundata.isin
                    ) {
                      this.fundDataManager.save(fundata)
                    }
                  })
                })
            }
          })
      )
    }

    await Promise.all(pendingPromises)
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export { Scraper }
