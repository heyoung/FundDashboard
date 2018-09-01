import {
  Db,
  InsertOneWriteOpResult,
  MongoClient,
  UpdateWriteOpResult
} from 'mongodb'
import { Logger, loggers } from 'winston'
import { FundData } from './fund-data'

const MONGO_CONNECTION_URL = 'mongodb://localhost:27017/fund-dashboard'

class FundDataManager {
  public static async build(db: string): Promise<FundDataManager> {
    return new FundDataManager(
      await MongoClient.connect(MONGO_CONNECTION_URL),
      db
    )
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

  public save(data: FundData): Promise<UpdateWriteOpResult> {
    this.logger.info(`Saving fund data: ${data.name}`)
    return this.db
      .collection('funds')
      .updateOne({ isin: data.isin }, { $set: data }, { upsert: true })
  }
}

export { FundDataManager }
