import { FundDataManager } from '../data/data-manager'
import { buildLogger } from '../logging/build-logger'
import { Scraper } from './scraper'
; (async function main() {
  const logger = buildLogger('Scraper')
  const manager: FundDataManager = await FundDataManager.build()

  const scraper = new Scraper(manager)

  logger.info('=== STARTING SCRAPE ===')

  await scraper.scrape()
  await manager.close()

  logger.info('=== FINISHED SCRAPE ===')
})()
