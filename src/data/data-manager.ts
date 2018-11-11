import { Db, MongoClient, UpdateWriteOpResult } from 'mongodb'
import { buildLogger } from '../logging/build-logger'
import { getConnectionUrl } from './connection'
import { FundData } from './fund-data'

const logger = buildLogger('FundDataManager')

const MONGO_CONNECTION_URL = getConnectionUrl()

logger.info(`Connecting to mongo at: ${MONGO_CONNECTION_URL}`)

class FundDataManager {
  public static async build(): Promise<FundDataManager> {
    return new FundDataManager(
      await MongoClient.connect(
        MONGO_CONNECTION_URL,
        { useNewUrlParser: true }
      )
    )
  }

  private db: Db
  private client: MongoClient

  constructor(client: MongoClient) {
    this.client = client
    this.db = client.db()
  }

  public close(): Promise<void> {
    logger.info('Closing mongo client connection')
    return this.client.close()
  }

  public getAllNames(): Promise<string[]> {
    logger.info('Getting all fund names')
    return this.db
      .collection('funds')
      .find()
      .project({ name: 1 })
      .toArray()
  }

  public getByIsin(isin: string): Promise<FundData | null> {
    logger.info(`Getting fund data for isin: ${isin}`)
    return this.db.collection('funds').findOne({ isin })
  }

  public getByName(name: string): Promise<FundData | null> {
    logger.info(`Getting fund data for name: ${name}`)
    return this.db.collection('funds').findOne({ name })
  }

  public getAll(): Promise<FundData[]> {
    logger.info('Getting all fund data')
    return this.db
      .collection('funds')
      .find()
      .toArray()
  }

  public save(data: FundData): Promise<UpdateWriteOpResult> {
    logger.info(`Saving fund data for fund: ${data.name}`)
    return this.db
      .collection('funds')
      .updateOne({ isin: data.isin }, { $set: data }, { upsert: true })
  }
}

export { FundDataManager }
