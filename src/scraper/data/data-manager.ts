import {
  Db,
  InsertOneWriteOpResult,
  MongoClient,
  UpdateWriteOpResult,
} from 'mongodb'
import { Logger, loggers } from 'winston'
import { FundDetails } from './details'
import { CumulativeReturn } from './return'

const MONGO_CONNECTION_URL = 'mongodb://localhost:27017/fund-dashboard'

class DataManager {
  public static async build(db: string): Promise<DataManager> {
    return new DataManager(await MongoClient.connect(MONGO_CONNECTION_URL), db)
  }

  private db: Db
  private client: MongoClient
  private logger: Logger

  constructor(client: MongoClient, db: string) {
    this.db = client.db(db)
    this.client = client
    this.logger = loggers.get('scraper')
  }

  public close(): Promise<void> {
    this.logger.info('Closing mongo client connection')
    return this.client.close()
  }

  public saveDetails(details: FundDetails): Promise<UpdateWriteOpResult> {
    this.logger.info(`Saving fund details: ${details.name}`)
    return this.db
      .collection('details')
      .updateOne({ isin: details.isin }, { $set: details }, { upsert: true })
  }

  public saveCumulativeReturn(
    cumReturn: CumulativeReturn
  ): Promise<UpdateWriteOpResult> {
    this.logger.info(`Saving cumulative return: ${cumReturn.secId}`)
    return this.db
      .collection('returns')
      .updateOne(
        { secId: cumReturn.secId },
        { $set: cumReturn },
        { upsert: true }
      )
  }
}

export { DataManager }
